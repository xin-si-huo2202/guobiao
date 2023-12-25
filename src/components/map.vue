<template>
  <div class="map_obj_box">
    <div :id="map_obj" class="lkjcsdklc"></div>

    <div class="guiji">
      <div class="guiji-sj">
        <div class="guiji-sj-item">
          <date-picker
            :confirm="true"
            confirm-text="确定"
            placeholder="选择日期"
            valueType="format"
            :lang="lang"
            v-model="startTime"
            type="datetime"
            @change="handleStartTimeChange"
          ></date-picker>
        </div>

        <div class="guiji-sj-item jieshu">
          <date-picker
            :confirm="true"
            confirm-text="确定"
            placeholder="结束日期"
            valueType="format"
            :lang="lang"
            v-model="endTime"
            type="datetime"
            @change="handleEndTimeChange"
          ></date-picker>
        </div>
      </div>

      <div class="sjd-tit">
        <!--<div class="sjd-tit-item">
          <img
            class="reliimg"
            @click="choose_sj_type(1)"
            :src="
              sj_type == 1
                ? require('@/assets/image/guiji-active.png')
                : require('@/assets/image/guiji-not.png')
            "
          />
          <span>今日</span>
        </div>-->

        <!--<div class="sjd-tit-item">
          <img
            class="reliimg"
            @click="choose_sj_type(2)"
            :src="
              sj_type == 2
                ? require('@/assets/image/guiji-active.png')
                : require('@/assets/image/guiji-not.png')
            "
          />
          <span>近三日</span>
        </div>-->

        <!--<div class='sjd-tit-item'>
                   <img class='reliimg' @click="choose_sj_type(3)"  :src="sj_type==3?require('@/assets/image/guiji-active.png'):require('@/assets/image/guiji-not.png')" />
                    <span>近一周</span>
                </div>-->

        <!--<div class='sjd-tit-item'>
                   <img class='reliimg' @click="choose_sj_type(4)"  :src="sj_type==4?require('@/assets/image/guiji-active.png'):require('@/assets/image/guiji-not.png')" />
                    <span>近一月</span>
                </div>-->
      </div>
      <!-- 线路图选择 -->
      <div class="guiji-tit">
        <div class="xian"></div>

        <div class="xian_tb">
          <img
            class="reliimg"
            @click="choose_guiji_type(1)"
            :src="
              guiji_type == 1
                ? require('@/assets/image/guiji-active.png')
                : require('@/assets/image/guiji-not.png')
            "
          />

          <span class="reli">热力图</span>

          <img
            class="xianluimg"
            @click="choose_guiji_type(2)"
            :src="
              guiji_type == 2
                ? require('@/assets/image/guiji-active.png')
                : require('@/assets/image/guiji-not.png')
            "
          />

          <span class="reli">线路图</span>
        </div>
      </div>
      <!-- 功能按钮-----轨迹查询 -->
      <div class="guiji-btn">
        <p class="cha" @click="chaxun_guiji">轨迹查询</p>

        <p class="qu" @click="yincang()">取消</p>
      </div>
    </div>
    <!-- 视频弹框 -->
    <el-dialog
      title="在线视频"
      :visible.sync="dialogVisible"
      width="40%"
      :modal="false"
      :destroy-on-close="true"
      :before-close="handleCloseVideo"
    >
      <div style="height: 300px; width: 100%">
        <VuePlayer ref="video" :src="src" id="video"></VuePlayer>
      </div>

      <!--<span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";
import { Message, Loading } from "element-ui";
import { selectGps } from "@/api/monitor.js";
import PubSub from "pubsub-js";
import { v4 } from "uuid";
import { startLoding, endLoding } from "@/request/loading.js";
import VuePlayer from "@/components/JessibucaComponents.vue";
import { getKedaVideo } from "@/api/kedavideo.js";
import {
  gyxyFaceWarning_edit,
  gyxyPlateWarning_edit,
  putSerialNumberWarning,
} from "@/api/warningInfo.js";
import { quandata, getFenceArea, getGridSignin } from "@/api/system.js";
import { gbBackStopNow } from "@/api/kdvideo.js";
// var map;
// var that.markerList = [];

//计算地图覆盖物缩放比例
var winwid = $(window).width();

var scale_num = winwid / 1920;

if (scale_num < 1) {
  scale_num = 1;
}

scale_num = scale_num * 0.9;

