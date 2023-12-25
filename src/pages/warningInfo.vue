<template>
  <div class="Map-Video">
    <Map
      :chepaiwarn="chepaiwarn"
      :chepaiwarn_rx="chepaiwarn_rx"
      :chepaiwarn_sj="chepaiwarn_sj"
    />

    <div class="left">
      <div class="left_top-leibie">
        <div class="maidai">
          <TitleTwo title="预警类别" />
        </div>

        <div class="left_top-leibie-bot bg_color_white">
          <div
            @click="qie(1)"
            class="leibie-item"
            :class="tabs == 1 ? ' active' : ''"
          >
            人像预警
          </div>

          <div
            @click="qie(2)"
            class="leibie-item"
            :class="tabs == 2 ? ' active' : ''"
          >
            车牌预警
          </div>
          <div
            @click="qie(3)"
            class="leibie-item"
            :class="tabs == 3 ? ' active' : ''"
          >
            串号预警
          </div>
        </div>
      </div>

      <div class="left_top-zhuangtai">
        <div class="maidai">
          <TitleTwo title="当前警情状态" />
        </div>

        <div class="left_top-leibie-bot bg_color_white">
          <div
            @click="typeChange('')"
            :class="selectType == '' ? 'active' : ''"
            class="zt_tab"
          >
            全部
          </div>
          <div
            @click="typeChange(1)"
            :class="selectType == 1 ? 'active' : ''"
            class="zt_tab"
          >
            未接警
          </div>
          <div
            @click="typeChange(2)"
            :class="selectType == 2 ? 'active' : ''"
            class="zt_tab"
          >
            已接警
          </div>
          <div
            @click="typeChange(3)"
            :class="selectType == 3 ? 'active' : ''"
            class="zt_tab"
          >
            已反馈
          </div>
        </div>
      </div>

      <div class="left_top-date">
        <div class="maidai">
          <TitleTwo title="预警日期" />
        </div>

        <div class="left_top-date-bot bg_color_white time-box">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-top: 10px"
            v-model="endTime"
            type="datetime"
            placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="left_mid">
        <div class="maidai">
          <TitleTwo title="预警单位" />
        </div>

        <div class="left_mid_bot">
          <DepTree @getDeptDatas="getDeptDatas" />
        </div>
      </div>
      <div class="left_bot">
        <div class="maidai">
          <TitleTwo title="预警警车" />
        </div>

        <div class="left_bot_bot">
          <JcList @song="songs" @clear_jcid="clear_jcids" :detid="detid" />
        </div>
      </div>
    </div>

    <div class="videowarp">
      <div class="videowarp-bot">
        <div class="videowarp-left-box"></div>

        <div class="Map-Video--left">
          <!--<img
            :src="require('@/assets/image/flexible-button.svg')"
            class="videowarp-left"
            @click="yidong(2)"
          />-->

          <div class="videowarp-left" @click="yidong(2)">返回</div>

          <div class="warningInfo-top">
            <template v-if="tabs == 1">
              <!-- <TitleThree :title="rxtotal" /> -->
              <title-two>
                <p>共计：</p>
                <p class="num">{{ rxtotal }}条</p>
              </title-two>
            </template>
            <template v-if="tabs == 2">
              <!-- <TitleThree :title="cptotal" /> -->
              <title-two>
                <p>共计：</p>
                <p class="num">{{ cptotal }}条</p>
              </title-two>
            </template>
            <template v-if="tabs == 3">
              <!-- <TitleThree :title="cptotal" /> -->
              <title-two>
                <p>共计：</p>
                <p class="num">{{ chtotal }}条</p>
              </title-two>
            </template>
          </div>
          <div class="warningInfo-bot bg_color_white">
            <div class="warningInfo-bot-x">
              <YujingList
                @cp_warn_dingweis="cp_warn_dingweis"
                @cp_warn_dingwei_rxs="cp_warn_dingwei_rxs"
                @cp_warn_dingweis_shouji="cp_warn_dingweis_shouji"
                @rxtotal="rxtotals"
                :chongzhi="chongzhi"
                :change="change"
                @cptotal="cptotals"
                @chtotal="chtotals"
                :tabindex="tabs"
                :sysOrgCode="sysOrgCodes"
                :selectType="selectType"
                :policeCarNumber="jcid"
                :startTime="startTime"
                :endTime="endTime"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import crypto from "crypto";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";

