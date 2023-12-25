import request from '@/request/request'

import request_sj2 from '@/request/request_sj2'




/** ====================================================  设置 ======================================================*/



export function baocun_region(form) {
    return request.post('/gyxy/gyxyFenceArea/add', form)
}

export function selAllDepartOtherInfo(form) {
    return request.get('/sys/sysDepart/selAllDepartOtherInfo?pageSize=200', form)
}
export function gyxyMapFlag(form) {
    return request.get("/mapflag/gyxyMapFlag/list?pageSize=200", form);
}



export function huoqu_region(form) {
    return request.get('/gyxy/gyxyFenceArea/list?pageSize=1200', form)
}
//添加--点
export function shezhi_point(form) {
    return request({ url: '/gyxy/gyxyPunchPoint/addPunchPoint', method: "POST", data: form, headers: { 'Content-Type': 'application/json' } })
}
//获取打卡点坐标
export function huoqu_point() {
    return request.get('/gyxy/gyxyPunchPoint/list?pageSize=1200')
}
//删除打卡点数据
export function delete_point(form) {
    return request.delete(`/gyxy/gyxyPunchPoint/delete?id=${form}`, form)
}
export function shanchu_region(form) {
    return request.delete(`/gyxy/gyxyFenceArea/delete?id=${form.id}`, form)
}
//获取打卡记录列表/gyxy/ClockingRecored/list
export function clockingRecord() {
    return request.get(`/gyxy/ClockingRecored/list`)
}
//获取签到记录列表/gyxy/gyxyRegisterRecord/list
export function listOfRecord() {
    return request.get(`/gyxy/gyxyRegisterRecord/list`)
}
//根据日期获取签到个数groupByDateCount
export function dateCount(from) {
    return request.post(`/gyxy/gyxyRegisterRecord/groupByDateCount`, from)
}
//根据日期===一天的日期getOneDateList
export function getOneDateList(from) {
    return request.get(`/gyxy/gyxyRegisterRecord/getRegisterRecord?page=${from.page}&size=${from.size}&date=${from.date}&gridId=${from.gridId}`,)
}
//获取 打卡区域网格点数据==总
export function getAllPunchTheClock() {
    return request.get('/grid/gyxyGridSignin/selectList')
}
//放空区修改 /jeecg-boot/grid/gyxyGridSignin/edit2
export function putGridSignin(form) {
    return request.put(`/grid/gyxyGridSignin/edit2?id=${form.id}`, form)
}
//网格修改 /jeecg-boot/area/gyxyAreaManage/edit
export function putAreaManage(form) {
    return request.put(`/gyxy/gyxyFenceArea/edit?id=${form.id}`, form)
}
//打卡修改 /punchpoint/gyxyPunchPoint/edit
export function putPunchPoint(form) {
    return request.put(`/punchpoint/gyxyPunchPoint/edit?id=${form.id}`, form)
}
//获取  防控区列表 /jeecg-boot/grid/gyxyGridSignin/list
export function getGridSignin() {
    return request.get(`/grid/gyxyGridSignin/list`,)
}
//获取  打卡点数据   punchpoint/gyxyPunchPoint/list
export function getPunchPoint() {
    return request.get(`/punchpoint/gyxyPunchPoint/list?pageSize=1200`,)
}
//获取  网格数据  /jeecg-boot/gyxy/gyxyFenceArea/list
export function getFenceArea() {
    return request.get(`/gyxy/gyxyFenceArea/list`,)
}
//获取  打卡记录数据  getClockingRecoredBySearhTimeAndAreaId
export function getClockingRecored(from) {
    return request.get(`/gyxy/ClockingRecored/getClockingRecoredBySearhTimeAndAreaId?areaId=${from.areaId}&searhTime=${from.searhTime}`, from)
}
/**
 * 添加前端用户
 */

export function selectDept() {
    return request.post('/SysDept/selectDept')
}
/**
  * 查询权限
 */
export function queryRole() {
    return request.post('/SysRole/queryRole')
}
/*
**
  * 实时预览查询警车
 */
