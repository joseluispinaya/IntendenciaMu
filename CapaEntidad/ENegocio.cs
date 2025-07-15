using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class ENegocio
    {
        public int IdNegocio { get; set; }
        public string NroPadron { get; set; }
        public string NombreNegocio { get; set; }
        public string Actividad { get; set; }
        public string Ubicacion { get; set; }
        public string Valides { get; set; }
        public string CodQr { get; set; }
        public int IdPropietario { get; set; }
        public bool Activo { get; set; }
    }
}
