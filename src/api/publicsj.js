import request from '@/request/request_sj'


//车辆排名统计
export function upload(form) {
    //debugger
    let file = form.file;
    let param = new FormData();
    param.append('file', file);
    param.append('tokens', form.tokens)
    param.append('ip', form.ip)
    return request({
        url: '/search_face/upload',
        method: 'post',
        ip: form.ip,
        tokens: form.tokens,
        data: param,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}