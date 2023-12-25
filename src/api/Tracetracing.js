
import request from '@/request/request'



export function selectCarGp(form){
  
    return request.post(`/gps/gyxySysGps/selectCarGps`,form)
  
    
}
