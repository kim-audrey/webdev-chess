<template>
    <div id="app">
        <h1 id="title">Chess</h1>
        <p id="byline">By: Yash C. Alex D. Audrey K. Michael P.</p>

        <button class="button" @click="pingServer">Make Your Own Game</button>
        <transition name="fade" appear>
            <div class="modal-overlay" v-if="showModal" @click="showModal=false"></div>
        </transition>

        <transition name="slide" appear>
            <div class="modal" v-if="showModal">
                <h1>Your New Game Code:</h1>
                <p>Lorem</p>
                <button class="button" @click="showModal=false">Close Modal</button>
            </div>

        </transition>

        <div id="gamecode">
            <h1>Enter Game Code Here: </h1>
            <input type="text" placeholder="Game Code">
        </div>
    </div>

</template>

<script>
export default {
  name: "Login",
  components: {

  },
  data() {
    return {
      showModal: true,
      socketMessage: ""
    };
  },
  // lifecycle functions
  mounted () {
      this.showModal = false
  },
  //Responses to events sent from the server
  sockets: {
    connect() {
        console.log('receeve')
     },
    disconnect() { },
    welcome(data) {
      console.log(data)
    }
  },
  //Way to send things to server (call the function)
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
        this.$socket.client.emit('pingServer', 'PING!')
    },
    showThatModal() {
        this.showModal = true;
    }
  }
};
</script>

<style scoped>
#app{
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

#byline {
}


/* Credit to: https://www.youtube.com/watch?v=VuGRSpy92cI */
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;

    width: 100%;
    background-color: #FFF;
    border-radius: 16px;
}

.button {
    appearance: none;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;

    display: inline-block;
    padding: 15px 25px;
    background-image: linear-gradient(to right, #34495E, #41B883);
    border-radius: 8px;

    color: #FFF;
    font-size: 18px;
    font-weight: 700;

    box-shadow: 3px 3px rgba(0,0,0,.4);
    transition: 0.4s ease-out;
}

.modal-overlay{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background-color: rgba(0,0,0,0.3);
}

/* This just like... exists because we have fade */
.fade-enter-active,
.fade-leave-active { 
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

#gamecode {
    position: relative;
    justify-content: center;
    align-items: center;
    display: flex;
}


<<<<<<< Updated upstream
</style>
=======
</style>


<script>
export default {
  name: "App",
  data() {
    return {
      showModal: true
    };
  },
  components: {},

  

  

};
</script>
>>>>>>> Stashed changes