export function queryAllPoliceAndDev(deptid, mark) {
    if (mark == 'nysj') {
        return request.post('/SysPolice/queryAllPoliceAndDev', { deptid })
    } else {
        return request.post('/SysPolice/queryAllPoliceAndDev')
    }

}
/** ====================================================  前端用户 ======================================================*/

/**
 * 添加前端用户
 */

export function addUIUser(form) {
    return request.post('/SpdUsers/addUIUser', form)
}
/**
 * 删除前端用户
 */
export function delUIUser(ids) {
    return request.post('/SpdUsers/delUIUser', { ids })
}
/**
 * 重置密码前端用户
 */
export function updateUIUserPw(id) {
    return request.post('/SpdUsers/updateUIUserPw', { id })
}
/**
 * 修改前端用户
 */
export function updateUIUser(form) {
    return request.post('/SpdUsers/updateUIUser', form)
}

/**
  * 查询前端用户
 */
export function queryUIUsers(form) {
    return request.post('/SpdUsers/queryUIUsers', form)
}


/** ====================================================  后端用户 ======================================================*/

/**
 * 添加后端用户
 */

export function addSysUser(form) {
    return request.post('/SysUsers/addSysUser', form)
}
/**
 * 删除后端用户
 */
export function delSysUser(ids) {
    return request.post('/SysUsers/delSysUser', { ids })
}
/**
 * 重置密码后端用户
 */
export function updateSysUserPw(id) {
    return request.post('/SysUsers/resetSysUserPw', { id })
}
/**
 * 修改后端用户/SysUsers/updateSysUser
 */
export function updateSysUser(form) {
    return request.post('/SysUsers/updateSysUserJbxx', form)
}
/**
 * 修改后端用户(补录信息)
 */
export function updateSysUserBlxx(form) {
    return request.post('/SysUsers/updateSysUserBlxx', form)
}

/**
  * 查询后端用户SysUsers/queryUsers
 */
export function queryUsers(form) {
    return request.post('/SysUsers/selUsers', form)
}



/** ====================================================  菜单 ======================================================*/
/**
 * 获取所有菜单
 * @param {*} 修改密码 
 * @param {*} 
 */
export function Menuquery() {
    return request.get('/menu/query')
}
/**
 * 添加菜单
 * @param {*}  
 * @param {*} 
 */
export function menuAdd(form) {
    return request.post('/menu/add', form)
}
/**
 * 修改菜单
 * @param {*}  
 * @param {*} 
 */
export function menuUpdate(form) {
    return request.post('/menu/update', form)
}

/**
 * 修改菜单
 * @param {*}  
 * @param {*} 
 */
export function menuDel(id) {
    return request.post('/menu/del', { id })
}
/** ====================================================  角色 ======================================================*/
/**
  * 查询角色权限
 */
export function queryAllRole(form) {
    return request.post('/SysRole/queryAllRole', form)
}
/**
  * 增加角色
 */
export function addRole(form) {
    return request.post('/SysRole/addRole', form)
}
/**
  * 删除角色
 */
export function delRole(ids) {
    return request.post('/SysRole/delRole', { ids })
}
/**
  * 修改角色
 */
export function updateRole(form) {
    return request.post('/SysRole/updateRole', form)
}
/** ====================================================  部门 ======================================================*/
/**
  * 根据部门id获取警车列表
 */
export function selectDeptCar(form) {
    return request.post('/SysDept/selectDeptCar', form)
}
/**
  * 查询部门
 */
export function queryAllDept(form) {
    return request.post('/SysDept/queryAllDept', form)
}
/**
  * 增加部门
 */
export function addDept(form) {
    return request.post('/SysDept/addDept', form)
}
/**
  * 删除部门
 */
export function delDept(ids) {
    return request.post('/SysDept/delDept', { ids })
}
/**
  * 修改部门
 */
export function updateDept(form) {
    return request.post('/SysDept/updateDept', form)
}
/**
  * 添加子部门
 */
export function addSonDept(form) {
    return request.post('/SysDept/addSonDept', form)
}

