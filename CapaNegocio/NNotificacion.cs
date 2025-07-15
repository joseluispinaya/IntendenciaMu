using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidad;

namespace CapaNegocio
{
    public class NNotificacion
    {
        #region "PATRON SINGLETON"
        public static NNotificacion _instancia = null;

        private NNotificacion()
        {

        }

        public static NNotificacion GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new NNotificacion();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<int> RegistrarNotificacion(ENotificacion oNotificacion)
        {
            return DNotificacion.GetInstance().RegistrarNotificacion(oNotificacion);
        }

        public Respuesta<List<ENotificacion>> ObtenerNotificacionId(int Idpropietario)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionId(Idpropietario);
        }

        public Respuesta<List<ENotificacion>> ObtenerNotificacionIdPrueba(int Idpropietario)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionIdPrueba(Idpropietario);
        }

        public Respuesta<ENotificacion> ObtenerNotificacionPorIdReport(int IdNotifi)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionPorIdReport(IdNotifi);
        }

        public Respuesta<bool> CancelarNotificacion(int IdNoti)
        {
            return DNotificacion.GetInstance().CancelarNotificacion(IdNoti);
        }

        public Respuesta<List<EReporteNotFe>> NotificacionRpt(string FechaInicio, string FechaFin)
        {
            return DNotificacion.GetInstance().NotificacionRpt(FechaInicio, FechaFin);
        }

        public Respuesta<List<EUsuario>> ObtenerUsuariosMasNotifica()
        {
            return DNotificacion.GetInstance().ObtenerUsuariosMasNotifica();
        }

        public Respuesta<List<ResponseNotifia>> ObtenerNotificacionesPropi(int Idpropietario)
        {
            Respuesta<List<ENotificacion>> respuestaOriginal = DNotificacion.GetInstance().ObtenerNotificacionId(Idpropietario);

            // Validar si hubo error
            if (!respuestaOriginal.Estado)
            {
                return new Respuesta<List<ResponseNotifia>>()
                {
                    Estado = false,
                    Mensaje = "No se encontraron notificaciones.",
                    Data = null
                };
            }

            // Validar si la lista está vacía
            if (respuestaOriginal.Data.Count == 0)
            {
                return new Respuesta<List<ResponseNotifia>>()
                {
                    Estado = false,
                    Mensaje = "No se encontraron notificaciones.",
                    Data = null
                };
            }

            var listaConvertida = respuestaOriginal.Data.Select(x => new ResponseNotifia
            {
                IdNotificacion = x.IdNotificacion,
                Codigo = x.Codigo,
                Descripcion = x.Descripcion,
                FechaPresencia = x.FechaPresencia,
                FechaRegistro = x.FechaRegistro,
                Nombres = x.Usuario.Nombres,
                Apellidos = x.Usuario.Apellidos,
                Activo = x.Activo ? "ACTIVO" : "CANCELADO"
            }).ToList();

            return new Respuesta<List<ResponseNotifia>>()
            {
                Estado = true,
                Mensaje = "Notificaciones obtenidas correctamente",
                Data = listaConvertida
            };
        }

        public Respuesta<List<ResponseNotifia>> NotificacionesPorUsuario(int IdUsuario)
        {
            Respuesta<List<ENotificacion>> respuestaOriginal = DNotificacion.GetInstance().NotificacionesPorUsuario(IdUsuario);

            // Validar si hubo error
            if (!respuestaOriginal.Estado)
            {
                return new Respuesta<List<ResponseNotifia>>()
                {
                    Estado = false,
                    Mensaje = "No se encontraron notificaciones.",
                    Data = null
                };
            }

            // Validar si la lista está vacía
            if (respuestaOriginal.Data.Count == 0)
            {
                return new Respuesta<List<ResponseNotifia>>()
                {
                    Estado = false,
                    Mensaje = "No tiene notificaciones registradas.",
                    Data = null
                };
            }

            var listaConvertida = respuestaOriginal.Data.Select(x => new ResponseNotifia
            {
                IdNotificacion = x.IdNotificacion,
                Codigo = x.Codigo,
                Descripcion = x.Descripcion,
                FechaPresencia = x.FechaPresencia,
                FechaRegistro = x.FechaRegistro,
                Nombres = x.Propietario.Nombres,
                Apellidos = x.Propietario.Apellidos,
                Activo = x.Activo ? "ACTIVO" : "CANCELADO"
            }).ToList();

            return new Respuesta<List<ResponseNotifia>>()
            {
                Estado = true,
                Mensaje = "Notificaciones obtenidas correctamente",
                Data = listaConvertida
            };
        }

        public Respuesta<ResponseNotifia> ObtenerReport(int IdNotifi)
        {
            Respuesta<ENotificacion> respuesta = DNotificacion.GetInstance().ObtenerNotificacionPorIdReport(IdNotifi);

            if (!respuesta.Estado || respuesta.Data == null)
            {
                return new Respuesta<ResponseNotifia>
                {
                    Estado = false,
                    Mensaje = "Ocurrio un problema con la Notificacion"
                };
            }

            var obj = respuesta.Data;

            var NotifiConve = new ResponseNotifia
            {
                IdNotificacion = obj.IdNotificacion,
                Codigo = obj.Codigo,
                Descripcion = obj.Descripcion,
                FechaPresencia = obj.FechaPresencia,
                FechaRegistro = obj.FechaRegistro,
                Nombres = $"{obj.Propietario.Nombres} {obj.Propietario.Apellidos}",
                Apellidos = $"{obj.Usuario.Nombres} {obj.Usuario.Apellidos}",
                Activo = obj.Activo ? "ACTIVO" : "CANCELADO"
            };

            return new Respuesta<ResponseNotifia>
            {
                Estado = true,
                Mensaje = "Notificacion obtenidas correctamente",
                Data = NotifiConve
            };
        }


        //public Respuesta<List<ResponseNotifia>> ObtenerNotificacionesPropi(int Idpropietario)
        //{
        //    Respuesta<List<ENotificacion>> respuestaOriginal = DNotificacion.GetInstance().ObtenerNotificacionId(Idpropietario);

        //    if (!respuestaOriginal.Estado || respuestaOriginal.Data == null)
        //    {
        //        return new Respuesta<List<ResponseNotifia>>()
        //        {
        //            Estado = false,
        //            Mensaje = respuestaOriginal.Mensaje,
        //            Data = null
        //        };
        //    }

        //    var listaConvertida = respuestaOriginal.Data.Select(x => new ResponseNotifia
        //    {
        //        IdNotificacion = x.IdNotificacion,
        //        Codigo = x.Codigo,
        //        Descripcion = x.Descripcion,
        //        FechaPresencia = x.FechaPresencia,
        //        FechaRegistro = x.FechaRegistro,
        //        Nombres = x.Usuario.Nombres,    // Asumiendo que quieres los nombres del usuario
        //        Apellidos = x.Usuario.Apellidos,
        //        Activo = x.Activo ? "ACTIVO" : "CANCELADO"
        //    }).ToList();

        //    return new Respuesta<List<ResponseNotifia>>()
        //    {
        //        Estado = true,
        //        Mensaje = "Notificaciones convertidas correctamente",
        //        Data = listaConvertida
        //    };
        //}


    }
}