import CusPlayer from "./CusPlayer";
import Map from "../components/map.vue";

import DepTree from "../components/depTree.vue";

import EmpMini from "../components/empMini.vue";

import JcList from "../components/jcList.vue";

import TitleTwo from "../components/basetool/TitleTwo.vue";

import TitleThree from "../components/basetool/TitleThree.vue";

import YujingList from "../components/warningInfo/YujingList.vue";
import { v4 } from "uuid";
export default {
  name: "warningInfo",
  data() {
    return {
      startTime: "",

      endTime: "",
      tabs: 1,

      detid: "",

      jcid: "",

      startTime: "",

      endTime: "",

      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },

      rxtotal: 0,

      cptotal: 0,
      chtotal: 0,

      selectType: "",

      sysOrgCodes: "",

      chongzhi: "",

      chepaiwarn: "",
      chepaiwarn_sj: "",
      chepaiwarn_rx: "",
      change: "",
    };
  },
  destroyed() {},
  watch: {},
  methods: {
    qie(type) {
      this.tabs = type;

      $(".videowarp").animate({ right: 0 + "px" });
    },
    typeChange(state) {
      this.selectType = state;

      //console.log("right位置信息", $(".videowarp").css("right"));
      let right_value = $(".videowarp").css("right");
      if (right_value != 0) {
        $(".videowarp").animate({ right: 0 + "px" });
      }
    },
    cp_warn_dingwei_rxs(data) {
      this.yidong(2);
      var p = Object.assign({}, data, { change: v4() });
      console.log(p, "父子通信11111");
      this.chepaiwarn_rx = p;
    },
    cp_warn_dingweis(data) {
      this.yidong(2);
      var p = Object.assign({}, data, { change: v4() });
      console.log(p, "父子通信22222");
      this.chepaiwarn = p;
    },
    //手机串号
    cp_warn_dingweis_shouji(data) {
      this.yidong(2);
      var p = Object.assign({}, data, { change: v4() });
      console.log(p, "父子通信22222");
      this.chepaiwarn_sj = p;
    },
    rxtotals(data) {
      this.rxtotal = data;

      sessionStorage.setItem("yujingnum", this.rxtotal);
    },
    cptotals(data) {
      this.cptotal = data;
    },
    chtotals(data) {
      this.chtotal = data;
    },
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var hour = now.getHours();
      var minu = now.getMinutes();
      var sec = now.getSeconds();
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");

      hour = hour.toString().padStart(2, "0");
      minu = minu.toString().padStart(2, "0");
      sec = sec.toString().padStart(2, "0");
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
      this.startTime = yesterdsay;
      this.endTime = jkl;
    },
    clear_jcids() {
      // var p = Object.assign({}, {}, {change: v4()})

      // this.sysOrgCodes = ''
      // this.jcid=''

      this.chongzhi = v4();
    },
    songs(data) {
      this.jcid = data.carNumber;
      this.change = data.change;

      this.sysOrgCodes = "";
    },
    getDeptDatas(data) {
      this.detid = data.id;

      this.sysOrgCodes = data.id;

      this.jcid = "";
      this.change = data.change;

      // console.log(this.detid)
    },
    //抽屉效果   1==向下，  2==向右
    yidong(type) {
      if (type == 1) {
        var topnum = $(".videowarp-bot").height();
        topnum = (topnum * 75) / 100;

        var topxian = $(".videowarp").position().top;

        var apphei = ($("#app").height() * 10) / 100;
        if (topxian > apphei) {
          $(".videowarp").animate({ top: apphei + "px" });
        } else {
          $(".videowarp").animate({ top: topxian + topnum + "px" });
        }
      } else {
        var leftnum = $(".videowarp-bot").width();

        var leftarrowwid = $(".videowarp-left").height();

        leftnum = leftnum - leftarrowwid;

        var rightxian = $(".videowarp").css("right");

        if (rightxian == "0px") {
          $(".videowarp").animate({ right: -leftnum + "px" });
        } else {
          $(".videowarp").animate({ right: 0 + "px" });
        }
      }
    },
  },

  activated() {
    PubSub.publish("nmhead");
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    this.xiba();

    PubSub.subscribe("warn_rx", (msg, data) => {
      this.yidong(2);
    });

    PubSub.subscribe("warn_cp", (msg, data) => {
      this.yidong(2);
    });
    PubSub.subscribe("warn_ch", (msg, data) => {
      this.yidong(2);
    });
    PubSub.subscribe("qx_tan", (msg, data) => {
      this.yidong(2);
    });
  },
  components: {
    Map,
    DepTree,
    EmpMini,
    JcList,
    TitleTwo,
    TitleThree,
    YujingList,
    DatePicker,
  },
};
</script>

