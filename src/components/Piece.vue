<template>
  <div class="piece">
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
        return{
            hasNotMoved: true
        }
    }, 
    methods: {
        selected: function(){
            this.$emit('pieceSelected', this.space)
        }
    }
}
</script>

<style>

</style>