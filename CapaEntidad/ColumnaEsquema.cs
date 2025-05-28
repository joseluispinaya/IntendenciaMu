using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class ColumnaEsquema
    {
        public string NombreColumna { get; set; }
        public string TipoDato { get; set; }
        public bool EsNullable { get; set; }
    }
}
