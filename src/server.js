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
      var room = io.sockets.adapter.rooms.get(code);
      if( room!=null && room.size===2){
        console.log("fullroom")
        socket.emit("fullRoom")
      }
      else{
        socket.join(code)
        room = io.sockets.adapter.rooms.get(code);
        if(room.size==1){
          var c=(Math.random() < 0.5 ? "b" : "w");
          socket.emit("color",c);
          room.FirstColor=c;
        }
        else if(room.size==2){
          var c = (room.FirstColor === "w" ? "b" : "w");
          socket.emit("color",c)
        }
        socket.on('moveEvent', (data)=>{
          io.broadcast.to(code).emit("moveResponse", data)
        })
      }
    })
})
