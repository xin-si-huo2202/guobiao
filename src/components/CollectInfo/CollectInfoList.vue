<template>
  <div class="yujingbox">
    <div v-show="tabindex == 1 ? true : false" class="rx_box">
      <template v-if="rxList.length != 0">
        <div class="rx_con" id="tabBox-rxcj" @scroll="scrollEventRX">
          <div class="rx_item" v-for="(item, index) in rxList" :key="item.id">
            <div class="top-img">
              <!-- <img :src="item.smallImageUrl" @click="lookDetailFace(item)" /> -->
              <el-image
                style="width: 130px; height: 130px; background: #eee"
                :src="productionImage(item.smallImageUrl)"
                @click="lookDetailFace(item, index)"
                fit="fill"
           
              >
              </el-image>
            </div>
            <div class="rx-btn">
              <div class="rx-btn-weizhi" @click="rxWeiZhi(item,1)">
             
                <i class=" el-icon-location">位置</i>
              
              </div>
              <!--<div class="rx-btn-tir"></div>-->
              <div class="rx-btn-jiansuo" @click="rxJianSuo(item)">

                <i class=" el-icon-search">检索</i>
              
              </div>
            </div>
            <div class="time">
              <template v-if="item.createTime">
                <div>
                  {{ item.createTime.substring(0, 10) }}
                </div>
                <div>{{ item.createTime.substring(11, 19) }}</div>
              </template>
              <div v-else>暂无时间</div>
            </div>
          </div>
          <br/>
          <p class='jz' @click='loasd_rx()'>加载更多...</p>
        </div>
     
      </template>
      <template v-if="rxList.length == 0">
        <EmpMini />
      </template>
    </div>
    <div v-show="tabindex == 2 ? true : false" class="cp_box">
      <template v-if="cpList.length != 0">
        <div class="rx_con" id="tabBox-cpcj" @scroll="scrollEventCP">
          <div class="tab-item" v-for="(item, index) in cpList" :key="item.id">
            <div class="tab-item-top">
              <!-- <img :src="item.smallImageUrl"  @click="lookDetailCar(item)"/> -->
              <el-image
                style="width: 130px; height: 60px; background: #eee"
                :src="productionImage(item.smallImageUrl)"
                @click="lookDetailCar(item, index)"
                fit="fill"
               
              >
              </el-image>
              <div class="num-box">{{ item.carNumber }}</div>
            </div>
            <div class="cp-btn">
              <div class="cp-btn-weizhi" @click="rxWeiZhi(item,2)">
                <i class=" el-icon-location">位置</i>
              </div>

      
            </div>
            <div class="time">
              <template v-if="item.createTime">
                <div>
                  {{ item.createTime.substring(0, 10) }}
                </div>
                <div>{{ item.createTime.substring(11, 19) }}</div>
              </template>
              <div v-else>暂无时间</div>
            </div>
          </div>
           <p class='jz' @click='loasd_cp()'>加载更多...</p>
        </div>
      </template>
      <template v-if="cpList.length == 0">
        <EmpMini />
      </template>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "../empMini.vue";

