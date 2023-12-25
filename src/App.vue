<template>
  <div id="app" :data-theme="nowThemeInfo" @click="handleClick">
    <div id="jc_header" v-if="jcHeaderShow">
      <div class="header_left">
        <div class="title-box">
          <div class="title-item">
            <router-link class="nav_link" to="/index"> 综合预览 </router-link>
          </div>
          <!-- <div class="title-item">
            <router-link class="nav_link" to="/collectInfo">
              采集信息
            </router-link>
          </div> -->
          <div class="title-item">
            <router-link class="nav_link" to="/collectionRet">
              人像检索
            </router-link>
          </div>
          <div class="title-item">
            <router-link class="nav_link" to="/collectionRetCar">
              车牌检索
            </router-link>
          </div>
          <div class="title-item">
            <router-link class="nav_link" to="/warningInfo">
              预警信息
            </router-link>
            <div class="qipao">
              <span>{{ yjnum }}{{ yjnum ? "+" : "" }}</span>
            </div>
          </div>
          <div class="title-item">
            <router-link class="nav_link" to="/jldt"> 警力地图 </router-link>
          </div>
          <!--<div class="title-item">
            <router-link class="nav_link" to="/sjch"> 手机串号 </router-link>
          </div>-->
        </div>
        <div class="title-img title-left-img"></div>
      </div>
      <div class="header-center">
        <!--<template v-if='!$appname'>
          <div class="title-center">智慧警车大数据平台</div>
        </template>
        <template v-if='$appname'>
          <div class="title-center">{{$appname}}</div>
        </template>-->

        <div class="title-center">{{ xianming }}</div>
        <div class="title-img title-center-img"></div>
      </div>
      <div class="header-right">
        <div class="title-box">
          <div class="title-item">
            <router-link @click.native="shuaix" class="nav_link" to="/diaodu">
              视频调度
            </router-link>
          </div>
          <div class="title-item">
            <router-link class="nav_link" to="/obtainEvidence">
              视频取证
            </router-link>
          </div>
          <!--<template v-if='$route.path!="/diaodu" && $route.path!="/obtainEvidence"'>-->
          <div class="title-item">
            <a class="nav_link" @click="df()"> 即时通讯 </a>
            <div class="qipao">
              <span>{{ unreadnum }}{{ unreadnum ? "+" : "" }}</span>
            </div>
          </div>
          <!--</template>-->
          <!--<div class="title-item">
            <router-link class="nav_link" to="/patrolTrack">
              巡防轨迹
            </router-link>
          </div>-->
          <div class="title-item">
            <router-link class="nav_link" to="/statisticalInfo">
              统计信息
            </router-link>
          </div>

          <div class="title-item">
            <a class="nav_link" @click="setPage"> 系统设置 </a>
          </div>

          <!--<div class="title-item" v-if="chatshow == 1 ? true : false">
            <a class="jstx" target="_blank" href="/chat/index.html">即时通讯</a>
          </div>-->

          <!--<div class="title-item">
            <a class="jstx" target="_blank" @click="df()">即时通讯</a>
            <div class='qipao' v-if='unreadnum!=0'>{{unreadnum}}</div>
          </div>-->

          <!--<div class='feis'>
            <div class="set-icon-wx" @click="df()">
              <img class='iconss' src='./assets/image/djj.svg'  />
              <div class='qipao' >{{unreadnum}}</div>
            </div>
            <div class="set-icon" @click="setPage"></div>
          </div>-->
        </div>
        <div class="title-img title-right-img"></div>
      </div>
    </div>

    <div id="jc_footer">
      <keep-alive :include="tagsList">
        <router-view></router-view>
      </keep-alive>
    </div>
    <div class="spring-frame" v-show="detailBox">
      <detail-face
        v-show="detailBoxType == 1"
        :displayShow="detailBoxType == 1"
      ></detail-face>

      <DetailFacewl
        v-show="detailBoxType == 11"
        :displayShow="detailBoxType == 11"
      />

      <DetailCarwl
        v-show="detailBoxType == 12"
        :displayShow="detailBoxType == 12"
      />

      <upload-img-box v-show="detailBoxType == 2"></upload-img-box>
      <detail-car
        v-show="detailBoxType == 3"
        :displayShow="detailBoxType == 3"
      ></detail-car>

      <change-pwd v-show="detailBoxType == 5"></change-pwd>
      <collect-detail-face
        v-show="detailBoxType == 6"
        :displayShow="detailBoxType == 6"
      ></collect-detail-face>
      <collect-detail-car
        v-show="detailBoxType == 7"
        :displayShow="detailBoxType == 7"
      ></collect-detail-car>
      <ret-face
        v-show="detailBoxType == 9"
        :displayShow="detailBoxType == 9"
      ></ret-face>
      <caiji-detail
        v-show="detailBoxType == 10"
        :displayShow="detailBoxType == 10"
      ></caiji-detail>
      <!-- <car-trail
        v-show="detailBoxType == 10"
        :displayShow="detailBoxType == 10"
      ></car-trail> -->
      <div class="close-img" @click="closeDetail">
        <div class="close-icon"></div>
      </div>
    </div>

    <div v-show="warnVideoshow">
      <warnVideo
        :warnvideodata="warnvideodata"
        :warnVideoshow="warnVideoshow"
        @warnvideo_qxss="warnvideo_qxss"
      />

      <!-- <div class="close-img" @click="warnVideoshow=false">
          <div class="close-icon"></div>
        </div> -->
    </div>

    <FeedbackFace
      v-if="fankui_show"
      class="fankui"
      :fankui_data="fankui_data"
      @yincang_fankui="fankui_close"
    >
    </FeedbackFace>
    <!--<FeedbackPhone
      v-if="fankuich_show"
      :fankui_data="fankuich_data"
      @yincang_fankui="fankuich_close"
    ></FeedbackPhone>-->
    <div class="jstx_box">
      <el-dialog
        title="即时通讯"
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="true"
        @opened="openXX"
      >
        <div class="jstx">
          <div class="tx_top" ref="tx_Top">
            <ul @scroll="handelScroll" ref="tx_top">
              <li
                v-for="data in TXhistory"
                :key="data.id"
                :ref="`${data.id}`"
                :class="
                  data.isRight
                    ? data.isRight == 'both'
                      ? 'TXactive_both'
                      : 'TXactive_right '
                    : ' TXactive_left'
                "
              >
                <div v-if="data.is_show_time" class="message-time-wrap">
                  {{ data.show_time }}
                </div>
                <div
                  class="TXitem"
                  :class="
                    data.isRight
                      ? data.isRight == 'both'
                        ? 'myInforcenter'
                        : 'myInfor'
                      : ' '
                  "
                >
                  <div :class="data.isRight == 'both' ? 'myInforTime' : ''">
                    <el-avatar size="large" :src="img"></el-avatar>
                  </div>
                  <div
                    style="margin-left: 5px"
                    :class="data.isRight ? 'myName' : ' '"
                  >
                    <p style="margin-bottom: 4px">{{ data.createName }}</p>
                    <div
                      class="TXxiaoxi"
                      :class="data.isRight == 'both' ? 'timeTXxiaoxi' : ''"
                    >
                      <div
                        :class="
                          data.isRight
                            ? 'tip-trangle-right'
                            : 'tip-trangle-left'
                        "
                      ></div>
                      <div v-if="data.type == 1">{{ data.content }}</div>
                      <div v-else-if="data.type == 2">
                        <!--<img :src="data.content" width="200px" alt="" />-->
                        <el-image
                          style="width: 200px"
                          :src="data.content"
                          :preview-src-list="srcList"
                          @click="handelBigImage(data.content)"
                          @load="handelLoading(data.content)"
                        >
                        </el-image>
                      </div>
                      <div v-else-if="data.type == 3">
                        <video
                          :src="data.content"
                          controls="controls"
                          width="200px"
                        ></video>
                      </div>
                      <div v-else-if="data.type == 4">
                        <audio
                          v-if="data.content.slice(-3) !== 'amr'"
                          width="200px"
                          controls="controls"
                        >
                          <source :src="data.content" type="audio/mpeg" />
                          <source :src="data.content" type="audio/ogg" />
                          <!--<source :src="data.content" type="audio/Wav" />-->
                          您的浏览器不支持 audio 标签
                        </audio>
                        <div
                          v-else
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                          "
                        >
                          <!--   style="width: 50px; height: 50px" -->
                          <p
                            @click="handelAmr(data.content)"
                            style="margin-right: 10px"
                          >
                            amr格式的音频
                          </p>
                          <el-image
                            style="width: 30px"
                            :src="img_video"
                          ></el-image>
                        </div>
                      </div>
                      <div v-else class="wenjai">
                        <a :href="data.content">
                          <!--<i class="el-icon-document"></i>-->
                          <el-image
                            style="width: 50px; height: 50px"
                            :src="img_wenjian"
                          ></el-image>
                        </a>
                        <div style="font-size: 16px; margin: 10px">
                          <p>{{ data.fileName }}</p>
                          <p>{{ KB(data.fileSize) }}</p>
                        </div>
                        <!--<el-link @click="xiazai(data.content)"
                        >查看<i class="el-icon-view el-icon--right"></i>
                      </el-link>-->
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tx_btn">
            <el-popover
              placement="left-end"
              width="500"
              height="700"
              trigger="click"
              v-model="emojiShow"
            >
              <el-button type="text" slot="reference">😀</el-button>
              <div class="browBox">
                <ul>
                  <li
                    v-for="(item, index) in faceList"
                    :key="index"
                    @click="getBrow(index)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </el-popover>
            <!--<el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button
              type="text"
              icon="el-icon-picture"
              @click="imgInput"
            ></el-button>
          </el-upload>-->
            <el-button
              type="text"
              icon="el-icon-upload"
              @click="imgInput"
            ></el-button>
            <!-- 用于读取图片 -->
            <input
              class="input-img"
              type="file"
              ref="imgInput"
              style="display: none"
              @change="imgSend"
            />
            <!-- accept="image/*" -->
            <!--<el-button type="text" icon="el-icon-video-camera"></el-button>
          <el-button type="text" icon="el-icon-s-help"></el-button>-->
          </div>
          <div class="tx_bottom">
            <el-input
              v-model="tx"
              placeholder="请输入内容"
              type="textarea"
              maxlength="3000"
              resize="none"
            ></el-input>
            <el-button type="primary" round @click="txSend">发送</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <!--  style="display: none" -->
    <video
      style="display: none"
      ref="first_img"
      id="myVideo"
      controls="false"
      autoplay="false"
      preload="metadata"
      :src="first_img_src"
    ></video>

    <a id="xz" href="/TSBrowser.exe" download style="display: none">sss</a>
  </div>
