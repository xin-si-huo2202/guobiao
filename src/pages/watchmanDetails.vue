<template>
  <div id="watchman">
    <div class="watchman_form">
      <p style="margin-top: 15px; font-size: 18px; color: #7f95ff">巡防详情</p>
      <!--<div
        style="
          display: flex;
          justify-content: space-between;
          margin: 10px;
          height: 30px;
        "
      >
        <div
          style="width: 60px; border: 1px solid black; color: white"
          class="juzhong"
        >
          +
        </div>
        <div
          style="
            flex: 1;
            border: 1px solid black;
            display: flex;
            justify-content: space-between;
            margin-left: 10px;
            margin-right: 10px;
            align-items: center;
            padding: 0 5px;
            background-color: #252c52;
            color: white;
          "
        >
          <span>2029</span><span>周一</span>
        </div>
        <div
          style="width: 60px; border: 1px solid black; color: white"
          class="juzhong"
        >
          -
        </div>
      </div>-->
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding: 0 10px;
        "
      >
        <div style="color: white; font-size: 18px" class="juzhong1">
          <span>巡防车辆：</span><span>{{ plateNumber }}</span>
        </div>
        <div style="color: white; font-size: 12px" class="juzhong1">
          <span>巡检人：</span><span>{{ signInPerson }}</span>
        </div>
      </div>
      <hr />
      <div>
        <div
          style="
            color: white;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
          "
        >
          <p>
            <span><</span>
            <span>{{ name }}</span>
            <span>></span>
          </p>
          <!--<p><span>99</span>/ <span>99</span></p>-->
        </div>
      </div>
      <div>
        <div
          style="
            color: white;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            height: 40px;
          "
        >
          <p>巡防打卡</p>
          <!--<p><span>99</span>/ <span>99</span></p>-->
        </div>
        <ul style="display: flex; flex-direction: column; color: white">
          <li
            v-for="item in pointData"
            :key="item.id"
            style="
              display: flex;
              align-items: center;
              list-style: none;
              padding: 0 20px;
              height: 50px;
              border-bottom: 1px solid black;
            "
          >
            <div
              style="display: flex; width: 100%; justify-content: space-between"
            >
              <span>{{ item.gridName }}</span>
              <span> {{ item.updateTime }}</span>
              <span> {{ isRegister }}</span>
            </div>
          </li>
        </ul>
      </div>
      <el-button type="primary" class="btn_fanhui" @click="$router.back()"
        >返回</el-button
      >
    </div>

    <div class="watchman_map" id="watchman_map"></div>
  </div>
</template>

