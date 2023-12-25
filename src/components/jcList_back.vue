<template>
  <div class="index_container depTree bg_color_white jcList">
    <div class="ui_box">
      <div class="sear_box">
        <el-input
          class="sear"
          size="small"
          placeholder="车牌号搜索"
          prefix-icon="el-icon-search"
          v-model="input2"
        >
        </el-input>

        <el-button class="sear_btn" type="warning" size="mini" @click="xx"
          >重置</el-button
        >

        <!-- <div class='btnu'>
                    <el-button class='sear_btn' type="primary" icon="el-icon-search" size='mini' @click='cpsear'>搜索</el-button>

                    <el-button class='sear_btn' type="warning" icon="el-icon-delete" size='mini'>重置</el-button>
                </div>-->
      </div>
      <!-- <div class="ui_con" v-infinite-scroll="loasd" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled'> -->
      <div class="ui_con">
        <div class="jkbox"></div>
        <template v-if="!isno">
          <template v-for="val in carList">
            <div
              v-if="
                val.nvrStatus &&
                (val.ptzStatus == 1 ||
                  val.flStatus == 1 ||
                  val.frStatus == 1 ||
                  val.lgStatus == 1 ||
                  val.rgStatus == 1 ||
                  val.fmlStatus == 1 ||
                  val.fmrStatus == 1 ||
                  val.lmgStatus == 1 ||
                  val.rmgStatus == 1)
              "
              :key="val.id"
              class="car_item"
              :class="val.ads"
            >
              <template v-if="!input2 || val.carNumber.indexOf(input2) != -1">
                <p @click="xiala(val)" @dblclick="new_bf_all(val)">
                  <img
                    v-if="val.xiala_bool"
                    class="xiala_tb"
                    src="../assets/image/x_arr.png"
                  />
                  <img
                    v-if="!val.xiala_bool"
                    class="xiala_tb"
                    src="../assets/image/r_arr.png"
                  />
                  <span>{{ val.sysOrgCode_dictText }}-{{ val.carNumber }}</span>
                </p>

                <ul v-if="val.xiala_bool">
                  <template
                    v-if="$route.path == '/diaodu' && val.adjInfomation"
                  >
                    <li @dblclick.stop="new_bf(0, '执法记录仪', val)">
                      执法记录仪
                    </li>
                  </template>

                  <li
                    v-if="val.ptzStatus"
                    @dblclick.stop="new_bf(1, '云台', val)"
                  >
                    云台
                  </li>
                  <li
                    v-if="val.flStatus"
                    @dblclick.stop="new_bf(2, '左前摄像机', val)"
                  >
                    左前摄像机
                  </li>
                  <!--<li v-if='val.fmlStatus' @dblclick.stop="new_bf(3,'左中前摄像机',val)">左中前摄像机</li>
                                    <li v-if='val.fmrStatus' @dblclick.stop="new_bf(4,'右中前摄像机',val)">右中前摄像机</li>-->
                  <li
                    v-if="val.frStatus"
                    @dblclick.stop="new_bf(5, '右前摄像机', val)"
                  >
                    右前摄像机
                  </li>
                  <li
                    v-if="val.lgStatus"
                    @dblclick.stop="new_bf(6, '左后摄像机', val)"
                  >
                    左后摄像机
                  </li>
                  <!--<li v-if='val.lmgStatus' @dblclick.stop="new_bf(7,'左中后摄像机',val)">左中后摄像机</li>
                                    <li v-if='val.rmgStatus' @dblclick.stop="new_bf(8,'右中后摄像机',val)">右中后摄像机</li>-->
                  <li
                    v-if="val.rgStatus"
                    @dblclick.stop="new_bf(9, '右后摄像机', val)"
                  >
                    右后摄像机
                  </li>
                </ul>
              </template>
            </div>
          </template>
        </template>

        <template v-if="isno">
          <EmpMini />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import {
  queryAllPoliceAndDev,
  selectDept,
  gyxyPcInformation,
} from "@/api/system.js";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "./empMini.vue";
import { v4 } from "uuid";
export default {
  name: "jcList",
  props: ["detid"],
  data() {
    return {
      carList: [],
      pagesize: 1,
      sysOrgCode: "",
      infinitedisabled: true,
      time: null,
      isno: true,
      input2: "",
    };
  },
  destroyed() {},
  watch: {
    detid: {
      handler(newss, old) {
        this.shitch_dep(newss);
      },

      immediate: false,
    },
    carList: {
      handler(newss, old) {
        var numjk = 0;
        newss.forEach((item, i) => {
          if (item.nvrStatus) {
            numjk += 1;
          }
        });

        if (numjk) {
          this.isno = false;
        } else {
          this.isno = true;
        }
      },

      immediate: true,

      deep: true,
    },
  },
  methods: {
    xx() {
      this.input2 = null;
    },
    async new_bf_all(val) {
      clearTimeout(this.time);

      if (this.$route.path != "/diaodu") {
        return;
      }
      // var vnb = [
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 1
      //     },
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 2
      //     },
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 3
      //     } ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 4
      //     }  ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 5
      //     }  ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 6
      //     }   ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 7
      //     } ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 8
      //     }   ,
      //     {
      //         cameraIndexCode: "",
      //         ezvizDirect: 0,
      //         gpuMode: 0,
      //         streamMode: 0,
      //         transMode: 1,
      //         wndId: 9
      //     }
      // ]
      try {
        this.new_bf(1, "", val);
        this.new_bf(2, "", val);
        // this.new_bf(3,'',val)
        // this.new_bf(4,'',val)
        this.new_bf(5, "", val);
        this.new_bf(6, "", val);
        // this.new_bf(7,'',val)
        // this.new_bf(8,'',val)
        this.new_bf(9, "", val);
        //--------------------------
        // var res = await  getCameraCode({channelNo:1,code:val.gbInfomation})

        // var bianhao = res.result

        // vnb[0].cameraIndexCode = bianhao

        // var res = await  getCameraCode({channelNo:2,code:val.gbInfomation})

        // var bianhao = res.result

        // vnb[1].cameraIndexCode = bianhao

        // vnb[2].cameraIndexCode = bianhao

        // vnb[3].cameraIndexCode = bianhao

        // vnb[4].cameraIndexCode = bianhao

        // vnb[5].cameraIndexCode = bianhao

        // vnb[6].cameraIndexCode = bianhao

        // vnb[7].cameraIndexCode = bianhao

        // vnb[8].cameraIndexCode = bianhao

        // window.parent.postMessage({
        //     message: 'getCrossHeight2',
        //     height:JSON.stringify(vnb),
        // }, '*');
      } catch (e) {
        // window.parent.postMessage({
        //     message: 'getCrossHeight2',
        //     error:`未获取到${val.carNumber}的nvr信息`,
        // }, '*');
        // Message({
        //     showClose: true,
        //     message:`未获取到${val.carNumber}的nvr信息`,
        //     type:'error',
        //     duration:2000
        // })
      }
    },
    new_bf(index, name, val) {
      if (index == 0) {
        var p = Object.assign({}, val, {
          change: v4(),
          ip: val.gbInfomation,
          index,
          name,
        });

        this.$emit("newBf", p);

        return;
      }
      var p = Object.assign({}, val, {
        change: v4(),
        ip: val.gbInfomation,
        index,
        name,
      });

      this.$emit("newBf", p);
    },

    xiala(val) {
      var that = this;
      // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
      clearTimeout(that.time);
      that.time = setTimeout(() => {
        // 写单击事件执行的逻辑代码
        this.carList.forEach((item, i) => {
          if (val.id == item.id) {
            this.$set(this.carList, i, {
              ...item,
              xiala_bool: !item.xiala_bool,
            });
          }
        });
      }, 300);
    },
    alls() {
      this.shitch_dep("");

      this.$emit("clear_jcid");
    },
    shitch_dep(sysOrgCode) {
      this.carList = [];
      this.pagesize = 1;

      this.sysOrgCode = sysOrgCode;

      this.ggp();
    },

    loasd() {
      this.pagesize = this.pagesize + 1;

      this.ggp();
    },
    fasong(data) {
      clearTimeout(this.time);
      // console.log(this.$route.path)
      // debugger
      if (this.$route.path == "/diaodu" || this.$route.path == "/diaodu2") {
        // if(data.ptzStatus==0){

        //     // Message({
        //     //     showClose: true,
        //     //     message:'警车不在线',
        //     //     type:'error',
        //     //     duration:2000
        //     // })
        //     return
        // }

        // data.change = v4()
        var p = Object.assign({}, data, {
          change: v4(),
          ip: data.gbInfomation,
          type: "all",
        });
        this.$emit("song", p);
      } else if (this.$route.path == "/collectInfo") {
        var p = Object.assign({}, data, {
          change: v4(),
          ip: data.gbInfomation,
        });
        this.$emit("song", p);
      } else if (this.$route.path == "/warningInfo") {
        var p = Object.assign({}, data, {
          change: v4(),
          ip: data.gbInfomation,
        });
        this.$emit("song", p);
      }
    },
    async ggp() {
      var loading_lo;
      try {
        // loading_lo=startLoding('.ui_box')
        this.infinitedisabled = true;
        var res = await gyxyPcInformation(this.sysOrgCode, this.pagesize);
        // endLoding(loading_lo)
        console.log(res, "============测试====================");
        //res.result.records.forEach((item) => {
        //  if (item.nvrStatus) {
        //    console.log(item);
        //  } else {
        //    console.log(false);
        //  }
        //});
        // this.infinitedisabled =false

        if (res && res.result && res.result.records.length != 0) {
          let arrCar = res.result.records;

          var L1 = [],
            L2 = [],
            L3 = [];
          arrCar.forEach((item, i) => {
            if (
              item.nvrStatus &&
              (item.ptzStatus == 1 ||
                item.flStatus == 1 ||
                item.frStatus == 1 ||
                item.lgStatus == 1 ||
                item.rgStatus == 1 ||
                item.fmlStatus == 1 ||
                item.fmrStatus == 1 ||
                item.lmgStatus == 1 ||
                item.rmgStatus == 1)
            ) {
              L1.push(item);
            }
          });

          // arrCar = L1

          this.carList = [...this.carList, ...arrCar];

          this.carList.forEach((item, i) => {
            if (item.carNumber == this.$route.query.name) {
              item.xiala_bool = true;

              item.ads = "acti";

              // $('.xichuan_box').appendTo($('.jkbox'))

              this.carList.unshift(this.carList.splice(i, 1)[0]);
            } else {
              item.xiala_bool = false;
            }
          });

          this.carList.forEach((item, i) => {
            item.xiala_bool = true;
          });

          this.$emit("addCar", this.carList);
        }
      } catch (err) {
        console.log(err);

        // endLoding(loading_lo)
        // this.infinitedisabled =false
        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
  },

  mounted() {
    PubSub.subscribe("jc_updata", (msg, data) => {
      this.carList.forEach((item, i) => {
        // debugger
        if (data.carNumber == item.carNumber) {
          item.pcStatus = data.pcStatus;
          item.boxStatus = data.boxStatus;
          item.nvrStatus = data.nvrStatus;
          item.ptzStatus = data.ptzStatus;
          item.flStatus = data.flStatus;
          item.frStatus = data.frStatus;
          item.lgStatus = data.lgStatus;
          item.rgStatus = data.rgStatus;
          item.fmlStatus = data.fmlStatus;
          item.fmrStatus = data.fmrStatus;
          item.lmgStatus = data.lmgStatus;
          item.rmgStatus = data.rmgStatus;
        }
      });
    });

    this.ggp();
  },
  components: {
    EmpMini,
  },
};
</script>

<style lang='scss' scoped>
.xiala_tb {
  width: 20px;
  margin-right: 2px;
}
.index_container {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  // overflow-y: scroll;
  // overflow-x: hidden;
}

.ui_box {
  width: 100%;
  height: 100%;

  overflow: hidden;
  // min-height: 100px;/*no*/
}

.ui_con {
  width: 100%;
  height: 100%;

  overflow-y: scroll;
}

.car_item {
  width: 100%;

  color: #78b6ee;
  padding: 6px 18px;
  box-sizing: border-box;
  cursor: pointer;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  &.acti {
    color: rgb(88 98 167);
    font-weight: bold;
    background: rgb(159 173 249 / 50%);
  }
  &.nysj_the {
    color: #000;
  }
  li {
    text-indent: 20px;
    list-style: none;
  }

  // li:focus{
  //     background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
  //     color:#2cc6ff ;
  // }
  // li:hover{
  //     background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
  //     color:#2cc6ff ;
  // }

  li:hover {
    font-weight: bold;
    background: #006be6;
    font-size: 18px; /*no*/
    color: #fff;
  }

  &:hover {
    p {
      font-weight: bold;
      background: #006be6;

      color: #fff;

      span {
        font-size: 18px; /*no*/
      }
      img {
        width: 17px; /*no*/
      }
    }
  }

  p:hover {
    font-weight: bold;
    background: #006be6;

    color: #fff;

    span {
      font-size: 18px; /*no*/
    }
    img {
      width: 17px; /*no*/
    }
  }

  p {
    display: flex;
    align-items: center;
  }
}
.sear_box {
  display: flex;
  // flex-direction: column;
  // align-items: center;
}
.sear {
  width: 75%;

  border: 1px solid #4696df;
  color: #4696df;
}
.btnu {
  width: 95%;

  display: flex;
  justify-content: space-between;
  margin-top: 5px; /*no*/
}
.sear_btn {
  width: 20%;
}
::v-deep ::-webkit-input-placeholder {
  color: #000;
  font-size: 15px;
}

::v-deep .el-input__inner {
  // background-color: rgb(0,62,118) !important;
  border: 1px solid #1296db;
  color: #000;
}
</style>
