<template>
  <div ref="NumCJBar" class="NumCJ"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    barName: {
      type: Array,
      define: () => {
        return [];
      },
    },
    barVal: {
      type: Array,
      define: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    barVal: {
      handler(newss, old) {
        this.getEcharts();
      },

      immediate: false,
    },
  },
  methods: {
    getEcharts() {
      var myChart = echarts.init(this.$refs.NumCJBar);
      var that = this;
      var option;

      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const yAxisPoint = shape.yAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x + 8, shape.y - 14];
          const c2 = [yAxisPoint[0] + 8, yAxisPoint[1] - 14];
          const c3 = [yAxisPoint[0], yAxisPoint[1]];
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath();
        },
      });
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const yAxisPoint = shape.yAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [yAxisPoint[0], yAxisPoint[1]];
          const c3 = [yAxisPoint[0] + 8, yAxisPoint[1] + 14];
          const c4 = [shape.x + 8, shape.y + 14];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + 8, shape.y + 14];
          const c3 = [shape.x + 16, shape.y];
          const c4 = [shape.x + 8, shape.y - 14];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      echarts.graphic.registerShape("CubeLeft", CubeLeft);
      echarts.graphic.registerShape("CubeRight", CubeRight);
      echarts.graphic.registerShape("CubeTop", CubeTop);
      const MAX = [6000, 6000, 6000, 6000, 6000];
      const VALUE = that.barVal;
      const NAMES = that.barName;
        console.log("NAMES===",NAMES)
        console.log("VALUE===",VALUE)
      option = {
        backgroundColor: "#fff",
        grid: {
          left: "0%",
          right: "15%",
          bottom: "5%",
          top: "5%",
          containLabel: true,
        },
        yAxis: {
          type: "category",
          data: NAMES,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#000",
            },
          },
          offset: 0,
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: "#7DFFFD",
            },
          },
          axisLabel: {
            color: "#31c7fe",
            formatter: function (value, index) {
              let num = value.indexOf("-");
              let departName = value.substring(0, num);
              let carNumber = value.substring(num + 1, value.length);
              return departName + "\n" + carNumber;
            },
          },
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "white",
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            fontSize: 16,
          },
          //   boundaryGap: ["20%", "20%"],
        },
        series: [
          {
            type: "custom",
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              return {
                type: "group",
                children: [
                  {
                    type: "CubeLeft",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#2ea4cc",
                        },
                        {
                          offset: 1,
                          color: "#a1c7fe",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeRight",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#2ea4cc",
                        },
                        {
                          offset: 1,
                          color: "#a1c7fe",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeTop",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#2ea4cc",
                        },
                        {
                          offset: 1,
                          color: "#2ea4cc",
                        },
                      ]),
                    },
                  },
                ],
              };
            },
            data: VALUE,
          },
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "right",
                color: "#4ccefe",
                offset: [15, 0],
                formatter: function (value, index) {
                  let text = value.data;
                  if (value.data >= 10000) {
                    text = (value.data / 10000).toFixed(1) + "万";
                  } else if (value.data > 10000000) {
                    text = (value.data / 10000000).toFixed(1) + "千万";
                  }
                  return text;
                },
              },
            },
            itemStyle: {
              color: "transparent",
            },
            tooltip: {},
            data: VALUE,
          },
        ],
        dataZoom:[
            {
                type: "inside",
                startValue: 0, 
                endValue: 2, 
                minValueSpan: 2,  
                maxValueSpan: 2,  
                yAxisIndex: [0],
              zoomOnMouseWheel: false,  // 关闭滚轮缩放
              moveOnMouseWheel: true, // 开启滚轮平移
              moveOnMouseMove: true  // 鼠标移动能触发数据窗口平移 
            },
            {
              type: 'slider',
              realtime: true,
              startValue: 0, 
              endValue: 2,  
              width:  '3.5',
              height:  '80%',
              yAxisIndex: [0], // 控制y轴滚动
              fillerColor: "rgba(154, 181, 215, 1)", // 滚动条颜色
              borderColor: "rgba(17, 100, 210, 0.12)", 
              backgroundColor: '#cfcfcf',//两边未选中的滑动条区域的颜色
              handleSize:0, // 两边手柄尺寸
              showDataShadow: false,//是否显示数据阴影 默认auto
              showDetail: false, // 拖拽时是否展示滚动条两侧的文字
              top:'1%',
              right:'5',
          }
          
        ]
      };

      option && myChart.setOption(option);
    },
  },
  created() {
    // this.$nextTick(() => {
    //   this.getEcharts();
    // });
  },
};
</script>

<style lang="scss" scoped>
.NumCJ {
  width: 100%;
  height: 100%;
}
</style>