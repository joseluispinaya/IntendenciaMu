using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using CapaEntidad;
using CapaNegocio;

namespace CapaPresentacion.Api
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/usuarios")]
    public class UsuariosController : ApiController
    {
        [HttpGet]
        [Route("lista")]
        public IHttpActionResult GetPropietarios()
        {
            var lista = NPropietario.GetInstance().ListaPropietariosApp();

            //if (lista.Data.Count == 0)
            //{
            //    return BadRequest("No se encontraron propietarios.");
            //}

            return Ok(lista);
        }

        [HttpPost]
        [Route("Login")]
        public IHttpActionResult InicioSession(LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrWhiteSpace(loginDTO.Correo) || string.IsNullOrWhiteSpace(loginDTO.Clave))
            {
                return Ok(CrearRespuestaError("Debe ingresar un correo y una clave para iniciar sesión."));
            }

            var respuesta = NUsuario.GetInstance().LoginUsuarioApp(loginDTO.Correo, loginDTO.Clave);

            if (!respuesta.Estado || respuesta.Data == null)
            {
                return Ok(CrearRespuestaError(respuesta.Mensaje ?? "Credenciales incorrectas."));
            }

            if (!respuesta.Data.Activo)
            {
                return Ok(CrearRespuestaError("El usuario está inhabilitado."));
            }

            return Ok(respuesta); // Ya contiene Estado, Mensaje y Data correctamente.
        }

        private Respuesta<EResponseApp> CrearRespuestaError(string mensaje)
        {
            return new Respuesta<EResponseApp>
            {
                Estado = false,
                Mensaje = mensaje,
                Data = null
            };
        }

        [HttpPost]
        [Route("Loginori")]
        public IHttpActionResult InicioSessionOri(LoginDTO loginDTO)
        {
            if (loginDTO == null)
            {
                var respuestaError = new Respuesta<EResponseApp>
                {
                    Estado = false,
                    Mensaje = "Debe ingresar datos para iniciar sesión.",
                    Data = null
                };

                return Ok(respuestaError);
            }

            var respuesta = NUsuario.GetInstance().LoginUsuarioApp(loginDTO.Correo, loginDTO.Clave);
            return Ok(respuesta); // No necesitas reconstruir la respuesta, ya viene completa
        }

        [HttpGet]
        [Route("notifi/{id:int}")]
        public IHttpActionResult GetNotificacionesUser(int id)
        {
            var lista = NNotificacion.GetInstance().NotificacionesPorUsuario(id);

            return Ok(lista);
        }

        [HttpGet]
        [Route("notificaciones/{id:int}")]
        public IHttpActionResult GetNotificaciones(int id)
        {
            var lista = NNotificacion.GetInstance().ObtenerNotificacionesPropi(id);

            //if (lista.Data.Count == 0)
            //{
            //    return BadRequest("No se encontraron notificaciones.");
            //}

            return Ok(lista);
        }

        [HttpPost]
        [Route("notificacion")]
        public IHttpActionResult RegistrarNotifi(NotificacionRequest request)
        {
            if (request == null)
            {
                var respuestaError = new Respuesta<int>
                {
                    Estado = false,
                    Mensaje = "Datos de notificación no válidos."
                };

                return Ok(respuestaError); // Retorna con Ok para mantener la forma de respuesta uniforme
            }

            DateTime fechaPresenc = Convert.ToDateTime(request.FechaPresencia);

            ENotificacion obj = new ENotificacion
            {
                IdPropietario = request.IdPropietario,
                IdUsuario = request.IdUsuario,
                Descripcion = request.Descripcion,
                VFechaPresencia = fechaPresenc
            };

            Respuesta<int> respuesta = NNotificacion.GetInstance().RegistrarNotificacion(obj);

            return Ok(respuesta);
        }

        [HttpGet]
        [Route("notreport/{id:int}")]
        public IHttpActionResult GetReporteNotificacion(int id)
        {
            var respuesta = NNotificacion.GetInstance().ObtenerReport(id);

            return Ok(respuesta);
        }

    }
}