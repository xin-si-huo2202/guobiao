import request_video from '@/request/request_video'




export function gb_login(form){
    return request_video.get(`/api/user/login?username=${form.username}&password=${form.password}`)
}

export function gb_devicelist(){
    return request_video.get(`/api/device/query/devices?page=1&count=100`)
}

export function gb_channels(deviceId){
    console.log(process.env.VUE_APP_COMPANY,'video.js')
    if(process.env.VUE_APP_COMPANY){
        return request_video.get(`/api/device/query/devices/${deviceId}/channels?page=1&count=10`)
    }else{
        return request_video.get(`/api/device/query/devices/${deviceId}/channels?page=1&count=9`)
    }
    
    
}


export function gb_start(form){
    return request_video.get(`/api/play/start/${form.deviceId}/${form.channelId}`)
}

export function gb_stop(form){
    return request_video.get('/api/play/stop/' + form.deviceId + "/" + form.channelId)
}

export function gb_control(form){
    return request_video.post('/api/ptz/control/' + form.deviceId + '/' + form.channelId + '?cmdCode=' + (form.zoom * 16 + form.upDown * 4 + form.leftRight) + '&horizonSpeed=' + form.controSpeed + '&verticalSpeed=' + form.controSpeed + '&zoomSpeed=' + form.controSpeed)
}


export function hf_yujing(form){
    return request_video.get(`/api/playback/start/${form.deviceId}/${form.channelId}?startTime=${form.startTime}&endTime=${form.endTime}`)
}

