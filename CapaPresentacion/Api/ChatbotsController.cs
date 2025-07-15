using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using CapaEntidad;

namespace CapaPresentacion.Api
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/chatbots")]
    public class ChatbotsController : ApiController
    {

        [HttpPost]
        [Route("chatbot")]
        public IHttpActionResult PostRespuesta(PromptData request)
        {
            if (request == null || string.IsNullOrEmpty(request.PromptSistema))
            {
                var respuestaError = new Respuesta<string>()
                {
                    Estado = true,
                    Mensaje = "Debe ingresar una pregunta",
                    Data = "Debe ingresar una pregunta."
                };

                return Ok(respuestaError);
            }

            var respChatbot = Utilidadesj.GetInstance().RespuestaChatGPT(request.PromptSistema);

            var respuest = new Respuesta<string>()
            {
                Estado = true,
                Mensaje = "Respuesta Generada",
                Data = respChatbot
            };

            return Ok(respuest);

        }

    }
}