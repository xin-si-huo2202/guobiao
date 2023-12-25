import request from '@/request/request'




export function DataComparison(form){
    return request.post('/syComparison/dataComparison',form)
}


export function imgsurl(form){
    // return request.get('/search_face/imgsurl',form)
    return request({
        url:'/search_face/imgsurl',
        method:'get',
        params:form
    })
}

export function bigImgurl(form){
    return request({
        url:'/search_face/bigImgurl',
        method:'get',
        params:form
    })
}