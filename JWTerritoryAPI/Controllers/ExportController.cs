using System;
using System.Collections.Generic;
using System.Diagnostics;
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
    }
}