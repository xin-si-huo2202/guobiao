<!-- 在线警车 -->
<template>
  <div class="selectgps">
    <div class="left">
      <div class="left-top">
        <div class="title-box">
          <div class="title-item title-btn" @click="fanhui">返回</div>
          <div v-show="trackType" class="title-item title-btn" @click="play(1)">
            开始
          </div>
          <div v-show="trackType" class="title-item title-btn" @click="play(2)">
            暂停
          </div>
          <div v-show="trackType" class="title-item title-btn" @click="play(3)">
            停止
          </div>
        </div>
      </div>
    </div>
    <!-- 轨迹动画开始按钮事件 -->
    <!--<div class="trackbtn" v-show="trackType">-->
    <!--<button @click="trackAnimationStart">开始</button>-->
    <!--<button id="run" @click="play(1)">开始</button>-->
    <!--<button id="stop" @click="play(2)">暂停</button>-->
    <!--<button id="pause" @click="play(3)">停止</button>-->
    <!--<button @click="continueAni()">继续</button>-->
    <!--</div>-->

    <div id="map_obj"></div>
  </div>
</template>

<script>
import Map from "../components/map.vue";
import {
  baocun_region,
  huoqu_region,
  shanchu_region,
  huoqu_point,
  shezhi_point,
  delete_point,
} from "@/api/system.js";
export default {
  data() {
    return {
      BDmap: null,
      trackType: false,
      //路书动画
      speed: 4000, //速度
      lushu: null, //路书
      mycaiId: sessionStorage.getItem("PointCar"),
      gpsArr: [], //后台拿到的gps点数组
      mapdui: null,
      PointArr_type: null,
    };
  },
  methods: {
    fanhui() {
      this.$router.push({
        path: "/index",
      });
    },
    //添加起始图标
    addStartMarker(point, name, mapInit) {
      // if (name == "起点") {
      // eslint-disable-next-line no-undef
      let myIcon = new BMap.Icon(
        require("@/assets/image/autoMap/mapmark.png"),
        new BMap.Size(32, 32),
        {
          //小车图片
          //offset: new BMap.Size(0, -5),    //相当于CSS精灵
          // eslint-disable-next-line no-undef
          imageOffset: new BMap.Size(0, 0), //图片的偏移量。为了是图片底部中心对准坐标点。
        }
      );
      //eslint-disable-next-line no-undef
      var label = new BMap.Label(name, { offset: new BMap.Size(-12, -15) });
      label.setStyle({
        color: "#fff",
        opacity: "0.5",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "0 10px",
        fontSize: "14px",
        lineHeight: "20px",
        border: "0",
        transform: "translateX(-50%)",
      });
      label.setStyle({
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "0 10px",
        fontSize: "14px",
        lineHeight: "20px",
        border: "0",
        transform: "translateX(-50%)",
      });
      // eslint-disable-next-line no-undef
      var marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
      marker.setLabel(label);
      // eslint-disable-next-line no-undef
      mapInit.addOverlay(marker); // 将标注添加到地图中
      //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      // }
    },
    //初始化地图
    baiduMapInit: function () {
      // 百度地图API功能
      if (this.PointArr_type == 2) return;
      var mapLatitude, mapLongitude;

      if (sessionStorage.mapLongitude && sessionStorage.mapLatitude) {
        mapLongitude = sessionStorage.mapLongitude;
        mapLatitude = sessionStorage.mapLatitude;
      } else {
        mapLongitude = 112.504313;
        mapLatitude = 33.003551;
      }

      var map = new BMap.Map("map_obj", { minZoom: 5, maxZoom: 18 }); // 创建Map实例
      this.mapdui = map;
      map.centerAndZoom(new BMap.Point(mapLongitude, mapLatitude), 18); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      this.BDmap = map;

      //  map.addEventListener("click", function (e) {

      //     $('.infobox').hide()
      //     debugger

      // });
    },
    ////轨迹查询--线路图
    //getTrack_poly(PointArr) {
    //  // this.$refs.BaiDumap.mapBaiDu();
    //  this.BDmap.clearOverlays();
    //  // var j = 0;
    //  // eslint-disable-next-line no-undef
    //  this.BDmap.centerAndZoom(
    //    new BMap.Point(PointArr[0][0].lng, PointArr[0][0].lat),
    //    15
    //  ); // 初始化地图,设置中心点坐标和地图级别
    //  // eslint-disable-next-line no-undef
    //  this.addStartMarker(
    //    new BMap.Point(PointArr[0][0].lng, PointArr[0][0].lat),
    //    "起点",
    //    this.BDmap
    //  );
    //  // eslint-disable-next-line no-undef

    //  PointArr.forEach((item, i) => {
    //    item = item.map((item2, i2) => {
    //      return new BMap.Point(item2.lng, item2.lat);
    //    });

    //    // debugger
    //    var polyline = new BMap.Polyline(item, {
    //      enableEditing: false, //是否启用线编辑，默认为false
    //      enableClicking: true, //是否响应点击事件，默认为true
    //      strokeWeight: "8", //折线的宽度，以像素为单位
    //      strokeOpacity: 0.8, //折线的透明度，取值范围0 - 1
    //      strokeColor: "#18a45b", //折线颜色
    //    });

    //    this.BDmap.addOverlay(polyline); //增加折线
    //  });

    //  // var polyline =new BMap.Polyline(PointArr, {
    //  //     enableEditing: false,//是否启用线编辑，默认为false
    //  //     enableClicking: true,//是否响应点击事件，默认为true
    //  //     strokeWeight:'8',//折线的宽度，以像素为单位
    //  //     strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
    //  //     strokeColor:"#18a45b" //折线颜色
    //  // });

    //  // this.BDmap.addOverlay(polyline);          //增加折线
    //  //终点图标
    //  // eslint-disable-next-line no-undef
    //  // var terminalPoint = new BMap.Icon(
    //  //   require("@/assets/image/autoMap/markend.png"),
    //  //   new BMap.Size(32, 32),
    //  //   {
    //  //     //小车图片
    //  //     //offset: new BMap.Size(0, -5),    //相当于CSS精灵
    //  //     // eslint-disable-next-line no-undef
    //  //     imageOffset: new BMap.Size(0, 0), //图片的偏移量。为了是图片底部中心对准坐标点。
    //  //   }
    //  // );
    //  // let num = PointArr[PointArr.length - 1];
    //  // // console.log("num=====",num);
    //  // // console.log("num====old===",PointArr.length-1);
    //  // // eslint-disable-next-line no-undef
    //  // console.log(num[num.length - 1].lng,num[num.length - 1].lat,'=======================================')
    //  // this.carMk = new BMap.Marker(
    //  //   new BMap.Point(num[num.length - 1].lng, num[num.length - 1].lat),
    //  //   { icon: terminalPoint }
    //  // ); // 创建标注
    //  // this.BDmap.addOverlay(this.carMk);

    //  let num = PointArr[PointArr.length - 1];
    //  this.addStartMarker(
    //    new BMap.Point(num[num.length - 1].lng, num[num.length - 1].lat),
    //    "终点",
    //    this.BDmap
    //  );

    //  // this.isupdate = 1
    //  this.$store.commit("SET_isupdate", 1);
    //},
    //轨迹查询
    getTrack(PointArr) {
      // this.$refs.BaiDumap.mapBaiDu();
      //this.BDmap.clearOverlays();
      // var j = 0;
      // eslint-disable-next-line no-undef
      this.BDmap.centerAndZoom(
        new BMap.Point(PointArr[0].lng, PointArr[0].lat),
        15
      ); // 初始化地图,设置中心点坐标和地图级别
      // eslint-disable-next-line no-undef
      this.addStartMarker(
        new BMap.Point(PointArr[0].lng, PointArr[0].lat),
        "起点",
        this.BDmap
      );
      // eslint-disable-next-line no-undef
      // var polyline =new BMap.Polyline(PointArr, {
      //     enableEditing: false,//是否启用线编辑，默认为false
      //     enableClicking: true,//是否响应点击事件，默认为true
      //     strokeWeight:'8',//折线的宽度，以像素为单位
      //     strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
      //     strokeColor:"#18a45b" //折线颜色
      // });

      // this.BDmap.addOverlay(polyline);          //增加折线

      var heatmapOverlay = new BMapLib.HeatmapOverlay({
        radius: 20,
        visible: true,
        maxOpacity: 0.7,
        minOpacity: 0,
      });
      this.BDmap.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({ data: PointArr, max: 100 });

      //终点图标
      // eslint-disable-next-line no-undef
      // var terminalPoint = new BMap.Icon(
      //   require("@/assets/image/autoMap/markend.png"),
      //   new BMap.Size(32, 32),
      //   {
      //     //小车图片
      //     //offset: new BMap.Size(0, -5),    //相当于CSS精灵
      //     // eslint-disable-next-line no-undef
      //     imageOffset: new BMap.Size(0, 0), //图片的偏移量。为了是图片底部中心对准坐标点。
      //   }
      // );
      // let num = PointArr.length - 1;
      // // eslint-disable-next-line no-undef
      // this.carMk = new BMap.Marker(new BMap.Point(num.lng, num.lat), {
      //   icon: terminalPoint,
      // }); // 创建标注
      // this.BDmap.addOverlay(this.carMk);

      let num = PointArr.length - 1;
      //console.log(
      //  num,
      //  PointArr[num].lng,
      //  PointArr[num].lat,
      //  "num.lng, num.lat"
      //);
      this.addStartMarker(
        new BMap.Point(PointArr[num].lng, PointArr[num].lat),
        "终点",
        this.BDmap
      );
      // this.isupdate = 1
      this.$store.commit("SET_isupdate", 1);
    },
    //路书动画

    trackAnimationStart() {
      //百度地图BMapGLLib库中的路书功能
      //console.log("动画开始");
      ////清除地图所有标记覆盖物
      //this.BDmap.clearOverlays();
      ////动画效果
      //var core_lng = JSON.parse(sessionStorage.PointArr)[0][0].lng;
      //var core_lat = JSON.parse(sessionStorage.PointArr)[0][0].lat;
      //var bmap = new BMapGL.Map("map_obj");
      //// 创建Map实例
      //bmap.centerAndZoom(new BMapGL.Point(core_lng, core_lat), 5); // 初始化地图,设置中心点坐标和地图级别
      //bmap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      //var path = [].concat.apply([], JSON.parse(sessionStorage.PointArr));
      //var point = [];
      //for (var i = 0; i < path.length; i++) {
      //  point.push(new BMapGL.Point(path[i].lng, path[i].lat));
      //}
      //var pl = new BMapGL.Polyline(point);
      //var trackAni = new BMapGLLib.TrackAnimation(bmap, pl, {
      //  overallView: true,
      //  tilt: 45,
      //  duration: this.duration,
      //  delay: 300,
      //});
      //trackAni.start();
    },
    //路书动画
    initMap() {
      if (this.PointArr_type == 1) return;
      //this.BDmap.clearOverlays();
      console.log("初始化=======路书动画");
      //console.log(JSON.parse(sessionStorage.PointCar));
      //this.mycaiId = sessionStorage.PointCar;
      //console.log(this.mycaiId, "测试叔叔");
      var core_lng = JSON.parse(sessionStorage.PointArr)[0][0].lng;
      var core_lat = JSON.parse(sessionStorage.PointArr)[0][0].lat;
      //console.log(JSON.parse(sessionStorage));
      var map = new BMap.Map("map_obj");
      map.enableScrollWheelZoom(true);
      map.centerAndZoom(new BMap.Point(core_lng, core_lat), 13);
      this.mapdui = map;
      this.BDmap = map;
      var arrPois = [];
      this.gpsArr = [].concat.apply([], JSON.parse(sessionStorage.PointArr));
      for (let i = 0; i < this.gpsArr.length; i++) {
        //var p0 = this.gpsArr[i].longtitude;
        //var p1 = this.gpsArr[i].latitude;
        //// var checksum = makerArry[i].checksum;
        //var point = new BMap.Point(p0, p1); //118.230272,33.482474
        //arrPois.push(point);
        arrPois.push(new BMap.Point(this.gpsArr[i].lng, this.gpsArr[i].lat));
      }
      //画轨迹
      var polyLine = new BMap.Polyline(arrPois, {
        strokeColor: "blue", //设置颜色
        strokeWeight: 5, //宽度
        strokeOpacity: 0.5, //透明度
      });
      map.addOverlay(polyLine);
      //画轨迹结束
      //给添加一个移动方法
      BMapLib.LuShu.prototype._move = function (initPos, targetPos, effect) {
        var pointsArr = [initPos, targetPos]; //点数组
        var me = this,
          //当前的帧数
          currentCount = 0,
          //步长，米/秒
          timer = 10,
          step = this._opts.speed / (1000 / timer),
          //初始坐标
          init_pos = this._projection.lngLatToPoint(initPos),
          //获取结束点的(x,y)坐标
          target_pos = this._projection.lngLatToPoint(targetPos),
          //总的步长
          count = Math.round(me._getDistance(init_pos, target_pos) / step);
        //显示折线 syj201607191107
        //如果想显示小车走过的痕迹，放开这段代码就行
        // this._map.addOverlay(
        //   new BMap.Polyline(pointsArr, {
        //     strokeColor: "#111",
        //     strokeWeight: 5,
        //     strokeOpacity: 0.5
        //   })
        // ); // 画线
        //如果小于1直接移动到下一点
        if (count < 1) {
          me._moveNext(++me.i);
          return;
        }
        me._intervalFlag = setInterval(function () {
          //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
          if (currentCount >= count) {
            clearInterval(me._intervalFlag);
            //移动的点已经超过总的长度
            if (me.i > me._path.length) {
              return;
            }
            //运行下一个点
            me._moveNext(++me.i);
          } else {
            currentCount++;
            var x = effect(init_pos.x, target_pos.x, currentCount, count),
              y = effect(init_pos.y, target_pos.y, currentCount, count),
              pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
            //设置marker
            if (currentCount == 1) {
              var proPos = null;
              if (me.i - 1 >= 0) {
                proPos = me._path[me.i - 1];
              }
              if (me._opts.enableRotation == true) {
                me.setRotation(proPos, initPos, targetPos);
              }
              if (me._opts.autoView) {
                if (!me._map.getBounds().containsPoint(pos)) {
                  me._map.setCenter(pos);
                }
              }
            }
            //正在移动
            me._marker.setPosition(pos);
            //设置自定义overlay的位置
            me._setInfoWin(pos);
          }
        }, timer);
      };
      this.initLushu(map, arrPois, this.mycaiId);
    },
    initLushu(map, arrPois, mycaiId) {
      console.log("我被执行了");
      this.lushu = new BMapLib.LuShu(map, arrPois, {
        defaultContent: mycaiId, //"从天安门到百度大厦"
        autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
        icon: new BMap.Icon(
          require("../../public/image/car.png"),
          new BMap.Size(52, 26),
          {
            anchor: new BMap.Size(27, 13),
          }
        ),
        speed: this.speed,
        enableRotation: true, //是否设置marker随着道路的走向进行旋转
        landmarkPois: [
          {
            lng: 116.306954,
            lat: 40.05718,
            html: "加油站",
            pauseTime: 2,
          },
        ],
      });

      //return lushu;
    },
    play(val) {
      if (this.arrIndex >= this.gpsArr.length - 3) {
        this.arrIndex = 0;
      }

      switch (val) {
        case 1:
          this.lushu.start();

          break;
        case 2:
          this.lushu.pause();
          break;
        case 3:
          this.lushu.stop();
          this.arrIndex = 0;
          this.percentage = 0;
          break;
      }
    },
    //打卡点数据
    async getPointList() {
      var that = this;
      var result = await huoqu_point();
      console.log(result, "打卡点数据");
      var pointList = result.result.records;
      //this.pointData = result.result.records;
      pointList.forEach((item, i) => {
        var point = [];
        point.lng = pointList[i].longitude;
        point.lat = pointList[i].latitude;
        point.push(new BMap.Point(point.lng, point.lat));
        var points = null;
        var tagMarkerIcon = new BMap.Icon(
          require("../../public/image/aaa.png"),
          new BMap.Size(120, 120)
        );
        //var markerOptions = {
        //  icon: tagMarkerIcon,
        //};
        points = new BMap.Marker(point, { icon: tagMarkerIcon });
        console.log(points);
        //console.log(this.mapdui);
        var label2 = new BMap.Label(item.id, {
          offset: new BMap.Size(-25, 20),
        });
        label2.setStyle({
          color: "#fff",
          opacity: "0.5",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          padding: "0 10px",
          fontSize: "14px",
          lineHeight: "20px",
          border: "0",
          transform: "translateX(-50%)",
        });
        label2.setStyle({
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          padding: "0 10px",
          fontSize: "14px",
          lineHeight: "20px",
          border: "0",
          transform: "translateX(-50%)",
        });
        points.setLabel(label2);
        that.mapdui.addOverlay(points);
      });
    },
  },
  mounted() {
    this.baiduMapInit();
    var PointArr = JSON.parse(sessionStorage.PointArr);
    this.getPointList();
    this.initMap();
    if (!sessionStorage.PointArr) {
      sessionStorage.removeItem("JC_Token");
      sessionStorage.setItem("islogin_tiao", 1);

      this.$router.replace({
        path: "/login",
      });

      return;
    }

    if (PointArr) {
      if (this.PointArr_type == 1) {
        this.getTrack(PointArr);
      } else {
        this.trackType = true;
      }
    }
  },
  created() {
    var PointArr_type = JSON.parse(sessionStorage.PointArr_type);
    console.log(PointArr_type, "类型");
    this.PointArr_type = PointArr_type;
  },
  components: {
    Map,
  },
};
</script>

<style lang='scss' scoped>
.selectgps {
  width: 100%;
  height: 100%;
}

#map_obj {
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
.left-top {
  height: 40px;
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
  cursor: pointer;
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
//轨迹动画开始按钮样式
.trackbtn {
  position: absolute;
  top: 400px;
  left: 200px;
  z-index: 199;
}
</style>