</template>

<script>
//import { onPaste } from "@/utils/ctrlCV.js";
import PubSub from "pubsub-js";
import DetailFace from "@/components/springframe/DetailFace.vue";
import DetailFacewl from "@/components/springframe/DetailFacewl.vue";
import UploadImgBox from "@/components/springframe/UploadImgBox.vue";
import DetailCar from "@/components/springframe/DetailCar.vue";
import DetailCarwl from "@/components/springframe/DetailCarwl.vue";
import FeedbackCar from "@/components/springframe/FeedbackCar.vue";
import FeedbackFace from "@/components/springframe/FeedbackFace.vue";
import FeedbackPhone from "@/components/springframe/FeedbackPhone.vue";
import ChangePwd from "@/components/springframe/ChangePwd.vue";
import CollectDetailFace from "@/components/springframe/CollectDetailFace.vue";
import CollectDetailCar from "@/components/springframe/CollectDetailCar.vue";
import warnVideo from "@/components/springframe/warnVideo.vue";
import RetFace from "@/components/springframe/RetFace.vue";
import { v4 } from "uuid";
import CarTrail from "@/components/springframe/CarTrail.vue";
import CaijiDetail from "@/components/springframe/caijiDetail.vue";
import { Message, Loading } from "element-ui";
import { gyxyFaceWarning_s, gyxyPlateWarning_s } from "@/api/warningInfo.js";
import { convertBase64UrlToImgFile } from "@/utils/base64file.js";
//amr音频转换
import BenzAMRRecorder from "benz-amr-recorder";
const appData = require("@/assets/image/emojis.json");
//即时通讯时间归类处理
import dayjs from "dayjs";
import messageDateMixin from "@/utils/messageDateMixin.js";
function compareTimeInterval(t1, t2) {
  return dayjs(t2) - dayjs(t1) >= 300000 ? true : false;
}


