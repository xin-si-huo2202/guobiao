<template>
  <div class="index_container">
    <Map
      :mapcarlist="mapcarlist"
      :deplist="dep_list"
      :lklist="lk_list"
      :dingwei="dingwei"
      :mapyujinglist="mapyujinglist"
      :quyulist="quyulist"
      ref="getRegionalDivision"
    />

    <div class="left">
      <div class="videowarp-top">
        <img
          :src="require('@/assets/image/RUNOOB-SVG-IMAGE.png')"
          @click="yidong()"
        />
      </div>
      <div class="left_top" :style="{ display: ischushi ? 'none' : 'block' }">
        <div
          class="da"
          @click="choose_pl = 0"
          :class="choose_pl == 0 ? 'video3' : 'video2'"
        >
          <cus-player :jc_data="videoarr[0].jc_data"></cus-player>
        </div>
        <div class="xiao_arr">
          <div
            class="xiao"
            @click="choose_pl = 1"
            :class="choose_pl == 1 ? 'video3' : 'video2'"
          >
            <cus-player :jc_data="videoarr[1].jc_data"></cus-player>
          </div>
          <div
            class="xiao"
            @click="choose_pl = 2"
            :class="choose_pl == 2 ? 'video3' : 'video2'"
          >
            <cus-player :jc_data="videoarr[2].jc_data"></cus-player>
          </div>
        </div>
      </div>

      <div class="left_bottom" :style="{ height: ischushi ? '100%' : '58%' }">
        <div class="left_bottom-tab">
          <TitleOne
            titleH="全部车辆"
            :selTypedefault="-1"
            :titleH1="titleH1"
            :titleH2="titleH2"
            @choosetab="choosetab"
          />

          <!--<el-button
            class="map_depart"
            type="primary"
            @click.prevent="map_depart()"
          >
            <i class="el-icon-location"></i>
            警力地图
          </el-button>-->
        </div>

        <div class="left_bottom-bot">
          <ListpoliceCars
            :ischushi="ischushi"
            @dingweivideo="dingweivideo"
            :tabindex="tabindex"
            @addCar="addCar"
          />
        </div>
      </div>
    </div>

    <div class="right index_ri">
      <div class="videowarp-top">
        <img
          :src="require('@/assets/image/RUNOOB-SVG-IMAGE2.png')"
          @click="yidong2()"
        />
      </div>
      <div class="right_top">
        <div class="tab-box">
          <title-one
            @choosetab="changeTypeYJ"
            titleH1="人像预警"
            titleH2="车牌预警"
            titleH3="外来人像"
            titleH4="外来车辆"
          ></title-one>
        </div>
        <div class="con-box">
          <warn :type="selTypeYJ"></warn>
        </div>
      </div>

      <div class="right_bottom">
        <div class="tab-box">
          <title-one
            @choosetab="changeTypeCJ"
            titleH1="人像采集"
            titleH2="车牌采集"
          ></title-one>
        </div>
        <div class="con-box">
          <collection :type="selTypeCJ"></collection>
        </div>
      </div>
    </div>
    <!--<div class="quyuhuafen">
      <el-button type="success" @click="go_quyuhuafen"
        >去区域划分页面</el-button
      >
    </div>-->
    <!-- <warnVideo /> -->
  </div>
</template>

<script>
import CusPlayer from "./CusPlayer";
import Map from "../components/map.vue";
import ListpoliceCars from "../components/index/ListpoliceCars.vue";
import TitleOne from "../components/basetool/TitleOne.vue";
import { Message, Loading } from "element-ui";
import { v4 } from "uuid";
import Warn from "@/components/index/Warn.vue";
import Collection from "@/components/index/Collection.vue";
import warnVideo from "@/components/springframe/warnVideo.vue";
import PubSub from "pubsub-js";
import {
  baocun_region,
  huoqu_region,
  shanchu_region,
  selAllDepartOtherInfo,
  gyxyMapFlag,
} from "@/api/system.js";

