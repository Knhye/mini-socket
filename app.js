const express = require("express")
const path = require("path")
const app = express()
const PORT = 5000
const server = app.listen(PORT, () =>
  console.log(`Server is running at ${PORT}`)
)

// 소켓 서버를 http 서버에 연결
const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, "public")))

// Set() : 중복 없이 값을 저장하는 객체
let socketConnected = new Set()

app.get("/", (req, res) => {
  res.render("index")
})

// 클라이언트 접속 시 실행
io.on("connection", onConnected)

function onConnected(socket) {
  // console.log(socket.id)

  // 새로운 클라이언트가 접속할 때 저장
  socketConnected.add(socket.id)

  socket.on("disconnect", () => {
    // 연결을 끊을 때 제거
    socketConnected.delete(socket.id)
  })

  socket.on("message", (data) => {
    // console.log(data)
    //자신을 제외한 모든 클라이언트에게 main.js의 chat-message 이벤트로 data 전송
    //broadcast : 자신을 제외한
    socket.broadcast.emit("chat-message", data)
  })
}
