<template>
  <div class="box-all">
    <div class="right-title">
      <title-two>
        <p>共计：</p>
        <p class="num">{{ total }}条</p>
      </title-two>
    </div>
    <div class="right-con face123">
      <template v-if="dataList.length != 0">
        <div class="tab-con" id="tabBox-rxjs" @scroll="scrollEvent">
          <div class="tab-item" v-for="(item, i) in dataList" :key="item.id">
            <el-image
              v-if="item[3]"
              style="width: 140px; height: 140px; background: #eee"
              :src="productionImage(item[0])"
              @click="lookDetailFace2(beiyong_list[i], i)"
              fit="fill"
              @mousedown="mouseDown($event, item[0], item[2])"
            >
            </el-image>
            <el-image
              v-if="!item[3]"
              style="width: 140px; height: 140px; background: #eee"
              :src="productionImage(item[0])"
              @click="lookDetailFace(item[0])"
              @mousedown="mouseDown($event, item[0], item[2])"
              fit="fill"
            >
            </el-image>
            <div class="portrait-desc" v-if="item[3]">
              <div class="desc-time" :style="{ width: '100%' }">
                <template v-if="item[2] && item[2] != '0000:00:00_00:00:00'">
                  <div class="font-size-13">
                    {{ item[2].substring(0, 10).replace(/:/g, "-") }}
                  </div>
                  <div class="font-size-13">
                    {{ item[2].substring(11, 19) }}
                  </div>
                </template>
                <div v-else class="font-size-13">暂无时间</div>
              </div>
            </div>
            <div class="portrait-desc" v-if="!item[3]">
              <div class="desc-time">
                <template v-if="item[2] && item[2] != '0000:00:00_00:00:00'">
                  <div class="font-size-13">
                    {{ item[2].substring(0, 10).replace(/:/g, "-") }}
                  </div>
                  <div class="font-size-13">
                    {{ item[2].substring(11, 19) }}
                  </div>
                </template>
                <div v-else class="font-size-13">暂无时间</div>
                <div class="desc-triangle-one"></div>
              </div>
              <div class="desc-rate">
                <div class="font-size-14">{{ parseInt(item[1]) }}%</div>
                <div class="font-s-12">相似率</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="dataList.length == 0">
        <EmpMini />
      </template>
    </div>
  </div>
</template>

