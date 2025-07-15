
let prompt = document.querySelector("#prompt")
let submitbtn = document.querySelector("#submit")
let chatContainer = document.querySelector(".chat-container")

let user = {
    message: null
}

function generarRespuesta(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area")

    var request = {
        prompt: user.message
    };

    $.ajax({
        type: "POST",
        url: "Default.aspx/RespuestaChatGPT",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            console.log(response);
            var responde = response.d.Data;
            text.innerHTML = responde;


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            text.innerHTML = "Hubo un problema en el frontend, intentá nuevamente más tarde.";
        },
        complete: function () {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
        }
    });
}

function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function manejarRespuesta(userMessage) {
    user.message = userMessage
    let html = `<img src="chatloaderr/user.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
    ${user.message}
    </div>`
    prompt.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html = `<img src="chatloaderr/ai.png" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
            <img src="chatloaderr/loading.webp" alt="" class="load" width="20px">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generarRespuesta(aiChatBox)

    }, 600)

}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (prompt.value.trim() !== "") {
            manejarRespuesta(prompt.value);
        }

    }
})

submitbtn.addEventListener("click", () => {
    if (prompt.value.trim() !== "") {
        manejarRespuesta(prompt.value);
    }
})

document.getElementById('chatButton').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'flex';
    document.getElementById('chatButton').style.display = 'none';
});

document.getElementById('closeChat').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'none';
    document.getElementById('chatButton').style.display = 'block';
});