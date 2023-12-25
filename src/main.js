//兼容360
import "babel-polyfill"

import Vue from "vue";
import ElementUI from 'element-ui'
import App from "./App.vue";
import App2 from "./App2.vue";
import router from "./router";
import store from "./store";
import VueCookies from 'vue-cookies';
Vue.config.productionTip = false;

import { rTime } from "./request/formResetFields.js"
Vue.prototype.rTime = rTime
import installElement from './utils/element.js'
import VueCropper from 'vue-cropper'

import { delHtmlTag, productionImage } from './request/common.js'
Vue.prototype.delHtmlTag = delHtmlTag

Vue.prototype.productionImage = productionImage


import 'lib-flexible/flexible.js'

// RAS加密
import JSEncrypt from "jsencrypt"
import { gettheme } from '@/api/system.js'

var themeName = 'image'
// async function ff(){
//   var qsa= await gettheme()
// }
// ff()

Vue.prototype.$themeName = themeName;


window.document.documentElement.setAttribute('data-theme', 'image');

Vue.use(VueCropper);
Vue.use(ElementUI);
Vue.use(VueCookies);
installElement(Vue)





// 存储域名（后边用）
// eslint-disable-next-line no-unused-vars  
// if(process.env.VUE_APP_ISSAME == 'yes'){

// }else{
//   let url = ''
//   if(process.env.VUE_APP_SECRET_API == '/api'){
//     url = url.split('/');
//     url = url[2].split(':')[0]
//   }else{
//     url = process.env.VUE_APP_SECRET_API.split('/');
//     url = url[2].split(':')[0]


//   }



//   if(process.env.VUE_APP_SECRET_API == '/api'){
//     sessionStorage.setItem("Webscocket_video",'')
//   }else if(process.env.VUE_APP_CURRENTMODE == 'thjc'){
//     sessionStorage.setItem("Webscocket_video",'41.208.9.228')
//   }else{
//     sessionStorage.setItem("Webscocket_video",url)
//   }


//   if(process.env.VUE_APP_NAME == '测试服务器'){
//     sessionStorage.setItem("Webscocket",'') 
//   }else if(process.env.VUE_APP_CURRENTMODE == 'thjc'){
//     sessionStorage.setItem("Webscocket",'41.208.9.228') 
//   }else{
//     sessionStorage.setItem("Webscocket",url)
//   }
// }





Vue.prototype.$jsEncrypt = JSEncrypt;

Vue.prototype.$sj_bs = process.env.VUE_APP_CURRENTMODE;
Vue.prototype.$source_name = process.env.VUE_APP_NAME;

Vue.prototype.$cookies.config(60 * 30);

if (process.env.VUE_APP_COMPANY == 'yes') {
  Vue.prototype.$IS_company = true
} else {
  Vue.prototype.$IS_company = false
}

Vue.prototype.$Version = 'V2.0.0'

Vue.prototype.$env_bs = process.env.NODE_ENV

Vue.prototype.$appname = process.env.VUE_APP_NAME_ALL

Vue.prototype.$currentmode = process.env.VUE_APP_CURRENTMODE

//ie兼容标记$isie
if (!!window.ActiveXObject || "ActiveXObject" in window) {
  Vue.prototype.$isie = true

} else {

  Vue.prototype.$isie = false

}

// var mountele;
// if(process.env.VUE_APP_CURRENTMODE == 'nysj'){
//   mountele = App2
// }else{
//   mountele = App
// }




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