<script>
import EmpMini from "../empMini.vue";
import PubSub from "pubsub-js";
import { imgsurl, bigImgurl } from "@/api/collectionret.js";
import { Message, Loading } from "element-ui";
import { startLoding, endLoding } from "@/request/loading.js";
import TitleTwo from "../basetool/TitleTwo.vue";
import { v4 } from "uuid";
import {
  gyxySubImageInfo,
  queryByImageId,
  queryByImageIdCar,
} from "@/api/collectInfo.js";
export default {
  components: { TitleTwo, EmpMini },
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
      infinitedisabled_rxjs: true,
      isscroll_rxjs: false,
      beiyong_list: [],
    };
  },
  mounted() {
    // this.getDataList(this.queryParams, this.pagesize);
    this.ggp();
    console.log("aaa");
    console.log(this.$props, "props");
  },
  methods: {
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var hour = now.getHours();
      var minu = now.getMinutes();
      var sec = now.getSeconds();

      hour = hour.toString().padStart(2, "0");
      minu = minu.toString().padStart(2, "0");
      sec = sec.toString().padStart(2, "0");
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
      // console.log(yesterdsay)
      // debugger
      return defaultDate;
    },
    async ggp(isall = false) {
      var loading_lo;

      try {
        loading_lo = startLoding(".face123");

        var yesterdsay = this.getNowTime(
          new Date(new Date().getTime() - 86400000 * 90)
        );
        var jkl = this.getNowTime(new Date());

        var res = await gyxySubImageInfo({
          pageNo: 1,
          pageSize: 150,
          type: 11,
          beginTime: yesterdsay,
          endTime: jkl,
          sysOrgCode: "",
          policeCarNumber: "",
        });

        endLoding(loading_lo);

        if (res && res.result) {
          if (res.result.records && res.result.records.length != 0) {
            this.beiyong_list = res.result.records;
            res.result.records.forEach((item, i) => {
              this.dataList = [
                ...this.dataList,
                [item.smallImageUrl, "no", item.createTime, "no"],
              ];
            });
            this.total = res.result.records.length;
          }
        }
      } catch (err) {
        console.log(err, "err====");
        endLoding(loading_lo);

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    //滚动事件
    scrollEvent() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#tabBox-rxjs");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;

      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_rxjs) {
          //debugger;
          if (!ts.queryParams.img_usl) {
            //debugger;
            return;
          }
          ts.isscroll_rxjs = true;
          ts.loasd();
        }
      }
    },
    async lookDetailFace2(item, index) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.beiyong_list.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.beiyong_list.slice(index - 10, index + 10);
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
    //人像大图详情
    async lookDetailFace(url) {
      let res = await bigImgurl({ imageUrl: url });
      if (res && res.result) {
        let item = {};
        item.originImageUrl = this.queryParams.img_usl;
        item.bigImageUrl = res.result.bigImageUrl;
        PubSub.publish("detail_box_type_show", 9);
        PubSub.publish("ret_face_data", item);
      }
    },
    loasd() {
      if (this.queryParams.have_next == "1") {
        this.pageNo = this.pageNo + 1;
        this.getDataList(this.queryParams, this.pageNo);
      }
    },
    async getDataList(params, pageNo = 1) {
      console.log("查询信息", params);
      let that = this;
      this.pageNo = pageNo;
      params.pageNo = pageNo;
      if (!params.img_usl) {
        Message({
          showClose: true,
          message: "请上传图像",
          type: "error",
          duration: 2000,
        });
        return;
      }
      var loading_lo;
      try {
        loading_lo = startLoding(".right-con");
        that.infinitedisabled_rxjs = true;

        //获取数据
        var res = await imgsurl(params);
        if (res && res.result) {
          if (pageNo == 1) {
            that.dataList = res.result.resultList;
          } else {
            that.dataList = [...that.dataList, ...res.result.resultList];
          }
          that.total = res.result.totalCount;
          if (!params.search_id) {
            this.$emit("update_search_id", params.cun_search_id);
          }
          if (res.result.have_next) {
            this.$emit("update_have_next", res.result.have_next);
          }
          if (res.result.resultList.length == 0 && res.result.message) {
            Message({
              showClose: true,
              message: res.result.message,
              type: "error",
              duration: 2000,
            });
          }
        }

        endLoding(loading_lo);
        // if (res.result.resultList.length != params.pageSize) {
        //   that.isscroll_rxjs = true;
        // } else {
        //   that.isscroll_rxjs = false;
        // }
        that.isscroll_rxjs = false;
        that.infinitedisabled_rxjs = false;
      } catch (err) {
        endLoding(loading_lo);
        that.isscroll_rxjs = false;
        that.infinitedisabled_rxjs = false;
        // Message({
        //   showClose: true,
        //   message: "网络异常",
        //   type: "error",
        //   duration: 2000,
        // });
      }
    },

    //图片——鼠标按下
    mouseDown(e, url, name) {
      let disX = e.clientX;
      let disY = e.clientY;
      console.log("disX==", disX);
      console.log("disY==", disY);
      // 鼠标拖动过程
      document.onmousemove = (e) => {
        e.preventDefault();
        // let left = e.clientX;
        // let top = e.clientY;
        // console.log("left==", left);
        // console.log("top==", top);
      };
      // 鼠标松开
      document.onmouseup = (e) => {
        // e.preventDefault();
        let left = e.clientX;
        let top = e.clientY;
        var img = $(".uplodeImgName").offset();
        let imgDivLeft = img.left;
        let imgDivTop = img.top;
        var imgw = $(".uplodeImgName").innerWidth();
        var imgh = $(".uplodeImgName").innerHeight();
        if (
          left < imgDivLeft + imgw &&
          left > imgDivLeft &&
          top < imgDivTop + imgh &&
          top > imgDivTop
        ) {
          console.log("在区间范围内", url);
          this.$emit("changeUploadNew", url, "拖拽图片" + name);
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
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
    // background: #a4f8ff;
    // color: #999999;
    .num {
      color: #02befe;
      font-size: 12px;
    }
  }
  .right-con {
    width: 100%;
    height: calc(100% - 40px); /*no*/
    margin-left: 20px; /*no*/
    overflow-y: scroll;
    .tab-con {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      overflow-y: scroll;

      .tab-item {
        width: 140px; /*no*/
        height: 180px; /*no*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #fff;
        margin: 10px 0 0 12px; /*no*/
        font-size: 0;
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px; /*no*/
            line-height: 16px; /*no*/
            width: 35%;
          }
          .font-s-12 {
            font-size: 12px; /*no*/
          }
        }
      }
    }
  }
  .font-size-14 {
    font-size: 14px; /*no*/
  }
  .font-size-13 {
    font-size: 13px; /*no*/
  }
}
</style>