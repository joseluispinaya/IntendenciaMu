using System;

namespace CapaEntidad
{
    public class EUsuario
    {
        public int IdUsuario { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Correo { get; set; }
        public string Users { get; set; }
        public string Clave { get; set; }
        public string Celular { get; set; }
        public string Foto { get; set; }
        public int IdRol { get; set; }
        public string TokenSesion { get; set; }
        public bool Activo { get; set; }
        public string FechaRegistro { get; set; }
        public DateTime VFechaRegistro { get; set; }

        public ERol Rol { get; set; }
        public string ImageFull => string.IsNullOrEmpty(Foto)
            ? $"/Imagenes/Sinfotop.png"
            : Foto;
    }
}
