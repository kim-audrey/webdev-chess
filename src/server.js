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
    socket.on('roomListRequest',()=>{
      socket.emit("roomListResponse",io.sockets.adapter.rooms);
    })
    socket.on('joinRoom', (code) => {
      socket.removeAllListeners("moveEvent");
      socket.leave(socket.room)
      var room = io.sockets.adapter.rooms.get(code);
      if( room!=null && room.size>=2){
        console.log("fullroom")
        socket.emit("fullRoom")
      }
      else{
        socket.join(code)
        socket.room=code
        room = io.sockets.adapter.rooms.get(code);
        if(room.size==1){
          var cf = (Math.random() < 0.5 ? "Black" : "White");
          socket.emit("setColor",cf);
          room.FirstColor=cf;
        } 
        else if(room.size==2){
          socket.to(code).emit("getColor");
          socket.on("giveColor", (col)=>{
            var cs = (col === "White" ? "Black" : "White");
            socket.emit("setColor",cs);
          })

        }
        socket.on('moveEvent', (data)=>{
          socket.to(code).emit("moveResponse", data)
        })
        socket.on("colorEcho", (col)=>{
          socket.to(code).emit("colorEcho",col);
        })
      }
    })
})
