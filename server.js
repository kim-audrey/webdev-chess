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

  socket.on("clearSocket", () => {
    socket.leave(socket.room);
    socket.room = null;

    if (socket.roomP != null) {
      socket.leave(socket.roomP);
      socket.roomP = null;
    }
  });

  socket.on("joinRoom", (code, board) => {
    socket.leave(socket.room);
    if (socket.roomP != null) {
      socket.leave(socket.roomP);
    }

    socket.join(code);
    socket.room = code;
    var codeP = code + "p";
    var roomP = io.sockets.adapter.rooms.get(codeP);

    //socket.to(codeP).emit("moveEventRequest")
    if (roomP != null && roomP.size >= 2)
      socket.emit("setBoard", null, roomP.board, roomP.currTurn);
    else {
      socket.join(codeP);
      socket.roomP = codeP;
      roomP = io.sockets.adapter.rooms.get(codeP);

      if (roomP.size == 1) {
        var cf = Math.random() < 0.5 ? "Black" : "White";
        roomP.board = board;
        socket.emit(
          "setBoard",
          cf,
          roomP.board,
          roomP.currTurn,
          roomP.prevBoard
        );
      } else if (roomP.size == 2) {
        socket.to(codeP).emit("getColor");

        socket.on("giveColor", (col) => {
          var cs = col === "White" ? "Black" : "White";
          socket.emit(
            "setBoard",
            cs,
            roomP.board,
            roomP.currTurn,
            roomP.prevBoard
          );
        });
      }
      socket.on("moveEvent", (data) => {
        if (roomP.currTurn == null) {
          roomP.currTurn = false;
        } else {
          roomP.currTurn = !roomP.currTurn;
        }
        roomP.prevBoard = roomP.board;
        roomP.board = data;
        socket.to(code).emit("moveResponse", data);
      });
      socket.on("colorEcho", (col) => {
        socket.to(code).emit("colorEcho", col);
      });
      socket.on("undoEvent", (agreer) => {
        if (agreer) {
          roomP.board = roomP.prevBoard;
          roomP.currTurn = !roomP.currTurn;
        }
        socket.to(code).emit("undoResponse", agreer);
      });

      socket.on("resetBoard", (boardSetup, color) => {
        roomP.currTurn = true;
        roomP.prevBoard = null;
        roomP.board = boardSetup;

        var cs = color === "White" ? "Black" : "White";
          socket.to(code).emit(
            "setBoard",
            cs,
            roomP.board,
            roomP.currTurn,
            roomP.prevBoard
          );
      });

      
      

    }
  });
});
