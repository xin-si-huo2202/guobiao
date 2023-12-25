<template>
  <div class="index_container padding-21">
    <div class="zhaiwei"></div>
    <div class="con">
      <div class="index_cont">
        <div class="cont-line">
          <div class="line-left">
            <div class="title-box">
              <title-two title="布控信息"></title-two>
            </div>
            <div class="statis-box bk-load csc">
              <bar
                :barName="list1Name"
                :barVal="list1Val"
                v-if="list1Val"
              ></bar>

              <!-- <template v-if="list1Val">
              <template v-for="(val, key) in list1Val">
                <div class="biaog">
                  <label>
                    <span> {{ key }} </span>
                  </label>
                  <p>
                    <span>{{ val }}</span>
                  </p>
                </div>
              </template>
            </template> -->

              <template v-if="!list1Val">
                <EmpMini :istarc="true" />
              </template>
            </div>
          </div>
          <div class="line-center">
            <div class="title-box">
              <title-two title="采集数量走势"></title-two>
            </div>
            <div class="static-cj">
              <div
                class="static-cj-box"
                :class="cjType == 1 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCJInfo(1)"
              >
                本年度
              </div>
              <div
                class="static-cj-box"
                :class="cjType == 2 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCJInfo(2)"
              >
                近一月
              </div>
              <div
                class="static-cj-box"
                :class="cjType == 3 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCJInfo(3)"
              >
                今日
              </div>
            </div>
            <div class="statis-box statis-box1 cj-num-load">
              <lines
                :barName="list5Name"
                :barVal="list5Val"
                :barVal2="list5Val2"
              ></lines>
            </div>
          </div>
          <div class="line-right">
            <div class="title-box">
              <title-two title="预警信息"></title-two>
            </div>
            <div class="statis-box yj-load">
              <bar
                :barName="list2Name"
                :barVal="list2Val"
                v-if="list2Val"
              ></bar>

              <!-- <template>
              <template v-for="(val, key) in list2Val">
                <div class="biaog">
                  <label>
                    <span> {{ key }} </span>
                  </label>
                  <p>
                    <span>{{ val }}</span>
                  </p>
                </div>
              </template>
            </template> -->

              <template v-if="!list2Val">
                <EmpMini :istarc="true" />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="index_cont">
        <div class="cont-line">
          <div class="line-all">
            <div class="title-box">
              <title-two title="车辆时长统计"></title-two>
            </div>
            <div class="static-cj">
              <div
                class="static-cj-box"
                :class="scType == 3 ? 'cj-sel' : 'cj-no-sel'"
                @click="getSCInfo(3)"
              >
                本年度
              </div>
              <div
                class="static-cj-box"
                :class="scType == 2 ? 'cj-sel' : 'cj-no-sel'"
                @click="getSCInfo(2)"
              >
                本月
              </div>
              <div
                class="static-cj-box"
                :class="scType == 1 ? 'cj-sel' : 'cj-no-sel'"
                @click="getSCInfo(1)"
              >
                昨日
              </div>
            </div>
            <div class="statis-box statis-box1 sc-num-load">
              <BarTime
                :barName="barNameTime"
                :barVal="barValTime"
                v-if="barValTime && barValTime.length > 0"
              ></BarTime>
            </div>
          </div>
        </div>
      </div>
      <div class="index_cont">
        <div class="cont-line">
          <div class="line-all">
            <div class="title-box">
              <title-two title="车辆采集统计"></title-two>
            </div>
            <div class="static-cj">
              <div
                class="static-cj-box"
                :class="clType == 4 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCLInfo(4)"
              >
                近一年
              </div>
              <div
                class="static-cj-box"
                :class="clType == 3 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCLInfo(3)"
              >
                近一月
              </div>
              <div
                class="static-cj-box"
                :class="clType == 1 ? 'cj-sel' : 'cj-no-sel'"
                @click="getCLInfo(1)"
              >
                今日
              </div>
            </div>
            <div class="statis-box statis-box1 sc-cl-load">
              <BarCaiJi
                :barName="barNameCJ"
                :barValOne="barValCJOne"
                :barVal="barValCJ"
                v-if="barValCJ && barValCJ.length > 0"
              ></BarCaiJi>
            </div>
          </div>
        </div>
      </div>
      <div class="index_cont">
        <div class="cont-line">
          <div class="line-all">
            <div class="title-box">
              <title-two title="采集排名"></title-two>
            </div>

            <div class="statis-box statis-box1">
              <bar
                :barName="list3Name"
                :barVal="list3Val"
                v-if="list3Val"
              ></bar>
              <template v-if="!list3Val">
                <EmpMini :istarc="true" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import Bar from "@/components/Statistics/newecharts/bar.vue";
