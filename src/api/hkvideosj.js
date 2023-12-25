import request from '@/request/request_sj'

import request_back from '@/request/request_back'


import requestThjc from '@/request/request_thjc'



export function getVideoUrl(form){
 

    return request.get(`/hik/getVideoUrl?code=${form.code}&channelNo=${form.channelNo}`)
   
  
}


export function getVideoUrlback(form){
 
    // return request_back.get(`/hik/getVideoUrl?code=${form.code}&channelNo=${form.channelNo}`)
    return request_back.post(`/hik/getBackVideoUrl`,form)
   
  
}

export function getCameraCode(form,ip,tokens){
  
    return request.get(`/hik/getCameraCode?code=${form.code}&channelNo=${form.channelNo}`,{ip,tokens})

}



export function getVideoUrl2(form){
   
    return requestThjc.get(`/hik/getVideoUrl?code=${form.code}&channelNo=${form.channelNo}`)
  
}


export function hikControl(form){
    return request.post(`/hik/control`,form)
}

export function hikControlv2(form){
    return request.post(`/hik/control/v2`,form)
}




export function hikControl2(form){
    return requestThjc.post(`/hik/control`,form)
}
