
import request from '@/request/request'


//手机串号预警列表 /serialwarning/gyxySerialWarning/list  /jeecg-boot/serialwarning/gyxySerialWarning/list
export function getSerialNumberWarning(form) {

    return request.get(`/serialwarning/gyxySerialWarning/list?pageNo=${form.pageNo}&pageSize=${form.pageSize}&selectType=${form.selectType}&departId=${form.departId}&fromCar=${form.fromCar}&timeEnd=${form.timeEnd}&timeStart=${form.timeStart}`)
}
//手机串号预警=====修改 /jeecg-boot/serialwarning/gyxySerialWarning/edit
export function putSerialNumberWarning(form) {

    return request.put(`/serialwarning/gyxySerialWarning/edit`, form)

}

export function gyxyFaceWarning(form) {

    return request.get(`/warning/gyxyFaceWarning/list?pageNo=${form.pageNo}&pageSize=${form.pageSize}`)
}

export function gyxyPlateWarning(form) {


    return request.get(`/warning/gyxyPlateWarning/list?pageNo=${form.pageNo}&pageSize=${form.pageSize}`)
}

export function gyxyFaceWarning_s(form) {


    return request.get(`/warning/gyxyFaceWarning/listNose?pageNo=${form.pageNo}&pageSize=${form.pageSize}&selectType=${form.selectType}&departId=${form.departId}&fromCar=${form.fromCar}&timeEnd=${form.timeEnd}&timeStart=${form.timeStart}`)
}

export function gyxyFaceWarning_swl(form) {


    return request.get(`/warning/gyxyWlfaceWarning/list?pageNo=${form.pageNo}&pageSize=${form.pageSize}&selectType=${form.selectType}&departId=${form.departId}&fromCar=${form.fromCar}&timeEnd=${form.timeEnd}&timeStart=${form.timeStart}`)
}

export function gyxyPlateWarning_s(form) {


    return request.get(`/warning/gyxyPlateWarning/listNose?pageNo=${form.pageNo}&pageSize=${form.pageSize}&selectType=${form.selectType}&departId=${form.departId}&fromCar=${form.fromCar}&timeEnd=${form.timeEnd}&timeStart=${form.timeStart}`)
}

export function gyxyPlateWarning_swl(form) {


    return request.get(`/warning/gyxyWlplateWarning/list?pageNo=${form.pageNo}&pageSize=${form.pageSize}&selectType=${form.selectType}&departId=${form.departId}&fromCar=${form.fromCar}&timeEnd=${form.timeEnd}&timeStart=${form.timeStart}`)
}


export function gyxyFaceWarning_edit(form) {
    // if(form.dealName){
    return request.post(`/warning/gyxyFaceWarning/updateBatch?ids=${form.ids}`)
    // }
    // else if(form.response){
    //     return request.get(`/warning/gyxyFaceWarning/edit?id=${form.id}&dealName=${form.response}`)
    // }

}

export function gyxyPlateWarning_edit(form) {
    // if(form.dealName){
    return request.post(`/warning/gyxyPlateWarning/updateBatch?ids=${form.ids}`)
    // }
    // else if(form.response){
    //     return request.get(`/warning/gyxyFaceWarning/edit?id=${form.id}&dealName=${form.response}`)
    // }

}

export function gyxyFaceWarning_editResponse(form) {
    // if(form.dealName){
    return request.put(`/warning/gyxyFaceWarning/editResponse`, form)
    // }
    // else if(form.response){
    //     return request.get(`/warning/gyxyFaceWarning/edit?id=${form.id}&dealName=${form.response}`)
    // }

}


export function gyxyPlateWarning_editResponse(form) {
    // if(form.dealName){
    return request.put(`/warning/gyxyPlateWarning/editResponse`, form)
    // }
    // else if(form.response){
    //     return request.get(`/warning/gyxyFaceWarning/edit?id=${form.id}&dealName=${form.response}`)
    // }

}