/** ====================================================  警车 ======================================================*/
/**
  * 查询警车信息
 */
export function queryAllPolice(form) {
    return request.post('/SysPolice/queryAllPolice', form)
}
/**
  * 增加警车
 */
export function addPolice(form) {
    return request.post('/SysPolice/addPolice', form)
}
/**
  * 删除警车
 */
export function delPolice(ids) {
    return request.post('/SysPolice/delPolice', { ids })
}
/**
  * 修改警车
 */
export function updatePolice(form) {
    return request.post('/SysPolice/updatePolice', form)
}
/**
  * 地图坐标
 */
export function SendXY(form) {
    return request.post('/SysMap/SendXY', form)
}

export function queryMap() {
    return request.post('/SysMap/queryMap')
}

/** ====================================================  APP ======================================================*/

/**
  * app查询
 */
export function queryApp(form) {
    return request.post('/SysApp/queryApp', form)
}

/**
  * app添加
 */
export function addApp(form) {
    return request.post('/SysApp/addApp', form)
}

/**
  * app删除
 */
export function delApp(id) {
    console.log(id)
    return request.post('/SysApp/delApp', { id })
}
/**
  * app修改
 */
export function updateApp(form) {
    return request.post('/SysApp/updateApp', form)
}
/**
  * APP上传
 */
export function uploadFileApp(form, id) {
    let file = form.file;
    let param = new FormData();
    param.append('app', file);
    param.append('id', id);
    return request({
        url: '/SysApp/Upload',
        method: 'post',
        data: param,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}

// 关闭并删除
export function delrtsp(url) {
    return request.get('/del', { url })
}

/** ====================================================  算法管理 ======================================================*/

/**
  * 算法查询
 */
export function queryAlgorithm(form) {
    return request.post('/SysAlgorithm/queryAlgorithm', form)
}

/**
  * 算法添加
 */
export function addAlgorithm(form) {
    return request.post('/SysAlgorithm/addAlgorithm', form)
}
/**
  * app修改
 */
export function updateAlgorithm(form) {
    return request.post('/SysAlgorithm/updateAlgorithm', form)
}
/**
  * 算法删除
 */
export function delAlgorithm(id) {
    console.log(id)
    return request.post('/SysAlgorithm/delAlgorithm', { id })
}
/**
  * 算法上传
 */
export function uploadFileAlgorithm(form, id) {
    let file = form.file;
    let param = new FormData();
    param.append('AlgorithmZip', file);
    param.append('id', id);
    return request({
        url: '/SysAlgorithm/UploadAlgorithm',
        method: 'post',
        data: param,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}


//头像上传
export function uploadFile(form) {
    let file = form.file;
    let param = new FormData();
    param.append('file', file);
    return request({
        url: '/search_face/upload',
        method: 'post',
        data: param,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    })
}




export function getsyslist(deviceId) {
    return request.get(`/api/device/query/devices/${deviceId}/channels`)
}


export function queryTreeList() {
    return request.get(`/sys/sysDepart/queryTreeList`)
}


export function gyxyPcInformation(obj, pageNo) {
    return request.get(`/policecar/gyxyPcInformation/list?sysOrgCode=${obj}&pageNo=${pageNo}&pageSize=200`)
}
//警车列表-----云台摄像头
export function gyxyPcCarInformation(carNumber) {
    return request.get(`/policecar/gyxyPcInformation/list?carNumber=${carNumber}&pageNo=1&pageSize=200`)
}
export function gyxyPcInformation2(obj, pageNo) {
    return request_sj2.get(`/policecar/gyxyPcInformation/list?sysOrgCode=${obj}&pageNo=${pageNo}&pageSize=200`)
}

export function ver() {
    return request.get(`/sys/gyxySystemVersion/list`)
}

export function quandata() {
    return request.get(`/collection/gyxySubImageInfo/queryCountDayAll`)
}

export function gettheme() {
    return request.get(`/sys/gettheme`)
}

export function getRegionName() {
    return request.get(`/comm/gyxyCityCode/getRegionName`)
}