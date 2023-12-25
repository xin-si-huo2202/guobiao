<template>
  <div class="index_container padding-21">
    <Map />
    <!-- <div class="zhaiwei"></div> -->
    <div class="page-con">
      <div class="left-box">
        <div class="title-box">
          <title-two title="目标车辆"></title-two>
        </div>
        <div class="num-box bg_color_white">
          <div class="num-top">
            <i class="el-icon-caret-bottom" color="red"></i>
            <div style="text-align: center"  @click='moshi=1'>
              {{ selOneName }}{{ selTwoName }}
            </div>
            <el-input
              v-model="selThreeName"
              placeholder="请输入车牌号码"         
              @focus='moshi=2'
              clearable
            ></el-input>
            <div class="resetText" @click="reSetCarNum">重置</div>
          </div>
          <div class="num-foot">
            <div class="num-text">
              <div
                :class="selOneId == item.id ? 'sel-div' : ''"
                v-for="(item, index) in listOne"
                :key="index"
                @click="selOne(item)"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="line"></div>
            <div class="num-text">
              <div
                :class="selTwoId == item.id ? 'sel-div' : ''"
                v-for="(item, index) in listTwo"
                :key="index"
                @click="selTwo(item)"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="line"></div>
            <div class="num-text">
              <div
                v-for="(item, index) in listThree"
                :key="index"
                @click="selThree(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="title-box">
          <title-two title="采集日期"></title-two>
        </div>
        <div class="time-box bg_color_white">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetime"
            placeholder="开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-top: 10px"
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <div class="sel-btn" @click="searchOpera">查询</div>
        </div>
      </div>

      <div class="right-box">
        <plate :queryParams="queryParams" ref="carComponents"></plate>
      </div>
    </div>
  </div>
</template>

<script>
// import DatePicker from "vue2-datepicker";
// import "vue2-datepicker/index.css";
// import "vue2-datepicker/locale/zh-cn";
import Map from "../components/map.vue";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import Plate from "../components/CollectionRet/Plate.vue";

