import axios from 'axios'
import qs from 'qs'
import {
    Message,
    Loading
} from 'element-ui'
import router from '../router'

let loading;

function starLoading() {
    // loading = Loading.service({
    //     lock:true,
    //     text:'拼命加载中...',
    //     background:'rgba(0,0,0,0,7)'
    // });
}

function endLoading() {
    // if(loading){
    //     loading.close();
    // }

}

var baseURL;
// if (process.env.NODE_ENV == 'production') {
//     baseURL = process.env.VUE_APP_SECRET_API + '/jeecg-boot'
// } else {
//     baseURL = process.env.VUE_APP_SECRET_API
// }

baseURL = 'http://41.211.252.154:18888' + '/jeecg-boot'

//创建axios实例
var service = axios.create({
    //baseURL:'/api',
    //baseURL:'http://1.193.39.196:8090',
    baseURL, //api的 API_BOOT
    timeout: 96400000, // 请求超时时间
})


//service.defaults.withCredentials = true;
//请求拦截器
service.interceptors.request.use(
    config => {

        console.log("config==", config)
        //传参数据二次处理--所有null的值转为空字符串，统计报表接口除外
        if (config.data && config.data != undefined && config.url !== "/statisticsStatementController/statisticsStatement" && config.url !== "/statisticsStatementController/statisdc") {
            let data = config.data;
            for (let key in data) {
                if (data[key] == null) {
                    data[key] = "";
                }
            }
        }
        //传的数据
        if (config.url !== '/sy_login/go' && config.url != '/SysFacwWarning/selectWarningRead' && config.url !== '/SysPolice/queryAllPoliceAndDev' && config.url !== '/sy_login/getEncryption') {
            starLoading();
        }
        // if(config.method == "post"){
        //     let data = qs.parse(config.data);{...data},{arrayFormat: 'repeat'}
        //     config.data = qs.stringify({...config.data});
        // }
        console.log(config.headers)
        var headerss = Object.assign({}, config.headers, {
            'X-Access-Token': sessionStorage.JC_Token
        })
        config.headers = headerss
        // config.headers.X-Access-Token = sessionStorage.JC_Token;
        // config.headers.Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzY2MDgyNDcsInVzZXJuYW1lIjoiYWRtaW4ifQ.H25bwmxFxqKeL0agF7NFqBSASs6IKxBSSNxVc9K8EH8'

        // config.headers = 'application/x-www-form-urlencoded'
        return config;
    },
    error => {
        endLoading();
        Promise.reject(error);
    }
)
//响应拦截器
service.interceptors.response.use(response => {
        if (response.config.url !== '/sy_login/go' && response.config.url != '/sy_login/getEncryption' && response.config.url != '/SysPolice/queryAllPoliceAndDev') {
            endLoading();
        }

        const res = response.data;
        // if(res.code != 0 ){
        //     if(res.code == 1001 ){
        //         sessionStorage.removeItem('JC_Token');
        //         // sessionStorage.removeItem('userDeptId');
        //         sessionStorage.setItem("islogin_tiao", 1);
        //         router.replace('/login'); 
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


        // if(res.message.indexOf('Token') !=-1){


        //     Message({
        //         showClose: true,
        //         message:res.message,
        //         type:'error',
        //         duration:2000
        //     })
        //     sessionStorage.removeItem('JC_Token');
        //     sessionStorage.setItem("islogin_tiao", 1);
        //     router.replace('/login'); 


        //     return Promise.reject('error');
        // }

        if (res.message.indexOf('成功') != -1) {

            return res

        } else {
            if (res.message.indexOf('用户不存在') != -1 || res.message.indexOf('用户已注销') != -1 || res.message.indexOf('用户已冻结') != -1 || res.message.indexOf('用户名或密码错误') != -1) {
                Message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 2000
                })
            }




            return Promise.reject('error');
        }



    },
    error => {


        if (error.response.data.message.indexOf('Token') != -1) {
        

            if(error.response.config.url!='/sys/gettheme'){
                Message({
                    showClose: true,
                    message: 'Token失效',
                    type: 'error',
                    duration: 2000
                })
                sessionStorage.removeItem('JC_Token');
                sessionStorage.setItem("islogin_tiao", 1);
    
                router.replace('/login');
            }
            
        } else {
            // Message({
            //     showClose: true,
            //     message:error.response.data.message,
            //     type:'error',
            //     duration:2000
            // })
        }



        return Promise.reject('error');


    })
export default service