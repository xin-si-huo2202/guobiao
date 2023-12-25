import request from '@/request/request'


/** ================================== 登录 ===============================*/
/**
 * 
 * @param {*} 获取公钥 
 * @param {*} 
 *  
 */
export function getEncryption(tm_){
    return request.get('/sy_login/getEncryption',{tm_})
}

/**
 *登录 
 * @export
 * @param {*} username      账号
 * @param {*} password        密码
 * @returns
 */

export function ongo(name,password,tm_) {
    return request.post('/sy_login/go',{name,password,tm_})
}

/**
 * 获取图片路径
 * @export from
 */
export function getNginx(){
    return request.get('/facecontrol/getNginx')
}


/**
 * 获取登录人
 * @export 
 */
export function showSysUserById(){
    return request.get('/SysUsers/showSysUserById')
}

export function sysLogin(obj){
    return request.post('/sys/login',obj)
}
// 获取版本号
export function list(form){
    return request({
        url:'/sys/gyxySystemVersion/list',
        method:'get',
        params:form
    })
}



export function gyxySyMap(){
    return request.get('/sys/gyxySyMap/listOne')
    
}