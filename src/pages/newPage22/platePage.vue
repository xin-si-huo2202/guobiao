<template>
  <div class="portrait-main">
    <div class="portrait-main-left">
      <div class="car-name-box">
        <el-select v-model="carSign" placeholder="">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="car-name">
          <el-input v-model="carNameSecond" placeholder="请输入车牌"></el-input>
        </div>
      </div>
      <div class="time-rang">
        <el-date-picker
          v-model="paramSel.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        -
        <el-date-picker
          v-model="paramSel.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </div>
      <div class="sel-btn" @click="getJiansuo">
        {{ this.isJSStatus ? "清除并返回" : "查询" }}
      </div>

      <div class="quyu">
        <el-input
          class="cars-search"
          v-model="pCarts"
          placeholder="请输入车牌号"
        ></el-input>
        <div
          class="list"
          v-for="(iteml, indexl) in quyuListShow"
          :key="indexl"
          @click="selectGatherCar(iteml.carNumber)"
          :class="paramSel.gatherCar == iteml.carNumber ? 'sel' : ''"
        >
          <div class="line">
            <div class="car">{{ iteml.carNumber }}</div>
          </div>
          <div class="line">
            <div class="part">{{ iteml.sysOrgCode }}</div>
            <div class="num">{{ iteml.count }}条</div>
          </div>
          <!-- <div class="btn" @click="videoLook(iteml.carNumber)">视频调度</div> -->
        </div>
      </div>
    </div>
    <div class="portrait-main-conent">
      <div class="right-title">
        <title-two>
          <p>共计：</p>
          <p class="num">{{ totalCount }}条</p>
        </title-two>
      </div>
      <div class="right-con" id="con-list">
        <template v-if="dataList && dataList.length > 0">
          <div v-for="(item, index) in dataList" :key="index" class="con-first">
            <!--<div class="time-box" @click="datasel(index, item)">-->
            <!--<div class="time">{{ item.time }}</div>-->
            <!--<div class="progress">-->
            <!-- <span>0</span>
                <div class="progress-line"></div> -->
            <!--<span>{{ item.count }}条</span>-->
            <!--</div>-->
            <!--<div class="icon">-->
            <!--<i
                  :class="
                    showListIndex == index && !isFlot
                      ? 'el-icon-arrow-up'
                      : 'el-icon-arrow-down'
                  "
                ></i>-->
            <!--</div>-->
            <!--</div>-->
            <div
              class="con-box aaa"
              v-show="showListIndex == index"
              :style="
                (isJSStatus && item.list && item.list.length > 30) ||
                (!isJSStatus && caijiList && caijiList.length > 30)
                  ? 'height: 420px;'
                  : ''
              "
              :id="'chepai-scroll' + index"
              @scroll="scrollEvent"
            >
              <template v-if="item.list && item.list.length > 0">
                <div
                  class="tab-item tab-item-one"
                  v-for="(itemL, indexL) in item.list"
                  :key="itemL.id"
                >
                  <div
                    class="tab-item-top"
                    @click="lookDetailPlate(itemL, indexL, item.list)"
                  >
                    <el-image
                      style="width: 140px; height: 60px; background: #eee"
                      :src="productionImage(itemL.smallImageUrl)"
                      fit="contain"
                    >
                    </el-image>
                    <div class="num-box">{{ itemL.carNumber }}</div>
                  </div>
                  <div class="portrait-desc">
                    <div class="desc-time">
                      <template
                        v-if="
                          itemL.createTime &&
                          itemL.createTime != '0000:00:00_00:00:00'
                        "
                      >
                        <div>
                          {{ itemL.createTime.substring(0, 10) }}
                        </div>
                        <div>{{ itemL.createTime.substring(11, 19) }}</div>
                      </template>
                      <div v-else>暂无时间</div>
                      <div class="desc-triangle-one"></div>
                    </div>
                    <div class="desc-rate" @click="suyuan(itemL.carNumber)">
                      轨迹追溯
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="tab-item tab-item-two"
                  v-for="(itemcj, indexcj) in caijiList"
                  :key="itemcj.id"
                >
                  <div class="tab-item-top">
                    <el-image
                      style="width: 130px; height: 60px; background: #eee"
                      :src="productionImage(itemcj.smallImageUrl)"
                      @click="lookDetailCarCaiji(itemcj, indexcj)"
                      fit="fill"
                    >
                    </el-image>
                    <div class="num-box">{{ itemcj.carNumber }}</div>
                  </div>
                  <div class="cp-btn">
                    <div class="cp-btn-weizhi" @click="rxWeiZhi(itemcj, 2)">
                      <i class="el-icon-location">位置</i>
                    </div>
                  </div>
                  <div class="time">
                    <template v-if="itemcj.createTime">
                      <div>
                        {{ itemcj.createTime.substring(0, 10) }}
                      </div>
                      <div>{{ itemcj.createTime.substring(11, 19) }}</div>
                    </template>
                    <div v-else>暂无时间</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- 分页 -->
          <div class="fenye">
            <el-pagination
            style="text-align: center"
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            hide-on-single-page
            @current-change="handleCurrentChange"
          >
          </el-pagination>
          </div>
          
        </template>
        <template v-else>
          <EmpMini />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import EmpMini from "@/components/empMini.vue";
