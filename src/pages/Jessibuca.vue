<template>
  <div class="box" id="jsHeight">
    <!--<div class="maidai">
      <TitleTwo title="选择调度警车" />
    </div>-->
    <div class="videoList">
      <div class="maidai">
        <TitleTwo title="选择调度警车" />
      </div>
      <div class="carSearch">
        <JcList
          @song="handlePlay"
          :detid="detid"
          @addCar="addCar"
          @newBf="newBf"
        />
        <!--  :ShowXXX="ShowXXX" -->
      </div>
      <div class="yt_cont bg_color_white">
        <div class="zstz">
          <span>转速调整</span>
          <el-input-number
            v-model="zhuansu"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </div>
        <div class="control_qiu_s">
          <img
            class="shang_s"
            @mousedown="hkcontrol('up', 0)"
            @mouseup="hkcontrol('up', 1)"
            :src="require('@/assets/image/g_shang.png')"
            alt=""
            srcset=""
          />
          <img
            class="xia_s"
            @mousedown="hkcontrol('down', 0)"
            @mouseup="hkcontrol('down', 1)"
            :src="require('@/assets/image/g_xia.png')"
            alt=""
            srcset=""
          />
          <img
            class="zuo_s"
            @mousedown="hkcontrol('left', 0)"
            @mouseup="hkcontrol('left', 1)"
            :src="require('@/assets/image/g_zuo.png')"
            alt=""
            srcset=""
          />
          <img
            class="you_s"
            @mousedown="hkcontrol('right', 0)"
            @mouseup="hkcontrol('right', 1)"
            :src="require('@/assets/image/g_you.png')"
            alt=""
            srcset=""
          />

          <img
            class="zuoshang_s"
            @mousedown="hkcontrol('upleft', 0)"
            @mouseup="hkcontrol('upleft', 1)"
            :src="require('@/assets/image/g_zuoshang.png')"
            alt=""
            srcset=""
          />
          <img
            class="zuoxia_s"
            @mousedown="hkcontrol('downleft', 0)"
            @mouseup="hkcontrol('downleft', 1)"
            :src="require('@/assets/image/g_zuoxia.png')"
            alt=""
            srcset=""
          />
          <img
            class="youshang_s"
            @mousedown="hkcontrol('upright', 0)"
            @mouseup="hkcontrol('upright', 1)"
            :src="require('@/assets/image/g_youshang.png')"
            alt=""
            srcset=""
          />
          <img
            class="youxia_s"
            @mousedown="hkcontrol('downright', 0)"
            @mouseup="hkcontrol('downright', 1)"
            :src="require('@/assets/image/g_youxia.png')"
            alt=""
            srcset=""
          />

          <img
            class="zhong"
            :src="require('@/assets/image/rocker-center.svg')"
            alt=""
            srcset=""
          />

          <span class="tit">云台</span>
        </div>

        <div class="zoomzu">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-zoom-in"
            @mousedown.native="hkcontrol('zoomin', 0)"
            @mouseup.native="hkcontrol('zoomin', 1)"
            >放大</el-button
          >
          <!--<el-button
            type="primary"
            size="mini"
            icon="el-icon-zoom-in"
            @mousedown.native="hkcontrol('GOTO_PRESET', 0)"
            @mouseup.native="hkcontrol('GOTO_PRESET', 1)"
            >重置</el-button
          >-->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-zoom-out"
            @mousedown.native="hkcontrol('zoomout', 0)"
            @mouseup.native="hkcontrol('zoomout', 1)"
            >缩小</el-button
          >
        </div>
      </div>
    </div>
    <div class="videoClass" ref="videoClass">
      <div
        class="videoDiv"
        v-for="(item, index) in 16"
        :key="item"
        ref="videoDiv"
        :class="{ active: actives == item }"
        :id="'videoDiv' + index"
      >
        <div :id="'closeVideo' + item" class="closeVideo">
          <span @click="handelCloseVideo(item)" class="stopXXX">关闭</span>
        </div>
        <VuePlayer
          :id="'myVideo' + (index + 1)"
          ref="vueplayer"
          :src="src"
          @handelClick="handelClick(index)"
          @handelPrevent="handelPrevent(index, id)"
        ></VuePlayer>
      </div>
    </div>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import VuePlayer from "@/components/JessibucaComponents.vue";
