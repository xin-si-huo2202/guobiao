<template>
  <div>
    <div id="quyuhuafen"></div>
    <ul class="drawing-panel">
      <li
        class="bmap-btn bmap-marker"
        :class="this.id == 'marker' ? 'active' : ''"
        id="marker"
        @click="draw('marker')"
      ></li>
      <li
        class="bmap-btn bmap-polyline"
        :class="this.id == 'polyline' ? 'active' : ''"
        id="polyline"
        @click="draw('polyline')"
      ></li>
      <li
        class="bmap-btn bmap-rectangle"
        :class="this.id == 'rectangle' ? 'active' : ''"
        id="rectangle"
        @click="draw('rectangle')"
      ></li>
      <li
        class="bmap-btn bmap-polygon"
        :class="this.id == 'polygon' ? 'active' : ''"
        id="polygon"
        @click="draw('polygon')"
      ></li>
      <li
        class="bmap-btn bmap-circle"
        :class="this.id == 'circle' ? 'active' : ''"
        id="circle"
        @click="draw('circle')"
      ></li>
    </ul>
    <button class="pointsArrBtn" @click="pointsArrHandel">
      获取数据--轨迹坐标
    </button>
    <el-dialog
      title="区域划分"
      :visible.sync="dialogFormVisible"
      class="dialog"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <el-form-item label="区域划分" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="颜色选择" :label-width="formLabelWidth">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="cancelProcessing">取 消</el-button>-->
        <el-button type="primary" @click="collectInformation">确 定</el-button>
      </div>
    </el-dialog>
    <el-button class="dataViewing" type="info" @click="chouti_btn"
      >数据查看</el-button
    >
    <el-drawer
      title="区域展示操作!"
      :visible.sync="table"
      direction="rtl"
      size="50%"
      :modal="false"
    >
      <el-table :data="gridData">
        <el-table-column
          property="name"
          label="区域名称"
          width="200"
        ></el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import { huoqu_region } from "@/api/system.js";
