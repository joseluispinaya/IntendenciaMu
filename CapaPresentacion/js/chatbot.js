
$(document).ready(function () {

    $('#chatButton').on('click', function () {
        $('.chat-container').css('display', 'flex');
        $('#chatButton').hide();
    });

    $('#closeChat').on('click', function () {
        $('.chat-container').hide();
        $('#chatButton').show();
    });

})

// Función para enviar un mensaje
function enviarMensaje() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    // Agregar el mensaje del usuario al chat
    agregarMensaje(userInput, "user-message");
    document.getElementById("user-input").value = "";

    // Mostrar indicador de carga
    document.getElementById("btn-text").style.display = "none";
    document.getElementById("btn-loading").style.display = "inline";
    document.getElementById("btnenviar").disabled = true;

    // Enviar el mensaje al backend
    fetch("http://127.0.0.1:8000/human_query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ human_query: userInput })
    })
        .then(response => response.json())
        .then(data => {
            // Agregar la respuesta del bot al chat
            agregarMensaje(data.answer, "bot-message");
        })
        .catch(error => {
            console.error("Error:", error);
            agregarMensaje("Hubo un error al procesar tu solicitud.", "bot-message");
        })
        .finally(() => {
            // Ocultar indicador de carga
            document.getElementById("btn-text").style.display = "inline";
            document.getElementById("btn-loading").style.display = "none";
            document.getElementById("btnenviar").disabled = false;
        });
}

// Función para agregar un mensaje al chat
function agregarMensaje(texto, clase) {
    const chatMessages = document.getElementById("chat-messages");
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("message", clase);
    mensajeDiv.textContent = texto;
    chatMessages.appendChild(mensajeDiv);

    // Limitar el número de mensajes mostrados
    if (chatMessages.children.length > 50) {
        chatMessages.removeChild(chatMessages.firstChild);
    }

    // Aplicar animación
    setTimeout(() => {
        mensajeDiv.classList.add("visible");
    }, 10);

    // Desplazar el scroll al final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

$('#btnenviar').on('click', function () {
    enviarMensaje();
});

// Permitir enviar mensajes con la tecla Enter
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
});