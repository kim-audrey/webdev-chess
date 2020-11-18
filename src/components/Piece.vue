<template>
  <div class="piece">
      <!-- Load the piece's image, which is stored in assets, -->
      <!-- Based on the name that was passed from Board on creation. -->
      <!-- Set up a handler for when it is clicked. -->
      <img :src="require(`../assets/${pieceType}.png`)" v-on:click="selected" />
  </div>
</template>

<script>
export default {
    props: {
        pieceType: {
            type: String
        },
        space: {
            type: String
        }
    },
    data: function() {
        //Hold variables that the piece itself contains. (Doesn't matter yet but good to know about.)
        return{
            hasNotMoved: true
        }
    }, 
    methods: {
        //When the piece is clicked, it sends back the space it is on. 
        selected: function(){
            this.$emit('pieceSelected', this.space)
        }
    }
}
</script>

<style>

</style>