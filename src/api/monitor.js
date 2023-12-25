import request from '@/request/request'


/**
 * 云台左上
 */
export function yuntaileftUp(){
    return request.post('/yuntai_leftUp')
}

/**
 * 云台右下
 */
export function yuntairightDown(){
    return request.post('/yuntai_rightDown')
}


/**
 * 车辆轨迹查询
 */
export function selectGps(form){
    return request.post('/gps/gyxySysGps/selectGps',form)
}


