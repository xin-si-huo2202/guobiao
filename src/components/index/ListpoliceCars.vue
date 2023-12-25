<template>
  <div class="ListpoliceCars bg_color_white">
    <div class="ListpoliceCars-top">
      <div class="search" :style="{ height: ischushi ? '48%' : '78%' }">
        <i class="el-icon-search search_ico"></i>

        <input
          placeholder="按回车查询(车牌号)"
          v-model="policeCarName"
          @keyup.enter="onSubmit"
        />
      </div>

      <div class="num">
        <span>在线：</span>
        <span class="zai">{{ onLineCount }}辆</span>
        <span>离线：</span>
        <span class="zai">{{ offLineCount }}辆</span>
      </div>
    </div>

    <div class="ListpoliceCars-bot" v-show="tabindex.ind == 1">
      <div v-show="carlist_inline.length != 0">
        <template v-for="(val, key) in carlist_inline">
     
            <div
              :key="val.id"
              class="jc_item"
              :class="val.active"
              @click="carclock_hand(val)"
            >
              <div>
                <p>{{ val.sysOrgCode }}</p>
                <p class="big-Typography">{{ val.carNumber }}</p>
              </div>

              <span>{{ val.updateTime }}</span>
            </div>
     
        </template>
      </div>

      <template v-if="carlist_inline.length == 0">
        <EmpMini :istarc="true" />
      </template>
    </div>

    <div class="ListpoliceCars-bot" v-show="tabindex.ind == 2">
      <div v-show="carlist_noline.length != 0">
        <template v-for="(val, key) in carlist_noline">
          <div :key="val.carId" class="jc_item" @click="carclock_hand(val)">
            <div>
              <p>{{ val.sysOrgCode }}</p>
              <p class="big-Typography">{{ val.carNumber }}</p>
            </div>

            <span>{{ val.updateTime }}</span>
          </div>
        </template>
      </div>

      <template v-if="carlist_noline.length == 0">
        <EmpMini />
      </template>
    </div>

    <div class="ListpoliceCars-bot" v-show="tabindex.ind == -1">
      <div v-show="carlist_allline.length != 0">
        <template v-for="(val, key) in carlist_allline">
          <div :key="val.carId" class="jc_item" @click="carclock_hand(val)">
            <div>
              <p>{{ val.sysOrgCode }}</p>
              <p class="big-Typography">{{ val.carNumber }}</p>
            </div>

            <span>{{ val.updateTime }}</span>
          </div>
        </template>
      </div>

      <template v-if="carlist_allline.length == 0">
        <EmpMini />
      </template>
    </div>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { queryAllPoliceAndDev, selectDept } from "@/api/system.js";
import { selectPoliceCarAndDepartment } from "@/api/index.js";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "../empMini.vue";
import PubSub from "pubsub-js";

