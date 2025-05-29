

let prompt = document.querySelector("#prompt")
let submitbtn = document.querySelector("#submit")
let chatContainer = document.querySelector(".chat-container")

let esquemaSimplificado = [];
const tokenOPENAI = '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';

let user = {
    message: null
}
const chatHistoryz = [];

$(document).ready(function () {
    obtenerEsquema();
});

function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}


function obtenerEsquema() {
    $.ajax({
        type: "POST",
        url: "Default.aspx/ObtenerEsquemaBD",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const esquema = response.d.Data;
                esquemaSimplificado = esquema.map(tabla => ({
                    NombreTabla: tabla.NombreTabla,
                    Columnas: tabla.Columnas.map(col => ({
                        NombreColumna: col.NombreColumna,
                        TipoDato: col.TipoDato
                    }))
                }));
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

async function responderAnteFueraContexto(preguntaUsuario) {
    const mensajeSistema = `
        Eres un asistente de IA que solo responde saludos o despedidas.

        - Si el mensaje del usuario es un saludo (como "Hola", "Buenos días") o una despedida (como "Gracias, hasta luego"), responde de forma amable y profesional.
        - Si el mensaje NO es un saludo o despedida, responde exactamente con: NO_SALUDA (sin comillas).

        Ejemplos:
        - Usuario: "Hola"
          Respuesta: "¡Hola! ¿En qué puedo ayudarte hoy?"
        - Usuario: "Gracias, hasta luego"
          Respuesta: "¡Gracias a ti! Que tengas un excelente día."
        - Usuario: "¿Cuál es la capital de Francia?"
          Respuesta: "NO_SALUDA"

        Responde ahora según estas instrucciones:
        `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenOPENAI}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: mensajeSistema },
                    { role: "user", content: preguntaUsuario }
                ],
                temperature: 0.2,
                max_tokens: 100
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error.message || "Error al llamar al modelo entrenado");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Error al responder:", error.message);
        return "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
    }
}

async function generarRespuestaInten(preguntaUsuario) {

    const promptSistema = `
        Eres un asistente de IA que responde únicamente con base en la siguiente información oficial sobre la Intendencia Municipal de Riberalta.
        Si el usuario hace una pregunta que no se puede responder directamente con esta información, debes responder exactamente con: SIN_INFORMACION (sin comillas).

        INFORMACIÓN OFICIAL:

        FUNDACIÓN:
        La Intendencia del Gobierno Autónomo Municipal de Riberalta fue fundada en el marco de la constitución política del estado plurinacional de Bolivia mediante la Ley N° 482 de Gobiernos Autónomos Municipales, promulgada el 31 de mayo de 2014, y su modificación mediante la Ley N°733 (2015). Esta ley establece el marco normativo para la organización y administración de los municipios en Bolivia. En ese contexto, el Gobierno Autónomo Municipal de Riberalta fortaleció sus estructuras administrativas para la regulación de servicios públicos, comercio y seguridad ciudadana.

        UBICACIÓN Y DIRECCIÓN:
        La Intendencia está ubicada en la ciudad de Riberalta, provincia Vaca Díez, departamento del Beni. Su dirección actual es Barrio/Central - Avenida Máximo Henicke N°425.

        ACTUAL ENCARGADO:
        La Licenciada Gloria Iris Juarez es la responsable actual de la administración de servicios y seguridad ciudadana del G.A.M.R.

        FUNCIONES:
        1. Atención de denuncias y control de productos (verificación de calidad y peso, sanciones a comerciantes infractores).
        2. Regulación de mercados y espacios públicos (ordenamiento y supervisión para garantizar el funcionamiento adecuado).
        3. Control de establecimientos de diversión y expendio de bebidas alcohólicas (Inspección de bares, discotecas, karaokes y otros espacios de entretenimiento para asegurar que cumplan con las normas establecidas).
        4. Supervisión de la higiene y sanidad (Control de la calidad de los alimentos y condiciones higiénicas en mercados y comercios).
        `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenOPENAI}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: promptSistema },
                    { role: "user", content: preguntaUsuario }
                ],
                temperature: 0.5,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error.message || "Error al llamar al modelo entrenado");
        }

        const data = await response.json();
        let respuesta = data.choices[0].message.content.trim();
        console.log("Respuesta:", respuesta);
        return respuesta;

    } catch (error) {
        console.error("Error al responder:", error.message);
        return "Tuvimos un problema, intentá nuevamente más tarde.";
    }
}

