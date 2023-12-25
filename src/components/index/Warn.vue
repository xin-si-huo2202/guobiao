<template>
  <div class="yj-box bg_color_white">
    <div class="yj-total">
      <p>人像预警：</p>
      <p class="num-total">{{ rxTotal }}</p>
      <p>条</p>
      <p style="margin-left: 12px">车牌预警：</p>
      <p class="num-total">{{ cpTotal }}</p>
      <p>条</p>
    </div>

    <div class="yj-tab">
      <!-- <div  v-show="type == 1?true:false" class="rx_lo"  v-infinite-scroll="loasd_rx" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled_rx'> -->
      <div v-show="type == 1 ? true : false" class="rx_lo" id='warn-rx' @scroll="scrollEvent_rx">
        <template v-if="faeceList.length != 0" >
          <!-- <div class="yj-tab-item" v-for="item in faeceList" :key="item.id" :class="item.iswarn?'warn':''" @click.stop="dingwei_rx(item)">-->
          <div class="yj-tab-item" v-for="item in faeceList" :key="item.id"  @click.stop="dingwei_rx(item)">
            <div class="rx-item">
              <!-- 没对 -->
              <el-image
                class="face-img"
                :src="productionImage(item.faceImage)"
                fit="contain"
                @click.stop="lookDetailFace(item)"
              ></el-image>
              <div class="face-rate">
                <div class="rate-num">{{ item.points ? (item.points*100).toFixed(1) : 0 }}%</div>
                <div class="rate-line"></div>
                <div class="rate-text">相似率</div>
              </div>
              <!-- 没对 -->
              <el-image
                class="face-img"
                :src="productionImage(item.smallImgUrl)"
                fit="contain"
                @click.stop="lookDetailFace(item)"
              ></el-image>
              <div class="face-info">
                <!-- 没对 -->
                <p>姓名：{{item.name}} </p>
                <p>
                  预警坐标：{{ item.longitude ? item.longitude : "0" }},{{
                    item.latitude ? item.latitude : "0"
                  }}
                </p>
                <p class="yujing-time">
                  {{ item.createTime ? item.createTime : "暂无时间" }}
                </p>
              </div>
            </div>

            <!-- 没对 -->
            <div class="yjhf-btn">
              <div class="btn-triangle"></div>
              <!--<div class="btn-box" @click.stop="huifang(item)">
                <div class="btn-icon"></div>
                <p>预警回放</p>
              </div>-->
              <div class="btn-box" @click.stop="dingwei_rx(item)">
                <div class="btn-icon"></div>
                <p>位置</p>
              </div>
            </div>
          </div>
        </template>

        <template v-if="faeceList.length == 0">
          <EmpMini />
        </template>
      </div>

      <!-- <div v-show="type == 2?true:false" class="cp_lo"  v-infinite-scroll="loasd_cp" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled_cp'> -->
      <div v-show="type == 2 ? true : false" class="cp_lo" id='warn-cp' @scroll="scrollEvent_cp" >
        <template v-if="chepaiList.length != 0">
          <div class="yj-tab-item" v-for="item in chepaiList" :key="item.id"  @click.stop="dingwei_cp(item)">
            <div class="cp-item">
              <el-image
                class="face-img"
                :src="productionImage(item.smallImgUrl)"
                fit="contain"
                @click.stop="lookDetailCar(item)"
              ></el-image>
              <div class="face-info">
                <!-- 没对 -->
                <p>布控车牌：{{item.plateCode}}</p>
                <p>
                  预警坐标：{{ item.longitude ? item.longitude : "0" }},{{
                    item.latitude ? item.latitude : "0"
                  }}
                </p>
                <p>{{ item.createTime ? item.createTime : "暂无时间" }}</p>
              </div>
            </div>

            <div class="yjhf-btn">
              <div class="btn-triangle"></div>
              <!--<div class="btn-box" @click.stop="huifang(item)">
                <div class="btn-icon"></div>
                <p>预警回放</p>
              </div>-->

              <div class="btn-box" @click.stop="dingwei_cp(item)">
                <div class="btn-icon"></div>
                <p>位置</p>
              </div>
            </div>
          </div>
        </template>

        <template v-if="chepaiList.length == 0">
          <EmpMini />
        </template>
      </div>

      <div v-show="type == 3 ? true : false" class="rx_lowl wailai-rx" id='wl-rx' @scroll="scrollEvent_rx_wl">
        <template v-if="faeceListwl.length != 0" >
          <div class="yj-tab-item" v-for="item in faeceListwl" :key="item.id" >
            <div class="rx-item">
              <!-- 没对 -->
              <el-image
                class="face-img"
                :src="productionImage(item.faceImage)"
                fit="contain"
                @click.stop="lookDetailFacewl(item)"
              ></el-image>
              <div class="face-rate">
                <div class="rate-num">{{ item.point ? (item.point*100).toFixed(1) : 0 }}%</div>
                <div class="rate-line"></div>
                <div class="rate-text">相似率</div>
              </div>
              <!-- 没对 -->
              <el-image
                class="face-img"
                :src="productionImage(item.smallImgUrl)"
                fit="contain"
                @click.stop="lookDetailFacewl(item)"
              ></el-image>
              <div class="face-info">
                <!-- 没对 -->
                
                <p>
                  预警坐标：{{ item.longitude ? item.longitude : "0" }},{{
                    item.latitude ? item.latitude : "0"
                  }}
                </p>
                <p >
                  {{ item.createTime ? item.createTime : "暂无时间" }}
                </p>
              </div>
            </div>

            <!-- 没对 -->
         
          </div>
        </template>

        <template v-if="faeceList.length == 0">
          <EmpMini />
        </template>
      </div>

      <div v-show="type == 4 ? true : false" class="rx_lowl wailai-rx" id='wl-cp' @scroll="scrollEvent_cp_wl">
        <template v-if="cpListwl.length != 0" >
          <div class="yj-tab-item" v-for="item in cpListwl" :key="item.id"  >
            <div class="cp-item">
              <el-image
                class="face-img"
                :src="productionImage(item.smallImgUrl)"
                fit="contain"
                @click.stop="lookDetailCarwl(item)"
              ></el-image>
              <div class="face-info">
                <!-- 没对 -->
                <p>车牌号：{{item.plate}}</p>
                <p>
                  预警坐标：{{ item.longitude ? item.longitude : "0" }},{{
                    item.latitude ? item.latitude : "0"
                  }}
                </p>
                <p>{{ item.createTime ? item.createTime : "暂无时间" }}</p>
              </div>
            </div>

            <!-- 没对 -->
         
          </div>
        </template>

        <template v-if="faeceList.length == 0">
          <EmpMini />
        </template>
      </div>
   
    </div>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
