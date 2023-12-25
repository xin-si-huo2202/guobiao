import requestFormData from "@/request/requestFormData";
import request from "@/request/request";
export function getCarListAndCount(param) {
  return requestFormData.post(
    "/serialnumber/gyxySerialNumber/getCarListAndCount",
    param
  );
  }  
  export function groupByDateCount(param) {
    return requestFormData.post(
      "/serialnumber/gyxySerialNumber/groupByDateCount",
      param
    );
  }
  export function getSerialnumber(param) {
    return requestFormData.post(
      "/serialnumber/gyxySerialNumber/getSerialnumber",
      param
    );
  }