using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JWTerritoryAPI.Models;

namespace JWTerritoryAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TerritoryController : ControllerBase
    {
        private readonly ILogger<TerritoryController> _logger;


        public TerritoryController(ILogger<TerritoryController> logger, TRContext dbContext)
        {
            _logger = logger;
            DbContext = dbContext;
        }

        public TRContext DbContext { get; }

        [HttpGet]
        public async Task<List<Territory>> Get()
        {
            var terrs = await DbContext.GetTerritories();
            return terrs;
        }

        [HttpGet("{sectionId}")]
        public async Task<List<Territory>> Get(string sectionId)
        {
            var terrs = await DbContext.GetTerritories(sectionId);
            return terrs;
        }

        [HttpGet]
        [Route("sections")]
        public async Task<List<string>> GetSections()
        {
            var sections = await DbContext.GetSections();
            return sections;
        }

        [HttpPost()]
        public async Task<ActionResult<Checkout>> Post([FromBody] Territory newT)
        {

            await DbContext.UpdateTerritory(newT);

            return CreatedAtAction(nameof(Get), newT);
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<Checkout>> Post([FromBody] Checkout newCo)
        {

            await DbContext.UpdateCheckout(newCo);

            return CreatedAtAction(nameof(Get), newCo);
        }
    }
}