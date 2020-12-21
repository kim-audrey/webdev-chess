<template>
  <div class="board">
    <div v-if="gameFullScreen" id="fullRoom" style="top: 35%">
      <h1>Game Room is Full.</h1>
      <h2>Would you like to spectate?</h2>
      <div>
        <button
          class="button"
          @click="gameFullScreen = false"
          style="margin-right: 50px"
        >
          Specatate
        </button>
        <button class="button" @click="$router.push({ path: '/' })">
          Go Back
        </button>
      </div>
    </div>

    <div v-else>
      <!-- Creates an html table to simulate a chessboard -->
      <!-- idea taken from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 -->
      <p v-if="color === null">Please wait...</p>
      <p v-else-if="color === 'Gray'">You are a spectator.</p>
      <p v-else>You are {{ color }}.</p>
      <div v-if="color === 'Gray'">
        <p v-if="turn && winner === null">It is White's turn.</p>
        <p v-else-if="winner === null">It is Black's turn.</p>
      </div>
      <div v-else>
        <p v-if="turn && winner === null">It is your turn.</p>
        <p v-else-if="winner === null">It is your opponent's turn.</p>
      </div>
      <p v-if="undo && color !== 'Gray' && winner == null">
        Your opponent wants to undo this move.
      </p>
      <p v-if="undoConfirmation">You have requested to undo a move.</p>
      <p v-if="undoConfirmation">
        Your opponent can either agree to undo or continue playing.
      </p>
      <button
        v-if="color !== 'Gray' && undoArray != null && winner == null"
        class="button"
        @click="voteToUndoMove"
      >
        Undo Move
      </button>
      <p v-if="winner">{{ winner }} wins!</p>

      <!-- Button turns on for rematch! 12/20 -->
      <button v-if="winner" class="button" @click="setupChess">Rematch</button>

      <table class="chess-board">
        <tbody>
          <tr>
            <th></th>
            <th>a</th>
            <th>b</th>
            <th>c</th>
            <th>d</th>
            <th>e</th>
            <th>f</th>
            <th>g</th>
            <th>h</th>
          </tr>
          <!-- Use Vue.JS functions to iterate through each square of the chess board and -->
          <!-- Dynamically put chess pieces where they belong and empty clickable tile squares otherwise. -->
          <!-- Additionally, alternate between dark and light tiles. -->
          <tr v-for="n in 8" :key="n">
            <th>{{ 9 - n }}</th>
            <td
              v-for="m in 8"
              :key="m"
              :class="{
                light: (n + m) % 2 == 0,
                dark: (n + m) % 2 == 1,
                highlight: startposition === String(8 - n) + String(m - 1),
              }"
            >
              <Tile
                v-if="piecesArray[8 - n][m - 1] === null"
                :space="String(8 - n) + String(m - 1)"
                v-on:tileSelected="tileSelection"
              />
              <Piece
                v-if="piecesArray[8 - n][m - 1] != null"
                :pieceType="piecesArray[8 - n][m - 1]"
                :space="String(8 - n) + String(m - 1)"
                :highlight="startposition === String(8 - n) + String(m - 1)"
                v-on:pieceSelected="pieceSelection"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Creates button for choice when promotion should occur
      <transition v-if="promotion" name="fade" appear>
        <div
          class="modal-overlay"
          v-if="showModal"
          @click="showModal = false"
        ></div>
      </transition>
      <transition name="slide" appear>
        <div class="modal" v-if="showModal">
          <h1>Pick a promotion.</h1>
        </div>
      </transition> -->
    </div>
  </div>
</template>

<script>
//TODO: Store chessboard so it doesn't delete on refresh (use vuex?)\

//Add movement logic
//CHESS LOGIC
// host it!
//Make sure taking pieces and not taking your own pieces works

//3rd sprint stuff (don't worry about this)
// Switch board direction
// Highlight the currently selected piece

