using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JWTerritoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace JWTerritoryAPI.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ExportController : ControllerBase
    {

        public ExportController(ILogger<ExportController> logger, TRContext dbContext)
        {
            Logger = logger;
            DbContext = dbContext;
        }

        public ILogger<ExportController> Logger { get; }
        public TRContext DbContext { get; }

        [HttpGet]
        [Route("LastRecords")]
        public async Task<List<TerritoryLastRecord>> GetTerrirotyLastRecords()
        {
            var report = await DbContext.RunTerrirotyLastRecords();

            var sections = report.OrderBy(x =>
            {
                var i = Regex.Match(x.TerritoryId, @"\d+").Value;

                if (!int.TryParse(i, out var id))
                {
                    throw new Exception();
                }
                return id;
            }).GroupBy(x => x.TerritoryId.Substring(0, 1)).ToDictionary(x => x.Key, x => x.ToList());

            var b = new StringBuilder();

            foreach (var section in sections)
            {

                do
                {

                    b.Append('\n');
                    b.Append('\n');

                    List<TerritoryLastRecord> page;

                    if (section.Value.Count >= 5)
                    {
                        page = section.Value.Take(5).ToList();
                        section.Value.RemoveRange(0, 5);
                    }
                    else
                    {
                        page = section.Value.ToList();
                        section.Value.Clear();
                    }

                    foreach (var territory in page)
                    {
                        b.Append("Terr. No:\t");
                        b.Append(territory.TerritoryId);
                        b.Append('\t');
                    }

                    b.Append('\n');
                    b.Append('\n');

                    foreach (var territory in page)
                    {
                        if (!string.IsNullOrWhiteSpace(territory.Name))
                        {
                            b.Append(territory.Name);
                        }
                        b.Append('\t');
                        b.Append('\t');
                    }

                    b.Append('\n');

                    foreach (var territory in page)
                    {
                        b.Append(territory.CheckedOut?.ToShortDateString() ?? "");
                        b.Append('\t');
                        b.Append(territory.CheckedIn?.ToShortDateString() ?? "");
                        b.Append('\t');
                    }
                } while (section.Value.Count > 0);
            }
            Debug.Write(b.ToString());


            return report;
        }

        [HttpGet]
        [Route("Backup")]
        public async Task<IActionResult> Backup()
        {
            var backup = await DbContext.Backup();

            var result = new string[backup.territories.Count, 13];

            for (var i = 0; i < backup.territories.Count; i++)
            {
                var t = backup.territories[i];
                result[i, 0] = $"{t.Section}{t.Number}";

                if (backup.checkouts.TryGetValue(t.TerritoryId, out var checkouts))
                {
                    void Set(Checkout checkout, int ii)
                    {
                        if (checkout is null)
                        {
                            result[i, ii] = string.Empty;
                            result[i, ii + 1] = string.Empty;
                            result[i, ii + 2] = string.Empty;
                        }
                        else
                        {
                            result[i, ii] = checkout.Name?.Replace(',', '-') ?? string.Empty;
                            result[i, ii + 1] = checkout.CheckedOut?.ToShortDateString() ?? string.Empty;
                            result[i, ii + 2] = checkout.CheckedIn?.ToShortDateString() ?? string.Empty;
                        }
                    }
                    Set(checkouts.SingleOrDefault(c => c.CheckoutId == 0), 1);
                    Set(checkouts.SingleOrDefault(c => c.CheckoutId == 1), 4);
                    Set(checkouts.SingleOrDefault(c => c.CheckoutId == 2), 7);
                    Set(checkouts.SingleOrDefault(c => c.CheckoutId == 3), 10);

                }
            }

            var csvFile = new StringBuilder();

            for(var i = 0; i < result.GetLength(1); i++)
            {
                for(var ii = 0; ii < result.GetLength(0); ii++)
                {
                    csvFile.Append(result[ii, i]);
                    csvFile.Append(", ");
                }
                csvFile.Remove(csvFile.Length - 2, 2);
                csvFile.AppendLine();
            }

            var byteArray = Encoding.ASCII.GetBytes(csvFile.ToString());
            MemoryStream stream = new MemoryStream(byteArray);
            return new FileStreamResult(stream, "text/csv");
        }
    }
}