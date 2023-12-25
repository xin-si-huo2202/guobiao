<template>
  <div class="item-box" :class="dataInfo.isResponse==1?'bor-three':dataInfo.isRead==1?'bor-one':'bor-two'">
    <!-- <div class="box-top-img" :class="dataInfo.type == 1 ? 'box-top-img-one' : dataInfo.type == 2 ? 'box-top-img-two' : 'box-top-img-three'"></div>
    <div class="box-con" :class="dataInfo.type==1?'box-con-one':dataInfo.type==2?'box-con-two':'box-con-three'"> -->
    <div class="box-top-img" :class="dataInfo.isResponse==1?'box-top-img-three':dataInfo.isRead==1?'box-top-img-one':'box-top-img-two'"></div>
      <div class="box-con" :class="dataInfo.isResponse==1?'box-con-three':dataInfo.isRead==1?'box-con-one':'box-con-two'">
      <div class="box-con-left" @click.stop="lookDetailCar(dataInfo)">
        <el-image
          class="car-img"
          :src="productionImage(dataInfo.smallImgUrl)"
          fit="contain"
         
        ></el-image>
        <div class="car-num">{{ dataInfo.plateCode }}</div>
      </div>
      <div class="box-con-right">
        <div class="con">
          <div class="con-item-one">布控车辆：{{ dataInfo.plateCode }}</div>
          <div class="con-item-one">预警单位：{{dataInfo.departName}}</div>
          <div class="con-item-one">车辆品牌：{{dataInfo.plateBrand}}</div>
          <div class="con-item-one">预警警车：{{ dataInfo.fromCar }}</div>
          <div class="con-item bkms_span" :title='dataInfo.represent?delHtmlTag(dataInfo.represent):""'>布控描述：{{dataInfo.represent? delHtmlTag(dataInfo.represent):"" }}</div>
          <div class="con-item">
            预警坐标：{{ dataInfo.longitude }},{{ dataInfo.latitude }}
          </div>
          <div class="con-item">预警时间：{{ dataInfo.createTime }}</div>
          <div class="con-item bkms_span" v-if="dataInfo.isResponse==1" :title='dataInfo.response?delHtmlTag(dataInfo.response):""'>反馈信息：{{dataInfo.response? delHtmlTag(dataInfo.response):"" }}</div>
        </div>
        <div class="btn-img-one btn-one btn-all" :class="dataInfo.isResponse==1?'btn-img-one-bg':''" @click="dealInfoOpera(dataInfo)">{{dataInfo.isResponse==1?'已反馈':dataInfo.isRead!=1?'接警':'反馈'}}</div>
        <div class="btn-img-two btn-two btn-all" @click="cp_warn_dingwei(dataInfo)">位置</div>
        <div class="btn-img-two btn-three btn-all" @click="zhuisu(dataInfo)">预警追溯</div>
        <!-- <div class="btn-img-two btn-four btn-all" @click.stop="huifang(dataInfo)">预警回放</div> -->
      </div>
    </div>
    <div class="box-top" v-if="dataInfo.isResponse==1||dataInfo.isRead==1">
      <div class="triangle" :style="{'border-top-color':(dataInfo.isResponse==1?'#666666':dataInfo.isRead==1?'#00BEFF':'')}"></div>
      <div class="text" :style="{'background':(dataInfo.isResponse==1?'#666666':dataInfo.isRead==1?'#00BEFF':'')}">{{dataInfo.isResponse==1?'已反馈':dataInfo.isRead==1?dataInfo.dealName+'已接警':''}}</div>
    </div>
    <!-- <div class="box-bottom-img" :class="dataInfo.type==1?'box-bottom-img-one':dataInfo.type==2?'box-bottom-img-two':'box-bottom-img-three'"></div> -->

    <div class="box-bottom-img" :class="dataInfo.isResponse==1?'box-bottom-img-three':dataInfo.isRead==1?'box-bottom-img-one':'box-bottom-img-two'"></div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { gyxyPlateWarning_edit} from '@/api/warningInfo.js'
