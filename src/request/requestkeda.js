import axios from "axios";
import qs from "qs";
import { Message, Loading } from "element-ui";
import router from "../router";

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

/**
 * 替换url的指定参数
 * @param {*} url 需要替换的url
 * @param {*} name 参数名称
 * @param {*} value 替换的值
 */
function replaceQueryString(url, name, value) {
  const re = new RegExp(name + "=[^&]*", "gi");
  return url.replace(re, name + "=" + value);
}

function insertStr(source, start, newstr) {
  return source.slice(0, start) + newstr + source.slice(start);
}

var baseURL;
// if (process.env.NODE_ENV == "production") {
//   baseURL = process.env.VUE_APP_SECRET_API + "/jeecg-boot";
// } else {
//   baseURL = process.env.VUE_APP_SECRET_API;
// }

baseURL= process.env.VUE_APP_KEDA_API;

//创建axios实例
var service = axios.create({
  //baseURL:'/api',
  //baseURL:'http://1.193.39.196:8090',
  baseURL, //api的 API_BOOT
  timeout: 96400000, // 请求超时时间
});

//service.defaults.withCredentials = true;
//请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log("config==", config);
    //传参数据二次处理--所有null的值转为空字符串，统计报表接口除外
    if (
      config.data &&
      config.data != undefined &&
      config.url !== "/statisticsStatementController/statisticsStatement" &&
      config.url !== "/statisticsStatementController/statisdc" &&
      config.url !== "/search_face/imgsurl"
    ) {
      let data = config.data;
      for (let key in data) {
        if (data[key] == null) {
          data[key] = "";
        }
      }
    }

    if (sessionStorage.syscode) {
      var syscode = sessionStorage.syscode ? sessionStorage.syscode : null;
      if (config.method == "get") {
        if (config.url.indexOf("departId") != -1) {
          // var news = insertStr(config.url,config.url.indexOf('departId')+9,syscode)

          var news = replaceQueryString(config.url, "departId", syscode);

          config.url = news;
        } else if (config.url.indexOf("sysOrgCode") != -1) {
          // var news = insertStr(config.url,config.url.indexOf('sysOrgCode')+11,syscode)

          var news = replaceQueryString(config.url, "sysOrgCode", syscode);

          config.url = news;
        } else if (config.url.indexOf("?") != -1) {
          config.url = config.url + "&sysOrgCode=" + syscode;
        } else {
          config.url = config.url + "?sysOrgCode=" + syscode;
        }
      } else {
        console.log(config.data, "post________________________");

        if (config.data) {
          if (config.data.hasOwnProperty("departId")) {
            config.data.departId = syscode;
          } else {
            config.data.sysOrgCode = syscode;
          }
        } else {
          config.data = {
            sysOrgCode: syscode,
          };
        }
      }
    }

    if (config.method == "post" && !config.data) {
      config.data = {};
    }

    //传的数据
    if (
      config.url !== "/sy_login/go" &&
      config.url != "/SysFacwWarning/selectWarningRead" &&
      config.url !== "/SysPolice/queryAllPoliceAndDev" &&
      config.url !== "/sy_login/getEncryption"
    ) {
      starLoading();
    }
    // if(config.method == "post"){
    //     let data = qs.parse(config.data);{...data},{arrayFormat: 'repeat'}
    //     config.data = qs.stringify({...config.data});
    // }

    var headerss = Object.assign({}, config.headers, {
      "X-Access-Token": sessionStorage.JC_Token,
    });
    config.headers = headerss;
    // config.headers.X-Access-Token = sessionStorage.JC_Token;
    // config.headers.Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzY2MDgyNDcsInVzZXJuYW1lIjoiYWRtaW4ifQ.H25bwmxFxqKeL0agF7NFqBSASs6IKxBSSNxVc9K8EH8'

    // config.headers = 'application/x-www-form-urlencoded'
    return config;
  },
  (error) => {
    endLoading();
    Promise.reject(error);
  }
);
//响应拦截器
service.interceptors.response.use(
  (response) => {
    if (
      response.config.url !== "/sy_login/go" &&
      response.config.url != "/sy_login/getEncryption" &&
      response.config.url != "/SysPolice/queryAllPoliceAndDev"
    ) {
      endLoading();
    }
    console.log( response)
  
    const res = response.data;
    
    return res;
    if (res.message.indexOf("成功") != -1) {
      return res;
    } else {
      if (
        res.message.indexOf("用户不存在") != -1 ||
        res.message.indexOf("用户已注销") != -1 ||
        res.message.indexOf("用户已冻结") != -1 ||
        res.message.indexOf("用户名或密码错误") != -1 ||
        res.message.indexOf("未检测到人脸") != -1
      ) {
        Message({
          showClose: true,
          message: res.message,
          type: "error",
          duration: 2000,
        });
      }

      return Promise.reject("error");
    }
  },
  (error) => {
    if (error.response && error.response.data.message.indexOf("Token") != -1) {
      if (error.response.config.url != "/sys/gettheme") {
        Message({
          showClose: true,
          message: "Token失效",
          type: "error",
          duration: 2000,
        });
        sessionStorage.removeItem("JC_Token");
        sessionStorage.setItem("islogin_tiao", 1);

        router.replace("/login");
      }
    } else {
      // Message({
      //     showClose: true,
      //     message:error.response.data.message,
      //     type:'error',
      //     duration:2000
      // })
    }

    return Promise.reject("error");
  }
);
export default service;
