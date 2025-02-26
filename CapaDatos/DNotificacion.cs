using CapaEntidad;
using System;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class DNotificacion
    {
        #region "PATRON SINGLETON"
        public static DNotificacion _instancia = null;

        private DNotificacion()
        {

        }

        public static DNotificacion GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new DNotificacion();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<int> RegistrarNotificacion(ENotificacion oNotificacion)
        {
            try
            {
                int resultado = 0;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarNotificacion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPropietario", oNotificacion.IdPropietario);
                        cmd.Parameters.AddWithValue("@IdUsuario", oNotificacion.IdUsuario);
                        cmd.Parameters.AddWithValue("@Descripcion", oNotificacion.Descripcion);
                        cmd.Parameters.AddWithValue("@FechaPresencia", oNotificacion.FechaPresencia);


                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();
                        resultado = Convert.ToInt32(outputParam.Value);
                    }
                }

                return new Respuesta<int>
                {
                    Estado = resultado > 0,
                    Valor = resultado.ToString(),
                    Mensaje = resultado > 0 ? "Registro realizado correctamente." : "Error al registrar, intente más tarde."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message
                };
            }
        }
    }
}
