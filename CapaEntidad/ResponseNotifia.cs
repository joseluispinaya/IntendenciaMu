using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class ResponseNotifia
    {
        public int IdNotificacion { get; set; }
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string FechaPresencia { get; set; }
        public string FechaRegistro { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Activo { get; set; }

    }
}