export default {
  data() {
    return {
      //抽屉
      table: false,
      gridData: [],
      //对话框默认不显示
      dialogFormVisible: false,
      form: {
        name: "",
        color: "#409EFF",
        id: "",
      },
      formLabelWidth: "120px",
      //点坐标数组
      pointsArr: [1, 2],
      drawingManager: null,
      id: "",
      map: null,
      state: false,
      styleOptions: {
        strokeColor: "#5E87DB", // 边线颜色
        fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 2, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2, // 填充透明度，取值范围0-1
      },
      labelOptions: {
        borderRadius: "2px",
        background: "#FFFBCC",
        border: "1px solid #E1E1E1",
        color: "#703A04",
        fontSize: "12px",
        letterSpacing: "0",
        padding: "5px",
      },
    };
  },
  methods: {
    //地图初始化
    baiduMapInit: function () {
      this.map = new BMapGL.Map("quyuhuafen"); // 创建Map实例
      var mapLatitude, mapLongitude;
      if (sessionStorage.mapLongitude) {
        mapLongitude = sessionStorage.mapLongitude;
        mapLatitude = sessionStorage.mapLatitude;
      }
      console.log(mapLatitude, mapLongitude, "存储的经纬度");
      this.map.centerAndZoom(new BMapGL.Point(mapLongitude, mapLatitude), 18); // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    },
    //绘制图形
    drawGraph: function () {
      var arrNew = JSON.parse(localStorage.getItem("pointsArr"));
      console.log(arrNew);
      if (arrNew) {
        for (var t = 0; t < arrNew.length; t++) {
          var points = [];
          for (var i = 0; i < arrNew[t].pointsArr.length; i++) {
            points.push(
              new BMapGL.Point(
                arrNew[t].pointsArr[i].lng,
                arrNew[t].pointsArr[i].lat
              )
            );
          }
          var color = arrNew[t].color;
          console.log(color, "颜色");
          // 绘制线
          var polyline = new BMapGL.Polyline(points, {
            strokeColor: color,
            strokeWeight: 4,
            strokeOpacity: 1,
          });
          this.map.addOverlay(polyline);
        }
      } else {
        console.log("失败");
        this.map.clearOverlays();
        this.$message({
          showClose: true,
          message: "暂无数据",
          type: "error",
        });
      }
    },
    //百度地图工具初始化
    draw(value) {
      var drawingManager = new BMapGLLib.DrawingManager(this.map, {
        //isOpen: true, // 是否开启绘制模式
        enableCalculate: false, // 绘制是否进行测距测面
        enableSorption: true, // 是否开启边界吸附功能
        sorptiondistance: 20, // 边界吸附距离
        circleOptions: this.styleOptions, // 圆的样式
        polylineOptions: this.styleOptions, // 线的样式
        polygonOptions: this.styleOptions, // 多边形的样式
        rectangleOptions: this.styleOptions, // 矩形的样式
        labelOptions: this.labelOptions, // label样式
      });
      var that = this;
      drawingManager.addEventListener("overlaycomplete", function (e) {
        that.dialogFormVisible = true;
        if (e.drawingMode == "circle") {
          return;
        }
        //点
        if (e.drawingMode == "marker") {
          var point = e.overlay.point;
          console.log(point, "点的坐标");
          var marker = localStorage.getItem("markerArr")
            ? JSON.parse(localStorage.getItem("markerArr"))
            : [];
          marker.push(point);
          console.log(marker, "存放的点的坐标");
          localStorage.setItem("markerArr", JSON.stringify(marker));
        }
        //线
        if (e.drawingMode == "polyline") {
          var points = e.overlay.points;
          var aaa = [];
          points.forEach((item) => {
            aaa.push(item.latLng);
          });
          var totle = localStorage.getItem("pointsArr")
            ? JSON.parse(localStorage.getItem("pointsArr"))
            : [];
          totle.push(aaa);
          localStorage.setItem("pointsArr", JSON.stringify(totle));
        }
      });
      this.id = value;
      console.log(value);
      switch (value) {
        case "marker": {
          var drawingType = BMAP_DRAWING_MARKER;
          break;
        }
        case "polyline": {
          var drawingType = BMAP_DRAWING_POLYLINE;
          break;
        }
        case "rectangle": {
          var drawingType = BMAP_DRAWING_RECTANGLE;
          break;
        }
        case "polygon": {
          var drawingType = BMAP_DRAWING_POLYGON;
          break;
        }
        case "circle": {
          var drawingType = BMAP_DRAWING_CIRCLE;
          break;
        }
      }
      // 进行绘制
      if (
        drawingManager._isOpen &&
        drawingManager.getDrawingMode() === drawingType
      ) {
        drawingManager.close();
      } else {
        drawingManager.setDrawingMode(drawingType);
        drawingManager.open();
      }
    },
    //获取数据按钮
    async pointsArrHandel() {
      console.log("获取数据");
      this.map.clearOverlays();
      this.drawGraph();
      //获取抽屉数据
      this.choutidataViewing();

      //接口
      var res = await huoqu_region({ size: 1000 });
      console.log(res, "接口数据");
    },
    //收集信息---确定按钮
    collectInformation() {
      //关闭弹出层
      this.dialogFormVisible = false;
      //数据收集
      this.form.id = +new Date();
      console.log(this.form);
      this.dataProcessing(this.form);
    },
    //数据处理
    dataProcessing(data) {
      //线数据处理
      //console.log(data);
      var pointsArr = localStorage.getItem("pointsArr")
        ? JSON.parse(localStorage.getItem("pointsArr"))
        : [];
      //console.log(pointsArr, "元数据");

      var shuju = {
        name: data.name,
        color: data.color,
        id: data.id,
        pointsArr: pointsArr[pointsArr.length - 1],
      };
      pointsArr.splice(pointsArr.length - 1, 1, shuju);
      //console.log(shuju);
      //console.log(pointsArr, "替换完的数据");
      //抽屉里面表格数据
      localStorage.setItem("pointsArr", JSON.stringify(pointsArr));
    },
    //抽屉的点击事件
    chouti_btn() {
      this.table = true;
      this.choutidataViewing();
    },
    //抽屉的删除功能
    handleDelete(a, b) {
      console.log(a, b);
      var pointsArr = JSON.parse(localStorage.getItem("pointsArr"));
      console.log(pointsArr, "删除前的数据");
      pointsArr.splice(
        pointsArr.filter((item) => {
          item.id !== b.id;
        }),
        1
      );
      console.log(pointsArr, "删除后的数据");
      localStorage.setItem("pointsArr", JSON.stringify(pointsArr));
      //获取抽屉数据
      this.choutidataViewing();
      //刷新页面区域图
      this.map.clearOverlays();
      this.drawGraph();
    },
    //抽屉的数据获取
    choutidataViewing() {
      this.gridData = JSON.parse(localStorage.getItem("pointsArr"));
    },
    //取消按钮
    //cancelProcessing() {
    //  //关闭弹出层
    //  this.dialogFormVisible = false;
    //  //删除数据
    //},
  },
  mounted() {
    this.baiduMapInit();
    this.pointsArrHandel();
  },
  created() {
    //开始就执行一次
    //this.dataProcessing();
    this.choutidataViewing();
  },
};
</script>
<style lang="scss" scoped>
//抽屉按钮
.dataViewing {
  position: fixed;
  top: 120px;
  z-index: 40;
  left: 50px;
}
//弹出框
.dialog {
  position: fixed;
  top: 100px;
  margin: 0 auto;
  z-index: 100;
}
#quyuhuafen {
  height: 100vh !important;
  width: 100vw !important;
}
.pointsArrBtn {
  position: absolute;
  top: 400px;
  left: 400px;
  z-index: 40;
}
.drawing-panel {
  position: fixed;
  top: 210px;
  left: 70px;
  z-index: 20;
  border-radius: 3px;
  height: 59px;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  .bmap-btn {
    list-style: none;
    border-right: 1px solid #d2d2d2;
    float: left;
    width: 64px;
    height: 100%;
    background-image: url(https://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
    cursor: pointer;
  }
  #marker {
    background-position: -110px 0;
  }
  #polyline {
    background-position: -308px 0;
  }
  #rectangle {
    background-position: -497px 0;
  }
  #polygon {
    background-position: -405px 0;
  }
  #circle {
    background-position: -208px 0;
  }
  .active {
    background-position-y: -75px !important;
  }
}
</style>