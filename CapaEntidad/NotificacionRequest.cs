using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class NotificacionRequest
    {
        public int IdPropietario { get; set; }
        public int IdUsuario { get; set; }
        public string Descripcion { get; set; }
        public string FechaPresencia { get; set; }
    }
}
