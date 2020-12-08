<template>
  <div class="game">
    <Board :key="componentKey" />
  </div>
</template>

<script>
// @ is an alias to /src
import Board from "@/components/Board.vue";

export default {
  name: "Game",
  components: {
    Board,
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: {
    $route() {
      this.componentKey += 1;
    },
  },
};
</script>
