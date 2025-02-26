using System;

namespace CapaEntidad
{
    public class ENotificacion
    {
        public int IdNotificacion { get; set; }
        public string Codigo { get; set; }
        public int IdPropietario { get; set; }
        public int IdUsuario { get; set; }
        public string Descripcion { get; set; }
        public string FechaPresencia { get; set; }
        public DateTime VFechaPresencia { get; set; }
        public bool Activo { get; set; }
        public string FechaRegistro { get; set; }
        public DateTime VFechaRegistro { get; set; }
        public EUsuario Usuario { get; set; }
        public EPropietario Propietario { get; set; }
    }
}
