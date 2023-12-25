import axios from 'axios'
 import qs from 'qs'
import { Message,Loading } from 'element-ui'
import router from '../router'
import Vue from "vue";

let loading;
function starLoading(){
    // loading = Loading.service({
    //     lock:true,
    //     text:'拼命加载中...',
    //     background:'rgba(0,0,0,0,7)'
    // });
}
function endLoading(){
    // if(loading){
    //     loading.close();
    // }
    
}

//创建axios实例
var service = axios.create({
    //baseURL:'/api',
    //baseURL:'http://1.193.39.196:8090',
    baseURL:'/', //api的 API_BOOT
    timeout:3000, // 请求超时时间
}) 
//service.defaults.withCredentials = true;
//请求拦截器
service.interceptors.request.use(
    config => {
        // console.log(config.url,'config.url')
        // if(config.url.indexOf('control') == -1 && config.url.indexOf('start') == -1){
           
        if(config.url.indexOf('start') !=-1){   
       
            if(process.env.VUE_APP_COMPANY){
                starLoading();
            }
        }
        // starLoading();
      
     
        // config.headers.Authorization = sessionStorage.JC_Token;
        // config.headers = 'application/x-www-form-urlencoded'
        return config;
    },
    error => {
        if(process.env.VUE_APP_COMPANY){
            endLoading();
        }
        
        Promise.reject(error);
    }
)
//响应拦截器
service.interceptors.response.use(response =>{
 
    if(process.env.VUE_APP_COMPANY){
        endLoading();
    }
    
    const res = response.data;
    // if(res.code != 200 ){
    //     if(res.code == 1001 ){
    //         sessionStorage.removeItem('JC_Token');
    //         router.push('/login'); 
    //     }else{
    //         Message({
    //             showClose: true,
    //             message:res.message,
    //             type:'error',
    //             duration:2000
    //         })
    //     }
    //     return Promise.reject('error');
    // }else {
    //     return res
    // }
    return res
},
error => {
    if(process.env.VUE_APP_COMPANY){
        endLoading();
    }
    // Message({
    //     showClose: true,
    //     message: '请求超时',
    //     type: 'error',
    //     duration: 1000
    // })
    // if (!sessionStorage.NxToken) {
    //     router.push({
    //         path: "/login"
    //     });
    // } 
    //else{

      
        
    //     // const { status } = error.code
    //     // if(status == 401){
    //     //     Message.error('登录超时，请重新登录')
    //     //     sessionStorage.removeItem('NxToken')
    //     //     router.push('/login')
    //     // }
       
    // }
    return Promise.reject(error) 
})
export default service


