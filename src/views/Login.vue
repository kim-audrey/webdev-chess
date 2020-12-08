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
      <!-- v-model means that vue .js will make gamecode whatever the user inputs
      (look at data in the script)-->
      <input v-model="gamecode" type="text" placeholder="Game Code" />
      <button class="button" @click="joinRoom">Join Game!</button>
      <h2 id="error" v-if="error">Error! Invalid Gamecode!</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  // initialilse all the variables you'll be using throughout Vue in data()
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
      // dollar sign in front of variable usually means it's not part of data or variable, it's a higher level thing
      // it's calling functions from /main.js/VueSocketIO
      // this line sends an event to the server.js and look at line 15 on that file
      this.$socket.client.emit("roomListRequest");
      // then from this line, server  runs roomListResponse function (in sockets) and the in it, calls
      // Login.Vue -> roomListResponse in our sockets
      // FLOW: button --> Login.vue methods --> server.js sockets --> Login.vue sockets
    },
    createRBChessRoom: function () {
      this.rb = true;
      this.$socket.client.emit("roomListRequest");
    },
    joinRoom: function () {
      if(!isNaN(this.gamecode)){
        this.error = false;
        // this.$router goes to /router/index.js 
        // she says: "put game/ on the url that we're currently in" or kind of just like reroute to our correct place
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