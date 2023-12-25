import request from '@/request/request'


/**
 * 接警后 反馈状态 人
 */

export function updateWarningResponse(form){
    return request.post('/SysFacwWarning/updateWarningResponse',form)
}


/**
 * 接警后 反馈状态 车
 */

export function updatePlateWarningResponse(form){
    console.log(form)
    return request.post('/SysPlateWarning/updatePlateWarningResponse',form)
}

/**
 * 查询预警状态
 */

export function selectWarningRead(thiss){
   if(thiss.$sj_bs=='nysj'){
    return request.post('/SysFacwWarning/selectWarningRead',{select_id:thiss.$store.getters.warn_selct_id,deptId:thiss.$store.getters.quYu.id})
   }else{
    return request.post('/SysFacwWarning/selectWarningRead',{select_id:thiss.$store.getters.warn_selct_id})
   }
    
}

/**
 * 预警状态 是否已读 人脸
 */

export function updateWarningRead(id){
    return request.post('/SysFacwWarning/updateWarningRead',{id})
}

/**
 * 预警状态 是否已读 车
 */

export function updateWarningReadCar(id){
    return request.post('/SysPlateWarning/updateWarningRead',{id})
}

/**============================================车牌预警=============================================== */

/**
 * 车牌查询
 */

export function queryPlateWarning(form){
    return request.post('/SysPlateWarning/queryPlateWarning',form)
}


/**
 * 修改接警状态
 */

export function updatePlateWarning(form){
    return request.post('/SysPlateWarning/updatePlateWarning',form)
}



/**============================================人像预警=============================================== */

/**
 * 人像查询
 */

export function queryFaceWarning(form){
    return request.post('/SysFacwWarning/queryFaceWarning',form)
}


/**
 * 修改接警状态
 */

export function updateFaceWarning(form){
    return request.post('/SysFacwWarning/updateFaceWarning',form)
}

/**
 * 查询地图资源目录
 */

export function selectAllDeptAndPoliceCar(form){
    return request.post('/SysDept/selectAllDeptAndPoliceCar',form)
}


/**
 * 查询车牌轨迹
 */

export function selectCarGps(form){
    
    return request.post('/GPS/selectCarGps',form)
}