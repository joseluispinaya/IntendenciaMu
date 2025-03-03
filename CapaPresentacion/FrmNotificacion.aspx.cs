using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CapaEntidad;
using CapaNegocio;
using System.Web.Services;

namespace CapaPresentacion
{
	public partial class FrmNotificacion : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        [WebMethod]
        public static Respuesta<EPropietario> BuscarPropie(string Nroci)
        {
            try
            {
                // Obtener solo el propietario buscado en lugar de cargar toda la lista
                Respuesta<EPropietario> respuesta = NPropietario.GetInstance().BuscarPropieta(Nroci);

                if (respuesta == null || respuesta.Data == null)
                {
                    return new Respuesta<EPropietario>
                    {
                        Estado = false,
                        Mensaje = "El número de CI no se encuentra registrado"
                    };
                }

                return new Respuesta<EPropietario>
                {
                    Estado = true,
                    Data = respuesta.Data,
                    Mensaje = "Propietario encontrado"
                };
            }
            catch (Exception)
            {
                // Aquí podrías loggear el error en un sistema de logs como Serilog, NLog, etc.
                return new Respuesta<EPropietario>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error inesperado. Intente nuevamente."
                };
            }
        }

        [WebMethod]
        public static Respuesta<List<ENotificacion>> ObtenerListaNotifiId(int IdPropi)
        {
            try
            {
                Respuesta<List<ENotificacion>> Lista = NNotificacion.GetInstance().ObtenerNotificacionIdPrueba(IdPropi);
                return Lista;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener las Notificaciones: " + ex.Message,
                    Data = null
                };
            }
        }

        [WebMethod]
        public static Respuesta<int> Guardar(ENotificacion oNotificacion)
        {
            try
            {
                if (oNotificacion == null)
                {
                    return new Respuesta<int> { Estado = false, Mensaje = "Datos de notificación no válidos." };
                }
                DateTime fechaPresenc = Convert.ToDateTime(oNotificacion.FechaPresencia);
                ENotificacion obj = new ENotificacion
                {
                    IdPropietario = oNotificacion.IdPropietario,
                    IdUsuario = oNotificacion.IdUsuario,
                    Descripcion = oNotificacion.Descripcion,
                    VFechaPresencia = fechaPresenc
                };
                Respuesta<int> respuesta = NNotificacion.GetInstance().RegistrarNotificacion(obj);

                return respuesta;

            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<ENotificacion> ReporteNotificacion(int IdNotifi)
        {
            try
            {
                Respuesta<ENotificacion> respuesta = NNotificacion.GetInstance().ObtenerNotificacionPorIdReport(IdNotifi);

                if (respuesta == null || respuesta.Data == null)
                {
                    return new Respuesta<ENotificacion>
                    {
                        Estado = false,
                        Mensaje = "Ocurrio un problema con la Notificacion"
                    };
                }
                return new Respuesta<ENotificacion>
                {
                    Estado = true,
                    Data = respuesta.Data,
                    Mensaje = "Notificacion encontrada"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<ENotificacion> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
                //throw;
            }
        }

        [WebMethod]
        public static Respuesta<bool> CancelarNotifi(int IdNotifi, bool Activo)
        {
            try
            {
                if (Activo)
                {
                    return new Respuesta<bool> { Estado = false, Mensaje = "Datos de notificación no puede ser verdadro." };
                }
                //var idd = 1;
                return new Respuesta<bool>
                {
                    Estado = true,
                    Mensaje = "Notificacion Cancelada con exito"
                };

            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }
    }
}