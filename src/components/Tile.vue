<template>
    <!-- Set up a handler for clicking a tile. -->
    <div class="tile" v-on:click="selected"/>
</template>

<script>
export default {
    props: {
        space: {
            type: String
        }
    },
    methods: {
        //When the tile is clicked, it sends back the space it is on. 
        selected: function() {
            this.$emit('tileSelected', this.space)
        }
    }
}
</script>

<style>
.tile{
    height: 64px;
    width: 64px;
}
</style>