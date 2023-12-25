import requestFormData from '@/request/requestFormData_sj'
import request from '@/request/request_sj'
// 人像检索(查看)--查询
export function searchFace(param,ip,tokens){
    // return requestFormData.post('/search_face/hrFaceSearch',param,{ip:param.ip,tokens:param.tokens})
//debugger
    return requestFormData({
        url:'/search_face/hrFaceSearch',
        method:'post',
        ip:ip,
        tokens:tokens,
        data:param, 
       
    })
}
// 分页查询人像库
export function selPageFace(param){
    return requestFormData.post('/search_face/selPageFace',param)
}
// 人像检索详情查看
export function selBigImageUrl(param){
    return request({
        url:'/search_face/selBigImageUrl',
        method:'get',
        ip:param.ip,
        tokens:param.tokens,
        params:param
    })
}