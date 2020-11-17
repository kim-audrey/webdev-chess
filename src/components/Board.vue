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
                    <td v-for="m in 8" :key="m" :class="{ light: (n+m)%2==0, dark: (n+m)%2==1}" />
                </tr>
            </tbody>
        </table>
  </div>
</template>

<script>
export default {
    data: function(){
        return{
            tilesArray: new Array[8][8],
            pieceArray: new Array[8][8]
        }
    },
    mounted: function(){

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