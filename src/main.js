import Vue from 'vue';
import App from './App.vue';
import router from './router'
import store from './store'
import './assets/css/base.css'
import './assets/css/common.css'
import './plugins/element.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueClipboard from 'vue-clipboard2'
import VueI18n from 'vue-i18n'
import {getLang} from './libs/utils'
import './assets/iconfont/iconfont.css'
// require styles
import 'swiper/dist/css/swiper.css'
import VueQrcode from '@xkeshi/vue-qrcode'
// import axios from 'axios'
// Vue.prototype.$http = axios
Vue.use(VueClipboard)
Vue.use(VueI18n)
Vue.use(VueAwesomeSwiper)
Vue.component(VueQrcode.name,VueQrcode)
const i18n = new VueI18n({
  // locale: LangStorage.getLang('zh'),  // 语言标识，后面会用做切换和将用户习惯存储到本地浏览器
  locale: getLang() || 'zh', // 语言标识
  messages: {
    'zh': require('./locale/zh'),
    'en': require('./locale/en')
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