import {
  gyxySubImageInfo,
  queryByImageId,
  queryByImageIdCar,
} from "@/api/collectInfo.js";
import PubSub from "pubsub-js";
import { bigImgurl } from "@/api/collectionret.js";
export default {
  name: "CollectInfoList",
  props: [
    "tabindex",
    "sysOrgCode",
    "policeCarNumber",
    "chongzhi",
    "change",
    "startTime",
    "endTime",
  ],
  data() {
    return {
      rxList: [],

      cpList: [],

      pageNo_rx: 1,

      pageNo_cp: 1,

      infinitedisabled_rx: true,

      infinitedisabled_cp: true,

      isscroll_rxcj: false,
      isscroll_cpcj: false,

      ischushi:true
    };
  },
  destroyed() {},
  watch: {
    chongzhi: {
      handler(newss, old) {
        this.resets(true);
      },

      immediate: false,
    },
    tabindex: {
      handler(newss, old) {
        this.resets();
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
    change: {
      handler(newss, old) {
        this.resets();
      },
      immediate: false,
    },
    startTime: {
      handler(newss, old) {
        this.resets();
      },

      immediate: false,
    },
    endTime: {
      handler(newss, old) {
        if(!this.ischushi){
          this.resets();
        }

        this.ischushi = false
      },

      immediate: false,
    },
    // sysOrgCode: {
    //   handler(newss, old) {
    //     this.resets();
    //   },

    //   immediate: false,
    // },
    // policeCarNumber: {
    //   handler(newss, old) {
    //     this.resets();
    //   },

    //   immediate: false,
    // },
  },
  methods: {
    //人像-位置
    rxWeiZhi(data,type){
      //debugger
      console.log("00000000",data)
      data.type=type
      sessionStorage.setItem("caijiweizhi_date", JSON.stringify(data));

      if(data.gpsLongitude){
        this.$router.push("/");
      }
   
    },
    //人像-检索
    rxJianSuo(data){
      sessionStorage.setItem("caijiweizhi_date", JSON.stringify(data));
      this.$router.push("/collectionRet");
    },  
    unique(arr) {
      
      return Array.from(new Set(arr))
    },
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },
    //人像采集滚动
    scrollEventRX() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#tabBox-rxcj");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_rxcj) {
          ts.isscroll_rxcj = true;
          ts.loasd_rx();
        }
      }
    },
    //车牌采集滚动
    scrollEventCP() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#tabBox-cpcj");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_cpcj) {
          ts.isscroll_cpcj = true;
          ts.loasd_cp();
        }
      }
    },
    //车牌大图详情
    async lookDetailCar(item, index) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.cpList.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.cpList.slice(index - 10, index + 10);
        newIndex = 10;
      }
      PubSub.publish("detail_box_type_show", 7);
      PubSub.publish("collect_detail_car_data", {
        item: item,
        listData: newList,
        index: newIndex,
      });
      // }
    }, //人像大图详情
    async lookDetailFace(item, index) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.rxList.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.rxList.slice(index - 10, index + 10);
        newIndex = 10;
      }
      let res = await queryByImageId({ imageId: item.id });
      if (res && res.result) {
        item.genderCode = res.result.genderCode;
        item.age = res.result.age;
        PubSub.publish("detail_box_type_show", 6);
        PubSub.publish("collect_detail_face_data", {
          item: item,
          listData: newList,
          index: newIndex,
        });
      }
    },
    loasd_rx() {
      this.pageNo_rx = this.pageNo_rx + 1;

      this.ggp();
    },
    loasd_cp() {
      this.pageNo_cp = this.pageNo_cp + 1;

      this.ggp_chepai();
    },
    resets(isall = false) {
      if (this.tabindex == 1) {
        this.pageNo_rx = 1;
        this.rxList = [];
        this.ggp(isall);
      } else {
        this.pageNo_cp = 1;
        this.cpList = [];
        this.ggp_chepai(isall);
      }
    },

    async ggp(isall = false) {
      var loading_lo;

      try {
        loading_lo = startLoding(".rx_box");

        this.infinitedisabled_rx = true;

        var res = await gyxySubImageInfo({
          pageNo: this.pageNo_rx,
          pageSize: 50,
          type: 11,
          beginTime: this.startTime ? this.startTime : "",
          endTime: this.endTime ? this.endTime : "",
          sysOrgCode: isall ? "" : this.sysOrgCode,
          policeCarNumber: isall ? "" : this.policeCarNumber,
        });

        endLoding(loading_lo);

        this.isscroll_rxcj = false;
        this.infinitedisabled_rx = false;
        if (res && res.result) {
          this.$emit("rxtotal", res.result.total);
          if (res.result.records) {
           

            this.rxList = [...this.rxList, ...res.result.records];

            this.rxList = this.deteleObject(this.rxList);
            // this.rxList = this.rxList.slice(0,10)
          }
        }
      } catch (err) {
        console.log(err, "err====");
        endLoding(loading_lo);
        this.isscroll_rxcj = false;
        this.infinitedisabled_rx = false;

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async ggp_chepai(isall = false) {
      var loading_lo;

      try {
        loading_lo = startLoding(".cp_box");

        this.infinitedisabled_cp = true;

        var res = await gyxySubImageInfo({
          pageNo: this.pageNo_cp,
          pageSize: 50,
          type: 2,
          beginTime: this.startTime ? this.startTime : "",
          endTime: this.endTime ? this.endTime : "",
          sysOrgCode: isall ? "" : this.sysOrgCode,
          policeCarNumber: isall ? "" : this.policeCarNumber,
        });

        endLoding(loading_lo);

        this.isscroll_cpcj = false;
        this.infinitedisabled_cp = false;
        if (res && res.result) {
          this.$emit("cptotal", res.result.total);
          if (res.result.records) {
            this.cpList = [...this.cpList, ...res.result.records];

            this.cpList = this.deteleObject(this.cpList);
          }
        }
      } catch (err) {
        endLoding(loading_lo);
        this.isscroll_cpcj = false;
        this.infinitedisabled_cp = false;

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
  },

  mounted() {},
  components: {
    EmpMini,
  },
};
</script>

<style lang='scss' scoped>
.yujingbox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.jz{
  width:100%;
  text-align:center;
  margin-top:10px;
  color:#2cc6ff;
  cursor:pointer;
}
.rx_box,
.cp_box {
  width: 97.4%;
  margin: 0 auto;
  height: 100%;
  overflow-y: scroll;

  .rx_con {
    width: 100%; /*no*/
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 100%;
    overflow-y: scroll;
    align-content: flex-start;
    // &::after {
    //   content: "";
    //   flex: auto;
    // }
    .rx_item {
      width: 130px; /*no*/
      height: 200px; /*no*/
      margin: 10px 0 0 12px; /*no*/
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #fff;
      .rx-btn{
        height: 32px;/*no*/
        width: 130px;/*no*/
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        // grid-template-columns: 40% 20% 40%;/*no*/
        border: 1px solid #02befe;
        .rx-btn-tir{
          width: 0;
          height: 0;
          border-right: 20px solid transparent;/*no*/
          border-top: 30px solid #02befe;/*no*/
        }
        .rx-btn-weizhi{
          width: 50%;/*no*/
          height: 30px;/*no*/
          background: #02befe;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;

          i,span{
            font-size:12px;/*no*/
          }
          
        }
        .rx-btn-jiansuo{
          width: 50%;/*no*/
          height: 30px;/*no*/
          display: flex;
          justify-content: center;
          align-items: center;
          color: #02befe;
          i{
            font-size:12px;/*no*/
          }
        }
      }
      .top-img {
        height: calc(100% - 70px); /*no*/
        // img {
        //   width: 130px; /*no*/
        //   height: 130px; /*no*/
        //   display: block;
        // }
      }
      .time {
        height: 36px; /*no*/
        width: 100%;
        border-left: 1px solid #78b6ee; /*no*/
        border-right: 1px solid #78b6ee; /*no*/
        border-bottom: 1px solid #78b6ee; /*no*/
        box-sizing: border-box;
        color: #00beff;

        text-align: center;
        line-height: 16px; /*no*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        div {
          font-size: 12px; /*no*/
        }
      }
    }

    .tab-item {
      width: 130px; /*no*/
      height: 166px; /*no*/
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #fff;
      margin: 10px 0 0 12px; /*no*/
      text-align: center;
      .tab-item-top {
        width: 100%; /*no*/
        height: calc(100% - 72px); /*no*/
        background: #e3f6f8;
        padding: 21px 0 11px 0; /*no*/
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .num-box{
          font-size: 16px; /*no*/
        }
        // img {
        //   width: 130px; /*no*/
        //   height: 60px; /*no*/
        //   display: block;
        // }
      }
      .cp-btn{
        height: 32px;/*no*/
        width: 130px;/*no*/
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        // grid-template-columns: 40% 20% 40%;/*no*/
        border: 1px solid #02befe;
        .cp-btn-tir{
          width: 0;
          height: 0;
          border-right: 20px solid transparent;/*no*/
          border-top: 30px solid #02befe;/*no*/
        }
        .cp-btn-weizhi{
          width: 100%;/*no*/
          height: 30px;/*no*/
          background: #02befe;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          i{
            font-size:12px;/*no*/
          }
        }
        .cp-btn-jiansuo{
          width: 55px;/*no*/
          height: 30px;/*no*/
          display: flex;
          justify-content: center;
          align-items: center;
          color: #02befe;
        }
      }
      .time {
        height: 34px; /*no*/
        width: 100%;
        border-left: 1px solid #78b6ee; /*no*/
        border-right: 1px solid #78b6ee; /*no*/
        border-bottom: 1px solid #78b6ee; /*no*/
        box-sizing: border-box;
        color: #00beff;
        text-align: center;
        line-height: 16px; /*no*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        div {
          font-size: 12px; /*no*/
        }
      }
    }
  }
}
</style>
