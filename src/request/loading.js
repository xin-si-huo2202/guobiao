import {Loading } from 'element-ui'



export function startLoding(dom){
    let loading = Loading.service({
        target:document.querySelector(dom),
        // text:'获取数据...',
        // spinner:'el-icon-loading',
        // background:'rgba(0, 0, 0, 0.6)'
    });
    return loading
}

export function endLoding(loaindObj){
    loaindObj.close();
}