<style lang='scss' >
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



<style lang='scss' scoped>
.left_top-leibie {
  width: 100%;
  height: 100px;
  padding-bottom: 10px;
}
.left_top-zhuangtai {
  width: 100%;
  height: 100px;
  padding-bottom: 10px;
}
.left_top-date {
  width: 100%;
  padding-bottom: 10px;
  //   height: 92px;
}
.nodata {
  width: 100%;
  height: 100%;
}
.tit {
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.Map-Video {
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .Map-Video--left {
    width: 97.9%;
    height: 100%;

    position: relative;
    .Map-Video--Video {
      width: 100%;
      height: 100%;
      // background: #001854;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
    }
    .Map-VideoImage {
      width: 100%;
      height: calc(15% - 10px);
      display: flex;
    }
    .Map-Video--image {
      width: calc(100% - 10px);
      margin-top: 10px;
      height: 100%;
      padding: 10px 10px;
      background: #001854;
      box-sizing: border-box;
      white-space: nowrap;

      overflow: hidden;
      position: relative;
      .face-image {
        width: 68px;
        height: 68px;
        background: url("../assets/image/autoMap/face-gather.png");
        background-repeat: no-repeat;
        // background-size: 100% 100%;
        // z-index: 11;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -34px;
        margin-left: -34px;
      }
      .car-image {
        width: 68px;
        height: 68px;
        background: url("../assets/image/autoMap/Licenseplate-gather.png");
        background-repeat: no-repeat;
        // background-size: 100% 100%;
        // z-index: 11;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -34px;
        margin-left: -34px;
      }
      i {
        width: 40px;
        height: 40px;
        line-height: 40px;
        z-index: 111;
        color: cornsilk;
        font-size: 18px;
        background: #000;
        opacity: 0.5;
        text-align: center;
        border-radius: 50%;
        margin: auto;
        display: none;
      }
      .viewer {
        width: 100%;
        height: 100%;
        padding: 10px;
        // background: #001854;
        box-sizing: border-box;
      }
      .Map-Video--imageconter {
        // float: left;
        width: 10.3%;
        height: 100%;
        color: #fff;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: inline-block;
        border: 1px solid #2a9de6; /*no*/
        box-sizing: border-box;
        .el-image {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .Map-Video--imageconter:nth-child(2n) {
        margin: 0 10px;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      &:first-child {
        margin-right: 5px;
      }
    }
    .Map-Video--image:hover {
      i {
        display: block;
      }
    }
    .zd-border-video {
      border: 1px solid #fff; /*no*/
      box-sizing: border-box;
    }
  }
  .Map-Video--right {
    // width: 20%;
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    .Map-Video--rightbtn {
      width: 100%;
      color: #fff;
      font-size: 14px;
      // padding: 10px 0;
      background: #001854;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      i {
        font-size: 16px;
        color: #2a9de6;
        margin-right: 10px;
      }
    }
    .Map-Video--right--tree {
      width: 100%;

      height: calc((100% - 36px) / 2 - 20px + 13%);
      margin: 10px 0;
      background: #001854;
      box-sizing: border-box;
      overflow-y: auto;

      .Carviode.noline .dian {
        width: 10px;
        height: 10px;
        background: red;
      }
      .Carviode .dian {
        width: 10px;
        height: 10px;
        background: #00ff00;
      }
      .Carviode .sts {
        white-space: nowrap;
        color: #00ff00;
      }
      .Carviode.noline .sts {
        color: red;
      }
      .Carviode {
        width: 100%;
        color: #fff;
        // display: inline-block;
        display: flex;
        padding: 10px;
        cursor: pointer;
        box-sizing: border-box;
        align-items: center;
        span {
          width: 100%;
          cursor: pointer;
          display: block;
          padding: 0px 10px 2px;
          box-sizing: border-box;
          .zd-forbidden {
            color: rgb(100, 103, 105);
          }
        }
        span:hover {
          background: #0a1080 !important;
        }
        .carhover:hover {
          background: #0a1080 !important;
        }
      }
    }
    .Map-Video--right--btn-footer {
      width: 100%;
      box-sizing: border-box;
      .Video--right--btn-footer--Slider {
        width: 100%;
        padding: 0 20px;
        color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        span {
          width: 45px;
        }
        ::v-deep .el-slider {
          width: 80%;
          .el-slider__button {
            width: 12px;
            height: 12px;
          }
          .el-slider__runway,
          .el-slider__bar {
            height: 4px;
          }
        }
      }
    }
    .Map-Video--right--btn {
      width: 100%;
      // height: 80px; //添加的---后期删除
      // line-height: 80px; //添加的---后期删除
      // margin: 10px 0; //添加的---后期删除
      height: calc((100% - 36px) / 2 - 13%); //后期换上
      background: #001854;
      box-sizing: border-box;
      .Map-Video--right--btn-head {
        width: 100%;
        height: 100%;
        position: relative;
        // display: flex;
        overflow: auto;
        .Head--btn-video {
          width: 100%;
          background: #001854;
          // height: 100%;
          position: relative;
          .Viode-btn {
            width: 200px;
            height: 200px;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            background: #001854;
            transform: scale(0.85) translateY(-19px);

            .Viode-btn--box {
              width: 55px;
              height: 55px;
              position: absolute;
              // transition: 0.5s;
              cursor: pointer;
              // border: 1px solid red;
            }
            .Viode-btn--lt {
              top: 33px;
              left: 50%;
              margin-left: -75px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -400px -61px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: -15px;
                color: #fff;
              }
            }
            .Viode-btn--center {
              top: 50%;
              left: 50%;
              width: 35px;
              height: 35px;
              margin-left: -17px;
              margin-top: -8px;
              background-image: url("../assets/image/xuanzhuan.png");
              background-size: cover;
              /* background-position: -400px -61px; */
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: -15px;
                color: #fff;
              }
            }
            .Viode-btn--lt:hover {
              background-position: -400px 4px;
            }
            .Viode-btn--t {
              top: 20px;
              left: 50%;
              margin-left: -27px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: 0px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: 20px;
                bottom: -10px;
                color: #fff;
              }
            }
            .Viode-btn--t:hover {
              background-position: 0px 0;
            }
            .Viode-btn--tr {
              top: 33px;
              left: 50%;
              margin-left: 19px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -60px -61px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                right: -15px;
                color: #fff;
              }
            }
            .Viode-btn--tr:hover {
              background-position: -60px 4px;
            }
            .Viode-btn--r {
              top: 85px;
              left: 50%;
              margin-left: 37px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -114px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: -10px;
                top: 18px;
                color: #fff;
              }
            }
            .Viode-btn--r:hover {
              background-position: -114px 0px;
            }
            .Viode-btn--rb {
              top: 132px;
              left: 50%;
              margin-left: 23px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -170px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                right: -10px;
                bottom: 0px;
                color: #fff;
              }
            }
            .Viode-btn--rb:hover {
              background-position: -170px 0px;
            }
            .Viode-btn--b {
              top: 150px;
              left: 50%;
              margin-left: -27px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -231px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: 20px;
                top: -10px;
                color: #fff;
              }
            }
            .Viode-btn--b:hover {
              background-position: -231px 0px;
            }
            .Viode-btn--bl {
              top: 133px;
              left: 50%;
              margin-left: -77px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -293px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                left: -15px;
                bottom: 0px;
                color: #fff;
              }
            }
            .Viode-btn--bl:hover {
              background-position: -293px 0;
            }
            .Viode-btn--l {
              top: 85px;
              left: 50%;
              margin-left: -93px;
              background-image: url("../assets/image/btn.png");
              background-size: 450px;
              background-position: -346px -65px;
              background-repeat: no-repeat;
              p {
                position: absolute;
                right: -10px;
                top: 18px;
                color: #fff;
              }
            }
            .Viode-btn--l:hover {
              background-position: -346px 0px;
            }
          }
        }
      }
    }
  }
}

