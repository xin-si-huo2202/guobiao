<template>
  <div class="login-page">
    <div class="left">
      <div class="leftImg"></div>
    </div>
    <div class="right">
      <div>
        <div class="title">智慧警车大数据平台</div>
        <el-form
          :model="item"
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class="ms-content"
        >
          <el-form-item prop="userName">
            <el-input v-model="item.userName" placeholder="请输入用户账户">
              <i slot="prepend" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              show-password
              v-model="item.password"
              @keyup.enter.native="submitForm('ruleForm')"
            >
              <i slot="prepend" class="el-icon-lock"></i>
            </el-input>
          </el-form-item>

          <!--<el-checkbox style="margin: 0px 0px 20px" v-model="item.rememberMe"
            >记住密码
          </el-checkbox>-->
          <div
            class="login-btn"
            @click.prevent="submitForm('ruleForm')"
            :loading="loading"
          >
            <!-- <div
              class="zd-btn"
              @click.native.prevent="submitForm('ruleForm')"
              :loading="loading"
            > -->
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
            <!-- </div> -->
          </div>
        </el-form>
      </div>
    </div>
    <div class="text">
      技术支持 北京广亿兴业科技发展有限公司 {{ version }}
      <a href="/cro102.exe">浏览器下载</a>
    </div>
  </div>
</template>
<script>
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login.js";

