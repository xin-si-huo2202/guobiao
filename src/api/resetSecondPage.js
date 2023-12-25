import requestFormData from "@/request/requestFormData";
import request from "@/request/request";
export function groupByDateCount(param) {
  return requestFormData.post(
    "/collection/gyxySubImageInfo/groupByDateCount",
    param
  );
}
//获取数据====人像检索
export function searchPlate(param) {
  return requestFormData.post(
    "/collection/gyxySubImageInfo/searchPlate",
    param
  );
}
export function getCarListAndCount(param) {
  return requestFormData.post(
    "/policecar/gyxyPcInformation/getCarListAndCount",
    param
  );
}
export function hrFaceSearch(param) {
  return requestFormData.post("/search_face/hrFaceSearch", param);
}
export function hrFaceSearch2(param) {
  return requestFormData.post("/search_face/hrFaceSearch2", param);
}
