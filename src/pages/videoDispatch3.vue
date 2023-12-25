<template>
  <div class="Map-Video diaodu3">
    <div class="left">
      <div class="left_top">
        <div class="maidai">
          <TitleTwo title="分屏设置" />
        </div>

        <div
          class="slider-wrap bg_color_white"
          :class="$route.path == '/diaodu2' ? 'nysj_the' : ''"
        >
          <div class="slider-wrap-left">
            <el-slider
              v-model="fornum"
              :max="6"
              :min="3"
              @input="getSlider"
              @change="getSlider"
              :disabled="kto == 2 ? true : false"
            ></el-slider>
          </div>

          <div class="slider-wrap-rig">
            <p
              class="Typography-color-blue"
              :class="$route.path == '/diaodu2' ? 'nysj_the' : ''"
            >
              {{ fornum }} X {{ fornum }}
            </p>
          </div>
        </div>
      </div>
      <!--<div class="left_mid">
                <div class="maidai">
                    <TitleTwo title="选择警车所属单位" />
                </div>

                <div class="left_mid_bot">
                    <DepTree v-if='ghk'  @getDeptDatas="getDeptDatas" @carall='carall'  /> 
                </div>
            </div> -->
      <div class="left_bot">
        <div class="maidai">
          <TitleTwo title="选择调度警车" />
        </div>

        <div class="left_bot_bot">
          <JcList
            @song="handlePlay"
            :detid="detid"
            @addCar="addCar"
            @newBf="newBf"
          />
        </div>
      </div>
    </div>

    <div class="videowarp">
      <div class="videowarp-bot">
        <div class="Map-Video--left" v-if="$isie">
          <p class="tixing">
            <span>请使用谷歌浏览器或360极速模式打开视频模块</span>
          </p>
        </div>
        <div class="Map-Video--left" v-if="!$isie">
          <div class="Map-Video--Video">
            <div
              style="
                height: 100%;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                overflow: hidden;
                position: relative;
              "
            >
              <template v-for="(item, i) in pingarr">
                <div
                  @click="choose_pl = i"
                  :class="i == choose_pl ? 'video3' : 'video2'"
                  :style="
                    (fornum == 3 && item.width == '0%') ||
                    (fornum == 4 && item.width == '0%') ||
                    (isquanping == true && isquanping_ind != i)
                      ? `opacity:0;width:${item.width};height:${item.height}`
                      : `opacity:1;width:${item.width};height:${item.height}`
                  "
                >
                  <cus-player
                    :jc_data="item.jc_data"
                    :key="item.re"
                    @des="des"
                    :ind="i"
                    @ended="ended"
                    @quanping="quanping"
                    @bofang="bofang"
                    @error="error"
                    @pause="pause"
                    :statusind="item.status_ind"
                    :deviceId="item.deviceId"
                    :channelId="item.channelId"
                    :ref="item.re"
                  ></cus-player>
                </div>
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
import crypto from "crypto";
import {
  gb_channels,
  gb_login,
  gb_start,
  gb_stop,
  gb_devicelist,
  gb_control,
} from "@/api/video.js";
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login.js";
import CusPlayer from "./CusPlayer2";
import Map from "../components/map.vue";

import DepTree from "../components/depTree.vue";

import EmpMini from "../components/empMini.vue";

import JcList from "../components/jcList3.vue";

import TitleTwo from "../components/basetool/TitleTwo2.vue";

