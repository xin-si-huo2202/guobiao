import request from '@/request/request'


//人像检索列表--分页
export function imgsurl(form){
    return request({
        url:'/search_face/imgsurl',
        method:'get',
        params:form
    })
}

//r人像检索--查看大图
export function bigImgurl(form){
    return request({
        url:'/search_face/bigImgurl',
        method:'get',
        params:form
    })
}
//车牌检索列表--分页
export function queryCarNumber(form){
    return request({
        url:'/collection/gyxyCarDetailed/queryCarNumber',
        method:'get',
        params:form
    })
}
