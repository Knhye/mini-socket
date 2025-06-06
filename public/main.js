//클라이언트가 서버와 Socket 연결 시작
//기본적으로 웹페이지를 제공한 서버 주소로 연결
const socket = io()

const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  sendMessage()
})

function sendMessage() {
  if (messageInput.value === "") return
  // console.log(messageInput.value)

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  }

  // 서버로 메세지 보내기
  socket.emit("message", data)
  addMessageToUI(true, data)
  messageInput.value = ""
}

// 서버에서 다른 사용자가 보낸 data를 콘솔에 출력
socket.on("chat-message", (data) => {
  console.log(data)
  addMessageToUI(false, data)
  messageInput.value = ""
})

function addMessageToUI(isOwnMessage, data) {
  // 내가 보낸 메세지일 경우에는 Right에, 아니라면 left에
  //moment를 사용해서 몇분 전에 보냈는지
  const element = `
  <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
      ${data.message}
      <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>
  `

  messageContainer.innerHTML += element
  scrollToBottom()
}

// 아래로 스크롤
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}
