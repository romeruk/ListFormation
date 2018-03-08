import Vue from 'vue';
import App from './App.vue';
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

new Vue({
  el: '#app',
  render: h => h(App)
});
