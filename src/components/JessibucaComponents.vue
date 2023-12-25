<template>
  <div
    :id="id"
    class="player"
    style="width: 100%; height: 100%"
    ref="container"
    @click="handelClick"
    @dblclick.stop="handelPrevent"
  ></div>
</template>

<script>
var time = null; // 在这里定义time 为null
import { gbBackStopNow } from "@/api/kdvideo.js";
export default {
  props: {
    //url: {
    //  type: String,
    //  default:
    //    "http://172.16.0.104:28080/rtp/41130100491120000002_41130100491320000001.live.flv",
    //},
    id: {
      type: String,
      default: "tc-player",
    },
    width: {
      type: [Number, String],
      default: "100%",
    },
    height: {
      type: [Number, String],
      default: "100%",
    },
    listener: {
      type: Function,
      default() {
        return function (msg) {};
      },
    },
    live: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    src: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
    },
  },
  data() {
    return {
      jessibuca: null,
      version: "",
      wasm: false,
      vc: "ff",
      quieting: true,
      showOperateBtns: false,
      showBandwidth: false,
      err: "",
      speed: 0,
      performance: "",
      volume: 1,
      rotate: 0,
      recordType: "webm",
      scale: 0,
      url: this.src,
      data: null,
      isNotMute: false,
    };
  },
  mounted() {
    //this.create();
    // window.onerror = (msg) => (this.err = msg);
    // this.jessibuca.play("https://flvplayer.js.org/assets/video/weathering-with-you.flv");
  },
 destroyed() {
  
    if (this.jessibuca) {
      console.log(this.jessibuca, "视频对象");
      this.jessibuca.destroy();
    } else {
      return;
    }
  },
  methods: {
    handelClick() {
      if (time) {
        clearTimeout(time);
      }
      // 设置延时器 超过300ms为单击 300ms内点击则为双击事件
      time = setTimeout(() => {
        // 需要执行的逻辑代码...
        this.$emit("handelClick");
        //var src = this.src;
        //this.load(src);
      }, 300);
    },
    handelPrevent() {
      if (time) {
        // 清除延时器
        clearTimeout(time);
      }
      this.$emit("handelPrevent");
    },
    load(src, data) {
      console.log("我执行了");
      this.data = data;
      this.url = src;
      console.log(data);
      this.create();
    },
    create(options) {
      options = options || {};
      this.jessibuca = new window.Jessibuca(
        Object.assign(
          {
            container: this.$refs.container,
            videoBuffer: Number(0.2), // 缓存时长
            isResize: false,
            useWCS: this.useWCS,
            useMSE: this.useMSE,
            text: "",
            // background: "bg.jpg",
            loadingText: "加载中...",
            // hasAudio:false,
            debug: false,
            supportDblclickFullscreen: false,
            showBandwidth: true, // 显示网速
            operateBtns: {
              fullscreen: true,
              screenshot: true,
              play: true,
              audio: true,
            },
            vod: this.vod,
            forceNoOffscreen: !this.useOffscreen,
            isNotMute: this.isNotMute,
            heartTimeoutReplayTimes: 0,
            timeout: 10,
          },
          options
        )
      );

      var _this = this;
      this.jessibuca.on("load", function () {});

      this.jessibuca.on("log", function (msg) {});

      this.jessibuca.on("record", function (msg) {
        console.log("on record:", msg);
      });

      this.jessibuca.on("pause", function () {
        // _this.playing = false;
      });

      this.jessibuca.on("fullscreen", function (msg) {});

      this.jessibuca.on("mute", function (msg) {
        _this.quieting = msg;
      });

      this.jessibuca.on("audioInfo", function (msg) {
        // console.log("audioInfo", msg);
      });

      // this.jessibuca.on("bps", function (bps) {
      //   // console.log('bps', bps);
      // });
      // let _ts = 0;
      // this.jessibuca.on("timeUpdate", function (ts) {
      //     console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
      //     _ts = ts;
      // });

      this.jessibuca.on("videoInfo", function (info) {
        // console.log("videoInfo", info);
      });

      this.jessibuca.on("error", function (error) {
        console.log(error);
        if (error == "fetchError") return;
        _this.$message.error("获取视频错误");
      });

      this.jessibuca.on("timeout", function () {
        _this.$message.error("获取视频超时");
      });

      this.jessibuca.on("start", function () {
        // console.log('frame start');
      });

      this.jessibuca.on("performance", function (performance) {
        var show = "卡顿";
        if (performance === 2) {
          show = "非常流畅";
        } else if (performance === 1) {
          show = "流畅";
        }
        _this.performance = show;
      });
      this.jessibuca.on("buffer", function (buffer) {
        // console.log('buffer', buffer);
      });

      this.jessibuca.on("stats", function (stats) {
        // console.log('stats', stats);
      });

      this.jessibuca.on("kBps", function (kBps) {
        // console.log('kBps', kBps);
      });

      this.jessibuca.on("play", () => {
        // this.playing = true;
        // this.loaded = true;
        console.log("视频播放");
        _this.quieting = _this.jessibuca.isMute();
      });

      this.jessibuca.on("recordingTimestamp", (ts) => {
        // console.log('recordingTimestamp', ts);
      });

      this.jessibuca.play(this.url);
      // console.log(this.jessibuca);
    },
    // play() {
    //   // this.jessibuca.onPlay = () => (this.playing = true);

    //   // if (this.$refs.playUrl.value) {
    //     // this.jessibuca.play(this.$refs.playUrl.value);
    //     this.jessibuca.play("https://flvplayer.js.org/assets/video/weathering-with-you.flv");
    //   // }
    // },
    mute() {
      // this.isNotMute = false
      //jessibuca.isMute()
      this.jessibuca.mute();
    },
    cancelMute() {
      // this.isNotMute = true
      this.jessibuca.cancelMute();
    },
    pause() {
      this.jessibuca.pause();
      // this.playing = false;
      this.err = "";
      this.performance = "";
    },
    volumeChange() {
      this.jessibuca.setVolume(this.volume);
    },
    rotateChange() {
      this.jessibuca.setRotate(this.rotate);
    },
    destroy() {
      if (this.jessibuca) {
        this.jessibuca.destroy();
      }
      this.create();
      // this.playing = false;
      // this.loaded = false;
      this.performance = "";
    },
    fullscreen() {
      if (!this.jessibuca) return;
      return this.jessibuca.setFullscreen(true);
    },
    clearView() {
      this.jessibuca.clearView();
    },
    close() {
      if (!this.jessibuca) return;
      return this.reset();
    },
    // startRecord() {
    //   const time = new Date().getTime();
    //   this.jessibuca.startRecord(time, this.recordType);
    // },

    // stopAndSaveRecord() {
    //   this.jessibuca.stopRecordAndSave();
    // },
    reset() {
      if (this.jessibuca) {
        this.jessibuca.destroy();
      }
      this.jessibuca = null;
      this.url = "";
    },
    screenShot() {
      this.jessibuca.screenshot();
    },
    status() {
      return this.jessibuca && this.jessibuca.isPlaying();
    },
    //关闭视频流
    async stopNewVideo() {
      if (!this.data) {
        this.$message.error("无视频播放");
        return;
      }
      var closeID = "closeVideo" + this.data.number;
      var closeDom = document.getElementById(closeID);
      closeDom.style.zIndex = -9999999;
      //closeDom.style.color = white;
      console.log("关闭当前视频通道");
      var form = {
        deviceCode: this.data.deviceCode,
        channelNo: this.data.channelNo,
      };
      try {
        var res = await gbBackStopNow(form);
      } catch (error) {
        console.log(error);
      }
      //清理画布为黑色背景
      await this.jessibuca.clearView();
      // 关闭视频，释放底层资源
      await this.jessibuca.destroy();
      console.log(res, this.data.number);
      setTimeout(() => {
        var domStr = "videoDiv" + (this.data.number - 1);
        var parentElement = document.getElementById(domStr);
        var childElements = parentElement.querySelectorAll(
          ".jessibuca-play-big"
        );
        console.log(
          this.data.number,
          domStr,
          parentElement,
          childElements,
          "Sssssssss"
        );
        console.log(jessibucaPlayBig, domStr);
        if (childElements[0]) {
          childElements[0].style.display = "none";
        }

        console.log(jessibucaPlayBig);
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  background: #353535;
  background-size: 60px 60px;
}
</style>

