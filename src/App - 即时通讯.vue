<template>
  <div id="app" :data-theme="nowThemeInfo">
    <div id="jc_header" v-if="jcHeaderShow">
      <div>
        <div class="title-box">
          <div class="title-item">
            <router-link class="nav_link" to="/index"> 综合预览 </router-link>
          </div>
          <div class="title-item">
            <router-link class="nav_link" to="/collectInfo">
              采集信息
            </router-link>
          </div>
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
            <router-link class="nav_link" to="/warningInfo">
              预警信息
            </router-link>
          </div>
          <div class="title-item">
            <router-link @click.native="shuaix" class="nav_link" to="/diaodu">
              视频调度
            </router-link>
          </div>
          <!--<div class="title-item">
            <router-link class="nav_link" to="/obtainEvidence"> 视频取证 </router-link>
          </div>-->
          <div class="title-item">
            <router-link class="nav_link" to="/statisticalInfo">
              统计信息
            </router-link>
          </div>
          <!--<div class="title-item" v-if="chatshow == 1 ? true : false">
            <a class="jstx" target="_blank" href="/chat/index.html">即时通讯</a>
          </div>-->

          <div class="title-item" @click="df()">
            <a class="jstx" target="_blank">
              <img class="zdh" src="./assets/image/zdh.png" />
              <span>即时通讯</span>
              <span class="qipao">{{ unreadnum }}</span>
            </a>
          </div>

          <div class="set-icon" @click="setPage"></div>
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
      :fankui_data="fankui_data"
      @yincang_fankui="fankui_close"
    ></FeedbackFace>

    <a id="xz" href="/TSBrowser.exe" download style="display: none">sss</a>

    <div class="page-bk-box2" v-show="jsShow">
      <div class="js_titile">即时通讯</div>

      <img class="js_close" @click="js_yinc" src="./assets/image/zxh.png" />
      <iframe
        allowfullscreen="true"
        allowtransparency="true"
        width="100%"
        height="100%"
        src="/newim/#/login"
      ></iframe>
    </div>
  </div>
</template>


<script>
import PubSub from "pubsub-js";
import DetailFace from "@/components/springframe/DetailFace.vue";
import DetailFacewl from "@/components/springframe/DetailFacewl.vue";
import UploadImgBox from "@/components/springframe/UploadImgBox.vue";
import DetailCar from "@/components/springframe/DetailCar.vue";
import DetailCarwl from "@/components/springframe/DetailCarwl.vue";
import FeedbackCar from "@/components/springframe/FeedbackCar.vue";
import FeedbackFace from "@/components/springframe/FeedbackFace.vue";
import ChangePwd from "@/components/springframe/ChangePwd.vue";
import CollectDetailFace from "@/components/springframe/CollectDetailFace.vue";
import CollectDetailCar from "@/components/springframe/CollectDetailCar.vue";
import warnVideo from "@/components/springframe/warnVideo.vue";
import RetFace from "@/components/springframe/RetFace.vue";
import { v4 } from "uuid";
import CarTrail from "@/components/springframe/CarTrail.vue";
import CaijiDetail from "@/components/springframe/caijiDetail.vue";
import { Message, Loading } from "element-ui";
export default {
  name: "app",
  data() {
    return {
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

      fankui_show: false,

      chatshow: sessionStorage.isshow_chat
        ? JSON.parse(sessionStorage.isshow_chat).value
        : 0,

      dialogTableVisible: false,
      jsShow: false,
      unreadnum: 0,
      xianming: sessionStorage.xianming
        ? sessionStorage.xianming
        : "智慧警车大数据平台",
    };
  },

  destroyed() {},
  computed: {
    // unreadnum(){
    //     return sessionStorage.unreadnum
    // }
  },
  watch: {},
  methods: {
    shuaix() {
      sessionStorage.setItem("obchushi", 1);
    },
    async getxianming() {
      var name = await getRegionName();
      this.xianming = name.result;
    },
    js_yinc() {
      this.jsShow = false;
    },
    df() {
      this.jsShow = true;
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

        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      } else {
        let webscok = sessionStorage.Webscocket;

        var wsuri;

        wsuri = `ws://${webscok}:8089`;
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
      console.log(res, "ascsadcsdahcvsacjvjsa=====");

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

        PubSub.publish("jc_updata", ob);
      }

      // PubSub.publish("jc_updata", ob);
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
      console.log("数据发送" + Data);
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
  },

  mounted() {
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

    //     var res='411325_9-{"fmrStatus":1,"latitude":33.060278,"lmgStatus":1,"flStatus":1,"updateBy":"tang","nvrStatus":1,"temperature":0.0,"humidity":0.0,"id":"d6efc6c53b554508a86ffedeec7dc73c","rgStatus":1,"lgStatus":1,"longitude":111.865909,"gbInfomation":"41132500001120000202","updateTime":1649749440000,"ptzStatus":0,"boxStatus":1,"frStatus":1,"fmlStatus":1,"carNumber":"豫R5939警","rmgStatus":1,"createBy":"tang","createTime":1639987749000,"sysOrgCode":"06f7ca21bdac4e939060a2357af5fb80","pcStatus":1}'

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

    //     // var res='411304_7-{"bigImgUrl":"http://192.168.2.201:9000/yur:9000/faceblack/temp/秦_1638609411626.jpg","fromCam":"豫R3D369","fromCar":"192.168.1.104","id":"1468786790855868417","latitude":33.003646,"longitude":112.504364,"points":0.743119478225708,"smallImgUrl":"http://192.168.2.201:9000/yur3d369/2021-12-09_11-37-14_uuid_c2d2ec2b-5174-42fa-967a-9342b192e5a1.jpg"} '
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
      this.fankui_show = true;
      var p = Object.assign({}, data, { change: v4() });

      this.fankui_data = p;
    });

    PubSub.subscribe("warnVideoshow", (msg, data) => {
      this.warnVideoshow = true;

      var p = Object.assign({}, data, { change: v4() });
      this.warnvideodata = p;
    });
    // PubSub.subscribe("jc_header_show", (msg, data) => {
    //   this.jcHeaderShow = data;
    // });

    this.initWebSocket();

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
    });

    // this.initWebSocket();
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
    CarTrail,
    DetailCarwl,
    CaijiDetail,
  },
};
</script>


