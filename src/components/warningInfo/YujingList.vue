<template>
  <div class="yujingbox-list">
    <div v-show="tabindex == 1 ? true : false" class="rx_box yujing_lp">
      <template v-if="rxList.length != 0">
        <!-- <div class="rx_con" v-infinite-scroll="loasd_rx" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled_rx'> -->

        <div class="rx_con" id="yujinglist-rx" @scroll="scrollEvent_rx">
          <template v-for="item in rxList">
            <div class="meifu rx" :key="item.id">
              <item-box-one
                :dataInfo="item"
                @cp_warn_dingwei_rx="cp_warn_dingwei_rxs"
              ></item-box-one>
            </div>
          </template>
        </div>
      </template>
      <template v-if="rxList.length == 0">
        <EmpMini />
      </template>
    </div>

    <div v-show="tabindex == 2 ? true : false" class="cp_box yujing_lp">
      <template v-if="cpList.length != 0">
        <!-- <div class="rx_con" v-infinite-scroll="loasd_cp" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled_cp'> -->
        <div class="rx_con" id="yujinglist-cp" @scroll="scrollEvent_cp">
          <template v-for="item in cpList">
            <div class="meifu" :key="item.id">
              <item-box-two
                :dataInfo="item"
                @cp_warn_dingwei="cp_warn_dingweis"
              ></item-box-two>
            </div>
          </template>
        </div>
      </template>
      <template v-if="cpList.length == 0">
        <EmpMini />
      </template>
    </div>
    <!-- 手机串号预警 -->
    <div v-show="tabindex == 3 ? true : false" class="ch_box yujing_lp">
      <template v-if="chList.length != 0">
        <!-- <div class="rx_con" v-infinite-scroll="loasd_cp" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled_cp'> -->
        <div class="rx_con" id="yujinglist-ch" @scroll="scrollEvent_ch">
          <template v-for="item in chList">
            <div class="meifu" :key="item.id">
              <ItemBoxThree
                :dataInfo="item"
                @cp_warn_dingweisj="cp_warn_dingweis_shouji"
                @ggp_shouji="ggp_shouji"
              ></ItemBoxThree>
            </div>
          </template>
        </div>
      </template>
      <template v-if="chList.length == 0">
        <EmpMini />
      </template>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { queryAllPoliceAndDev, selectDept } from "@/api/system.js";
import { selectPoliceCarAndDepartment } from "@/api/index.js";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "../empMini.vue";

