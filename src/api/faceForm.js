import requestFormData from '@/request/requestFormData'
import request from '@/request/request'
// 人像检索(查看)--查询
export function searchFace(param){
    return requestFormData.post('/search_face/hrFaceSearch',param)
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
        params:param
    })
}