import Tile from "@/components/Tile";
import Piece from "@/components/Piece";
export default {
  components: {
    Tile,
    Piece,
  },
  data: function () {
    return {
      //piecesArray: The current state of the chess board and where the pieces are
      //undoArray: The most recent state of the chess board, what players can use undo to go to
      //color: The player color (Gray for spectators)
      //turn: Whether it is your turn
      //startposition: The chosen square to begin a move from
      //winner: Who the winner is
      //undo: Whether this player has been given the ability to undo a move after their opponent first requested it
      //undoConfirmation: Whether this player requested to undo a move, so they know their request went through.
      //Array creation taken from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
      piecesArray: Array.from(Array(8), () => new Array(8).fill(null)),
      undoArray: null,
      color: null,
      turn: null,
      startposition: null,
      winner: null,
      undo: false,
      undoConfirmation: false,
    };
  },
  mounted: function () {
    if (String(this.$route.params.gameID).charAt(0) === "1") {
      this.setupChess();
    } else {
      this.setupRBChess();
    }

    //Joins room upon board being created
    this.$socket.client.emit(
      "joinRoom",
      this.$route.params.gameID,
      this.piecesArray
    );
    //Somewhere either here or another function, we should retrieve the chessboard.
  },
  methods: {
    setupChess: function () {
      var i;
      var j;
      for (i = 7; i >= 0; i--) {
        for (j = 7; j >= 0; j--) {
          if (i === 7) {
            if (j === 0 || j === 7) this.piecesArray[i][j] = "BlackRook";
            if (j === 1 || j === 6) this.piecesArray[i][j] = "BlackKnight";
            if (j === 2 || j === 5) this.piecesArray[i][j] = "BlackBishop";
            if (j === 3) this.piecesArray[i][j] = "BlackQueen";
            if (j === 4) this.piecesArray[i][j] = "BlackKing";
          } else if (i === 6) {
            this.piecesArray[i][j] = "BlackPawn";
          } else if (i === 1) {
            this.piecesArray[i][j] = "WhitePawn";
          } else if (i === 0) {
            if (j === 0 || j === 7) this.piecesArray[i][j] = "WhiteRook";
            if (j === 1 || j === 6) this.piecesArray[i][j] = "WhiteKnight";
            if (j === 2 || j === 5) this.piecesArray[i][j] = "WhiteBishop";
            if (j === 3) this.piecesArray[i][j] = "WhiteQueen";
            if (j === 4) this.piecesArray[i][j] = "WhiteKing";
          } else {
            this.piecesArray[i][j] = null;
          }
        }
      }
      this.turn = true;
    },
    setupRBChess: function () {
      var i;
      var j;
      var rbWhitePieces = [
        "WhitePawn",
        "WhiteKnight",
        "WhiteBishop",
        "WhiteRook",
        "WhiteQueen",
      ];
      var rbBlackPieces = [
        "BlackPawn",
        "BlackKnight",
        "BlackBishop",
        "BlackRook",
        "BlackQueen",
      ];
      for (i = 7; i >= 0; i--) {
        for (j = 7; j >= 0; j--) {
          if (i === 7 || i === 6) {
            this.piecesArray[i][j] =
              rbBlackPieces[Math.floor(Math.random() * 5)];
          }
          if (i === 1 || i === 0) {
            this.piecesArray[i][j] =
              rbWhitePieces[Math.floor(Math.random() * 5)];
          }
        }
      }
      this.piecesArray[7][4] = "BlackKing";
      this.piecesArray[0][4] = "WhiteKing";
    },
    //When a tile is clicked while a piece is selected, delete the piece at the old position,
    //move it to the new position, store the new board, and send it to the opponent.
    tileSelection: function (position) {
      if (this.winner === null) {
        var space = [Number(position[0]), Number(position[1])];

        if (this.piecesArray[space[0]][space[1]] === null) {
          //Cannot select a tile to start!
          if (this.startposition !== null) {
            //Calling Logic to move to a tile
            this.logic(this.startposition, position);
          }
        }
      }
    },
    //When a piece is selected, check if a piece is already selected. If not, store its position.
    //Otherwise, overwrite the piece at this position with the first selected piece.
    pieceSelection: function (position) {
      if (this.winner === null) {
        if (this.startposition === null) {
          if (
            this.turn &&
            this.piecesArray[Number(position[0])][
              Number(position[1])
            ].substring(0, 5) === this.color
          ) {
            this.startposition = position;
          }
        } else {
          this.logic(this.startposition, position);
        }
      }
    },
    //Move a piece to a different square and remove it from this space,
    //then pass the turn to the other player.
    move: function (startposition, endposition) {
      this.undoArray = JSON.parse(JSON.stringify(this.piecesArray));
      this.undo = false;
      // In the move function, meaning move was legal
      var startspace = [Number(startposition[0]), Number(startposition[1])];
      var endspace = [Number(endposition[0]), Number(endposition[1])];

      this.piecesArray[endspace[0]][endspace[1]] = this.piecesArray[
        startspace[0]
      ][startspace[1]];
      this.piecesArray[startspace[0]][startspace[1]] = null;

      this.checkPromotion();

      this.startposition = null;
      this.endposition = null;
      this.turn = !this.turn;

      this.$socket.client.emit("moveEvent", this.piecesArray);

      this.checkWin();

      this.$forceUpdate();
    },
    castleMove: function (color, side) {
      this.undoArray = JSON.parse(JSON.stringify(this.piecesArray));
      this.undo = false;

      if (color === "Black") {
        if (side == "short") {
          this.piecesArray[7][7] = null;
          this.piecesArray[7][5] = "BlackRook";
          this.piecesArray[7][4] = null;
          this.piecesArray[7][6] = "BlackKing";
        }
        if (side == "long") {
          this.piecesArray[7][0] = null;
          this.piecesArray[7][3] = "BlackRook";
          this.piecesArray[7][4] = null;
          this.piecesArray[7][2] = "BlackKing";
        }
      }
      if (color === "White") {
        if (side == "short") {
          this.piecesArray[0][7] = null;
          this.piecesArray[0][5] = "WhiteRook";
          this.piecesArray[0][4] = null;
          this.piecesArray[0][6] = "WhiteKing";
        }
        if (side == "long") {
          this.piecesArray[0][0] = null;
          this.piecesArray[0][3] = "WhiteRook";
          this.piecesArray[0][4] = null;
          this.piecesArray[0][2] = "WhiteKing";
        }
      }

      this.startposition = null;
      this.endposition = null;
      this.turn = !this.turn;
      this.$socket.client.emit("moveEvent", this.piecesArray);
      this.checkWin();
      this.$forceUpdate();
    },

    logic: function (startposition, endposition) {
      //returns whether the move is valid, such as:
      //is the player selecting their own pieces
      //is the move legal
      var startspace = [Number(startposition[0]), Number(startposition[1])];
      var endspace = [Number(endposition[0]), Number(endposition[1])];
      var pieceIdentity = this.piecesArray[startspace[0]][startspace[1]];

      console.log(this.color);
      console.log(this.turn);
      // if (!this.turn||pieceIdentity.substring(0, 5) != this.color) {
      //   console.log("illegal move");
      //   this.startposition = null;
      //   this.endposition = null;
      //   return;
      // }
      //else {
      switch (pieceIdentity) {
        case "BlackRook":
          //Going to Rook Logic
          return this.rookLogic(startspace, endspace, "Black");

        case "WhiteRook":
          //Going to Rook Logic
          return this.rookLogic(startspace, endspace, "White");

        case "BlackKnight":
          //Going to Knight Logic
          return this.knightLogic(startspace, endspace, "Black");

        case "WhiteKnight":
          //Going to Knight Logic
          return this.knightLogic(startspace, endspace, "White");

        case "BlackBishop":
          //Going to Bishop Logic
          return this.bishopLogic(startspace, endspace, "Black");

        case "WhiteBishop":
          //Going to Bishop Logic
          return this.bishopLogic(startspace, endspace, "White");

        case "BlackKing":
          //Going to King Logic
          return this.kingLogic(startspace, endspace, "Black");

        case "WhiteKing":
          //Going to King Logic
          return this.kingLogic(startspace, endspace, "White");

        case "BlackQueen":
          //Going to Queen Logic
          return this.queenLogic(startspace, endspace, "Black");

        case "WhiteQueen":
          //Going to Queen Logic
          return this.queenLogic(startspace, endspace, "White");

        case "BlackPawn":
          //Going to Pawn Logic
          return this.pawnLogic(startspace, endspace, "Black");
        case "WhitePawn":
          //Going to Pawn Logic
          return this.pawnLogic(startspace, endspace, "White");

        default:
          console.log("illegal move");
          this.startposition = null;
          this.endposition = null;
          return;
      }
      //}
    },

    queenLogic: function (startspace, endspace, color) {
      if (
        this.bishopLogic(startspace, endspace, color) ||
        this.rookLogic(startspace, endspace, color)
      ) {
        this.move(startspace, endspace);
      } else {
        console.log("illegal move");
        this.startposition = null;
        this.endposition = null;
      }
    },

    knightLogic: function (startspace, endspace, color) {
      if (startspace === endspace) {
        console.log("illegal move -- no movement");
        this.startposition = null;
        this.endposition = null;
        return;
      }

      var xMove = endspace[0] - startspace[0];
      var yMove = endspace[1] - startspace[1];

      if (
        (Math.abs(xMove) == 2 && Math.abs(yMove) == 1) ||
        (Math.abs(xMove) == 1 && Math.abs(yMove) == 2)
      ) {
        // ratio is good, just check that no one is in the way
        var endSpotPiece = this.piecesArray[endspace[0]][endspace[1]];
        if (endSpotPiece != null) {
          if (endSpotPiece.substring(0, 5) === color) {
            console.log("illegal move -- piece is already there");
            this.startposition = null;
            this.endposition = null;
            return;
          } else {
            console.log("capture");
            this.move(startspace, endspace);
            return;
          }
        }
        this.move(startspace, endspace);
        return;
      }
      console.log("illegal move -- bad movement");
      this.startposition = null;
      this.endposition = null;
      return;
    },

    rookLogic: function (startspace, endspace, color) {
      var xMove = endspace[0] - startspace[0];
      var yMove = endspace[1] - startspace[1];

      if (xMove == 0 && yMove == 0) {
        console.log("illegal move -- no movement");
        this.startposition = null;
        this.endposition = null;
        return;
      }

      // if they're moving in one direction, good!
      if (xMove == 0 || yMove == 0) {
        var currXY = [startspace[0], startspace[1]];
        var endXY = [endspace[0], endspace[1]];
        var moveIndex = xMove == 0 ? 1 : 0;
        var moveIncrememnt =
          moveIndex == 0 ? (xMove > 0 ? 1 : -1) : yMove > 0 ? 1 : -1;

        while ((currXY[moveIndex] += moveIncrememnt) != endXY[moveIndex]) {
          if (this.piecesArray[currXY[0]][currXY[1]] !== null) {
            console.log("illegal move -- piece is in the way");
            this.startposition = null;
            this.endposition = null;
            return;
          }
        }

        // if the spot we (successfully) land on has a piece, capture it.
        var endSpotPiece = this.piecesArray[currXY[0]][currXY[1]];
        if (endSpotPiece !== null) {
          if (endSpotPiece.substring(0, 5) != color) {
            console.log("capture");
            this.move(startspace, endspace);
            return;
          }

          console.log("illegal move -- piece is already there");
          this.startposition = null;
          this.endposition = null;
          return;
        }

        // if we move in one direction and no pieces are in our path, we're
        this.move(startspace, endspace);
      }

      console.log("illegal move -- bad movement");
      this.startposition = null;
      this.endposition = null;
      return;
    },

    bishopLogic: function (startspace, endspace, color) {
      if (startspace === endspace) {
        console.log("illegal move -- no movement");
        this.startposition = null;
        this.endposition = null;
        return;
      }

      var xMove = endspace[0] - startspace[0];
      var yMove = endspace[1] - startspace[1];

      if (xMove == 0 && yMove == 0) {
        // are they not moving at all?
        console.log("illegal move -- bad movement");
        this.startposition = null;
        this.endposition = null;
        return;
      }

      // if they're moving by a square amount, good!
      if (Math.abs(xMove) == Math.abs(yMove)) {
        var xDir = xMove > 0 ? 1 : -1;
        var yDir = yMove > 0 ? 1 : -1;

        var x = startspace[0] + xDir;
        var y = startspace[1] + yDir;

        while (x != endspace[0]) {
          // we chose x arbitrarily since x = y
          if (this.piecesArray[x][y] !== null) {
            console.log("illegal move -- piece is in the way");
            this.startposition = null;
            this.endposition = null;
            return;
          }
          x += xDir;
          y += yDir;
        }

        // if the spot we (successfully) land on has a piece, capture it.
        var endSpotPiece = this.piecesArray[x][y];
        if (endSpotPiece !== null) {
          if (endSpotPiece.color != color) {
            console.log("capture");
            this.move(startspace, endspace);
            return;
          }

          console.log("illegal move -- piece is already there");
          this.startposition = null;
          this.endposition = null;
          return;
        }

        // if we move by square value and no pieces are in our path, we're
        this.move(startspace, endspace);
        return;
      }

      console.log("illegal move -- bad movement");
      this.startposition = null;
      this.endposition = null;
      return;
    },

    //Black is on top, White is at the bottom
    pawnLogic: function (startspace, endspace, color) {
      if (startspace === endspace) {
        console.log("illegal move -- no movement");
        this.startposition = null;
        this.endposition = null;
        return;
      }

      if (color == "Black") {
        if (startspace[0] === 6) {
          if (
            this.piecesArray[startspace[0] - 1][startspace[1]] === null &&
            this.piecesArray[startspace[0] - 2][startspace[1]] === null
          ) {
            if (
              endspace[0] == startspace[0] - 2 &&
              endspace[1] == startspace[1]
            ) {
              this.move(startspace, endspace);
              return;
            }
          }
        }

        if (this.piecesArray[startspace[0] - 1][startspace[1]] === null) {
          //honestly I thought it just looked cleaner
          if (
            endspace[0] == startspace[0] - 1 &&
            endspace[1] == startspace[1]
          ) {
            this.move(startspace, endspace);
            return;
          }
        }

        if (
          7 >= startspace[1] + 1 &&
          this.piecesArray[startspace[0] - 1][startspace[1] + 1] !== null &&
          this.piecesArray[startspace[0] - 1][startspace[1] + 1].substring(
            0,
            5
          ) === "White"
        ) {
          if (
            endspace[0] == startspace[0] - 1 &&
            endspace[1] == startspace[1] + 1
          ) {
            this.move(startspace, endspace);
            return;
          }
        }

        if (
          0 <= startspace[1] - 1 &&
          this.piecesArray[startspace[0] - 1][startspace[1] - 1] != null &&
          this.piecesArray[startspace[0] - 1][startspace[1] - 1].substring(
            0,
            5
          ) == "White"
        ) {
          if (
            endspace[0] == startspace[0] - 1 &&
            endspace[1] == startspace[1] - 1
          ) {
            this.move(startspace, endspace);
            return;
          }
        }
        // illegal move
        this.startposition = null;
        this.endposition = null;
        return;
      } else if (color == "White") {
        if (startspace[0] === 1) {
          if (
            this.piecesArray[startspace[0] + 1][startspace[1]] === null &&
            this.piecesArray[startspace[0] + 2][startspace[1]] === null
          ) {
            if (
              endspace[0] == startspace[0] + 2 &&
              endspace[1] == startspace[1]
            ) {
              this.move(startspace, endspace);
              return;
            }
          }
        }

        if (this.piecesArray[startspace[0] + 1][startspace[1]] === null) {
          if (
            endspace[0] == startspace[0] + 1 &&
            endspace[1] == startspace[1]
          ) {
            this.move(startspace, endspace);
            return;
          }
        }
        console.log(
          this.piecesArray[startspace[0] - 1][startspace[1] + 1] +
            "is diagonally right"
        );
        console.log(
          startspace[1] + 1 + "," + (7 >= startspace[1] + 1) + "logic gate"
        );
        if (
          7 >= startspace[1] + 1 &&
          this.piecesArray[startspace[0] + 1][startspace[1] + 1] != null &&
          this.piecesArray[startspace[0] + 1][startspace[1] + 1].substring(
            0,
            5
          ) == "Black"
        ) {
          if (
            endspace[0] == startspace[0] + 1 &&
            endspace[1] == startspace[1] + 1
          ) {
            this.move(startspace, endspace);
            return;
          }
        }
        if (
          0 <= startspace[1] - 1 &&
          this.piecesArray[startspace[0] + 1][startspace[1] - 1] != null &&
          this.piecesArray[startspace[0] + 1][startspace[1] - 1].substring(
            0,
            5
          ) == "Black"
        ) {
          if (
            endspace[0] == startspace[0] + 1 &&
            endspace[1] == startspace[1] - 1
          ) {
            this.move(startspace, endspace);
            return;
          }
        }
        console.log("illegal move");
        this.startposition = null;
        this.endposition = null;
        return;
      } else {
        console.log("illegal move");
        this.startposition = null;
        this.endposition = null;
        return;
      }
    },

    kingLogic: function (startspace, endspace, color) {
      if (
        endspace[1] === startspace[1] + 2 ||
        endspace[1] === startspace[1] - 2
      ) {
        this.castleLogic(startspace, endspace, color);
      }
      var i, j;
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          //if in bounds
          if (
            7 >= startspace[1] + j &&
            0 <= startspace[1] + j &&
            7 >= startspace[0] + i &&
            0 <= startspace[0] + i
          ) {
            //if space is not occupied by teammate
            if (
              this.piecesArray[startspace[0] + i][startspace[1] + j] == null ||
              this.piecesArray[startspace[0] + i][startspace[1] + j].substring(
                0,
                5
              ) != color
            ) {
              //not skip turn check
              if (!(i == 0 && j == 0)) {
                //if it's the space selected
                if (
                  endspace[0] == startspace[0] + i &&
                  endspace[1] == startspace[1] + j
                ) {
                  this.move(startspace, endspace);
                  return;
                }
              }
            }
          }
        }
      }
      console.log("illegal move");
      this.startposition = null;
      this.endposition = null;
      return;
    },
    castleLogic: function (startspace, endspace, color) {
      if (color == "White") {
        if (endspace[1] == startspace[1] + 2 && endspace[1] == 6) {
          //short castle
          if (
            this.piecesArray[0][7] != null &&
            this.piecesArray[0][7] === "WhiteRook" &&
            this.piecesArray[0][6] === null &&
            this.piecesArray[0][5] === null
          ) {
            console.log("Hi, I'm sadm");
            this.castleMove(color, "short");
          }
        }
        if (endspace[1] == startspace[1] - 2 && endspace[1] == 2) {
          //short castle
          if (
            this.piecesArray[0][0] != null &&
            this.piecesArray[0][0] === "WhiteRook" &&
            this.piecesArray[0][1] === null &&
            this.piecesArray[0][2] === null &&
            this.piecesArray[0][3] === null
          ) {
            this.castleMove(color, "long");
          }
        }
      }
      if (color == "Black") {
        if (endspace[1] == startspace[1] + 2) {
          //short castle
          if (
            this.piecesArray[7][7] != null &&
            this.piecesArray[7][7] === "BlackRook" &&
            this.piecesArray[7][6] === null &&
            this.piecesArray[7][5] === null
          ) {
            this.castleMove(color, "short");
          }
        }
        if (endspace[1] == startspace[1] - 2) {
          //short castle
          if (
            this.piecesArray[7][0] != null &&
            this.piecesArray[7][0] === "BlackRook" &&
            this.piecesArray[7][1] === null &&
            this.piecesArray[7][2] === null &&
            this.piecesArray[7][3] === null
          ) {
            this.castleMove(color, "long");
          }
        }
      }
    },

    checkWin: function () {
      var whiteWins = true;
      var blackWins = true;

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          if (this.piecesArray[i][j] === "BlackKing") whiteWins = false;
          if (this.piecesArray[i][j] === "WhiteKing") blackWins = false;
        }
      }
      if (whiteWins) this.winner = "White";
      if (blackWins) this.winner = "Black";
    },
    checkPromotion: function () {
      for (var i = 0; i < 8; i++) {
        if (this.piecesArray[0][i] == "BlackPawn") {
          this.piecesArray[0][i] = "BlackQueen";
        }
        if (this.piecesArray[7][i] == "WhitePawn") {
          this.piecesArray[7][i] = "WhiteQueen";
        }
      }
    },

    voteToUndoMove() {
      //if this.undo is false, it means this player is the first one to request undoing,
      //and the server will set the other player's this.undo to true to allow them
      //to actually undo the move.
      //if this.undo is ture, the server will undo the move and send it to everyone.
      this.$socket.client.emit("undoEvent", this.undo);
      if (!this.undo) {
        this.undoConfirmation = true;
      }
      if (this.undo) {
        this.piecesArray = this.undoArray;
        this.undo = false;
        this.undoArray = null;
        this.undoConfirmation = false;
        this.startposition = null;
        this.endposition = null;
        this.turn = !this.turn;
        this.$forceUpdate();
        console.log("Board reset for sender");
      }
    },
  },

  sockets: {
    setBoard(c, recievedArray, turn, prev) {
      if (c == null) {
        this.gameFullScreen = true;
        this.color = "Gray";
      } else {
        this.color = c;
      }

      if (recievedArray != null) {
        this.piecesArray = recievedArray;
      }
      if (
        prev != null &&
        JSON.stringify(prev) !== JSON.stringify(recievedArray)
      ) {
        this.undoArray = prev;
      }

      if (turn == null) {
        if (this.color == "Gray") {
          this.turn = true;
        } else {
          this.turn = c === "White" ? true : false;
        }
      } else if (this.color == "Gray") {
        this.turn = turn;
      } else {
        this.turn = (this.color == "White") == turn;
      }
      this.checkWin();
      this.$forceUpdate();
      console.log(turn);
      console.log(this.color);
    },
    moveResponse(recievedArray) {
      this.undoArray = [...this.piecesArray];
      this.undo = false;
      this.undoConfirmation = false;

      this.piecesArray = recievedArray;
      this.startposition = null;
      this.endposition = null;
      this.turn = !this.turn;

      this.checkWin();
      this.$forceUpdate();
    },
    getColor() {
      if (this.color != null) {
        this.$socket.client.emit("colorEcho", this.color);
      }
    },
    colorEcho(col) {
      this.$socket.client.emit("giveColor", col);
    },
    undoResponse(agreer) {
      if (agreer) {
        this.piecesArray = this.undoArray;
        this.undo = false;
        this.undoConfirmation = false;
        this.undoArray = null;
        this.startposition = null;
        this.endposition = null;
        this.turn = !this.turn;
        this.$forceUpdate();
      } else {
        this.undo = true;
      }
    },
    moveEventRequest() {
      this.$socket.client.emit("moveEvent", this.piecesArray);
    },
  },
};
</script>


<style>
/* taken and altered from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 */
/* CSS for a chessboard, altered for our specifications and ideas. */
.chess-board {
  border-spacing: 0;
  border-collapse: collapse;
}
.chess-board th {
  padding: 0.5em;
}
.chess-board td {
  border: 2px solid;
  border-color: black;
  width: 64px;
  height: 64px;
  padding: 0;
  margin: 0;
}
.chess-board .light {
  background: #eee;
}
.chess-board .dark {
  background: #622;
}
.chess-board .highlight {
  background: #ffa;
}

.button {
  cursor: pointer;
}
.board {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
