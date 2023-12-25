<template>
  <div class="Map-Video">
    <Map />

    <div class="left dvd">
      <!--<div class="left_top">
                <div class="maidai">
                    <TitleTwo title="分屏设置" />
                </div>

                <div class="slider-wrap bg_color_white">
                    <div class="slider-wrap-left">
                        <el-slider v-model="fornum" :max="5"  :min="3" @input="getSlider" @change="getSlider"  :disabled='kto==2?true:false'></el-slider>
                    </div>
                    
                    <div class="slider-wrap-rig">
                          <p class="Typography-color-blue"> {{fornum}} X {{fornum}}</p>
                    </div>
                  
                </div>
            </div>-->

      <div class="left_bot">
        <div class="maidai">
          <TitleTwo title="选择取证时段" />
        </div>

        <div class="time-box left_bot_bot bg_color_white xiba">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerBeginDateBefore"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-top: 10px"
            v-model="endTime"
            type="datetime"
            placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerBeginDateAfter"
          >
          </el-date-picker>
        </div>
      </div>

      <div class="left_mid">
        <div class="maidai">
          <TitleTwo title="选择取证警车" />
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

    <div class="videowarp" id="videowarp">
      <div class="videowarp-bot">
        <JessibucaComponents ref="vueplayer" />
      </div>
      <div class="timeAxis" id="timeSlider" ref="timeSlider">
        <!--<TimeAxios :timeData="timeData" :initDate="initDate" />-->
      </div>
    </div>
  </div>
</template>

<script>
import initTimeSlider from "video-time-slider";
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
import {
  getVideoUrl,
  hikControl,
  getVideoUrl2,
  hikControl2,
  getVideoUrlback,
  getCameraCode,
} from "@/api/hkvideo.js";
import {
  gbBackPlay,
  gbBackRecord,
  gbBackPause,
  gbBackResume,
  gbBackStop,
} from "@/api/kdvideo.js";
import Map from "../components/map.vue";

import DepTree from "../components/depTree.vue";

import EmpMini from "../components/empMini.vue";

import JcList from "../components/jcList_keda.vue";

import TitleTwo from "../components/basetool/TitleTwo.vue";