import { gyxyFaceWarning_s, gyxyPlateWarning_s ,gyxyFaceWarning_swl,gyxyPlateWarning_swl} from "@/api/warningInfo.js";
import EmpMini from "../empMini.vue";
import { startLoding, endLoding } from "@/request/loading.js";
import { Message, Loading } from "element-ui";
export default {
  data() {
    return {
      rxTotal: 0,
      cpTotal: 0,
      listss: [
      ],
      faeceList: [],
      chepaiList: [],

      faeceListwl:[],

      cpListwl:[],

      pageNo_rx: 1,

      pageNo_rxwl: 1,

      pageNo_cp: 1,

      pageNo_cpwl: 1,

      infinitedisabled_rx: true,

      infinitedisabled_cp: true,

      isscroll_rx:false,

      isscroll_cp:false,

      isscroll_rxwl:false,

      isscroll_cpwl:false,
      startTime:"",
      endTime:""
    };
  },
  props: ["type"],
  watch: {
    type: {
      handler(newss, old) {
        if (newss == 1) {
          this.infinitedisabled_rx = false;

          this.infinitedisabled_cp = true;
        } else {
          this.infinitedisabled_cp = false;

          this.infinitedisabled_rx = true;
        }
      },

      immediate: false,
    },
  },
  components: {
    EmpMini,
  },
  mounted() {
    PubSub.subscribe('fk_success',(msg,data)=>{

   

      this.faeceList.forEach((item,i)=>{
        if(item.id == data.id ){
        
          this.$set(item,'isResponse',1)


        }
      })


       this.chepaiList.forEach((item,i)=>{
        if(item.id == data.id ){
        
          this.$set(item,'isResponse',1)


        }
      })

    })

    PubSub.subscribe('warn-face-fan',(msg,data)=>{
     
      this.faeceList.forEach((item,i)=>{
        if(item.id == data.id ){
        
          this.$set(item,'isRead',1)


        }
      })
    }) 

    PubSub.subscribe('warn-cp-fan',(msg,data)=>{
     
      this.chepaiList.forEach((item,i)=>{
        if(item.id == data.id ){
        
          this.$set(item,'isRead',1)


        }
      })
    }) 

    PubSub.subscribe('warn-face',(msg,data)=>{
    
      console.log('人像预警',data)
      data.iswarn = true
      var isexit=false
      this.faeceList.forEach((item,i)=>{
        if(item.id == data.id && item.iswarn){
        
            this.$set(item,'videoUrl',data.videoUrl)
            isexit=true
        }
      })

      if(!isexit){
        this.faeceList= [data,...this.faeceList]
        this.rxTotal = this.rxTotal+1
      }
      
    })  
    PubSub.subscribe('warn-cp',(msg,data)=>{
      console.log('车牌预警',data)
      data.iswarn = true
   
     

      var isexit=false
      this.chepaiList.forEach((item,i)=>{
        if(item.id == data.id && item.iswarn){
            this.$set(item,'videoUrl',data.videoUrl)
            isexit=true
        }
      })

      if(!isexit){
        this.chepaiList= [data,...this.chepaiList]

        this.cpTotal = this.cpTotal+1
      }
    })  

    this.xiba();
    
    this.ggp();

    this.ggp_chepai();

    this.ggpwl();

    this.ggp_cpwl();
    
    var that=this


    // $(document).ready(function(){ 
    //     layui.use('flow', function(){  
    //       var flow = layui.flow;  
         
    //       flow.load({
    //           elem: '.rx_lo' //指定列表容器
     
    //           ,done: function(page, next){ //到达临界点（默认滚动触发），触发下一页的回调
    //             that.pageNo_rx=page
    //             that.ggp();
    //             debugger
    //           } 
    //       });
    //     })
    // })   
    
  },
  methods: {
    dingwei_rx(item){
        PubSub.publish("warn-face", item);
    },
    dingwei_cp(item){
        PubSub.publish("warn-cp", item);
    },
    scrollEvent_rx () {
        // 可存this指向
        var ts = this    
        var el = document.querySelector('#warn-rx');
        var offsetHeight = el.offsetHeight;
      
        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if ((offsetHeight + scrollTop) - scrollHeight >= -1) {
            // 需要执行的代码
            console.log('已滚动到底部')
            if(!ts.isscroll_rx){

                ts.isscroll_rx=true
                ts.loasd_rx()

            }
        }
      
    },
    scrollEvent_cp(){
          // 可存this指向
        var ts = this    
        var el = document.querySelector('#warn-cp');
        var offsetHeight = el.offsetHeight;
        
        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if ((offsetHeight + scrollTop) - scrollHeight >= -1) {
            // 需要执行的代码
            console.log('已滚动到底部')
                if(!ts.isscroll_cp){
                ts.isscroll_cp=true
                ts.loasd_cp()
            }
        }
        
    },

    scrollEvent_rx_wl () {
        // 可存this指向
        var ts = this    
        var el = document.querySelector('#wl-rx');
        var offsetHeight = el.offsetHeight;
      
        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if ((offsetHeight + scrollTop) - scrollHeight >= -1) {
            // 需要执行的代码
            console.log('已滚动到底部')
            if(!ts.isscroll_rxwl){

                ts.isscroll_rxwl=true
                ts.loasd_rxwl()

            }
        }
      
    },

    scrollEvent_cp_wl () {
        // 可存this指向
        var ts = this    
        var el = document.querySelector('#wl-cp');
        var offsetHeight = el.offsetHeight;
      
        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if ((offsetHeight + scrollTop) - scrollHeight >= -1) {
            // 需要执行的代码
            console.log('已滚动到底部')
            if(!ts.isscroll_rxwl){

                ts.isscroll_rxwl=true
                ts.loasd_cpwl()

            }
        }
      
    },

    huifang(data){
      PubSub.publish("warnVideoshow", data);
    
    },
    loasd_rx() {
      this.pageNo_rx = this.pageNo_rx + 1;

      this.ggp();
    },
    loasd_rxwl() {
      this.pageNo_rxwl = this.pageNo_rxwl + 1;

      this.ggpwl();
    },
    loasd_cp() {
      this.pageNo_cp = this.pageNo_cp + 1;

      this.ggp_chepai();
    },
    loasd_cpwl() {
      this.pageNo_cpwl = this.pageNo_cpwl + 1;

      this.ggp_cpwl();
    },
    async ggpwl() {
      var loading_lo;

      try {
        loading_lo = startLoding(".rx_lo");

        this.infinitedisabled_rx = true;

        var res = await gyxyFaceWarning_swl({
          pageNo: this.pageNo_rxwl,
          pageSize: 20,
          selectType: "",
          departId: "",
          fromCar: "",
          timeEnd: "",
          timeStart: "",
        });

        endLoding(loading_lo);

        this.infinitedisabled_rx = false;
        if (res && res.result) {
          // if(res.result){

          // this.rxTotal = res.result.total;

          // res.result[1].videoUrl='https://video.pearvideo.com/mp4/adshort/20211203/cont-1747096-15801320_adpkg-ad_hd.mp4'

          this.faeceListwl = [...this.faeceListwl, ...res.result.records];

          this.faeceListwl.forEach((item,i)=>{
            item.faceImage = item.blackImgUrl
          })
          
          this.isscroll_rxwl=false
          // }
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        endLoding(loading_lo);
        // this.infinitedisabled_rx=false

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async ggp() {
      var loading_lo;

      try {
        loading_lo = startLoding(".rx_lo");

        this.infinitedisabled_rx = true;

        var res = await gyxyFaceWarning_s({
          pageNo: this.pageNo_rx,
          pageSize: 20,
          selectType: "",
          departId: "",
          fromCar: "",
          timeEnd: this.endTime,
          timeStart: this.startTime,
        });

        endLoding(loading_lo);

        this.infinitedisabled_rx = false;
        if (res && res.result) {
          // if(res.result){

          this.rxTotal = res.result.total;

          // res.result[1].videoUrl='https://video.pearvideo.com/mp4/adshort/20211203/cont-1747096-15801320_adpkg-ad_hd.mp4'

          this.faeceList = [...this.faeceList, ...res.result.records];
          
          this.isscroll_rx=false
          // }
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        endLoding(loading_lo);
        // this.infinitedisabled_rx=false

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async ggp_chepai() {
      var loading_lo2;
      try {
        loading_lo2 = startLoding(".cp_lo");
        this.infinitedisabled_cp = true;
        var res = await gyxyPlateWarning_s({
          pageNo: this.pageNo_cp,
          pageSize: 20,
          selectType: "",
          departId: "",
          fromCar: "",
          timeEnd: this.endTime,
          timeStart: this.startTime,
        });
        
        endLoding(loading_lo2);
        this.infinitedisabled_cp = false;
        if (res && res.result) {
          // if(res.result){

          this.cpTotal = res.result.total;

          this.chepaiList = [...this.chepaiList, ...res.result.records];

          this.isscroll_cp=false
          // }
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        endLoding(loading_lo2);
        //  this.infinitedisabled_cp=false
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async ggp_cpwl() {
      var loading_lo2;
      try {
        loading_lo2 = startLoding(".cp_lo");
        this.infinitedisabled_cp = true;
        var res = await gyxyPlateWarning_swl({
          pageNo: this.pageNo_cpwl,
          pageSize: 20,
          selectType: "",
          departId: "",
          fromCar: "",
          timeEnd: "",
          timeStart: "",
        });
 
        endLoding(loading_lo2);
        this.infinitedisabled_cp = false;
        if (res && res.result) {
          // if(res.result){

          // this.cpTotal = res.result.total;

          this.cpListwl = [...this.cpListwl, ...res.result.records];
          
          
          this.isscroll_cpwl=false
          // }
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        endLoding(loading_lo2);
        //  this.infinitedisabled_cp=false
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
       var hour=now.getHours();
      var minu=now.getMinutes();
      var sec=now.getSeconds();
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");

      hour=hour.toString().padStart(2, "0");
      minu=minu.toString().padStart(2, "0");
      sec=sec.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
      // console.log(yesterdsay)
      // debugger
      return defaultDate;
    },
    xiba() {
      var yesterdsay = this.getNowTime(
        new Date(new Date().getTime() - 86400000 * 90)
      );
      var jkl = this.getNowTime(new Date());
      // this.startTime=yesterdsay+" 00:00:00";
      // this.endTime=jkl+ " 23:59:59";
      this.startTime =  yesterdsay
      this.endTime = jkl

    },
    getImageList(val) {
      let list = [];
      list.push(val);
      return list;
    },

    lookDetailFace(data) {
      PubSub.publish("detail_box_type_show", 1);
      PubSub.publish("detail_face_data", data);
    },
    lookDetailFacewl(data) {
      PubSub.publish("detail_box_type_show", 11);
      PubSub.publish("detail_face_data", data);
    },
    lookDetailCar(data) {
      PubSub.publish("detail_box_type_show", 3);
      PubSub.publish("detail_car_data", data);
    },

    lookDetailCarwl(data) {
      PubSub.publish("detail_box_type_show", 12);
      PubSub.publish("detail_car_data", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.yj-box {
  height: 100%;
  padding-bottom: 10px;
  box-sizing: border-box;
  .yj-total {
    // background: #fff;
    height: 40px;
    padding: 0 14px;
    color: #999999;
    display: flex;
    flex-direction: row;
    // justify-content: flex-start;
    align-items: center;
    .num-total {
      color: #00beff;
    }
  }

  .border {
    border: 1px solid red;
  }
  .yj-tab {
    height: calc(100% - 50px);
    position: relative;
    overflow-y: hidden;
    .rx_lo,
    .rx_lowl,
    .cp_lo {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .wailai-rx{
      .rx-item-wl {
      
        display: flex;
        justify-content: space-around;

        .face-img-wl {
          width: 70px;
          height: 70px;
        }
      }
    }
    .yj-tab-item {
      width: 100%;
      height: 92px;
      padding: 14px;
      position: relative;
      box-sizing: border-box;
      &.warn{
        background: linear-gradient(
          to right,
          #ff5353   ,
          rgba(255, 255, 255, 0)
        );
      }
     
      border-top: 1px solid #9daecb;
      .rx-item {
        display: grid;
        grid-template-columns: 64px 58px 64px auto;
      }
      .cp-item {
        display: grid;
        grid-template-columns: 64px auto;
      }
      .face-img {
        width: 64px;
        height: 64px;
      }
      .face-rate {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        div {
          font-size: 12px;
        }
        .rate-num {
          color: #ff5858;
          font-weight: 500;
        }
        .rate-line {
          height: 6px;
          width: 36px;
          background-image: url("../../assets/image/warning-face-line.svg");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin: 2px 0;
        }
        .rate-text {
          color: #999999;
        }
      }
      .face-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        line-height: 18px;
        padding-left: 10px;
      }
      p {
        font-size: 12px;
        overflow: hidden;

        /* 强制文字不换行 */
        white-space: nowrap;

        /* 超出部分显示省略号 */
        text-overflow: ellipsis;
      }
      .yjhf-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 34px;
        width: 112px;
        display: flex;
        flex-direction: row;
        .btn-triangle {
          width: 0;
          height: 0;
          border-bottom: 34px solid #dddddd;
          border-left: 21px solid transparent;
        }
        .btn-box {
          background: #dddddd;
          height: 34px;
          width: calc(100% - 21px);
          line-height: 34px;
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 12px;
          .btn-icon {
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-left: 12px solid red;
            border-bottom: 6px solid transparent;
            margin: 0 10px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1700px) {
  .yujing-time {
    max-width: 84px; /*no*/
  }
}
</style>