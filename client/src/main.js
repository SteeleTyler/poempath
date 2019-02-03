import Vue from 'vue'
import App from './App.vue'
import Router from './router.js'
import store from './store.js'
import VueSession from 'vue-session'

import './styles/quasar.styl'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'

Vue.use(Quasar, {
  config: {}
 })

Vue.use(Router)

Vue.use(VueSession)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router: Router
}).$mount('#app')
