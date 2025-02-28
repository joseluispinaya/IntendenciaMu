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
    }
}