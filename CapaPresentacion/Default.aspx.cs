using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CapaEntidad;
using CapaNegocio;
using System.Web.Services;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.IO;

namespace CapaPresentacion
{
	public partial class Default : System.Web.UI.Page
	{
        private const string OpenAIApiKey = "mi api";
        private static List<TablasEsquema> _esquemaCache = null; // Cache para esquema

        protected void Page_Load(object sender, EventArgs e)
		{
            Response.AppendHeader("Cache-Control", "no-store");
        }

        private static List<TablasEsquema> EsquemaBD()
        {
            if (_esquemaCache != null)
                return _esquemaCache;

            var respuesta = NChatBot.GetInstance().ObtenerEsquemaBDNuevo();
            if (respuesta.Estado)
            {
                _esquemaCache = respuesta.Data;
            }
            else
            {
                _esquemaCache = new List<TablasEsquema>();
            }

            return _esquemaCache;
        }

        // metodo para generar una respuesta del chat bot
        [WebMethod]
        public static Respuesta<string> RespuestaChatGPT(string prompt)
        {
            var url = "https://api.openai.com/v1/chat/completions";

            try
            {
                if (string.IsNullOrEmpty(prompt))
                {
                    return new Respuesta<string>()
                    {
                        //Estado = false,
                        Estado = true,
                        Valor = "La pregunta esta vacia",
                        Mensaje = "Debe ingresar una pregunta",
                        Data = "1 Debe ingresar una pregunta."
                    };
                }

                //aqui mi logica para openia
                List<TablasEsquema> Esquema = EsquemaBD();

                if (!Esquema.Any())
                {
                    return new Respuesta<string>()
                    {
                        Estado = true,
                        Valor = "No se cargó el esquema",
                        Mensaje = "Ocurrió un inconveniente al obtener el esquema de la base de datos.",
                        Data = "0 No se pudo cargar el esquema de la base de datos."
                    };
                }


                var esquemaSimplificado = Esquema.Select(tabla => new TablasEsquema
                {
                    NombreTabla = tabla.NombreTabla,
                    Columnas = tabla.Columnas.Select(col => new ColumnaEsquema
                    {
                        NombreColumna = col.NombreColumna,
                        TipoDato = col.TipoDato
                    }).ToList()
                }).ToList();

                string esquemaJson = JsonConvert.SerializeObject(esquemaSimplificado, Formatting.Indented);

                var promptSistema = $@"
                    Eres un generador automático de consultas T-SQL exclusivo para Microsoft SQL Server. No eres un asistente conversacional ni realizas ninguna otra tarea.

                    Tu ÚNICA función es convertir instrucciones en lenguaje natural en **sentencias SQL de tipo SELECT**, válidas y optimizadas, utilizando exclusivamente el siguiente esquema de base de datos:

                    {esquemaJson}

                    Debes interpretar correctamente términos ambiguos o sinónimos usando el siguiente diccionario:

                    DICCIONARIO DE SINÓNIMOS:
                    - USUARIO: usuarios, cuentas, personas del sistema, quienes usan el sistema
                    - ROL: roles, permisos, tipo de acceso, perfil
                    - PROPIETARIO: propietarios, dueños, titulares, personas que registran negocios
                    - NEGOCIO: negocios, empresas, comercios, locales, tiendas
                    - NOTIFICACION: notificaciones, alertas, reportes, clausuras
                    - ACTIVIDADES: actividades, eventos, acciones, publicaciones

                    CAMPOS COMUNES:
                    - Nombres: nombre, nombres, nombre completo
                    - Apellidos: apellido, apellidos
                    - Correo: email, correo electrónico
                    - Users: nombre de usuario, usuario
                    - Clave: contraseña, clave
                    - Celular: teléfono, número, celular
                    - Foto: imagen, fotografía
                    - Ubicacion: dirección, ubicación, lugar
                    - FechaRegistro: fecha de registro, fecha, cuándo fue creado
                    - IdRol: rol, perfil, tipo de usuario
                    - IdPropietario: dueño, propietario
                    - IdUsuario: usuario, responsable
                    - NombreNegocio: nombre del negocio, nombre comercial
                    - Actividad: actividad, giro, rubro
                    - Titulo: título, nombre de la actividad
                    - Descripcion: descripción, detalle, información
                    - FechaPresencia: fecha de presencia, fecha de verificación

                    REGLAS ESTRICTAS Y OBLIGATORIAS QUE DEBES CUMPLIR:

                    1. SOLO responde con una sentencia SQL de tipo SELECT si la instrucción es válida y está relacionada con el esquema proporcionado.
                    2. NO respondas saludos, despedidas, explicaciones ni ninguna conversación general.
                    3. SI la instrucción NO está relacionada con el esquema, responde únicamente con: NO_EXISTE
                    4. SI la instrucción solicita o implica cualquier operación que no sea SELECT (por ejemplo: INSERT, UPDATE, DELETE, CREATE, DROP, ALTER), responde únicamente con: NO_VALIDO
                    5. NO uses ningún bloque de código Markdown ni decoradores. Devuelve exclusivamente texto plano.
                    6. NO des comentarios, encabezados, descripciones ni justificaciones.
                    7. NO inventes nombres de tablas, columnas ni valores. Usa solamente los definidos en el esquema proporcionado.
                    8. SI la instrucción es ambigua pero puede deducirse razonablemente a una consulta SELECT con base en los sinónimos y campos comunes, genera la consulta SELECT correspondiente.
                    9. SI la instrucción es puramente conversacional o no contiene ninguna solicitud de consulta, responde únicamente con: NO_EXISTE

                    EJEMPLOS DE RESPUESTA ESPERADA:

                    ""original_query"": ""Mostrar los últimos 10 usuarios registrados.""
                    ""sql_query"": ""SELECT TOP 10 * FROM USUARIO ORDER BY IdUsuario DESC;""

                    ""original_query"": ""Listar todos los negocios activos.""
                    ""sql_query"": ""SELECT * FROM NEGOCIO WHERE Activo = 1;""

                    ""original_query"": ""Mostrar las notificaciones del propietario Juan Pérez.""
                    ""sql_query"": ""SELECT N.* FROM NOTIFICACION N INNER JOIN PROPIETARIO P ON N.IdPropietario = P.IdPropietario WHERE P.Nombres = 'Juan' AND P.Apellidos = 'Pérez';""

                    ""original_query"": ""Ver el nombre y ubicación de los negocios registrados por el propietario con CI 12345678.""
                    ""sql_query"": ""SELECT N.NombreNegocio, N.Ubicacion FROM NEGOCIO N INNER JOIN PROPIETARIO P ON N.IdPropietario = P.IdPropietario WHERE P.NroCi = '12345678';""

                    ""original_query"": ""Cuántas actividades se registraron este mes.""
                    ""sql_query"": ""SELECT COUNT(*) FROM ACTIVIDADES WHERE MONTH(FechaRegistro) = MONTH(GETDATE()) AND YEAR(FechaRegistro) = YEAR(GETDATE());""

                    ""original_query"": ""Mostrar los nombres de usuario y su rol.""
                    ""sql_query"": ""SELECT U.Users, R.Descripcion FROM USUARIO U INNER JOIN ROL R ON U.IdRol = R.IdRol;""

                    Ahora, genera ÚNICAMENTE la sentencia SQL correspondiente para el siguiente requerimiento:
                    ";


                var requestBody = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                        new { role = "system", content = promptSistema },
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.2,
                    max_tokens = 300
                };

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {OpenAIApiKey}");
                    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                    var response = client.PostAsync(url, content).GetAwaiter().GetResult();

                    if (!response.IsSuccessStatusCode)
                    {
                        return new Respuesta<string>()
                        {
                            //Estado = false,
                            Estado = true,
                            Valor = $"Error en la API: {response.StatusCode}",
                            Mensaje = "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.",
                            Data = "2 Ocurrio un Problema al interactuar con el modelo."
                        };
                    }

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    dynamic json = JsonConvert.DeserializeObject(responseString);

                    string respuestaChatbot = json.choices[0].message.content.ToString().Trim();

                    if (respuestaChatbot != "NO_VALIDO" && respuestaChatbot != "NO_EXISTE")
                    {
                        string res = ObtenerRespHumano(prompt, respuestaChatbot);

                        return new Respuesta<string>()
                        {
                            Estado = true,
                            Mensaje = "OK",
                            Data = res
                        };

                    }

                    string reSalu = RespHumanoSaludo(prompt);
                    if (reSalu != "NO_SALUDA")
                    {
                        return new Respuesta<string>()
                        {
                            Estado = true,
                            Mensaje = "OK",
                            Data = reSalu
                        };
                    }

                    string resInfo = RespuestaSoloInformativo(prompt);

                    if (resInfo == "SIN_INFORMACION")
                    {
                        return new Respuesta<string>()
                        {
                            Estado = true,
                            Mensaje = "OK",
                            Data = "11 Tu pregunta está fuera de nuestro modelo. Intentá con otra o reformulá tu consulta."
                        };
                    }

                    return new Respuesta<string>()
                    {
                        Estado = true,
                        Mensaje = "OK",
                        Data = resInfo
                    };

                }
            }
            catch (Exception)
            {
                return new Respuesta<string>()
                {
                    Estado = true,
                    Valor = "Error en el catch",
                    Mensaje = "Ocurrio un error intente mas tarde",
                    Data = "12 Tu pregunta está fuera de nuestro modelo. Intentá con otra o reformulá tu consulta."
                };
            }
        }

        // metodo para humanizar la respuesta
        private static string ObtenerRespHumano(string pregunta, string ConsultaSql)
        {
            var url = "https://api.openai.com/v1/chat/completions";

            try
            {
                var resultado = NChatBot.GetInstance().EjecutarConsultaLibre(ConsultaSql);

                if (!resultado.Estado || resultado.Data == null)
                {
                    return "3 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
                }

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

                string esquemaJson = JsonConvert.SerializeObject(lista, Formatting.Indented);

                var promptSistema = $@"
                    Eres un asistente de IA que responde preguntas de forma clara, amigable y profesional.

                    Instrucciones:
                    - Tienes la pregunta original de un usuario y los datos obtenidos de la base de datos en formato JSON.
                    - Tu tarea es interpretar exclusivamente los datos y generar una respuesta útil, bien redactada y natural.
                    - No inventes información que no esté presente en los datos.
                    - No repitas literalmente el JSON en la respuesta.
                    - Si los datos están vacíos o no hay resultados, indícalo de forma educada.

                    Ejemplo:
                    Pregunta: ""¿Cuántos usuarios hay registrados?""
                    Datos: [{{ ""total"": 152 }}]
                    Respuesta esperada: ""Actualmente hay 152 usuarios registrados en el sistema.""

                    Ahora responde amablemente la siguiente pregunta del usuario usando únicamente los datos proporcionados.
                    ";

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = promptSistema },
                        new { role = "user", content = $"Pregunta: {pregunta}\nDatos: {esquemaJson}" }
                    },
                    temperature = 0.5,
                    max_tokens = 300
                };

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {OpenAIApiKey}");
                    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                    var response = client.PostAsync(url, content).GetAwaiter().GetResult();

                    if (!response.IsSuccessStatusCode)
                    {
                        return "4 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
                    }

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    dynamic json = JsonConvert.DeserializeObject(responseString);

                    return json.choices[0].message.content.ToString().Trim();
                }
            }
            catch (Exception)
            {
                return "5 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
            }
        }

        // metodo para responder ante solo a posible saludo o despedida
        private static string RespHumanoSaludo(string pregunta)
        {
            var url = "https://api.openai.com/v1/chat/completions";

            try
            {

                var mensajeSistema = $@"
                    Eres un asistente de IA que solo responde saludos o despedidas.

                    - Si el mensaje del usuario es un saludo (como ""Hola"", ""Buenos días"") o una despedida (como ""Gracias, hasta luego""), responde de forma amable y profesional.
                    - Si el mensaje NO es un saludo o despedida, responde exactamente con: NO_SALUDA (sin comillas). No expliques por qué no es un saludo ni agregues ningún comentario. Si no estás seguro, responde NO_SALUDA.

                    Ejemplos:
                    - Usuario: ""Hola""
                    Respuesta: ""¡Hola! ¿En qué puedo ayudarte hoy?""
                    - Usuario: ""Gracias, hasta luego""
                    Respuesta: ""¡Gracias a ti! Que tengas un excelente día.""
                    - Usuario: ""¿Cuál es la capital de Francia?""
                    Respuesta: ""NO_SALUDA""

                    Responde ahora según estas instrucciones:
                    ";



                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = mensajeSistema },
                        new { role = "user", content = pregunta }
                    },
                    temperature = 0.5,
                    max_tokens = 100
                };

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {OpenAIApiKey}");
                    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                    var response = client.PostAsync(url, content).GetAwaiter().GetResult();

                    if (!response.IsSuccessStatusCode)
                    {
                        return "6 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
                    }

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    dynamic json = JsonConvert.DeserializeObject(responseString);

                    return json.choices[0].message.content.ToString().Trim();
                }
            }
            catch (Exception)
            {
                return "7 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
            }
        }

        // metodo para responder ante informacion
        private static string RespuestaSoloInformativo(string pregunta)
        {
            var url = "https://api.openai.com/v1/chat/completions";

            try
            {
                // aqui leer el archivo para asignar a promptSistema
                string ruta = HttpContext.Current.Server.MapPath("/informacion.json");

                if (!File.Exists(ruta))
                {
                    return "8 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
                }

                string jsonx = File.ReadAllText(ruta);
                PromptData data = JsonConvert.DeserializeObject<PromptData>(jsonx);


                var requestBody = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                        new { role = "system", content = data.PromptSistema },
                        new { role = "user", content = pregunta }
                    },
                    temperature = 0.5,
                    max_tokens = 200
                };

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {OpenAIApiKey}");
                    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                    var response = client.PostAsync(url, content).GetAwaiter().GetResult();

                    if (!response.IsSuccessStatusCode)
                    {
                        return "9 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
                    }

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    dynamic json = JsonConvert.DeserializeObject(responseString);

                    return json.choices[0].message.content.ToString().Trim();
                }
            }
            catch (Exception)
            {
                return "10 Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
            }
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