import {startLoding,endLoding} from '@/request/loading.js'
import { Message,Loading } from 'element-ui'
export default {
  props: {
    dataInfo: {
      type: Object,
      default: {},
    },
  },
  methods: {
    async dealInfoOpera(data){
  
      if(data.isResponse==1){
        return ;
      }else if(data.isRead!=1){
        //接警
        var loading_lo;
        try {
            loading_lo=startLoding('.yujingbox')
            var userinfo = JSON.parse( sessionStorage.userinfo )
            var res = await gyxyPlateWarning_edit({ids:data.id,dealName:userinfo.realname})
            endLoding(loading_lo)
          
            data.dealName = userinfo.realname
            data.isRead = 1
        }catch (err) {
            console.log(err,'dscdascsda')
            endLoding(loading_lo)
            Message({
              showClose: true,
              message:'网络异常',
              type:'error',
              duration:2000
            })
        }
      }else{
        //反馈
        // PubSub.publish("detail_box_type_show", 4);
        data.iscp=true
        PubSub.publish("fankui_data", data);
      
      // PubSub.publish("detail_face_data", data); 
        // var loading_lo;
        // try {
        //     loading_lo=startLoding('.yujingbox')
         
        //     var res = await gyxyFaceWarning_edit({id:data.id,response:userinfo.realname})
        //     endLoding(loading_lo)
          

        // }catch (err) {
        //     console.log(err,'dscdascsda')
        //     endLoding(loading_lo)
        //     Message({
        //       showClose: true,
        //       message:'网络异常',
        //       type:'error',
        //       duration:2000
        //     })
        // }
      }
    },
    lookDetailFace(data) {
      PubSub.publish("detail_box_type_show", 1);
      PubSub.publish("detail_face_data", data);
    },
    lookDetailCar(data) {
      PubSub.publish("detail_box_type_show", 3);
      PubSub.publish("detail_car_data", data);
    },
    huifang(data){
      PubSub.publish("warnVideoshow", data);
    
    },
    zhuisu(data){
      
      // sessionStorage.setItem("Tracetracing_isfresh", 1);
      
      this.$router.push({
          path:'/Tracetracing',
          query: {
            plateNo: data.plateCode,
            timeStart:'',
            timeEnd:''
          },
      });
    
    },
    cp_warn_dingwei(data){
      // this.$emit('cp_warn_dingwei',data)

      PubSub.publish('warn_cp',data)
    },
    getImageList(val) {
      let list = [];
      list.push(val);
      return list;
    },
  },
  mounted() {
    PubSub.subscribe('fk_success',(msg,data)=>{

        if(this.dataInfo.id==data.id){
          this.$set(this.dataInfo,'isResponse',1)
      
        }

    })
  }
};
</script>

<style lang="scss" scoped>
.item-box {
  width: 100%;
  height: 100%;
  
  position: relative;
  padding: 5px;
  background: #fff;
  box-sizing: border-box;
  &.bor-one{
    border: 1px dashed #00beff;
  }
  &.bor-two{
    border: 1px dashed #ff0000;
  }
  &.bor-three{
    border: 1px dashed #666666;
  }
  .box-top-img {
    width: 374px;
    height: 155px;
    position: absolute;
    top: -1px;
    left: -1px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .box-top-img-one{
    background-image: url("../../assets/image/basetool/list-line-alarm-left.svg");
  }
  .box-top-img-two{
    background-image: url("../../assets/image/basetool/list-line-warning-left.svg");
  }
  .box-top-img-three{
    background-image: url("../../assets/image/basetool/list-line-finish-left.svg");
  }
  .box-bottom-img {
    width: 29px;
    height: 24px;
    position: absolute;
    bottom: -1px;
    right: -1px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .box-bottom-img-one{
    background-image: url("../../assets/image/basetool/list-line-alarm-right.svg");
  }
  .box-bottom-img-two{
    background-image: url("../../assets/image/basetool/list-line-warning-right.svg");
  }
  .box-bottom-img-three{
    background-image: url("../../assets/image/basetool/list-line-finish-right.svg");
  }
  .box-top {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    right: 0;
    .triangle{
      width: 0;
      height: 0;
       border-top: 32px solid red;
      border-left: 20px solid transparent; 
    }
    .text{
      // width: 61px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
    }
  }
  .box-con {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #a4f8ff 0%, rgba(255, 255, 255, 0) 100%);
    padding: 5px;
    display: flex;
    flex-direction: row;

    box-sizing: border-box;
    .box-con-left {
      width: 160px;
      .car-img {
        width: 140px;
        height: 140px;
        background: #e3f6f8;
      }
      .car-num {
        width: 140px;
        height: 40px;
        font-size: 16px;
        color: #333333;
        text-align: center;
        line-height: 40px;
        background-image: url("../../assets/image/basetool/label-4.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
    .box-con-right {
      width: calc(100% - 160px);
      .con {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .con-item-one {
          width: 50%;
          color: #333333;
          line-height: 24px;
        }
        .con-item {
          width: 100%;
          color: #333333;
          line-height: 24px;
        }
      }
      .btn-one {
        position: absolute;
        left: 279px;
        width: 140px;
      }
      .btn-all {
        position: absolute;
        bottom: 20px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
      }
      .btn-img-one {
        background-image: url("../../assets/image/basetool/button-2.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
      }
      .btn-img-one-bg{
        background-image: url("../../assets/image/basetool/button-3.svg");
        color: #BB3C2B;
      }
      .btn-img-two {
        background-image: url("../../assets/image/basetool/button-3.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #bb3c2b;
      }
      .btn-two {
        right: 186px;
        min-width: 80px;
      }
      .btn-three {
        right: 96px;
        min-width: 80px;
      }
      .btn-four {
        right: 6px;
        min-width: 80px;
      }
    }
  }
  .box-con-one{
    background: linear-gradient(90deg, #A4F8FF 0%, rgba(255, 255, 255, 0) 100%);
  }
  .box-con-two{
    background: linear-gradient(90deg, #FFC1C1 0%, rgba(255, 193, 193, 0) 100%);
  }
  .box-con-three{
    background: linear-gradient(90deg, #CCCCCC 0%, rgba(204, 204, 204, 0) 100%);
  }
}
</style>