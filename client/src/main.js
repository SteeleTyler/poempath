import Vue from 'vue'
import App from './App.vue'
import Router from './router.js'

import './styles/quasar.styl'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'

Vue.use(Quasar, {
  config: {}
 })

Vue.use(Router)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: Router
}).$mount('#app')
