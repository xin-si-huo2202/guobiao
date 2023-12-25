<template>
  <div class="cj-box">
    <div class="cj-tab" v-if="type == 1">
      <template v-if="faceList.length != 0">
        <div
          class="cj-tab-item"
          v-for="(item, index) in faceList"
          :key="item.id"
        >
          <el-image
            class="face-img"
            :src="productionImage(item.smallImageUrl)"
            fit="contain"
            @click="lookDetailFace(item, index)"
          >
          </el-image>
        </div>
      </template>

      <template v-if="faceList.length == 0">
        <EmpMini />
      </template>
    </div>
    <div class="cj-tab" v-else>
      <template v-if="cpList.length != 0">
        <div
          class="cjc-tab-item"
          v-for="(item, index) in cpList"
          :key="item.id"
        >
          <div class="image-box">
            <el-image
              :src="productionImage(item.smallImageUrl)"
              fit="contain"
              @click="lookDetailCar(item, index)"
            >
            </el-image>
          </div>
          <div class="name-box">{{ item.carNumber }}</div>
        </div>
      </template>

      <template v-if="cpList.length == 0">
        <EmpMini />
      </template>
    </div>
  </div>
</template>

<script>
import { number } from "echarts";
import EmpMini from "../empMini.vue";
import PubSub from "pubsub-js";
import {
  gyxySubImageInfo,
  queryByImageId,
  queryByImageIdCar,
} from "@/api/collectInfo.js";
import { Message, Loading } from "element-ui";
export default {
  props: ["type"],
  data() {
    return {
      faceList: [],
      cpList: [],
      time: [],
    };
  },
  methods: {
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
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
      this.time = [yesterdsay, jkl];
    },
    async ggp(isall = false) {
      // var loading_lo;

      try {
        // loading_lo = startLoding(".rx_box");

        // this.infinitedisabled_rx = true;

        var res = await gyxySubImageInfo({
          pageNo: 1,
          pageSize: 15,
          type: 11,
          beginTime: this.time[0] + " 00:00:00",
          endTime: this.time[1] + " 23:59:59",
          sysOrgCode: "",
          policeCarNumber: "",
        });

        // endLoding(loading_lo);

        // this.isscroll_rxcj = false;
        // this.infinitedisabled_rx = false;
        if (res && res.result) {
          // this.$emit("rxtotal", res.result.total);
          if (res.result.records) {
            this.faceList = [...this.faceList, ...res.result.records];

            // this.rxList = this.rxList.slice(0,10)
          }
        }
      } catch (err) {
        // endLoding(loading_lo);
        // this.isscroll_rxcj = false;
        // this.infinitedisabled_rx = false;

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async ggp_chepai(isall = false) {
      // var loading_lo;

      try {
        // loading_lo = startLoding(".cp_box");

        // this.infinitedisabled_cp = true;

        var res = await gyxySubImageInfo({
          pageNo: 1,
          pageSize: 15,
          type: 2,
          beginTime: this.time[0] + " 00:00:00",
          endTime: this.time[1] + " 23:59:59",
          sysOrgCode: "",
          policeCarNumber: "",
        });

        // endLoding(loading_lo);

        // this.isscroll_cpcj = false;
        // this.infinitedisabled_cp = false;
        if (res && res.result) {
          // this.$emit("cptotal", res.result.total);
          if (res.result.records) {
            this.cpList = [...this.cpList, ...res.result.records];
          }
        }
      } catch (err) {
        // endLoding(loading_lo);
        // this.isscroll_cpcj = false;
        // this.infinitedisabled_cp = false;

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    getImageList(val) {
      let list = [];
      list.push(val);
      return list;
    },
    //车牌大图详情
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
      // let res = await queryByImageIdCar({ imageId: item.id });
      // if (res && res.result) {
      // item.createTime = res.result.createTime;
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
        newList = this.faceList.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.faceList.slice(index - 10, index + 10);
        newIndex = 10;
      }
      let res = await queryByImageId({ imageId: item.id });
      if (res && res.result) {
        item.genderCode = res.result.genderCode;
        item.age = res.result.age;
        item.createTime = res.result.createTime;
        PubSub.publish("detail_box_type_show", 6);
        PubSub.publish("collect_detail_face_data", {
          item: item,
          listData: newList,
          index: newIndex,
        });
      }
    },
  },
  mounted() {
    PubSub.subscribe("caiji-face", (msg, data) => {
      console.log(data, "采集信息-rx");
      this.faceList = [data, ...this.faceList];
    });

    PubSub.subscribe("caiji-car", (msg, data) => {
      console.log(data, "采集信息-cp");

      this.cpList = [data, ...this.cpList];
    });

    this.xiba();
    this.ggp();
    this.ggp_chepai();
  },
  components: {
    EmpMini,
  },
};
</script>

<style lang="scss" scoped>
.cj-box {
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 1) 80%
  );
  padding-left: 4px;
  box-sizing: border-box;
  .cj-tab {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1;
    height: 100%;
    align-content: flex-start;
    &::after {
      content: "";
      flex: auto;
    }
    .cj-tab-item {
      width: 80px;
      height: 80px;
      margin-left: 4px;
      margin-top: 4px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .image-slot {
        background-image: url("../../assets/image/default-discern-face-collect.svg");
      }
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .cjc-tab-item {
      width: 80px;
      height: 80px;
      margin-left: 4px;
      margin-top: 4px;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      .image-box {
        width: 80px;
        height: 55px;
        background: #eeeeee;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      .name-box {
        width: 100%;
        height: 22px;
        box-sizing: border-box;
        border-left: 1px solid #00beff;
        border-right: 1px solid #00beff;
        border-bottom: 1px solid #00beff;
        background: #eeeeee;
        color: #333;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>