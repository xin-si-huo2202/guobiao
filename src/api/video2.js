import request_video from '@/request/request_video2'




export function gb_login(form,bs){
    return request_video.get(`${bs}/api/user/login?username=${form.username}&password=${form.password}`)
}

export function gb_devicelist(){
    return request_video.get(`/api/device/query/devices?page=1&count=100`)
}

export function gb_channels(deviceId,bs){
    
    if(process.env.VUE_APP_COMPANY){
        return request_video.get(`${bs}/api/device/query/devices/${deviceId}/channels?page=1&count=10`)
    }else{
        return request_video.get(`${bs}/api/device/query/devices/${deviceId}/channels?page=1&count=9`)
    }
    
    
}


export function gb_start(form,bs){
    return request_video.get(`${bs}/api/play/start/${form.deviceId}/${form.channelId}`)
}

export function gb_stop(form,bs){
    return request_video.get(`${bs}/api/play/stop/` + form.deviceId + "/" + form.channelId)
}

export function gb_control(form,bs){
    return request_video.post(`${bs}/api/ptz/control/` + form.deviceId + '/' + form.channelId + '?cmdCode=' + (form.zoom * 16 + form.upDown * 4 + form.leftRight) + '&horizonSpeed=' + form.controSpeed + '&verticalSpeed=' + form.controSpeed + '&zoomSpeed=' + form.controSpeed)
}


export function hf_yujing(form){
    return request_video.get(`/api/playback/start/${form.deviceId}/${form.channelId}?startTime=${form.startTime}&endTime=${form.endTime}`)
}