<script>
import {
  baocun_region,
  huoqu_region,
  shanchu_region,
  huoqu_point,
  shezhi_point,
  delete_point,
  dateCount,
  getPunchPoint,
  getFenceArea,
  getGridSignin,
  getClockingRecored,
} from "@/api/system.js";
export default {
  data() {
    return {
      mapdui: null,
      longitude: "",
      latitude: "",
      //区域
      tableData: null,
      //打卡点
      pointData: null,
      plateNumber: null,
      signInPerson: "灰太狼",
      name: "",
      isRegister: null,
      time: null,
      girdId: null,
      ClockingRecoredList: null,
    };
  },
  methods: {
    //初始化地图
    mapbaidu() {
      var map = new BMap.Map("watchman_map"); // 创建地图实例
      this.mapdui = map;
      var point = new BMap.Point(this.longitude, this.latitude); // 创建点坐标
      var opts = {
        anchor: "BMAP_ANCHOR_BOTTOM_LEFT",
        offset: new BMap.Size(150, 5),
      };
      //var zoomCtrl = new BMap.ZoomControl(opts); // 添加缩放控件

      //map.addControl(zoomCtrl);
      map.centerAndZoom(point, 19); // 初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var that = this;
      //图画样式  -- 圆红色边框
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "white", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid", //边线的样式，solid或dashed。
      };
      this.getPointList();
      this.getRegionalDivision();
    },
    //获取数据-----获取打卡点的坐标数据
    async getPointList() {
      var result = await getPunchPoint();
      var pointList = result.result.records;
      console.log(pointList, "获取打卡点的坐标数据");
      //this.pointData = result.result.records;
      pointList.forEach((item, i) => {
        var point = [];
        point.lng = pointList[i].longitude;
        point.lat = pointList[i].latitude;
        point.push(new BMap.Point(point.lng, point.lat));
        var points = null;
        var tagMarkerIcon = new BMap.Icon(
          require("../../public/image/aaa.png"),
          new BMap.Size(100, 100)
        );
        //var markerOptions = {
        //  icon: tagMarkerIcon,
        //};
        points = new BMap.Marker(point, { icon: tagMarkerIcon });
        var label2 = new BMap.Label(item.gridName, {
          offset: new BMap.Size(-14, 36),
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
        points.setLabel(label2);
        this.mapdui.addOverlay(points);
      });
    },
    //获取数据----网格划分
    async getAllFenceArea() {
      var dty = await getFenceArea({ size: 1000 });
      console.log(dty, "接口获取的数据是");
      console.log(this.mapdui);
      var liss = dty.result.records;
      console.log("接口获取的数据是", liss);
      this.tableData = liss;
      liss.forEach((item, i) => {
        if (item.area) {
          var par = JSON.parse(item.area);
          //console.log(par, "数据检测");
          if (par && par.length != 0) {
            var points = [];
            for (var j = 0; j < par.length; j++) {
              points.push(new BMap.Point(par[j].lng, par[j].lat));
            }
            var mak = null;
            var styleOptions = {
              strokeColor: liss[i].color, //边线颜色。
              fillColor: liss[i].color, //填充颜色。当参数为空时，圆形将没有填充效果。
              strokeWeight: 2, //边线的宽度，以像素为单位。
              strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
              fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
              strokeStyle: "solid", //边线的样式，solid或dashed。
            };
            mak = new BMap.Polygon(points, styleOptions);
            this.mapdui.addOverlay(mak);

            //区域标识的添加

            var tagMarkerIcon = new BMap.Icon(
              "/markers.png",
              new BMap.Size(23, 25),
              {
                imageOffset: new BMap.Size(0, 0 - 13 * 25), // 设置图片偏移
              }
            );

            var marker1 = new BMap.Marker(
              new BMap.Point(par[0].lng, par[0].lat),
              { icon: tagMarkerIcon }
            );
            var label1 = new BMap.Label(item.name, {
              offset: new BMap.Size(-15, 2),
            });
            label1.setStyle({
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
            //console.log(label1, "标注");
            //label1.setStyle({
            //  color: "red",
            //  fontSize: "9px",
            //  backgroundColor: "0.05",
            //  border: "0",
            //  fontWeight: "bold",
            //});

            marker1.setLabel(label1);
            this.mapdui.addOverlay(marker1);
          }
        }
      });
    },
    //获取数据----区域划分
    async getRegionalDivision() {
      var dty = await getGridSignin();

      var liss = dty.result.records;
      console.log("接口获取的数据是", liss);
      this.tableData = liss;
      this.handleArea(liss);
    },
    //区域处理
    handleArea(liss) {
      var that = this;
      liss.forEach((item, i) => {
        if (item.gridArea) {
          var par = JSON.parse(item.gridArea);
          //console.log(par, "数据检测");
          if (par && par.length != 0) {
            var points = [];
            for (var j = 0; j < par.length; j++) {
              points.push(new BMap.Point(par[j].lng, par[j].lat));
            }

            var mak = null;

            var styleOptions = {
              strokeColor: liss[i].color, //边线颜色。
              fillColor: liss[i].color, //填充颜色。当参数为空时，圆形将没有填充效果。
              strokeWeight: 2, //边线的宽度，以像素为单位。
              strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
              fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
              strokeStyle: "solid", //边线的样式，solid或dashed。
            };
            console.log(styleOptions, "==================");
            mak = new BMap.Polygon(points, styleOptions);

            this.mapdui.addOverlay(mak);

            //区域标识的添加

            var tagMarkerIcon = new BMap.Icon(
              "/markers.png",
              new BMap.Size(23, 25),
              {
                imageOffset: new BMap.Size(0, 0 - 13 * 25), // 设置图片偏移
              }
            );

            var marker1 = new BMap.Marker(
              new BMap.Point(par[0].lng, par[0].lat),
              { icon: tagMarkerIcon }
            );
            var label1 = new BMap.Label(item.gridName, {
              offset: new BMap.Size(-15, 2),
            });
            label1.setStyle({
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
            marker1.setLabel(label1);
            this.mapdui.addOverlay(marker1);
          }
        }
      });
    },
    //根据区域来获取打卡记录的数据
    async getClockingRecoredList() {
      var from = { areaId: this.girdId, searhTime: this.time };
      var res = await getClockingRecored(from);
      console.log(res, "======打卡记录======");
      this.pointData = res.result.result;
      var list = [];
      res.result.result.forEach((item) => {
        if (item.gyxyClockingRecoredList) {
          list.push(...item.gyxyClockingRecoredList);
        }
      });
      console.log(list, "sdsdsdsd");
      this.ClockingRecoredList = list;
      this.setClockingRecoredList();
      //if (res.result.result.gyxyClockingRecoredList) {
      //  this.ClockingRecoredList = res.result.result.gyxyClockingRecoredList;
      //  console.log(this.ClockingRecoredList, "sssssssssssssssdddddddddddd");
      //  this.setClockingRecoredList();
      //}
    },
    //已经打卡的数据点设置maker
    setClockingRecoredList() {
      var clockingRecoredList = this.ClockingRecoredList;
      console.log(clockingRecoredList, "sssssssssssssssssssss");
      clockingRecoredList.forEach((item, i) => {
        var point = [];
        point.lng = clockingRecoredList[i].longitude;
        point.lat = clockingRecoredList[i].latitude;
        point.push(new BMap.Point(point.lng, point.lat));
        var points = null;
        var tagMarkerIcon = new BMap.Icon(
          require("../../public/image/bbb.png"),
          new BMap.Size(100, 100)
        );
        //var markerOptions = {
        //  icon: tagMarkerIcon,
        //};
        points = new BMap.Marker(point, { icon: tagMarkerIcon });
        var label2 = new BMap.Label(item.gridName, {
          offset: new BMap.Size(-14, 36),
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
        points.setLabel(label2);
        this.mapdui.addOverlay(points);
      });
    },
  },
  mounted() {
    //用于控制头部导航栏的显示与隐藏
    PubSub.publish("jc_header_show", true);
    this.mapbaidu();
    this.getRegionalDivision();
    this.getAllFenceArea();
    this.getPointList();
    this.getClockingRecoredList();
  },
  created() {
    console.log(this.$route.query.info, "传参", this.$route.query.time);
    this.time = this.$route.query.time;
    this.girdId = this.$route.query.info.id;
    console.log(this.time, this.girdId);
    this.plateNumber = this.$route.query.info.plateNumber
      ? this.$route.query.info.plateNumber
      : "暂无数据";
    this.signInPerson = this.$route.query.info.signInPerson
      ? this.$route.query.info.signInPerson
      : "暂无数据";
    this.name = this.$route.query.info.name;
    this.isRegister = this.$route.query.info.isRegister ? "已打卡" : "待打卡";
    if (this.$route.query.info.area) {
      var point = JSON.parse(this.$route.query.info.area);
      console.log(point);
      this.longitude = point[0].lng;
      this.latitude = point[0].lat;
    } else {
      this.longitude = "112.50465732220394";
      this.latitude = "33.001687865274654";
    }
    //if (this.$route.query.info.lon) {
    //  this.longitude = this.$route.query.info.lon;
    //  this.latitude = this.$route.query.info.lat;
    //} else {
    //  var aaa = JSON.parse(this.$route.query.info.area);
    //  console.log(aaa[0]);
    //  this.longitude = aaa[0].lng;
    //  this.latitude = aaa[0].lat;
    //}
  },
};
</script>

<style lang="scss" scoped>
.btn_fanhui {
  position: absolute;
  top: 150px;
  right: 30px;
  z-index: 100;
}
#watchman {
  display: flex;
  flex-direction: row;

  height: 100%;
  width: 100%;
  .watchman_form {
    margin-top: 90px;
    background-color: #1d2340;
    width: 600px;
    .juzhong {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #252c52;
    }
    .juzhong1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .watchman_map {
    flex: 1;
    padding-top: 90px;
    //background-color: rgb(31, 21, 212);
  }
}
</style>