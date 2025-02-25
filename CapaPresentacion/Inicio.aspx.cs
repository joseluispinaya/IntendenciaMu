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
	public partial class Inicio : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        [WebMethod]
        public static Respuesta<string> ObtenerToken(int IdUsu)
        {
            try
            {
                Respuesta<string> tokendb = NUsuario.GetInstance().ObtenerToken(IdUsu);
                return tokendb;
            }
            catch (Exception)
            {
                return new Respuesta<string>() { Estado = false };
            }
        }

        [WebMethod]
        public static Respuesta<bool> CerrarSesion()
        {
            //Configuracion.Ousuario = null;

            return new Respuesta<bool>() { Estado = true };

        }
    }
}