export default {
  name: "videoDispatch2",
  data() {
    return {
      ghk: false,
      hk_arr: [
        {
          hk_index: 1,
          hk_name: "云台",
        },
        {
          hk_index: 2,
          hk_name: "左前摄像机",
        },
        {
          hk_index: 3,
          hk_name: "左中前摄像机",
        },
        {
          hk_index: 4,
          hk_name: "右中前摄像机",
        },
        {
          hk_index: 5,
          hk_name: "右前摄像机",
        },
        {
          hk_index: 6,
          hk_name: "左后摄像机",
        },
        {
          hk_index: 7,
          hk_name: "左中后摄像机",
        },
        {
          hk_index: 8,
          hk_name: "右中后摄像机",
        },
        {
          hk_index: 9,
          hk_name: "右后摄像机",
        },
      ],
      kto: 1,
      dingwei: null,
      mapcarlist: [],
      MenuData: [],
      controSpeed: 60,
      status_arr: [],
      pingarr: [
        //36平
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video0",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video1",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video2",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video3",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video4",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video5",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video6",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video7",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video8",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video9",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video10",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video11",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video12",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video13",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video14",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video15",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video16",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video17",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video18",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video19",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video20",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video21",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video22",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video23",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video24",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video25",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video26",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video27",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video28",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video29",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video30",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video31",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video32",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video33",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video34",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "16.6%",
          height: "16.6%",
          timer: "0",
          re: "video35",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
      ],

      websock: null,
      VideoImage: {
        plate: [],
        face: [],
      },
      fornum: 6,
      Name_NVR_IP: null,
      timeStart: "",
      timeEnd: "",

      timerso: 0,
      huifang_bool: false,
      huifang_index: "",

      selected: 0, //表格类型
      videoIndex: 0, //表格索引
      tableData: [], //列表
      selectValue: "", //当前选择的相机
      playUrl: "", //播放的url

      timer0: "",
      timer1: "",
      timer2: "",
      timer3: "",
      timer4: "",
      timer5: "",
      timer6: "",
      timer7: "",
      timer8: "",
      storerefs: "",
      choose_pl: 0,
      isquanping: false,
      isquanping_ind: "",

      detid: "",
    };
  },
  destroyed() {},
  watch: {
    fornum(val) {
      (this.isquanping = false), (this.isquanping_ind = "");
      if (val == 3) {
        this.pingarr.forEach((item, i) => {
          item.width = "33.3%";
          item.height = "33.3%";
        });
      } else if (val == 4) {
        this.pingarr.forEach((item, i) => {
          item.width = "25%";
          item.height = "25%";
        });
      } else if (val == 5) {
        this.pingarr.forEach((item, i) => {
          item.width = "20%";
          item.height = "20%";
        });
      } else if (val == 6) {
        this.pingarr.forEach((item, i) => {
          item.width = "16.6%";
          item.height = "16.6%";
        });
      }
    },
  },
  methods: {
    newBf(data) {
      //   debugger
      var hk_index = data.index;
      var hk_name = data.name;
      var bs = data.bs;
      this.pingarr[this.choose_pl].jc_data = Object.assign({}, data, {
        hk_index,
        hk_name,
        bs,
      });
    },
    addCar(data) {
      this.mapcarlist = data;
    },
    carall(data) {
      data.arr.forEach((item, i) => {
        try {
          this.pingarr.forEach((item2, i2) => {
            if (!item2.jc_data) {
              var hk_index = 1;
              var hk_name = "云台";
              this.pingarr[i2].jc_data = Object.assign({}, item, {
                hk_index,
                hk_name,
              });

              console.log(this.pingarr);

              throw Error();
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    },
    getDeptDatas(data) {
      this.detid = data.id;
    },
    song(data) {
      console.log(data, "datay");
    },
    yidong(type) {
      if (type == 1) {
        var topnum = $(".videowarp-bot").height();
        topnum = (topnum * 75) / 100;

        var topxian = $(".videowarp").position().top;

        var apphei = ($("#app").height() * 10) / 100;
        if (topxian > apphei) {
          $(".videowarp").animate({ top: apphei + "px" });

          this.kto = 1;
        } else {
          $(".videowarp").animate({ top: topxian + topnum + "px" });

          this.kto = 2;
        }
      } else {
        var leftnum = $(".videowarp-bot").width();
        leftnum = (leftnum * 75) / 100;

        var rightxian = $(".videowarp").css("right");

        if (rightxian == "0px") {
          $(".videowarp").animate({ right: -leftnum + "px" });

          this.kto = 2;
        } else {
          $(".videowarp").animate({ right: 0 + "px" });

          this.kto = 1;
        }
      }
    },
    getTreeDatas(data) {
      console.log(data);
    },
    // 窗口分割
    getSlider(val) {},
    async ptzCamera(leftRight, upDown, zoom) {
      console.log("云台控制：" + leftRight + " : " + upDown + " : " + zoom);

      let control_data = {
        deviceId: this.pingarr[this.choose_pl].deviceId,
        channelId: this.pingarr[this.choose_pl].channelId,
        leftRight,
        upDown,
        zoom,
        controSpeed: this.controSpeed,
      };

      await gb_control(control_data);
    },
    ended(val) {
      this.status_arr[val].status = 0;

      //   this.timerso=new Date().getTime()
    },
    bofang(val) {
      this.status_arr[val].status = 2;

      //   this.timerso=new Date().getTime()
    },
    pause(val) {
      this.status_arr[val].status = 1;

      //   this.timerso=new Date().getTime()
    },
    error(val) {
      this.status_arr[val].status = 3;

      //    this.timerso=new Date().getTime()
    },
    quanping(val) {
      if (val.status == 1) {
        this.pingarr.forEach((item, i) => {
          if (i == val.ind) {
            this.pingarr[i].width = "100%";
            this.pingarr[i].height = "100%";
          } else {
            this.pingarr[i].width = "0%";
            this.pingarr[i].height = "0%";
          }
        });
        this.isquanping = true;
        this.isquanping_ind = val.ind;
      } else {
        if (!val.iscaozuo) {
          this.pingarr[val.ind].jc_data = null;
        }

        this.isquanping = false;
        this.isquanping_ind = "";
        if (this.fornum == 3) {
          this.pingarr.forEach((item, i) => {
            item.width = "33.3%";
            item.height = "33.3%";
          });
        } else if (this.fornum == 4) {
          this.pingarr.forEach((item, i) => {
            item.width = "25%";
            item.height = "25%";
          });
        } else if (this.fornum == 5) {
          this.pingarr.forEach((item, i) => {
            item.width = "20%";
            item.height = "20%";
          });
        } else if (this.fornum == 6) {
          this.pingarr.forEach((item, i) => {
            item.width = "16.6%";
            item.height = "16.6%";
          });
        }
      }
    },
    des(val, val2) {
      setTimeout(() => {
        this.status_arr[val2].status = 0;
      }, 500);

      this.pingarr[val].timer = new Date().getTime();
    },
    async handlePlay(data) {
      if (data.type == "all") {
        var num = 0;
        this.pingarr.forEach((item3, i3) => {
          if (item3.jc_data) {
            num++;
          }
        });

        if (num < 18) {
          this.hk_arr.forEach((item, i) => {
            try {
              this.pingarr.forEach((item2, i2) => {
                if (!item2.jc_data) {
                  var hk_index = this.hk_arr[i].hk_index;
                  var hk_name = this.hk_arr[i].hk_name;
                  this.pingarr[i2].jc_data = Object.assign({}, data, {
                    hk_index,
                    hk_name,
                  });

                  throw Error();
                }
              });
            } catch (err) {
              console.log(err);
            }
          });
        } else {
          try {
            this.pingarr.forEach((item2, i2) => {
              if (!item2.jc_data) {
                var hk_index = this.hk_arr[0].hk_index;
                var hk_name = this.hk_arr[0].hk_name;
                this.pingarr[i2].jc_data = Object.assign({}, data, {
                  hk_index,
                  hk_name,
                });

                throw Error();
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    },

    async S_gb_channels(deviceId) {
      var res = await gb_channels(deviceId);

      var deviceChannelList = res.list;

      return deviceChannelList;
    },
    async S_gb_devicelist(islogin) {
      var res = await gb_devicelist();

      var devicelList = res.list;

      devicelList = this.gaizao(devicelList);

      devicelList.forEach(async (item, i) => {
        var channels = await this.S_gb_channels(item.deviceId);
        this.status_arr.push({
          status_ind: i,
          status: 0,
          kl: i,
          name: item.name,
          isonline: item.online,
          da: item,
          channels: channels,
        });
      });

      //实时刷新警车状态
      // setInterval(async ()=>{
      //     var res = await gb_devicelist();

      //     var devicelList = res.list;

      //     devicelList = this.gaizao(devicelList)

      //     devicelList.forEach(async (item,i)=>{

      //         var channels = await this.S_gb_channels(item.deviceId)

      //         this.status_arr[i].isonline = item.online

      //         if(!this.status_arr[i].isonline){
      //             this.status_arr[i].status=0
      //         }

      //     })
      //     // this.timerso=new Date().getTime()
      // },2000)
    },

    gaizao(arr) {
      var L1 = [],
        L2 = [];
      arr.forEach((item, i) => {
        if (item.online) {
          L1.push(item);
        } else if (!item.online) {
          L2.push(item);
        }
      });
      var ews = L1.concat(L2);

      return ews;
    },

    async S_gb_start(data, index) {
      var da = {
        deviceId: data.deviceId,
        channelId: data.channelId,
      };

      if (this.$IS_company) {
        var res = await gb_start(da);
        if (res.code == 0) {
          let Webscocket_video = sessionStorage.Webscocket_video;
          // let urls='http://'+Webscocket_video + ':18080/#/play/wasm/' + encodeURIComponent(res.data.ws_hls)
          // let baseZlmApi = this.$env_bs=='development' ? `${location.host}/liu`:`${location.host}/zlm`
          // let urls = `/liu/${res.data.app}/${res.data.streamId}.flv`;
          let urls;
          if (!this.$isie) {
            urls = res.data.ws_flv;
          } else {
            urls = res.data.ws_flv;
          }
          // let urls= `ws://${Webscocket_video}:30001/${res.data.app}/${res.data.streamId}.flv`;
          console.log(urls, "----======");
          return urls;
        } else {
          Message({
            showClose: true,
            message: "设备异常",
            type: "error",
            duration: 2000,
          });

          return false;
        }
      } else {
        let Webscocket_video = sessionStorage.Webscocket_video;
        let urls = `ws://${Webscocket_video}:30001/rtp/${data.deviceId}/${data.channelId}.flv`;
        // let urls= `http://${Webscocket_video}:30001/index/api/webrtc?app=rtp&stream=${data.deviceId}/${data.channelId}&type=play`
        console.log(urls, "----======");
        return urls;
      }
    },
  },

  async mounted() {
    this.fornum = 6;

    // this.S_gb_devicelist()

    // try{
    //     var res = await sysLogin({
    //         captcha: "",
    //         checkKey: "",
    //         password: '123456',
    //         username: 'admin',
    //     });

    //     sessionStorage.setItem("JC_Token", res.result.token);

    //     setTimeout(()=>{
    //         this.ghk=true
    //     },200)
    // }catch(err){
    //     Message({
    //         showClose: true,
    //         message:'网络异常',
    //         type:'error',
    //         duration:2000
    //     })

    // }
  },
  components: {
    CusPlayer,
    Map,
    DepTree,
    EmpMini,
    JcList,
    TitleTwo,
  },
};
</script>
<style>
.Carviode .el-button {
  min-width: 50px;
  width: 50px;
  border: none;
}
.yuntai {
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.yuntai .el-button {
  width: 40%;
  border: none;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
}
.choose_playback_time .el-date-editor.el-input {
  /* width: 90%;
        display: block;
        margin: 0 auto; */
  margin-bottom: 5px;
}
.choose_playback_time {
  padding: 10px;
}

.choose_playback_time .el-button {
  width: 100%;
}
</style>
<style lang='scss' scoped>
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
  // justify-content: space-between;

  .Map-Video--left {
    width: 100%;
    height: 100%;

    position: relative;
    .Map-Video--Video {
      width: 100%;
      height: 100%;
      // background: #001854;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
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
      // .el-tree{
      //     color: #fff;
      //     background: #001854;

      //         ::v-deep  .el-tree-node.is-current.is-focusable{
      //             .el-tree-node__content{
      //                 background: #0A1080 !important;
      //             }
      //         }

      //      ::v-deep .el-tree-node{
      //         .el-tree-node__content:hover{
      //             background: #0A1080;
      //         }
      //         .el-tree-node__content:focus{
      //             background: #0A1080;
      //         }
      //         &:focus{
      //             background: #0A1080;
      //             .el-tree-node__content{
      //                 background: #0A1080 !important;
      //             }
      //         }
      //     }

      // }
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
            // border: 2px solid #001E64;
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
  // position: fixed;
  // top: 10%;
  // right: 0;
  width: 81.4%;
  height: 100%;
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

      &.wai {
        transform: rotate(0deg);
      }

      &.nei {
        transform: rotate(180deg);
      }
    }
  }
  .videowarp-bot {
    width: 100%;
    height: 100%;
    display: flex;
  }
}

.videowarp-left-box {
  width: 1.1%;
  display: flex;
}
.videowarp-left {
  // position: absolute;
  // width: 59px;
  // height: 20px;
  // left:-39px;
  // top: 50%;
  // transform: rotate(90deg);

  // transform-origin: 0 0;

  &.wai {
    position: absolute;
    width: 59px;
    height: 20px;
    left: -39px;
    top: 50%;
    transform: rotate(-90deg);
  }

  &.nei {
    position: absolute;
    width: 59px;
    height: 20px;
    left: -39px;
    top: 50%;
    transform: rotate(90deg);
  }
}

.left {
  // position: fixed;
  // top: 10%;
  // left: 1%;
  width: 18.5%;
  height: 100%;
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
    height: calc((100% - 100px) * 44 / 100);
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .left_bot {
    width: 100%;
    // height: calc((100% - 100px) * 50 / 100);
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
}

.diaodu3 {
  .left_bot {
    height: calc((100% - 100px));
  }
}
.slider-wrap {
  width: 100%;
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
</style>
