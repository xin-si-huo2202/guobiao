import request from '@/request/request'


//车辆排名统计
export function upload(form) {
    console.log(form.file);
    let file = form.file;
    let param = new FormData();
    param.append('file', file);
    return request({
        url: '/search_face/upload',
        method: 'POST',
        data: param,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}