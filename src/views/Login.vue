<template>
    <div id="app">
        <h1 id="title">Chess</h1>
        <p id="byline">By: Yash C. Alex D. Audrey K. Michael P.</p>

        <button class="button" @click="createRoom">Make Your Own Game</button>

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

    };
  },
  // lifecycle functions
  mounted () {

  },
  //Responses to events sent from the server
  sockets: {
    connect() {
        console.log('receeve')
     },
  },
  //Way to send things to server (call the function)
  methods: {
    // when they enter gamecode, redirect them to game/{gamecode} 
    
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
