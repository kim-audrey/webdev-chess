const express = require("express");
const serveStatic = require("serve-static");
const socketio = require("socket.io");
const path = require("path");

//set up the server
const app = express();
app.use("/", serveStatic(path.join(__dirname, "/dist")));

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function(req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});
const port = process.env.PORT || 8081;
const server = app.listen(port);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
console.log(`app is listening on port: ${port}`);
//respond when the client connects
io.on("connection", (socket) => {
  socket.on("roomListRequest", () => {
    socket.emit("roomListResponse", Array.from(io.sockets.adapter.rooms));
  });

  socket.on("clearSocket", ()=>{
    socket.leave(socket.room);
    socket.room=null

    if(socket.roomP!=null){
      socket.leave(socket.roomP);
      socket.roomP=null

    }
  });

  socket.on("joinRoom", (code) => {
    socket.leave(socket.room);
    if(socket.roomP!=null){
      socket.leave(socket.roomP);
    }

    socket.join(code);
    socket.room = code;
    var codeP=code+"p";
    var roomP = io.sockets.adapter.rooms.get(codeP);
  
    //socket.to(codeP).emit("moveEventRequest")
    if (roomP != null && roomP.size >= 2) 
      socket.emit("setBoard",null,roomP.board,roomP.currTurn)

    else {
      socket.join(codeP);
      socket.roomP=codeP;
      var roomP = io.sockets.adapter.rooms.get(codeP);

      if (roomP.size == 1) {
        var cf = Math.random() < 0.5 ? "Black" : "White";
        socket.emit("setBoard", cf,roomP.board, roomP.currTurn);

      } else if (roomP.size == 2) {
        socket.to(codeP).emit("getColor");

        socket.on("giveColor", (col) => {
          var cs = col === "White" ? "Black" : "White";
          socket.emit("setBoard", cs,roomP.board, roomP.currTurn);
        });
      }

      socket.on("moveEvent", (data) => {
        if(roomP.board==null){
          roomP.currTurn=false;
        }
        else{
          roomP.currTurn=!roomP.currTurn;
        }
        roomP.board=data;
        socket.to(code).emit("moveResponse", data);
      });

      socket.on("colorEcho", (col) => {
        socket.to(codeP).emit("colorEcho", col);
      });
      
      socket.on("undoEvent", (agreer) => {
        console.log("Recieved request from sender");
        socket.to(code).emit("undoResponse", agreer);
        console.log("Information sent to reciever");
      });
    }
  });
});
