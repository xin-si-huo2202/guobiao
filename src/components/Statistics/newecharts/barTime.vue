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
    valMaxNum: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {};
  },
  watch: {
    barName: {
      handler(newss, old) {
        this.getEcharts();
      },

      immediate: false,
    },
  },
  methods: {
    getEcharts() {
      var myChart = echarts.init(this.$refs.NumCJBar);
      var option;
      let dataZoomStr = [];
      let that = this;
      if (that.barVal.length > that.valMaxNum) {
        dataZoomStr = [
          {
            type: "slider",
            show: true, //显示滚动条
            zoomLock: true, //锁定滚动条缩放，（固定滚动条长度）
            xAxisIndex: [0],
            left: "5%", //离左边的百分比距离
            bottom: "5%",
            backgroundColor: "#055266",
            borderColor: "#055266 ", //边框和背景颜色一致，（因为无法做到无边框，只能跟随页面背景）
            height: 1, //滚动条高度
            showDetail: false, //关闭：拖拽时候显示详细数值信息。
            fillerColor: "#5BA9ED", //滚动条颜色
            moveHandleStyle: {
              color: "#5BA9ED",
            },
            handleSize: "100%", //矢量尺寸占比
            handleStyle: {
              borderWidth: 0,
              color: "#5BA9ED",
            },

            start: 0, //初始化滚动条开始位置
            end: Number.parseInt((that.valMaxNum * 100) / that.barVal.length), //初始化滚动条结束位置
            showDataShadow: false, //屏蔽折线图，true为显示折线图
          },
        ];
      }
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x - 12, shape.y - 6];
          const c2 = [xAxisPoint[0] - 12, xAxisPoint[1] - 6];
          const c3 = [xAxisPoint[0], xAxisPoint[1]];
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
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [xAxisPoint[0], xAxisPoint[1]];
          const c3 = [xAxisPoint[0] + 12, xAxisPoint[1] - 6];
          const c4 = [shape.x + 12, shape.y - 6];
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
        buildPath: function(ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + 12, shape.y - 6];
          const c3 = [shape.x, shape.y - 13];
          const c4 = [shape.x - 12, shape.y - 6];
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
      option = {
        grid: {
          left: "0%",
          right: "0%",
          bottom: "5%",
          top: "20%",
          containLabel: true,
        },
        tooltip: {
          formatter: function(value, index) {
            let text = value.data;
            if (value.data >= 60) {
              text =
                parseInt(value.data / 60) +
                "小时" +
                parseInt(value.data % 60) +
                "分钟";
            } else {
              text = value.data + "分钟";
            }
            return value.name + " : " + text;
          },
        },
        xAxis: {
          type: "category",
          data: that.barName,
          axisLabel: {
            rotate: 60,
            // fontSize: 7,
            // formatter: (value, index) => {
            //   return (
            //     value.substring(0, 2) + "\n" + value.substring(2, value.length)
            //   );
            // },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#78ddff",
            },
          },
        },
        yAxis: {
          show: false,
          type: "value",
        },
        dataZoom: dataZoomStr,
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#1a93bc",
                        },
                        {
                          offset: 1,
                          color: "#7eb3fe",
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#1a93bc",
                        },
                        {
                          offset: 1,
                          color: "#7eb3fe",
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#2077d1",
                        },
                        {
                          offset: 1,
                          color: "#2077d1",
                        },
                      ]),
                    },
                  },
                ],
              };
            },
            data: that.barVal,
          },
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "top",
                color: "#4ccefe",
                offset: [0, -15],
                formatter: function(value, index) {
                  let text = value.data;
                  if (value.data >= 60) {
                    text =
                      parseInt(value.data / 60) +
                      "时" +
                      "\n" +
                      parseInt(value.data % 60) +
                      "分";
                  } else {
                    text = value.data + "分";
                  }
                  return text;
                },
              },
            },
            itemStyle: {
              color: "transparent",
            },
            tooltip: {},
            data: that.barVal,
          },
          // {
          //   data: that.barVal,
          //   type: "bar",
          //   showBackground: true,
          //   backgroundStyle: {
          //     color: "rgba(180, 180, 180, 0.2)",
          //   },
          //   itemStyle: {
          //     color: "#00beff",
          //   },
          //   label: {
          //     show: false,
          //     position: "top",
          //     fontSize: "14px",
          //     color: "#00beff",
          //     formatter: function(value, index) {
          //       let text = value.data;
          //       if (value.data >= 60) {
          //         text =
          //           parseInt(value.data / 60) +
          //           "时" +
          //           "\n" +
          //           parseInt(value.data % 60) +
          //           "分";
          //       } else {
          //         text = value.data + "分";
          //       }
          //       return text;
          //     },
          //   },
          // },
        ],
      };
      option && myChart.setOption(option);
    },
  },
  created() {
    this.$nextTick(() => {
      this.getEcharts();
    });
  },
};
</script>

<style lang="scss" scoped>
.NumCJ {
  width: 100%;
  height: 100%;
}
</style>
