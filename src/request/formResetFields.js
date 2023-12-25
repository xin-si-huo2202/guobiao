import moment from 'moment'
//重置 form 
export function recuer(arr){
    for(let key in arr){
        arr[key] = "";
    }
}
//手机号
export function isphone(val){
    var phone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if(phone.test(val)){
        return true
    }else{
        return false
    }
}

//身份证号
export function isCardReg (val){
    var idCardReg  = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if(idCardReg.test(val)){
        return true
    }else{
        return false
    }
}
//车牌
export function isCar (val){
    let express = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
    if(express.test(val)){
        console.log(val)
        return true
    }else{
        console.log(val)
        return false
    }
}
//时间转义
export function  rTime(date) {
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if(date !==null || date != undefined){
        if(!!window.ActiveXObject || "ActiveXObject" in window){
            //ie处理
            let time =moment(date).format('YYYY-MM-DD HH:mm:ss')

            return time
        }else if(isMac){
            let time =moment(date).format('YYYY-MM-DD HH:mm:ss')

            return time
           
    　　 }else{
            var jsondate = new Date(date).toJSON();
            return new Date(+new Date(jsondate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
        }
       
    }else  return
    
}


export function  rTime_only(date) {
  
    if(date !==null || date != undefined){
      
        //ie处理
        let time =moment(date).format('YYYY-MM-DD')

        return time
    
       
    }else  return
    
}


