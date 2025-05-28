using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CapaEntidad;
using CapaNegocio;
using System.Web.Services;
using System.Data;

namespace CapaPresentacion
{
	public partial class Default : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        [WebMethod]
        public static Respuesta<List<TablasEsquema>> ObtenerEsquemaBD()
        {
            try
            {

                Respuesta<List<TablasEsquema>> Lista = NChatBot.GetInstance().ObtenerEsquemaBDNuevo();
                return Lista;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<TablasEsquema>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener el esquema: " + ex.Message,
                    Data = null
                };
            }
        }

        [WebMethod]
        public static Respuesta<List<Dictionary<string, object>>> ConsultaSql(string ConsultaSql)
        {
            var resultado = NChatBot.GetInstance().EjecutarConsultaLibre(ConsultaSql);

            if (!resultado.Estado || resultado.Data == null)
                return new Respuesta<List<Dictionary<string, object>>>()
                {
                    Estado = false,
                    Mensaje = resultado.Mensaje,
                    Data = null
                };

            // Convertir DataTable a lista de diccionarios para serializar en JSON
            var lista = new List<Dictionary<string, object>>();
            foreach (DataRow row in resultado.Data.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in resultado.Data.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                lista.Add(dict);
            }

            return new Respuesta<List<Dictionary<string, object>>>()
            {
                Estado = true,
                Mensaje = resultado.Mensaje,
                Data = lista
            };
        }
    }
}