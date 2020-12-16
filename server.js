const express = require('express')
const serveStatic = require('serve-static')
const socketio = require('socket.io')
const path = require('path')

//set up the server
const app = express()
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})
const port = process.env.PORT || 8080
const server = app.listen(port)
const io = socketio(server, {
    cors: {
      origin: '*',
    }
  });
  console.log(`app is listening on port: ${port}`)
//respond when the client connects
io.on("connection", (socket) => {
    socket.on('roomListRequest',()=>{
      socket.emit("roomListResponse",Array.from(io.sockets.adapter.rooms));
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
