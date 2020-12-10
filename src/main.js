import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

//get the socket.io server that is running at server.js
const port= process.env.PORT || 8000
const socket = io('http://localhost:' + port);
//set up Vue to use that server
Vue.use(VueSocketIOExt, socket);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
