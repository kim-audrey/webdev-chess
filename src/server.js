const express = require('express')
const socketio = require('socket.io')

//set up the server
const app = express()
const server = app.listen(8000)
const io = socketio(server, {
    cors: {
      origin: '*',
    }
  });

//respond when the client connects
io.on("connection", (socket) => {
    console.log("connet")
    socket.emit('welcome', "Welcome to the socket.io server!")
    socket.on('message', (msg) => {
        console.log(msg)
    })
})
