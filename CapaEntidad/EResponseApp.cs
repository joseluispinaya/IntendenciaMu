using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidad
{
    public class EResponseApp
    {
        public int IdUsuario { get; set; }
        public string FullNombre { get; set; }
        public string Correo { get; set; }
        public string Users { get; set; }
        public string Celular { get; set; }
        public string Foto { get; set; }
        public bool Activo { get; set; }
        public string Rol { get; set; }

        public string ImageFull => string.IsNullOrEmpty(Foto)
            ? $"https://joseluis1989-003-site1.ltempurl.com/Imagenes/Sinfotop.png"
            : $"https://joseluis1989-003-site1.ltempurl.com{Foto}";
    }
}
