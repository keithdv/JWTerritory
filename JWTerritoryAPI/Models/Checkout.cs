using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JWTerritoryAPI.Models
{
    public class Checkout
    {

        public short CheckoutId { get; set; }
        public string TerritoryId { get; set; }

        public string? Name { get; set; }
        public DateTime? CheckedOut { get; set; }
        public DateTime? CheckedIn { get; set; }

    }
}
