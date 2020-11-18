<template>
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
        selected: function() {
            this.$emit('tileSelected', this.space)
        }
    }
}
</script>

<style>
.tile{
    height: 100%;
}
</style>