<template>
  <div class="board">
    <!-- Creates an html table to simulate a chessboard -->
    <!-- idea taken from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 -->
    <p v-if="color === null">Please wait...</p>
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
//Send moves to the other player (can't do this yet)

//Add movement logic

//3rd sprint stuff (don't worry about this)
// Randomized color (might be easy)
// Switch board direction


import Tile from '@/components/Tile'
import Piece from '@/components/Piece'
import func from '../../vue-temp/vue-editor-bridge'
export default {
    components:{
        Tile, Piece
    },
    data: function(){
        return{
            //taken from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
            piecesArray: Array.from(Array(8), () => new Array(8).fill(null)),
            color: null,
            turn: null,
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

        //Joins room upon board being created
        this.$socket.client.emit("joinRoom", this.$route.params.gameID)
        //Somewhere either here or another function, we should retrieve the chessboard.
    },
    methods: {
        //When a tile is clicked while a piece is selected, delete the piece at the old position,
        //move it to the new position, store the new board, and send it to the opponent.
        tileSelection: function(position) {
            var space = [Number(position[0]), Number(position[1])]
            
            if (this.piecesArray[space[0]][space[1]] === null){
                if (this.startposition !== null){
                    console.log("Moving piece on to tile!")
                    this.move(this.startposition, position)
                } else {
                    console.log("Cannot select a tile to start!")
                }
                console.log("Tile at " + position)
            }
        },
        //When a piece is selected, check if a piece is already selected. If not, store its position.
        //Otherwise, overwrite the piece at this position with the first selected piece.
        pieceSelection: function(position){
            if (this.startposition === null){
                    console.log("Start-Selected " + position)
                   this.startposition = position;
                }
            else{
                console.log("Moving piece on to piece")
                this.move(this.startposition, position)
            }
            console.log("Piece at " + position)
        },
        //Move a piece to a different square and remove it from this space,
        //then pass the turn to the other player.
        move: function(startposition, endposition){
            if(logic(startposition,endposition)){
            var startspace = [Number(startposition[0]), Number(startposition[1])]
            var endspace = [Number(endposition[0]), Number(endposition[1])]

            this.piecesArray[endspace[0]][endspace[1]] = this.piecesArray[startspace[0]][startspace[1]];
            this.piecesArray[startspace[0]][startspace[1]] = null;

            this.startposition = null;
            this.turn =! this.turn;

            this.$socket.client.emit('moveEvent', this.piecesArray)

            this.$forceUpdate();
            }
        }, 
        logic: function(startposition,endposition){
            //returns whether the move is valid, such as:
            //is the player selecting their own pieces
            //is the move legal
            var startspace = [Number(startposition[0]), Number(startposition[1])]
            var endspace = [Number(endposition[0]), Number(endposition[1])]
            pieceIdentity= this.piecesArray[startspace[0]][startspace[1]];

            switch (pieceIdentity) {
                case "BlackRook":
                    console.log("Going to Rook Logic");
                    break;
                case "WhiteRook":
                    console.log("Going to Rook Logic");
                    break;
                case "BlackKnight":
                    console.log("Uh oh.");
                    break;
                case "WhiteKinght":
                    console.log("Uh oh.");
                    break;
                case "BlackBishop":
                    console.log("Uh oh.");
                    break;
                case "WhiteBishop":
                    console.log("Uh oh.");
                    break;
                case "BlackKing":
                    console.log("Going to King Logic");
                    return this.KingLogic(startspace,endspace,pieceIdentity,"Black")
               
                 case "WhiteKing":
                    console.log("Going to King Logic");
                    return this.KingLogic(startspace,endspace,pieceIdentity,"White")
                
                case "BlackQueen":
                    console.log("Uh oh.");
                break;
                case "WhiteQueen":
                    console.log("Uh oh.");
                break;
                case "BlackPawn":
                    console.log("Going to Pawn Logic");
                    return this.PawnLogic(startspace,endspace,pieceIdentity,"Black")
                case "WhitePawn":
                    console.log("Going to Pawn Logic");
                    return this.PawnLogic(startspace,endspace,pieceIdentity,"White")
               
               default:
                    console.log("Uhhhhh damn, you weren't supposed to see that");
                    return False;
                
            }
        },
        //Black is on top, White is at the bottom
        PawnLogic: function(startspace,endspace,color){
            if (color=="Black"){

                if((this.piecesArray[startspace[0]-1][startspace[1]]===null)){
                    //honestly I thought it just looked cleaner
                    if((endspace[0]==startspace[0]-1)&&(endspace[1]==startspace[1])){
                        return true;
                    }
                    
                }
                if( (7<=(startspace[1]+1)) && (this.piecesArray[startspace[0]-1][startspace[1]+1].substring(0,6)=="White")){
                    if( (endspace[0]==(startspace[0]-1)) && (endspace[1]==(startspace[1]+1)) ){
                        return true;
                    }
                    
                }
                if( (0>=(startspace[1]-1)) && (this.piecesArray[startspace[0]-1][startspace[1]-1].substring(0,6)=="White")){
                    if( (endspace[0]==(startspace[0]-1)) && (endspace[1]==(startspace[1]-1)) ){
                        return true;
                    }

                }
                return false;

            }
            else if (color=="White"){
                if((this.piecesArray[startspace[0]+1][startspace[1]]===null)){
                    if((endspace[0]==startspace[0]+1)&&(endspace[1]==startspace[1])){
                        return true;
                    }
                }
                if( (7<=(startspace[1]+1)) && (this.piecesArray[startspace[0]+1][startspace[1]+1].substring(0,6)=="Black")){
                    if((endspace[0]==startspace[0]+1)&&(endspace[1]==(startspace[1]+1))){
                        return true;
                    }
                }
                if( (0>=(startspace[1]-1)) && (this.piecesArray[startspace[0]+1][startspace[1]-1].substring(0,6)=="Black")){
                    if((endspace[0]==startspace[0]+1)&&(endspace[1]==(startspace[1]-1))){
                        return true;
                    }
                }
                    return false;

            }
            else{return false;}
        },

        KingLogic: function(startspace,endspace,color){
            var startspace = [Number(startposition[0]), Number(startposition[1])]
            var endspace = [Number(endposition[0]), Number(endposition[1])]
            opposite="";
             
            
            if((7<=(startspace[0]+1))&&(this.piecesArray[startspace[0]+1][startspace[1]]!=color)){
                true
            }
        }



    },
    sockets: {
        fullRoom(){
            console.log('full')
        },
        color(c){
            this.color = c;
            this.turn = c === "White" ? true : false;
        },
        moveResponse(recievedArray){
            this.piecesArray = recievedArray
            this.$forceUpdate();
        }
    }
}
</script>


<style>
/* taken and altered from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 */
/* CSS for a chessboard, altered for our specifications and ideas. */
    .chess-board { border-spacing: 0; border-collapse: collapse; }
    .chess-board th { padding: .5em; }
    .chess-board td { border: 2px solid; border-color: black; width: 64px; height: 64px; padding: 0; margin: 0; }
    .chess-board .light { background: #eee; }
   .chess-board .dark { background: #622; }
</style>
