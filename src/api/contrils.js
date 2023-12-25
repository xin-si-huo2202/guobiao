import request from '@/request/request'


/** ==================================================== 布控 ======================================================*/

/**
 * 车辆布控 初始化 
 * @param {*} page 页码
 * @param {*} rows 条数
 *  
 */

export function selectList(page, rows,plateCode,timeStart,timeEnd,deptId){
    return request.post('/platecontrol/selectList',{page,rows,plateCode,timeStart,timeEnd,deptId})
}
/**
 * 车辆布控 添加
 *
 * @export from
 * @param {*} plateCode 车牌号
 * @param {*} ownerName 车主名
 * @param {*} ownerPhone 车主手机号
 * @param {*} plateBrand 车品牌
 * @param {*} plateColor 车颜色
 * @param {*} blackType  黑名单类型
 * @param {*} describe   描述
 * @returns plateCode, ownerName,ownerPhone,plateBrand,plateColor,blackType,describe
 */
export function insert(popupForm){
    return request.post('/platecontrol/insert',popupForm)
}
/**
 * 车辆布控 删除
 * @param {*} ids 
 *  
 */
export function Cardelete(ids){
    
    return request.post('/platecontrol/delete',{ids})
}
/**
 * 车辆布控 修改
 *
 * @export from
 * @param {*} plateCode 车牌号
 * @param {*} ownerName 车主名
 * @param {*} ownerPhone 车主手机号
 * @param {*} plateBrand 车品牌
 * @param {*} plateColor 车颜色
 * @param {*} blackType  黑名单类型
 * @param {*} describe   描述
 * @returns plateCode, ownerName,ownerPhone,plateBrand,plateColor,blackType,describe
 */
export function update(popupForm){
    return request.post('/platecontrol/update',popupForm)
}

/** =================================== 人像 ===========================*/

/**
 * 人像布控 查找
 *
 */
export function FaceselectList(page,rows,faceName,faceCertificatesNumber,timeStart,timeEnd,deptId){
    return request.post('/facecontrol/selectList',{page,rows,faceName,faceCertificatesNumber,timeStart,timeEnd,deptId})
}

/**
 * 人像布控 添加
 *
 * @export from
 * @param {*} plateCode 车牌号
 * @param {*} ownerName 车主名
 * @param {*} ownerPhone 车主手机号
 * @param {*} plateBrand 车品牌
 * @param {*} plateColor 车颜色
 * @param {*} blackType  黑名单类型
 * @param {*} describe   描述
 * @returns plateCode, ownerName,ownerPhone,plateBrand,plateColor,blackType,describe
 */
export function Faceinsert(popupForm){
    return request.post('/facecontrol/insert',popupForm)
}
/**
 * 人像布控 删除
 * @param {*} ids 
 *  
 */
export function FaceCardelete(ids){
    return request.post('/facecontrol/delete',{ids})
}
/**
 * 人像布控 修改
 * @export from
 */
export function Faceupdate(popupForm){
    return request.post('/facecontrol/update',popupForm)
}

/**
 * 人像布控 上传图片
 * @export from
 */
export function FaceUpload(query){
    let file =  query.file;
    let param = new FormData();
    param.append('pPicture', file);
    return request({
        url:'/facecontrol/Upload',
        method:'post',
        data:param, 
        headers:{
            'Content-Type' : 'multipart/form-data;' 
        }
    })
}