import Lines from "@/components/Statistics/newecharts/Line.vue";
import BarLine from "@/components/Statistics/newecharts/BarLine.vue";
import Pie3D from "@/components/Statistics/newecharts/Pie3D.vue";
import BarTime from "@/components/Statistics/newecharts/barTime.vue";
import BarCaiJi from "@/components/Statistics/newecharts/BarCaiJi.vue";
import EmpMini from "../components/empMini.vue";
import { startLoding, endLoding } from "@/request/loading.js";
import {
  carRanking,
  deptRanking,
  queryCountYearAll,
  queryCountMonthAll,
  queryCountDayAll,
  selectCarStatus,
  selectDeployCount,
  selectWarningCount,
  carOnlineCount,
  listCL,
} from "@/api/statistic.js";
export default {
  name: "index",
  components: {
    TitleTwo,
    Bar,
    BarLine,
    Lines,
    Pie3D,
    EmpMini,
    BarTime,
    BarCaiJi,
  },
  data() {
    return {
      barNameTime: [],
      barValTime: [],
      barNameCJ: [],
      barValCJ: [],
      barValCJOne: [],
      list1Name: [],
      list1Val: null,

      list2Name: [],
      list2Val: null,

      list3Name: [],
      list3Val: [],

      list4Name: [],
      list4Val: null,

      list5Name: [],
      list5Val: [],
      list5Val2: [],
      yearDataX: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      cjType: 1, //1:本年度  2：近一月  3：今日
      scType: 3, //1:当日  2：近一月  3：本年
      clType: 4, //1:当日  3：近一月  4：本年
      isalready: false,
      list6: [
        {
          name: "累计出勤次数",
          value: 0,
          itemStyle: {
            color: "#81b9f0",
            opacity: 0.8,
          },
        },

        {
          name: "在线车辆",
          value: 0,
          itemStyle: {
            color: "#f4ca6e",
            opacity: 0.8,
          },
        },
        {
          name: "离线车辆",
          value: 0,
          itemStyle: {
            color: "#5161c6",
            opacity: 0.8,
          },
        },
        {
          name: "异常车辆",
          value: 0,
          itemStyle: {
            color: "#9a68e3",
            opacity: 0.8,
          },
        },
      ],
      month: "",
      dayNum: 0,
    };
  },
  activated() {
    PubSub.publish("nmhead");
  },
  created() {
    PubSub.publish("jc_header_show", true);
    let data = new Date();
    this.month = data.getMonth() + 1;
    this.dayNum = new Date(
      data.getFullYear(),
      data.getMonth() + 1,
      0
    ).getDate();
    this.getList1();
    this.getList2();
    this.getTimeData();
    this.getList3();
    this.getList4();
    this.getList5();
    this.getList6();
    this.getList7();
  },
  methods: {
    async getList1() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".bk-load");
        var res = await selectDeployCount();

        console.log("测试",res.result,"测试");
        if (res && res.result) {
          let listName = [];
          let listVal = [];
          for (var k in res.result) {
            listName.push(k);
            listVal.push(res.result[k]);
          }
          that.list1Name = listName;
          that.list1Val = listVal;
        }
        // that.list1Val = res.result;
        endLoding(loading_lo);
      } catch (err) {
        that.list1Val = null;
        endLoding(loading_lo);
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async getList2() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".yj-load");
        var res = await selectWarningCount();

        if (res && res.result) {
          let listName = [];
          let listVal = [];
          for (var k in res.result) {
            listName.push(k);
            listVal.push(res.result[k]);
          }
          that.list2Name = listName;
          that.list2Val = listVal;
        }
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        that.list2Val = null;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    getCLInfo(val) {
      this.clType = val;
      this.getList7();
    },
    async getList7() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".sc-cl-load");
        // let param = new FormData();
        // param.append("radio", this.clType);
        let res = await listCL({ radio: this.clType });
        let barNameTimeArr = [];
        let barValTimeArr = [];
        let barValTimeArrOne = [];
        // for (var i = 0; i < 50; i++) {
        //   barNameTimeArr.push("豫R12345" + i);
        //   barValTimeArr.push(parseInt(Math.random() * 10000));
        //   barValTimeArrOne.push(parseInt(Math.random() * 10020));
        // }
        if (res.code == 200) {
          res.result.forEach((item) => {
            barNameTimeArr.push(item.carNumber);
            barValTimeArr.push(item.imgPlateCount);
            barValTimeArrOne.push(item.imgFaceCount);
          });
        }
        that.barNameCJ = barNameTimeArr;
        that.barValCJ = barValTimeArr;
        that.barValCJOne = barValTimeArrOne;
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        that.barNameCJ = null;
        that.barValCJ = null;
        that.barValCJOne = null;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    getSCInfo(val) {
      this.scType = val;
      this.getTimeData();
    },
    async getTimeData() {
      var loading_lo;
      var that = this;
      console.log(this.scType);
      try {
        loading_lo = startLoding(".sc-num-load");
        let param = new FormData();
        param.append("dateType", this.scType);
        var res = await carOnlineCount(param);
        let barNameTimeArr = [];
        let barValTimeArr = [];
        // for (var i = 0; i < 50; i++) {
        //   barNameTimeArr.push("豫R12345" + i);
        //   barValTimeArr.push(parseInt(Math.random() * 10000));
        // }
        if (res.code == 200) {
          res.result.forEach((item) => {
            barNameTimeArr.push(item.carNumber);
            barValTimeArr.push(item.onlineCount);
          });
        }
        console.log("that.list1Name ", barNameTimeArr);
        console.log("that.list1Val ", barValTimeArr);

        that.barNameTime = barNameTimeArr;
        that.barValTime = barValTimeArr;
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        that.barNameTime = null;
        that.barValTime = null;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async getList3() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".bm-num-load");
        var res = await deptRanking();

        if (res && res.result) {
          let listName = [];
          let listVal = [];
          res.result.forEach((item) => {
            listName.push(item.departName);
            listVal.push(item.imgCount);
          });
          that.list3Name = listName;
          that.list3Val = listVal;
        }
        // that.list3Val = res.result;
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        that.list3Val = null;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async getList4() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".car-num-load");
        var res = await carRanking();
        endLoding(loading_lo);

        // if (res && res.result) {
        //   let listName = [];
        //   let listVal = [];
        //   res.result.forEach((item) => {
        //     listName.push(item.departName + "-" + item.carNumber);
        //     listVal.push(item.imgCount);
        //   });
        //   that.list4Name = listName;
        //   that.list4Val = listVal;
        // }

        that.list4Val = res.result;
      } catch (err) {
        endLoding(loading_lo);
        that.list4Val = null;
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },

    getCJInfo(val) {
      this.cjType = val;
      this.getList5();
    },
    async getList5() {
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".cj-num-load");
        var res = null;
        if (this.cjType == 1) {
          res = await queryCountYearAll();
        } else if (this.cjType == 2) {
          res = await queryCountMonthAll();
        } else {
          res = await queryCountDayAll();
        }
        endLoding(loading_lo);

        if (res && res.result) {
          let listName = [];
          let listVal = [];
          let listVal2 = []; //车牌
          let carList = res.result.requestPtYearCounts;
          let faceList = res.result.requestCarYearCounts;
          //获取本月天数
          console.log("获取本月天数===", this.dayNum);
          if (carList.length == 0 && faceList.length == 0) {
            if (this.cjType == 1) {
              listName = that.yearDataX;
              for (let i = 0; i < 12; i++) {
                listVal.push(0);
                listVal2.push(0);
              }
            } else if (this.cjType == 2) {
              for (let i = 1; i < this.dayNum + 1; i++) {
                listName.push(that.month + "-" + i);
                listVal.push(0);
                listVal2.push(0);
              }
            } else {
              for (let i = 0; i < 24; i++) {
                listName.push(i + "点");
                listVal.push(0);
                listVal2.push(0);
              }
            }
          } else if (carList.length == 0 && faceList.length > 0) {
            if (this.cjType == 1) {
              for (let i = 0; i < 12; i++) {
                listVal2.push(0);
              }
            } else if (this.cjType == 2) {
              for (let i = 0; i < this.dayNum; i++) {
                listVal2.push(0);
              }
            } else {
              for (let i = 0; i < 24; i++) {
                listVal2.push(0);
              }
            }
            faceList.forEach((item) => {
              listName.push(item.xaxis);
              listVal.push(item.yaxis);
            });
          } else if (carList.length > 0 && faceList.length == 0) {
            if (this.cjType == 1) {
              for (let i = 0; i < 12; i++) {
                listVal.push(0);
              }
            } else if (this.cjType == 2) {
              for (let i = 0; i < this.dayNum; i++) {
                listVal.push(0);
              }
            } else {
              for (let i = 0; i < 24; i++) {
                listVal.push(0);
              }
            }
            carList.forEach((item) => {
              listName.push(item.xaxis);
              listVal2.push(item.yaxis);
            });
          } else {
            carList.forEach((item) => {
              listName.push(item.xaxis);
              listVal2.push(item.yaxis);
            });
            faceList.forEach((item) => {
              listVal.push(item.yaxis);
            });
          }
          this.list5Name = listName;
          this.list5Val = listVal;
          this.list5Val2 = listVal2;
        }
      } catch (err) {
        endLoding(loading_lo);
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    async getList6() {
      var loading_lo;
      var that = this;

      try {
        loading_lo = startLoding(".cj-num-load");
        var res = null;
        res = await selectCarStatus();
        endLoding(loading_lo);

        if (res && res.result) {
          that.isalready = true;
          that.ljcqNum = that.numberChange(res.result[0].累计出勤次数);
          that.dqzxjcNum = that.numberChange(res.result[0].在线车辆);
          that.dqlxjcNum = that.numberChange(res.result[0].离线车辆);
          that.jcsbycNum = that.numberChange(res.result[0].异常车辆);
          let listNum = that.list6;
          listNum[0].value = res.result[0].累计出勤次数;
          listNum[1].value = res.result[0].在线车辆;
          listNum[2].value = res.result[0].离线车辆;
          listNum[3].value = res.result[0].异常车辆;
          that.list6 = listNum;
        }
      } catch (err) {
        endLoding(loading_lo);
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },

    numberChange(value) {
      let result = value;
      if (value >= 10000) {
        result = (value / 10000).toFixed(1) + "万";
      } else if (value > 10000000) {
        result = (value / 10000000).toFixed(1) + "千万";
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.line-left {
  height: 100%;
  width: 28%;
}
.line-center {
  height: 100%;
  width: 45%;
}
.line-center {
  height: 100%;
  width: 45%;
}
.line-all {
  height: 100%;
  width: 98%;
}
.line-right {
  height: 100%;
  width: 28%;
}
.yj-load {
  .biaog {
    height: calc((100% - 40px) / 4) !important;
  }
}
.biaog {
  display: flex;

  height: calc((100% - 40px) / 5);
  label {
    width: 50%;
    height: 100%;
    align-items: center;
    display: flex;
    border: 1px solid #eee;
  }
  p {
    width: 50%;
    height: 100%;
    align-items: center;
    display: flex;
    border: 1px solid #eee;
  }
  span {
    margin-left: 20px;
    color: #00beff;
  }
}
.csc {
  // justify-content:"space-between"
  display: flex;
  flex-direction: column;
}
.index_container {
  width: 100%;
  height: 100%;
  background: #fff;
}
.padding-21 {
  padding: 0 21px;
  box-sizing: border-box;
}
.border {
  border: 1px solid red;
  box-sizing: border-box;
}
.zhaiwei {
  height: 9%;
}
.con {
  height: 91%;
  width: 100%;
  overflow-y: scroll;
}
.index_cont {
  height: 50%;
  padding-top: 10px;
  box-sizing: border-box;
}
.cont-line {
  display: flex;
  // grid-template-columns: 28% 45% 28%;
  height: 100%;
  .title-box {
    height: 40px;
    width: 100%;
  }
  .cq-box {
    position: relative;
  }
  .statis-box {
    height: calc(100% - 40px);
    margin-top: 0px;
    width: 100%;
    // overflow-y: scroll;
    .static-cq-box {
      width: 148px;
      height: 63px;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-top: 9px;
      padding-bottom: 6px;
      box-sizing: border-box;
      font-size: 18px;
      color: #00beff;
      font-weight: 500;
      z-index: 1;
      background-image: url("../assets/image/statistic/statistics-box-bg.svg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .cq-box-one {
      top: 20px;
      left: 31px;
    }
    .cq-box-two {
      top: 20px;
      right: 31px;
    }
    .cq-box-three {
      bottom: 20px;
      left: 31px;
    }
    .cq-box-four {
      bottom: 20px;
      right: 31px;
    }
  }
  .statis-box1 {
    height: calc(100% - 100px);
    margin-top: 0px;
  }
  .static-cj {
    width: 90%;
    height: 33px;
    padding: 3px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    .static-cj-box {
      width: 83px;
      height: 33px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      margin-right: 20px;
    }
    .cj-sel {
      background-image: url("../assets/image/statistic/statistics-button-a.svg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
    .cj-no-sel {
      background-image: url("../assets/image/statistic/statistics-button.svg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #00beff;
    }
  }
}
</style>
