

export function delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");
}



// 实现将项目的图片转化成base64
export function getBase64(img) { // 传入图片路径，返回base64
    let picImage = new Image();
    let deferred = $.Deferred();
    if (img) {
        picImage.onload = function () {
        deferred.resolve(getBase64Image(picImage)); // 将base64传给done上传处理
        };
        picImage.src = img;
        return deferred.promise(); // 要让onload完成后再return sessionStorage['imgTest']
    }
}
// 转换为base4的主要方法
function getBase64Image(img, width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width || img.width;
    canvas.height = height || img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL();
    return dataURL;
}

export function convertBase64ToBlob(base64) {
    var base64Arr = base64.split(',');
    var imgtype = '';
    var base64String = '';
    if (base64Arr.length > 1) {
        // 如果是图片base64，去掉头信息
        base64String = base64Arr[1];
        imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
    }
    // 将base64解码，atob() 方法用于解码使用 base-64 编码的字符串。
    var bytes = atob(base64String);
    var bytesCode = new ArrayBuffer(bytes.length);
    // 转换为类型化数组
    var byteArray = new Uint8Array(bytesCode);
    // 将base64转换为ascii码
    for (var i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
    }
    // 生成Blob对象（文件对象）
    return new Blob([bytesCode], {type: imgtype});
};


// export function productionImage(str){
 
//     // let str = 'https://101.122.134.40:8860/aa.bb/aa/ee'
//     let reg = /http:\/\/.*\.[0-9]{1,4}(:[\w]+)?/g

//     let str2=str.replace(reg,'192.168.0.42')



//     return str2
// }

export function productionImage(url) {
    
    if(url &&  process.env.VUE_APP_IMAGE_API ){
        
        var ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/; 
        var text = ip.exec(url); 
        
        var jk = url.replace(ip,process.env.VUE_APP_IMAGE_API)
    
        return jk
    }else{
        return url
    }
    
}
