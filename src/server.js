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
    socket.on('joinRoom', (code) => {
      let rooms = Object.keys(io.sockets.adapter.rooms);
      if( rooms[code]!=null && rooms[code].length===2){
        console.log("fullroom")
        socket.emit("fullRoom")
      }
      else{
        socket.join(code)
        console.log(Object.keys(io.sockets.adapter.rooms))
        socket.on('moveEvent', (data)=>{
          io.broadcast.to(code).emit("moveResponse", data)
        })
      }
    })
})
