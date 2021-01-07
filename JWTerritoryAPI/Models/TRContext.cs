using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JWTerritoryAPI.Models
{
    public class TRContext : DbContext
    {
        public TRContext(DbContextOptions<TRContext> context) : base(context) { }

        public DbSet<Territory> Territorys { get; set; }
        public DbSet<Checkout> Checkouts { get; set; }
        public DbSet<TerritoryLastRecord> TerritoryLastRecords { get; set; }

        public async Task<List<Territory>> GetTerritories()
        {
            return await Territorys.Include(t => t.Checkouts).ToListAsync();
        }

        public async Task<List<Territory>> GetTerritories(string sectionId)
        {
            return await Territorys.Include(t => t.Checkouts).Where(t => t.Section == sectionId).ToListAsync();
        }

        public async Task<List<string>> GetSections()
        {
            return await Territorys.Select(t => t.Section).Distinct().ToListAsync();
        }

        public async Task UpdateTerritory(Territory territory)
        {
            var existing = await Territorys.Where(t => t.TerritoryId == territory.TerritoryId).SingleAsync();

            existing.Notes = territory.Notes;

            await SaveChangesAsync();

        }
        public async Task UpdateCheckout(Checkout checkout)
        {
            var existing = await Checkouts.SingleAsync(c => c.CheckoutId == checkout.CheckoutId && c.TerritoryId == checkout.TerritoryId);

            Checkouts.Remove(existing);
            Checkouts.Add(checkout);

            await SaveChangesAsync();

        }


        public async Task<List<TerritoryLastRecord>> RunTerrirotyLastRecords()
        {
            return await TerritoryLastRecords.FromSqlRaw("export_TerritoryLastRecord").ToListAsync();
        }

        public async Task<(Dictionary<string, List<Checkout>> checkouts, List<Territory> territories)> Backup()
        {
            var checkout = await Checkouts.ToListAsync();
            var territories = await Territorys.ToListAsync();
            return (checkout.OrderBy(c => c.TerritoryId).GroupBy(c => c.TerritoryId).ToDictionary(c => c.Key, c => c.ToList()), territories);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Territory>()
                .ToTable("Territory");

            modelBuilder.Entity<Checkout>()
                .ToTable("Checkout")
                .HasKey(c => new { c.CheckoutId, c.TerritoryId });
        }
    }
}