.video2 {
  border: solid 1px #a4f8ff; /*no*/

  position: relative;
  box-sizing: border-box;
}

.video3 {
  border: solid 2px #14f114; /*no*/

  position: relative;
  box-sizing: border-box;
}

.btn-shang {
  width: 140px;
  height: 56px;
  position: absolute;
  cursor: pointer;
  background-image: url("../assets/image/btn.png");
  background-repeat: no-repeat;
  background-position: 0px -42px;
  left: 50%;
  top: 10px;
  margin-left: -70px;
}

.btn-zuo {
  width: 140px;
  height: 56px;
  position: absolute;
  cursor: pointer;
  background-image: url("../assets/image/btn.png");
  background-repeat: no-repeat;
  background-position: 0px -42px;
  left: -39px;
  top: 78px;
  /* margin-left: -70px; */
  transform: rotate(-89deg);
}

.btn-xia {
  width: 140px;
  height: 56px;
  position: absolute;
  cursor: pointer;
  background-image: url("../assets/image/btn.png");
  background-repeat: no-repeat;
  background-position: 0px -42px;
  left: 50%;
  top: 146px;
  margin-left: -72px;
  transform: rotate(180deg);
}

.btn-you {
  width: 140px;
  height: 56px;
  position: absolute;
  cursor: pointer;
  background-image: url("../assets/image/btn.png");
  background-repeat: no-repeat;
  background-position: 0px -42px;
  right: -37px;
  top: 78px;
  margin-left: -72px;
  transform: rotate(90deg);
}
.jianrong_s {
  width: 180px;
}
.tixing {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.videowarp {
  position: fixed;
  top: 10%;
  right: 0;
  width: 80.4%;
  height: 90%;
  z-index: 2;
  .videowarp-top {
    width: 100%;
    height: 2%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    img {
      width: 59px;
      height: 20px;
      max-height: 100%;
      display: block;
    }
  }
  .videowarp-bot {
    width: 100%;
    height: 100%;
    display: flex;
  }
}

.videowarp-left {
  position: absolute;
  width: 59px;
  height: 30px;
  // left:-39px;
  top: 50%;
  transform: rotate(90deg);
  font-size: 20px;
  transform-origin: 0 0;
  background: #00beff;
  color: #fff;
  text-align: center;
  line-height: 30px;
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
  .left_top {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .left_mid {
    width: 100%;
    height: calc((100% - 292px) * 33.3 / 100);
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .left_bot {
    width: 100%;
    height: calc((100% - 292px) * 54.5 / 100);
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
}
.slider-wrap {
  width: 90%;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .slider-wrap-left {
    width: 70%;
  }
}

.maidai {
  width: 100%;
  height: 40px;
}

.left_mid_bot {
  width: 100%;
  height: calc(100% - 50px);
}

.left_bot_bot {
  width: 100%;
  height: calc(100% - 50px);
}

.el-tree-node:focus > .el-tree-node__content {
  background: linear-gradient(
    to right,
    #a4f8ff,
    rgba(255, 255, 255, 0)
  ) !important;
  color: #2cc6ff;
}

.el-tree-node__content:hover {
  background: linear-gradient(
    to right,
    #a4f8ff,
    rgba(255, 255, 255, 0)
  ) !important;
  color: #2cc6ff;
}

.warningInfo-top {
  width: 100%;
  height: 40px;
  padding-left: 20px;
}

.warningInfo-bot {
  width: 100%;
  height: 96%;
}

.warningInfo-bot-x {
  width: 100%;
  height: 100%;
}

.left_top-leibie-bot {
  width: 100%;
  height: 60px;
}
.left_top-date-bot {
  // width: 100%;
  // padding: 10px 0;
  // // height: 85px;
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-end;

  width: 100%;
  text-align: center;
  // line-height: 40px;/*no*/
  padding: 10px 0;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 34px;
}

.leibie-item {
  width: 160px;
  height: 40px;
  border: 1px solid #78b6ee;
  box-sizing: border-box;
  line-height: 40px;
  text-align: center;
  color: #78b6ee;
  cursor: pointer;
  &.active {
    background-image: url("../assets/image/button-1.svg");
    background-size: cover;
    color: #fff;
  }
}

.left_top-leibie-bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zt_tab {
  width: 80px;
  height: 40px;
  border: 1px solid #78b6ee;
  box-sizing: border-box;
  line-height: 40px;
  text-align: center;
  color: #78b6ee;
  cursor: pointer;
  &.active {
    background-image: url("../assets/image/button-1.svg");
    background-size: 100% 100%;
    color: #fff;
  }
}
.videowarp-left-box {
  width: 2.1%;
  display: flex;
}
</style>
