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
          var cf = (Math.random() < 0.5 ? "Black" : "White");
          socket.emit("color",cf);
          room.FirstColor=cf;
        } 
        else if(room.size==2){
          var cs = (room.FirstColor === "White" ? "Black" : "White");
          socket.emit("color",cs)
        }
        socket.on('moveEvent', (data)=>{
          io.to(code).broadcast.emit("moveResponse", data)
        })
      }
    })
})
