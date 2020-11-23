<template>
  <div class="board">
    <!-- Creates an html table to simulate a chessboard -->
    <!-- idea taken from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 -->
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
                <!-- Use Vue.JS functions to iterate through each square of the chess board and -->\
                <!-- Dynamically put chess pieces where they belong and empty clickable tile squares otherwise. -->
                <!-- Additionally, alternate between dark and light tiles. -->
                <tr v-for="n in 8" :key="n">
                    <th>{{9 - n}}</th>
                    <td v-for="m in 8" :key="m" :class="{light: (n+m)%2==0, dark: (n+m)%2==1}">
                        <Tile v-if="piecesArray[8-n][m-1] === null" :space="String(8-n) + String(m-1)" v-on:tileSelected="tileSelection" />
                        <Piece v-if="piecesArray[8-n][m-1] != null" :pieceType="piecesArray[8-n][m-1]" :space="String(8-n) + String(m-1)" v-on:pieceSelected="pieceSelection" />
                    </td>
                </tr>
            </tbody>
        </table>
  </div>
</template>

<script>
//TODO: Store chessboard so it doesn't delete on refresh (use vuex?)
//Move Pieces!
//Send moves to the other player (can't do this yet)

import Tile from '@/components/Tile'
import Piece from '@/components/Piece'
export default {
    components:{
        Tile, Piece
    },
    data: function(){
        return{
            //taken from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
            piecesArray: Array.from(Array(8), () => new Array(8).fill(null)),
            turn: true,
            startposition: null,
        }
    },
    created: function() {
        var i;
        var j;
        for ( i = 7; i >= 0; i--){
            for ( j = 7; j >= 0; j--){
                if (i === 7) {
                    if (j === 0 || j === 7) this.piecesArray[i][j] = "BlackRook";
                    if (j === 1 || j === 6) this.piecesArray[i][j] = "BlackKnight";
                    if (j === 2 || j === 5) this.piecesArray[i][j] = "BlackBishop";
                    if (j === 3) this.piecesArray[i][j] = "BlackQueen";
                    if (j === 4) this.piecesArray[i][j] = "BlackKing";
                }
                if (i === 6){
                    this.piecesArray[i][j] = "BlackPawn";
                }
                if (i === 1){
                    this.piecesArray[i][j] = "WhitePawn";
                }
                if (i === 0){
                    if (j === 0 || j === 7) this.piecesArray[i][j] = "WhiteRook";
                    if (j === 1 || j === 6) this.piecesArray[i][j] = "WhiteKnight";
                    if (j === 2 || j === 5) this.piecesArray[i][j] = "WhiteBishop";
                    if (j === 3) this.piecesArray[i][j] = "WhiteQueen";
                    if (j === 4) this.piecesArray[i][j] = "WhiteKing";
                }
            }
        }
        //Somewhere either here or another function, we should retrieve the chessboard.
    },
    methods: {
        //When a tile is clicked while a piece is selected, delete the piece at the old position,
        //move it to the new position, store the new board, and send it to the opponent.
        tileSelection: function(position) {
            var space = [Number(position[0]), Number(position[1])]
            
            if (this.piecesArray[space[0]][space[1]] === null){
                if (this.startposition !== null){
                    this.move(this.startposition, position)
                    //EMIT THE PIECESARRAY TO THE SERVER HERE
                }
                console.log(position)
            }
        }
        
        ,
        //When a piece is selected, check if a piece is already selected. If not, store its position.
        //Otherwise, overwrite the piece at this position with the first selected piece.
        pieceSelection: function(position){
            if (this.startposition === null){
                   this.startposition = position;
                }
            else{
                this.move(this.startposition, position)
                //EMIT THE PIECESARRAY TO THE SERVER HERE
            }
            console.log(position)
        },
        //Move a piece to a different square and remove it from this space,
        //then pass the turn to the other player.
        move: function(startposition, endposition){
            var startspace = [Number(startposition[0]), Number(startposition[1])]
            var endspace = [Number(endposition[0]), Number(endposition[1])]
            
            this.piecesArray[endspace[0],endspace[1]] = this.piecesArray[startspace[0],startspace[1]];
            this.piecesArray[startspace[0],startspace[1]] = null;

            this.startposition = null;
            this.turn =! this.turn;
        }
    },
    sockets: {
        connect() {
          this.$socket.client.emit("joinRoom", this.$route.params.gameID)
        },
        fullRoom(){
            console.log('full')
        }
  }
}
</script>


<style>
/* taken and altered from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 */
/* CSS for a chessboard, altered for our specifications and ideas. */
    .chess-board { border-spacing: 0; border-collapse: collapse; }
    .chess-board th { padding: .5em; }
    .chess-board td { border: 2px solid; border-color: black; width: 64px; height: 64px }
    .chess-board .light { background: #eee; }
   .chess-board .dark { background: #622; }
</style>
