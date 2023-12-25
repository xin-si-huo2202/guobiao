<template>
  <div class="center">
    <div class="center_left">
      <!-- 表单 -->
      <div class="center_form">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
        >
          <el-form-item label="时间">
            <!--<el-date-picker
              v-model="value1"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>-->
            <div
              class="pickerTimer"
              style="
                display: flex;
                justify-content: space-around;
                width: 221px;
                font-size: 12px !important;
              "
            >
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <!--<span>-</span>-->
              <!--<el-date-picker
                v-model="endTime"
                type="date"
                placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>-->
            </div>
          </el-form-item>
          <el-form-item label="防控区">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.gridName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="网格">
            <el-select v-model="gridvalue" placeholder="请选择">
              <el-option
                v-for="item in gridoptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="状态">
            <el-select v-model="stateovalue" placeholder="请选择" size="medium">
              <el-option
                v-for="item in stateoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div style="display: flex; justify-content: space-around">
        <el-button type="primary" @click="handleRetrieval">检索</el-button>
        <el-button type="success" @click="handleReset">重置</el-button>
      </div>
      <!-- 车辆 -->
      <div class="center_tree" style="padding-top: 10px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="所有车辆" name="1">
            <ul>
              <li
                v-for="item in carListAll"
                :key="item.id"
                class="carlist"
                @click="carHandel(item.carNumber)"
              >
                <span>{{ item.carNumber }} </span>
                <span>{{ item.sysOrgCode }}</span>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="center_right">
      <div class="main">
        <div class="main_header">
          <p style="margin-top: 5px; margin-bottom: 10px">巡防轨迹</p>
        </div>
      </div>
      <div class="main_footer">
        <template v-if="pointData && pointData.length">
          <div class="info_item" v-for="info in pointData" :key="info.id">
            <img class="img" :src="info.areaApture" alt="" />
            <div class="details">
              <p style="display: flex; justify-content: space-between">
                <span>{{ info.name }}</span>
                <span :class="info.isRegister == '1' ? 'aaa' : 'bbb'">{{
                  info.isRegister == "1" ? "已签到" : "未签到"
                }}</span>
              </p>
              <p>{{ info.signInGrid ? info.signInGrid : "暂无数据" }}</p>
              <p>
                <!--签到时间：暂无数据-->
                签到时间：{{
                  info.isRegister == "1" ? info.createTime : "暂无数据"
                }}
              </p>
              <p>
                巡防车辆：{{ info.plateNumber ? info.plateNumber : "暂无数据" }}
              </p>
              <p style="display: flex; justify-content: space-between">
                <span
                  >巡防人:{{
                    info.signInPerson ? info.signInPerson : "暂无数据"
                  }}</span
                >
                <span
                  class="watchmanDetails"
                  @click="go_watchmanDetails(info, startTime)"
                  >巡防详情></span
                >
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div
            style="
              height: 600px;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <EmpMini />
          </div>
        </template>
      </div>
      <div v-if="pointData && pointData.length" style="text-align: center">
        <el-pagination
          layout="prev, pager, next"
          :total="totle"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  clockingRecord,
  listOfRecord,
  getOneDateList,
  dateCount,
  getGridSignin,
} from "@/api/system.js";
import EmpMini from "@/components/empMini.vue";
import { selectPoliceCarAndDepartment } from "@/api/index.js";
import "@/utils/swiper/swiper.min.css";
import "@/utils/swiper/swiper.min.js";
export default {
  data() {
    name: "patrolTrack";
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
      },
      startTime: "",
      endTime: "",
      //下拉菜单-区域
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      //网格
      gridvalue: "",
      gridoptions: [
        {
          value: "",
          label: "一号网格",
        },
      ],
      //状态
      stateovalue: "",
      stateoptions: [
        {
          value: "1",
          label: "已打卡",
        },
        {
          value: "2",
          label: "未打卡",
        },
      ],
      //列表
      activeNames: ["1"],
      //table表格数据
      defaultProps: {
        children: "children",
        label: "label",
      },
      //日期列表
      dateTime: [
        {
          id: 1,
          title: "星期一",
          time: "2020202",
        },
        {
          id: 2,
          title: "星期二",
          time: "2020202",
        },
        {
          id: 3,
          title: "星期三",
          time: "2020202",
        },
        {
          id: 4,
          title: "星期四",
          time: "2020202",
        },
        {
          id: 5,
          title: "星期五",
          time: "2020202",
        },
        {
          id: 6,
          title: "星期六",
          time: "2020202",
        },
        {
          id: 7,
          title: "星期天",
          time: "2020202",
        },
      ],
      //点击高亮
      activeVar: null,
      //打卡点
      pointData: null,
      //所有车辆
      carListAll: null,
      //所有日期
      dateList: null,
      //当前天数有几条数据
      totle: null,
      //分页
      // 总数据
      //tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [1, 2, 3, 4],
      // 默认每页显示的条数（可修改）
      PageSize: 1,
    };
  },
  components: {
    EmpMini,
  },
  methods: {
    handleNodeClick(val) {
      console.log(val);
    },
    ////选中的高亮
    //async Selecthandel(val) {
    //  //console.log(val);
    //  this.activeVar = val.time;
    //  let param = new FormData();
    //  //param.append("page", 1);
    //  //param.append("size", 9);
    //  param.append("date", val.time);
    //  var res = await getOneDateList(param);
    //  console.log(res, "当天的数据");
    //  this.pointData = res.result;
    //  this.totle = res.result.length;
    //},
    //开局选择第一天的数据
    async handelChange(page = 1, size = 9) {
      console.log(this.startTime);
      //let param = new FormData();

      //param.append("page", pageNo);
      //param.append("size", pageSize);
      //param.append("date", this.startTime);
      var param = {
        page,
        size,
        date: this.startTime,
        gridId: this.gridId ? this.gridId : "",
      };
      var res = await getOneDateList(param);
      console.log(res, "当天的数据");
      this.pointData = res.result.result;
      this.totle = res.result.records;
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getData(val, 1);
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(page) {
      // 改变默认的页数
      this.currentPage = page;
      // 切换页码时，要获取每页显示的条数
      this.handelChange(this.currentPage, 9);
      //this.getData(this.PageSize, val * this.pageSize);
    },
    //跳转
    go_watchmanDetails(val, time) {
      //if (val.isRegister) {
      //  this.$router.push({ name: "watchmanDetails", query: { info: val } });
      //} else {
      //  this.$message.error("暂无数据");
      //}
      this.$router.push({
        name: "watchmanDetails",
        query: { info: val, time: time },
      });
    },
    //获取数据----所有车辆信息
    async getcarList() {
      var res = await selectPoliceCarAndDepartment({
        policeCarName: this.policeCarName,
      });
      //console.log(res);
      var carlist = [...res.result.offLine, ...res.result.onLineCar];
      //console.log(carlist, "所有车辆");
      this.carListAll = carlist;
    },
    //汽车列表点击事件
    async carHandel(val) {
      //var res = await listOfPoliceCars();
      //var request = res.result.records;
      //console.log("点击", val);
      console.log(this.pointData, "过滤前的数据", val);
      var newPointData = this.pointData.filter((item) => {
        return item.plateNumber == val;
      });
      //console.log(newPointData, "过滤的数据");
      this.pointData = newPointData;
    },
    //获取日期
    //async getDatePoint() {
    //  //console.log("我被执行");
    //  //var form = ;
    //  let param = new FormData();
    //  param.append("page", 1);
    //  param.append("size", 7);
    //  var timer = new Date();

    //  var year = timer.getFullYear();
    //  var month = timer.getMonth() + 1;
    //  var days = timer.getDate();
    //  console.log(year, month, days);

    //  var endTimes = year + "-" + month + "-" + days;
    //  //获取7天前的时间
    //  var now = new Date();
    //  var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    //  var year1 = date.getFullYear();
    //  var month1 = date.getMonth() + 1;
    //  var day1 = date.getDate() + 1;
    //  var startTimes = year1 + "-" + month1 + "-" + day1;
    //  console.log(startTimes);
    //  console.log(endTimes);
    //  param.append("startTime", startTimes);
    //  param.append("endTime", endTimes);
    //  var res = await dateCount(param);
    //  console.log("aaaaaaaa", res);
    //  this.dateList = res.result;
    //  //console.log(this.dateList, "获取选中的总天数");
    //  //默认选中第一条数据
    //  this.activeVar = this.dateList[0].time;
    //  //this.count = this.dateList[0].count;
    //},
    //获取数据----防控区区域划分
    async getRegionalDivision() {
      var dty = await getGridSignin();

      var liss = dty.result.records;
      console.log("接口获取的数据是", liss);
      this.options = liss;
      //this.totle=liss.length
    },
    //检索按钮
    async handleRetrieval() {
      console.log(this.startTime, "搜索数据源");
      //console.log(this.endTime, "搜索数据源");
      console.log(this.stateovalue, "打卡状态搜索数据源");
      console.log(this.value, "搜索数据源");
      //var form={
      //  signInGrid:
      //}
      this.currentPage = 1;
      //let param = new FormData();
      //param.append("page", 1);
      //param.append("size", 9);
      //param.append("date", this.startTime);
      //param.append("gridId", this.value ? this.value : "");
      var param = {
        page: 1,
        size: 9,
        date: this.startTime,
        gridId: this.gridId ? this.gridId : "",
      };
      var res = await getOneDateList(param);
      console.log(res);
      var data = res.result.result;
      this.totle = res.result.records;
      if (this.stateovalue == "1") {
        //已打卡
        var aa = data.filter((item) => {
          return item.isRegister == "1";
        });
        console.log(aa, "已打卡的数据");
        this.pointData = aa;
      } else if (this.stateovalue == "2") {
        var bb = data.filter((item) => {
          return item.isRegister == undefined;
        });
        console.log(bb);
        this.pointData = bb;
      } else {
        this.pointData = res.result.result;
      }
    },

    //重置按钮
    handleReset() {
      this.startTime = null;
      this.endTime = null;
      this.stateovalue = null;
      this.value = null;
      //获取当天的数据
      this.handelChange();
    },
    //获取网格
    //时间列表=====加
    addTimer() {},
    //时间列表=====减
    minusTimer() {},
  },
  mounted() {
    //用于控制头部导航栏的显示与隐藏
    PubSub.publish("jc_header_show", true);
    //this.getSignIn();
    this.getcarList();
    //this.getDatePoint();
    this.handelChange();
  },
  created() {
    //this.getClockingRecord();
    this.getRegionalDivision();
    var timer = new Date();

    var year = timer.getFullYear();
    var month = timer.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var days = timer.getDate();
    if (days < 10) {
      days = "0" + days;
    }
    console.log(year, month, days);

    this.startTime = year + "-" + month + "-" + days;
  },
};
</script>
<style >
.pickerTimer .el-input--prefix .el-input__inner {
  font-size: 12px !important;
}
.pickerTimer .el-input--suffix .el-input__inner {
  padding-right: 0px !important;
}
</style>
<style lang="scss" scoped>
.el-range-editor {
  width: 330px;
}

