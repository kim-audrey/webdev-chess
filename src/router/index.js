import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Game from "../views/Game.vue";
import NoGameCode from "../views/NoGameCode.vue";
import NotFound from "../views/NotFound.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/game/:gameID",
    name: "Game",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Game
  },
  {
    path: "/game/",
    name: "NoGameCode",
    component: NoGameCode
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound
  },

];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