export default {
  name: "Map",
  props: [
    "mapcarlist",
    "dingwei",
    "mapyujinglist",
    "chepaiwarn",
    "chepaiwarn_rx",
    "guijiList",
    "gujid",
    "quyulist",
    "dataList",
    "jsdingwei",
    "deplist",
    "lklist",
    "clearmap",
  ],
  watch: {
    dataList: {
      handler(newss, old) {
        var that = this;
        if (newss.length != 0) {
          this.clearyujing("jsbox");
          newss.forEach((item, i) => {
            //去除
            // var point = {
            //     "lng": 112.504313,
            //     "lat": 33.003551
            // }

            var point = {
              lng: item.gpsLongitude,
              lat: item.gpsLatitude,
            };

            // 给地图添加点
            this.createMark_js(point, i, item);

            //去除
            // if(item.carNumber=='豫R3D368'){
            //     this.createMark_car(point,i,item);
            // }

            // if(item.carNumber=='豫R892D5'){
            //     this.createMark_car(point,i,item);
            // }
          });
        }
      },
    },
    quyulist: {
      handler(newss, old) {
        var that = this;
        if (newss) {
          newss.forEach((item, i) => {
            if (item.area) {
              var par = JSON.parse(item.area);

              if (par && par.length != 0) {
                var points = [];
                for (var j = 0; j < par.length; j++) {
                  points.push(new BMap.Point(par[j].lng, par[j].lat));
                }

                var mak = null;

                if (item.color == "2") {
                  var styleOptions = {
                    strokeColor: "red", //边线颜色。
                    fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 2, //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
                    strokeStyle: "solid", //边线的样式，solid或dashed。
                  };

                  mak = new BMap.Polygon(points, styleOptions);
                } else if (item.color == "3") {
                  var styleOptions = {
                    strokeColor: "yellow", //边线颜色。
                    fillColor: "yellow", //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 2, //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
                    strokeStyle: "solid", //边线的样式，solid或dashed。
                  };

                  mak = new BMap.Polygon(points, styleOptions);
                } else {
                  var styleOptions = {
                    strokeColor: "blue", //边线颜色。
                    fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 2, //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
                    strokeStyle: "solid", //边线的样式，solid或dashed。
                  };

                  mak = new BMap.Polygon(points, styleOptions);
                }

                this.mapdui.addOverlay(mak);

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
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "10px",
                  padding: "0 10px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  border: "0",
                  opacity: "0.5",
                  transform: "translateX(-50%)",
                });

                //  label1.setStyle({
                //     color: "red",
                //     fontSize: "9px",
                //     backgroundColor: "0.05",
                //     border: "0",
                //     fontWeight: "bold"
                // });

                marker1.setLabel(label1);
                this.mapdui.addOverlay(marker1);
              }
            }
          });
        }
      },

      immediate: false,
    },
    gujid: {
      handler(newss, old) {
        var that = this;
        if (newss) {
          that.show_guiji_info(newss);
        }
      },

      immediate: false,
    },
    guijiList: {
      handler(newss, old) {
        if (newss.length != 0) {
          this.clearyujing("guijibox");
          newss.forEach((item, i) => {
            //去除
            // var point = {
            //     "lng": 112.504313,
            //     "lat": 33.003551
            // }

            var point = {
              lng: item.gpsLongitude,
              lat: item.gpsLatitude,
            };

            // 给地图添加点
            this.createMark_cpguiji(point, i, item);

            //去除
            // if(item.carNumber=='豫R3D368'){
            //     this.createMark_car(point,i,item);
            // }

            // if(item.carNumber=='豫R892D5'){
            //     this.createMark_car(point,i,item);
            // }
          });
        }
      },

      immediate: false,
    },
    chepaiwarn: {
      handler(newss, old) {
        var point = {
          lng: newss.longitude,
          lat: newss.latitude,
        };

        // 给地图添加点
        this.createMark_yujing(point, 0, newss);
      },

      immediate: false,
    },
    chepaiwarn_rx: {
      handler(newss, old) {
        // var point = {
        //     "lng": newss.longitude,
        //     "lat": newss.latitude
        // }
        // // 给地图添加点
        // this.createMark_yujing_rx(point,0,newss);
      },

      immediate: false,
    },
    lklist: {
      handler(newss, old) {
        //debugger;
        if (newss.length != 0) {
          this.clearyujing("zidingyibox");
          newss.forEach((item, i) => {
            var point = {
              lng: item.flagGpsLongitude,
              lat: item.flagGpsLatitude,
            };

            // 给地图添加点
            this.createMark_car3(point, i, item);
          });
        }
      },

      immediate: false,
    },
    deplist: {
      handler(newss, old) {
        if (newss.length != 0) {
          this.clearyujing("zidingyibox");
          newss.forEach((item, i) => {
            var point = {
              lng: item.gpsLongitude,
              lat: item.gpsLatitude,
            };

            // 给地图添加点
            this.createMark_car2(point, i, item);
          });
        }
      },

      immediate: false,
    },
    mapcarlist: {
      handler(newss, old) {
        // var mapLatitude,mapLongitude;

        // if(sessionStorage.mapLongitude){
        //     mapLongitude = sessionStorage.mapLongitude
        //     mapLatitude = sessionStorage.mapLatitude
        // }

        // this.mapdui.centerAndZoom(new BMap.Point(mapLongitude,mapLatitude), 18);

        var sdf = newss.list;

        if (sdf.length != 0) {
          $(".guiji").appendTo($(".map_obj_box"));

          $(".infobox").hide();
          this.clearyujing("zidingyibox2");
          this.clearyujing("zidingyibox3");
          this.clearyujing("zidingyibox");
          sdf.forEach((item, i) => {
            var point = {
              lng: item.longitude,
              lat: item.latitude,
            };

            // 给地图添加点
            this.createMark_car(point, i, item);
          });
        }
      },

      immediate: false,
    },

    mapyujinglist: {
      handler(newss, old) {
        if (newss.length) {
          // newss.forEach((item,i)=>{
          //     var point = {
          //         "lng": item.longitude,
          //         "lat": item.latitude
          //     }
          //     // 给地图添加点
          //     this.createMark_yujing(point,i,item);
          // });
        }
      },

      immediate: false,
    },

    dingwei: {
      handler(newss, old) {
        if (sessionStorage.dingtype == 1) {
          this.show_car_info(newss);
        } else {
          sessionStorage.setItem("dingtype", 1);

          if (this.mapcarlist.list.length != 0) {
            $(".guiji").appendTo($(".map_obj_box"));

            $(".infobox").hide();
            this.clearyujing("zidingyibox2");
            this.clearyujing("zidingyibox3");
            this.clearyujing("zidingyibox");
            this.mapcarlist.list.forEach((item, i) => {
              var point = {
                lng: item.longitude,
                lat: item.latitude,
              };

              // 给地图添加点
              this.createMark_car(point, i, item);
            });
          }

          setTimeout(() => {
            this.show_car_info(newss);
          }, 2000);
        }
      },

      immediate: false,
    },

    jsdingwei: {
      handler(newss, old) {
        if (newss.gpsLongitude) {
          this.show_js_info(newss);
        }
      },

      immediate: false,
    },
    //监听日期选择变化
    //endTime: function (newsValue, oldValue) {},
  },

  data() {
    return {
      //视频弹框
      dialogVisible: false,
      //视频地址
      src: "",
      stopInfo:null,
      startTime: null,
      endTime: null,
      //PointCar: "",
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      guiji_type: 2,
      dingwei_pcNumber: "",
      map_obj: v4(),
      mapdui: null,
      markerList: [],
      sj_type: "",
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
            time.getTime() > Date.now()
          );
        },
      },
    };
  },
  destroyed() {},

  methods: {
    //视频关闭前
    async handleCloseVideo() {
      //this.$nextTick(() => {
        console.log(this.stopInfo);
        var form = {
        deviceCode: this.stopInfo.deviceCode,
        channelNo:1,
      };
      try {
        var res = await gbBackStopNow(form);
      } catch (error) {
        console.log(error);
      }
      console.log(this.$refs.video);
      //销毁视频
      console.log("销毁视频", this.$refs.video);
      await this.$refs.video.destroy();
      this.dialogVisible = false;
      //});
    },
    //用来控制选择的时间不超过24小时哦
    //disabledDate(date) {
    //  //开始时间大于结束时间，则不可选择
    //  if (this.startTime && date && date.getTime() <= this.startTime) {
    //    return true;
    //  }
    //  //时间间隔不能超过24小时
    //  if (
    //    this.startTime &&
    //    date &&
    //    date.getTime() - this.startTime > 24 * 3600 * 1000
    //  ) {
    //    return true;
    //  }
    //  return false;
    //},
    //时间戳转换日期格式
    timerHandel(times) {
      var date = new Date(times); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //时间处理
    //开始时间处理
    handleStartTimeChange(val) {
      this.startTime = val;
      console.log(this.endTime);
      console.log(this.startTime);
      if (this.endTime) {
        const diffTime = new Date(this.endTime) - new Date(this.startTime);
        // 超过24小时自动设置为24小时
        if (diffTime > 86400000) {
          this.$message({
            message: "只能获取24小时以内的数据",
            type: "error",
          });
          this.endTime = this.timerHandel(new Date(this.startTime) + 86400000);
        }
      } else {
        return;
      }
    },
    //结束时间处理
    handleEndTimeChange(val) {
      this.endTime = val;
      if (this.startTime) {
        const diffTime = new Date(this.endTime) - new Date(this.startTime);
        // 超过24小时自动设置为24小时
        if (diffTime > 86400000) {
          this.$message({
            message: "只能获取24小时以内的数据",
            type: "error",
          });
          this.startTime = this.timerHandel(new Date(this.endTime) - 86400000);
        }
      } else {
        return;
      }
    },
    suyuan(newss) {
      console.log(newss, "$$$$$$$$dom事件绑定$$$$$$$$");
      if (newss.isResponse_dictText) {
        //有这个属性说明是串号预警的数据
        console.log("我在手机串号预警执行了");
        this.$router.push({
          path: "/Retrospective",
          query: {
            fromCar: newss.fromCar,
            timeStart: "",
            timeEnd: "",
          },
        });
      } else {
        if (this.$route.path == "/index") {
          this.$router.push({
            path: "/Tracetracing",
            query: {
              plateNo: newss.plateCode,
              timeStart: "",
              timeEnd: "",
              pageType: 3,
            },
          });
        } else {
          this.$router.push({
            path: "/Tracetracing",
            query: {
              plateNo: newss.plateCode,
              timeStart: "",
              timeEnd: "",
            },
          });
        }
      }
    },
    //轨迹查询
    async getTrack() {
      var form = {
        pcNumber: this.dingwei_pcNumber,
        timeStart: this.startTime,
        timeEnd: this.endTime,
      };
      console.log(form, "获取导航猎豹数据接口的参数");
      let arr = null;
      let PointArr = [];
      var loading_lo;
      var PointCar;

      try {
        loading_lo = startLoding(".cha");
        const res = await selectGps(form);
        endLoding(loading_lo);
        console.log("轨迹导航动画测试数据======", res);
        PointCar = res.result.list[0][0].carNumber;
        //console.log(this.PointCar, "车牌号");
        if (!res.result || res.result.list.length == 0) {
          this.$message.error("车辆没有行车轨迹!");
          return;
        }
        arr = res.result.list;
        // console.log(arr,'oiuoiuoiuoi')

        // console.log(this.typeid, "this.typeid");
        //热力图
        if (this.guiji_type == 1) {
          for (var i = 0; i < arr.length; i++) {
            // eslint-disable-next-line no-undef
            for (var i2 = 0; i2 < arr[i].length; i2++) {
              PointArr.push(
                new BMap.Point(arr[i][i2].gpsLon, arr[i][i2].gpsLat)
              );
            }
          }
          // this.$emit("getTrack", PointArr);
          sessionStorage.setItem("PointCar", PointCar);
          sessionStorage.setItem("PointArr", JSON.stringify(PointArr));
          sessionStorage.setItem("PointArr_type", this.guiji_type);
          this.$router.push({
            path: "/selectgps",
          });
        } else {
          //轨迹图
          for (var i = 0; i < arr.length; i++) {
            // eslint-disable-next-line no-undef
            PointArr.push([]);
            for (var i2 = 0; i2 < arr[i].length; i2++) {
              PointArr[i].push(
                new BMap.Point(arr[i][i2].gpsLon, arr[i][i2].gpsLat)
              );
            }
          }
          console.log(PointArr, "PointArroiuoiuoiuoi");

          // this.$emit("getTrack_poly", PointArr);
          //轨迹动画
          sessionStorage.setItem("PointCar", PointCar);
          sessionStorage.setItem("PointArr", JSON.stringify(PointArr));
          sessionStorage.setItem("PointArr_type", this.guiji_type);
          this.$router.push({
            path: "/selectgps",
          });
        }
      } catch (err) {
        endLoding(loading_lo);

        Message({
          showClose: true,
          message: "暂无数据",
          type: "error",
          duration: 2000,
        });
      }
    },
    chaxun_guiji() {
      if (!this.startTime) {
        this.$message.error("请选择要查询的时间!");
        return;
      }
      this.getTrack();
      // Message({
      //     showClose: true,
      //     message:'接口暂无此功能',
      //     type:'error',
      //     duration:2000
      // })
    },
    show_car_info2(data, zt = false) {
      var that = this;

      that.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("carId") == data.id) {
            if (zt == "block") {
              $(d1._div).find(".infobox").show();
            } else {
              $(d1._div).find(".infobox").toggle();
            }

            $(d1._div).find(".one label").click();

            var yuandata = JSON.parse($(d1._div).attr("yuandata"));

            var point = {
              lng: yuandata.gpsLongitude,
              lat: yuandata.gpsLatitude,
            };

            var position2 = { x: "", y: "" };

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472 / 2;
            position2.y = position.y - 381 / 2;

            var cen = that.mapdui.overlayPixelToPoint(position2);

            that.mapdui.setCenter(cen);

            $(d1._div).css({
              "z-index": 3,
            });
          } else {
            $(d1._div).find(".infobox").hide();

            //把预警的都给隐藏
            $(d1._div).find(".yujing_info").hide();
            $(d1._div).find(".yujing_info-rx").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });
    },
    show_car_info(data, zt = false) {
      var that = this;
      this.dingwei_pcNumber = data.carNumber;
      $(".guiji").hide();
      that.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("carId") == data.carId) {
            $(".guiji").appendTo($(d1._div).find(".infobox"));

            if (zt == "block") {
              $(d1._div).find(".infobox").show();
            } else {
              $(d1._div).find(".infobox").toggle();
            }

            console.log($(d1._div).find(".one"));
            $(d1._div).find(".one label").click();

            var yuandata = JSON.parse($(d1._div).attr("yuandata"));

            var point = {
              lng: yuandata.longitude,
              lat: yuandata.latitude,
            };

            var position2 = { x: "", y: "" };

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472 / 2;
            position2.y = position.y - 381 / 2;

            var cen = that.mapdui.overlayPixelToPoint(position2);

            that.mapdui.setCenter(cen);

            $(d1._div).css({
              "z-index": 3,
            });
          } else {
            $(d1._div).find(".infobox").hide();

            //把预警的都给隐藏
            $(d1._div).find(".yujing_info").hide();
            $(d1._div).find(".yujing_info-rx").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });
    },
    show_js_info(data) {
      //console.log("aaa", data);
      console.log(this.markerList);
      this.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("jsid") == data.id) {
            $(d1._div).find(".guiji-info").toggle();

            $(d1._div).css({
              "z-index": 2,
            });
          } else {
            $(d1._div).find(".guiji-info").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });

      var po = {
        x: data.gpsLongitude,
        y: data.gpsLatitude,
      };

      this.mapdui.centerAndZoom(
        new BMap.Point(data.gpsLongitude, data.gpsLatitude),
        18
      ); // 初始化地图,设置中心点坐标和地图级别
    },
    show_guiji_info(data) {
      this.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("createTime") == data.createTime) {
            $(d1._div).find(".guiji-info").toggle();

            $(d1._div).css({
              "z-index": 2,
            });
          } else {
            $(d1._div).find(".guiji-info").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });
      console.log(data, "&&&&&&&&&&&&&&&&&&传参初始化");
      var po = {
        x: data.gpsLongitude,
        y: data.gpsLatitude,
      };
      if (data.isPhone) {
        this.mapdui.centerAndZoom(
          new BMap.Point(data.longitude, data.latitude),
          18
        ); // 初始化地图,设置中心点坐标和地图级别
      } else {
        this.mapdui.centerAndZoom(
          new BMap.Point(data.gpsLongitude, data.gpsLatitude),
          18
        ); // 初始化地图,设置中心点坐标和地图级别
      }
    },
    //手机串号预警

    //show_guiji_info(data) {
    //  this.markerList.forEach((d1, i) => {
    //    if (d1) {
    //      if ($(d1._div).attr("createTime") == data.createTime) {
    //        $(d1._div).find(".guiji-info").toggle();

    //        $(d1._div).css({
    //          "z-index": 2,
    //        });
    //      } else {
    //        $(d1._div).find(".guiji-info").hide();

    //        $(d1._div).css({
    //          "z-index": 1,
    //        });
    //      }
    //    }
    //  });

    //  var po = {
    //    x: data.gpsLongitude,
    //    y: data.gpsLatitude,
    //  };

    //  this.mapdui.centerAndZoom(
    //    new BMap.Point(data.gpsLongitude, data.gpsLatitude),
    //    18
    //  ); // 初始化地图,设置中心点坐标和地图级别
    //},
    show_yujing_cp_info(data) {
      var that = this;
      this.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("yujingid-cp") == data.id) {
            // $(d1._div).find('.yujing_info').toggle()

            $(d1._div).find(".yujing_info").show();

            $(d1._div).css({
              "z-index": 2,
            });

            var yuandata = JSON.parse($(d1._div).attr("yuandata"));

            var point = {
              lng: yuandata.longitude,
              lat: yuandata.latitude,
            };

            var position2 = { x: "", y: "" };

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472 / 2;
            position2.y = position.y - 381 / 2;

            var cen = that.mapdui.overlayPixelToPoint(position2);

            that.mapdui.setCenter(cen);
          } else {
            $(d1._div).find(".yujing_info").hide();

            //把人像预警的和警车列表的也隐藏
            $(d1._div).find(".infobox").hide();
            $(d1._div).find(".yujing_info-rx").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });
    },
    show_yujing_rx_info(data) {
      var that = this;

      this.markerList.forEach((d1, i) => {
        if (d1) {
          if ($(d1._div).attr("yujingid-rx") == data.id) {
            // $(d1._div).find('.yujing_info-rx').toggle()

            $(d1._div).find(".yujing_info-rx").show();

            $(d1._div).css({
              "z-index": 2,
            });

            var yuandata = JSON.parse($(d1._div).attr("yuandata"));

            var point = {
              lng: yuandata.longitude,
              lat: yuandata.latitude,
            };

            var position2 = { x: "", y: "" };

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472 / 2;
            position2.y = position.y - 530 / 2;

            var cen = that.mapdui.overlayPixelToPoint(position2);

            that.mapdui.setCenter(cen);
          } else {
            $(d1._div).find(".yujing_info-rx").hide();

            //把警车预警的和警车列表的也隐藏
            $(d1._div).find(".infobox").hide();
            $(d1._div).find(".yujing_info").hide();

            $(d1._div).css({
              "z-index": 1,
            });
          }
        }
      });
    },
    yincang() {
      $(".infobox").hide();
    },
    choose_sj_type(type) {
      this.sj_type = type;

      // if(type==1){
      //     this.startTime=''

      //     this.endTime=''
      // }
      this.xiba(type);
    },
    choose_guiji_type(type) {
      this.guiji_type = type;
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
    xiba(type) {
      if (type == 1) {
        var jkl = this.getNowTime2(new Date());
        this.startTime = jkl + " 00:00:00";
        this.endTime = jkl + " 23:59:59";
      } else if (type == 2) {
        var yesterdsay = this.getNowTime(
          new Date(new Date().getTime() - 86400000 * 3)
        );
        var jkl = this.getNowTime(new Date());
        // this.startTime=yesterdsay+" 00:00:00";
        // this.endTime=jkl+ " 23:59:59";
        this.startTime = yesterdsay;
        this.endTime = jkl;
      } else if (type == 3) {
        var yesterdsay = this.getNowTime(
          new Date(new Date().getTime() - 86400000 * 7)
        );
        var jkl = this.getNowTime(new Date());
        // this.startTime=yesterdsay+" 00:00:00";
        // this.endTime=jkl+ " 23:59:59";
        this.startTime = yesterdsay;
        this.endTime = jkl;
      } else if (type == 4) {
        var yesterdsay = this.getNowTime(
          new Date(new Date().getTime() - 86400000 * 30)
        );
        var jkl = this.getNowTime(new Date());
        // this.startTime=yesterdsay+" 00:00:00";
        // this.endTime=jkl+ " 23:59:59";
        this.startTime = yesterdsay;
        this.endTime = jkl;
      }
    },
    //初始化地图
    async baiduMapInit() {
      //盒子的
      var hfh = this.map_obj;
      // 百度地图API功能
      this.mapdui = new BMap.Map(hfh, { minZoom: 5, maxZoom: 18 }); // 创建Map实例

      // mapLatitude: 12124.1111111111
      // mapLongitude: 123.00000000000001

      var mapLatitude, mapLongitude;

      if (sessionStorage.mapLongitude) {
        mapLongitude = sessionStorage.mapLongitude;
        mapLatitude = sessionStorage.mapLatitude;
      }
      console.log(mapLongitude, mapLatitude);
      this.mapdui.centerAndZoom(new BMap.Point(mapLongitude, mapLatitude), 18); // 初始化地图,设置中心点坐标和地图级别
      // debugger
      this.mapdui.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      if (this.$props.clearmap) {
        console.log("清除地图标记");
        this.mapdui.clearOverlays();
      }

      //  map.addEventListener("click", function (e) {

      //     $('.infobox').hide()
      //     debugger

      // });

      console.log(this.$source_name, "source_name");
      // if(this.$route.path=='/index' && (this.$source_name == '测试服务器' || process.env.NODE_ENV == 'development') ){
      if (this.$route.path == "/index") {
        console.log(this.$source_name);
        // debugger
        // if(!sessionStorage.quandata){
        //     var quanda =  await quandata()

        //     sessionStorage.setItem("quandata",JSON.stringify( quanda.result ) );
        // }

        var ri = $(".index_ri").position().left;

        var yhei = ($(document).height() * 10) / 100;
        var ywid = $(document).width() - ri;

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
        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(that.mapdui, {
          enableCalculate: true, //是否开启测量模式
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(ywid, yhei), //偏离值  左，上

            scale: 0.8, //工具栏缩放比例
            drawingModes: [
              // BMAP_DRAWING_MARKER,
              BMAP_DRAWING_CIRCLE,
              // BMAP_DRAWING_POLYLINE,
              // BMAP_DRAWING_POLYGON,
              // BMAP_DRAWING_RECTANGLE ,
              BMAP_DRAWING_CLEAR,
            ],
          },

          circleOptions: styleOptions, //圆的样式
        });
        var dty;
        var that = this;
        var cun, nums, r, che_nums, ren_nums;

        // if(dty.result && dty.result.length!=0){
        //     sessionStorage.setItem("quandd", 1)
        // }

        drawingManager.addEventListener("overlaycomplete", async function (e) {
          cun = [];
          nums = 0;
          che_nums = 0;
          ren_nums = 0;

          console.log(e, "789");

          if (!dty) {
            drawingManager.close();

            // Message({
            //     showClose: true,
            //     message:'数据尚未返回，请稍后再试',
            //     type:'error',
            //     duration:2000
            // })
            that.createMark_loading(
              e.overlay.point,
              0,
              nums,
              cun,
              r,
              che_nums,
              ren_nums
            );
            return;
          }

          dty.result.forEach((item, i) => {
            var pointssy = new BMap.Point(item.gpsLongitude, item.gpsLatitude);
            if (BMapLib.GeoUtils.isPointInCircle(pointssy, e.overlay)) {
              nums++;

              if (item.sortType == 2) {
                che_nums++;
              } else {
                ren_nums++;
              }
            }
          });

          r = Math.sqrt(e.calculate / Math.PI);

          console.log(r, "半径");

          that.createMark_loading(
            e.overlay.point,
            0,
            nums,
            cun,
            r,
            che_nums,
            ren_nums
          );
        });
        drawingManager.addEventListener(
          "circlecomplete",
          async function (e, overlay) {
            var miaonum = 0;

            var miaocun = [];

            overlay.addEventListener("click", function () {
              $(".quanbox").css({
                "z-index": 133,
              });

              $(".loadingbox").css({
                "z-index": 2,
              });
            });

            console.log(overlay, "123");

            drawingManager.close();

            that.clearyujing("quanbox");

            // cun = []

            // nums= 0

            // var loadingpoint = overlay

            // var loadingid = v4()

            // that.createMark_loading(overlay.point,0,loadingid)

            // setTimeout(()=>{
            //     var loading_lo;

            //     loading_lo=startLoding('#'+loadingid)
            // },200)

            that.markerList.forEach((d1, i) => {
              if (d1) {
                console.log($(d1._div).attr("class"));
                if ($(d1._div).attr("class") == "loadingbox") {
                  that.mapdui.removeOverlay(d1);

                  that.$set(that.markerList, i, null);
                }
              }
            });

            dty.result.forEach((item, i) => {
              var pointssy = new BMap.Point(
                item.gpsLongitude,
                item.gpsLatitude
              );
              if (BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                miaonum++;

                miaocun.push(item);
              }
            });

            console.log(miaonum, "miaonum+++++++++++-------------");

            if (that.mapdui.getZoom() >= 14) {
              if (miaonum > 200) {
                var suiji = that.getRandomArrayElements(miaocun, 200);
                suiji.forEach((item, i) => {
                  var pointssy = new BMap.Point(
                    item.gpsLongitude,
                    item.gpsLatitude
                  );
                  if (BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                    var point = {
                      lng: item.gpsLongitude,
                      lat: item.gpsLatitude,
                    };

                    // cun = [...cun,item]

                    // nums++
                    // 给地图添加点
                    that.createMark_quan(point, i, item);
                  }
                });
              } else {
                miaocun.forEach((item, i) => {
                  var pointssy = new BMap.Point(
                    item.gpsLongitude,
                    item.gpsLatitude
                  );
                  if (BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                    var point = {
                      lng: item.gpsLongitude,
                      lat: item.gpsLatitude,
                    };

                    // cun = [...cun,item]

                    // nums++
                    // 给地图添加点
                    that.createMark_quan(point, i, item);
                  }
                });
              }
            }

            // that.createMark_loading(overlay.point,0,nums,cun)
          }
        );

        dty = await quandata();
      }
      this.getAllFenceArea();
      this.getRegionalDivision();
    },
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },
    createMark_car3(point, index, data, zt = false) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.id;
      var info_box_html;
      var spyls;

      info_box_html = `<div class='infobox'>
                        <div class='yincang_infobox-left'></div>
                        <div class='yincang_infobox-bot'></div>
                        <div class='wintabs'>
                            <span class='tabitem one active'><label>基本信息</label></span>
                        
                        </div>
                        <div class='tabone'>
                            <div class='tit-s'>
                                <img  src="${require("@/assets/image/jingli/biaoji.png")}" />
                                
                                <span>${data.departName}</span>

                            
                            </div>

                            <div class='tit-con'>
                                <p>公务员人数：${
                                  data.civilServantCount
                                    ? data.civilServantCount
                                    : "无数据"
                                }</p>
                                <p>实习民警人数：${
                                  data.practicePoliceCount
                                    ? data.practicePoliceCount
                                    : "无数据"
                                }</p>
                                <p>事业人员人数：${
                                  data.institutionCount
                                    ? data.institutionCount
                                    : "无数据"
                                }</p>
                                <p>男性人数：${
                                  data.manCount ? data.manCount : "无数据"
                                } &nbsp; 女性人数：${
        data.womanCount ? data.womanCount : "无数据"
      } </p>
                            </div>

                            <p class='tit-s'>
                            

                            </p>

                            <div class='cj_boix'>
                            
                            </div>
                        </div>


                
                        
                        <div class='closes'>关闭</div>
                    </div>`;

      spyls = "";

      innerHTML = `
                    
                        <img class='carimg zai' src='${require("@/assets/image/jingli/biaoji.png")}'  />
                    
                        <label class='labes zai'>${data.flagName}</label>

                    `;

      classname = "zaixian";
      carindex = 2;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "zidingyibox3";
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("carId", carid);
        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".zidingyibox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (zt == "block") {
          $(".guiji").appendTo($(el).find(".infobox"));

          $(el).find(".infobox").show();
        }

        //阻止冒泡
        $(el).on("click", ".infobox", function (e) {
          e.stopPropagation();
        });

        $("body").on("click", ".BMap_mask", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".yincang_infobox-left", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".closes", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".tabitem label", function (e) {
          e.stopPropagation();
          $(el).find(".tabitem").removeClass("active");
          $(this).parent().addClass("active");

          if ($(this).parent().hasClass("one")) {
            $(el).find(".tabone").show();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("two")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").show();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("three")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").show();

            $(el).find(".closes").hide();
          }
        });

        $(el).on("click", ".yincang_infobox-bot", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".newsply", function (e) {
          e.stopPropagation();

          sessionStorage.setItem("obchushi", 1);

          that.$router.push({
            path: "/diaodu",
            query: {
              name: data.carNumber,
            },
          });
        });

        // 监听点击
        $(el).on("click", function (e) {
          e.stopPropagation();

          // that.show_car_info2(data);
        });

        $(el).hover(
          function () {
            $(this).find(".cartip").show();
          },
          function () {
            $(this).find(".cartip").hide();
          }
        );

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 42);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      return;
    },
    createMark_car2(point, index, data, zt = false) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.id;
      var info_box_html;
      var spyls;

      info_box_html = `<div class='infobox'>
                <div class='yincang_infobox-left'></div>
                <div class='yincang_infobox-bot'></div>
                <div class='wintabs'>
                    <span class='tabitem one active'><label>基本信息</label></span>
                  
                </div>
                <div class='tabone'>
                    <div class='tit-s'>
                        <img  src="${require("@/assets/image/jingli/jiguan.png")}" />
                        
                        <span>${data.departName}</span>

                       
                    </div>

                    <div class='tit-con'>
                        <p>公务员人数：${
                          data.civilServantCount
                            ? data.civilServantCount
                            : "无数据"
                        }</p>
                        <p>实习民警人数：${
                          data.practicePoliceCount
                            ? data.practicePoliceCount
                            : "无数据"
                        }</p>
                        <p>事业人员人数：${
                          data.institutionCount
                            ? data.institutionCount
                            : "无数据"
                        }</p>
                        <p>男性人数：${
                          data.manCount ? data.manCount : "无数据"
                        } &nbsp; 女性人数：${
        data.womanCount ? data.womanCount : "无数据"
      } </p>
                    </div>

                    <p class='tit-s'>
                       

                    </p>

                    <div class='cj_boix'>
                      
                    </div>
                </div>


          
                
                <div class='closes'>关闭</div>
            </div>`;

      spyls = "";

      innerHTML =
        `
            
                <img class='carimg zai' src='${require("@/assets/image/jingli/jiguan.png")}'  />
            
                <label class='labes zai'>${data.departName}</label>

            ` + info_box_html;

      classname = "zaixian";
      carindex = 2;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "zidingyibox2";
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("carId", carid);
        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".zidingyibox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (zt == "block") {
          $(".guiji").appendTo($(el).find(".infobox"));

          $(el).find(".infobox").show();
        }

        //阻止冒泡
        $(el).on("click", ".infobox", function (e) {
          e.stopPropagation();
        });

        $("body").on("click", ".BMap_mask", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".yincang_infobox-left", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".closes", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".tabitem label", function (e) {
          e.stopPropagation();
          $(el).find(".tabitem").removeClass("active");
          $(this).parent().addClass("active");

          if ($(this).parent().hasClass("one")) {
            $(el).find(".tabone").show();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("two")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").show();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("three")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").show();

            $(el).find(".closes").hide();
          }
        });

        $(el).on("click", ".yincang_infobox-bot", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".newsply", function (e) {
          e.stopPropagation();

          sessionStorage.setItem("obchushi", 1);

          that.$router.push({
            path: "/diaodu",
            query: {
              name: data.carNumber,
            },
          });
        });

        // 监听点击
        $(el).on("click", function (e) {
          e.stopPropagation();

          that.show_car_info2(data);
        });

        $(el).hover(
          function () {
            $(this).find(".cartip").show();
          },
          function () {
            $(this).find(".cartip").hide();
          }
        );

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 42);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      return;
    },
    // 给地图添加点，基本信息，警车状态，轨迹查询
    createMark_car(point, index, data, zt = false) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;
      var info_box_html;
      var spyls;
      var gbInfomation = data.gbInfomation;
      //console.log(data,"警车数据");
      // if(data.nvrStatus){
      //     spyls = `<span class='spyl' ><img  src="${require("@/assets/image/bf.png")}" /> <span>视频预览</span> </span>`
      // }else{
      //     spyls = ""
      // }

      spyls = "";

      var xiba;
      if (data.pcStatus == 1 && data.boxStatus == 1 && data.nvrStatus == 1) {
        xiba = `   <span>当前在线</span>   <div class="newsply"> <img  src="${require("@/assets/image/wht.png")}" />视频预览</div> `;
      } else {
        xiba = "   <span>离线</span>   ";
      }
      var reg = /,$/gi;

      //在线离线公共部分

      // <span class='tabitem two'><label>警车状态</label></span>

      //  <div class='tabtwo'>

      //     <div class='dengbix'>
      //        <img class='deng'  src="${require("@/assets/image/001.png")}" />

      //             <p class='hk yt'><i  class='${data.ptzStatus?"online-icon":"offineline-icon"}'></i><span>云台摄像机</span> </p>
      //             <p class='hk zq'><i  class='${data.flStatus?"online-icon":"offineline-icon"}'></i><span>左前</span> </p>
      //             <p class='hk yq'><i  class='${data.frStatus?"online-icon":"offineline-icon"}'></i><span>右前</span> </p>
      //             <p class='hk zh'><i  class='${data.lgStatus?"online-icon":"offineline-icon"}'></i><span>左后</span></p>
      //             <p class='hk yh'> <i  class='${data.rgStatus?"online-icon":"offineline-icon"}'></i><span>右后</span></p>
      //             <p class='hk zzq'><i  class='${data.fmlStatus?"online-icon":"offineline-icon"}'></i><span>左中前</span> </p>
      //             <p class='hk yzq'><i  class='${data.fmrStatus?"online-icon":"offineline-icon"}'></i><span>右中前</span> </p>
      //             <p class='hk zzh'><i  class='${data.lmgStatus?"online-icon":"offineline-icon"}'></i><span>左中后</span> </p>
      //             <p class='hk yzh'><i  class='${data.rmgStatus?"online-icon":"offineline-icon"}'></i><span>右中后</span> </p>

      //             <p class='hk kz'><i  class='${data.pcStatus?"online-icon":"offineline-icon"}'></i><span>控制终端</span> </p>
      //             <p class='hk cc'><i  class='${data.nvrStatus?"online-icon":"offineline-icon"}'></i><span>视频存储</span> </p>
      //             <p class='hk ys'><i  class='${data.boxStatus?"online-icon":"offineline-icon"}'></i><span>分析引擎</span> </p>
      //     </div>

      // </div>

      // <p class='hk yt'><i  class='${data.ptzStatus?"online-icon":"offineline-icon"}'></i><span>云台摄像机</span> </p>
      // <p class='hk zq'><i  class='${data.flStatus?"online-icon":"offineline-icon"}'></i><span>左前</span> </p>
      // <p class='hk yq'><i  class='${data.frStatus?"online-icon":"offineline-icon"}'></i><span>右前</span> </p>
      // <p class='hk zh'><i  class='${data.lgStatus?"online-icon":"offineline-icon"}'></i><span>左后</span></p>
      // <p class='hk yh'> <i  class='${data.rgStatus?"online-icon":"offineline-icon"}'></i><span>右后</span></p>
      // <p class='hk zzq'><i  class='${data.fmlStatus?"online-icon":"offineline-icon"}'></i><span>左中前</span> </p>
      // <p class='hk yzq'><i  class='${data.fmrStatus?"online-icon":"offineline-icon"}'></i><span>右中前</span> </p>
      // <p class='hk zzh'><i  class='${data.lmgStatus?"online-icon":"offineline-icon"}'></i><span>左中后</span> </p>
      // <p class='hk yzh'><i  class='${data.rmgStatus?"online-icon":"offineline-icon"}'></i><span>右中后</span> </p>
      if (data.nvrStatus) {
        info_box_html =
          `<div class='infobox'>
                <div class='yincang_infobox-left'></div>
                <div class='yincang_infobox-bot'></div>
                <div class='wintabs'>
                    <span class='tabitem one active'><label>基本信息</label></span>
                    <span class='tabitem two'><label>警车状态</label></span>
                    <span class='tabitem three'><label>轨迹查询</label></span>
                    <span class='tabitem four'><label>在线视频</label></span>
                </div>
                <div class='tabone'>
                    <div class='tit-s'>
                        <img  src="${require("@/assets/image/Menu/LOGO.png")}" />
                        
                        <span>${data.carNumber}</span>

                        ` +
          xiba +
          `        
                    </div>

                    <div class='tit-con'>
                        <p>警车所属单位：${
                          data.sysOrgCode ? data.sysOrgCode : "无数据"
                        }</p>
                        <p>上次离线时间：${
                          data.updateTime ? data.updateTime : "无数据"
                        }</p>
                        <p>警车最新坐标：${data.longitude}，${data.latitude}</p>
                        <p>单位负责人：${
                          data.szName ? data.szName : "无数据"
                        } &nbsp; 联系方式：${
            data.szPhone ? data.szPhone : "无数据"
          } </p>
                    </div>
                    <p class='tit-s'>
                        <img  src="${require("@/assets/image/user.png")}" />
                        <span>出警人（${
                          data.list && data.list.length ? data.list.length : 0
                        }人）</span>
                    </p>
                    <div class='cj_boix'>
                        ${
                          data.list && data.list.length
                            ? data.list
                                .map((value) => {
                                  return `<p>${value.name} 
                                        <span>联系方式：${value.phone}</span>
                                        <span>对讲机：${
                                          value.policeNum
                                            ? value.policeNum
                                            : "无数据"
                                        }</span>
                                    </p>`;
                                })
                                .join("")
                            : "无数据"
                        }
               
                    </div>
                </div>


                <div class='tabtwo'>
                    
                    <div class='dengbix'>
                    <img class='deng'  src="${require("@/assets/image/001.png")}" />

            


                            <p class='hk kz'><i  class='${
                              data.pcStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>控制终端</span> </p>
                            <p class='hk cc'><i  class='${
                              data.nvrStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>视频存储</span> </p>
                            <p class='hk ys'><i  class='${
                              data.boxStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>分析引擎</span> </p>
                    </div>
                    
                </div>
          
                
                <div class='closes'>关闭</div>
            </div>`;
      } else {
        info_box_html =
          `<div class='infobox'>
                <div class='yincang_infobox-left'></div>
                <div class='yincang_infobox-bot'></div>
                <div class='wintabs'>
                    <span class='tabitem one active'><label>基本信息</label></span>
                    <span class='tabitem two'><label>警车状态</label></span>
                    <span class='tabitem three'><label>轨迹查询</label></span>
                </div>
                <div class='tabone'>
                    <div class='tit-s'>
                        <img  src="${require("@/assets/image/Menu/LOGO.png")}" />
                        
                        <span>${data.carNumber}</span>

                        ` +
          xiba +
          `        
                    </div>

                    <div class='tit-con'>
                        <p>警车所属单位：${
                          data.sysOrgCode ? data.sysOrgCode : "无数据"
                        }</p>
                        <p>上次离线时间：${
                          data.updateTime ? data.updateTime : "无数据"
                        }</p>
                        <p>警车最新坐标：${data.longitude}，${data.latitude}</p>
                        <p>单位负责人：${
                          data.szName ? data.szName : "无数据"
                        } &nbsp; 联系方式：${
            data.szPhone ? data.szPhone : "无数据"
          } </p>
                    </div>
                    <p class='tit-s'>
                        <img  src="${require("@/assets/image/user.png")}" />
                        <span>出警人（${
                          data.list && data.list.length ? data.list.length : 0
                        }人）</span>
                    </p>
                    <div class='cj_boix'>
                        ${
                          data.list && data.list.length
                            ? data.list
                                .map((value) => {
                                  return `<p>${value.name} 
                                        <span>联系方式：${value.phone}</span>
                                        <span>对讲机：${
                                          value.policeNum
                                            ? value.policeNum
                                            : "无数据"
                                        }</span>
                                    </p>`;
                                })
                                .join("")
                            : "无数据"
                        }
               
                    </div>
                </div>


                <div class='tabtwo'>
                    
                    <div class='dengbix'>
                    <img class='deng'  src="${require("@/assets/image/001.png")}" />

            


                            <p class='hk kz'><i  class='${
                              data.pcStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>控制终端</span> </p>
                            <p class='hk cc'><i  class='${
                              data.nvrStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>视频存储</span> </p>
                            <p class='hk ys'><i  class='${
                              data.boxStatus ? "online-icon" : "offineline-icon"
                            }'></i><span>分析引擎</span> </p>
                    </div>
                    
                </div>
          
                
                <div class='closes'>关闭</div>
            </div>`;
      }

      if (data.pcStatus == 1 && data.boxStatus == 1 && data.nvrStatus == 1) {
        innerHTML =
          `
                
                    <img class='carimg zai' src='${require("@/assets/image/autoMap/car_nor.gif")}'  />
                
                    <label class='labes zai'>${data.carNumber}</label>

                ` + info_box_html;

        classname = "zaixian";
        carindex = 2;
      } else {
        innerHTML =
          `
                
                    <img class='carimg li' src='${require("@/assets/image/autoMap/car_noline.png")}'  />
                
                    
                    <label class='labes li'>${data.carNumber}</label>
                ` + info_box_html;

        carindex = 1;
      }

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "zidingyibox";
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("carId", carid);
        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".zidingyibox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (zt == "block") {
          $(".guiji").appendTo($(el).find(".infobox"));

          $(el).find(".infobox").show();
        }

        //阻止冒泡
        $(el).on("click", ".infobox", function (e) {
          e.stopPropagation();
        });

        $("body").on("click", ".BMap_mask", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".yincang_infobox-left", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".closes", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".tabitem label", function (e) {
          e.stopPropagation();
          $(el).find(".tabitem").removeClass("active");
          $(this).parent().addClass("active");

          if ($(this).parent().hasClass("one")) {
            $(el).find(".tabone").show();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("two")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").show();

            $(el).find(".guiji").hide();

            $(el).find(".closes").show();
          } else if ($(this).parent().hasClass("three")) {
            $(el).find(".tabone").hide();
            $(el).find(".tabtwo").hide();

            $(el).find(".guiji").show();

            $(el).find(".closes").hide();
          } else if ($(this).parent().hasClass("four")) {
            //让整体隐藏，视频框弹出
            $(el).find(".infobox").hide();
            console.log(this, that);
            //console.log(data, "视频测试播放");
            try {
              //var p1=
              var form = {
                channelNo: 1,
                deviceCode: gbInfomation,
                mediaType: "ws_flv",
              };
              that.stopInfo=form
              getKedaVideo(form)
                .then((res) => {
                  console.log(res);
                  const src = res.result;
                  that.dialogVisible = true;
                  //console.log(that,that.$refs.video,"dsds");
                  that.$nextTick(() => {
                    // console.log(that,that.$refs.video,"dsds");
                    that.$refs.video.load(src);
                  });
                })
                .catch((err) => {
                  console.log(err);
                  that.$message({
                    showClose: true,
                    message: "视频播放失败",
                    type: "error",
                  });
                  //console.log(that.$refs.video)
                });

              // "http://172.16.0.104:28080/rtp/41130100491120000002_41130100491320000001.live.flv";
              //that.dialogVisible = true;
              //that.$nextTick(() => {
              //  console.log(that.$refs.video);
              //  that.$refs.video.load(that.src);
              //});
            } catch (error) {
              that.$message({
                showClose: true,
                message: "视频播放失败",
                type: "error",
              });
            }
          }
        });

        $(el).on("click", ".yincang_infobox-bot", function (e) {
          e.stopPropagation();
          $(el).find(".infobox").hide();
        });

        $(el).on("click", ".newsply", function (e) {
          e.stopPropagation();

          sessionStorage.setItem("obchushi", 1);

          that.$router.push({
            path: "/diaodu",
            query: {
              name: data.carNumber,
            },
          });
        });

        // 监听点击
        $(el).on("click", function (e) {
          e.stopPropagation();

          that.show_car_info(data);
        });

        $(el).hover(
          function () {
            $(this).find(".cartip").show();
          },
          function () {
            $(this).find(".cartip").hide();
          }
        );

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 42);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      return;
    },
    //车牌预警
    createMark_yujing(point, index, data, isd) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      //  width: 472px;/*no*/
      //  height: 381px;/*no*/
      var position2 = { x: "", y: "" };

      var position = that.mapdui.pointToOverlayPixel(point);
      // debugger
      position2.x = position.x + 472 / 2;
      position2.y = position.y - 381 / 2;

      var cen = that.mapdui.overlayPixelToPoint(position2);

      // var pointss = new BMap.Point(data.longitude,data.latitude);

      that.mapdui.setCenter(cen);

      var infos = `
                <div class='yujing_info'>
                    <p class='tis'>车牌预警</p>

                    <div class='yujing_info_box'>
                        <div class='yujing_info_box-le'>
                            <img src='${that.productionImage(
                              data.smallImgUrl
                            )}' />
                            <p >${
                              data.plateCode ? data.plateCode : "无数据"
                            }</p>
                       </div>

                       <div class='yujing_info_box-ri'>
                            <p>布控车辆：${
                              data.plateCode ? data.plateCode : "无数据"
                            }</p>
                            <p>车辆品牌：${
                              data.plateBrand ? data.plateBrand : "无数据"
                            }</p>
                            <p title='${
                              data.represent
                                ? that.delHtmlTag(data.represent)
                                : "无数据"
                            }'>布控描述：${
        data.represent ? that.delHtmlTag(data.represent) : "无数据"
      }</p>
                            <p>预警坐标：${data.longitude}，${data.latitude}</p>
                            <p>预警时间：${
                              data.createTime ? data.createTime : "无数据"
                            }</p>
                            <p>预警单位：${
                              data.departName ? data.departName : "无数据"
                            }</p>
                            <p>预警警车：${
                              data.fromCar ? data.fromCar : "无数据"
                            }</p>
                       </div>
                    </div>

                    <div class='yujing_info_bot'>
                        <div class='jj' id='a${data.id}'>${
        data.isResponse == 1 ? "已反馈" : data.isRead == 1 ? "反馈" : "接警"
      }</div>

                        <div class='sy'>预警溯源</div>

                     

                        <div class='qx'>取消</div>
                    </div>
                </div>
            `;
      //    <div class='hf'>预警回放</div>

      innerHTML =
        `
                
                <img class='cpimg' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                
                <label>${data.plateCode ? data.plateCode : "无数据"}</label>

            ` + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "yujingbox";
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("yujingid-cp", data.id);

        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".yujingbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.yujing_info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".yujing_info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.yujing_info').toggle()

          that.show_yujing_cp_info(data);
        });

        //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".yujing_info").hide();

          PubSub.publish("qx_tan");

          that.markerList.forEach((d1, i) => {
            if (d1) {
              if (
                $(d1._div).attr("yujingid-cp") == $(el).attr("yujingid-cp") &&
                $(el).find(".jj").html() == "已反馈"
              ) {
                that.mapdui.removeOverlay(d1);

                that.$set(that.markerList, i, null);
              }
            }
          });
        });

        //sy
        $(el).on("click", ".sy", function () {
          that.suyuan(data);
        });

        //预警回放
        $(el).on("click", ".hf", function () {
          that.huifang(data);
        });

        //接警
        $(el).on("click", ".jj", function () {
          that.dealInfoOpera_cp(data, $(this), "a" + data.id);
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 66);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      if (isd) {
        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-cp") == data.id) {
              $(d1._div).find(".yujing_info").show();

              $(d1._div).css({
                "z-index": 2,
              });
            } else {
              $(d1._div).find(".yujing_info").hide();

              //把人像预警的和警车列表的也隐藏
              $(d1._div).find(".infobox").hide();
              $(d1._div).find(".yujing_info-rx").hide();

              $(d1._div).css({
                "z-index": 1,
              });
            }
          }
        });
      }
    },
    //人像预警
    createMark_yujing_rx(point, index, data, isd) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      //  width: 472px;/*no*/
      //  height: 530px;/*no*/
      var position2 = { x: "", y: "" };

      var position = that.mapdui.pointToOverlayPixel(point);
      // debugger
      position2.x = position.x + 472 / 2;
      position2.y = position.y - 530 / 2;

      var cen = that.mapdui.overlayPixelToPoint(position2);

      // var pointss = new BMap.Point(data.longitude,data.latitude);

      that.mapdui.setCenter(cen);

      var infos = `
                <div class='yujing_info-rx' >
                    <p class='tis'>人像预警</p>

                    <div class='yujing_info_box'>
                        <div class='yujing_info_box-le'>
                            <img src='${that.productionImage(
                              data.faceImage
                            )}' />
                            <p >布控</p>
                       </div>

                        <div class='yujing_info_box-mid'>
                            <p class='baifen'>${
                              data.points ? (data.points * 100).toFixed(1) : 0
                            }%</p>
                            <p class='zi'>相似率</p>
                       </div>

                       <div class='yujing_info_box-ri'>
                            <img src='${that.productionImage(
                              data.smallImgUrl
                            )}' />
                            <p >预警</p>
                       </div>
                    </div>

                    <div class='yujing_info_pp'>
                        <p>姓名：${data.name ? data.name : "无数据"}</p>
                        <p>年龄：${data.age ? data.age : "无数据"}</p>
                        <p>部门：${
                          data.departName ? data.departName : "无数据"
                        }</p>
                        <p>电话：${
                          data.phoneNumber ? data.phoneNumber : "无数据"
                        }</p>
                        <p>布控类型：${
                          data.blackType_dictText
                            ? data.blackType_dictText
                            : "无数据"
                        }</p>
                        <p>过期时间：${
                          data.effectiveTime ? data.effectiveTime : "无数据"
                        }</p>
                        <p>采集设备：${
                          data.fromCam_dictText
                            ? data.fromCam_dictText
                            : "无数据"
                        }</p>
                        <p>采集时间：${
                          data.subImageTime ? data.subImageTime : "无数据"
                        }</p>

                        <p>身份证号：${
                          data.certificatesNumber
                            ? data.certificatesNumber
                            : "无数据"
                        }</p>
                        <p title='${
                          data.represent
                            ? that.delHtmlTag(data.represent)
                            : "无数据"
                        }'>布控描述：${
        data.represent ? that.delHtmlTag(data.represent) : "无数据"
      }</p>
                        <p>预警坐标：${data.longitude}，${data.latitude}</p>
                        <p>预警时间：${
                          data.createTime ? data.createTime : "无数据"
                        }</p>
                        <p>预警单位：${
                          data.departName ? data.departName : "无数据"
                        }</p>
                        <p>预警警车：${
                          data.fromCar ? data.fromCar : "无数据"
                        }</p>


                    </div>


                    <div class='yujing_info_bot'>
                        <div class='jj' id='a${data.id}' >${
        data.isResponse == 1 ? "已反馈" : data.isRead == 1 ? "反馈" : "接警"
      }</div>

                    

                       

                        <div class='qx'>取消</div>
                    </div>
                </div>
            `;

      //  <div class='hf'>预警回放</div>

      innerHTML =
        `
                
                <img class='crximg' src='${that.productionImage(
                  data.smallImgUrl
                )}'  />
                


            ` + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "yujingbox_rx";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("yujingid-rx", data.id);

        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".yujingbox_rx").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.yujing_info-rx').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".yujing_info-rx", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.yujing_info-rx').toggle()
          that.show_yujing_rx_info(data);
        });

        //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".yujing_info-rx").hide();

          PubSub.publish("qx_tan");

          that.markerList.forEach((d1, i) => {
            if (d1) {
              console.log($(el).attr("yujingid-rx"));
              if (
                $(d1._div).attr("yujingid-rx") == $(el).attr("yujingid-rx") &&
                $(el).find(".jj").html() == "已反馈"
              ) {
                that.mapdui.removeOverlay(d1);

                that.$set(that.markerList, i, null);
              }
            }
          });
        });

        //预警回放
        $(el).on("click", ".hf", function () {
          that.huifang(data);
        });

        //接警
        $(el).on("click", ".jj", function () {
          that.dealInfoOpera(data, $(this), "a" + data.id);
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 66);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      if (isd) {
        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-rx") == data.id) {
              $(d1._div).find(".yujing_info-rx").show();

              $(d1._div).css({
                "z-index": 2,
              });
            } else {
              $(d1._div).find(".yujing_info-rx").hide();

              //把警车预警的和警车列表的也隐藏
              $(d1._div).find(".infobox").hide();
              $(d1._div).find(".yujing_info").hide();

              $(d1._div).css({
                "z-index": 1,
              });
            }
          }
        });
      }
    },
    //串号预警
    createMark_yujing_ch(point, index, data, isd) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      //  width: 472px;/*no*/
      //  height: 381px;/*no*/
      var position2 = { x: "", y: "" };

      var position = that.mapdui.pointToOverlayPixel(point);
      // debugger
      position2.x = position.x + 472 / 2;
      position2.y = position.y - 381 / 2;

      var cen = that.mapdui.overlayPixelToPoint(position2);

      // var pointss = new BMap.Point(data.longitude,data.latitude);

      that.mapdui.setCenter(cen);

      var infos = `
                <div class='yujing_info'>
                    <p class='tis'>串号预警</p>

                    <div class='yujing_info_box'>
                       <div class='yujing_info_box-ri'>
                            <p>布控车辆：${
                              data.plateCode ? data.plateCode : "无数据"
                            }</p>
                            <p>车辆品牌：${
                              data.plateBrand ? data.plateBrand : "无数据"
                            }</p>
                            <p title='${
                              data.represent
                                ? that.delHtmlTag(data.represent)
                                : "无数据"
                            }'>布控描述：${
        data.represent ? that.delHtmlTag(data.represent) : "无数据"
      }</p>
                            <p>预警坐标：${data.longitude}，${data.latitude}</p>
                            <p>预警时间：${
                              data.createTime ? data.createTime : "无数据"
                            }</p>
                            <p>预警单位：${
                              data.departName ? data.departName : "无数据"
                            }</p>
                            <p>预警警车：${
                              data.fromCar ? data.fromCar : "无数据"
                            }</p>
                       </div>
                    </div>

                    <div class='yujing_info_bot'>
                        <div class='jj' id='a${data.id}'>${
        data.isResponse == 1 ? "已反馈" : data.isRead == 1 ? "反馈" : "接警"
      }</div>

                        <div class='sy sj'>预警溯源</div>

                     

                        <div class='qx'>取消</div>
                    </div>
                </div>
            `;
      //    <div class='hf'>预警回放</div>

      innerHTML =
        `
                
                <img class='cpimg' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                
                <label>${data.plateCode ? data.plateCode : "无数据"}</label>

            ` + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "yujingbox";
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("yujingid-cp", data.id);

        el.setAttribute("yuandata", JSON.stringify(data));

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".yujingbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.yujing_info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".yujing_info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.yujing_info').toggle()

          that.show_yujing_cp_info(data);
        });

        //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".yujing_info").hide();

          PubSub.publish("qx_tan");

          that.markerList.forEach((d1, i) => {
            if (d1) {
              if (
                $(d1._div).attr("yujingid-cp") == $(el).attr("yujingid-cp") &&
                $(el).find(".jj").html() == "已反馈"
              ) {
                that.mapdui.removeOverlay(d1);

                that.$set(that.markerList, i, null);
              }
            }
          });
        });

        //sy
        $(el).on("click", ".sy", function () {
          that.suyuan(data);
        });
        //sj
        //$(el).on("click", ".sj", function () {
        //  this.$router.push({
        //    path: "/Retrospective",
        //    query: {
        //      fromCar: data.fromCar,
        //      timeStart: "",
        //      timeEnd: "",
        //    },
        //  });
        //});
        //预警回放
        $(el).on("click", ".hf", function () {
          that.huifang(data);
        });

        //接警
        $(el).on("click", ".jj", function () {
          that.dealInfoOpera_cp(data, $(this), "a" + data.id);
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 66);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);

      if (isd) {
        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-cp") == data.id) {
              $(d1._div).find(".yujing_info").show();

              $(d1._div).css({
                "z-index": 2,
              });
            } else {
              $(d1._div).find(".yujing_info").hide();

              //把人像预警的和警车列表的也隐藏
              $(d1._div).find(".infobox").hide();
              $(d1._div).find(".yujing_info-rx").hide();

              $(d1._div).css({
                "z-index": 1,
              });
            }
          }
        });
      }
    },
    createMark_js(point, index, data) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var jsid = data.id;

      if (index == 0) {
        var pointss = new BMap.Point(data.gpsLongitude, data.gpsLatitude);

        that.mapdui.setCenter(pointss);
      }

      var infos = `
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>采集信息</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(
                          data.imgPath
                        )}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `;

      innerHTML =
        `
                
                <img class='gjimg' src='${data.imgPath}'  />
                


            ` + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "jsbox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        // el.setAttribute('createTime',data.createTime)

        el.setAttribute("jsid", jsid);

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".jsbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (index == 0) {
          $(el).find(".guiji-info").show();
          $(el).css({
            "z-index": 2,
          });
        }

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.guiji-info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".guiji-info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.guiji-info').toggle()

          that.show_js_info(data);
        });

        // 点击大图
        // $(el).on('click', '.guijicarimg',function(){

        //     that.lookDetailPlate(data)

        // })

        // //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".guiji-info").hide();
          that.$router.back();
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 40);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    createMark_cpguiji(point, index, data) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      if (index == 0) {
        var pointss = new BMap.Point(data.gpsLongitude, data.gpsLatitude);

        that.mapdui.setCenter(pointss);
      }

      var infos = `
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>${data.plateNumber}</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(
                          data.smallImageUrl
                        )}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `;

      innerHTML =
        `
                
                    <img class='cpimg quancp' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                    
                    <label class='quancp_label'>${
                      data.plateNumber ? data.plateNumber : "无数据"
                    }</label>
                ` + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "guijibox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("createTime", data.createTime);

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".guijibox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (index == 0) {
          $(el).find(".guiji-info").show();
          $(el).css({
            "z-index": 2,
          });
        }

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.guiji-info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".guiji-info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.guiji-info').toggle()

          that.show_guiji_info(data);
        });

        // 点击大图
        $(el).on("click", ".guijicarimg", function () {
          that.lookDetailPlate(data);
        });

        // //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".guiji-info").hide();
          that.$router.back();
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 66);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    //总采集数
    createMark_loading(point, index, num, arr, R, che_nums, ren_nums) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;

      innerHTML = `
                
                <div class='gongji'>
                    <div class='ml zs'> <span>采集总数</span><span class='shuzi'>:${num}</span></div>
                    <div class='ml car'> <img src='${require("@/assets/image/quan_car.png")}' /><span class='shuzi'>:${che_nums}</span> </div>
                    <div class='ml ren'> <img src='${require("@/assets/image/quan_ren.png")}' /><span class='shuzi'>:${ren_nums}</span> </div>
                </div>
                
                

            `;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "loadingbox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        var id = "a" + v4();
        el.setAttribute("id", id);

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        var loadingbox_hei = $(".gongji").height();

        $(".loadingbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
          "margin-top": -loadingbox_hei + "px",
        });

        // 监听点击
        $(el).on("click", function () {
          $(".quanbox").css({
            "z-index": 112,
          });

          $(".loadingbox").css({
            "z-index": 1,
          });
        });

        // $(el).on('click', '.gongji',function(){

        //     if(arr.length!=0){

        //         var loading_lo;

        //         loading_lo=startLoding('#'+id)
        //         $(this).remove()
        //         setTimeout(()=>{
        //             arr.forEach((item5,i5)=>{
        //                 var point = {
        //                     "lng": item5.gpsLongitude,
        //                     "lat": item5.gpsLatitude
        //                 }

        //                 that.createMark_quan(point,i5,item5);
        //             })
        //             endLoding(loading_lo)
        //         },1500)

        //     }

        // })

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(point, 36);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    createMark_caiji_mark(index, data) {
      console.log("222222222", data);
      if (!data.gpsLongitude || !data.gpsLatitude) {
        console.log("333333", data);
        return;
      }
      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var pointss = new BMap.Point(data.gpsLongitude, data.gpsLatitude);
      that.mapdui.setCenter(pointss);
      var infos = `
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>采集信息</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(
                          data.smallImageUrl
                        )}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `;
      innerHTML =
        `
                <img class='gjimg' src='${
                  data.sortType == 2
                    ? require("@/assets/image/car-collect.svg")
                    : require("@/assets/image/warning-car.svg")
                }'  />
            ` + infos;
      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "quanbox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("createTime", data.createTime);
        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".quanbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        $(el).find(".guiji-info").show();
        $(el).css({
          "z-index": 2,
        });

        // //阻止冒泡
        $(el).on("click", ".guiji-info", function (e) {
          e.stopPropagation();
        });
        // 监听点击
        $(el).on("click", function () {
          that.show_guiji_info(data);
        });

        // 点击大图
        $(el).on("click", ".guijicarimg", function () {
          that.lookDetailPlate(data);
        });

        // //添加取消事件
        $(el).on("click", ".qx", function () {
          $(el).find(".guiji-info").hide();
          that.$router.back();
        });
        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var mark = new customizeOverlay(pointss, 36);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    createMark_quan2(point, index, data, isquxiao) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      if (index == 0) {
        var pointss = new BMap.Point(data.gpsLongitude, data.gpsLatitude);

        that.mapdui.setCenter(pointss);
      }

      var infos = `
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>采集信息</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(
                          data.smallImageUrl
                        )}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `;

      var ifs;

      if (data.type == 2) {
        ifs = `
                
                    <img class='cpimg quancp' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                    
                    <label class='quancp_label'>${
                      data.policeCarNumber ? data.policeCarNumber : "无数据"
                    }</label>
                `;
      } else {
        ifs = `

                <img class='crximg quan2' src='${that.productionImage(
                  data.smallImageUrl
                )}'  />

                `;
      }

      innerHTML = ifs + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "quanbox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("createTime", data.createTime);

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".quanbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (index == 0) {
          $(el).find(".guiji-info").show();
          $(el).css({
            "z-index": 2,
          });
        }

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.guiji-info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".guiji-info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.guiji-info').toggle()

          that.show_guiji_info(data);
        });

        // 点击大图
        $(el).on("click", ".guijicarimg", function () {
          that.lookDetailPlate(data);
        });

        // //添加取消事件
        $(el).on("click", ".qx", function () {
          if (isquxiao) {
            that.markerList.forEach((d1, i) => {
              if (d1) {
                console.log($(d1._div).attr("class"));
                if ($(d1._div).attr("class") == "quanbox") {
                  that.mapdui.removeOverlay(d1);
                  that.$router.back();
                  that.$set(that.markerList, i, null);
                }
              }
            });
          } else {
            $(el).find(".guiji-info").hide();
            that.$router.back();
          }
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var daxiao = data.type == 1 ? 45 : 66;
      var mark = new customizeOverlay(point, daxiao);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    createMark_quan(point, index, data, isquxiao) {
      if (!point.lng || !point.lat) {
        return;
      }

      var that = this;
      // 创建盒子内部内容
      var innerHTML;
      var carindex;
      var classname;
      var carid = data.carId;

      if (index == 0) {
        var pointss = new BMap.Point(data.gpsLongitude, data.gpsLatitude);

        that.mapdui.setCenter(pointss);
      }

      var infos = `
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>采集信息</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(
                          data.smallImageUrl
                        )}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `;

      var ifs;

      if (data.sortType == 2) {
        ifs = `
                
                    <img class='cpimg quancp' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                    
                    <label class='quancp_label'>${
                      data.policeCarNumber ? data.policeCarNumber : "无数据"
                    }</label>
                `;
      } else {
        ifs = `

                <img class='crximg quan2' src='${that.productionImage(
                  data.smallImageUrl
                )}'  />

                `;
      }

      innerHTML = ifs + infos;

      // 定义绘制图标方法
      function customizeOverlay(center, length) {
        this._center = center;
        this._length = length;
      }
      customizeOverlay.prototype = new BMap.Overlay();

      customizeOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;

        // 创建div元素，作为自定义覆盖物的容器
        var el = document.createElement("div");
        el.className = "quanbox";
        // el.id = 'a'+data.id;
        el.innerHTML = innerHTML;
        el.style.position = "absolute";
        el.dataset.index = index;
        // el.style.zIndex = carindex;
        el.style.cursor = "pointer";
        el.style.width = this._length + "px";
        el.style.height = this._length + "px";

        el.setAttribute("createTime", data.createTime);

        // 将el添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(el);

        $(".quanbox").css({
          "-webkit-transform": "scale(" + scale_num + ")",
          transform: "scale(" + scale_num + ")",
        });

        if (index == 0) {
          $(el).find(".guiji-info").show();
          $(el).css({
            "z-index": 2,
          });
        }

        //    $('body').on('click','.BMap_mask' ,function(e){
        //         e.stopPropagation()
        //         $(el).find('.guiji-info').hide()
        //     })

        // //阻止冒泡
        $(el).on("click", ".guiji-info", function (e) {
          e.stopPropagation();
        });

        // $(el).on('click','.yincang_infobox-left' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // $(el).on('click','.yincang_infobox-bot' ,function(e){
        //     e.stopPropagation()
        //     $(el).find('.infobox').hide()
        // })

        // 监听点击
        $(el).on("click", function () {
          // $(this).find('.guiji-info').toggle()

          that.show_guiji_info(data);
        });

        // 点击大图
        $(el).on("click", ".guijicarimg", function () {
          that.lookDetailPlate(data);
        });

        // //添加取消事件
        $(el).on("click", ".qx", function () {
          if (isquxiao) {
            that.markerList.forEach((d1, i) => {
              if (d1) {
                console.log($(d1._div).attr("class"));
                if ($(d1._div).attr("class") == "quanbox") {
                  that.mapdui.removeOverlay(d1);

                  that.$set(that.markerList, i, null);
                }
              }
            });
          } else {
            $(el).find(".guiji-info").hide();
            that.$router.back();
          }
        });

        // 保存div实例
        this._div = el;
        // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return el;
      };

      // 根据地理坐标转换为像素坐标，并设置给容器
      customizeOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };

      var daxiao;

      if (data.sortType == 2) {
        daxiao = 66;
      } else {
        daxiao = 46;
      }

      var mark = new customizeOverlay(point, daxiao);
      that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
      that.mapdui.addOverlay(mark);
    },
    lookDetailPlate(item) {
      PubSub.publish("detail_box_type_show", 10);
      PubSub.publish("car_trail_data", item);
    },
    async dealInfoOpera(data, EL, id) {
      if (EL.html() == "已反馈") {
        return;
      } else if (EL.html() == "接警") {
        //接警
        var loading_lo;
        try {
          loading_lo = startLoding("#" + id);

          var res = await gyxyFaceWarning_edit({ ids: data.id });
          endLoding(loading_lo);

          EL.html("反馈");

          PubSub.publish("warn-face-fan", data);
        } catch (err) {
          console.log(err, "dscdascsda");
          endLoding(loading_lo);
          Message({
            showClose: true,
            message: "网络异常",
            type: "error",
            duration: 2000,
          });
        }
      } else {
        //反馈
        // PubSub.publish("detail_box_type_show", 4);
        data.isrx = true;
        PubSub.publish("fankui_data", data);
      }
    },
    async dealInfoOpera_cp(data, EL, id) {
      console.log(data, "#########反馈############");
      if (EL.html() == "已反馈") {
        return;
      } else if (EL.html() == "接警") {
        //接警
        var loading_lo;
        try {
          loading_lo = startLoding("#" + id);
          if (data.isResponse_dictText) {
            console.log(
              data.isResponse_dictText,
              "&^&^&^&&^&^判断是否是手机串号&^&^&^&^&^"
            );
            //串号
            var res = await putSerialNumberWarning({
              createBy: data.createBy,
              createTime: data.createTime,
              dealName: data.dealName,
              fromCar: data.fromCar,
              id: data.id,
              isRead: 1,
              isResponse: data.isResponse,
              latitude: data.latitude,
              longitude: data.longitude,
              plateType: 1,
              represent: data.represent,
              response: data.response,
              serial: data.serial,
              sysOrgCode: data.sysOrgCode,
              updateBy: data.updateBy,
              updateTime: data.updateTime,
            });
            PubSub.publish("jiejing_fanhui", 1);
          } else {
            //车牌
            var res = await gyxyPlateWarning_edit({ ids: data.id });
          }

          endLoding(loading_lo);

          EL.html("反馈");

          PubSub.publish("warn-cp-fan", data);
        } catch (err) {
          console.log(err, "dscdascsda");
          endLoding(loading_lo);
          Message({
            showClose: true,
            message: "网络异常",
            type: "error",
            duration: 2000,
          });
        }
      } else {
        //反馈
        // PubSub.publish("detail_box_type_show", 4);

        data.isPhone = true;
        PubSub.publish("fankui_data", data);
      }
    },
    huifang(data) {
      PubSub.publish("warnVideoshow", data);
    },
    //清除预警消息，关闭弹窗
    clearyujing(clas) {
      var that = this;
      console.log(that.markerList);

      that.markerList.forEach((d1, i) => {
        if (d1) {
          console.log($(d1._div).attr("class"));
          if ($(d1._div).attr("class") == clas) {
            that.mapdui.removeOverlay(d1);

            this.$set(that.markerList, i, null);
          }
        }
      });
    },
    //获取网格点数
    async getAllFenceArea() {
      console.log("我执行了");
      var dty = await getFenceArea({ size: 1000 });

      var liss = dty.result.records;
      //console.log("接口获取的数据是", liss);
      //this.tableData = liss;
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
              opacity: "0.5",
              color: "#fff",
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
              opacity: "0.5",
              color: "#fff",
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
  },

  activated() {
    if (sessionStorage.getItem("caijiweizhi_date")) {
      setTimeout(() => {
        var caiji_data = JSON.parse(sessionStorage.getItem("caijiweizhi_date"));
        //采集
        console.log(caiji_data, "采集");
        var point = {
          lng: caiji_data.gpsLongitude,
          lat: caiji_data.gpsLatitude,
        };

        this.createMark_quan2(point, 0, caiji_data, true);

        this.mapdui.centerAndZoom(
          new BMap.Point(caiji_data.gpsLongitude, caiji_data.gpsLatitude),
          18
        );
        sessionStorage.removeItem("caijiweizhi_date");
      }, 500);
    }
  },

  mounted() {
    // PubSub.subscribe('caiji_rx_single',(msg,data)=>{
    //        console.log("11111111111")
    //         this.clearyujing('quanbox')
    //           // 给地图添加点
    //         this.createMark_caiji_mark(0,data);
    // })
    //
    console.log(this.$props, "父子传参");
    var that = this;
    this.baiduMapInit();
    if (this.$route.path == "/warningInfo") {
      //人像预警弹框
      PubSub.subscribe("warn_rx", (msg, data) => {
        var point = {
          lng: data.longitude,
          lat: data.latitude,
        };
        this.clearyujing("yujingbox_rx");
        this.clearyujing("yujingbox");
        // 给地图添加点
        this.createMark_yujing_rx(point, 0, data);
      });
      //车牌预警弹框
      PubSub.subscribe("warn_cp", (msg, data) => {
        var point = {
          lng: data.longitude,
          lat: data.latitude,
        };
        this.clearyujing("yujingbox_rx");
        this.clearyujing("yujingbox");
        // 给地图添加点
        this.createMark_yujing(point, 0, data);
      });
      //手机串号预警
      PubSub.subscribe("warn_ch", (msg, data) => {
        var point = {
          lng: data.longitude,
          lat: data.latitude,
        };
        this.clearyujing("yujingbox_rx");
        this.clearyujing("yujingbox");
        // 给地图添加点
        this.createMark_yujing_ch(point, 0, data);
      });
    }

    PubSub.subscribe("clear_jldt", (msg, data) => {
      console.log("啊大大");
      var mapLongitude = sessionStorage.getItem("mapLongitude");
      var mapLatitude = sessionStorage.getItem("mapLatitude");
      this.mapdui.centerAndZoom(new BMap.Point(mapLongitude, mapLatitude), 10);
      this.clearyujing("zidingyibox2");
      this.clearyujing("zidingyibox3");
    });

    PubSub.subscribe("add_jldt_dep", (msg, data) => {
      data.forEach((item, i) => {
        var point = {
          lng: item.gpsLongitude,
          lat: item.gpsLatitude,
        };

        // 给地图添加点
        this.createMark_car2(point, i, item);
      });
      console.log("aaaa");
    });

    PubSub.subscribe("add_jldt_lk", (msg, data) => {
      data.forEach((item, i) => {
        var point = {
          lng: item.flagGpsLongitude,
          lat: item.flagGpsLatitude,
        };

        // 给地图添加点
        this.createMark_car3(point, i, item);
      });
      console.log("aaaa");
    });

    if (this.$route.path == "/index") {
      console.log("index,首页");
      PubSub.subscribe("map_depart", (msg, data) => {
        PubSub.publish("jldt");

        this.mapdui.centerAndZoom(new BMap.Point(112.810046, 32.690481), 11);
      });

      PubSub.subscribe("jc_updata", (msg, data) => {
        try {
          if (this.$route.path == "/index") {
            that.markerList.forEach((d1, i) => {
              if (d1) {
                if ($(d1._div).attr("carId") == data.carId) {
                  var yuandata = JSON.parse($(d1._div).attr("yuandata"));
                  //先清除 -清除前先过去信息框的显示隐藏状态
                  var zt = $(d1._div).find(".infobox")[0].style.display;

                  $(d1._div).find(".guiji").appendTo($(".map_obj_box"));

                  that.mapdui.removeOverlay(d1);

                  // this.$delete(that.markerList,i)
                  this.$set(that.markerList, i, null);

                  var point = {
                    lng: data.longitude,
                    lat: data.latitude,
                  };

                  data.sysOrgCode = yuandata.sysOrgCode;

                  data.list = yuandata.list;

                  // 给地图添加点
                  this.createMark_car(point, i, data, zt);

                  throw new Error();
                }
              }
            });
          }
        } catch (e) {}
      });

      PubSub.subscribe("fk_success", (msg, data) => {
        var h_Type;
        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-rx") == data.id) {
              h_Type = 1;
            }

            if ($(d1._div).attr("yujingid-cp") == data.id) {
              h_Type = 2;
            }
          }
        });

        if (h_Type == 1) {
          var point;

          this.markerList.forEach((d1, i) => {
            if (d1) {
              if ($(d1._div).attr("yujingid-rx") == data.id) {
                //第二次
                // data.longitude = $(d1._div).attr('longitude')
                // data.latitude = $(d1._div).attr('latitude')
                var yuandata = JSON.parse($(d1._div).attr("yuandata"));

                data = yuandata;
                data.isResponse = 1;

                point = {
                  lng: data.longitude,
                  lat: data.latitude,
                };

                that.mapdui.removeOverlay(d1);

                $(d1._div).css({
                  "z-index": 2,
                });

                // this.$delete(that.markerList,i)
                this.$set(that.markerList, i, null);
              } else {
                //第一次
                point = {
                  lng: data.longitude,
                  lat: data.latitude,
                };

                $(d1._div).find(".infobox").hide();

                //把预警的都给隐藏
                $(d1._div).find(".yujing_info").hide();
                $(d1._div).find(".yujing_info-rx").hide();

                $(d1._div).css({
                  "z-index": 1,
                });
              }
            }
          });

          //先把信息框都隐藏掉
          $(".yujing_info").hide();
          $(".yujing_info-rx").hide();

          // 给地图添加点
          this.createMark_yujing_rx(point, 0, data);
        } else if (h_Type == 2) {
          var point;

          this.markerList.forEach((d1, i) => {
            if (d1) {
              if ($(d1._div).attr("yujingid-cp") == data.id) {
                var yuandata = JSON.parse($(d1._div).attr("yuandata"));

                data = yuandata;

                data.isResponse = 1;

                point = {
                  lng: data.longitude,
                  lat: data.latitude,
                };

                that.mapdui.removeOverlay(d1);

                $(d1._div).css({
                  "z-index": 2,
                });

                // this.$delete(that.markerList,i)
                this.$set(that.markerList, i, null);
              } else {
                //第一次
                point = {
                  lng: data.longitude,
                  lat: data.latitude,
                };

                $(d1._div).find(".infobox").hide();

                //把预警的都给隐藏
                $(d1._div).find(".yujing_info").hide();
                $(d1._div).find(".yujing_info-rx").hide();

                $(d1._div).css({
                  "z-index": 1,
                });
              }
            }
          });

          //先把信息框都隐藏掉
          $(".yujing_info").hide();
          $(".yujing_info-rx").hide();

          // 给地图添加点
          this.createMark_yujing(point, 0, data);
        }
      });

      PubSub.subscribe("warn-face", (msg, data) => {
        var point;

        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-rx") == data.id) {
              //第二次
              // data.longitude = $(d1._div).attr('longitude')
              // data.latitude = $(d1._div).attr('latitude')
              var yuandata = JSON.parse($(d1._div).attr("yuandata"));

              var videoUrl = data.videoUrl;

              var isRead = data.isRead;

              data = yuandata;

              data.videoUrl = videoUrl;

              data.isRead = isRead;

              point = {
                lng: data.longitude,
                lat: data.latitude,
              };

              that.mapdui.removeOverlay(d1);

              $(d1._div).css({
                "z-index": 2,
              });

              // this.$delete(that.markerList,i)
              this.$set(that.markerList, i, null);
            } else {
              //第一次
              point = {
                lng: data.longitude,
                lat: data.latitude,
              };

              $(d1._div).find(".infobox").hide();

              //把预警的都给隐藏
              $(d1._div).find(".yujing_info").hide();
              $(d1._div).find(".yujing_info-rx").hide();

              $(d1._div).css({
                "z-index": 1,
              });
            }
          }
        });

        //先把信息框都隐藏掉
        $(".yujing_info").hide();
        $(".yujing_info-rx").hide();

        // 给地图添加点
        this.createMark_yujing_rx(point, 0, data, true);
      });
      PubSub.subscribe("warn-cp", (msg, data) => {
        var point;

        this.markerList.forEach((d1, i) => {
          if (d1) {
            if ($(d1._div).attr("yujingid-cp") == data.id) {
              var yuandata = JSON.parse($(d1._div).attr("yuandata"));

              var videoUrl = data.videoUrl;

              var isRead = data.isRead;

              data = yuandata;

              data.videoUrl = videoUrl;

              data.isRead = isRead;

              point = {
                lng: data.longitude,
                lat: data.latitude,
              };

              that.mapdui.removeOverlay(d1);

              $(d1._div).css({
                "z-index": 2,
              });

              // this.$delete(that.markerList,i)
              this.$set(that.markerList, i, null);
            } else {
              //第一次
              point = {
                lng: data.longitude,
                lat: data.latitude,
              };

              $(d1._div).find(".infobox").hide();

              //把预警的都给隐藏
              $(d1._div).find(".yujing_info").hide();
              $(d1._div).find(".yujing_info-rx").hide();

              $(d1._div).css({
                "z-index": 1,
              });
            }
          }
        });

        //先把信息框都隐藏掉
        $(".yujing_info").hide();
        $(".yujing_info-rx").hide();

        // 给地图添加点
        this.createMark_yujing(point, 0, data, true);
      });
    }
  },
  components: {
    DatePicker,
    VuePlayer,
  },
};
</script>
<style lang="scss">
.map_obj_box .el-dialog {
  background-color: #d9f0f0;
  .el-dialog__body {
    padding: 0 0 !important;
  }
}
.cartip {
  width: 112px; /*no*/
  padding: 10px; /*no*/
  border-radius: 5px; /*no*/
  height: 319px; /*no*/
  background: #303133;
  position: absolute;
  top: 0;
  left: 150px; /*no*/
  color: #fff;
  display: none;
  .za {
    position: absolute;

    width: 30px; /*no*/
    left: -20px; /*no*/
    top: 6px; /*no*/
  }
  .arraw {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px; /*no*/
  }
  .content-item {
    display: flex;
    align-items: center;
    margin-top: 10px; /*no*/
    span {
      font-size: 13px; /*no*/
    }
  }
  .content-top {
    display: flex;
    align-items: center;
    span {
      margin-right: 5px; /*no*/
    }
  }
  .online-icon {
    width: 10px; /*no*/
    height: 10px; /*no*/
    border-radius: 10px; /*no*/
    background: #13d913;
    margin-right: 5px; /*no*/
  }
  .offineline-icon {
    width: 10px; /*no*/
    height: 10px; /*no*/
    // border-radius:10px;/*no*/
    background: red;
    margin-right: 5px; /*no*/
  }
}

