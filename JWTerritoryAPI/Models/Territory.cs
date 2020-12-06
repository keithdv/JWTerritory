using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JWTerritoryAPI.Models
{
    public class Territory
    {

        [Key]
        public string TerritoryId { get; set; }
        public short Number { get; set; }
        public string Section { get; set; }
        public string Notes { get; set; }
        public string TerritoryCardFileName { get; set; }
        public List<Checkout> Checkouts { get; set; }
    }
}
