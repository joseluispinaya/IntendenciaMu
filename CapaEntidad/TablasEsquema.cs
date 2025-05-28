using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class TablasEsquema
    {
        public string NombreTabla { get; set; }
        public List<ColumnaEsquema> Columnas { get; set; }
    }
}
