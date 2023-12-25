import request from '@/request/request'


/** ================================== 指挥中心 ===============================*/
/**
 * 
 * @param {*} 修改密码 
 * @param {*} 
 *  
 */
export function updateMyPwd(oldPassword,userPassword,pwd){
    return request.post('/SysUsers/updateMyPw',{oldPassword,userPassword,pwd})
}