import JessibucaComponents from "../components/JessibucaComponents.vue";
import TimeAxios from "../components/timeAxis.vue";
export default {
  name: "videoDispatch",
  data() {
    return {
      timeData: [
        { startTime: "2023-04-13 00:00:00", endTime: "2023-04-14 01:10:00" },
        { startTime: "2023-04-14 01:20:00", endTime: "2023-04-14 01:50:00" },
        { startTime: "2023-04-14 03:00:00", endTime: "2023-04-14 06:00:00" },
      ],
      initDate: "2023-04-12 00:00:00",
      startTime: "",
      endTime: "",
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
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = new Date(this.endTime);
        },
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = new Date(this.startTime);
        },
      },
      kto: 1,
      dingwei: null,
      mapcarlist: [],
      MenuData: [],
      controSpeed: 60,
      status_arr: [],
      pingarr: [
        //一平
        // {
        //     width:'100%',
        //     height:'100%'
        // },
        // {
        //     width:'50%',
        //     height:'50%'
        // },
        // {
        //     width:'50%',
        //     height:'50%'
        // },
        // {
        //     width:'50%',
        //     height:'50%'
        // },
        // {
        //     width:'100%',
        //     height:'100%'
        // },
        // {
        //     width:'100%',
        //     height:'100%'
        // },
        // {
        //     width:'100%',
        //     height:'100%'
        // },
        // {
        //     width:'100%',
        //     height:'100%'
        // },
        // {
        //     width:'100%',
        //     height:'100%'
        // }
        //25平
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video0",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video1",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video2",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video3",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video4",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video5",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video6",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video7",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video8",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video9",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video10",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video11",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video12",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video13",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video14",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video15",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video16",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video17",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video18",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video19",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video20",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video21",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video22",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video23",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        {
          width: "20%",
          height: "20%",
          timer: "0",
          re: "video24",
          status_ind: 0,
          deviceId: "",
          channelId: "",
          jc_data: null,
        },
        //九分平

        // {
        //     width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //      width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //     width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //      width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //      width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //      width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //      width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //     width:'33.3%',
        //     height:'33.3%'
        // },
        // {
        //     width:'33.3%',
        //     height:'33.3%'
        // }
      ],
      DataTree: [
        {
          index_win: 1,
          status: false,
          name: "警车1",
        },
        {
          index_win: 2,
          status: false,
          name: "警车2",
        },
        {
          index_win: 3,
          status: false,
          name: "警车3",
        },
        {
          index_win: 4,
          status: false,
          name: "警车4",
        },
        {
          index_win: 5,
          status: false,
          name: "警车5",
        },
        {
          index_win: 6,
          status: false,
          name: "警车6",
        },
        {
          index_win: 7,
          status: false,
          name: "警车7",
        },
        {
          index_win: 8,
          status: false,
          name: "警车8",
        },
        {
          index_win: 9,
          status: false,
          name: "警车9",
        },
        {
          index_win: 10,
          status: false,
          name: "警车10",
        },
      ],
      websock: null,
      VideoImage: {
        plate: [],
        face: [],
      },
      fornum: 5,
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

      doudong: true,
      recordList: [],
      Obj: null,
      PlayKeDaUrl: null,
      stream: null,
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
      }
    },
    startTime(val) {
      //console.log(val,this.endTime,"开始时间");
      var sy_timer = new Date(val).getFullYear();
      var sm_timer =
        new Date(val).getMonth() + 1 > 9
          ? new Date(val).getMonth() + 1
          : "0" + (new Date(val).getMonth() + 1);
      var sr_timer =
        new Date(val).getDate() > 9
          ? new Date(val).getDate()
          : "0" + new Date(val).getDate();
      var ss_timer = new Date(val).getHours();
      var sf_timer = new Date(val).getMinutes();
      var sma_timer = new Date(val).getSeconds();
      //console.log(sy_timer,sm_timer,sr_timer,ss_timer,sf_timer,sma_timer);
      var ey_timer = new Date(this.endTime).getFullYear();
      var em_timer =
        new Date(this.endTime).getMonth() + 1 > 9
          ? new Date(this.endTime).getMonth() + 1
          : "0" + (new Date(this.endTime).getMonth() + 1);
      var er_timer =
        new Date(this.endTime).getDate() > 9
          ? new Date(this.endTime).getDate()
          : "0" + new Date(this.endTime).getDate();
      var es_timer = new Date(this.endTime).getHours();
      var ef_timer = new Date(this.endTime).getMinutes();
      var ema_timer = new Date(this.endTime).getSeconds();
      //console.log(ey_timer,em_timer,er_timer,es_timer,ef_timer,ema_timer);
      var end_year = sy_timer;
      var end_month = sm_timer;
      var end_day = sr_timer;
      if (ss_timer > es_timer) {
        var end_hour = 23;
        var end_minutes = 59;
        var end_seconds = 59;
        //this.$message({
        //  message: '只能获取当天时间段内的数据',
        //  type: 'warning'
        //});
        this.endTime =
          end_year +
          "-" +
          end_month +
          "-" +
          end_day +
          " " +
          end_hour +
          ":" +
          end_minutes +
          ":" +
          end_seconds;
        console.log(1, this.endTime);
      } else {
        //if()

        this.endTime =
          end_year +
          "-" +
          end_month +
          "-" +
          end_day +
          " " +
          es_timer +
          ":" +
          ef_timer +
          ":" +
          ema_timer;
        console.log(2, this.endTime);
      }
    },
    endTime(val) {
      //console.log(val,this.endTime,"开始时间");
      var sy_timer = new Date(val).getFullYear();
      var sm_timer =
        new Date(val).getMonth() + 1 > 9
          ? new Date(val).getMonth() + 1
          : "0" + (new Date(val).getMonth() + 1);
      var sr_timer =
        new Date(val).getDate() > 9
          ? new Date(val).getDate()
          : "0" + new Date(val).getDate();
      var ss_timer =( new Date(val).getHours()>9)? new Date(val).getHours():( "0"+new Date(val).getHours());
      var sf_timer = (new Date(val).getMinutes()>9)?new Date(val).getMinutes():("0"+new Date(val).getMinutes());
      var sma_timer = (new Date(val).getSeconds()>9)?new Date(val).getSeconds():("0"+new Date(val).getSeconds());
      //console.log(sy_timer,sm_timer,sr_timer,ss_timer,sf_timer,sma_timer);
      var ey_timer = new Date(this.startTime).getFullYear();
      var em_timer =
        new Date(this.startTime).getMonth() + 1 > 9
          ? new Date(this.startTime).getMonth() + 1
          : "0" + (new Date(this.startTime).getMonth() + 1);
      var er_timer =
        new Date(this.startTime).getDate() > 9
          ? new Date(this.startTime).getDate()
          : "0" + new Date(this.startTime).getDate();
      var es_timer = ( new Date(this.startTime).getHours()>9)? new Date(this.startTime).getHours():( "0"+new Date(this.startTime).getHours());
      var ef_timer = (new Date(this.startTime).getMinutes()>9)?new Date(this.startTime).getMinutes():("0"+new Date(this.startTime).getMinutes());
      var ema_timer = (new Date(this.startTime).getSeconds()>9)?new Date(this.startTime).getSeconds():("0"+new Date(this.startTime).getSeconds());
      //console.log(ey_timer,em_timer,er_timer,es_timer,ef_timer,ema_timer);
      var startTime_year = sy_timer;
      var startTime_month = sm_timer;
      var startTime_day = sr_timer;
      if (ss_timer > es_timer) {
        var startTime_hour = "00";
        var startTime_minutes = "00";
        var startTime_seconds = "00";
        //this.$message({
        //  message: '只能获取当天时间段内的数据',
        //  type: 'warning'
        //});
        this.startTime =
          startTime_year +
          "-" +
          startTime_month +
          "-" +
          startTime_day +
          " " +
          startTime_hour +
          ":" +
          startTime_minutes +
          ":" +
          startTime_seconds;
        console.log(1, this.startTime);
      } else {
        //if()

        this.startTime =
          startTime_year +
          "-" +
          startTime_month +
          "-" +
          startTime_day +
          " " +
          es_timer +
          ":" +
          ef_timer +
          ":" +
          ema_timer;
        console.log(2, this.endTime);
      }
    },
  },
  methods: {
    async newBf(data) {
      try {
        console.log(data.ip, data, "弟弟是");
        console.log(this.startTime, this.endTime);
        var form = {
          deviceCode: data.gbInfomation,
          channelNo: data.index,
          startTime: this.startTime,
          endTime: this.endTime,
        };
        console.log(this.PlayKeDaUrl,"视频播放地址");
        if(this.PlayKeDaUrl){
               var dddd = {
                  deviceCode: form.deviceCode,
                  channelNo: form.channelNo,
                  stream: this.stream,
                };
                gbBackStop(dddd)
                  .then((res) => {
                    console.log(res);
                    //this.$refs.vueplayer.load(res.result.flv);
                    //this.stream = res.result.stream;
                    this.Obj=null
                    this.recordList=[]
                    var aaa=document.getElementById("timeSlider")
                    var bbb=document.getElementById("videowarp")
                    console.log(aaa,bbb);
                    aaa.remove()
                     this.$refs.vueplayer.destroy()
                    this.$refs.vueplayer.clearView()
                    var newDom=document.createElement("div")
                   newDom.id='timeSlider'
                   bbb.appendChild(newDom)
                  })
                  .catch((err) => {
                    console.log(err);
                  });
        } 
        gbBackPlay(form)
          .then((res) => {
            if (res.result.recordList) {
              var timeList = res.result.recordList.map((item) => {
                var aaa =
                  item.startTime.slice(-8).split(":").join("") +
                  "-" +
                  item.endTime.slice(-8).split(":").join("") +
                  "-" +
                  "C";
                // console.log(aaa);
                this.recordList.push(aaa);
              });
              this.Obj = initTimeSlider("#timeSlider", {
                curDaytimeChunkArray: this.recordList,
                presentSeconds: 200,
                timeChunkType: {
                  A: "red",
                  B: "yellow",
                  C: "blue",
                },
                speed: 1,
                isInitialPlay: true,
              });
              this.Obj.presentSeconds =
                this.recordList[0].slice(0, 2) * 60 * 60 +
                this.recordList[0].slice(2, 4) * 60 +
                this.recordList[0].slice(4, 6); // 30代表下次时间线移动的位置为 00:00:30
              this.Obj.setTimeLineLeft();
             var timeSlider=document.getElementById("timeSlider")
              timeSlider.addEventListener("click", () => {
                //视频暂停
                var mss = this.Obj.presentSeconds * 1000;
                var hours = parseInt(
                  (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = (mss % (1000 * 60)) / 1000;
                var startTimers = new Date(this.startTime);
                var searchH =
                  startTimers.getHours() + hours > 9
                    ? startTimers.getHours() + hours
                    : "0" + (startTimers.getHours() + hours);
                var searchM =
                  startTimers.getMinutes() + minutes > 9
                    ? startTimers.getMinutes() + minutes
                    : "0" + startTimers.getMinutes();
                var searchS =
                  startTimers.getSeconds() + seconds > 9
                    ? startTimers.getHours() + seconds
                    : "0" + (startTimers.getHours() + seconds);
                var searchYear =
                  startTimers.getMonth() + 1 > 9
                    ? startTimers.getMonth() + 1
                    : "0" + (startTimers.getMonth() + 1);
                var searchTime =
                  startTimers.getFullYear() +
                  "-" +
                  searchYear +
                  "-" +
                  startTimers.getDate() +
                  " " +
                  searchH +
                  ":" +
                  searchM +
                  ":" +
                  searchS;
                var forms = {
                  deviceCode: data.gbInfomation,
                  channelNo: data.index,
                  startTime: searchTime,
                  endTime: this.endTime,
                };
                gbBackRecord(forms).then((res) => {
                  var sss = {
                    deviceCode: form.deviceCode,
                    channelNo: form.channelNo,
                    stream: this.stream,
                  };
                   this.PlayKeDaUrl = res.result.flv;
                    this.stream = res.result.stream;
                  gbBackStop(sss).then((res) => {
                    console.log(res);
                    this.$refs.vueplayer.load(this.PlayKeDaUrl);
                   
                  });
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        gbBackRecord(form)
          .then((res) => {
            //console.log(res,this.stream);
            if (res.result) {
              console.log(1,res,this.stream);
              this.PlayKeDaUrl = res.result.flv;
              //this.stream = res.result.stream;
              if (this.stream) {
                var sss = {
                  deviceCode: form.deviceCode,
                  channelNo: form.channelNo,
                  stream: this.stream,
                };

                gbBackStop(sss)
                  .then((res) => {
                    console.log(res);
                    this.$refs.vueplayer.load(this.PlayKeDaUrl);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                this.$refs.vueplayer.load(res.result.flv);
                this.stream = res.result.stream;
              }
            } else {
              console.log(1);
              this.$message.error("获取视频错误");
            }
          })
          .catch((err) => {
            console.log(err);
          });
        //this.$refs.vueplayer.load(this.PlayKeDaUrl);
      } catch (e) {
        Message({
          showClose: true,
          message: `未获取到${data.carNumber}的nvr信息`,
          type: "error",
          duration: 2000,
        });
      }
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

              //console.log(this.pingarr);

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
      //console.log(data, "datay");
    },
    //yidong(type) {
    //  if (type == 1) {
    //    var topnum = $(".videowarp-bot").height();
    //    topnum = (topnum * 75) / 100;

    //    var topxian = $(".videowarp").position().top;

    //    var apphei = ($("#app").height() * 10) / 100;
    //    if (topxian > apphei) {
    //      $(".videowarp").animate({ top: apphei + "px" });

    //      this.kto = 1;
    //    } else {
    //      $(".videowarp").animate({ top: topxian + topnum + "px" });

    //      this.kto = 2;
    //    }
    //  } else {
    //    var leftnum = $(".videowarp-bot").width();
    //    leftnum = (leftnum * 75) / 100;

    //    var rightxian = $(".videowarp").css("right");

    //    if (rightxian == "0px") {
    //      $(".videowarp").animate({ right: -leftnum + "px" });

    //      this.kto = 2;
    //    } else {
    //      $(".videowarp").animate({ right: 0 + "px" });

    //      this.kto = 1;
    //    }
    //  }
    //},
    getTreeDatas(data) {
      //console.log(data);
    },
    // 窗口分割
    getSlider(val) {},
    async ptzCamera(leftRight, upDown, zoom) {
      //console.log("云台控制：" + leftRight + " : " + upDown + " : " + zoom);

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
        }
      }
      // this.doudong = false;

      // setTimeout(()=>{
      //     this.doudong = true;
      // },200)
    },
    des(val, val2) {
      setTimeout(() => {
        this.status_arr[val2].status = 0;
      }, 500);

      this.pingarr[val].timer = new Date().getTime();
    },
    async handlePlay(data) {
      if (data.type == "all") {
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
            //console.log(err);
          }
        });

        // [this.choose_pl].jc_data=data
      }
    },

    async S_gb_channels(deviceId) {
      // let loginParam = {
      //     username: 'admin',
      //     password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
      // }
      // var that = this;

      // await gb_login(loginParam)

      // this.$cookies.set("session", {"username": 'admin'}) ;

      var res = await gb_channels(deviceId);

      var deviceChannelList = res.list;

      return deviceChannelList;
    },
    async S_gb_devicelist(islogin) {
      // let loginParam = {
      //     username: 'admin',
      //     password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
      // }
      // var that = this;

      // await gb_login(loginParam)

      // this.$cookies.set("session", {"username": 'admin'}) ;

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
    getNowTime2(now) {
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
      var defaultDate = `${year}-${month}-${date}`;
      // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
      // console.log(yesterdsay)
      // debugger
      return defaultDate;
    },
    xiba() {
      var yesterdsay = this.getNowTime2(new Date());

      var jkl = this.getNowTime(new Date());

      this.startTime = yesterdsay + " 00:00:00";
      this.endTime = jkl;

      // this.startTime = yesterdsay + " 08:03:00";
      // this.endTime = yesterdsay + " 12:05:00";
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
          //console.log(urls, "----======");
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
        //console.log(urls, "----======");
        return urls;
      }
    },
    //获取指定时间录像记录
    async getgbBackPlay(form) {
      var res = await gbBackPlay(form);
      //console.log(res, "获取指定时间录像记录");
      //console.log(res.result.recordList, "获取指定时间录像记录");
      if (res.result.recordList) {
        var timeList = res.result.recordList.map((item) => {
          var aaa =
            item.startTime.slice(-8).split(":").join("") +
            "-" +
            item.endTime.slice(-8).split(":").join("") +
            "-" +
            "C";
          // console.log(aaa);
          this.recordList.push(aaa);
        });
      } else {
        this.$message.error("获取视频错误");
      }
    },
    //回放播放
    async getgbBackRecord(form) {
      var res = await gbBackRecord(form);
      //console.log(res.result.flv, "回放播放");
      this.stream = res.result.stream;
      this.PlayKeDaUrl = res.result.flv;
    },
    //回放暂停
    getgbBackPause() {
      const stream = "4D8BB589";
      gbBackPause(stream).then((res) => {
        console.log(res);
      });
    },
    //回放暂停
    getgbBackResume() {
      const stream = "4D8BB589";
      gbBackResume(stream).then((res) => {
        console.log(res);
      });
    },
    ////事件监听
    //shijian(){

    //}
  },
  activated() {
    PubSub.publish("nmhead");
  },
  async mounted() {
    PubSub.publish("jc_header_show", true);
    PubSub.publish("nmhead");
    this.fornum = 3;

    this.xiba();

    var obj = $(".Map-Video--Video").offset();

    var imgw = $(".Map-Video--Video").innerWidth();
    var imgh = $(".Map-Video--Video").innerHeight();

    //backbox = {
    //  top: obj.top,
    //  left: obj.left,
    //  width: imgw,
    //  height: imgh,
    //};

    //initPlugin();
    //await this.getgbBackPlay();
    //await this.getgbBackRecord();
    //初始化 时间轴控件
    //*60*60+this.recordList[0].slice(3,5)*60+this.recordList[0].slice(0,2)
    console.log(this.startTime, this.endTime, "开始结束事件");
    //console.log(this.$refs.timeSlider);
  },
  components: {
    Map,
    DepTree,
    EmpMini,
    JcList,
    TitleTwo,
    JessibucaComponents,
    TimeAxios,
  },
};
</script>
<style lang='scss'>
// .Map-Video{
.el-popper {
  width: 330px;
  left: auto;
  right: 0;
}
.el-date-picker .el-picker-panel__content {
  width: 300px !important;
}
// }

.playWnd {
  /* margin: 30px 0 0 400px; */
  width: 100%; /*播放容器的宽和高设定*/
  height: 100%;
  /* border: 1px solid red; */
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 34px;
}
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
  justify-content: space-between;

  .Map-Video--left {
    width: 98.9%;
    height: 100%;

    position: relative;
    .Map-Video--Video {
      width: 100%;
      height: 100%;
      background: #fff;
      // background: #001854;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tiao {
      width: 100%;
      height: 200px;
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

#playWnd {
  width: 100%;
  height: 100%;
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
    height: 90%;
    display: flex;
  }
  .timeAxis {
    width: 100%;
    height: 10%;
    background-color: #fff;
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

.left.dvd {
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
    height: calc((100% - 170px));
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .left_bot {
    width: 100%;

    height: 150px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;

    .xiba {
      padding: 10px;
    }
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

.playback {
  width: 100%;
  height: 100%;
}
</style>