async function responderAnteAdvertencias(preguntaUsuario, mensajeAdvertencia) {
    const mensajeSistema = `
          Eres un asistente de IA que responde preguntas de forma clara, amable y profesional.
  
          Tienes dos elementos de entrada:
          1. La pregunta original del usuario.
          2. Un mensaje de advertencia que indica el tipo de situación detectada.
  
          Tu tarea es interpretar esa advertencia y redactar una respuesta útil, natural y bien formulada.
  
          Comportamiento según el tipo de advertencia:
          - Si la advertencia es "NO_VALIDO": indica de forma educada que solo puedes ayudar con consultas y no con acciones que modifiquen información.
          - Si la advertencia es "NO_EXISTE": responde de forma cortés que solo estás entrenado para asistir en consultas relacionadas con la intendencia municipal de riberalta.
  
          Ejemplos:
  
          Pregunta: "elimina los registros de usuarios"
          Advertencia: "NO_VALIDO"
          Respuesta esperada: "Actualmente solo estoy entrenado para ayudarte y brindarte asistencia en temas específicos. Por favor, intenta con otra consulta."
  
          Pregunta: "¿Cuántos días tiene un mes?"
          Advertencia: "NO_EXISTE"
          Respuesta esperada: "Solo puedo ayudarte en consultas relacionadas sobre la intendencia municipal de riberalta."
  
          Ahora responde educadamente a la siguiente pregunta del usuario, usando la información proporcionada.
          `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenOPENAI}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: mensajeSistema },
                    { role: "user", content: `Pregunta: ${preguntaUsuario}\nAdvertencia: ${mensajeAdvertencia}` }
                ],
                temperature: 0.5,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error.message || "Error al llamar al modelo entrenado");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Error al responder:", error.message);
        return "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
    }
}

async function respuestaHumanizada(preguntaUsuario, datosSQL) {
    const mensajeSistema = `
    Eres un asistente de IA que responde preguntas de forma clara, amigable y profesional.

    Instrucciones:
    - Tienes la pregunta original de un usuario y los datos obtenidos de la base de datos en formato JSON.
    - Tu tarea es interpretar los datos y generar una respuesta útil, bien redactada y natural.
    - Si los datos están vacíos o no hay resultados, indícalo de forma educada.

    Ejemplo:
    Pregunta: "¿Cuántos usuarios hay registrados?"
    Datos: [{ total: 152 }]
    Respuesta esperada: "Actualmente hay 152 usuarios registrados en el sistema."

    Ahora responde amablemente la siguiente pregunta del usuario usando los datos proporcionados.
    `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenOPENAI}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: mensajeSistema },
                    { role: "user", content: `Pregunta: ${preguntaUsuario}\nDatos: ${JSON.stringify(datosSQL, null, 2)}` }
                ],
                temperature: 0.5,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error.message || "Error al llamar al modelo entrenado");
        }
        const data = await response.json();
        return data.choices[0].message.content.trim();
        //const data = await response.json();
        //const respuestaHuma = data.choices[0].message.content.trim();

        //agregarMensaje(respuestaHuma, "bot-message");

    } catch (error) {
        console.error("Error al responder:", error.message);
        return "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
    }
}