import { startLoding, endLoding } from "@/request/loading.js";
import {
  groupByDateCount,
  getCarListAndCount,
  searchPlate,
} from "@/api/resetSecondPage.js";
import { gyxySubImageInfo } from "@/api/collectInfo.js";
export default {
  components: {
    TitleTwo,
    EmpMini,
  },
  activated() {
    PubSub.publish("nmhead");
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    PubSub.publish("nmhead");
    let nowDate = new Date();

    this.paramSel.endTime = this.rTime(nowDate);
    this.paramSel.startTime = this.rTime(
      new Date(nowDate.getTime() - 86400000 * 30)
    );
    this.getquyuList();
    this.getCaijiDataList();
    this.getAllRX();
  },
  data() {
    return {
      pageSize: 24,
      isJSStatus: false,
      totalCount: 0,
      options: [
        { value: "豫", label: "豫" },
        { value: "京", label: "京" },
        { value: "津", label: "津" },
        { value: "沪", label: "沪" },
        { value: "粤", label: "粤" },
        { value: "渝", label: "渝" },
        { value: "冀", label: "冀" },
        { value: "辽", label: "辽" },
        { value: "黑", label: "黑" },
        { value: "蒙", label: "蒙" },
        { value: "吉", label: "吉" },
        { value: "鲁", label: "鲁" },
        { value: "苏", label: "苏" },
        { value: "鄂", label: "鄂" },
        { value: "浙", label: "浙" },
        { value: "湘", label: "湘" },
        { value: "皖", label: "皖" },
        { value: "晋", label: "晋" },
        { value: "宁", label: "宁" },
        { value: "桂", label: "桂" },
        { value: "闽", label: "闽" },
        { value: "赣", label: "赣" },
        { value: "甘", label: "甘" },
        { value: "陕", label: "陕" },
        { value: "贵", label: "贵" },
        { value: "川", label: "川" },
        { value: "云", label: "云" },
        { value: "琼", label: "琼" },
        { value: "青", label: "青" },
        { value: "新", label: "新" },
        { value: "藏", label: "藏" },
        { value: "台", label: "台" },
        { value: "港", label: "港" },
        { value: "澳", label: "澳" },
        { value: "使", label: "使" },
        { value: "领", label: "领" },
        { value: "WJ", label: "WJ" },
      ],
      carSign: "豫",
      carNameSecond: "",
      paramSel: {
        searchCar: "",
        gatherCar: "",
        startTime: "",
        endTime: "",
        page: 1,
        size: 40,
        type: 2,
      },
      isFlot: false,
      showIndex: 1,
      showListIndex: 0,
      quyuList: [],
      quyuListShow: [],
      pCarts: "",

      dataList: {},
      caijiList: [],
      jiansuoWeizhiList: [],
      currentCaijiData: "",
      isscroll_chepai: false,
      have_next: true,
      total: null,
    };
  },
  watch: {
    pCarts: {
      handler(news, olds) {
        if (news && news.length == 0) {
          this.quyuListShow = this.quyuList;
        } else {
          this.quyuListShow = this.quyuList.filter((item) => {
            return item.carNumber.includes(news);
          });
        }
        console.log("aaaa", this.quyuListShow);
      },
    },
    quyuList: {
      handler(news, olds) {
        this.quyuListShow = news;
      },
    },
  },
  methods: {
    videoLook(carNumber) {
      this.$router.push({
        path: "/diaodu",
        query: {
          carNumber: carNumber,
        },
      });
    },
    scrollEvent() {
      var ts = this;
      if (this.currentCaijiData) {
        var el = document.querySelector("#chepai-scroll" + this.showListIndex);
        var offsetHeight = el.offsetHeight;

        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if (offsetHeight + scrollTop - scrollHeight >= -1) {
          // 需要执行的代码
          console.log("已滚动到底部", ts.isscroll_chepai, ts.have_next);
          if (!ts.isscroll_chepai && ts.have_next) {
            ts.isscroll_chepai = true;
            this.paramSel.page++;
            this.getChildDataList();
          }
        }
      }
    },
    lookAllWeizhi() {
      console.log("所有位置分布", this.jiansuoWeizhiList);
    },
    // 选择警车（采集）
    selectGatherCar(val) {
      // 判断车牌是否存在
      if (this.isJSStatus) return;
      this.paramSel.gatherCar = this.paramSel.gatherCar == val ? "" : val;
      console.log(val, "车牌");
      this.carNameSecond = val;
      this.getCaijiDataList();
    },
    // 检索按钮
    getJiansuo() {
      console.log("检索车牌号");
      this.paramSel.gatherCar = "";
      this.paramSel.startTime;
      this.paramSel.endTime;
      console.log(
        this.carNameSecond,
        "检索车牌号",
        this.paramSel.startTime,
        this.paramSel.endTime
      );
      if (
        !this.carNameSecond &&
        !this.paramSel.startTime &&
        !this.paramSel.endTime
      ) {
        this.$message({
          message: "请输入需要检索的数据条件",
          type: "warning",
        });
        return;
      }
      // 车牌号存在则清除，不存在则检索
      if (this.carNameSecond.length == 0 || this.isJSStatus) {
        this.quyuList = [];
        this.dataList = [];
        this.isJSStatus = false;
        this.getquyuList();
        this.getCaijiDataList();
        this.getAllRX();
      } else {
        if (!this.carNameSecond || this.carNameSecond.length == 0) {
          return this.$message({
            message: "请输入需要检索的警车信息",
            type: "warning",
          });
        }
        this.quyuList = [];
        this.dataList = [];
        this.paramSel.searchCar =
          this.carNameSecond.length == 0
            ? ""
            : this.carSign + this.carNameSecond;
        this.getJiansuoDataList();
        this.getAllRX();
      }
    },
    async getJiansuoDataList() {
      this.isJSStatus = true;
      let loading_lo;
      let param = new FormData();
      param.append("searchCar", this.paramSel.searchCar);
      param.append("gatherCar", this.paramSel.gatherCar);
      param.append("startTime", this.paramSel.startTime);
      param.append("date", "");
      param.append("endTime", this.paramSel.endTime);
      param.append("page", 1);
      param.append("size", this.paramSel.size);
      param.append("type", this.paramSel.type);
      try {
        loading_lo = startLoding(".right-con");
        let res = await searchPlate(param);
        let newList = [];
        if (res.result.deptCarList && res.result.deptCarList.length > 0)
          this.quyuList = res.result.deptCarList;
        if (res.result.restultDateMap && res.result.restultDateMap.length > 0) {
          this.dataList = res.result.restultDateMap;
          res.result.restultDateMap.forEach((item) => {
            if (item.list && item.list.length > 0)
              newList = [...newList, ...item.list];
          });
        }
        this.jiansuoWeizhiList = newList;
        this.totalCount = res.sum;
        this.showListIndex = 0;
        this.currentCaijiData = "";
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        this.quyuList = [];
        this.dataList = [];
        this.jiansuoWeizhiList = [];
        this.totalCount = 0;
        this.showListIndex = 0;
        this.currentCaijiData = "";
      }
    },
    // 获取采集信息
    async getCaijiDataList() {
      this.paramSel.searchCar = "";
      //this.carNameSecond = "";

      this.caijiList = [];
      this.dataList = [];
      this.totalCount = 0;
      this.showListIndex = 0;
      this.currentCaijiData = "";
      let loading_lo;
      let param = new FormData();
      param.append("searchCar", this.paramSel.searchCar);
      param.append("gatherCar", this.paramSel.gatherCar);
      param.append("startTime", this.paramSel.startTime);
      param.append("endTime", this.paramSel.endTime);
      param.append("page", 1);
      param.append("size", this.paramSel.size);
      param.append("type", this.paramSel.type);
      try {
        loading_lo = startLoding(".right-con");
        let res = await groupByDateCount(param);
        if (res.code == 200) {
          this.dataList = res.result;
          this.totalCount = res.sum;
          this.showListIndex = 0;
          this.currentCaijiData =
            res.result.length > 0 ? res.result[0].time : "";

          this.paramSel.page = 1;
          this.caijiList = [];
          this.getChildDataList();
          this.getAllRX();
          endLoding(loading_lo);
        }
      } catch (err) {
        endLoding(loading_lo);
        this.paramSel.page = 1;
        this.caijiList = [];
        this.dataList = [];
        this.totalCount = 0;
        this.showListIndex = 0;
        this.currentCaijiData = "";
      }
    },
    // 获取采集信息的子集
    async getChildDataList() {
      if (this.currentCaijiData.length == 0) {
        return;
      }
      let param = new FormData();
      param.append("searchCar", this.paramSel.searchCar);
      param.append("gatherCar", this.paramSel.gatherCar);
      // param.append("startTime", this.paramSel.startTime);
      param.append("date", this.currentCaijiData);
      // param.append("endTime", this.paramSel.endTime);
      param.append("page", this.paramSel.page);
      param.append("size", this.paramSel.size);
      param.append("type", this.paramSel.type);
      console.log(this.paramSel.type, "车牌检索类型");
      let res = await searchPlate(param);
      if (res.code == 200 && res.result.restultDateMap[0]) {
        let newL = res.result.restultDateMap[0].list;
        //this.caijiList = [...this.caijiList, ...newL];
        this.have_next = !(newL.length < this.paramSel.size);
      }
      this.isscroll_chepai = false;
      console.log("caijiList==", this.caijiList);
    },
    // 左侧区域信息
    async getquyuList() {
      let param = new FormData();
      param.append("type", 2);
      param.append("startTime", this.paramSel.startTime);
      param.append("endTime", this.paramSel.endTime);
      let res = await getCarListAndCount(param);
      if (res.code == 200) {
        this.quyuList = res.result;
      }
    },
    datasel(index, item) {
      this.isFlot = false;
      if (this.showListIndex == index) {
        if ($("#chepai-scroll" + index).css("display") == "none") {
          $("#chepai-scroll" + index).css("display", "flex");
        } else {
          this.isFlot = true;
          $("#chepai-scroll" + index).css("display", "none");
        }
      } else {
        this.showListIndex = index;
        if (!item.list) {
          this.currentCaijiData = this.dataList[this.showListIndex].time;
          //分页数据清零
          this.paramSel.page = 1;
          this.caijiList = [];
          this.getChildDataList();
        }
      }
    },
    lookDetailPlate(item, index, lists) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = lists.slice(0, 20);
        newIndex = index;
      } else {
        newList = lists.slice(index - 10, index + 10);
        newIndex = 10;
      }
      PubSub.publish("detail_box_type_show", 7);
      PubSub.publish("collect_detail_car_data", {
        item: item,
        listData: newList,
        index: newIndex,
      });
    },
    //轨迹查询
    suyuan(carNumber) {
      this.$router.push({
        path: "/Tracetracing",
        query: {
          plateNo: carNumber,
          timeStart: "",
          timeEnd: "",
          pageType: 2,
        },
      });
    },
    //车牌大图详情
    async lookDetailCarCaiji(item, index) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.caijiList.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.caijiList.slice(index - 10, index + 10);
        newIndex = 10;
      }
      PubSub.publish("detail_box_type_show", 7);
      PubSub.publish("collect_detail_car_data", {
        item: item,
        listData: newList,
        index: newIndex,
      });
      // }
    },
    //车牌-位置
    rxWeiZhi(data, type) {
      // debugger;
      data.type = type;
      sessionStorage.setItem("caijiweizhi_date", JSON.stringify(data));

      if (data.gpsLongitude) {
        this.$router.push("/");
      }
    },
    //获取数据库====全部车牌数据
    async getAllRX(val = 1) {
      //var param = new FormData();
      console.log(this.paramSel.startTime);
      console.log(this.paramSel.endTime);
      console.log(this.carNameSecond, "检索的车牌");
      try {
        var res = await gyxySubImageInfo({
          pageNo: val,
          pageSize: 24,
          type: 2,
          beginTime: this.paramSel.startTime,
          endTime: this.paramSel.endTime,
          sysOrgCode: "",
          policeCarNumber: this.carNameSecond ? this.carNameSecond : "",
        });
        console.log(res, "分页数据");
        this.total = res.result.total;
        //this.pageSize = res.result.size;
        console.log(this.total, "总数");
        console.log(this.caijiList, "总数据");
        this.caijiList = res.result.records;
      } catch (error) {
        this.$message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    //分页
    handleCurrentChange(val) {
      console.log("当前的页面=", val);
      this.getAllRX(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.portrait-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .portrait-main-left {
    position: fixed;
    top: 10%;
    left: 1%;
    width: 18.5%;
    height: calc(90% - 10px);
    z-index: 1;
    background-color: #99999933;
    padding: 10px;
    .car-name-box {
      display: flex;
      flex-direction: row;
      width: 100%;
      .car-name {
        width: calc(100% - 70px); /* no */
      }
    }
    .sel-btn {
      margin-top: 10px;
      width: 100%;
      height: 0.6rem;
      background: #97cdff;
      text-align: center;
      line-height: 0.6rem;
      color: #fff;
      background: url("../../assets/image/button-1.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .time-rang {
      margin-top: 10px;
      background-color: #fff;
      padding: 8px 4px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
    .quyu {
      margin-top: 10px;
      cursor: pointer;
      height: calc(100% - 200px);
      overflow-y: auto;
      .cars-search {
        position: sticky;
        font-size: 14px;
        display: inline-block;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 100;
      }
      .sel {
        background-color: #02befe !important;
      }
      .list {
        background-color: #fff;
        margin: 2px 4px;
        padding: 8px;
        position: relative;
        .line {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #746c6c;
          line-height: 22px;
          .car {
            color: #222222;
            font-weight: bold;
          }
        }
        .btn {
          position: absolute;
          top: 5px;
          right: 10px;
          background-color: #02befe;
          color: #fff;
          font-size: 12px;
          padding: 2px 4px;
        }
      }
      .quyu-first {
        color: #303133;
        .title {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #ebeef5;
          background-color: #fff;
          padding: 0 4px;
          font-size: 14px;
          line-height: 42px;
          position: relative;
          .icon {
            position: absolute;
            top: 0;
            right: 10px;
            i {
              font-size: 20px;
            }
          }
          .part2 {
            margin-left: 8px;
            font-size: 12px;
            .num1 {
              color: #1296db;
            }
          }
        }
      }
    }
  }
  .portrait-main-conent {
    position: fixed;
    top: 10%;
    right: 0;
    width: 80.4%;
    height: 90%;
    z-index: 2;
    .right-title {
      width: 100%;
      height: 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 0.25rem;
      box-sizing: border-box;
      .weizhi {
        margin-left: 80px;
        background-color: #00beff;
        color: #a4f8ff;
        padding: 4px 8px;
      }
    }
    .right-con::-webkit-scrollbar {
      display: none;
    }
    .right-con {
      // width: 100%;
      height: calc(100% - 50px);
      margin-left: 20px;
      overflow-y: scroll;
      padding: 10px;
      background-color: #99999933;
      .con-first {
        margin: 8px 0;
        .time-box {
          padding: 10px 15px;
          background-color: #02befe;
          font-size: 14px;
          color: #fff;
          font-weight: bold;
          //   line-height: 28px;
          display: flex;
          flex-direction: row;
          position: relative;
          .progress {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: 30px;

            .progress-line {
              width: 100px;
              height: 6px;
              // background-color: rgb(36, 134, 185);
              background-image: linear-gradient(
                270deg,
                rgb(108, 147, 253) 1%,
                #1c459e 100%
              );
              // background-image: linear-gradient(270deg, #F55 1%, #FF9C31 100%);
              margin: 0 10px;
              border-radius: 4px;
            }
          }
          .icon {
            position: absolute;
            top: 5px;
            right: 10px;
            i {
              font-size: 30px;
            }
          }
        }
        .con-box::-webkit-scrollbar {
          display: none;
        }
        .con-box {
          background-color: #fff;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding-bottom: 10px;
          overflow: auto;
          cursor: pointer;
          .tab-item-two {
            width: 140px; /*no*/
            height: 166px; /*no*/
            .tab-item-top {
              height: calc(100% - 72px); /*no*/
            }
          }
          .tab-item-one {
            width: 140px; /*no*/
            height: 130px; /*no*/
            .tab-item-top {
              height: calc(100% - 32px); /*no*/
            }
          }
          .tab-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: #fff;
            margin: 10px 0 0 10px; /*no*/
            text-align: center;
            .tab-item-top {
              width: 100%; /*no*/
              background: #e3f6f8;
              padding: 21px 0 11px 0; /*no*/
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              .num-box {
                font-size: 16px; /*no*/
              }
              // img {
              //   width: 130px; /*no*/
              //   height: 60px; /*no*/
              //   display: block;
              // }
            }
            .portrait-desc {
              width: 100%; /*no*/
              height: 36px; /*no*/
              box-sizing: border-box;
              display: flex;
              flex-direction: row;
              background-color: #02befe;
              color: #ffffff;
              border-left: 1px solid #78b6ee; /*no*/
              border-right: 1px solid #78b6ee; /*no*/
              border-bottom: 1px solid #78b6ee; /*no*/
              .desc-time {
                width: 65%;
                background-color: #fff;
                color: #00beff;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                line-height: 16px; /*no*/
                div {
                  font-size: 13px; /*no*/
                }
                .desc-triangle-one {
                  width: 0;
                  height: 0;
                  border-bottom: 36px solid #02befe; /*no*/
                  border-left: 12px solid transparent; /*no*/
                  position: absolute;
                  top: 0;
                  right: 0;
                }
              }
              .desc-rate {
                text-align: center;
                color: #fff;
                font-size: 12px; /*no*/
                line-height: 36px; /*no*/
                width: 35%; /*no*/
                height: 36px; /*no*/
              }
            }
            .cp-btn {
              height: 32px; /*no*/
              width: 100%;
              display: flex;
              flex-direction: row;
              box-sizing: border-box;
              // grid-template-columns: 40% 20% 40%;/*no*/
              border: 1px solid #02befe;
              .cp-btn-tir {
                width: 0;
                height: 0;
                border-right: 20px solid transparent; /*no*/
                border-top: 30px solid #02befe; /*no*/
              }
              .cp-btn-weizhi {
                width: 100%; /*no*/
                height: 30px; /*no*/
                background: #02befe;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                i {
                  font-size: 12px; /*no*/
                }
              }
              .cp-btn-jiansuo {
                width: 55px; /*no*/
                height: 30px; /*no*/
                display: flex;
                justify-content: center;
                align-items: center;
                color: #02befe;
              }
            }
            .time {
              height: 34px; /*no*/
              width: 100%;
              border-left: 1px solid #78b6ee; /*no*/
              border-right: 1px solid #78b6ee; /*no*/
              border-bottom: 1px solid #78b6ee; /*no*/
              box-sizing: border-box;
              color: #00beff;
              text-align: center;
              line-height: 16px; /*no*/
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              div {
                font-size: 12px; /*no*/
              }
            }
          }
        }
      }
      .aaa{
        height: 100%;
      }
      //.con-first:first-of-type{
      //  height: auto;
      //}
    }
  }
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 47%;
}
::v-deep .el-select .el-input {
  width: 70px; /* no */
}

::v-deep .el-input--prefix .el-input__inner {
  padding: 0 15px 0 10px;
  font-size: 12px;
}
::v-deep .el-input__prefix {
  font-size: 12px;
  left: 0;
  display: none;
}
::v-deep .el-input__suffix {
  font-size: 10px;
  right: 0;
}
</style>
