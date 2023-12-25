import request from '@/request/request'

/**
 * ehcarts  
 * 采集统计
 *  累计采集
 */

export function SysCaiJiZongshu(){
    return request.get('/SysCaiJi/SysCaiJiZongshu')
}

export function SysqueryCaiji(){
    return request.get('/SysCaiJi/SysCaiJi')
}
export function SysqueryJcCx(deptid,mark){
    if(mark=='nysj'){
        return request.post('/SysCaiJi/JcCx',{deptid})
    }else{
        return request.get('/SysCaiJi/JcCx')
    }
}
export function EchatrsinfoNumber(){
    return request.post('/InformationStatistics/infoNumber')
}

// 大屏地图标点数据
export function CarCountMap(deptid){
    return request.post('/InformationStatistics/carCount')
}


/**
 * ehcarts  
 * 统计采集
 */
export function sysNdCj(deptid,mark){
    if(mark=='nysj'){
        return request.post('/SysCaiJi/NdCj',{deptid})
    }else{
        return request.get('/SysCaiJi/NdCj')
    }
}

export function controlInfo(deptid,mark){
    if(mark=='nysj'){
        return request.post('/InformationStatistics/controlInfo',{deptid})
    }else{
        return request.post('/InformationStatistics/controlInfo')
    }
}

/**
 * ehcarts  
 * 折线图 年
 */
 export function selectCarAndFaceYear(deptid,mark){
     console.log("mark=="+mark+"==deptid=="+deptid)
    if(mark=='nysj'){
        return request.post('/SysCaiJi/selectCarAndFaceYear',{deptid})
    }else{
        return request.get('/SysCaiJi/selectCarAndFaceYear')
    }
    
}
/**
 * ehcarts  
 * 折线图 月
 */
 export function selectCarAndFaceMonth(deptid,mark){
    if(mark=='nysj'){
        return request.post('/SysCaiJi/selectCarAndFaceMonth',{deptid})
    }else{
        return request.get('/SysCaiJi/selectCarAndFaceMonth')
    }
    
}

/**
 * ehcarts  
 * 折线图 日
 */
 export function selectCarAndFaceToday(deptid,mark){
    if(mark=='nysj'){
        return request.post('/SysCaiJi/selectCarAndFaceToday',{deptid})
    }else{
        return request.get('/SysCaiJi/selectCarAndFaceToday')
    }
    
}

/**
 * ehcarts  
 * 饼状图
 */
 export function collectionRankingDept(deptid,mark){
    if(mark=='nysj'){
        return request.post('/SysCaiJi/collectionRankingDept',{deptid})
    }else{
        return request.get('/SysCaiJi/collectionRankingDept')
    }
    
}


// 统计
export function statisticsStatement(form){
    return request.post('/statisticsStatementController/statisticsStatement',form)
}

// 导出
export function statExport(form){
    return request.post('/statisticsStatementController/statisdc',form)
}