.mx-icon-calendar {
  color: #00beff;
}
.mx-input {
  border: 1px solid #00beff;
}

@media screen and (min-width: 3000px) {
  .mx-icon-calendar {
    // margin-top: 4px;/*no*/
    display: none;
  }

  .mx-date-row div {
    font-size: 16px; /*no*/
  }
  .mx-time-column .mx-time-item {
    font-size: 16px; /*no*/
  }
  .mx-btn {
    font-size: 16px; /*no*/
  }
  .mx-input {
    padding-right: 0;
  }
}

.guijibox {
  .gjimg {
    width: 100%;
    height: 100%;
  }
}
.jsbox {
  .gjimg {
    width: 100%;
    height: 100%;
    border-radius: 100px; /*no*/
  }
}
.quanbox {
  .gjimg {
    width: 100%;
    height: 100%;
  }
}
.carimg {
  width: 100%; /*no*/
  height: 100%; /*no*/
  border-radius: 49px; /*no*/
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  &.zai {
    // border: 2px solid rgb(64,158,255);/*no*/
  }

  &.li {
    border: 2px solid #fff; /*no*/
    background: rgb(153, 153, 153);
  }
}

.loadingbox {
  .gongji {
    font-size: 16px; /*no*/
    // width: 200px;/*no*/
    margin-left: -129px; /*no*/
    width: 310px; /*no*/
    display: flex;
    justify-content: space-around;
    align-items: center;
    // background: #00beff;
    // background: #35758b;
    // color:#00beff;
    // background: #024e64c7;
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0.7));
    border: 1px solid #a6e7ff; /*no*/
    text-align: center;
    border-radius: 10px; /*no*/
    padding: 10px; /*no*/
    // background-image: url("../assets/image/button-1.svg");
    // background-repeat: no-repeat;
    // background-size:100% 100%;
    //         background: linear-gradient(
    // 90deg,rgba(86, 113, 124,1) 0%, rgba(50, 155, 244, 1) 100%);
    div {
      // margin-top: 5px;/*no*/
    }
    span {
      font-size: 16px; /*no*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.shuzi {
        // width: 48px;/*no*/
      }
    }

    .ml {
      margin-right: 10px; /*no*/
      display: flex;
      align-items: center;
      font-weight: bold;

      &.zs {
        // color:#fff;
        color: #00beff;
      }
      &.car {
        color: #00beff;
      }
      &.ren {
        color: #ff8400;
      }
      img {
        width: 32px; /*no*/
      }
    }
  }
}
.zidingyibox3 {
  .labes {
    width: 100px !important; /*no*/
  }
}
.labes {
  width: 83px; /*no*/
  height: 30px; /*no*/
  padding-right: 12px; /*no*/
  line-height: 30px; /*no*/
  position: absolute;
  top: 50%;
  margin-top: -15px; /*no*/
  left: 19px; /*no*/
  padding-left: 24px; /*no*/
  font-size: 14px !important; /*no*/
  z-index: 1;
  &.zai {
    background: #00bffe;
    color: #fff;
    border-radius: 30px; /*no*/
  }

  &.li {
    background: rgb(153, 153, 153) !important;
    color: #fff;
    border-radius: 30px; /*no*/
  }
}
.guiji-info {
  width: 319px; /*no*/
  height: 328px; /*no*/
  bottom: 14px; /*no*/
  left: 13px; /*no*/
  z-index: -1;
  position: absolute;
  background-image: url("../assets/image/details-box-car.svg");
  background-size: cover;

  display: none;
  .guiji-info-tit {
    color: #00beff;
    font-size: 17px; /*no*/
    margin-top: 18px; /*no*/
    margin-left: 45px; /*no*/
  }
  .guiji-info-mid {
    margin-left: 45px; /*no*/

    margin-top: 31px; /*no*/

    img {
      width: 96px; /*no*/
      height: 55px; /*no*/
    }

    p {
      margin-top: 5px; /*no*/
      font-size: 14px; /*no*/
    }
  }

  .qx {
    margin-left: 196px; /*no*/
    margin-top: 18px; /*no*/
    width: 100px; /*no*/
    height: 30px; /*no*/
    line-height: 30px; /*no*/
    background: none;
    border: 1px solid #00beff; /*no*/
    text-align: center;
    box-sizing: border-box;
    color: #00beff;
    font-size: 16px; /*no*/
  }
}
.infobox {
  width: 378px; /*no*/
  height: 380px; /*no*/
  bottom: 21px; /*no*/
  left: 11px; /*no*/
  position: absolute;
  background-image: url("../assets/image/details-box.svg");
  background-size: cover;

  display: none;
  .tabone {
  }
  .tabtwo {
    display: none;
    .deng {
    }
  }
  .closes {
    width: 72px; /*no*/
    height: 23px; /*no*/
    border: 1px solid #00beff; /*no*/
    text-align: center;
    line-height: 23px; /*no*/
    position: absolute;
    right: 8px; /*no*/
    top: 271px; /*no*/
    color: #00beff;
  }
  .cj_boix {
    margin-top: 5px; /*no*/
    margin-left: 45px; /*no*/
    height: 51px; /*no*/
    overflow-y: hidden;
    p {
      font-size: 12px; /*no*/
      span {
        margin-left: 10px; /*no*/
        font-size: 12px; /*no*/
      }
    }
  }
  .wintabs {
    display: flex;
    align-items: center;
    height: 32px; /*no*/
    margin-top: 21px; /*no*/
    margin-left: 45px; /*no*/
    .tabitem {
      width: 121px; /*no*/
      height: 56px; /*no*/

      display: block;
      background-image: url(../assets/image/003.svg);
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: -2px -7px; /*no*/
      text-indent: 34px; /*no*/
      line-height: 54px; /*no*/
      position: absolute;
      cursor: auto;
      label {
        font-size: 13px; /*no*/
        cursor: pointer;
      }
      &.active {
        background-image: url(../assets/image/002.svg);
        color: #fff;
      }
      &.one {
        left: 39px; /*no*/
      }
      &.two {
        left: 113px; /*no*/
      }
      &.three {
        left: 188px; /*no*/
      }
      &.four {
        left: 262px; /*no*/
      }
    }
  }
  .tit-s {
    display: flex;
    align-items: center;
    margin-top: 15px; /*no*/
    margin-left: 45px; /*no*/
    width: 314px; /*no*/
    position: relative;
    .newsply {
      position: absolute;
      top: 5px; /*no*/
      right: 0;
      display: flex;
      align-items: center;
      background: #00beff;
      border: 1px solid #fff; /*no*/
      font-size: 12px; /*no*/
      color: #fff;
      padding: 2px;
      img {
        width: 15px; /*no*/
        margin-right: 3px; /*no*/
      }
    }
    img {
      width: 21px; /*no*/
    }

    span {
      font-size: 16px !important; /*no*/
      color: #00beff;
      margin-left: 14px; /*no*/
    }

    .spyl {
      font-size: 13px !important; /*no*/
      margin-left: auto;
      display: flex;
      align-items: center;
      background: #00beff;
      padding: 4px;
      span {
        font-size: 13px !important; /*no*/
        margin-left: 0px; /*no*/
        color: #fff;
      }
      img {
        width: 15px; /*no*/
      }
    }
  }

  .tit-con {
    margin-top: 5px; /*no*/

    margin-left: 45px; /*no*/
    p {
      margin-bottom: 6px; /*no*/

      font-size: 13px !important; /*no*/
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tit-con2 {
    margin-top: 0px; /*no*/

    display: flex;
    align-items: center;
    width: 311px; /*no*/
    margin-left: 45px; /*no*/
    justify-content: space-between;

    p {
      display: flex;
      align-items: center;
      span {
        font-size: 14px !important; /*no*/
      }
      .tng {
        font-size: 16px !important; /*no*/

        font-weight: bolder;
        color: #00beff;
        margin-left: 10px; /*no*/
      }
    }
  }

  .tit-con3 {
    margin-top: 0px; /*no*/

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 311px; /*no*/
    margin-left: 45px; /*no*/
    justify-content: space-between;
    // overflow-x:scroll;

    p {
      display: flex;
      align-items: center;
      // margin-right:10px;/*no*/
      span {
        font-size: 12px !important; /*no*/
        white-space: nowrap;
      }
      .tng {
        font-size: 12px !important; /*no*/

        font-weight: bolder;
        color: #00beff;
        // margin-left: 10px;/*no*/
      }
      .online-icon {
        width: 10px; /*no*/
        height: 10px; /*no*/
        border-radius: 10px; /*no*/
        background: #13d913;
        margin-right: 5px; /*no*/
      }
      .offineline-icon {
        width: 10px; /*no*/
        height: 10px; /*no*/
        border-radius: 10px; /*no*/
        background: red;
        margin-right: 5px; /*no*/
      }
    }
  }

  .guiji {
    margin-top: 9px; /*no*/
    margin-left: 45px; /*no*/
    position: relative !important;
    z-index: 1;
    display: none;

    .xian_tb {
      margin-top: 10px; /*no*/
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .guiji-tit {
      // display: flex;
      width: 330px; /*no*/
      align-items: center;
      margin-top: 32px; /*no*/
      span {
        color: #00beff;
        font-size: 14px !important; /*no*/
      }

      .xian {
        width: 310px; /*no*/
        height: 1px; /*no*/
        background: #00beff;
        margin-left: 2px; /*no*/
      }

      .reliimg {
        margin-left: 12px; /*no*/
      }

      .xianluimg {
        margin-left: 15px; /*no*/
      }

      .reli {
        margin-left: 7px; /*no*/
      }
    }

    .guiji-sj {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      z-index: 2;
      margin-top: 8px; /*no*/
      margin-top: 27px; /*no*/
      .guiji-sj-item {
        width: 150px; /*no*/
        height: 32px; /*no*/

        // .el-date-editor.el-input, .el-date-editor.el-input__inner{
        //     width: 150px;/*no*/
        //     height: 32px;/*no*/

        // }

        .mx-datepicker,
        .mx-input-wrapper,
        .mx-input {
          width: 150px; /*no*/
          height: 30px; /*no*/
        }

        &.jieshu {
          margin-left: 11px; /*no*/
        }
      }
    }

    .guiji-btn {
      display: flex;

      margin-top: 40px; /*no*/
      p {
        font-size: 14px; /*no*/
      }
      .cha {
        width: 180px; /*no*/
        height: 30px; /*no*/
        line-height: 30px; /*no*/
        background: #00beff;
        color: #fff;
        text-align: center;
      }

      .qu {
        width: 100px; /*no*/
        height: 30px; /*no*/
        line-height: 30px; /*no*/
        background: none;
        border: 1px solid #00beff; /*no*/
        text-align: center;
        box-sizing: border-box;
        margin-left: 31px; /*no*/
      }
    }
  }
}

.yincang_infobox-left {
  position: absolute;

  left: 0;
  top: 0;
  width: 20px; /*no*/
  height: 100%;
}

.yincang_infobox-bot {
  position: absolute;

  left: 0;
  bottom: 0;
  width: 100%;
  height: 65px; /*no*/
}

.guiji {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}

.wsd {
  margin-left: 45px; /*no*/
  margin-top: 15px; /*no*/
  span {
    font-size: 13px; /*no*/
  }

  .z {
    color: #00beff;
    font-size: 18px; /*no*/
    font-weight: bold;
  }
}

.sjd-tit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 242px; /*no*/
  margin: 0 auto;
  margin-top: 13px; /*no*/
}

.sjd-tit-item {
  display: flex;
  align-items: center;
  span {
    font-size: 13px; /*no*/
    color: #00beff;
    margin-left: 5px; /*no*/
  }
}
.dengbix {
  margin-left: 71px; /*no*/
  margin-top: 40px; /*no*/

  position: relative;

  .hk {
    position: absolute;
  }

  .yt {
    left: 102px; /*no*/
  }

  .zq {
    top: 7px; /*no*/
    left: -21px; /*no*/
  }

  .yq {
    top: 7px; /*no*/
    left: 236px; /*no*/
  }

  .zh {
    top: 109px; /*no*/
    left: -23px; /*no*/
  }

  .yh {
    top: 109px; /*no*/
    left: 233px; /*no*/
  }

  .zzq {
    top: 7px; /*no*/
    left: 54px; /*no*/
  }

  .yzq {
    top: 7px; /*no*/
    left: 137px; /*no*/
  }

  .zzh {
    top: 109px; /*no*/
    left: 53px; /*no*/
  }

  .yzh {
    top: 109px; /*no*/
    left: 138px; /*no*/
  }

  .kz {
    top: -15px; /*no*/
  }

  .cc {
    top: -15px; /*no*/
    left: 176px; /*no*/
  }

  p {
    display: flex;
    align-items: center;
    // margin-right:10px;/*no*/

    span {
      font-size: 12px !important; /*no*/
      white-space: nowrap;
    }
    .tng {
      font-size: 12px !important; /*no*/

      font-weight: bolder;
      color: #00beff;
      // margin-left: 10px;/*no*/
    }
    .online-icon {
      width: 10px; /*no*/
      height: 10px; /*no*/
      // border-radius:10px;/*no*/
      background: #13d913;
      margin-right: 5px; /*no*/
    }
    .offineline-icon {
      width: 10px; /*no*/
      height: 10px; /*no*/
      // border-radius:10px;/*no*/
      background: red;
      margin-right: 5px; /*no*/
    }
  }
}
.quan2 {
  width: 100%;
  height: 100%;
  border-radius: 66px; /*no*/
  border: 1px solid #ff0000; /*no*/
  box-sizing: border-box;
}
.yujingbox_rx {
  .crximg {
    width: 100%;
    height: 100%;
    border-radius: 66px; /*no*/
    border: 1px solid #ff0000; /*no*/
    box-sizing: border-box;
  }

  .yujing_info-rx {
    width: 472px; /*no*/
    height: 530px; /*no*/
    background-image: url("../assets/image/warning-face-box.svg");
    background-size: 100% 100%;
    position: absolute;
    top: -488px; /*no*/
    left: 27px; /*no*/
    z-index: -1;
    .tis {
      color: #ff0000;
      font-size: 16px; /*no*/
      margin-top: 20px; /*no*/
      margin-left: 50px; /*no*/
    }
    .yujing_info_box {
      margin-left: 50px; /*no*/
      display: flex;
      margin-top: 26px; /*no*/
    }

    .yujing_info_box-le,
    .yujing_info_box-ri {
      img {
        width: 120px; /*no*/
        height: 120px; /*no*/
      }
      p {
        border: 1px solid #ff0000; /*no*/
        border-top: none;
        height: 27px; /*no*/
        width: 120px; /*no*/
        box-sizing: border-box;
        line-height: 27px; /*no*/
        text-align: center;
        color: #ff0000;
        font-size: 12px; /*no*/
      }
    }
    .yujing_info_box-mid {
      margin-left: 47px; /*no*/
      margin-right: 47px; /*no*/
      .baifen {
        color: #b82424;

        font-size: 24px; /*no*/
        margin-top: 33px; /*no*/
      }
      .zi {
        font-size: 14px; /*no*/
        margin-top: 30px; /*no*/
      }
    }

    .yujing_info_pp {
      margin-top: 20px; /*no*/
      margin-left: 56px; /*no*/
      display: flex;
      flex-wrap: wrap;
      p {
        margin-bottom: 5px; /*no*/
        font-size: 12px; /*no*/
        max-width: 394px; /*no*/
        width: 50%;
        overflow: hidden;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        box-orient: vertical;
        display: -webkit-box;
      }
    }
    .yujing_info_bot {
      display: flex;
      margin-left: 50px; /*no*/
      margin-top: 14px; /*no*/
      .jj {
        width: 120px; /*no*/
        height: 30px; /*no*/
        background: #ff0000;
        color: #fff;
        text-align: center;
        line-height: 30px; /*no*/
      }
      .sy,
      .hf,
      .qx {
        width: 120px; /*no*/
        height: 30px; /*no*/
        border: 1px solid #ff0000; /*no*/
        margin-left: 10px; /*no*/
        color: #ff0000;
        text-align: center;
        line-height: 30px; /*no*/
        box-sizing: border-box;
        font-size: 12px; /*no*/
      }
    }
  }
}

.quancp {
  width: 130%;
}
.quancp_label {
  position: absolute;
  font-size: 12px; /*no*/
  top: 5px; /*no*/
  left: 5px; /*no*/
  color: #fff;
  white-space: nowrap;
}

.yujingbox {
  .cpimg {
    width: 100%;
  }

  label {
    position: absolute;
    font-size: 12px; /*no*/
    top: 3px; /*no*/
    left: 5px; /*no*/
    color: #fff;
  }
  .yujing_info {
    width: 472px; /*no*/
    height: 381px; /*no*/
    background-image: url("../assets/image/warning-car-box.svg");
    background-size: 100% 100%;
    position: absolute;
    top: -335px; /*no*/
    left: 27px; /*no*/
    z-index: -1;

    .tis {
      color: #ff0000;
      font-size: 16px; /*no*/
      margin-top: 20px; /*no*/
      margin-left: 50px; /*no*/
    }

    .yujing_info_box {
      margin-left: 50px; /*no*/
      display: flex;
      margin-top: 20px; /*no*/
      .yujing_info_box-le {
        img {
          width: 120px; /*no*/
          height: 120px; /*no*/
        }
        p {
          border: 1px solid #ff0000; /*no*/
          border-top: none;
          width: 120px; /*no*/
          height: 37px; /*no*/
          font-size: 14px; /*no*/
          color: #000;
          box-sizing: border-box;
          text-align: center;
          line-height: 37px; /*no*/
        }
      }

      .yujing_info_box-ri {
        margin-left: 18px; /*no*/
        p {
          font-size: 12px; /*no*/
          margin-top: 5px; /*no*/
          max-width: 270px; /*no*/

          overflow: hidden;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          box-orient: vertical;
          display: -webkit-box;
        }
      }
    }

    .yujing_info_bot {
      display: flex;
      margin-left: 50px; /*no*/
      margin-top: 28px; /*no*/
      .jj {
        width: 120px; /*no*/
        height: 30px; /*no*/
        background: #ff0000;
        color: #fff;
        text-align: center;
        line-height: 30px; /*no*/
      }
      .sy,
      .hf,
      .qx {
        width: 80px; /*no*/
        height: 30px; /*no*/
        border: 1px solid #ff0000; /*no*/
        margin-left: 10px; /*no*/
        color: #ff0000;
        text-align: center;
        line-height: 30px; /*no*/
        box-sizing: border-box;
        font-size: 12px; /*no*/
      }
    }
  }
}

//百度辅助工具
</style>

<style lang="scss" scoped>
.map_obj_box {
  width: 100%;
  height: 100%;
}
#map_obj {
  width: 100%;
  height: 100%;
}

.lkjcsdklc {
  width: 100%;
  height: 100%;
}
</style>
