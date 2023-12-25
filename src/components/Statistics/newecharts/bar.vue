<template>
  <div ref="NumCJBar" class="NumCJ"></div>
</template>

<script>
// const echarts = require("echarts/lib/echarts");
// require("echarts/lib/component/grid");
// require("echarts/lib/chart/bar");
// require("echarts/lib/chart/pictorialBar");

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
      var option;

      let domWidth = window.getComputedStyle(this.$refs.NumCJBar).width;
      domWidth = parseFloat(domWidth.substring(0, domWidth.length - 2));
      let barWidth = domWidth / 20;
      let that = this;
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x - 14, shape.y - 8];
          const c2 = [xAxisPoint[0] - 14, xAxisPoint[1] - 8];
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
          const c3 = [xAxisPoint[0] + 14, xAxisPoint[1] - 8];
          const c4 = [shape.x + 14, shape.y - 8];
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
          const c2 = [shape.x + 14, shape.y - 8];
          const c3 = [shape.x, shape.y - 16];
          const c4 = [shape.x - 14, shape.y - 8];
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
        backgroundColor: "#fff",
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "20%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} : {c}",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: "category",
          data: that.barName,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#78ddff",
            },
          },
          nameTextStyle: {
            color: "#000",
          },
          offset: 5,
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: "#000",
            },
          },
          axisLabel: {
            color: "#31c7fe",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#78ddff",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#78ddff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#5bcffe",
          },
          // boundaryGap: ["20%", "20%"],
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
            data: that.barVal,
          },
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