async function ejecutarConsultaSQL(sqlGenerado, userInput) {
    try {
        const response = await $.ajax({
            type: "POST",
            url: "Default.aspx/ConsultaSql",
            data: JSON.stringify({ ConsultaSql: sqlGenerado }),
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        if (response.d.Estado) {
            const datos = response.d.Data;
            console.log(datos);
            const respuesta = await respuestaHumanizada(userInput, datos);
            return respuesta;
        } else {
            return "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return "Tuvimos un problema al generar una respuesta. Por favor, intentá nuevamente más tarde.";
    }
}

async function generarSentenciaSql() {
    const userInput = user.message;

    const promptSistema = `
        Eres un asistente experto en generar consultas SQL específicamente para Microsoft SQL Server.

        Tu tarea es transformar instrucciones en lenguaje natural en consultas T-SQL válidas, claras y eficientes, usando el siguiente esquema de base de datos:

        ${JSON.stringify(esquemaSimplificado, null, 2)}

        Ten en cuenta que los usuarios pueden usar sinónimos o formas informales para referirse a tablas o columnas. Usa el siguiente diccionario de sinónimos para interpretar correctamente las instrucciones y mapearlas al esquema real:

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

        IMPORTANTE: interpreta los requerimientos usando este diccionario como guía para entender sinónimos.

        REGLAS DE RESPUESTA:
        - Usa correctamente la sintaxis de T-SQL para SQL Server.
        - Utiliza JOIN si se necesitan datos de varias tablas.
        - Aplica condiciones WHERE, filtros TOP, funciones como GETDATE(), DATEDIFF(), etc., si corresponde.
        - IMPORTANTE: No utilices bloques de código Markdown como \`\`\`sql o \`\`\`. Devuelve solo la sentencia SQL en texto plano.
        - No incluyas explicaciones, encabezados, ni texto adicional.
        - Si la instrucción no puede ser respondida con una sentencia SELECT, responde solo con: NO_VALIDO.
        - Si la instrucción no está relacionada con el esquema, responde solo con: NO_EXISTE.

        Ejemplos:

        "original_query": "Mostrar los últimos 10 usuarios registrados."
        "sql_query": "SELECT TOP 10 * FROM USUARIO ORDER BY IdUsuario DESC;"

        "original_query": "Listar todos los negocios activos."
        "sql_query": "SELECT * FROM NEGOCIO WHERE Activo = 1;"

        "original_query": "Mostrar las notificaciones del propietario Juan Pérez."
        "sql_query": "SELECT N.* FROM NOTIFICACION N INNER JOIN PROPIETARIO P ON N.IdPropietario = P.IdPropietario WHERE P.Nombres = 'Juan' AND P.Apellidos = 'Pérez';"

        "original_query": "Ver el nombre y ubicación de los negocios registrados por el propietario con CI 12345678."
        "sql_query": "SELECT N.NombreNegocio, N.Ubicacion FROM NEGOCIO N INNER JOIN PROPIETARIO P ON N.IdPropietario = P.IdPropietario WHERE P.NroCi = '12345678';"

        "original_query": "Cuántas actividades se registraron este mes."
        "sql_query": "SELECT COUNT(*) FROM ACTIVIDADES WHERE MONTH(FechaRegistro) = MONTH(GETDATE()) AND YEAR(FechaRegistro) = YEAR(GETDATE());"

        "original_query": "Mostrar los nombres de usuario y su rol."
        "sql_query": "SELECT U.Users, R.Descripcion FROM USUARIO U INNER JOIN ROL R ON U.IdRol = R.IdRol;"

        Ahora genera la consulta para el siguiente requerimiento:
        `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenOPENAI}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: promptSistema },
                    { role: "user", content: userInput }
                ],
                temperature: 0.2,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error.message || "Error al llamar al modelo entrenado");
        }
        const data = await response.json();
        let sqlGenerado = data.choices[0].message.content.trim();
        console.log("SQL generado:", sqlGenerado);
        sqlGenerado = sqlGenerado.replace(/```sql|```/g, "").trim();
        console.log("SQL Limpio:", sqlGenerado);


        //if (sqlGenerado === "NO_VALIDO" || sqlGenerado === "NO_EXISTE") {
        //    const respuestaContextual = await responderAnteFueraContexto(userInput);

        //    if (respuestaContextual === "NO_SALUDA") {
        //        const respuestaInfo = generarRespuestaInten(userInput);

        //        if (respuestaInfo === "SIN_INFORMACION") {
        //            return "Tu pregunta esta fuera de nuestro modelo intenta con otra pregunta o reformula de otra forma.";
        //        }

        //        return respuestaInfo;
        //    }

        //    return respuestaContextual;
        //}

        //const respuestase = await ejecutarConsultaSQL(sqlGenerado, userInput);
        //return respuestase;

        if (sqlGenerado !== "NO_VALIDO" && sqlGenerado !== "NO_EXISTE") {
            return await ejecutarConsultaSQL(sqlGenerado, userInput);
        }

        const respuestaContextual = await responderAnteFueraContexto(userInput);

        if (respuestaContextual !== "NO_SALUDA") {
            return respuestaContextual;
        }

        const respuestaInfo = await generarRespuestaInten(userInput);

        if (respuestaInfo === "SIN_INFORMACION") {
            return "Tu pregunta está fuera de nuestro modelo. Intentá con otra o reformulá tu consulta.";
        }

        return respuestaInfo;

    } catch (error) {
        console.error("Error al responder:", error.message);
        return "Tuvimos un problema al generar la consulta a la base de datos, intentá nuevamente más tarde.";
    }
}


async function generateResponse(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area")

    chatHistoryz.push({
        role: "user",
        parts: [{ text: user.message }],
    });

    try {
        const respuestase = await generarSentenciaSql();
        text.innerHTML = respuestase

        chatHistoryz.push({
            role: "model",
            parts: [{ text: respuestase }],
        });

    } catch (error) {
        console.error("Error al generar SQL:", error.message);
        text.innerHTML = "Hubo un problema al procesar tu consulta. Por favor, intentá nuevamente más tarde.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
    }
}

function handlechatResponse(userMessage) {
    user.message = userMessage
    let html = `<img src="/chatloaderr/user.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
    ${user.message}
    </div>`
    prompt.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html = `<img src="/chatloaderr/ai.png" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
            <img src="/chatloaderr/loading.webp" alt="" class="load" width="20px">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)

    }, 600)

}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatResponse(prompt.value)

    }
})

submitbtn.addEventListener("click", () => {
    handlechatResponse(prompt.value)
})


document.getElementById('chatButton').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'flex';
    document.getElementById('chatButton').style.display = 'none';
});

document.getElementById('closeChat').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'none';
    document.getElementById('chatButton').style.display = 'block';
});
