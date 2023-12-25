import request from '@/request/request'


/** ================================== 采集库 ===============================*/
/**
 * 
 * @param {*}  
 * @param {*} 
 *  
 */
export function queryCollectterm(form){
    return request.post('/SysCollect/queryCollectterm',form)
}

/**
 * 根据部门id获取车牌列表
 * @param {*}  
 * @param {*} 
 *  
 */
export function queryPoliceList(deptid){
    return request.post('/SysPolice/queryPoliceList',{deptid})
}

export function queryImageDetails(form){
    return request.post('/SysCollect/queryImageDetails',form)
}
