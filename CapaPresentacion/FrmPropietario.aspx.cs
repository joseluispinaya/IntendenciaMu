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
	public partial class FrmPropietario : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        [WebMethod]
        public static Respuesta<List<EPropietario>> ObtenerPropietarios()
        {
            try
            {
                Respuesta<List<EPropietario>> Lista = NPropietario.GetInstance().ObtenerPropietarios();
                return Lista;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EPropietario>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener los usuarios: " + ex.Message,
                    Data = null
                };
            }
        }

        [WebMethod]
        public static Respuesta<bool> GurdarPropietario(EPropietario oPropietario)
        {
            try
            {
                Respuesta<bool> respuesta = NPropietario.GetInstance().RegistrarPropietario(oPropietario);
                return respuesta;
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<bool> ActualizarPropietario(EPropietario oPropietario)
        {
            try
            {
                Respuesta<bool> respuesta = NPropietario.GetInstance().ActualizarPropietario(oPropietario);
                return respuesta;
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }
    }
}