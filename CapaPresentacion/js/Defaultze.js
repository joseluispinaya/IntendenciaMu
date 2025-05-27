let prompt = document.querySelector("#prompt")
let submitbtn = document.querySelector("#submit")
let chatContainer = document.querySelector(".chat-container")
//let imagebtn = document.querySelector("#image")
//let image = document.querySelector("#image img")
//let imageinput = document.querySelector("#image input")

const apikey = "AIzaSyAmMfWZrys-Rxg2k_Ele2xSXVpo0-6NGBU";
const Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`;
//const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=Your-Api-Key"

let user = {
    message: null,
}
const chatHistoryz = [];

async function generateResponse(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area")

    chatHistoryz.push({
        role: "user",
        parts: [{ text: user.message }],
    });

    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: chatHistoryz }),
    }
    try {
        let response = await fetch(Api_Url, RequestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
        text.innerHTML = apiResponse

        chatHistoryz.push({
            role: "model",
            parts: [{ text: apiResponse }],
        });
    }
    catch (error) {
        console.log(error);

    }
    finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
        //image.src = `img.svg`
        //image.classList.remove("choose")
        //user.file = {}
    }
}



function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
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
/* imageinput.addEventListener("change", () => {
    const file = imageinput.files[0]
    if (!file) return
    let reader = new FileReader()
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64string
        }
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }

    reader.readAsDataURL(file)
}) */


// imagebtn.addEventListener("click", () => {
//     imagebtn.querySelector("input").click()
// })

document.getElementById('chatButton').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'flex';
    document.getElementById('chatButton').style.display = 'none';
});

document.getElementById('closeChat').addEventListener('click', function () {
    document.querySelector('.contenedor').style.display = 'none';
    document.getElementById('chatButton').style.display = 'block';
});
