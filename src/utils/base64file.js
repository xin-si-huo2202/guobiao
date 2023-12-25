/**
* 有些浏览器(如edge)不支持new File，所以为了兼容，base64要先转换成blob再设置type，name，lastModifiedDate
* 属性间接转换成文件，而不推荐直接new File()的方式
**/
export function convertBase64UrlToImgFile(urlData, fileName, fileType) {
	var bytes = window.atob(urlData); //转换为byte
	//处理异常,将ascii码小于0的转换为大于0
	console.log("base64转换");
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Int8Array(ab);
	var i;
	for (i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	//转换成文件，添加文件的type，name，lastModifiedDate属性
	var blob = new Blob([ab], { type: fileType });
	blob.lastModifiedDate = new Date();
	blob.name = fileName;
	return blob;
}
//export default convertBase64UrlToImgFile;