import { gyxyPcCarInformation } from "@/api/system.js";
import TitleTwo from "../components/basetool/TitleTwo.vue";
import JcList from "../components/jcList_keda.vue";
import { getKedaVideo } from "@/api/kedavideo.js";
import { kdControl } from "@/api/kdvideo.js";
import { gbBackStopNow } from "@/api/kdvideo.js";
export default {
  components: { VuePlayer, TitleTwo, JcList },
  data() {
    return {
      zhuansu: 20,
      pcCarList: null,
      player: null,
      actives: null,
      id: "myVideo1",
      logotype: false,
      number: 1,
      src: "http://172.16.0.104:28080/rtp/41130100491120000002_41130100491320000001.live.flv",
      detid: "",
      mapcarlist: [],
      deviceCode: "",
      channelNo: "",
    };
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    //this.getPcCarInfo();
    var domHeight=document.getElementById("jc_header")
    console.log(domHeight.getBoundingClientRect());
    var jsHeight=document.getElementById("jsHeight")
    //console.log(jsHeight.getBoundingClientRect());
    jsHeight.style.paddingTop=domHeight.getBoundingClientRect().height + "px"
  },
  methods: {
    //云台控制
    async hkcontrol(command, active) {
      try {
        if (command && active == 0 && this.channelNo == 1) {
          var from = {
            deviceCode: this.deviceCode,
            channelNo: this.channelNo,
            command,
            horizonSpeed: this.zhuansu,
            verticalSpeed: "",
            zoomSpeed: "",
          };
          var res = await kdControl(from);
          console.log(res);
        } else if (command && active == 1 && this.channelNo == 1) {
          var from = {
            deviceCode: this.deviceCode,
            channelNo: this.channelNo,
            command: "stop",
            horizonSpeed: this.zhuansu,
            verticalSpeed: "",
            zoomSpeed: "",
          };
          var res = await kdControl(from);
          console.log(res);
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: "网络质量差，稍后再试",
          type: "error",
          duration: 2000,
        });
      }
    },
    async newBf(data) {
      console.log(data, "数据+++++++++++++++++");
      this.deviceCode = data.gbInfomation;
      this.channelNo = data.index;
      try {
        var bianhao = "";

        if (data.index == 0 && data.adjInfomation != null) {
          bianhao = data.adjInfomation;
        } else {
          var form = {
            channelNo: data.index,
            deviceCode: data.gbInfomation,
            mediaType: "ws_flv",
          };

          var res = await getKedaVideo(form);
          //console.log(res);
          this.$nextTick(() => {
            if (res.result) {
              var destoryVideoArr =
                JSON.parse(localStorage.getItem("destoryVideo")) || [];
              destoryVideoArr.push(form);
              localStorage.setItem(
                "destoryVideo",
                JSON.stringify(destoryVideoArr)
              );
              console.log(destoryVideoArr, "视频流对象");
            }
          });

          //console.log(res,"未获取到豫R3D369的nvr信息");
          var VideoObj = {
            deviceCode: data.gbInfomation,
            channelNo: data.index,
            number: this.number,
          };
          console.log(
            this.number,
            "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
          );
          bianhao = res.result;
          this.$refs.vueplayer[this.number - 1].load(bianhao, VideoObj);
          var closeID = "closeVideo" + this.number;
          var closeDom = document.getElementById(closeID);
          closeDom.style.zIndex = 9999999;
          closeDom.style.color = "black";
          if (this.number == 16) {
            this.number = 1;
          } else {
            this.number = this.number + 1;
          }
        }
      } catch (e) {
        Message({
          showClose: true,
          message: `未获取到${data.carNumber}的nvr信息`,
          type: "error",
          duration: 2000,
        });
        console.log(e);
      }
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
            console.log(err);
          }
        });

        // [this.choose_pl].jc_data=data
      }
    },
    addCar(data) {
      console.log(data, "父子通信的数据");
      this.mapcarlist = data;
      console.log(this.mapcarlist, "父子通信的数据");
    },
    ////双击播放
    //handelDB() {
    //  var index = this.id.slice(7);
    //  console.log(index);
    //  console.log("双击", this.$refs.vueplayer[index - 1]);
    //  //执行自组件的方法
    //  var src =
    //    "http://172.16.0.104:28080/rtp/41130100491120000002_41130100491320000001.live.flv";
    //  console.log(src, "播放地址");
    //  //var src = this.src;
    //  //this.$refs.vueplayer[index - 1].load(src);

    //  var aaa = this.id.substring(7);
    //  console.log(aaa, "截取剩下的");
    //  this.number = this.number
    //    ? this.number > this.id.substring(7)
    //      ? this.number
    //      : this.id.substring(7)
    //    : this.id.substring(7);
    //  console.log(this.number, "我先中的video的下标");

    //  if (this.number == 1) {
    //    console.log(index, "车列表的下标");
    //    this.id = "myVideo" + this.number;
    //    var domId = this.id;
    //    this.$refs.vueplayer[this.number - 1].load(src);
    //    //this.createdPlay(this.id);
    //    this.number = this.number * 1 + 1;
    //    console.log(this.number, "下一次的位数");
    //    return;
    //  } else if (this.number > 1 && this.number < 16) {
    //    //console.log(number);

    //    //console.log(number);
    //    this.id = "myVideo" + this.number;
    //    this.$refs.vueplayer[this.number - 1].load(src);
    //    //this.createdPlay(this.id);
    //    this.number = this.number * 1 + 1;
    //    console.log(this.number, "下一次的位数");
    //    return;
    //  } else if (this.number == 16) {
    //    //console.log(number);
    //    this.id = "myVideo" + this.number;
    //    this.$refs.vueplayer[this.number - 1].load(src);
    //    //this.createdPlay(this.id);
    //    this.id = "myVideo" + 1;
    //    this.number = null;
    //    return;
    //  }
    //},
    //组件的单击事件
    handelClick(index) {
      console.log("单击使劲", index);
      this.id = this.$refs.vueplayer[index].id;
      console.log(this.$refs);
      console.log(this.id);
      this.actives = index + 1;
      this.number = index + 1;
    },
    //组件的双击事件
    handelPrevent(index, id) {
      console.log("双击");
      //var videoElement = document.getElementById(id);
      if (this.logotype) {
        //为真，则说明已经是全屏
        //var brotherList = this.$refs.videoDiv.filter((data) => {
        //  return data.id !== this.$refs.videoDiv[item - 1].id;
        //});
        //console.log(brotherList);
        this.$refs.videoDiv.forEach((element) => {
          element.style.display = "";
        });
        this.$refs.videoDiv[index].style.width = "25%";
        this.$refs.videoDiv[index].style.height = "25%";
      } else {
        //为假，则说明不是全屏
        var brotherList = this.$refs.videoDiv.filter((data) => {
          return data.id !== this.$refs.videoDiv[index].id;
        });
        console.log(brotherList);
        brotherList.forEach((element) => {
          element.style.display = "none";
        });
        this.$refs.videoDiv[index].style.width =
          this.$refs.videoClass.offsetWidth + "px";
        this.$refs.videoDiv[index].style.height =
          this.$refs.videoClass.offsetHeight + "px";
      }
      this.logotype = !this.logotype;
    },
    //关闭视频播放
    handelCloseVideo(item) {
      console.log("关闭视频播放", this.$refs.vueplayer, item);

      this.$refs.vueplayer[item - 1].stopNewVideo();
    },
  },
  async destroyed() {
    var stopArr = JSON.parse(localStorage.getItem("destoryVideo"));
    console.log(stopArr, "需要销毁的数据");
    for (let index = 0; index < stopArr.length; index++) {
      const element = stopArr[index];
      var form = {
        deviceCode: element.deviceCode,
        channelNo: element.channelNo,
      };
      console.log(form);
      try {
        var res = await gbBackStopNow(form);
      } catch (error) {
        console.log(error);
      }
    }
    localStorage.removeItem("destoryVideo");
  },
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  //padding-top: 130px;
  height: 100%;
  box-sizing: border-box;
  .videoList {
    .maidai {
      width: 100%;
      height: 40px;
    }
    .carSearch {
      width: 100%;
      height: calc(100% - 300px); /*no*/
    }
    .yt_cont {
      width: 100%;
      height: 272px; /*no*/
      border-top: 1px solid #ccc;
      display: flex;
      align-items: center;
      flex-direction: column;
      .zstz {
        margin-top: 10px; /*no*/
        span {
          margin-right: 10px; /*no*/
        }
      }
      .control_qiu_s {
        width: 140px; /*no*/
        height: 140px; /*no*/
        position: relative;
        margin: 0 auto;
        border: 1px solid #00beff; /*no*/
        border-radius: 140px; /*no*/
        // right: 0;
        // bottom: 0;
        // transform: scale(calc(380));
        // : ;
        z-index: 5;
        transform-origin: right bottom;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #00beff;
        margin-top: 18px; /*no*/
        .zuo_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: -2px; /*no*/
          top: 50%;
          margin-top: -14.5px; /*no*/
        }

        .zuoshang_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: 17px; /*no*/
          top: 50%;
          margin-top: -48.5px; /*no*/
        }
        .zuoxia_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: 17px; /*no*/
          top: 50%;
          margin-top: 18.5px; /*no*/
        }
        .youshang_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: 90px; /*no*/
          top: 50%;
          margin-top: -48.5px; /*no*/
        }
        .youxia_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: 90px; /*no*/
          top: 50%;
          margin-top: 18.5px; /*no*/
        }
        .shang_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          top: 0%;
          margin-top: -0.5px; /*no*/
        }

        .you_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          left: 111px; /*no*/
          top: 50%;
          margin-top: -14.5px; /*no*/
        }
        .xia_s {
          position: absolute;
          width: 32px; /*no*/
          /* height: 97px; */
          top: 0%;
          margin-top: 108.5px; /*no*/
        }
        .zhong {
          position: absolute;
          width: 79px; /*no*/
          height: 79px; /*no*/
          left: 50%;
          top: 50%;
          margin-left: -39.5px; /*no*/
          margin-top: -39.5px; /*no*/
        }
      }
      .zoomzu {
        margin-top: 15px;
      }
    }
    width: 440px;
    height: 100%;
    .videoItem {
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top: 20px;
      cursor: pointer;
      &:hover {
        background-color: #39c520;
      }
    }
  }
  .videoClass {
    flex: 1;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    //flex-direction: column;

    //align-items: center;
    .videoDiv {
      box-sizing: border-box;
      width: 25%;
      height: 25%;
      border: 1px solid rgb(31, 73, 210);
      background-image: url(../../public/image/black_bg.png);
      //transition: all 2s ;
      position: relative;
      &:hover .closeVideo {
        transition: all 0.6s ease-in-out;
        height: 30px;
        opacity: 0.6;
        display: block;
      }
      .closeVideo {
        //transition:  all 0s ;
        position: absolute;
        height: 0px;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #353535;
        opacity: 0;
        z-index: -9999999999999;
        //display: none;
        .stopXXX {
          display: none;
          position: absolute;
          top: 0;
          right: 15px;
          border-radius: 50%;
          height: 100%;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          //color:  #353535;
          color: white;
          //z-index: 9999999999999;
          opacity: 1;
        }
      }
    }
    .active {
      border: 2px ridge rgb(246, 247, 246);
      //background-image: none;
      //& .stopXXX{
      //  display: block !important;
      //  color: #fff !important;
      //}
    }
  }
}
</style>