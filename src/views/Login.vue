<template>
  <div id="app">
    <h1 id="title">Chess</h1>
    <p id="byline">By: Yash C. Alex D. Audrey K. Michael P.</p>

    <button class="button" @click="createChessRoom">Play Chess</button>
    <button class="button" @click="createRBChessRoom">
      Play Really Bad Chess
    </button>

    <div id="gamecode">
      <h1>Enter Game Code Here:</h1>
      <input v-model="gamecode" type="text" placeholder="Game Code" />
      <button class="button" @click="joinRoom">Join Game!</button>
      <h2 id="error" v-if="error">Error! Invalid Gamecode!</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      gamecode: "",
      rb: false,
      error: false
    };
  },
  //Responses to events sent from the server
  sockets: {
    connect() {
      console.log("receeve");
    },
    roomListResponse(roomList) {
      var rooms = [];
      roomList.forEach((element) => rooms.push(element[0]));
      console.info(roomList);
      console.info(rooms);
      if (this.rb) {
        var randomRBCode;
        do {
          randomRBCode = "";
          var firstNum;
          do {
            firstNum = String(Math.floor(Math.random() * 10));
          } while (firstNum === "1");
          randomRBCode += firstNum;
          for (var i = 0; i < 3; i++) {
            randomRBCode += String(Math.floor(Math.random() * 10));
          }
        } while (rooms.includes(String(randomRBCode)));
        this.$router.push("game/" + randomRBCode);
      } else {
        var randomCode;
        do {
          randomCode = "1";
          for (var j = 0; j < 3; j++) {
            randomCode += String(Math.floor(Math.random() * 10));
          }
        } while (rooms.includes(String(randomCode)));
        this.$router.push("game/" + randomCode);
      }
    },
  },
  //Way to send things to server (call the function)
  methods: {
    // when they enter gamecode, redirect them to game/{gamecode}
    createChessRoom: function () {
      this.rb = false;
      this.$socket.client.emit("roomListRequest");
    },
    createRBChessRoom: function () {
      this.rb = true;
      this.$socket.client.emit("roomListRequest");
    },
    joinRoom: function () {
      if(!isNaN(this.gamecode)){
        this.error = false;
        this.$router.push("game/" + this.gamecode);
      } 
      else {
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
#app {
  position: relative;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}

#title {
  color: blue;
}

#error {
  color: red;
}

.button {
  cursor: pointer;
}

#gamecode {
  position: relative;
  justify-content: center;
  align-items: center;
}
</style>