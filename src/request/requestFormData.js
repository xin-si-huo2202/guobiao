import axios from 'axios'
import {
    Message
} from 'element-ui'
import router from '../router'

// var service = axios.create({
//     baseURL: process.env.VUE_APP_SECRET_API,
//     timeout: 96400000, // 请求超时时间
// })
var baseURL;
if (process.env.NODE_ENV == 'production') {
    baseURL = process.env.VUE_APP_SECRET_API + '/jeecg-boot'
} else {
    baseURL = process.env.VUE_APP_SECRET_API
}

//创建axios实例
var service = axios.create({
    //baseURL:'/api',
    //baseURL:'http://1.193.39.196:8090',
    baseURL, //api的 API_BOOT
    timeout: 96400000, // 请求超时时间
})


//请求拦截器
service.interceptors.request.use(
    config => {
        //传的数据
        var headerss = Object.assign({}, config.headers, {
            'X-Access-Token': sessionStorage.getItem("JC_Token") ? sessionStorage.getItem("JC_Token") : '',
            'Content-Type': 'multipart/form-data;'
        })
        config.headers = headerss
        return config;
    },
    error => {
        Promise.reject(error);
    }
)
//响应拦截器
service.interceptors.response.use(response => {
        const res = response.data;
        if(res.code==403){
            Message({
                showClose: true,
                message: 'Token失效',
                type: 'error',
                duration: 2000
            })
            sessionStorage.removeItem('JC_Token');
            router.replace('/login');
            return ;
        }
        return res
    },
    error => {
        if (error.response.data.code == 401) {
            Message({
                showClose: true,
                message: 'Token失效',
                type: 'error',
                duration: 2000
            })
            sessionStorage.removeItem('JC_Token');
            router.replace('/login');
        } else {

        }
        return Promise.reject('error');
    })
export default service