<template>
  <div class="board">
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
                <tr v-for="n in 8" :key="n">
                    <th>{{9 - n}}</th>
                    <td v-for="m in 8" :key="m" :class="{light: (n+m)%2==0, dark: (n+m)%2==1}">
                        <Tile v-on:tileSelected="tileSelection" />
                    </td>
                </tr>
            </tbody>
        </table>
  </div>
</template>

<script>
import Tile from '@/components/Tile'
export default {
    components:{
        Tile
    },
    data: function(){
        return{
            //taken from https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
            //piecesArray: [[...Array(8)].map(() => Array(8)),]
            //taken from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
            piecesArray: Array.from(Array(8), () => new Array(8))
        }
    },
    mounted: function() {
        var i;
        var j;
        for ( i = 7; i >= 0; i--){
            for ( j = 7; j >= 0; j--){
                if (i === 7) {
                    if (j === 0 || j === 7) {
                        this.piecesArray[i][j] = "BlackRook"; 
                    }
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
    },
    methods: {
        tileSelection: function(position) {
            console.log(position)
        },
        pieceSelection: function(position){
            console.log(position)
        }
    }
}
</script>


<style>
/* taken from https://stackoverflow.com/questions/26432492/chessboard-html5-only/26432909 */
    .chess-board { border-spacing: 0; border-collapse: collapse; }
    .chess-board th { padding: .5em; }
    .chess-board td { border: 1px solid; width: 2em; height: 2em; }
    .chess-board .light { background: #eee; }
    .chess-board .dark { background: #000; }
</style>