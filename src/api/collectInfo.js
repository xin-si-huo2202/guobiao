
import request from '@/request/request'


//获取所有数据===人像车牌检索数据
export function gyxySubImageInfo(form) {
    return request.get(`/collection/gyxySubImageInfo/listToWeb?pageNo=${form.pageNo}&pageSize=${form.pageSize}&type=${form.type}&beginTime=${form.beginTime}&endTime=${form.endTime}&sysOrgCode=${form.sysOrgCode}&policeCarNumber=${form.policeCarNumber}`)
}

//人像--查看详情
export function queryByImageId(form) {
    return request({
        url: '/collection/gyxyFaceDetailed/queryByImageId',
        method: 'get',
        params: form
    })
}

//车牌--查看大图
export function queryByImageIdCar(form) {
    return request({
        url: '/collection/gyxyCarDetailed/queryByImageId',
        method: 'get',
        params: form
    })
}