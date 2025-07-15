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
    public class DNegocio
    {
        #region "PATRON SINGLETON"
        public static DNegocio _instancia = null;

        private DNegocio()
        {

        }

        public static DNegocio GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new DNegocio();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<bool> RegistrarNegocio(ENegocio oNegocio)
        {
            try
            {
                bool respuesta = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarNegocio", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@NroPadron", oNegocio.NroPadron);
                        cmd.Parameters.AddWithValue("@NombreNegocio", oNegocio.NombreNegocio);
                        cmd.Parameters.AddWithValue("@Actividad", oNegocio.Actividad);
                        cmd.Parameters.AddWithValue("@Ubicacion", oNegocio.Ubicacion);
                        cmd.Parameters.AddWithValue("@Valides", oNegocio.Valides);
                        cmd.Parameters.AddWithValue("@CodQr", oNegocio.CodQr);
                        cmd.Parameters.AddWithValue("@IdPropietario", oNegocio.IdPropietario);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Bit)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();
                        respuesta = Convert.ToBoolean(outputParam.Value);
                    }
                }
                return new Respuesta<bool>
                {
                    Estado = respuesta,
                    Mensaje = respuesta ? "Se registro correctamente" : "Error al registrar intente mas tarde"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        public Respuesta<bool> ActualizarNegocio(ENegocio oNegocio)
        {
            try
            {
                bool respuesta = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarNegocio", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdNegocio", oNegocio.IdNegocio);
                        cmd.Parameters.AddWithValue("@NroPadron", oNegocio.NroPadron);
                        cmd.Parameters.AddWithValue("@NombreNegocio", oNegocio.NombreNegocio);
                        cmd.Parameters.AddWithValue("@Actividad", oNegocio.Actividad);
                        cmd.Parameters.AddWithValue("@Ubicacion", oNegocio.Ubicacion);
                        cmd.Parameters.AddWithValue("@Valides", oNegocio.Valides);
                        cmd.Parameters.AddWithValue("@CodQr", oNegocio.CodQr);
                        cmd.Parameters.AddWithValue("@Activo", oNegocio.Activo);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Bit)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();
                        respuesta = Convert.ToBoolean(outputParam.Value);
                    }
                }
                return new Respuesta<bool>
                {
                    Estado = respuesta,
                    Mensaje = respuesta ? "Se actualizo correctamente" : "Error al actualizar intente mas tarde"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        public Respuesta<List<ENegocio>> ObtenerNegociosIdPropi(int Idpropietario)
        {
            try
            {
                List<ENegocio> rptLista = new List<ENegocio>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerNegociosIdPropi", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.CommandTimeout = 30;
                        comando.Parameters.AddWithValue("@IdPropietario", Idpropietario);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ENegocio()
                                {
                                    IdNegocio = Convert.ToInt32(dr["IdNegocio"]),
                                    NroPadron = dr["NroPadron"].ToString(),
                                    NombreNegocio = dr["NombreNegocio"].ToString(),

                                    Actividad = dr["Actividad"].ToString(),
                                    Ubicacion = dr["Ubicacion"].ToString(),
                                    Valides = dr["Valides"].ToString(),
                                    CodQr = dr["CodQr"].ToString(),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ENegocio>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Negocios obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ENegocio>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
