using CapaEntidad;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;

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
                        cmd.Parameters.AddWithValue("@FechaPresencia", oNotificacion.VFechaPresencia);


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

        public Respuesta<List<ENotificacion>> ObtenerNotificacionId(int Idpropietario)
        {
            try
            {
                List<ENotificacion> rptLista = new List<ENotificacion>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerNotificacionesId", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.CommandTimeout = 30;
                        comando.Parameters.AddWithValue("@IdPropietario", Idpropietario);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ENotificacion()
                                {
                                    IdNotificacion = Convert.ToInt32(dr["IdNotificacion"]),
                                    Codigo = dr["Codigo"].ToString(),
                                    IdPropietario = Convert.ToInt32(dr["IdPropietario"]),
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    FechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                                    Propietario = new EPropietario()
                                    {
                                        Nombres = dr["PropietarioNombres"].ToString(),
                                        Apellidos = dr["PropietarioApellidos"].ToString(),
                                        Celular = dr["Celular"].ToString()
                                    },
                                    Usuario = new EUsuario()
                                    {
                                        Nombres = dr["UsuarioNombres"].ToString(),
                                        Apellidos = dr["UsuarioApellidos"].ToString()
                                    },
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Notificaciones obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<ENotificacion>> ObtenerNotificacionIdPrueba(int Idpropietario)
        {
            try
            {
                List<ENotificacion> rptLista = new List<ENotificacion>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerNotificacionesId", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.CommandTimeout = 30;
                        comando.Parameters.AddWithValue("@IdPropietario", Idpropietario);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ENotificacion()
                                {
                                    IdNotificacion = dr.GetInt32(dr.GetOrdinal("IdNotificacion")),
                                    Codigo = dr.GetString(dr.GetOrdinal("Codigo")),
                                    IdPropietario = dr.GetInt32(dr.GetOrdinal("IdPropietario")),
                                    IdUsuario = dr.GetInt32(dr.GetOrdinal("IdUsuario")),
                                    Descripcion = dr.GetString(dr.GetOrdinal("Descripcion")),
                                    FechaPresencia = dr.GetDateTime(dr.GetOrdinal("FechaPresencia")).ToString("dd/MM/yyyy"),
                                    VFechaPresencia = dr.GetDateTime(dr.GetOrdinal("FechaPresencia")),
                                    Activo = dr.GetBoolean(dr.GetOrdinal("Activo")),
                                    FechaRegistro = dr.GetDateTime(dr.GetOrdinal("FechaRegistro")).ToString("dd MMM yyyy", new CultureInfo("es-ES")),
                                    //FechaPresencia = dr.GetDateTime(dr.GetOrdinal("FechaRegistro")).ToString("dd MMM yyyy", new CultureInfo("en-US")),
                                    //FechaRegistro = dr.GetDateTime(dr.GetOrdinal("FechaRegistro")).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = dr.GetDateTime(dr.GetOrdinal("FechaRegistro")),
                                    Propietario = new EPropietario()
                                    {
                                        Nombres = dr.GetString(dr.GetOrdinal("PropietarioNombres")),
                                        Apellidos = dr.GetString(dr.GetOrdinal("PropietarioApellidos")),
                                        Celular = dr.GetString(dr.GetOrdinal("Celular"))
                                    },
                                    Usuario = new EUsuario()
                                    {
                                        Nombres = dr.GetString(dr.GetOrdinal("UsuarioNombres")),
                                        Apellidos = dr.GetString(dr.GetOrdinal("UsuarioApellidos"))
                                    }
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Notificaciones obtenidas correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<ENotificacion> ObtenerNotificacionPorIdReport(int IdNotifi)
        {
            try
            {
                ENotificacion obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_NotificacionId", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.CommandTimeout = 30;
                        comando.Parameters.AddWithValue("@IdNotificacion", IdNotifi);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.HasRows && dr.Read())
                            {
                                obj = new ENotificacion
                                {
                                    IdNotificacion = Convert.ToInt32(dr["IdNotificacion"]),
                                    Codigo = dr["Codigo"].ToString(),
                                    IdPropietario = Convert.ToInt32(dr["IdPropietario"]),
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    FechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                                    Propietario = new EPropietario()
                                    {
                                        Nombres = dr["PropietarioNombres"].ToString(),
                                        Apellidos = dr["PropietarioApellidos"].ToString(),
                                        Celular = dr["Celular"].ToString()
                                    },
                                    Usuario = new EUsuario()
                                    {
                                        Nombres = dr["UsuarioNombres"].ToString(),
                                        Apellidos = dr["UsuarioApellidos"].ToString()
                                    },
                                };
                            }
                        }
                    }
                }

                return new Respuesta<ENotificacion>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Notificacion obtenido correctamente" : "Ocurrio un error con la notificacion"
                };
            }
            catch (SqlException ex)
            {
                // Manejo de excepciones relacionadas con la base de datos
                return new Respuesta<ENotificacion>
                {
                    Estado = false,
                    Mensaje = "Error en la base de datos: " + ex.Message,
                    Data = null
                };
            }
            catch (Exception ex)
            {
                // Manejo de excepciones generales
                return new Respuesta<ENotificacion>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error inesperado: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<bool> CancelarNotificacion(int IdNoti)
        {
            try
            {
                bool respuesta = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_CancelarNotificacion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdNotificacion", IdNoti);

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
                    Mensaje = respuesta ? "Se cancelo la notificacion correctamente" : "Error al intentar cancelar la notificacion intente mas tarde"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

        public Respuesta<List<ENotificacion>> NotificacionesPorUsuario(int IdUsuario)
        {
            try
            {
                List<ENotificacion> rptLista = new List<ENotificacion>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_NotificacionesPorUsuario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.CommandTimeout = 30;
                        comando.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ENotificacion()
                                {
                                    IdNotificacion = Convert.ToInt32(dr["IdNotificacion"]),
                                    Codigo = dr["Codigo"].ToString(),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    FechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaPresencia = Convert.ToDateTime(dr["FechaPresencia"].ToString()),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                                    Propietario = new EPropietario()
                                    {
                                        Nombres = dr["PropietarioNombres"].ToString(),
                                        Apellidos = dr["PropietarioApellidos"].ToString(),
                                        Celular = dr["Celular"].ToString()
                                    },
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Notificaciones obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ENotificacion>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<EReporteNotFe>> NotificacionRpt(string FechaInicio, string FechaFin)
        {
            try
            {
                List<EReporteNotFe> rptLista = new List<EReporteNotFe>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_NotificacionPorFecha", con))
                    {
                        comando.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                        comando.Parameters.AddWithValue("@FechaFin", FechaFin);
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EReporteNotFe()
                                {
                                    IdNotificacion = Convert.ToInt32(dr["IdNotificacion"]),
                                    Codigo = dr["Codigo"].ToString(),
                                    Descripcion = dr["Descripcion"].ToString(),
                                    Estado = dr["Estado"].ToString(),
                                    FechaRegistro = dr["FechaRegistro"].ToString(),
                                    NombrePropietario = dr["NombrePropietario"].ToString(),
                                    NombreUsuario = dr["NombreUsuario"].ToString()

                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EReporteNotFe>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EReporteNotFe>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<EUsuario>> ObtenerUsuariosMasNotifica()
        {
            try
            {
                List<EUsuario> rptLista = new List<EUsuario>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerUsuario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                EUsuario propie = new EUsuario()
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    Users = dr["Users"].ToString(),
                                    Clave = dr["Clave"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    Foto = dr["Foto"].ToString(),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    TokenSesion = dr["Token"].ToString(),
                                    Activo = Convert.ToBoolean(dr["Activo"]),
                                    FechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                    VFechaRegistro = Convert.ToDateTime(dr["FechaRegistro"].ToString()),
                                    Rol = new ERol() { Descripcion = dr["DescripcionRol"].ToString() },
                                    ListaNotificacion = new List<ENotificacion>() // Inicializamos la lista vacía
                                };
                                rptLista.Add(propie);
                            }
                        }
                    }
                    //Paso 2: Obtener las mascotas para cada propietario
                    foreach (var propie in rptLista)
                    {
                        using (SqlCommand productoCmd = new SqlCommand("usp_NotificacionesPorUsuarioRpt", con))
                        {
                            productoCmd.CommandType = CommandType.StoredProcedure;
                            productoCmd.Parameters.AddWithValue("@IdUsuario", propie.IdUsuario);

                            using (SqlDataReader productoDr = productoCmd.ExecuteReader())
                            {
                                while (productoDr.Read())
                                {
                                    ENotificacion masco = new ENotificacion()
                                    {
                                        IdNotificacion = Convert.ToInt32(productoDr["IdNotificacion"]),
                                        Codigo = productoDr["Codigo"].ToString(),
                                        Descripcion = productoDr["Descripcion"].ToString(),
                                        FechaPresencia = Convert.ToDateTime(productoDr["FechaPresencia"].ToString()).ToString("dd/MM/yyyy"),
                                        VFechaPresencia = Convert.ToDateTime(productoDr["FechaPresencia"].ToString()),
                                        Activo = Convert.ToBoolean(productoDr["Activo"]),
                                        FechaRegistro = Convert.ToDateTime(productoDr["FechaRegistro"].ToString()).ToString("dd/MM/yyyy"),
                                        VFechaRegistro = Convert.ToDateTime(productoDr["FechaRegistro"].ToString()),
                                        Propietario = new EPropietario()
                                        {
                                            Nombres = productoDr["PropietarioNombres"].ToString(),
                                            Apellidos = productoDr["PropietarioApellidos"].ToString(),
                                            Celular = productoDr["Celular"].ToString()
                                        },
                                    };

                                    propie.ListaNotificacion.Add(masco);
                                }
                            }
                        }
                    }
                }
                return new Respuesta<List<EUsuario>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Propietarios y mascotas obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EUsuario>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }
    }
}
