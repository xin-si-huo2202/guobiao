
import request from '@/request/request'



export function selectPoliceCarAndDepartment(form) {
    return request.post('/policecar/gyxyPcInformation/selectPoliceCarAndDepartment', form)
}


export function gyxySyMap(form) {
    return request.post('/sys/gyxySyMap/listOne', form)
}