.aaa {
  color: rgb(13, 79, 194) !important;
  font-size: 18px;
}
.bbb {
  color: rgb(228, 8, 45) !important;
  font-size: 18px !important;
}
.center {
  //padding-top: 90px;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  .center_left {
    padding-top: 90px;
    //background-color: rgb(157, 145, 14);
    width: 500px;
    .center_tree {
      .carlist {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        height: 50px;
        border-bottom: 1px solid rgba(84, 28, 116, 0.4);
        cursor: pointer;
      }
      .carlist:hover {
        background-color: #a2ea8d;
        opacity: 0.5;
      }
    }
    .center_form {
      margin-top: 20px;
    }
  }
  .center_right {
    //background-color: rgb(192, 58, 89);
    flex: 1;
    padding-top: 90px;
    .main_header {
      ul {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        li {
          list-style: none;
          height: 80px;
          width: 240px;
          border: 1px solid wheat;
          font-size: 14px;
          padding: 10px;
          box-sizing: border-box;
          cursor: pointer;
        }
        .activeCss {
          background: skyblue;
        }
        li:first-child {
          width: 30px;
          line-height: 80px;
          text-align: center;
          padding: 0;
        }
        li:last-child {
          padding: 0;
          width: 30px;
          line-height: 80px;
          text-align: center;
        }
      }
    }
    .main_footer {
      display: flex;
      flex-wrap: wrap;
      //justify-content: space-between;
      //align-items: center;
      //width: 931px;
      //height: 735px;
      .info_item {
        width: 30%;
        height: 230px;
        border: 1px solid greenyellow;
        margin-top: 20px;
        display: flex;
        flex-wrap: nowrap;
        padding: 10px;
        margin-right: 30px;
        .img {
          flex: 1;
          display: block;
          overflow: hidden;
        }
        .details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 10px, 8px;
          .watchmanDetails {
            cursor: pointer;
          }
          .watchmanDetails:hover {
            color: rgb(29, 180, 16);
          }
        }
      }
    }
  }
}
</style>