<style lang="scss" scoped>
@import "@/assets/css/theme.scss";
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none; /* Non-prefixed version, currently

  not supported by any browser */
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
  font-size: 12px; /*no*/
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
  .spring-frame2 {
    // position: fixed;
    // top: 0;
    // left: 0;
    // z-index: 3;
    // width: 100%;
    // height: 100%;
    // background: rgba(255,255,255,0.9);
  }
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
    background-image: url("./assets/image/nav-centent.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .header-right {
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
      .jstx {
        text-decoration: none;
        color: #333;

        display: block;

        line-height: 30px;
        width: 130px;
        height: 30px;
        margin-top: 5px;
        text-align: center;
        background: #00b9ff;
        border-radius: 11px;
        display: flex;
        align-items: center;
        color: #fff !important;
        justify-content: space-around;
        .qipao {
          background: red;
          border-radius: 52px;
          font-size: 12px;
          background: #cf1111;
          height: 20px;
          line-height: 20px;
          padding-left: 5px;
          padding-right: 5px;
        }
        .zdh {
          width: 15px;
        }
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

.page-bk-box2 {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-top: calc(-177px * 1.5); /*no*/
  margin-left: calc(-318.5px * 1.5); /*no*/
  width: calc(637px * 1.5); /*no*/
  height: calc(354px * 1.5); /*no*/
  background-image: url("./assets/image/msg.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 3;
  iframe {
    width: calc(931px * 1); /*no*/
    height: calc(456px * 1); /*no*/
    margin-left: 11px; /*no*/
    margin-top: 61px; /*no*/
    border: none;
  }
  .js_titile {
    position: absolute;
    font-size: 20px; /*no*/
    color: #fff;
    font-weight: bolder;
    margin-left: 28px; /*no*/
    margin-top: 11px; /*no*/
  }

  .zux {
    position: absolute;
    font-size: 20px; /*no*/
    color: #fff;
    font-weight: bolder;
    margin-left: 28px; /*no*/
    margin-top: 11px; /*no*/
  }

  .zux2 {
    position: absolute;
    font-size: 20px; /*no*/
    color: #fff;
    font-weight: bolder;
    margin-left: 28px; /*no*/
    margin-top: 11px; /*no*/
  }

  .js_close {
    position: absolute;
    width: 27px; /*no*/
    color: #fff;
    font-weight: bolder;
    margin-left: 126px; /*no*/
    margin-top: 11px; /*no*/
  }
}
</style>