export default {
  name: "collectionRetCar",
  data() {
    return {
      moshi:1,
      listOne: [
        { name: "豫", id: 100 },
        { name: "京", id: 1 },
        { name: "津", id: 2 },
        { name: "沪", id: 3 },
        { name: "粤", id: 4 },
        { name: "渝", id: 5 },
        { name: "冀", id: 6 },
        { name: "辽", id: 7 },
        { name: "黑", id: 8 },
        { name: "蒙", id: 9 },
        { name: "吉", id: 10 },
        { name: "鲁", id: 11 },
        { name: "苏", id: 12 },
        { name: "鄂", id: 13 },
        { name: "浙", id: 14 },
        { name: "湘", id: 15 },
        { name: "皖", id: 16 },
        { name: "晋", id: 17 },
        { name: "宁", id: 18 },
        { name: "桂", id: 19 },
        { name: "闽", id: 20 },
        { name: "赣", id: 21 },
        { name: "甘", id: 22 },
        { name: "陕", id: 23 },
        { name: "贵", id: 24 },
        { name: "川", id: 25 },
        { name: "云", id: 26 },
        { name: "琼", id: 27 },
        { name: "青", id: 28 },
        { name: "新", id: 29 },
        { name: "藏", id: 30 },
        { name: "台", id: 31 },
        { name: "港", id: 32 },
        { name: "澳", id: 33 },
        { name: "使", id: 34 },
        { name: "领", id: 35 },
        { name: "WJ", id: 36 },
        // { name: "学", id: 37 },
        // { name: "警", id: 38 },
        // { name: "消", id: 39 },
        // { name: "挂", id: 40 },
      ],
      listTwo: [
        { name: "A", id: 1 },
        { name: "B", id: 2 },
        { name: "C", id: 3 },
        { name: "D", id: 4 },
        { name: "E", id: 5 },
        { name: "F", id: 6 },
        { name: "G", id: 7 },
        { name: "H", id: 8 },
        { name: "I", id: 111 },
        { name: "J", id: 9 },
        { name: "K", id: 10 },
        { name: "L", id: 11 },
        { name: "M", id: 12 },
        { name: "N", id: 13 },
        { name: "O", id: 112 },
        { name: "P", id: 14 },
        { name: "Q", id: 15 },
        { name: "R", id: 16 },
        { name: "S", id: 17 },
        { name: "T", id: 113 },
        { name: "U", id: 18 },
        { name: "V", id: 19 },
        { name: "W", id: 114 },
        { name: "X", id: 115 },
        { name: "Y", id: 116 },
        { name: "Z", id: 117 },
      ],
      listThree: [
        { name: "1", id: 1 },
        { name: "2", id: 2 },
        { name: "3", id: 3 },
        { name: "4", id: 4 },
        { name: "5", id: 5 },
        { name: "6", id: 6 },
        { name: "7", id: 7 },
        { name: "8", id: 8 },
        { name: "9", id: 9 },
        { name: "0", id: 10 },
      ],
      total: 0,
      queryParams: {
        CarNumber: "",
        area: "",
        startTime: "",
        endTime: "",
        pageNo: 1,
        pageSize: 150,
      },
      selOneId: 100,
      selTwoId: 16,
      selOneName: "豫",
      selTwoName: "R",
      selThreeName: "",
    };
  },
  destroyed() {},
  watch: {},
  methods: {
    searchOpera() {
      // if(selOneName.length>0){
      //   this.queryParams.carNum=selOneName+selTwoName
      // }
      this.queryParams.startTime = this.queryParams.startTime
        ? this.queryParams.startTime
        : "";
      this.queryParams.endTime = this.queryParams.endTime
        ? this.queryParams.endTime
        : "";
      this.queryParams.CarNumber = this.selThreeName;
      this.queryParams.area = this.selOneName + this.selTwoName;
      this.$refs.carComponents.getDataList(this.queryParams, 1);
    },
    reSetCarNum() {
      // this.selOneName = "";
      // this.selTwoName = "";
      this.selThreeName = "";
      this.selOneId = 0;
      this.selTwoId = 0;
    },
    selOne(val) {
      
      this.selOneId = val.id;
      this.selOneName = val.name;
    },
    selTwo(val) {
      if(this.moshi==1){
        this.selTwoId = val.id;
        this.selTwoName = val.name;
      }else{
        this.selThreeName += val.name;
      }
    
    },
    selThree(val) {
      this.moshi=2
      this.selThreeName += val.name;
    },
    xiba() {
      var yesterdsay = this.getNowTime(
        new Date(new Date().getTime() - 86400000 * 30)
      );
      var jkl = this.getNowTime(new Date());
      this.queryParams.startTime = yesterdsay;
      this.queryParams.endTime = jkl;
    },
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期

      var hour = now.getHours();
      var minu = now.getMinutes();
      var sec = now.getSeconds();
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");

      hour = hour.toString().padStart(2, "0");
      minu = minu.toString().padStart(2, "0");
      sec = sec.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
      // console.log(yesterdsay)
      // debugger
      return defaultDate;
    },
  },

  created() {},
  activated(){
  
    PubSub.publish("nmhead");
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    this.xiba();
    // setTimeout(()=>{
    //   this.searchOpera()
    // })
  },
  components: {
    TitleTwo,
    Plate,
    Map,
  },
};
</script>
<style lang='scss'>
.num-box {
  .el-input__inner {
    border: none;
  }
}
</style>
<style lang='scss' scoped>
.index_container {
  width: 100%;
  height: 100%;
  background: #fff;
  .zhaiwei {
    height: 9%;
  }
  .page-con {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 10%;
    left: 0;
    .left-box {
      position: fixed;
      top: 10%;
      left: 1%;
      width: 18.5%;
      height: 90%;
      display: flex;
      flex-direction: column;
      z-index: 1;
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
        height: 34px;
      }
      .title-box {
        width: 100%;
        height: 40px;
      }
      .time-box {
        width: 100%;
        text-align: center;
        // line-height: 50px;
        padding: 10px 0;
      }
      .sel-btn {
        margin-top: 130px;
        width: 100%;
        height: 48px;
        background: #97cdff;
        text-align: center;
        line-height: 48px;
        color: #fff;
        background-image: url("../assets/image/button-1.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      @media screen and (max-height: 1150px) {
        .sel-btn {
          margin-top: 30px;
        }
      }
      @media screen and (max-height: 950px) {
        .sel-btn {
          margin-top: 10px;
        }
      }
      .mx-datepicker {
        width: 100%;
      }
      .num-box {
        padding: 10px 0;
        .num-top {
          display: grid;
          grid-template-columns: 25px 40px auto 40px;
          align-items: center;
          border-top: 1px solid #00beff;
          border-left: 1px solid #00beff;
          border-right: 1px solid #00beff;
          background: #fff;
          padding:1px;/*no*/
          i {
            padding: 0 5px 0 10px;
          }
          .resetText {
            color: rgb(255, 60, 0);
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .num-foot {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.2) 100%
          );
          padding: 23px;
          border: 1px solid #00beff;
          .num-text {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            div {
              font-size: 14px;
              color: #333;
              padding: 4px;
            }
            .sel-div {
              color: #00beff;
            }
          }
          .line {
            width: 100%;
            height: 1px;
            background: #00beff;
          }
        }
      }
    }
    .right-box {
      position: fixed;
      top: 10%;
      right: 0;
      width: 80.4%;
      height: 90%;
      z-index: 2;
      .right-title {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        box-sizing: border-box;
        background: #a4f8ff;
        color: #999999;
        .num {
          color: #02befe;
          font-size: 12px;
        }
      }
      .right-con {
        width: 100%;
        height: calc(100% - 60px);

        margin: 10px 0;
      }
    }
  }
}
.border {
  border: 1px solid red;
  box-sizing: border-box;
}
</style>
