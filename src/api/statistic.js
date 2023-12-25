import request from "@/request/request";

//车辆排名统计
export function carRanking() {
  return request.get("/counttable/gyxyCountTable/attendances");
}
//部门采集统计
export function deptRanking() {
  return request.get("/counttable/gyxyCountTable/deptRanking");
}

//在线时长  近一年
export function carOnlineCount(data) {
  return request({
    url: "/counttable/gyxyCountTable/carOnlineCount",
    method: "post",
    data: data,
  });
}
//采集数据走势  近一年
export function queryCountYearAll() {
  return request.post("/collection/gyxySubImageInfo/queryCountYearAll");
}
//采集数据走势  近一月
export function queryCountMonthAll() {
  return request.post("/collection/gyxySubImageInfo/queryCountMonthAll");
}
//采集数据走势  今日
export function queryCountDayAll() {
  return request.post("/collection/gyxySubImageInfo/queryCountDayAll");
}
//警车出勤统计
export function selectCarStatus() {
  return request.get("/policecar/gyxyPcInformation/selectCarStatus");
}
//布控信息
export function selectDeployCount() {
  return request.post("/deploy/gyxyFaceControl/selectDeployCount");
}
//预警信息
export function selectWarningCount() {
  return request.post("/warning/gyxyFaceWarning/selectWarningCount");
}
//车辆采集
export function listCL(data) {
  // return request({
  //   url: "/counttable/gyxyCountTable/list",
  //   method: "get",
  //   params: data,
  // });
  return request.get(`/counttable/gyxyCountTable/list?radio=${data.radio}`);
}
