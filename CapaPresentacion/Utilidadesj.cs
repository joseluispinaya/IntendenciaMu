using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using CapaEntidad;
using CapaNegocio;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Configuration;

namespace CapaPresentacion
{
    public class Utilidadesj
    {
        private static readonly string OpenAIApiKey = ConfigurationManager.AppSettings["OpenAIApiKey"];
        private static List<TablasEsquema> _esquemaCache = null;

        #region "PATRON SINGLETON"
        public static Utilidadesj _instancia = null;

        private Utilidadesj()
        {

        }

        public static Utilidadesj GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Utilidadesj();
            }
            return _instancia;
        }
        #endregion

        public List<TablasEsquema> EsquemaBD()
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

        public string RespuestaChatGPT(string prompt)
        {
            var url = "https://api.openai.com/v1/chat/completions";

            try
            {
                var esquema = EsquemaBD();
                if (!esquema.Any())
                    return "0 No se pudo cargar el esquema de la base de datos.";

                var esquemaSimplificado = esquema.Select(tabla => new TablasEsquema
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
                        return $"2 Error en la API: {response.StatusCode}";

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    dynamic json = JsonConvert.DeserializeObject(responseString);
                    string respuestaChatbot = json.choices[0].message.content.ToString().Trim();

                    if (respuestaChatbot != "NO_VALIDO" && respuestaChatbot != "NO_EXISTE")
                        return ObtenerRespHumano(prompt, respuestaChatbot);

                    var saludo = RespHumanoSaludo(prompt);
                    if (saludo != "NO_SALUDA")
                        return saludo;

                    var info = RespuestaSoloInformativo(prompt);
                    return info == "SIN_INFORMACION"
                        ? "11 Tu pregunta está fuera de nuestro modelo. Intentá con otra o reformulá tu consulta."
                        : info;
                }
            }
            catch (Exception)
            {
                return "12 Tu pregunta está fuera de nuestro modelo. Intentá con otra o reformulá tu consulta.";
            }
        }

        // metodo para humanizar la respuesta
        public string ObtenerRespHumano(string pregunta, string ConsultaSql)
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
                    model = "gpt-4",
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
        public string RespHumanoSaludo(string pregunta)
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
                    temperature = 0.2,
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
        public string RespuestaSoloInformativo(string pregunta)
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

        public string UploadPhotoA(MemoryStream stream, string folder)
        {
            string rutaa = "";

            try
            {
                stream.Position = 0;

                var guid = Guid.NewGuid().ToString();
                var file = $"{guid}.jpg";

                var fullPath = $"{folder}{file}";
                var path = Path.Combine(HttpContext.Current.Server.MapPath(folder), file);

                // Guardar la imagen en el sistema de archivos
                File.WriteAllBytes(path, stream.ToArray());

                // Verificar si el archivo fue guardado correctamente
                if (File.Exists(path))
                {
                    rutaa = fullPath;
                }
            }
            catch (IOException)
            {
                // Registrar el error en un logger si es necesario
                // Logger.LogError(ioEx.Message);
                rutaa = "";  // Asegura que devuelva una cadena vacía en caso de error de E/S
            }
            catch (Exception)
            {
                // Registrar el error pero continuar el flujo
                // Puedes usar un logger si es necesario
                // Logger.LogError(ex.Message);
                rutaa = "";  // Asegura que devuelva una cadena vacía en caso de error
            }
            return rutaa;
        }


    }
}