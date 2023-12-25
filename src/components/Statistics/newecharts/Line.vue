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
    barVal2: {
      type: Array,
      define: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    // valName:{
    //   let aa=[...this.barVal2,...barVal];
    //   return aa;
    // }
  },
  watch: {
    barVal: {
      handler(newss, old) {
        this.getEcharts();
      },

      immediate: false,
    },
    // barVal2: {
    //   handler(newss, old) {
    //     this.getEcharts();
    //   },

    //   immediate: false,
    // },
  },
  methods: {
    getEcharts() {
      var myChart = echarts.init(this.$refs.NumCJBar);
      var that = this;
      var option;

      option = {
        backgroundColor: "#fff",
        grid: {
          left: "5%",
          right: "5%",
          bottom: "12%",
          top: "8%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#26c3fd", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        legend: {
          itemWidth: 12,
          bottom: "2%",
          top: "bottom",
          data: [
            {
              name: "人像采集",
              icon: "roundRect",
              textStyle: {
                color: "#26c3fd",
              },
              lineStyle: {
                color: "#26c3fd",
              },
            },
            {
              name: "车牌采集",
              icon: "roundRect",
              textStyle: {
                color: "#a06ee4",
              },
              lineStyle: {
                color: "#a06ee4",
              },
            },
          ],
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              formatter: "{value}",
              fontSize: 14,
              margin: 20,
              textStyle: {
                color: "#7ec7ff",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#243753",
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#243753",
              },
            },
            axisTick: {
              show: false,
            },
            data: that.barName,
          },
        ],
        yAxis: [
          {
            boundaryGap: false,
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#7ec7ff",
              },
            },
            nameTextStyle: {
              color: "#fff",
              fontSize: 12,
              lineHeight: 40,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#78ddff",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#283352",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "人像采集",
            type: "line",
            smooth: true,
            showSymbol: false,
            symbolSize: 2,
            zlevel: 3,
            itemStyle: {
              color: "#26c3fd",
              borderColor: "#26c3fd",
            },
            label: {
              show: true,
              position: "top",
                      textStyle: {
                          color: '#FFF',
                          fontSize: 14
                      }
            },
            lineStyle: {
              normal: {
                width: 2,
                color: "#26c3fd",
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(38,195,253,0.8)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(38,195,253,0.2)",
                    },
                    {
                      offset: 1,
                      color: "rgba(38,195,253,0)",
                    },
                  ],
                  false
                ),
              },
            },
            emphasis: {
              focus: "series",
            },
            data: that.barVal,
          },
          {
            name: "车牌采集",
            type: "line",
            smooth: true,
            showSymbol: false,
            symbolSize: 2,
            zlevel: 3,
            itemStyle: {
              color: "#a06ee4",
              borderColor: "#a06ee4",
            },
            label: {
              show: true,
              position: "top",
            },
            lineStyle: {
              normal: {
                width: 2,
                color: "#a06ee4",
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(160,110,228,0.8)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(160,110,228,0.2)",
                    },
                    {
                      offset: 1,
                      color: "rgba(160,110,228,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: that.barVal2,
          },
        ],
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