export default {
  name: "index",
  data() {
    return {
      lk_list: [],
      dep_list: [],
      quyulist: [],
      ischushi: true,
      mapcarlist: [],
      mapyujinglist: [],
      tabindex: {
        ind: -1,
      },
      titleH1: "在线车辆",
      titleH2: "离线车辆",

      choose_pl: 0,
      videoarr: [
        {
          jc_data: null,
        },
        {
          jc_data: null,
        },
        {
          jc_data: null,
        },
      ],
      dingwei: null,
      selTypeYJ: 1, //1:人像预警 2：车牌预警
      selTypeCJ: 1, //1:人像采集 2：车牌采集

      jisuan_arr: [],
    };
  },
  destroyed() {},
  watch: {},
  methods: {
    map_depart() {
      sessionStorage.setItem("dingtype", 2);
      PubSub.publish("map_depart");
    },
    async selAllDepartOtherInfo() {
      var res = await selAllDepartOtherInfo();

      if (res.result) {
        this.dep_list = res.result;

        console.log(this.dep_list, "this.dep_list+++++++");
      }
    },
    async gyxyMapFlag() {
      var res = await gyxyMapFlag();

      if (res.result.records) {
        this.lk_list = res.result.records;
      }
    },
    async huoququyulist() {
      var dty = await huoqu_region({ size: 1000 });

      var liss = dty.result.records;

      this.quyulist = liss;
    },
    yidong() {
      var leftwiud = $(".left").width();

      if (leftwiud == "0") {
        $(".left").width("24%");

        $(".left_bottom").show();
      } else {
        $(".left").width("0");

        $(".left_bottom").hide();
      }
    },
    yidong2() {
      var leftwiud = $(".right").width();

      if (leftwiud == "0") {
        $(".right").width("24%");

        $(".right_top").show();

        $(".right_bottom").show();
      } else {
        $(".right").width("0");

        $(".right_top").hide();

        $(".right_bottom").hide();
      }
    },
    jisuan() {
      var swid = $(document).width();
      var shei = $(document).height();

      // debugger
    },
    changeTypeYJ(val) {
      console.log("val===", val);
      this.selTypeYJ = val;
    },
    changeTypeCJ(val) {
      this.selTypeCJ = val;
    },
    dingweivideo(data) {
      var p = Object.assign({}, data, { change: v4() });

      this.dingwei = p;

      //  this.videosss(data)
    },
    videosss(data) {
      //视频
      if (data.ptzStatus == 0) {
        // Message({
        //     showClose: true,
        //     message:'车辆不在线',
        //     type:'error',
        //     duration:2000
        // })
        return;
      }

      var p = Object.assign({}, data, { change: v4(), ip: data.gbInfomation });
      this.videoarr[this.choose_pl].jc_data = p;

      this.ischushi = false;
    },
    choosetab(index) {
      sessionStorage.setItem("dingtype", 1);
      var obj = {
        ind: index,
      };
      var p = Object.assign({}, obj, { change: v4() });
      this.tabindex = p;
    },
    addCar(data) {
      var obj = {
        list: data,
      };
      var p = Object.assign({}, obj, { change: v4() });

      // var p = [...data]
      this.mapcarlist = p;
    },
    addyujing(data) {
      this.mapyujinglist = data;
    },
    ////区域划分按钮  点击事件
    //go_quyuhuafen() {
    //  console.log("区域划分按钮");
    //  this.$router.push({ path: "mapbian" });
    //},
    //获取区域数据
    //获取数据----区域划分
    //async getRegionalDivision() {
    //  var dty = await huoqu_region({ size: 1000 });

    //  var liss = dty.result.records;
    //  //console.log("接口获取的数据是", liss);
    //  this.tableData = liss;
    //  liss.forEach((item, i) => {
    //    if (item.area) {
    //      var par = JSON.parse(item.area);
    //      //console.log(par, "数据检测");
    //      if (par && par.length != 0) {
    //        var points = [];
    //        for (var j = 0; j < par.length; j++) {
    //          points.push(new BMap.Point(par[j].lng, par[j].lat));
    //        }

    //        var mak = null;

    //        if (item.color == "2") {
    //          var styleOptions = {
    //            strokeColor: "red", //边线颜色。
    //            fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
    //            strokeWeight: 2, //边线的宽度，以像素为单位。
    //            strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    //            fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
    //            strokeStyle: "solid", //边线的样式，solid或dashed。
    //          };

    //          mak = new BMap.Polygon(points, styleOptions);
    //        } else if (item.color == "3") {
    //          var styleOptions = {
    //            strokeColor: "yellow", //边线颜色。
    //            fillColor: "yellow", //填充颜色。当参数为空时，圆形将没有填充效果。
    //            strokeWeight: 2, //边线的宽度，以像素为单位。
    //            strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    //            fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
    //            strokeStyle: "solid", //边线的样式，solid或dashed。
    //          };

    //          mak = new BMap.Polygon(points, styleOptions);
    //        } else {
    //          mak = new BMap.Polygon(points);
    //        }

    //        this.mapdui.addOverlay(mak);

    //        //区域标识的添加

    //        var tagMarkerIcon = new BMap.Icon(
    //          "/markers.png",
    //          new BMap.Size(23, 25),
    //          {
    //            imageOffset: new BMap.Size(0, 0 - 13 * 25), // 设置图片偏移
    //          }
    //        );

    //        var marker1 = new BMap.Marker(
    //          new BMap.Point(par[0].lng, par[0].lat),
    //          { icon: tagMarkerIcon }
    //        );
    //        var label1 = new BMap.Label(item.name, {
    //          offset: new BMap.Size(-15, 2),
    //        });
    //        //console.log(label1, "标注");
    //        //label1.setStyle({
    //        //  color: "red",
    //        //  fontSize: "9px",
    //        //  backgroundColor: "0.05",
    //        //  border: "0",
    //        //  fontWeight: "bold",
    //        //});

    //        marker1.setLabel(label1);
    //        this.mapdui.addOverlay(marker1);
    //      }
    //    }
    //  });
    //},
  },

  mounted() {
    console.log(this.$refs.getRegionalDivision, "ref对象");
    //子组件的方法====获取轨迹巡防的区域坐标
    this.$refs.getRegionalDivision.getRegionalDivision();

    sessionStorage.setItem("dingtype", 1);
    PubSub.publish("jc_header_show", true);
    this.jisuan();

    // this.huoququyulist()

    PubSub.subscribe("jldt", (msg, data) => {
      this.selAllDepartOtherInfo();

      this.gyxyMapFlag();
    });
  },
  activated() {
    PubSub.publish("nmhead");

    // var caiji_data = sessionStorage.getItem('caijiweizhi_date')
  },
  components: {
    Map,
    CusPlayer,
    ListpoliceCars,
    TitleOne,
    Warn,
    Collection,
    warnVideo,
  },
};
</script>