export default {
  name: "ListpoliceCars",
  props: ["tabindex", "ischushi"],
  data() {
    return {
      carlist_inline: [],
      carlist_noline: [],
      carlist_allline: [],
      offLineCount: 0,
      onLineCount: 0,
      policeCarName: "",
      mqtt: null,
    };
  },
  destroyed() {},
  watch: {
    tabindex: {
      handler(newss, old) {
        // console.log("this.policeCarName",this.policeCarName)
        // if(!this.policeCarName||this.policeCarName.length==0){
        //      this.ggp()
        // }
        //信息切换
        console.log("信息切换", newss);
        let list = [];
        if (newss.ind == 1) {
          list = this.carlist_inline;
        } else if (newss.ind == 2) {
          list = this.carlist_noline;
        } else {
          list = this.carlist_allline;
        }
        this.$emit("addCar", list);
      },
      immediate: false,
    },
  },
  methods: {
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },

    onSubmit(dat) {
      this.ggp();
    },
    carclock_hand(data) {
      this.carlist_inline.forEach((item, i) => {
        if (data.carId == item.carId) {
          this.$set(item, "active", "active");
          // item.active='active'
        } else {
          this.$set(item, "active", "");
          // item.active=''
        }
      });

      // let list = [];
      // if (this.tabindex == 1) {
      //   list = this.carlist_inline;
      // } else if (this.tabindex == 2) {
      //   list = this.carlist_noline;
      // } else {
      //   list = this.carlist_allline;
      // }
      // this.$emit("addCar", list);


      

      this.$emit("dingweivideo", data);
    },
    async ggp() {
      var loading_lo;
      try {
        loading_lo = startLoding(".ListpoliceCars");
        var res = await selectPoliceCarAndDepartment({
          policeCarName: this.policeCarName,
        });
        endLoding(loading_lo);

        if (res && res.result) {
          if (res.result.onLineCar) {
            this.carlist_inline = res.result.onLineCar;

            this.carlist_inline.forEach((item, i) => {
              item.active = "";
            });
          }

          if (res.result.onLineCar) {
            this.carlist_noline = res.result.offLine;

            this.carlist_noline.forEach((item, i) => {
              item.active = "";
            });
          }

          var hebing = this.carlist_inline.concat(this.carlist_noline);

          this.carlist_allline = hebing;
          this.$emit("addCar", hebing);

          this.offLineCount = res.result.offLineCount;

          this.onLineCount = res.result.onLineCount;
        }
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
    },
  },

  mounted() {
    PubSub.subscribe("jc_updata", (msg, data) => {
      var inline_isyou = 0;
      var noline_isyou = 0;
      this.carlist_inline.forEach((item, i) => {
        // debugger
        if (data.carNumber == item.carNumber) {
          inline_isyou = 1;

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
      this.carlist_noline.forEach((item, i) => {
        if (data.carNumber == item.carNumber) {
          noline_isyou = 1;

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

      if (data.pcStatus == 1 && data.boxStatus == 1 && data.nvrStatus == 1) {
        if (!inline_isyou) {
          this.carlist_noline.forEach((item, i) => {
            if (data.carNumber == item.carNumber) {
              this.carlist_inline = [item, ...this.carlist_inline];
              this.$delete(this.carlist_noline, i);

              this.onLineCount = this.onLineCount + 1;

              if (this.offLineCount != 0) {
                this.offLineCount = this.offLineCount - 1;
              }
            }
          });
        }
      } else {
        if (!noline_isyou) {
          this.carlist_inline.forEach((item, i) => {
            if (data.carNumber == item.carNumber) {
              this.carlist_noline = [item, ...this.carlist_noline];
              this.$delete(this.carlist_inline, i);

              this.offLineCount = this.offLineCount + 1;

              if (this.onLineCount != 0) {
                this.onLineCount = this.onLineCount - 1;
              }
            }
          });
        }
      }
    });

    this.ggp();
  },
  components: {
    EmpMini,
  },
};
</script>

<style lang='scss' scoped>
.content-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.content-top {
  display: flex;
  align-items: center;
  span {
    margin-right: 5px;
  }
}
.online-icon {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: #13d913;
  margin-right: 5px;
}
.offineline-icon {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: red;
  margin-right: 5px;
}
.ListpoliceCars {
  width: 100%;
  height: 100%;
}

.ListpoliceCars-top {
  width: 100%;
  height: 8%;
  box-sizing: border-box;
  border-bottom: 1px solid #cccccc; /*no*/
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ListpoliceCars-bot {
  width: 100%;
  height: 92%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
}

.search {
  border: 1px solid #00beff; /*no*/
  width: 200px;
  height: 78%;
  display: flex;
  align-items: center;
  margin-left: 12px;
  color: #746c6c;
  .search_ico {
    margin-left: 6px;
  }

  input {
    width: 158px;
    border: none;
    background: none;
    outline: none;
    margin-left: 2px;
  }
}
.num {
  span {
    color: #746c6c;

    margin-left: 4px;
  }

  span.zai {
    color: #00beff;
  }

  margin-right: 12px;
}
.jc_item {
  border-bottom: 1px solid #cccccc; /*no*/
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #746c6c;
  cursor:pointer;
  .big-Typography {
    color: #222222;
    font-weight: bold;
    margin-top: 10px;
  }
  &:focus {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0));

    .big-Typography {
      color: #00beff;
    }
  }

  &:hover {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0));

    .big-Typography {
      color: #00beff;
    }
  }
  // &.active{

  //     background:linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0)) ;

  //     .big-Typography{
  //         color: #00beff;
  //     }
  // }
}
</style>
