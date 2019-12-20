import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  console.log("this is a beforeEach");
  next();
});
router.beforeResolve((to, from, next) => {
  console.log("this is a beforeResolve");
  next();
});
router.afterEach((to, from, next) => {
  console.log("this is a afterEach");
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