<style lang="scss" scoped>
//区域划分
.quyuhuafen {
  z-index: 100;
  position: absolute;
  top: 300px;
  left: 500px;
}
.video3 {
  border: solid 2px #14f114; /*no*/

  position: relative;
  box-sizing: border-box;
}
.index_container {
  width: 100%;
  height: 100%;
}

.zhaiwei {
  height: 9%;
}

.left {
  position: fixed;
  top: 10%;
  left: 21px;
  width: 24%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .videowarp-top {
    position: absolute;
    right: -18px;
    margin-top: -30px;
    top: 50%;
    // transform: rotate(270deg);
  }
}

.left_top {
  width: 100%;
  height: 40%;
  .da {
    width: 100%;
    height: 61%;
    position: relative;
    box-sizing: border-box;
  }
  .xiao_arr {
    width: 100%;
    height: 39%;
    display: flex;
  }
  .xiao {
    width: 50%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }
  .video2 {
    border: 1px solid #a4f8ff; /*no*/
  }
}

.left_bottom {
  width: 100%;
  height: 58%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .left_bottom-tab {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .map_depart {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  .left_bottom-bot {
    width: 100%;
    height: calc(100% - 40px);
  }
}
.border {
  border: 1px solid red;
}
.right {
  .videowarp-top {
    position: absolute;
    left: -18px;
    margin-top: -30px;
    top: 50%;
    // transform: rotate(270deg);
  }
  position: fixed;
  top: 10%;
  right: 21px;
  width: 24%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .tab-box {
    width: 100%;
    height: 40px;
  }
  .con-box {
    width: 100%;
    height: calc(100% - 40px);
  }
  .right_top {
    width: 100%;
    height: 54.7%;
  }
  .right_bottom {
    width: 100%;
    height: 43%;
  }
}
</style>
