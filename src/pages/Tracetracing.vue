<template>
  <div class="Tracetracing_v2">
    <Map :guijiList="tracing_list" :gujid="gujid" />

    <div class="left">
      <div class="left-top">
        <div class="title-box">
          <div class="title-item title-btn" @click="fanhui">返回</div>
        </div>
      </div>
      <div class="sj_box">
        <!--<el-date-picker
          v-model="value"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getc"
        >
        </el-date-picker>-->

        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="开始时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getc"
        >
        </el-date-picker>

        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getc"
        >
        </el-date-picker>
      </div>

      <div class="left-bot bg_color_white" id="Tracetracing_bot">
        <template v-if="tracing_list.length != 0">
          <el-timeline>
            <template v-for="(item, i) in tracing_list">
              <el-timeline-item
                :hide-timestamp="true"
                color="rgb(221,221,221)"
                :key="item.id"
              >
                <div
                  class="ch_item"
                  @click="xuanze(item)"
                  :class="item.active ? 'active' : ''"
                >
                  <div class="ch_item-le">
                    <img
                      :src="productionImage(item.smallImageUrl)"
                      alt=""
                      srcset=""
                    />
                  </div>

                  <div class="ch_item-ri">
                    <p>{{ item.plateNumber }}</p>
                    <p class="rk">入库时间：{{ item.createTime }}</p>
                  </div>
                </div>
              </el-timeline-item>
            </template>
          </el-timeline>
        </template>

        <template v-if="tracing_list.length == 0">
          <EmpMini :istarc="true" />
        </template>
      </div>
    </div>
  </div>
</template>          

<script>
import Map from "../components/map.vue";
import { selectCarGp } from "@/api/Tracetracing.js";

import { startLoding, endLoding } from "@/request/loading.js";
import { Message, Loading } from "element-ui";
import { v4 } from "uuid";
import EmpMini from "../components/empMini.vue";
export default {
  name: "Tracetracing",
  data: function () {
    return {
      tracing_list: [],
      gujid: null,
      pcNumber: "",
      pageType: 1, //1:预警页面  2：车牌检索页面
      value: [],
      startTime: "",
      endTime: "",
    };
  },

  activated() {},

  methods: {
    fanhui() {
      if (this.pageType == 2) {
        this.$router.push({
          path: "/collectionRetCar",
        });
      } else if (this.pageType == 3) {
        this.$router.push({
          path: "/index",
        });
      } else {
        this.$router.push({
          path: "/warningInfo",
        });
      }
    },
    // getNowTime(now) {
    //   // var now = new Date();
    //   var year = now.getFullYear(); //得到年份
    //   var month = now.getMonth(); //得到月份
    //   var date = now.getDate(); //得到日期
    //   month = month + 1;
    //   month = month.toString().padStart(2, "0");
    //   date = date.toString().padStart(2, "0");
    //   var defaultDate = `${year}-${month}-${date}`;
    //   // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
    //   // console.log(yesterdsay)
    //   // debugger
    //   return defaultDate;
    // },
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
    xiba() {
      var yesterdsay = this.getNowTime(
        //默认三个月
        new Date(new Date().getTime() - 86400000 * 90)
      );
      var jkl = this.getNowTime(new Date());
      // this.value = [yesterdsay, jkl];
      //console.log(yesterdsay, "默认的开始时间");
      this.startTime = yesterdsay;
      this.endTime = jkl;
    },
    xuanze(item) {
      // item.active=true
      var p = Object.assign({}, item, { change: v4() });
      this.gujid = p;
    },
    async getc() {
      var loading_lo;
      try {
        loading_lo = startLoding("#Tracetracing_bot");
        var res = await selectCarGp({
          pcNumber: this.pcNumber,
          // timeStart: this.value?this.value[0]+' 00:00:00':'',
          // timeEnd: this.value?this.value[1]+' 23:59:59':'',
          timeStart: this.startTime ? this.startTime : "",
          timeEnd: this.endTime ? this.endTime : "",
        });
        endLoding(loading_lo);

        if (res.result && res.result.list) {
          this.tracing_list = [...res.result.list];
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        endLoding(loading_lo);
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    this.pcNumber = this.$route.query.plateNo;
    this.pageType = this.$route.query.pageType;
    this.xiba();
    this.getc();
  },
  components: {
    Map,
    EmpMini,
  },
};
</script>

<style lang='scss' >
.el-date-editor.el-input {
  width: 100%;
}
.el-range-editor.el-input__inner {
  width: 100%;
}
.kaishi {
  margin-bottom: 11px;
}
.mx-datepicker,
.mx-input-wrapper,
.mx-input {
  width: 100%;
  height: 32px;
}
</style>

<style lang="scss">
.el-range-editor.el-input__inner {
  width: 100%;
  height: 100%;
}
.Tracetracing_v2 .el-range-separator {
  height: auto !important;
}
.el-timeline-item__wrapper {
  padding-left: 34px;
  &:focus {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0));
  }

  &:hover {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0));
  }
}
.el-timeline-item__tail {
  left: 17px;
}
.el-timeline-item__node--normal {
  width: 12px;
  height: 12px;
  left: 12px;
}
</style>
          
<style lang="scss" scoped>
.Tracetracing_v2 {
  width: 100%;
  height: 100%;
}
.left {
  position: fixed;
  top: 10%;
  left: 1%;
  width: 18.5%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
}
.title-box {
  background-image: url("../components/basetool/images/title-bg.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
}
.title-item {
  height: 75%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: 500;
  font-size: 14px;
}
.title-btn {
  background-image: url("../components/basetool/images/title-button.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.left-top {
  height: 40px;
}
.sj_box {
  // height: 85px;
}
.left-bot {
  height: calc(100% - 100px);
  overflow-y: scroll;
  padding-top: 17px;
  box-sizing: border-box;
}
.ch_item {
  display: flex;
  &.active {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0));
  }
  .ch_item-le {
    width: 100px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ch_item-ri {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 60px;
    p {
      width: 221px;
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap; //文本不会换行

      &.rk {
        // margin-top:17px ;
      }
    }
  }
}
</style>