import { gyxySubImageInfo } from "@/api/collectInfo.js";
import ItemBoxOne from "@/components/basetool/ItemBoxOne.vue";
import ItemBoxTwo from "@/components/basetool/ItemBoxTwo.vue";
import ItemBoxThree from "@/components/basetool/ItemBoxThree.vue";
import {
  gyxyFaceWarning_s,
  gyxyPlateWarning_s,
  getSerialNumberWarning,
} from "@/api/warningInfo.js";
export default {
  name: "YujingList",
  props: [
    "tabindex",
    "sysOrgCode",
    "policeCarNumber",
    "selectType",
    "chongzhi",
    "change",
    "startTime",
    "endTime",
  ],
  data() {
    return {
      rxList: [],

      cpList: [],
      //
      chList: [],

      pageNo_rx: 1,

      pageNo_cp: 1,
      //
      pageNo_ch: 1,

      infinitedisabled_rx: true,

      infinitedisabled_cp: true,
      //串号
      infinitedisabled_ch: true,

      isscroll_rx: false,

      isscroll_cp: false,
      //串号
      isscroll_ch: false,
    };
  },
  destroyed() {},
  watch: {
    tabindex: {
      handler(newss, old) {
        if (newss == 1) {
          this.infinitedisabled_rx = false;
          //手机串号
          this.infinitedisabled_ch = false;
          this.infinitedisabled_cp = true;
        } else if (newss == 2) {
          this.infinitedisabled_cp = false;
          //手机串号
          this.infinitedisabled_ch = false;
          this.infinitedisabled_rx = true;
        } else {
          //手机串号
          this.infinitedisabled_cp = false;
          this.infinitedisabled_rx = false;
          this.infinitedisabled_ch = true;
        }
        this.resets();
      },

      immediate: false,
    },
    selectType: {
      handler(newss, old) {
        this.resets();
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
        this.resets();
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
    chongzhi: {
      handler(newss, old) {
        this.resets(true);
      },

      immediate: false,
    },
  },
  methods: {
    scrollEvent_rx() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#yujinglist-rx");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_rx) {
          ts.isscroll_rx = true;
          ts.loasd_rx();
        }
      }
    },
    scrollEvent_cp() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#yujinglist-cp");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_cp) {
          ts.isscroll_cp = true;
          ts.loasd_cp();
        }
      }
    },
    //串号预警
    scrollEvent_ch() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#yujinglist-ch");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_ch) {
          ts.isscroll_ch = true;
          ts.loasd_ch();
        }
      }
    },
    //父子通信
    cp_warn_dingweis(data) {
      this.$emit("cp_warn_dingweis", data);
    },
    cp_warn_dingwei_rxs(data) {
      this.$emit("cp_warn_dingwei_rxs", data);
    },
    cp_warn_dingweis_shouji(data) {
      this.$emit("cp_warn_dingweis_shouji", data);
    },
    loasd_rx() {
      this.pageNo_rx = this.pageNo_rx + 1;

      this.ggp();
    },
    loasd_cp() {
      this.pageNo_cp = this.pageNo_cp + 1;

      this.ggp_chepai();
    },
    //串号
    loasd_ch() {
      this.pageNo_ch = this.pageNo_ch + 1;

      this.ggp_shouji();
    },
    resets(isall = false) {
      if (this.tabindex == 1) {
        this.pageNo_rx = 1;
        this.rxList = [];
        this.ggp(isall);
      } else if (this.tabindex == 2) {
        this.pageNo_cp = 1;
        this.cpList = [];
        this.ggp_chepai(isall);
      } else {
        this.pageNo_ch = 1;
        this.chList = [];
        this.ggp_shouji(isall);
      }
    },

    async ggp(isall = false) {
      var loading_lo;

      try {
        loading_lo = startLoding(".yujing_lp");

        this.infinitedisabled_rx = true;

        var res = await gyxyFaceWarning_s({
          pageNo: this.pageNo_rx,
          pageSize: 20,
          selectType: this.selectType,
          departId: isall ? "" : this.sysOrgCode,
          fromCar: isall ? "" : this.policeCarNumber,
          timeStart: this.startTime ? this.startTime : "",
          timeEnd: this.endTime ? this.endTime : "",
        });
        console.log(res, "==============预警信息");
        endLoding(loading_lo);

        this.infinitedisabled_rx = false;
        if (res && res.result) {
          this.$emit("rxtotal", res.result.total);

          this.rxList = [...this.rxList, ...res.result.records];

          this.rxList = this.deteleObject(this.rxList);

          this.isscroll_rx = false;
        }
      } catch (err) {
        endLoding(loading_lo);
        this.infinitedisabled_rx = false;

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
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
    //手机串号
    async ggp_shouji(isall = false) {
      console.log("父子通信");
      var loading_lo;

      try {
        loading_lo = startLoding(".yujing_lp");
        console.log("手机串号功能执行");
        this.infinitedisabled_ch = true;
        var res = await getSerialNumberWarning({
          pageNo: this.pageNo_ch,
          pageSize: 20,
          selectType: this.selectType,
          departId: isall ? "" : this.sysOrgCode,
          fromCar: isall ? "" : this.policeCarNumber,
          timeStart: this.startTime ? this.startTime : "",
          timeEnd: this.endTime ? this.endTime : "",
        });
        console.log(res, "=======手机串号==========");
        endLoding(loading_lo);

        this.infinitedisabled_ch = false;
        if (res && res.result) {
          this.$emit("chtotal", res.result.total);

          this.chList = [...this.chList, ...res.result.records];

          this.chList = this.deteleObject(this.chList);

          this.isscroll_ch = false;
        }
        console.log(this.chList, "手机串号预警列表，滚动累加");
      } catch (err) {
        endLoding(loading_lo);
        this.infinitedisabled_ch = false;

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
        loading_lo = startLoding(".yujing_lp");

        this.infinitedisabled_cp = true;

        var res = await gyxyPlateWarning_s({
          pageNo: this.pageNo_cp,
          pageSize: 20,
          selectType: this.selectType,
          departId: isall ? "" : this.sysOrgCode,
          fromCar: isall ? "" : this.policeCarNumber,
          timeStart: this.startTime ? this.startTime : "",
          timeEnd: this.endTime ? this.endTime : "",
        });

        endLoding(loading_lo);

        this.infinitedisabled_cp = false;
        if (res && res.result) {
          this.$emit("cptotal", res.result.total);

          this.cpList = [...this.cpList, ...res.result.records];

          this.cpList = this.deteleObject(this.cpList);

          this.isscroll_cp = false;
        }
      } catch (err) {
        console.log(err, "shdcohsachk");
        endLoding(loading_lo);
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
    ItemBoxOne,
    ItemBoxTwo,
    ItemBoxThree,
  },
};
</script>

<style lang='scss' scoped>
.yujingbox-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.rx_box,
.cp_box,
.ch_box {
  width: 99%;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;

  .rx_con {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    // display: flex;

    // flex-wrap: wrap;
    .rx_item {
      width: 130px;
      margin-top: 10px;
      float: left;
      margin-left: 10px;
      margin-right: 10px;
      .jkl {
        width: 100%;
        height: 130px;
        display: block;
      }
      .time {
        border: 1px solid #78b6ee; /*no*/
        border-top: none;
        margin-top: 4px;
        width: 100%;
        padding-left: 5px;
        padding-right: 5px;
        box-sizing: border-box;
        text-align: center;
        line-height: 34px;
        span {
          color: #00beff;
          font-size: 12px;
        }
      }
    }
  }
}

.meifu {
  width: 840px;
  height: 210px;
  margin-top: 10px;
  float: left;
  margin-left: 15px;
  margin-right: 5px;
  overflow: hidden;
  &.rx {
    height: 280px;
  }
}

@media screen and (max-width: 1200px) {
  .meifu {
    max-width: 415px; /*no*/
  }
}
</style>