import { selectDept, getRegionName } from "@/api/system.js";
import { list } from "@/api/login.js";
import PubSub from "pubsub-js";
import { Message, Loading } from "element-ui";
export default {
  data: function () {
    return {
      version: "",
      //账号
      item: {
        userName: "",
        password: "",
        rememberMe: true,
      },
      loading: false,
      //账号为空
      ruleForm: {
        userName: "",
        userPassword: "",
      },
      ruleOptions: [],
      //数据为空
      rules: {
        userName: [
          { required: true, message: "请输入用户账户", trigger: "blur" },
          {
            min: 2,
            max: 18,
            message: "长度在 2 到 18 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      Paroptions: [],
      websock: null,
      encryptRSA: "",
      ischromevideo: false,
      chromevideo: "",
      pcId: "",
    };
  },
  created() {
    var chromevideo = this.getQueryVariable("chromevideo");
    var pcId = this.getQueryVariable("pcid");
    var userName = this.getQueryVariable("username");
    var password = this.getQueryVariable("password");
    // alert(decodeURI(pcId ))
    // alert(chromevideo)
    if (chromevideo) {
      this.ischromevideo = true;
      this.chromevideo = chromevideo;
      this.pcId = decodeURI(pcId);
      //做自动登录并跳转到视频页
      this.item = {
        userName,
        password,
        rememberMe: true,
      };

      this.submitForm("ruleForm");
    }
    this.getCookie();
    this.getVersion();
  },
  mounted() {
    var islogin_tiao = sessionStorage.islogin_tiao;

    if (islogin_tiao == 1) {
      sessionStorage.removeItem("islogin_tiao");
      location.reload();
    }
    PubSub.publish("jc_header_show", false);
    // this.loig();
  },
  destroyed() {},
  methods: {
    async getVersion() {
      let that = this;
      let params = {};
      params.pageSize = 1;
      params.pageNo = 1;
      let res = await list(params);
      console.log(res,"dadad");
      if (res && res.result) {
        that.version = res.result.records[0].versionNumber;
        sessionStorage.setItem(
          "versionNumber",
          res.result.records[0].versionNumber
        );
        sessionStorage.setItem(
          "versionDescription",
          res.result.records[0].versionDescription
        );
      }
    },
    async loig() {
      var that = this;
      that.loading = true;
      try {
        const res = await sysLogin({
          captcha: "",
          checkKey: "",
          password: that.item.password,
          username: that.item.userName,
        });
        if (res && res.result) {
          that.loading = false;
          console.log("信息展示当颠倒", res.result.userInfo);
          sessionStorage.setItem("JC_Token", res.result.token);
          localStorage.setItem("JC_Token", res.result.token);
          sessionStorage.setItem(
            "UserInfo",
            JSON.stringify(res.result.userInfo)
          );
          sessionStorage.setItem(
            "userinfo",
            JSON.stringify(res.result.userInfo)
          );

          if (res.result.departs.length != 0) {
            sessionStorage.setItem("syscode", res.result.departs[0].id);
          }

          if (
            res.result.sysAllDictItems &&
            res.result.sysAllDictItems.MSN &&
            res.result.sysAllDictItems.MSN.length != 0
          ) {
            sessionStorage.setItem(
              "isshow_chat",
              JSON.stringify(res.result.sysAllDictItems.MSN[0])
            );
            PubSub.publish(
              "is_chat_show",
              res.result.sysAllDictItems.MSN[0].value
            );
          }
          var res2 = that.getgyxySyMap();

          var name = await getRegionName();
          sessionStorage.setItem("xianming", name.result);
        }
        that.loading = false;
      } catch (err) {
        that.loading = false;
        // Message({
        //   showClose: true,
        //   message: "网络异常",
        //   type: "error",
        //   duration: 2000,
        // });
      }
    },
    async getgyxySyMap() {
      // var loading_lo;

      try {
        // loading_lo = startLoding(".rx_lo");

        // this.infinitedisabled_rx = true;

        var res = await gyxySyMap();
        console.log(res, "登录时要存储的坐标");
        // endLoding(loading_lo);

        // this.infinitedisabled_rx = false;
        if (res && res.result) {
          // mapLatitude: 12124.1111111111
          // mapLongitude: 123.00000000000001

          sessionStorage.setItem("mapLongitude", res.result.mapLongitude);

          sessionStorage.setItem("mapLatitude", res.result.mapLatitude);

          this.$router.push("/");
          PubSub.publish("jc_header_show", true);
        }
      } catch (err) {
        console.log(err, "dscdascsda");
        // endLoding(loading_lo);
        // this.infinitedisabled_rx=false

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    iemoshi() {
      this.$alert(
        '<strong>允许activex插件<br/><img src="/ieio.png" style="width:100%"></strong>',
        "提示",
        {
          dangerouslyUseHTMLString: true,
        }
      );
    },
    guge() {
      this.$alert(
        '<strong>下载控件包，安装完成后，点击IE tab即可，建议存书签方便下次使用<br/><img src="/guge.png"></strong>',
        "提示",
        {
          dangerouslyUseHTMLString: true,
        }
      );
    },
    sanliu() {
      this.$alert(
        '<strong>使用ie兼容模式<br/><img src="/360.png"></strong>',
        "提示",
        {
          dangerouslyUseHTMLString: true,
        }
      );
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      // alert(window.location.search)
      var vars = query.split("%40");
      // alert(JSON.stringify(vars))
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("%3D");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date();
      //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "userName") {
            this.item.userName = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "userPwd") {
            this.item.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function () {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
    //登录
    async submitForm(formName) {
      if (this.ischromevideo) {
        this.submit_chu();
      } else {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.loig();
          }
        });
      }
    },
    async submit_chu() {
      this.loading = true;
      if (this.item.rememberMe) {
        //console.log(this.item.rememberMe,"+++++++++++++=++++++++++++++");
        //修改cookie时长
        this.setCookie(this.item.userName, this.item.password, 30);
      } else {
        this.clearCookie();
      }
      let tm = new Date().getTime();
      console.log("tm", tm);
      const RSA = await getEncryption(tm);
      const jse = new this.$jsEncrypt(); //创建
      let publicKey = RSA.sk;
      jse.setPublicKey(publicKey); //配置公钥，一般都为后端传输过来的
      let userName = this.item.userName;
      let tm_ = RSA.tm_;

      let pwd = jse.encrypt(this.item.password);

      if (RSA.code == 200) {
        setTimeout(() => {
          this.loading = false;
        }, 1500);
        await ongo(userName, pwd, tm_).then(async (res) => {
          this.$store.dispatch("SETMENU", res.data.powers);
          sessionStorage.setItem("JC_Token", res.data.token);
          console.log(res, "login");
          sessionStorage.setItem("state", res.data.state); //存储一键已读权限
          this.$store.dispatch("SETUSER", res.data.userName);
          this.$store.dispatch("SETJSTXPWD", res.data.jstxUserPwd);
          sessionStorage.setItem("USERID", res.data.userId);

          sessionStorage.setItem("userDeptId", res.data.userDeptId);

          if (!sessionStorage.QUYULIST && this.$sj_bs == "nysj") {
            console.log("QUYU初始化");
            let res = await selectDept();
            let das = res.data.rows;
            das.forEach((item, i) => {
              if (item.superId == "0") {
                item.s_children = item.children;
              }
            });
            sessionStorage.setItem("QUYULIST", JSON.stringify(das));

            this.$store.dispatch("SETQUYU", das[0]);
          }

          if (this.ischromevideo) {
            this.$router.push({
              path: "/examine/map/Video",
              query: {
                id: this.chromevideo,
              },
            });
            sessionStorage.setItem("pcId", this.pcId);
          } else {
            this.$router.push("/");
          }
        });
      }
    },
    //判断
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .left {
    width: 72.9%;
    height: 100%;
    background: #99e5ff;
    display: flex;
    justify-content: center;
    align-items: center;
    .leftImg {
      width: 848px;
      height: 665px;
      background-image: url("../assets/image/login.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .right {
    width: 27.1%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #222222;
      margin-bottom: 30px;
      font-family: "标题";
    }
    .login-btn {
      width: 100%;
      height: 48px;
      background: #00beff;
      margin: 0 !important;
      /* background: orange; */
      border: 0;
      color: #fff;
      line-height: 48px;
      text-align: center;
    }
    .el-form.ms-content {
      .el-form-item.is-required {
        ::v-deep > .el-form-item__content {
          .el-input.el-input-group.el-input-group--prepend {
            .el-input-group__prepend,
            .el-input__inner {
              border-radius: 0px;
              border: 1px solid #49c0fd;
              background: #fff;
            }
            .el-input-group__prepend {
              color: #49c0fd;
              padding: 0 15px;
              border-right: none;
            }
          }
        }
      }
    }
  }
  .text {
    position: fixed;
    bottom: 58px;
    text-align: center;
    width: 100%;
    color: #222222;
    font-size: 14px;
  }
}
</style>