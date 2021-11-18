const env = require('dotenv');
env.config()

const express = require('express')
const app = express()
const http = require('http')

const cors = require('cors')

const { Server } = require("socket.io");

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  
  console.log("Connected")

  socket.on("logger", (data)=>{
    console.log(data)
    io.emit("share", data)
  })

});

server.listen(process.env.PORT)

