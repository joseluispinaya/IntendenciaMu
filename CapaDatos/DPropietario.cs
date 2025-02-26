﻿using CapaEntidad;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class DPropietario
    {
        #region "PATRON SINGLETON"
        public static DPropietario _instancia = null;

        private DPropietario()
        {

        }

        public static DPropietario GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new DPropietario();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<bool> RegistrarPropietario(EPropietario oPropietario)
        {
            try
            {
                bool respuesta = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarPropietario", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@NroCi", oPropietario.NroCi);
                        cmd.Parameters.AddWithValue("@Nombres", oPropietario.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", oPropietario.Apellidos);
                        cmd.Parameters.AddWithValue("@Celular", oPropietario.Celular);

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
                    Mensaje = respuesta ? "Se registro correctamente" : "Error al registrar ingrese otro Nro CI"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        public Respuesta<bool> ActualizarPropietario(EPropietario oPropietario)
        {
            try
            {
                bool respuesta = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ModificarPropietario", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdPropietario", oPropietario.IdPropietario);
                        cmd.Parameters.AddWithValue("@NroCi", oPropietario.NroCi);
                        cmd.Parameters.AddWithValue("@Nombres", oPropietario.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", oPropietario.Apellidos);
                        cmd.Parameters.AddWithValue("@Celular", oPropietario.Celular);
                        cmd.Parameters.AddWithValue("@Activo", oPropietario.Activo);

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
                    Mensaje = respuesta ? "Se Actualizo correctamente" : "Error al Actualizar intente mas tarde"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        public Respuesta<List<EPropietario>> ObtenerPropietarios()
        {
            try
            {
                List<EPropietario> rptLista = new List<EPropietario>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerPropietario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EPropietario()
                                {
                                    IdPropietario = Convert.ToInt32(dr["IdPropietario"]),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString())
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EPropietario>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Usuarios obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EPropietario>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
