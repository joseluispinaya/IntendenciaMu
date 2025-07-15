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
	public partial class FrmNegocio : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        [WebMethod]
        public static Respuesta<List<ENegocio>> ObtenerListaNegocios(int IdPropi)
        {
            try
            {
                Respuesta<List<ENegocio>> Lista = NNegocio.GetInstance().ObtenerNegociosIdPropi(IdPropi);
                return Lista;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ENegocio>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener los negocios: " + ex.Message,
                    Data = null
                };
            }
        }


        [WebMethod]
        public static Respuesta<bool> Guardar(ENegocio oNegocio)
        {
            try
            {
                if (oNegocio == null)
                {
                    return new Respuesta<bool> { Estado = false, Mensaje = "Datos del Negocio no válidos." };
                }
                string codQr = string.Empty;
                ENegocio obj = new ENegocio
                {
                    NroPadron = oNegocio.NroPadron,
                    NombreNegocio = oNegocio.NombreNegocio,
                    Actividad = oNegocio.Actividad,
                    Ubicacion = oNegocio.Ubicacion,
                    Valides = oNegocio.Valides,
                    CodQr = codQr,
                    IdPropietario = oNegocio.IdPropietario
                };
                Respuesta<bool> respuesta = NNegocio.GetInstance().RegistrarNegocio(obj);

                return respuesta;

            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

    }
}