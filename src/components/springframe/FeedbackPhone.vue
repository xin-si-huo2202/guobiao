<template>
  <div class="page">
    <div class="page-bk-box border famk">
      <div class="con">
        <!-- <div class="con-type">
          <el-radio v-model="radio" label="1">正常人像</el-radio>
          <el-radio v-model="radio" label="2">涉嫌人像</el-radio>
        </div> -->
        <div class="con-result">
          <div class="con-text">详细反馈结果</div>
          <div class="line"></div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn-all btn-ok" @click="fanjuisdss">确认</div>
        <div class="btn-all btn-cancel" @click="cancel">取消</div>
      </div>
      <div class="text">反馈结果</div>
    </div>
  </div>
</template>
<script>
import {
  gyxyFaceWarning_editResponse,
  gyxyPlateWarning_editResponse,
} from "@/api/warningInfo.js";
import { startLoding, endLoding } from "@/request/loading.js";
import { Message, Loading } from "element-ui";
import PubSub from "pubsub-js";
export default {
  props: ["fankui_data"],
  data() {
    return {
      radio: 1,
      textarea: "",
    };
  },
  methods: {
    async fanjuisdss() {
      var loading_lo;
      var res;
      if (this.textarea.length == 0) {
        Message({
          showClose: true,
          message: "请输入内容",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      try {
        loading_lo = startLoding(".famk");

        //if(this.fankui_data.isrx){
        //  res = await gyxyFaceWarning_editResponse({id:this.fankui_data.id,response:this.textarea})
        //}else {
        //  res = await gyxyPlateWarning_editResponse({id:this.fankui_data.id,response:this.textarea})
        //}
        res = await putSerialNumberWarning({
          createBy: this.fankui_data.createBy,
          createTime: this.fankui_data.createTime,
          dealName: this.fankui_data.dealName,
          fromCar: this.fankui_data.fromCar,
          id: this.fankui_data.id,
          isRead: this.fankui_data.isRead,
          isResponse: this.fankui_data.isResponse,
          latitude: this.fankui_data.latitude,
          longitude: this.fankui_data.longitude,
          plateType: this.fankui_data.plateType,
          represent: this.fankui_data.represent,
          response: this.textarea,
          serial: this.fankui_data.serial,
          sysOrgCode: this.fankui_data.sysOrgCode,
          updateBy: this.fankui_data.updateBy,
          updateTime: this.fankui_data.updateTime,
        });

        endLoding(loading_lo);

        if (res.result.indexOf("成功") != -1) {
          this.$emit("yincang_fankui");

          Message({
            showClose: true,
            message: "反馈成功",
            type: "success",
            duration: 2000,
          });

          PubSub.publish("fk_success", this.fankui_data);
        } else {
          Message({
            showClose: true,
            message: "反馈失败",
            type: "error",
            duration: 2000,
          });
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
    finish() {
      this.fanjuisdss();
    },
    cancel() {
      this.$emit("yincang_fankui");
    },
  },
};
</script>
<style lang="scss">
.con-result {
  .el-textarea__inner {
    border: 1px solid #00beff;
  }
}
</style>

<style lang="scss" scoped>
.page {
  // width: 100%;
  // height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // box-sizing: border-box;
  // background: #999;
  // opacity: 0.9;
  .page-bk-box {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-top: -177px;
    margin-left: -318.5px;
    width: 637px;
    height: 354px;
    background-image: url("../../assets/image/msg.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 90px 0 48px 0;
    z-index: 3;
    .con {
      width: 90%;
      .con-type {
        width: 100%;
        height: 52px;
        line-height: 52px;
        padding-left: 25px;
        background: linear-gradient(
          90deg,
          #dddddd 0%,
          rgba(221, 221, 221, 0) 100%
        );
      }
      .con-result {
        margin-top: 21px;
        color: #00beff;
        .con-text {
          margin-left: 5px;
        }
        .line {
          width: 100%;
          height: 2px;
          margin: 10px 0;
          background: linear-gradient(
            90deg,
            #00beff 0%,
            rgba(221, 221, 221, 0) 100%
          );
        }
      }
    }
    .text {
      position: absolute;
      top: 10px;
      left: 20px;
      color: #fff;
    }
    .btn-box {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      padding-right: 100px;
      .btn-all {
        width: 160px;
        height: 38px;
        text-align: center;
        line-height: 38px;
      }
      .btn-ok {
        background: #00beff;
        border: 2px solid #00beff;
        color: #fff;
        margin-right: 20px;
      }
      .btn-cancel {
        border: 2px solid #00beff;
        background: #fff;
        color: #00beff;
      }
    }
  }
}
</style>