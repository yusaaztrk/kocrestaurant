using Microsoft.EntityFrameworkCore;
using KocRestaurant.Server.Models;

namespace KocRestaurant.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<MenuItemAttribute> MenuItemAttributes { get; set; }
        public DbSet<GalleryItem> GalleryItems { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<HeroSlide> HeroSlides { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cascade delete for MenuItemAttributes when MenuItem is deleted
            modelBuilder.Entity<MenuItem>()
                .HasMany(m => m.Attributes)
                .WithOne(a => a.MenuItem)
                .HasForeignKey(a => a.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed initial Settings
            var settingsId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            modelBuilder.Entity<Settings>().HasData(new Settings
            {
                Id = settingsId,
                RestaurantName = "KOÇ RESTAURANT",
                Address = "Mimar Sinan, Atatürk Bulvarı No:89, 55420 19 Mayıs/Samsun",
                Phone = "0362 511 22 30",
                Email = "rezervasyon@kocrestaurant.com",
                WorkingHours = "Pazartesi - Cumartesi: 04:00 - 20:00 (Pazar Kapalı)",
                LogoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt",
                FacebookUrl = "https://facebook.com/kocrestaurant",
                InstagramUrl = "https://instagram.com/kocrestaurant",
                AboutTitle = "Koç Restaurant Hikayesi",
                AboutText = "Şehrin kalbinde, gastronomi meraklılarına unutulmaz anlar yaşatmak amacıyla kurulan KOÇ RESTAURANT, geleneksel mutfak kültürünü modern dokunuşlar ve yenilikçi tekniklerle yeniden yorumluyor. Her bir tabağımızda, Anadolu'nun verimli topraklarından ve Ege'nin taze sularından özenle seçilen en kaliteli malzemelerin hikayesini anlatıyoruz. Alanında uzman şeflerimiz, mutfaktaki yaratıcılıklarını her detayı titizlikle planlanmış tariflerle buluşturuyor. Bizim için yemek sunumu, sadece bir servis değil; tüm duyulara hitap eden bir sanat ve misafirlerimizle kurduğumuz samimi bir bağdır. Koç Restaurant çatısı altında geçireceğiniz her anın, damaklarınızda unutulmaz izler bırakması en büyük önceliğimizdir.",
                AboutImages = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop,https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop"
            });

            // Seed Categories from Uploaded Menu Image
            var catYemek = Guid.Parse("11111111-c111-1111-1111-111111111111");
            var catCorba = Guid.Parse("11111111-c222-1111-1111-111111111111");
            var catSalata = Guid.Parse("11111111-c333-1111-1111-111111111111");
            var catKahvalti = Guid.Parse("11111111-c444-1111-1111-111111111111");
            var catTatli = Guid.Parse("11111111-c555-1111-1111-111111111111");
            var catIcecek = Guid.Parse("11111111-c666-1111-1111-111111111111");

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = catYemek, Name = "Sulu Yemekler & Izgaralar", Description = "Nefis ev yemekleri ve taze ızgara köfteler", ImageUrl = "http://localhost:5188/uploads/yemekler.png", DisplayOrder = 1 },
                new Category { Id = catCorba, Name = "Çorbalar", Description = "Sıcak ve lezzetli başlangıçlar", ImageUrl = "http://localhost:5188/uploads/corbalar.png", DisplayOrder = 2 },
                new Category { Id = catSalata, Name = "Salatalar & Yoğurt", Description = "Taze ve ferahlatıcı salata ve mezeler", ImageUrl = "http://localhost:5188/uploads/salatalar.png", DisplayOrder = 3 },
                new Category { Id = catKahvalti, Name = "Kahvaltı", Description = "Güne zinde başlatan sabah kahvaltıları", ImageUrl = "http://localhost:5188/uploads/kahvalti.png", DisplayOrder = 4 },
                new Category { Id = catTatli, Name = "Tatlılar", Description = "Yemeğin üstüne tatlı bir son", ImageUrl = "http://localhost:5188/uploads/tatlilar.png", DisplayOrder = 5 },
                new Category { Id = catIcecek, Name = "İçecekler", Description = "Soğuk ve sıcak meşrubatlar", ImageUrl = "http://localhost:5188/uploads/icecekler.png", DisplayOrder = 6 }
            );

            // Seed Menu Items
            var itemAsci = Guid.Parse("11111111-d101-1111-1111-111111111111");
            var itemKavurma = Guid.Parse("11111111-d102-1111-1111-111111111111");
            var itemSebzeli = Guid.Parse("11111111-d103-1111-1111-111111111111");
            var itemPatlicanKebap = Guid.Parse("11111111-d104-1111-1111-111111111111");
            var itemEtHaslama = Guid.Parse("11111111-d105-1111-1111-111111111111");
            var itemSuluKofte = Guid.Parse("11111111-d106-1111-1111-111111111111");
            var itemTazeFasulye = Guid.Parse("11111111-d107-1111-1111-111111111111");
            var itemKarniYarik = Guid.Parse("11111111-d108-1111-1111-111111111111");
            var itemPatlicanMusakka = Guid.Parse("11111111-d109-1111-1111-111111111111");
            var itemKuruFasulye = Guid.Parse("11111111-d110-1111-1111-111111111111");
            var itemIzgaraKofte = Guid.Parse("11111111-d111-1111-1111-111111111111");
            var itemFirinKofte = Guid.Parse("11111111-d112-1111-1111-111111111111");
            var itemFirinTavuk = Guid.Parse("11111111-d113-1111-1111-111111111111");
            var itemPilav = Guid.Parse("11111111-d114-1111-1111-111111111111");
            var itemAzPilavAzKavurma = Guid.Parse("11111111-d115-1111-1111-111111111111");
            var itemAzPilavAzKuru = Guid.Parse("11111111-d116-1111-1111-111111111111");
            var itemAzPilavAzPatlican = Guid.Parse("11111111-d117-1111-1111-111111111111");
            var itemAzPilavAzSebzeli = Guid.Parse("11111111-d118-1111-1111-111111111111");
            var itemFavoriUclu = Guid.Parse("11111111-d119-1111-1111-111111111111");
            var itemKarisikKucuk = Guid.Parse("11111111-d120-1111-1111-111111111111");

            var itemMercimek = Guid.Parse("11111111-d201-1111-1111-111111111111");
            var itemEzogelin = Guid.Parse("11111111-d202-1111-1111-111111111111");
            var itemTavukSuyu = Guid.Parse("11111111-d203-1111-1111-111111111111");
            var itemYayla = Guid.Parse("11111111-d204-1111-1111-111111111111");

            var itemMevsimSalata = Guid.Parse("11111111-d301-1111-1111-111111111111");
            var itemYogurt = Guid.Parse("11111111-d302-1111-1111-111111111111");
            var itemCacik = Guid.Parse("11111111-d303-1111-1111-111111111111");
            var itemTursu = Guid.Parse("11111111-d304-1111-1111-111111111111");

            var itemKahvaltiTabak = Guid.Parse("11111111-d401-1111-1111-111111111111");
            var itemYumurta = Guid.Parse("11111111-d402-1111-1111-111111111111");

            var itemSutlac = Guid.Parse("11111111-d501-1111-1111-111111111111");
            var itemKadayif = Guid.Parse("11111111-d502-1111-1111-111111111111");
            var itemTurbo = Guid.Parse("11111111-d503-1111-1111-111111111111");

            var itemMesrubat = Guid.Parse("11111111-d601-1111-1111-111111111111");
            var itemAyran = Guid.Parse("11111111-d602-1111-1111-111111111111");
            var itemCay = Guid.Parse("11111111-d603-1111-1111-111111111111");
            var itemSu = Guid.Parse("11111111-d604-1111-1111-111111111111");

            modelBuilder.Entity<MenuItem>().HasData(
                // Sulu Yemekler & Izgaralar
                new MenuItem { Id = itemAsci, CategoryId = catYemek, Name = "Aşçı Tabağı", Description = "Şefimizin günlük hazırladığı leziz karışık aşçı tabağı.", Price = 650, ImageUrl = "", IsDailySpecial = true, IsAvailable = true, IsPopular = true, DisplayOrder = 1 },
                new MenuItem { Id = itemKavurma, CategoryId = catYemek, Name = "Et Kavurma (220 gr)", Description = "Özel tereyağlı dana kavurma.", Price = 600, ImageUrl = "", IsDailySpecial = true, IsAvailable = true, IsPopular = true, DisplayOrder = 2 },
                new MenuItem { Id = itemSebzeli, CategoryId = catYemek, Name = "Sebzeli Kebap", Description = "Taze sebzeler ve dana etiyle lezzet.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 3 },
                new MenuItem { Id = itemPatlicanKebap, CategoryId = catYemek, Name = "Patlıcan Kebap", Description = "Fırınlanmış taze patlıcanlı kebap.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 4 },
                new MenuItem { Id = itemEtHaslama, CategoryId = catYemek, Name = "Et Haşlama", Description = "Kemikli dana etli, sebzeli haşlama.", Price = 450, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 5 },
                new MenuItem { Id = itemSuluKofte, CategoryId = catYemek, Name = "Sulu Köfte", Description = "Geleneksel ev yapımı sulu köfte.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 6 },
                new MenuItem { Id = itemTazeFasulye, CategoryId = catYemek, Name = "Taze Fasulye", Description = "Zeytinyağlı taze fasulye yemeği.", Price = 250, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 7 },
                new MenuItem { Id = itemKarniYarik, CategoryId = catYemek, Name = "Karnı Yarık", Description = "Kıymalı fırınlanmış karnıyarık.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 8 },
                new MenuItem { Id = itemPatlicanMusakka, CategoryId = catYemek, Name = "Patlıcan Musakka", Description = "Nefis kıymalı patlıcan musakka.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 9 },
                new MenuItem { Id = itemKuruFasulye, CategoryId = catYemek, Name = "Kuru Fasulye", Description = "Tereyağlı güveçte kuru fasulye yemeği.", Price = 250, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 10 },
                new MenuItem { Id = itemIzgaraKofte, CategoryId = catYemek, Name = "Izgara Köfte", Description = "Taze baharatlarla yoğrulmuş ızgara köfte.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 11 },
                new MenuItem { Id = itemFirinKofte, CategoryId = catYemek, Name = "Fırın Köfte", Description = "Patatesli soslu fırında anne köftesi.", Price = 400, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 12 },
                new MenuItem { Id = itemFirinTavuk, CategoryId = catYemek, Name = "Fırın Tavuk", Description = "Özel marinasyonlu fırın tavuk yemeği.", Price = 350, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 13 },
                new MenuItem { Id = itemPilav, CategoryId = catYemek, Name = "Pilav", Description = "Tereyağlı tane tane pirinç pilavı.", Price = 150, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 14 },
                new MenuItem { Id = itemAzPilavAzKavurma, CategoryId = catYemek, Name = "Az Pilav Az Kavurma", Description = "Hafif porsiyon pilav ve kavurma tabağı.", Price = 450, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 15 },
                new MenuItem { Id = itemAzPilavAzKuru, CategoryId = catYemek, Name = "Az Pilav Az Kuru", Description = "Klasik az pilav üstü kuru fasulye tabağı.", Price = 250, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 16 },
                new MenuItem { Id = itemAzPilavAzPatlican, CategoryId = catYemek, Name = "Az Pilav Az Patlıcan", Description = "Hafif porsiyon pilav ve patlıcan yemeği.", Price = 350, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 17 },
                new MenuItem { Id = itemAzPilavAzSebzeli, CategoryId = catYemek, Name = "Az Pilav Az Sebzeli", Description = "Hafif porsiyon pilav ve sebzeli kebap tabağı.", Price = 350, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 18 },
                new MenuItem { Id = itemFavoriUclu, CategoryId = catYemek, Name = "Favori Üçlü", Description = "Restaurantımızın en çok tercih edilen üçlü lezzet kombinasyonu.", Price = 600, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 19 },
                new MenuItem { Id = itemKarisikKucuk, CategoryId = catYemek, Name = "Karışık Küçük", Description = "Küçük porsiyon karışık tencere yemeği tabağı.", Price = 500, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 20 },

                // Çorbalar
                new MenuItem { Id = itemMercimek, CategoryId = catCorba, Name = "Mercimek", Description = "Sıcak süzme mercimek çorbası.", Price = 120, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 21 },
                new MenuItem { Id = itemEzogelin, CategoryId = catCorba, Name = "Ezogelin", Description = "Geleneksel ezogelin çorbası.", Price = 120, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 22 },
                new MenuItem { Id = itemTavukSuyu, CategoryId = catCorba, Name = "Tavuk Suyu", Description = "Şifa kaynağı tavuk suyu çorbası.", Price = 120, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 23 },
                new MenuItem { Id = itemYayla, CategoryId = catCorba, Name = "Yayla", Description = "Nefis tereyağlı yayla çorbası.", Price = 120, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 24 },

                // Mezeler & Salatalar
                new MenuItem { Id = itemMevsimSalata, CategoryId = catSalata, Name = "Mevsim Salata", Description = "Taze mevsim yeşillikleri.", Price = 50, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 25 },
                new MenuItem { Id = itemYogurt, CategoryId = catSalata, Name = "Yoğurt", Description = "Taze ev yoğurdu.", Price = 80, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 26 },
                new MenuItem { Id = itemCacik, CategoryId = catSalata, Name = "Cacık", Description = "Taze salatalık ve nane ile cacık.", Price = 80, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 27 },
                new MenuItem { Id = itemTursu, CategoryId = catSalata, Name = "Turşu", Description = "Karışık ev turşusu.", Price = 40, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 28 },

                // Kahvaltı
                new MenuItem { Id = itemKahvaltiTabak, CategoryId = catKahvalti, Name = "Kahvaltı Tabağı", Description = "Zengin kahvaltı tabağı içeriği.", Price = 250, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 29 },
                new MenuItem { Id = itemYumurta, CategoryId = catKahvalti, Name = "Tereyağlı Yumurta", Description = "Sahan tereyağında pişmiş yumurta.", Price = 50, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 30 },

                // Tatlılar
                new MenuItem { Id = itemSutlac, CategoryId = catTatli, Name = "Fırın Sütlaç", Description = "Üstü kızarmış nefis sütlaç tatlısı.", Price = 150, ImageUrl = "/sutlac_tatli_sunumu.png", IsDailySpecial = false, IsAvailable = true, IsPopular = true, DisplayOrder = 31 },
                new MenuItem { Id = itemKadayif, CategoryId = catTatli, Name = "Tereyağlı Kadayıf", Description = "Şerbetli fırınlanmış tel kadayıf tatlısı.", Price = 150, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 32 },
                new MenuItem { Id = itemTurbo, CategoryId = catTatli, Name = "Turbo", Description = "Özel kaymaklı ve fıstıklı kadayıf.", Price = 200, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 33 },

                // İçecekler
                new MenuItem { Id = itemMesrubat, CategoryId = catIcecek, Name = "Meşrubatlar", Description = "Kutu gazlı meşrubat çeşitleri.", Price = 70, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 34 },
                new MenuItem { Id = itemAyran, CategoryId = catIcecek, Name = "Köy Ayranı", Description = "Köpüklü soğuk köy ayranı.", Price = 50, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 35 },
                new MenuItem { Id = itemCay, CategoryId = catIcecek, Name = "Çay", Description = "Taze demlenmiş bardak çay.", Price = 10, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 36 },
                new MenuItem { Id = itemSu, CategoryId = catIcecek, Name = "Su", Description = "Şişe kaynak suyu.", Price = 10, ImageUrl = "", IsDailySpecial = false, IsAvailable = true, DisplayOrder = 37 }
            );

            // Seed MenuItemAttributes for Portion specifications
            modelBuilder.Entity<MenuItemAttribute>().HasData(
                // Aşçı Tabağı
                new MenuItemAttribute { Id = Guid.Parse("33333333-e001-1111-1111-111111111111"), MenuItemId = itemAsci, Name = "TAM", Value = "650 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e002-1111-1111-111111111111"), MenuItemId = itemAsci, Name = "AZ (Pilavsız)", Value = "600 TL" },

                // Et Kavurma
                new MenuItemAttribute { Id = Guid.Parse("33333333-e003-1111-1111-111111111111"), MenuItemId = itemKavurma, Name = "TAM", Value = "220 gr / 600 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e004-1111-1111-111111111111"), MenuItemId = itemKavurma, Name = "AZ", Value = "120 gr / 350 TL" },

                // Sebzeli Kebap
                new MenuItemAttribute { Id = Guid.Parse("33333333-e005-1111-1111-111111111111"), MenuItemId = itemSebzeli, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e006-1111-1111-111111111111"), MenuItemId = itemSebzeli, Name = "AZ", Value = "250 TL" },

                // Patlıcan Kebap
                new MenuItemAttribute { Id = Guid.Parse("33333333-e007-1111-1111-111111111111"), MenuItemId = itemPatlicanKebap, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e008-1111-1111-111111111111"), MenuItemId = itemPatlicanKebap, Name = "AZ", Value = "250 TL" },

                // Et Haşlama
                new MenuItemAttribute { Id = Guid.Parse("33333333-e009-1111-1111-111111111111"), MenuItemId = itemEtHaslama, Name = "TAM", Value = "450 TL" },

                // Sulu Köfte
                new MenuItemAttribute { Id = Guid.Parse("33333333-e010-1111-1111-111111111111"), MenuItemId = itemSuluKofte, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e011-1111-1111-111111111111"), MenuItemId = itemSuluKofte, Name = "AZ", Value = "200 TL" },

                // Taze Fasulye
                new MenuItemAttribute { Id = Guid.Parse("33333333-e012-1111-1111-111111111111"), MenuItemId = itemTazeFasulye, Name = "TAM", Value = "250 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e013-1111-1111-111111111111"), MenuItemId = itemTazeFasulye, Name = "AZ", Value = "150 TL" },

                // Karnı Yarık
                new MenuItemAttribute { Id = Guid.Parse("33333333-e014-1111-1111-111111111111"), MenuItemId = itemKarniYarik, Name = "TAM", Value = "400 TL" },

                // Patlıcan Musakka
                new MenuItemAttribute { Id = Guid.Parse("33333333-e015-1111-1111-111111111111"), MenuItemId = itemPatlicanMusakka, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e016-1111-1111-111111111111"), MenuItemId = itemPatlicanMusakka, Name = "AZ", Value = "250 TL" },

                // Kuru Fasulye
                new MenuItemAttribute { Id = Guid.Parse("33333333-e017-1111-1111-111111111111"), MenuItemId = itemKuruFasulye, Name = "TAM", Value = "250 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e018-1111-1111-111111111111"), MenuItemId = itemKuruFasulye, Name = "AZ", Value = "150 TL" },

                // Izgara Köfte
                new MenuItemAttribute { Id = Guid.Parse("33333333-e019-1111-1111-111111111111"), MenuItemId = itemIzgaraKofte, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e020-1111-1111-111111111111"), MenuItemId = itemIzgaraKofte, Name = "AZ", Value = "250 TL" },

                // Fırın Köfte
                new MenuItemAttribute { Id = Guid.Parse("33333333-e021-1111-1111-111111111111"), MenuItemId = itemFirinKofte, Name = "TAM", Value = "400 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e022-1111-1111-111111111111"), MenuItemId = itemFirinKofte, Name = "AZ", Value = "250 TL" },

                // Fırın Tavuk
                new MenuItemAttribute { Id = Guid.Parse("33333333-e023-1111-1111-111111111111"), MenuItemId = itemFirinTavuk, Name = "TAM", Value = "350 TL" },

                // Pilav
                new MenuItemAttribute { Id = Guid.Parse("33333333-e024-1111-1111-111111111111"), MenuItemId = itemPilav, Name = "TAM", Value = "150 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e025-1111-1111-111111111111"), MenuItemId = itemPilav, Name = "AZ", Value = "100 TL" },

                // Az Pilav Az Kavurma
                new MenuItemAttribute { Id = Guid.Parse("33333333-e026-1111-1111-111111111111"), MenuItemId = itemAzPilavAzKavurma, Name = "TAM", Value = "450 TL" },

                // Az Pilav Az Kuru
                new MenuItemAttribute { Id = Guid.Parse("33333333-e027-1111-1111-111111111111"), MenuItemId = itemAzPilavAzKuru, Name = "TAM", Value = "250 TL" },

                // Az Pilav Az Patlıcan
                new MenuItemAttribute { Id = Guid.Parse("33333333-e028-1111-1111-111111111111"), MenuItemId = itemAzPilavAzPatlican, Name = "TAM", Value = "350 TL" },

                // Az Pilav Az Sebzeli
                new MenuItemAttribute { Id = Guid.Parse("33333333-e029-1111-1111-111111111111"), MenuItemId = itemAzPilavAzSebzeli, Name = "TAM", Value = "350 TL" },

                // Favori Üçlü
                new MenuItemAttribute { Id = Guid.Parse("33333333-e030-1111-1111-111111111111"), MenuItemId = itemFavoriUclu, Name = "TAM", Value = "600 TL" },

                // Karışık Küçük
                new MenuItemAttribute { Id = Guid.Parse("33333333-e031-1111-1111-111111111111"), MenuItemId = itemKarisikKucuk, Name = "TAM", Value = "500 TL" },

                // Çorbalar
                new MenuItemAttribute { Id = Guid.Parse("33333333-e032-1111-1111-111111111111"), MenuItemId = itemMercimek, Name = "TAM", Value = "120 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e033-1111-1111-111111111111"), MenuItemId = itemMercimek, Name = "AZ", Value = "70 TL" },

                new MenuItemAttribute { Id = Guid.Parse("33333333-e034-1111-1111-111111111111"), MenuItemId = itemEzogelin, Name = "TAM", Value = "120 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e035-1111-1111-111111111111"), MenuItemId = itemEzogelin, Name = "AZ", Value = "70 TL" },

                new MenuItemAttribute { Id = Guid.Parse("33333333-e036-1111-1111-111111111111"), MenuItemId = itemTavukSuyu, Name = "TAM", Value = "120 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e037-1111-1111-111111111111"), MenuItemId = itemTavukSuyu, Name = "AZ", Value = "70 TL" },

                new MenuItemAttribute { Id = Guid.Parse("33333333-e038-1111-1111-111111111111"), MenuItemId = itemYayla, Name = "TAM", Value = "120 TL" },
                new MenuItemAttribute { Id = Guid.Parse("33333333-e039-1111-1111-111111111111"), MenuItemId = itemYayla, Name = "AZ", Value = "70 TL" }
            );

            // Seed default slides
            modelBuilder.Entity<HeroSlide>().HasData(
                new HeroSlide 
                { 
                    Id = Guid.Parse("11111111-f111-1111-1111-111111111111"), 
                    Title = "Geleneksel Lezzet, Modern Esinti", 
                    Description = "Samsun 19 Mayıs'ta 30 yıllık tecrübemiz ve taş fırınımızla hazırlanan eşsiz lezzetler.", 
                    ImageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop", 
                    DisplayOrder = 1 
                },
                new HeroSlide 
                { 
                    Id = Guid.Parse("11111111-f222-1111-1111-111111111111"), 
                    Title = "Meşhur Taş Fırın Sütlacı", 
                    Description = "Doğal köy sütüyle hazırlanan, taş fırında üzeri altın sarısı kızarmış meşhur fırın sütlacımız.", 
                    ImageUrl = "/sutlac_tatli_sunumu.png", 
                    DisplayOrder = 2 
                },
                new HeroSlide 
                { 
                    Id = Guid.Parse("11111111-f333-1111-1111-111111111111"), 
                    Title = "Güler Yüzlü ve Hızlı Ağırlama", 
                    Description = "Sıcaklığı ve tazeliği kaybetmeden, şık sunumlarla masanıza en kısa sürede ulaştırılan siparişler.", 
                    ImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop", 
                    DisplayOrder = 3 
                }
            );
        }
    }
}
