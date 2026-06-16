using System.IO;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using KocRestaurant.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Configure CORS dynamically from Configuration (allowing localhost in dev, kocrestaurant.com in prod)
var allowedOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for HttpOnly refresh token cookies
    });
});

// 3. Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings.GetValue<string>("Secret");
if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
{
    throw new InvalidOperationException("JwtSettings:Secret must be configured and at least 32 characters long.");
}

var issuer = jwtSettings.GetValue<string>("Issuer") ?? "KocRestaurant.Server";
var audience = jwtSettings.GetValue<string>("Audience") ?? "KocRestaurant.Client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        ClockSkew = TimeSpan.Zero // Remove standard 5 minutes leeway
    };
});

// 4. Configure Rate Limiting Policies for Security (Login and Contact messages)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Login Policy: Max 5 attempts per minute per IP
    options.AddPolicy("loginPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 5,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));

    // Contact form policy: Max 1 message per 1 minute per IP
    options.AddPolicy("contactPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 1,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
});

builder.Services.AddControllers();

var app = builder.Build();

// CORS MUST be the very first middleware so preflight OPTIONS always get headers
app.UseCors("CorsPolicy");

// 5. Configure Static Directory for Image Uploads
var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadDir))
{
    Directory.CreateDirectory(uploadDir);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadDir),
    RequestPath = "/uploads"
});

// Serve standard static files (like favicon, default media) from wwwroot if exists
app.UseStaticFiles();

// Configure the HTTP request pipeline.

// Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

// app.UseHttpsRedirection(); // Handled by IIS to avoid infinite redirection loops

app.UseRateLimiter(); // Apply Rate Limiter middleware

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 6. Database auto-creation and seeding at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    // Step A: Ensure database and base tables exist
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Database EnsureCreated completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "EnsureCreatedAsync failed. The app will still start.");
    }

    // Step B: Patch missing tables/columns (isolated so app always starts)
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.ExecuteSqlRawAsync(@"
            CREATE TABLE IF NOT EXISTS ""Users"" (
                ""Id"" uuid PRIMARY KEY,
                ""Username"" varchar(50) NOT NULL,
                ""Email"" varchar(100) NOT NULL DEFAULT '',
                ""PasswordHash"" varchar(255) NOT NULL,
                ""Role"" varchar(20) NOT NULL DEFAULT 'Admin',
                ""RefreshToken"" varchar(255) NOT NULL DEFAULT '',
                ""RefreshTokenExpiryTime"" timestamp with time zone NULL
            );

            ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Email"" varchar(100) NOT NULL DEFAULT '';
            ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""RefreshToken"" varchar(255) NOT NULL DEFAULT '';
            ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""RefreshTokenExpiryTime"" timestamp with time zone NULL;

            CREATE TABLE IF NOT EXISTS ""HeroSlides"" (
                ""Id"" uuid PRIMARY KEY,
                ""Title"" varchar(200) NOT NULL,
                ""Description"" varchar(1000) NOT NULL,
                ""ImageUrl"" varchar(1000) NOT NULL,
                ""DisplayOrder"" integer NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS ""GalleryItems"" (
                ""Id"" uuid PRIMARY KEY,
                ""ImageUrl"" varchar(1000) NOT NULL,
                ""Caption"" varchar(200) NOT NULL DEFAULT '',
                ""Category"" varchar(50) NOT NULL DEFAULT 'General',
                ""DisplayOrder"" integer NOT NULL DEFAULT 0
            );
        ");
        logger.LogInformation("Database schema patch completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database schema patch failed. The app will still start.");
    }
}

app.Run();
