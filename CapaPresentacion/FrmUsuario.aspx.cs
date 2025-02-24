using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CapaEntidad;
using CapaNegocio;
using System.Web.Services;
using System.IO;

namespace CapaPresentacion
{
	public partial class FrmUsuario : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

        // Metodo para listar los roles para el usuario
        [WebMethod]
        public static Respuesta<List<ERol>> ObtenerRol()
		{
			try
			{
                Respuesta<List<ERol>> Lista = NUsuario.GetInstance().ListaRoles();
                return Lista;
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ERol>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener los roles: " + ex.Message,
                    Data = null
                };
            }
        }

        // Metodo para listar datos del usuario
        [WebMethod]
        public static Respuesta<List<EUsuario>> ObtenerUsuario()
        {
            try
            {
                Respuesta<List<EUsuario>> Lista = NUsuario.GetInstance().ObtenerUsuarios();
                return Lista;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EUsuario>>()
                {
                    Estado = false,
                    Mensaje = "Error al obtener los usuarios: " + ex.Message,
                    Data = null
                };
            }
        }

        // Metodo para registrar datos del usuario
        [WebMethod]
        public static Respuesta<bool> Guardar(EUsuario oUsuario, byte[] imageBytes)
        {
            try
            {
                // Instancia de Utilidadesj para evitar múltiples llamadas a getInstance()
                var utilidades = Utilidadesj.GetInstance();

                // Procesar la imagen si existe
                string imageUrl = string.Empty;
                if (imageBytes != null && imageBytes.Length > 0)
                {
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/Imagenes/";
                        imageUrl = utilidades.UploadPhotoA(stream, folder);
                    }
                }

                // Crear objeto EUsuario con los datos
                EUsuario obj = new EUsuario
                {
                    Nombres = oUsuario.Nombres,
                    Apellidos = oUsuario.Apellidos,
                    Correo = oUsuario.Correo,
                    Users = oUsuario.Users,
                    Clave = oUsuario.Clave,
                    Celular = oUsuario.Celular,
                    Foto = imageUrl,
                    IdRol = oUsuario.IdRol,
                    TokenSesion = Guid.NewGuid().ToString()
                };

                // Registrar el usuario respuesta.Estado
                Respuesta<bool> respuesta = NUsuario.GetInstance().RegistrarUsuario(obj);
                return respuesta;
            }
            catch (Exception ex)
            {
                // Manejar excepciones
                return new Respuesta<bool>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message
                };
            }
        }


        // Metodo para actualizar datos del usuario
        [WebMethod]
        public static Respuesta<bool> EditarUsuario(EUsuario oUsuario, byte[] imageBytes)
        {
            try
            {
                // Validar que el usuario es correcto
                if (oUsuario == null || oUsuario.IdUsuario <= 0)
                {
                    return new Respuesta<bool>() { Estado = false, Mensaje = "Datos de usuario inválidos" };
                }

                // Obtener el usuario existente
                Respuesta<List<EUsuario>> Lista = NUsuario.GetInstance().ObtenerUsuarios();

                var listaUsuarios = Lista.Data;
                var item = listaUsuarios.FirstOrDefault(x => x.IdUsuario == oUsuario.IdUsuario);
                if (item == null)
                {
                    return new Respuesta<bool>() { Estado = false, Mensaje = "Usuario no encontrado" };
                }

                // Manejar la imagen, si se proporciona una nueva
                string imageUrl = item.Foto;  // Mantener la foto actual por defecto

                if (imageBytes != null && imageBytes.Length > 0)
                {
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/Imagenes/";
                        string newImageUrl = Utilidadesj.GetInstance().UploadPhotoA(stream, folder);

                        if (!string.IsNullOrEmpty(newImageUrl))
                        {
                            // Eliminar la imagen anterior si existe
                            if (!string.IsNullOrEmpty(item.Foto))
                            {
                                string oldImagePath = HttpContext.Current.Server.MapPath(item.Foto);
                                if (File.Exists(oldImagePath))
                                {
                                    File.Delete(oldImagePath);
                                }
                            }
                            imageUrl = newImageUrl;
                        }
                    }
                }

                // Actualizar los datos del usuario
                item.IdUsuario = oUsuario.IdUsuario;
                item.Nombres = oUsuario.Nombres;
                item.Apellidos = oUsuario.Apellidos;
                item.Correo = oUsuario.Correo;
                item.Users = oUsuario.Users;
                item.Clave = oUsuario.Clave;
                item.Celular = oUsuario.Celular;
                item.Foto = imageUrl;
                item.IdRol = oUsuario.IdRol;
                item.Activo = oUsuario.Activo;

                // Guardar cambios
                Respuesta<bool> respuesta = NUsuario.GetInstance().ActualizarUsuario(item);
                return respuesta;
            }
            catch (IOException ioEx)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Error al manejar la imagen: " + ioEx.Message };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Ocurrió un error: " + ex.Message };
            }
        }

    }
}