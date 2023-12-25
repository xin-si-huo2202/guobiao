<template>
  <div class="box-all">
    <div class="right-title">
      <title-two>
        <p>共计：</p>
        <p class="num">{{ total }}条</p>
      </title-two>
    </div>
    <div class="right-con bg_color_white">
      <template v-if="dataList.length != 0">
      <div class="tab-con" id="tabBox-cpjs" @scroll="scrollEvent">
        <div class="tab-item" v-for="(item,index) in dataList" :key="item.id">
          <div class="tab-item-top" @click="lookDetailPlate(item,index)">
            <el-image
              style="width: 140px; height: 60px; background: #eee"
              :src="productionImage(item.smallImageUrl)"
              fit="contain"
              
            >
            </el-image>
            <div class="num-box">{{ item.carNumber }}</div>
          </div>
          <div class="portrait-desc">
            <div class="desc-time">
              <template
                v-if="
                  item.createTime && item.createTime != '0000:00:00_00:00:00'
                "
              >
                <div>
                  {{ item.createTime.substring(0, 10) }}
                </div>
                <div>{{ item.createTime.substring(11, 19) }}</div>
              </template>
              <div v-else>暂无时间</div>
              <div class="desc-triangle-one"></div>
            </div>
            <div class="desc-rate" @click="suyuan(item.carNumber)">
              轨迹追溯
            </div>
          </div>
        </div>
      </div>
       </template>
      <template v-if="dataList.length == 0">
        <noDataPage message="暂时没有检索数据" ></noDataPage>
      </template>
    </div>
  </div>
</template>

<script>
import EmpMini from "../empMini.vue";
import PubSub from "pubsub-js";
import Map from "@/components/map.vue";
import { queryCarNumber } from "@/api/collectionret.js";
import { Message, Loading } from "element-ui";
import { startLoding, endLoding } from "@/request/loading.js";
import TitleTwo from "../basetool/TitleTwo.vue";
import noDataPage from "@/components/noDataPage.vue";
export default {
  components: { TitleTwo,EmpMini,noDataPage},
  props: {
    queryParams: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      pageNo: 1,
      dataList: [],
      total: 0,
      infinitedisabled_cpjs: true,
      isscroll_cpjs: false,
    };
  },
  mounted() {
    // this.getDataList(this.queryParams, this.pagesize);
  },
  methods: {
    //轨迹查询
    suyuan(carNumber) {
      this.$router.push({
        path: "/Tracetracing",
        query: {
          plateNo: carNumber,
          timeStart: "",
          timeEnd: "",
          pageType: 2,
        },
      });
    },
    //滚动事件
    scrollEvent() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#tabBox-cpjs");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
       
        if (!ts.isscroll_cpjs) {
         
          ts.isscroll_cpjs = true;
          ts.loasd();
        }
      }
    },
    lookDetailPlate(item,index) {
      let newList=[];
      let newIndex=10;
      if(index<10){
        newList=this.dataList.slice(0,20);
        newIndex=index;
      }else{
        newList=this.dataList.slice(index-10,index+10);
        newIndex=10;
      }
      PubSub.publish("detail_box_type_show", 7);
      PubSub.publish("collect_detail_car_data", {item:item,listData:newList,index:newIndex});
    },
    loasd() {
      this.pageNo = this.pageNo + 1;
      this.getDataList(this.queryParams, this.pageNo);
    },
    async getDataList(params, pageNo = 1) {
      let that = this;
      var loading_lo;
      this.pageNo = pageNo;
      params.pageNo = pageNo;
      try {
        loading_lo = startLoding(".right-con");
        that.infinitedisabled_cpjs = true;
        //获取数据
        var res = await queryCarNumber(params);
        if (res && res.result) {
          if(pageNo==1){
            that.dataList =res.result.records
          }else{
            that.dataList = [...that.dataList, ...res.result.records];
          }
          that.total = res.result.total;
        }
        endLoding(loading_lo);
        if(res.result.records.length!=params.pageSize){
          that.isscroll_cpjs = true;
        }else{
          that.isscroll_cpjs = false;
        }
        that.infinitedisabled_cpjs = false;
      } catch (err) {
        endLoding(loading_lo);
        that.isscroll_cpjs = false;
        that.infinitedisabled_cpjs = false;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box-all {
  width: 100%;
  height: 100%;
  .right-title {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;

    color: #999999;
    .num {
      color: #02befe;
      font-size: 12px;
    }
  }
  .right-con {
    width: 100%;
    height: calc(100% - 40px); /*no*/
    margin-left: 20px; /*no*/
    .tab-con {
      width: 100%; /*no*/
      height: 100%; /*no*/
      overflow-y: scroll;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      .tab-item {
        width: 140px; /*no*/
        height: 160px; /*no*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #fff;
        margin: 10px 0 0 12px; /*no*/
        text-align: center;
        .tab-item-top {
          width: 100%; /*no*/
          height: calc(100% - 40px); /*no*/
          background: #e3f6f8;
          padding: 21px 0 11px 0; /*no*/
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .portrait-desc {
          width: 100%; /*no*/
          height: 36px; /*no*/
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          background-color: #02befe;
          color: #ffffff;
          border-left: 1px solid #78b6ee; /*no*/
          border-right: 1px solid #78b6ee; /*no*/
          border-bottom: 1px solid #78b6ee; /*no*/
          .desc-time {
            width: 65%;
            background-color: #fff;
            color: #00beff;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            line-height: 16px; /*no*/
            div {
              font-size: 13px; /*no*/
            }
            .desc-triangle-one {
              width: 0;
              height: 0;
              border-bottom: 36px solid #02befe; /*no*/
              border-left: 12px solid transparent; /*no*/
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .desc-rate {
            text-align: center;
            color: #fff;
            font-size: 12px; /*no*/
            line-height: 36px; /*no*/
            width: 35%; /*no*/
            height: 36px; /*no*/
          }
        }
      }
    }
  }
}
</style>