export default {
  name: "app",
  mixins: [messageDateMixin],
  data() {
    return {
    
      yuming: "",
      TXhistory: [],
      TX_webscok: null,
      fileList: [],
      gengxin: false,
      pageNo: 1,
      duration: null,
      amr: null,
      fangfouTimer: null,
      scrollTop: "",
      srcList: null,
      personInfo: "后台管理",
      timeText: "",
      first_img_src: "",
      img: require("@/assets/image/user.png"),
      img_wenjian: require("@/assets/image/wenjian.png"),
      img_video: require("@/assets/image/video.png"),
      //表情框是否展示
      emojiShow: false,
      //表情列表
      faceList: [],
      //表情文本
      getBrowString: "",
      tx: "",
      yjnum: sessionStorage.yujingnum ? sessionStorage.yujingnum : 0,
      unreadnum: 0,
      nowThemeInfo: "image",
      tagsList: [
        "index",
        "collectInfo",
        "warningInfo",
        "collectionRet",
        "collectionRetCar",
        // "videoDispatch",
        "statisticalInfo",
      ],
      detailBox: false,
      detailBoxType: 6,
      jcHeaderShow: false,
      warnVideoshow: false,

      warnvideodata: "",

      fankui_data: null,
      fankuich_show: false,
      fankui_show: false,

      startTime: "",

      endTime: "",

      chatshow: sessionStorage.isshow_chat
        ? JSON.parse(sessionStorage.isshow_chat).value
        : 0,

      dialogTableVisible: false,

      xianming: sessionStorage.xianming
        ? sessionStorage.xianming
        : "智慧警车大数据平台",
    };
  },
  created() {
    this.loadEmojis();
    sessionStorage.setItem("Webscocket", "172.16.0.104");
    if (process.env.VUE_APP_ISSAME == "yes") {
      //console.log("线上");
      this.yuming = document.domain;
    } else {
      //console.log("线下");
      this.yuming = sessionStorage.getItem("Webscocket");
    }
  },
  destroyed() {},
  computed: {
    KB: () => {
      return (size) => {
        //console.log(size);
        let kb = 1024;
        let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let i = Math.floor(Math.log(size) / Math.log(kb));
        // let unit = size < 1024 ? 'KB' : size < 1024*1024 ? 'MB'
        return (size / Math.pow(kb, i)).toPrecision(3) + " " + unit[i];
      };
    },
  },
  watch: {},
  methods: {
    handleClick(event) {
      //y用于关闭反馈框======点击空白
      const modalElement = document.querySelector(".fankui");
      if (modalElement && !modalElement.contains(event.target)) {
        this.fankui_close();
      }
    },
    async ggp(isall = false) {
      var loading_lo;

      try {
        var res = await gyxyFaceWarning_s({
          pageNo: 1,
          pageSize: 20,
          selectType: "",
          departId: "",
          fromCar: "",
          timeStart: this.startTime ? this.startTime : "",
          timeEnd: this.endTime ? this.endTime : "",
        });

        if (res && res.result) {
          sessionStorage.setItem("yujingnum", res.result.total);
          this.yjnum = res.result.total;
        }
      } catch (err) {
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
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
    shuaix() {
      sessionStorage.setItem("obchushi", 1);
    },
    async getxianming() {
      var name = await getRegionName();
      this.xianming = name.result;
    },
    df() {
      if (
        this.$route.path == "/diaodu" ||
        this.$route.path == "/obtainEvidence"
      ) {
        sessionStorage.setItem("showship", 1);

        this.$router.push({
          path: "/index",
        });
      }
      //   const ws = new WebSocket('ws://172.16.0.104:20009?carNumber=dddd');

      //ws.addEventListener('message', (event) => {
      //  const div = document.createElement('div');
      //  div.innerText = event.data;
      //  document.body.append(div);
      //})

      //// 点击发送按钮，将输入框中的内容发送给服务器
      //const input = document.querySelector('input')
      //const btn = document.querySelector('button');
      //console.log("按钮",btn);
      //btn.onclick = () => {
      //  ws.send(input.value);
      //  input.value = '';
      //}
      this.dialogTableVisible = true;
      //$("body .demo-class").show();
    },
    df2() {
      var userInfo = JSON.parse(sessionStorage.getItem("UserInfo"));

      if (!userInfo || !userInfo.phone) {
        Message({
          showClose: true,
          message: "登录失效或用户手机号未配置",
          type: "error",
          duration: 2000,
        });
        return false;
      }

      // window.open("http://121.37.25.71:23232/");

      var a;
      layui.use("layer", function () {
        //独立版的layer无需执行这一句
        var $ = layui.jquery,
          layer = layui.layer; //独立版的layer无需执行这一句

        layer.open({
          type: 2,
          title: "即时通讯",
          area: ["830px", "620px"],
          id: "layerDemo" + v4(), //防止重复弹出

          content: "/newim/#/login",
          skin: "demo-class",

          maxmin: true,
          // minStack:false,
          // ,content: 'http://localhost:3000'
          // ,btn: ['点击安装极速浏览器']
          shade: 0, //不显示遮罩
          yes: function () {
            // location.href='/se13.exe'
            // window.open('/TSBrowser.exe')

            // a.href = URL.createObjectURL(blob)
            // console.log(a.href)
            // a.download = '/TSBrowser.exe' // 下载文件的名字
            // // a.download = url.split('/')[url.split('/').length -1] //  // 下载文件的名字
            // document.body.appendChild(a)
            // a.click()

            // alert($('#xz'))
            // $('#xz').trigger('click')
            // $(window.parent.document).find('#xz').click()
            document.getElementById("xz").click();
          },
          min: function (layero, index) {
            $("body .demo-class").hide();
            return false;
            // setTimeout(function(){
            //   var dfk = $('.jstx').offset()
            //   var jshei = $('.jstx').height()

            //   layero.css({'left': dfk.left-100,'top':dfk.top+jshei})
            // })
          },
          close: function (layero, index) {
            $("body .demo-class").hide();
            return false;
          },
        });
      });
    },
    warnvideo_qxss() {
      this.warnVideoshow = false;
    },
    closeDetail() {
      this.detailBox = false;
      this.detailBoxType = -1;
    },
    fankui_close() {
      this.fankui_show = false;
    },
    setPage() {
      this.$router.push("/setPage");
    },
    initWebSocket() {
      if (process.env.VUE_APP_ISSAME == "yes") {
        var wsuri = `ws://${document.domain}:8089`;
        //var wsuri = `ws://41.210.0.123:8089`;
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      } else {
        let webscok = sessionStorage.Webscocket;
        var wsuri;
        wsuri = `ws://${webscok}:8089`;
        //var wsuri = `ws://41.201.0.218:8089`
        //var wsuri = `ws://41.209.9.213:8089`
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      }
    },

    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = "leadingEnd";
      this.websocketsend(actions);

      console.log("链接成功");
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
      //console.log('连接建立失败重连')
    },
    websocketonmessage(e) {
      var shishi = process.env.VUE_APP_SHISHI;

      //数据接收
      let res = JSON.parse(e.data);
      //console.log(res, "ascsadcsdahcvsacjvjsa=====");

      if (res.indexOf(`${shishi}_5`) != -1) {
        var reg = new RegExp(`${shishi}_5-`);
        var a = res.replace(reg, "");

        var ob = JSON.parse(a);

        PubSub.publish("caiji-face", ob);
      } else if (res.indexOf(`${shishi}_6`) != -1) {
        var reg = new RegExp(`${shishi}_6-`);
        var a = res.replace(reg, "");

        var ob = JSON.parse(a);

        PubSub.publish("caiji-car", ob);
      } else if (res.indexOf(`${shishi}_7`) != -1) {
        var reg = new RegExp(`${shishi}_7-`);
        var a = res.replace(reg, "");

        var ob = JSON.parse(a);

        var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
        mp3.load();
        mp3.play();
        // var reg2 = new RegExp("%");
        // var a2 = ob.points.replace(reg2,"");

        // ob.points = a2

        ob.createTime = this.zhuan(ob.createTime);
        PubSub.publish("warn-face", ob);
      } else if (res.indexOf(`${shishi}_8`) != -1) {
        var reg = new RegExp(`${shishi}_8-`);
        var a = res.replace(reg, "");

        var ob = JSON.parse(a);

        var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
        mp3.load();
        mp3.play();

        ob.createTime = this.zhuan(ob.createTime);
        PubSub.publish("warn-cp", ob);
      } else if (res.indexOf(`${shishi}_9`) != -1) {
        var reg = new RegExp(`${shishi}_9-`);
        var a = res.replace(reg, "");

        var ob = JSON.parse(a);

        if (!ob.carId) {
          ob.carId = ob.id;
        }
        ob.updateTime = this.zhuan(ob.updateTime);
        //console.log(ob,"警车数据更新");
        PubSub.publish("jc_updata", ob);
      }

      // PubSub.publish("jc_updata", ob);
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose() {
      //关闭
      // console.log('断开连接',e);
    },
    setPage() {
      this.$router.push("/setPage");
    },

    zhuan(data) {
      let d = new Date(data);
      let date =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();

      return date;
    },
    //即时通讯
    jstx() {
      this.TX_webscok = new WebSocket(
        `ws://${this.yuming}:20009?carNumber=${this.personInfo}`
      );
      var that = this;
      this.TX_webscok.onopen = function (event) {
        console.log("WebSocket is open now.");
      };

      this.TX_webscok.addEventListener("message", (event) => {
        this.unreadnum = this.unreadnum + 1;
        var aaa = JSON.parse(event.data);
        //处理最新消息时间，与上一条时间做比对
        // aaa.createTime = dayjs(aaa.createTime).format("YYYY-MM-DD HH:mm:ss");
        aaa.show_time_type = 1;
        aaa.show_time = dayjs(aaa.createTime).format("H:mm");
        aaa.is_show_time = compareTimeInterval(
          this.TXhistory[this.TXhistory.length - 1].createTime,
          aaa.createTime
        );;
        if (aaa.createName == this.personInfo) {
          aaa.isRight = true;
        } else {
          aaa.isRight = false;
        }
        this.TXhistory.push(aaa);
        this.$nextTick(() => {
          this.$refs.tx_top.scrollTop = this.$refs.tx_top.scrollHeight;
        });
      });
      // 监听可能发生的错误
      this.TX_webscok.addEventListener("error", (event) => {
        console.log("WebSocket error: ", event);
        this.jstx();
      });
    },
    //即时通讯--发送
    txSend() {
      //
      //console.log(this.TX_webscok, "即时通讯执行");
      if (this.tx.length != 0) {
        var timer = +new Date();
        var msgDate = {
          type: 1,
          content: this.tx,
          createName: this.personInfo,
          msgTag: timer,
        };
        var msgDATE = JSON.stringify(msgDate);
        this.TX_webscok.send(msgDATE);
        this.tx = "";
      } else {
        this.$message.error("不能发送空消息");
      }
    },
    //表情包
    //加载表情，存放到表情列表中
    loadEmojis() {
      for (let i in appData) {
        this.faceList.push(appData[i].char);
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.tx += this.getBrowString;
        }
      }
      this.emojiShow = false;
    },
    // DivEditable.vue
    //async onPaste(event) {
    //  const result = await onPaste(event);
    //   const imgRegx = /^data:image/png|jpg|jpeg|gif|svg|bmp|tif/
    //  //console.log('处理后的粘贴数据', result);

    //   // 支持的图片格式
    //  if(imgRegx.test(result.compressedDataUrl)) {
    //    // document.execCommand('insertImage', false, result.compressedDataUrl);
    //    const sel = window.getSelection(); // 获取当前光标位置
    //    if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
    //      const range = sel.getRangeAt(0);
    //      const img = new Image();
    //      img.src = result.compressedDataUrl; // 使用压缩后的图片
    //      range.insertNode(img);
    //      range.collapse(false);
    //      sel.removeAllRanges();
    //      sel.addRange(range);
    //    }
    //  }
    //}
    //历史消息
    //滚动事件监听
    handelScroll() {
      if (this.fangfouTimer !== null) {
        clearTimeout(this.fangfouTimer);
      }
      this.fangfouTimer = setTimeout(() => {
        if (this.$refs.tx_top.scrollTop < 2 && !this.gengxin) {
          this.getMoreMsg();
        }
      }, 200);

      //if (this.$refs.tx_top.scrollTop + this.$refs.tx_top.clientHeight == this.$refs.tx_top.scrollHeight) {
      //  console.log("加载更多");
      //}
    },
    //加载更多历史消息
    getMoreMsg() {
      this.pageNo = this.pageNo + 1;
      fetch(
        `http://${this.yuming}:19999/imMessage/list?pageNo=${this.pageNo}&pageSize=10`
      )
        .then((res) => res.json())
        .then((data) => {
          data.result.records.map((item) => {
            if (item.createName == this.personInfo) {
              item.isRight = true;
            } else {
              item.isRight = false;
            }
          });

         
          var timer_msg = this.checkShowRule(
            [...data.result.records.reverse(), this.TXhistory[0]],
            "createTime"
          );
          this.$set(
            this.TXhistory[0],
            "is_show_time",
            timer_msg[timer_msg.length - 1].is_show_time
          );
          timer_msg.splice(timer_msg.length - 1, 1);
         
          if (data.result.records.length == 0) {
            this.gengxin = true;
            this.$message.error("没有更多了");
          } else {
            this.gengxin = false;
          }
          //var aaa = this.TXhistory;
          let newArr = [...timer_msg, ...this.TXhistory];
          //TODO:每次加载，新消息+旧消息 重新时间处理，可优化；
          this.TXhistory = newArr;
         
          this.$nextTick(() => {
            var aaa = this.$refs.tx_top.scrollHeight;
            var sss = this.$refs.tx_Top.clientHeight;
         
            this.$refs.tx_top.scrollTop = aaa - this.scrollTop;
            this.scrollTop = this.$refs.tx_top.scrollHeight;
          });
        });
    },
    //图片上传
    imgInput() {
      this.$refs.imgInput.click();
    },
    //图片发送
    imgSend() {
      var updatyeType;
      if (!this.$refs.imgInput.files[0]) {
        this.$message.error("请选择需要上传的音频，视频或图片");
      }
      var filesType = this.$refs.imgInput.files[0].type;
      if (
        filesType == "video/webm" ||
        filesType == "video/ogg" ||
        filesType == "video/mp4"
      ) {
        console.log("视频");
        updatyeType = 3;
      } else if (
        filesType == "audio/midi" ||
        filesType == "audio/mpeg" ||
        filesType == "audio/webm" ||
        filesType == "audio/ogg" ||
        filesType == "audio/wav"
      ) {
        console.log("音频");
        updatyeType = 4;
        this.first_img_src = this.$refs.imgInput.value;
        // this.$refs.first_img.canplay()
      } else if (
        filesType == "image/gif" ||
        filesType == "image/png" ||
        filesType == "image/jpeg" ||
        filesType == "image/bmp" ||
        filesType == "image/webp" ||
        filesType == "image/x-icon" ||
        filesType == "image/vnd.microsoft.icon"
      ) {
        console.log("图片");
        updatyeType = 2;
      } else {
        //this.$message.error("上传格式错误！");
        console.log("文件");
        updatyeType = 5;
      }
      if (updatyeType) {
        //console.log(updatyeType);
        const formData = new FormData();
        formData.append("file", this.$refs.imgInput.files[0]);
        formData.append("biz", "im-start");
        if (updatyeType == 1 || updatyeType == 2) {
          fetch(`http://${this.yuming}:9999/imMessage/uploadMinioV2`, {
            method: "POST",
            //headers: {
            //  //'Content-Type': 'application/json'
            //  "Content-Type": "multipart/form-data"
            //},
            body: formData,
            //body: JSON.stringify(this.$refs.imgInput.files[0]),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "上传视频第一帧图片");
              var timer = +new Date();
              var msgDate = {
                type: updatyeType,
                content: data.result.file,
                createName: this.personInfo,
                msgTag: timer,
              };
              var msgDATE = JSON.stringify(msgDate);
              this.TX_webscok.send(msgDATE);
            });
        }
        if (updatyeType == 3) {
          var url = URL.createObjectURL(this.$refs.imgInput.files[0]);
          this.first_img_src = url;
          this.$refs.first_img.addEventListener("canplay", () => {
            var canvas = document.createElement("canvas");
            canvas.width = this.$refs.first_img.videoWidth;
            canvas.height = this.$refs.first_img.videoHeight;
            canvas
              .getContext("2d")
              .drawImage(
                this.$refs.first_img,
                0,
                0,
                canvas.width,
                canvas.height
              );
            var imageURI = canvas.toDataURL("image/jpeg");
            var imageURIS = imageURI.slice(23);

            var fileName = new Date().getTime() + ".jpeg"; //随机文件名
            var imgfile = convertBase64UrlToImgFile(
              imageURIS,
              fileName,
              "image/jpeg"
            ); //转换成file
            formData.append("file1", imgfile);
            fetch(`http://${this.yuming}:9999/imMessage/uploadMinioV2`, {
              method: "POST",
              //headers: {
              //  //'Content-Type': 'application/json'
              //  "Content-Type": "multipart/form-data"
              //},
              body: formData,
              //body: JSON.stringify(this.$refs.imgInput.files[0]),
            })
              .then((res) => res.json())
              .then((data) => {
                
                var timer = +new Date();
                var msgDate = {
                  type: updatyeType,
                  content: data.result.file,
                  createName: this.personInfo,
                  msgTag: timer,
                  videoFirstPic: data.result.file1,
                };
                var msgDATE = JSON.stringify(msgDate);
                this.TX_webscok.send(msgDATE);
              });
            return;
          });
        }
        if (updatyeType == 4) {
          var url = URL.createObjectURL(this.$refs.imgInput.files[0]);
          var audio = new Audio(url);
          audio.addEventListener("canplay", () => {
            this.duration = audio.duration;
            console.log("音频时长为：" + this.duration + "秒");
          });
          fetch(`http://${this.yuming}:9999/imMessage/uploadMinioV2`, {
            method: "POST",
            //headers: {
            //  //'Content-Type': 'application/json'
            //  "Content-Type": "multipart/form-data"
            //},
            body: formData,
            //body: JSON.stringify(this.$refs.imgInput.files[0]),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "上传视频第一帧图片");
              var timer = +new Date();
              var msgDate = {
                type: updatyeType,
                content: data.result.file,
                createName: this.personInfo,
                msgTag: timer,
                duration: this.duration,
              };
              var msgDATE = JSON.stringify(msgDate);
              this.TX_webscok.send(msgDATE);
            });
          return;
        }
        if (updatyeType == 5) {
          console.log("其他文件");
          var fileSize = this.$refs.imgInput.files[0].size;
          var fileName = this.$refs.imgInput.files[0].name;
          console.log(fileSize, fileName);
          fetch("http://${this.yuming}:9999/imMessage/uploadMinioV2", {
            method: "POST",
            //headers: {
            //  //'Content-Type': 'application/json'
            //  "Content-Type": "multipart/form-data"
            //},
            body: formData,
            //body: JSON.stringify(this.$refs.imgInput.files[0]),
          })
            .then((res) => res.json())
            .then((data) => {
              var timer = +new Date();
              var msgDate = {
                type: updatyeType,
                content: data.result.file,
                createName: this.personInfo,
                msgTag: timer,
                fileSize,
                fileName,
              };
              var msgDATE = JSON.stringify(msgDate);
              this.TX_webscok.send(msgDATE);
            });
        }
        //fetch(`http://${this.yuming}:9999/imMessage/uploadMinioV2`, {
        //  method: "POST",
        //  //headers: {
        //  //  //'Content-Type': 'application/json'
        //  //  "Content-Type": "multipart/form-data"
        //  //},
        //  body: formData,
        //  //body: JSON.stringify(this.$refs.imgInput.files[0]),
        //})
        //  .then((res) => res.json())
        //  .then((data) => {
        //    console.log(data, "上传视频第一帧图片");
        //    var timer = +new Date();
        //    var msgDate = {
        //      type: updatyeType,
        //      content: data.result.file,
        //      createName: this.personInfo,
        //      msgTag: timer,
        //    };
        //    var msgDATE = JSON.stringify(msgDate);
        //    this.TX_webscok.send(msgDATE);
        //  });
      } else {
      }
    },
    //打开默认滚动条在底部
    openXX() {
      var sss = this.$refs.tx_Top.clientHeight;
      this.$refs.tx_top.scrollTop = this.$refs.tx_top.scrollHeight - sss;
      this.scrollTop = this.$refs.tx_top.scrollHeight;
      this.unreadnum = 0;
    },
    //文件下载
    xiazai(url) {

      window.open(url);
    },
    //大图预览
    handelBigImage(url) {
      var aaa = [];
      aaa.push(url);
      this.srcList = aaa;
    },
    handelLoading(url) {
      this.handelBigImage(url);
    },
    //amr 音频转换
    handelAmr(url) {
      this.amr = new BenzAMRRecorder();
      this.amr
        .initWithUrl(url)
        .then(() => {
          this.amr.play();
        })
        .catch((e) => {
          this.$message.error("播放失败");
        });
    },
    //接口没获取一次数据====添加时间
    addTimerText(histimer, hisId) {
      var HisTimer = new Date(histimer);
      //var Hisy = HisTimer
      var Hisy = HisTimer.getFullYear();
      var Hism = HisTimer.getMonth() + 1;
      var Hisd = HisTimer.getDate();
      var HisH =
        HisTimer.getHours() > 9
          ? HisTimer.getHours()
          : "0" + HisTimer.getHours();
      var HiM =
        HisTimer.getMinutes() > 9
          ? HisTimer.getMinutes()
          : "0" + HisTimer.getMinutes();
      var newTimer = new Date();
      var ny = newTimer.getFullYear();
      var nm = newTimer.getMonth() + 1;
      var nd = newTimer.getDate();
      var showTimer;
      if (Hisy == ny) {
        if (Hism == nm) {
          if (Hisd == nd - 1) {
            this.timeText = "昨天 " + HisH + ":" + HiM;
            var aaa = HisTimer.getDay();
          } else if (Hisd == nd) {
            this.timeText = HisH + ":" + HiM;
          } else {
            var aaa = HisTimer.getDay();
            switch (aaa) {
              case 1:
                this.timeText = "周一" + HisH + ":" + HiM;
                break;
              case 2:
                this.timeText = "周二" + HisH + ":" + HiM;
                break;
              case 3:
                this.timeText = "周三" + HisH + ":" + HiM;
                break;
              case 4:
                this.timeText = "周四" + HisH + ":" + HiM;
                break;
              case 5:
                this.timeText = "周五" + HisH + ":" + HiM;
                break;
              case 6:
                this.timeText = "周六" + HisH + ":" + HiM;
                break;

              default:
                this.timeText = "周日" + HisH + ":" + HiM;
                break;
            }
            //this.timeText = HisTimer.getDay();
          }
        } else {
          this.timeText =
            Hisy + "年" + Hism + "月" + Hisd + "日" + "  " + HisH + ":" + HiM;
        }
      }
    },
    //添加---时间文本
    addTimerMsg(data, nums) {
      if (nums.length > 1) {
        //var newARR =
        nums.map((item) => {
          this.addTimerText(data[item].createTime, data[item].id);

          let obJSS = {
            content: this.timeText,
            id: this.timeText,
            isRight: "both",
            type: 1,
          };

          return data.splice(item, 0, obJSS);
        });
        //console.log(newARR,"多个时间map,",data);
      } else {
        this.addTimerText(data[nums[0]].createTime, data[nums[0]].id);

        let obJSS = {
          content: this.timeText,
          id: this.timeText,
          isRight: "both",
          type: 1,
        };

        data.splice(nums[0], 0, obJSS);
      }
      //this.TXhistory = data
      //console.log(this.TXhistory, "数据新增");
      return data;
    },
    ////时间处理
    //time_index(data) {
    //  console.log(data, "时间处理");
    //  //data.map(item => {
    //  //  if(item.)
    //  //})
    //},
  },

  mounted() {
    setTimeout(() => {
      var a;
      layui.use("layer", function () {
        //独立版的layer无需执行这一句
        var $ = layui.jquery,
          layer = layui.layer; //独立版的layer无需执行这一句

        layer.open({
          type: 2,
          title: "即时通讯",
          area: ["830px", "620px"],
          id: "layerDemo" + v4(), //防止重复弹出
          //content: "/newim/#/login",
          //content: "http://localhost:3000",
          skin: "demo-class",
          maxmin: true,
          // minStack:false,
          // ,content: 'http://localhost:3000'
          // ,btn: ['点击安装极速浏览器']
          shade: 0, //不显示遮罩
          yes: function () {
            // location.href='/se13.exe'
            // window.open('/TSBrowser.exe')

            // a.href = URL.createObjectURL(blob)
            // console.log(a.href)
            // a.download = '/TSBrowser.exe' // 下载文件的名字
            // // a.download = url.split('/')[url.split('/').length -1] //  // 下载文件的名字
            // document.body.appendChild(a)
            // a.click()

            // alert($('#xz'))
            // $('#xz').trigger('click')
            // $(window.parent.document).find('#xz').click()
            document.getElementById("xz").click();
          },
          min: function (layero, index) {
            $("body .demo-class").hide();
            return false;
            // setTimeout(function(){
            //   var dfk = $('.jstx').offset()
            //   var jshei = $('.jstx').height()

            //   layero.css({'left': dfk.left-100,'top':dfk.top+jshei})
            // })
          },
          cancel: function (layero, index) {
            $("body .demo-class").hide();
            return false;
          },
          success: function (layero, index) {
            setTimeout(() => {
              // $('body .demo-class iframe').css('height','100%')
            });
          },
        });
      });
    }, 1000);

    var that = this;
    window.onmessage = function (e) {
      if (e.data.message === "getunread") {
        that.unreadnum = e.data.height;
      }
    };
    // this.getxianming()
    // if(this.$route.path!='/diaodu2' && !sessionStorage.userInfo){
    //   this.jcHeaderShow=true
    // }
    //更新即时通讯是否展示
    // PubSub.subscribe("is_chat_show", (msg, data) => {
    //   console.log("ssssssssssssss")
    //   this.chatshow=sessionStorage.isshow_chat
    //     ? JSON.parse(sessionStorage.isshow_chat).value
    //     : 0;
    // });

    //去除
    // setTimeout(()=>{
    //     // var res='411304_5-{"imageWidth":120,"sourceId":"cb012046713040c4ae66ad15e01cb724","gpsLongitude":112.503959,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_a034e9de-d4b5-4d6b-bfb3-d68d6003bcf5.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_e9b0d311-5847-4096-ab8b-56f4cb6ebab6.jpg","policeCarNumber":"豫R3D369","imageHeight":184,"createTime":1639041190000,"sortType":11,"cameraIp":"192.168.1.101","sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","id":"1468871344681648130","fileFormat":"jpeg","gpsLatitude":33.003781}'

    //     // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //     // var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":32.99831273355646,"blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.49772746778847,"id":"1468786790855868417"}'

    //     var res='411325_9-{"fmrStatus":1,"latitude":33.004341,"lmgStatus":1,"flStatus":1,"updateBy":"tang","nvrStatus":1,"temperature":0.0,"humidity":0.0,"id":"1470565621346439169","rgStatus":1,"lgStatus":1,"longitude":112.504266,"gbInfomation":"41132500001120000202","updateTime":1649749440000,"ptzStatus":0,"boxStatus":1,"frStatus":1,"fmlStatus":1,"carNumber":"豫R3D369","rmgStatus":1,"createBy":"tang","createTime":1639987749000,"sysOrgCode":"06f7ca21bdac4e939060a2357af5fb80","pcStatus":1}'

    //     //采集-人脸
    //     if(res.indexOf('41132_5')!=-1){

    //         var reg = new RegExp("41132_5-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-face", ob);

    //     }else if(res.indexOf('41132_6')!=-1){
    //         var reg = new RegExp("411304_6-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-car", ob);
    //     }else if(res.indexOf('411304_7')!=-1){
    //         var reg = new RegExp("411304_7-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //         mp3.load();
    //         mp3.play();
    //         // var reg2 = new RegExp("%");
    //         // var a2 = ob.points.replace(reg2,"");

    //         // ob.points = a2

    //         ob.createTime =this.zhuan(ob.createTime)

    //         PubSub.publish("warn-face", ob);
    //     }else if(res.indexOf('411304_8')!=-1){
    //         var reg = new RegExp("411304_8-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         ob.createTime =this.zhuan(ob.createTime)
    //         PubSub.publish("warn-cp", ob);
    //     }else if(res.indexOf('411325_9')!=-1){
    //         var reg = new RegExp("411325_9-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         if(!ob.carId){
    //           ob.carId=ob.id
    //         }

    //         PubSub.publish("jc_updata", ob);
    //     }
    // },8000)

    // // //去除
    // setTimeout(()=>{
    //     // var res='411304_5-{"imageWidth":120,"sourceId":"cb012046713040c4ae66ad15e01cb724","gpsLongitude":112.503959,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_a034e9de-d4b5-4d6b-bfb3-d68d6003bcf5.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_e9b0d311-5847-4096-ab8b-56f4cb6ebab6.jpg","policeCarNumber":"豫R3D369","imageHeight":184,"createTime":1639041190000,"sortType":11,"cameraIp":"192.168.1.101","sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","id":"1468871344681648130","fileFormat":"jpeg","gpsLatitude":33.003781}'

    //     // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //     // var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":32.99831273355646,"blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.49772746778847,"id":"1468786790855868417"}'

    //     var res='411325_9-{"fmrStatus":0,"latitude":33.060278,"lmgStatus":0,"flStatus":1,"updateBy":"tang","nvrStatus":0,"temperature":0.0,"humidity":0.0,"id":"d6efc6c53b554508a86ffedeec7dc73c","rgStatus":1,"lgStatus":1,"longitude":111.865909,"gbInfomation":"41132500001120000202","updateTime":1649749440000,"ptzStatus":1,"boxStatus":1,"frStatus":1,"fmlStatus":1,"carNumber":"豫R9983警","rmgStatus":1,"createBy":"tang","createTime":1639987749000,"sysOrgCode":"06f7ca21bdac4e939060a2357af5fb80","pcStatus":1}'

    //     //采集-人脸
    //     if(res.indexOf('41132_5')!=-1){

    //         var reg = new RegExp("41132_5-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-face", ob);

    //     }else if(res.indexOf('41132_6')!=-1){
    //         var reg = new RegExp("411304_6-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-car", ob);
    //     }else if(res.indexOf('411304_7')!=-1){
    //         var reg = new RegExp("411304_7-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //         mp3.load();
    //         mp3.play();
    //         // var reg2 = new RegExp("%");
    //         // var a2 = ob.points.replace(reg2,"");

    //         // ob.points = a2

    //         ob.createTime =this.zhuan(ob.createTime)

    //         PubSub.publish("warn-face", ob);
    //     }else if(res.indexOf('411304_8')!=-1){
    //         var reg = new RegExp("411304_8-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         ob.createTime =this.zhuan(ob.createTime)
    //         PubSub.publish("warn-cp", ob);
    //     }else if(res.indexOf('411325_9')!=-1){
    //         var reg = new RegExp("411325_9-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         if(!ob.carId){
    //           ob.carId=ob.id
    //         }

    //         PubSub.publish("jc_updata", ob);
    //     }
    // },5000)

    // //去除
    // setTimeout(()=>{
    //     // var res='411304_5-{"imageWidth":120,"sourceId":"cb012046713040c4ae66ad15e01cb724","gpsLongitude":112.503959,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_a034e9de-d4b5-4d6b-bfb3-d68d6003bcf5.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_17-13-10_uuid_e9b0d311-5847-4096-ab8b-56f4cb6ebab6.jpg","policeCarNumber":"豫R3D369","imageHeight":184,"createTime":1639041190000,"sortType":11,"cameraIp":"192.168.1.101","sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","id":"1468871344681648130","fileFormat":"jpeg","gpsLatitude":33.003781}'

    //     // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //     // var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":32.99831273355646,"blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.49772746778847,"id":"1468786790855868417"}'

    //     var res='411325_9-{"fmrStatus":0,"latitude":33.060278,"lmgStatus":0,"flStatus":1,"updateBy":"tang","nvrStatus":0,"temperature":0.0,"humidity":0.0,"id":"d6efc6c53b554508a86ffedeec7dc73c","rgStatus":1,"lgStatus":1,"longitude":111.865909,"gbInfomation":"41132500001120000202","updateTime":1649749440000,"ptzStatus":1,"boxStatus":1,"frStatus":1,"fmlStatus":1,"carNumber":"豫R9687警","rmgStatus":1,"createBy":"tang","createTime":1639987749000,"sysOrgCode":"06f7ca21bdac4e939060a2357af5fb80","pcStatus":1}'

    //     //采集-人脸
    //     if(res.indexOf('41132_5')!=-1){

    //         var reg = new RegExp("41132_5-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-face", ob);

    //     }else if(res.indexOf('41132_6')!=-1){
    //         var reg = new RegExp("411304_6-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-car", ob);
    //     }else if(res.indexOf('411304_7')!=-1){
    //         var reg = new RegExp("411304_7-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //         mp3.load();
    //         mp3.play();
    //         // var reg2 = new RegExp("%");
    //         // var a2 = ob.points.replace(reg2,"");

    //         // ob.points = a2

    //         ob.createTime =this.zhuan(ob.createTime)

    //         PubSub.publish("warn-face", ob);
    //     }else if(res.indexOf('411304_8')!=-1){
    //         var reg = new RegExp("411304_8-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         ob.createTime =this.zhuan(ob.createTime)
    //         PubSub.publish("warn-cp", ob);
    //     }else if(res.indexOf('411325_9')!=-1){
    //         var reg = new RegExp("411325_9-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         if(!ob.carId){
    //           ob.carId=ob.id
    //         }

    //         PubSub.publish("jc_updata", ob);
    //     }
    // },7000)

    // setTimeout(()=>{
    //     // var res='411304_5-{"imageWidth":120,"sourceId":"1cdee9fe688748d2a1fb137a775a2738","gpsLongitude":112.504026,"plateno":"豫R3D369","imageHeight":184,"storageUrl2":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_ca4440a4-badb-4587-ad62-3584ed312fba.jpg","storageUrl3":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_cd91fedb-3eb9-4322-8f6b-0580db52774d.jpg","createTime":1638758241000,"sortType":10,"cameraIp":"192.168.1.104","id":"1467684724599275522","fileFormat":"jpeg","gpsLatitude":33.003683}'

    //     // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //     // var res='411304_7-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","id":"1468786790855868417","videoUrl":"2342.mp4"}'
    //     var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":32.99831273355646,"blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.49772746778847,"id":"1468786790855868417","videoUrl":"2342.mp4"}'

    //     // var res='411304_9-{"gbInfomation":"41132500001120000005","hikvisionNo":"123","latitude":33.00564026576722,"updateTime":1638758780488,"policecarType":1,"carNumber":"豫R3D369","createBy":"admin","createTime":1638171076000,"updateBy":"admin","nvrStatus":0,"temperature":20.0,"humidity":20.0,"sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","pcStatus":0,"id":"1465221809037479938","longitude":112.5045815388296}'

    //     //采集-人脸
    //     if(res.indexOf('411304_5')!=-1){

    //         var reg = new RegExp("411304_5-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-face", ob);

    //     }else if(res.indexOf('411304_6')!=-1){
    //         var reg = new RegExp("411304_6-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-car", ob);
    //     }else if(res.indexOf('411304_7')!=-1){
    //         var reg = new RegExp("411304_7-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //         mp3.load();
    //         mp3.play();
    //         // var reg2 = new RegExp("%");
    //         // var a2 = ob.points.replace(reg2,"");

    //         // ob.points = a2

    //         PubSub.publish("warn-face", ob);
    //     }else if(res.indexOf('411304_8')!=-1){
    //         var reg = new RegExp("411304_8-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("warn-cp", ob);
    //     }else if(res.indexOf('411304_9')!=-1){
    //         var reg = new RegExp("411304_9-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         if(!ob.carId){
    //           ob.carId=ob.id
    //         }

    //         PubSub.publish("jc_updata", ob);
    //     }
    // },20000)

    // setTimeout(()=>{
    //     // var res='411304_5-{"imageWidth":120,"sourceId":"1cdee9fe688748d2a1fb137a775a2738","gpsLongitude":112.504026,"plateno":"豫R3D369","imageHeight":184,"storageUrl2":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_ca4440a4-badb-4587-ad62-3584ed312fba.jpg","storageUrl3":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_cd91fedb-3eb9-4322-8f6b-0580db52774d.jpg","createTime":1638758241000,"sortType":10,"cameraIp":"192.168.1.104","id":"1467684724599275522","fileFormat":"jpeg","gpsLatitude":33.003683}'

    //     // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //     // var res='411304_7-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","id":"1468786790855868417","videoUrl":"2342.mp4"}'
    //     var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","blackId":"1467060363517403137","fromCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"fromCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","id":"1468786790855868417","videoUrl":"2342.mp4"}'

    //     // var res='411304_9-{"gbInfomation":"41132500001120000005","hikvisionNo":"123","latitude":33.00564026576722,"updateTime":1638758780488,"policecarType":1,"carNumber":"豫R3D369","createBy":"admin","createTime":1638171076000,"updateBy":"admin","nvrStatus":0,"temperature":20.0,"humidity":20.0,"sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","pcStatus":0,"id":"1465221809037479938","longitude":112.5045815388296}'

    //     //采集-人脸
    //     if(res.indexOf('411304_5')!=-1){

    //         var reg = new RegExp("411304_5-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-face", ob);

    //     }else if(res.indexOf('411304_6')!=-1){
    //         var reg = new RegExp("411304_6-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("caiji-car", ob);
    //     }else if(res.indexOf('411304_7')!=-1){
    //         var reg = new RegExp("411304_7-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //         mp3.load();
    //         mp3.play();
    //         // var reg2 = new RegExp("%");
    //         // var a2 = ob.points.replace(reg2,"");

    //         // ob.points = a2

    //         PubSub.publish("warn-face", ob);
    //     }else if(res.indexOf('411304_8')!=-1){
    //         var reg = new RegExp("411304_8-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         PubSub.publish("warn-cp", ob);
    //     }else if(res.indexOf('411304_9')!=-1){
    //         var reg = new RegExp("411304_9-");
    //         var a = res.replace(reg,"");

    //         var ob = JSON.parse(a)

    //         if(!ob.carId){
    //           ob.carId=ob.id
    //         }

    //         PubSub.publish("jc_updata", ob);
    //     }
    // },20000)

    PubSub.subscribe("detail_box_type_show", (msg, data) => {
      this.detailBox = true;
      this.detailBoxType = data;
    });
    PubSub.subscribe("fankui_data", (msg, data) => {
      //console.log(msg);
      this.fankui_show = true;
      var p = Object.assign({}, data, { change: v4() });
      //console.log(p, "&&&&&&&&&&&&&&&&&传参&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      this.fankui_data = p;
    });
    //PubSub.subscribe("fankuich_data", (msg, data) => {
    //  this.fankuich_show = true;
    //  var p = Object.assign({}, data, { change: v4() });
    //  //console.log(p, "&&&&&&&&&&&&&&&&&传参&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    //  this.fankuich_data = p;
    //});

    PubSub.subscribe("warnVideoshow", (msg, data) => {
      this.warnVideoshow = true;

      var p = Object.assign({}, data, { change: v4() });
      this.warnvideodata = p;
    });
    // PubSub.subscribe("jc_header_show", (msg, data) => {
    //   this.jcHeaderShow = data;
    // });

    //this.initWebSocket();

    //             // ob.points = a2

    //             PubSub.publish("warn-face", ob);
    //         }else if(res.indexOf('411304_8')!=-1){
    //             var reg = new RegExp("411304_8-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             PubSub.publish("warn-cp", ob);
    //         }else if(res.indexOf('411304_9')!=-1){
    //             var reg = new RegExp("411304_9-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             if(!ob.carId){
    //               ob.carId=ob.id
    //             }

    //             PubSub.publish("jc_updata", ob);
    //         }
    //     },2000)

    // setTimeout(()=>{
    //         // var res='411304_5-{"imageWidth":120,"sourceId":"1cdee9fe688748d2a1fb137a775a2738","gpsLongitude":112.504026,"plateno":"豫R3D369","imageHeight":184,"storageUrl2":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_ca4440a4-badb-4587-ad62-3584ed312fba.jpg","storageUrl3":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-37-21_uuid_cd91fedb-3eb9-4322-8f6b-0580db52774d.jpg","createTime":1638758241000,"sortType":10,"cameraIp":"192.168.1.104","id":"1467684724599275522","fileFormat":"jpeg","gpsLatitude":33.003683}'

    //         // var res='411304_6-{"imageWidth":120,"gpsLongitude":112.504308,"smallImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_b7327c42-eb85-4ef9-85df-2546e97231ba.jpg","bigImageUrl":"http://192.168.2.201:9000/yur3d369/2021-12-07_16-59-45_uuid_6a4ffc1a-5649-4968-91e3-0815a19cfae7.jpg","policeCarNumber":"豫R3D369","deviceID":"192.168.1.104_豫R3D369","imageHeight":184,"createTime":1638867585000,"infoKind":1,"sortType":2,"cameraIp":"192.168.1.104","id":"19be5377-6af0-494e-a4dc-735640daa93a","fileFormat":"jpge","gpsLatitude":33.003718}'

    //         var res='411304_7-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":33.01296718352062,"blackId":"1467060363517403137","formCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"formCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.52352680203504}'
    //         // var res='411304_8-{"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_f66ae67c-929c-4c41-9254-5edf00b22964.jpg","latitude":32.99831273355646,"blackId":"1467060363517403137","formCar":"192.168.1.104","points":0.7253612279891968,"createTime":1638758681960,"formCam":"豫R3D369","id":"1467686405328084994","bigImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-06_10-44-41_uuid_1ec8ca6f-dcc8-495d-ba34-e49f6704bfeb.jpg","longitude":112.49772746778847}'

    //         // var res='411304_9-{"gbInfomation":"41132500001120000005","hikvisionNo":"123","latitude":33.00564026576722,"updateTime":1638758780488,"policecarType":1,"carNumber":"豫R3D369","createBy":"admin","createTime":1638171076000,"updateBy":"admin","nvrStatus":0,"temperature":20.0,"humidity":20.0,"sysOrgCode":"9bc8a97f176543ed8af7440c9d585155","pcStatus":0,"id":"1465221809037479938","longitude":112.5045815388296}'

    //         //采集-人脸
    //         if(res.indexOf('411304_5')!=-1){

    //             var reg = new RegExp("411304_5-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             PubSub.publish("caiji-face", ob);

    //         }else if(res.indexOf('411304_6')!=-1){
    //             var reg = new RegExp("411304_6-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             PubSub.publish("caiji-car", ob);
    //         }else if(res.indexOf('411304_7')!=-1){
    //             var reg = new RegExp("411304_7-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             var mp3 = new Audio(require("@/assets/mp3/jingqinglingsheng.mp3"));
    //             mp3.load();
    //             mp3.play();
    //             // var reg2 = new RegExp("%");
    //             // var a2 = ob.points.replace(reg2,"");

    //             // ob.points = a2

    //             PubSub.publish("warn-face", ob);
    //         }else if(res.indexOf('411304_8')!=-1){
    //             var reg = new RegExp("411304_8-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             PubSub.publish("warn-cp", ob);
    //         }else if(res.indexOf('411304_9')!=-1){
    //             var reg = new RegExp("411304_9-");
    //             var a = res.replace(reg,"");

    //             var ob = JSON.parse(a)

    //             if(!ob.carId){
    //               ob.carId=ob.id
    //             }

    //             PubSub.publish("jc_updata", ob);
    //         }
    //     },4000)

    PubSub.subscribe("detail_box_type_show", (msg, data) => {
      this.detailBox = true;
      this.detailBoxType = data;
    });

    PubSub.subscribe("warnVideoshow", (msg, data) => {
      this.warnVideoshow = true;

      var p = Object.assign({}, data, { change: v4() });
      this.warnvideodata = p;
    });
    PubSub.subscribe("jc_header_show", (msg, data) => {
      this.jcHeaderShow = data;

      this.xianming = sessionStorage.xianming
        ? sessionStorage.xianming
        : "智慧警车大数据平台";
    });

    PubSub.subscribe("nmhead", (msg, data) => {
      this.fankui_close();

      if (!sessionStorage.showship) {
        $("body .demo-class").hide();
      } else {
        sessionStorage.removeItem("showship");
      }
    });

    this.initWebSocket();

    this.xiba();

    this.ggp();
    //即时通讯
    this.jstx();
    fetch(`http://${this.yuming}:19999/imMessage/list`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.result.records.map((item) => {
          if (item.createName == this.personInfo) {
            item.isRight = true;
          } else {
            item.isRight = false;
          }
        });

        this.TXhistory = data.result.records.reverse();
        console.log(
          "新处理的时间---",
          this.checkShowRule(this.TXhistory, "createTime")
        );
        this.TXhistory = this.checkShowRule(this.TXhistory, "createTime");
        //this.addTimerMsg( data.result.records)
        //this.addTimerText(
        //  data.result.records[9].createTime,
        //  data.result.records[9].id
        //);

        //let obJSS = {
        //  content: this.timeText,
        //  id: this.timeText,
        //  isRight: "both",
        //  type: 1,
        //};
        //this.TXhistory.splice(9, 0, obJSS);
        console.log(this.TXhistory, "数据新增");
      });

    
  },
  components: {
    DetailFace,
    DetailFacewl,
    UploadImgBox,
    DetailCar,
    FeedbackCar,
    ChangePwd,
    CollectDetailFace,
    CollectDetailCar,
    warnVideo,
    RetFace,
    FeedbackFace,
    FeedbackPhone,
    CarTrail,
    DetailCarwl,
    CaijiDetail,
  },
};
</script>

