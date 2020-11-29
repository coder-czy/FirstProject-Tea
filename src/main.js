import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vantConfig from './vant.config'
import axios from 'axios'
import 'lib-flexible/flexible'




Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(vantConfig)



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')