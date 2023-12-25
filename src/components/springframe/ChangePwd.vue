<template>
  <div class="page">
    <div class="page-bk-box border">
      <div class="con">
        <el-input v-model="oldPwd" placeholder="旧密码"></el-input>
        <br />
        <br />
        <br />
        <br />
        <el-input v-model="newPwd" placeholder="新密码"></el-input>
        <br />
        <br />
        <el-input v-model="newPwdAgain" placeholder="确认新密码"></el-input>
      </div>
      <div class="btn-box">
        <div class="btn-all btn-ok" @click="finish">确认</div>
        <div class="btn-all btn-cancel" @click="cancel">取消</div>
      </div>
      <div class="text">更新密码</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: 1,
      textarea: "",
      oldPwd:"",
      newPwd:"",
      newPwdAgain:"",
    };
  },
  methods: {
    finish() {},
    cancel() {},
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #999;
  opacity: 0.9;
  .page-bk-box {
    width: 637px;
    height: 354px;
    background-image: url("../../assets/image/msg-2.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 90px 0 48px 0;
    position: relative;
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