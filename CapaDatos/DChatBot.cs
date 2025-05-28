using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class DChatBot
    {
        #region "PATRON SINGLETON"
        public static DChatBot conexion = null;

        public DChatBot() { }

        public static DChatBot GetInstance()
        {
            if (conexion == null)
            {
                conexion = new DChatBot();
            }
            return conexion;
        }
        #endregion

        public Respuesta<List<TablasEsquema>> ObtenerEsquemaBDNuevo()
        {
            try
            {
                List<TablasEsquema> esquemaBD = new List<TablasEsquema>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    con.Open();

                    // Obtener todas las tablas
                    DataTable tablas = con.GetSchema("Tables");

                    foreach (DataRow row in tablas.Rows)
                    {
                        string nombreTabla = row["TABLE_NAME"].ToString();

                        // Crear un objeto TablasEsquema para cada tabla
                        TablasEsquema tablaEsquema = new TablasEsquema
                        {
                            NombreTabla = nombreTabla,
                            Columnas = new List<ColumnaEsquema>()
                        };

                        // Obtener las columnas para la tabla actual
                        DataTable columnas = con.GetSchema("Columns", new string[] { null, null, nombreTabla });

                        foreach (DataRow columnaRow in columnas.Rows)
                        {
                            // Mapear las columnas a la clase ColumnaEsquema
                            ColumnaEsquema columnaEsquema = new ColumnaEsquema
                            {
                                NombreColumna = columnaRow["COLUMN_NAME"].ToString(),
                                TipoDato = columnaRow["DATA_TYPE"].ToString(),
                                EsNullable = columnaRow["IS_NULLABLE"].ToString() == "YES"
                            };

                            tablaEsquema.Columnas.Add(columnaEsquema);
                        }

                        // Agregar la tabla con sus columnas al esquemaBD
                        esquemaBD.Add(tablaEsquema);
                    }
                }

                return new Respuesta<List<TablasEsquema>>()
                {
                    Estado = true,
                    Mensaje = "Esquema de la base de datos obtenido correctamente.",
                    Valor = null,
                    Data = esquemaBD
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<TablasEsquema>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener el esquema: " + ex.Message,
                    Valor = null,
                    Data = null
                };
            }
        }

        public Respuesta<DataTable> EjecutarConsultaLibre(string consultaSql)
        {
            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand(consultaSql, con))
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            DataTable resultado = new DataTable();
                            da.Fill(resultado);

                            return new Respuesta<DataTable>()
                            {
                                Estado = true,
                                Mensaje = "Consulta ejecutada correctamente.",
                                Valor = null,
                                Data = resultado
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new Respuesta<DataTable>()
                {
                    Estado = false,
                    Mensaje = "Error al ejecutar la consulta: " + ex.Message,
                    Valor = null,
                    Data = null
                };
            }
        }
    }
}
