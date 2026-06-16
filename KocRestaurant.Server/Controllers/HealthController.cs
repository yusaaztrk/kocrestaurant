using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KocRestaurant.Server.Data;

namespace KocRestaurant.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;

        public HealthController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        [HttpGet]
        public async Task<IActionResult> Check()
        {
            var result = new Dictionary<string, object>
            {
                ["status"] = "alive",
                ["timestamp"] = DateTime.UtcNow.ToString("o"),
                ["environment"] = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "NOT SET"
            };

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var canConnect = await context.Database.CanConnectAsync();
                result["database"] = canConnect ? "connected" : "cannot connect";

                if (canConnect)
                {
                    try
                    {
                        var userCount = await context.Users.CountAsync();
                        result["usersTable"] = $"exists ({userCount} users)";
                    }
                    catch (Exception ex)
                    {
                        result["usersTable"] = $"ERROR: {ex.Message}";
                        if (ex.InnerException != null)
                            result["usersTableInner"] = ex.InnerException.Message;
                    }
                }
            }
            catch (Exception ex)
            {
                result["database"] = $"ERROR: {ex.Message}";
                if (ex.InnerException != null)
                    result["databaseInner"] = ex.InnerException.Message;
            }

            return Ok(result);
        }
    }
}