<style lang="scss" scoped>
::v-deep .jstx_box .el-dialog {
  height: 70%;
}

::v-deep .jstx_box .el-dialog__body {
  height: 90%;
  padding: 0 20px 20px;
}

::v-deep .jstx_box .el-popover {
  left: 371px !important;
  top: 522px !important;
}

.jstx {
  height: 100%;
  width: 100%;

  .tx_top {
    height: 75%;
    overflow: hidden;
    position: relative;
    ul {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      position: absolute;
      bottom: 0;
      .TXactive_left {
        //float: left;
        clear: both;
        overflow: hidden;
      }
      .TXactive_right {
        //float: right;
        clear: both;
        overflow: hidden;
      }
      .TXactive_left,
      .TXactive_right {
        .message-time-wrap {
          width: 100%;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 10px;
          border: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .TXactive_both {
        width: 100%;
        //height: 20px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
        clear: both;
        overflow: hidden;
        border: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .myInfor {
        flex-direction: row-reverse;
      }
      .myInforcenter {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .myInforTime {
        display: none;
      }

      li {
        list-style: none;
        margin-top: 10px;

        .TXitem {
          display: flex;
          flex-wrap: nowrap;
          width: 100%;

          .myName {
            //float: right;
            //clear: both;
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            margin-left: 0;
            margin-right: 5px;
          }

          .TXxiaoxi {
            position: relative;
            border: 2px solid #f99;
            background-color: #fff;
            border-radius: 10px;
            line-height: 30px;
            padding: 15px;
            width: fit-content;
            letter-spacing: 5px;
            .wenjai {
              display: flex;
              letter-spacing: normal;
              justify-content: center;
              align-items: center;
            }
            /*提示框-左三角*/
            .tip-trangle-left {
              position: absolute;
              top: 15px;
              left: -10px;
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 10px solid rgb(179, 234, 249);
            }

            /*提示框-右三角*/
            .tip-trangle-right {
              position: absolute;
              top: 15px;
              right: -10px;
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-left: 10px solid rgb(2, 194, 247);
            }
          }
          .timeTXxiaoxi {
            border: none;
            .tip-trangle-left {
              position: absolute;
              top: 15px;
              left: -10px;
              width: 0;
              height: 0;
              border-top: 0 solid transparent;
              border-bottom: 0 solid transparent;
              border-right: 0 solid rgb(179, 234, 249);
            }

            /*提示框-右三角*/
            .tip-trangle-right {
              position: absolute;
              top: 15px;
              right: -10px;
              width: 0;
              height: 0;
              border-top: 0 solid transparent;
              border-bottom: 0 solid transparent;
              border-left: 0 solid rgb(2, 194, 247);
            }
          }
        }
      }
    }
  }

  .tx_top ul::-webkit-scrollbar {
    width: 10px;
    // height: 10px; // 高度写不写，都不影响，因为会根据内容的长度自动计算
  }

  .tx_top ul::-webkit-scrollbar-thumb {
    background: #ccc; // 滑块颜色
    border-radius: 5px; // 滑块圆角
  }

  .tx_top ul::-webkit-scrollbar-thumb:hover {
    background: #f40; // 鼠标移入滑块变红
  }

  .tx_top ul::-webkit-scrollbar-track {
    border-radius: 10px; // 轨道圆角
    background-color: #1890ff; // 轨道颜色
  }

  .tx_btn {
    height: 5%;
    font-size: 16px;
    display: flex;
  }

  .tx_btn :first-of-type {
    margin-right: 10px;
  }

  .tx_bottom {
    height: 20%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
<style lang="scss">
@import "@/assets/css/theme.scss";
.tx_top .el-icon-circle-close {
  font-size: 40px !important;
}
//水印样式
#water-copy {
  position: fixed;
  inset: 0px;
  overflow: hidden;
  z-index: 99999999;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  background-color: saddlebrown;
}
//.jstx_box .el-dialog {
//  height: 70%;
//}

//.jstx_box .el-dialog__body {
//  height: 90%;
//  padding: 0 20px 20px;
//}

//.jstx_box .el-popover {
//  left: 371px !important;
//  top: 522px !important;
//}
.noselect {
  -webkit-touch-callout: none;
  /* iOS Safari */

  -webkit-user-select: none;
  /* Chrome/Safari/Opera */

  -khtml-user-select: none;
  /* Konqueror */

  -moz-user-select: none;
  /* Firefox */

  -ms-user-select: none;
  /* Internet Explorer/Edge */

  user-select: none;
  /* Non-prefixed version, currently

  not supported by any browser */
}

.BMap_Marker {
  z-index: 1 !important;
}

* {
  margin: 0;
  padding: 0;
  outline: none;
  font-size: 14px;
}

.bkms_span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 车牌检索--输入框--车牌号
.num-box .num-top {
  .el-input--suffix .el-input__inner {
    font-size: 14px !important;
  }
}

.time-box {
  .el-input--prefix .el-input__inner {
    height: 100% !important;
    font-size: 14px;
    padding-left: 25px;
  }

  .el-input--suffix .el-input__inner {
    height: 100% !important;
    font-size: 14px;
    padding-right: 25px;
  }

  .el-input__suffix {
    right: 0px;
  }

  .el-input__prefix {
    left: 0px;
  }

  .el-input__prefix,
  .el-input__suffix {
    i {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 0 10px;
      box-sizing: border-box;
    }
  }
}

.el-range-editor .el-range-input {
  font-size: 14px;
}

.el-date-table td span {
  font-size: 12px;
  /*no*/
}

.el-date-editor .el-range__icon {
  font-size: 14px;
}

.el-tree {
  background: none;
}

.el-tree {
  color: #78b6ee;

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

  .el-tree-node__label {
    font-size: 14px;
  }

  .el-tree-node__content {
    height: auto;

    // padding-bottom: 2px;
    padding: 3px 0;
  }
}

.big-Typography {
  font-size: 16px;
}

.bg_color_white {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
}

.Typography-color-blue {
  color: #00beff;

  &.nysj_the {
    color: #000;
  }
}

html,
body,
#app {
  width: 100%;
  height: 100%;

  //.spring-frame2 {
  // position: fixed;
  // top: 0;
  // left: 0;
  // z-index: 3;
  // width: 100%;
  // height: 100%;
  // background: rgba(255,255,255,0.9);
  //}
  .spring-frame {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
  }

  .close-icon {
    position: fixed;
    top: 10px;
    right: 20px;
    z-index: 10;
    width: 28px;
    height: 28px;
    margin-top: 16px;
    margin-left: 47px;
    background-image: url("./assets/image/close-page.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  // .close-img {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   z-index: 10;
  //   // background: #777777;
  //   width: 90px;
  //   height: 90px;
  //   border-radius: 0 0 0 90px;

  // }
}

#jc_header {
  width: 100%;
  height: 9%;
  background: linear-gradient(to bottom, rgb(225 253 255), rgb(255 255 255));

  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  //display: grid;
  //grid-template-columns: 668px auto 668px;
  display: flex;
  padding: 0 21px;
  box-sizing: border-box;
  opacity: 0.88;

  // &.uin{
  //   opacity:0.88;
  //   // .header-right {
  //   //   opacity:1
  //   // }
  //   // .header-center {
  //   //   opacity:1
  //   // }
  // }
  .header-center {
    //width: 35%;
    //margin: 0 auto;
    background-image: url("./assets/image/nav-centent.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    flex: 1;
  }

  .header_left {
    flex: 1;
  }

  .header-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* justify-content: right; */
    align-items: flex-end;
  }

  .title-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: calc(100% - 10px);
    width: 89%;

    .title-item {
      font-size: 20px;
      font-weight: 600;
      position: relative;
      display: flex;
      align-items: center;

      .jstx {
        text-decoration: none;
        color: #333;
      }

      .router-link-active {
        text-decoration: none;
        color: #00beff;
      }

      .router-link {
        text-decoration: none;
        color: #333;
      }

      a {
        text-decoration: none;
        color: #333;
        cursor: pointer;
      }
    }

    .set-icon {
      width: 30px;
      height: 30px;
      background-image: url("./assets/image/nav-button-user.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .qipao {
      // position:absolute;
      color: #fff;
      background: red;
      padding: 1px 4px;
      // border-radius:50px;
      margin-left: 13px;
      position: absolute;
      top: -16px;
      /*no*/
      padding: 0 10px;
      left: 50%;

      text-align: right;
      transform: scale(0.9);
      transform: skewX(-30deg);

      span {
        transform: skewX(30deg);
        display: block;
        font-size: 7px;
      }
    }

    .set-icon-wx {
      width: 30px;
      height: 30px;
      // background-image: url("./assets/image/lt.svg");
      // background-size: 120% 120%;
      // background-repeat: no-repeat;
      position: relative;
      margin-right: 33px;

      .iconss {
        width: 35px;
      }

      // .qipao{
      //   // position:absolute;
      //   color:#fff;
      //   background:red;
      //   padding:1px 4px;
      //   border-radius:50px;
      //   margin-left:5px;
      //   position:absolute;
      //   top: -6px;
      //   left: 17px;
      //   font-size: 12px;
      //   text-align:right;
      //   transform: scale(0.9);
      // }
    }
  }

  .feis {
    display: flex;
    align-items: center;
  }

  .title-center {
    height: calc(100% - 10px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #222222;
    font-size: 28px;
    font-weight: 700;
    font-family: "标题";
    //7df5ff  #999
  }

  .title-img {
    width: 100%;
    height: 10px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .title-left-img {
    background-image: url("./assets/image/nav-line-left.svg");
  }

  .title-right-img {
    background-image: url("./assets/image/nav-line-right.svg");
  }

  .title-center-img {
    height: 4px;
    margin-top: 3px;
    background-image: url("./assets/image/nav-line-cent.svg");
  }
}

#jc_footer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

//滚动条样式
// div::-webkit-scrollbar {
//   width: 1px;
//   /**/
// }
// div::-webkit-scrollbar-track {
//   background: rgb(239, 239, 239);
//   border-radius: 2px;
// }
// div::-webkit-scrollbar-thumb {
//   background: #78b6ee;
//   border-radius: 10px;
// }
// div::-webkit-scrollbar-thumb:hover {
//   background: #78b6ee;
// }
// div::-webkit-scrollbar-corner {
//   background: #78b6ee;
// }

//查看大图
.el-image-viewer__wrapper {
  position: fixed;
  top: 10%;
  right: 0;
  bottom: 0;
  left: 0;
}

//进度条颜色
.el-slider__bar {
  background-color: #00beff;
}

.nysj_the {
  .el-slider__bar {
    background-color: #005258;
  }

  .el-slider__button {
    border: 2px solid #005258;
  }
}

/* 字体设置 */
@font-face {
  font-family: "标题";
  src: url("./assets/font/font-head.woff");
  font-weight: normal;
  font-style: normal;
}

/* 字体设置 */
@font-face {
  font-family: "数字";
  src: url("./assets/font/font-number.woff");
  font-weight: normal;
  font-style: normal;
}

.num-family {
  font-family: "数字";
}

.title-family {
  font-family: "数字";
}

.browBox {
  width: 100%;
  height: 200px;
  background: #e6e6e6;
  position: absolute;
  z-index: 100;
  bottom: 0px;
  overflow: scroll;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    li {
      cursor: pointer;
      width: 10%;
      font-size: 26px;
      list-style: none;
      text-align: center;
    }
  }
}

.submit-btn {
  float: right;
}
</style>
