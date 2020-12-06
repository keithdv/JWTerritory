using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JWTerritoryAPI.Models
{
    public class TerritoryLastRecord
    {

        [Key]
        public string TerritoryId { get; set; }
        public string Name { get; set; }
        public DateTime? CheckedOut { get; set; }
        public DateTime? CheckedIn { get; set; }
    }
}
