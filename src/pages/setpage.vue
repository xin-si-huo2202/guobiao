<template>
  <div class="index_container padding-21">
    <div class="zhaiwei"></div>
    <div class="page-con">
      <div class="left-box">
        <div class="title-box">
          <title-two title="用户信息"></title-two>
        </div>
        <div class="con-box grid-one">
          <div class="head-img">
            <img v-if="headImg && headImg.length > 0" :src="headImg" />
            <img v-else src="../assets/image/user.png" />
          </div>
          <div class="con-text flex-one">
            <div>{{ userName }}</div>
            <div>{{ depName }}</div>
            <div class="changepwd-btn" @click="loginOut">退出登录</div>
          </div>
        </div>
        <div class="title-box">
          <title-two title="平台信息"></title-two>
        </div>
        <div class="con-box">
          <div class="con-box-div">平台：{{ $source_name }}</div>
          <div class="con-box-div">技术支持：北京广亿兴业科技发展有限公司</div>
          <div class="con-box-div">当前版本：{{ version }}</div>
          <div class="con-box-div">描述：{{ miaoshu }}</div>
        </div>

        <a class="changepwd-btn2" :href="hturl" target="_blank"
          >登录后台管理系统</a
        >
      </div>
      <div class="right-box">
        <div class="title-box">
          <title-two title="用户配置"></title-two>
        </div>
        <div class="con">
          <!-- <div class="title">使用主题</div>
          <div class="line"></div>
          <div class="content">
            <div class="theme">
              <div class="theme-box theme-box-one">
                <i class="el-icon-check" v-if="themeSet == 1"></i>
              </div>
              <div
                class="theme-text"
                :class="themeSet == 1 ? 'text-one-sel' : ''"
              >
                浅蓝
              </div>
            </div>
            <div class="theme">
              <div class="theme-box theme-box-two">
                <i class="el-icon-check" v-if="themeSet == 2"></i>
              </div>
              <div
                class="theme-text"
                :class="themeSet == 2 ? 'text-two-sel' : ''"
              >
                深蓝
              </div>
            </div>
            <div class="theme">
              <div class="theme-box theme-box-three">
                <i class="el-icon-check" v-if="themeSet == 3"></i>
              </div>
              <div
                class="theme-text"
                :class="themeSet == 3 ? 'text-three-sel' : ''"
              >
                暗黑
              </div>
            </div>
          </div> -->
          <div class="title">综合预览视频窗格配置</div>
          <div class="line"></div>
          <div class="content">
            <el-radio-group v-model="videoSet">
              <el-radio :label="1">1格</el-radio>
              <el-radio :label="2">2格</el-radio>
              <el-radio :label="3">3格</el-radio>
              <el-radio :label="4">4格</el-radio>
              <el-radio :label="5">5格</el-radio>
              <el-radio :label="6">6格</el-radio>
            </el-radio-group>
          </div>
          <div class="title">实时预警解除时长</div>
          <div class="line"></div>
          <div class="content">
            <el-radio-group v-model="yjSet">
              <el-radio :label="1">5分钟</el-radio>
              <el-radio :label="2">10分钟</el-radio>
              <el-radio :label="3">30分钟</el-radio>
              <el-radio :label="4">1小时</el-radio>
              <el-radio :label="5">2小时</el-radio>
              <el-radio :label="6">无限制</el-radio>
            </el-radio-group>
          </div>

          <br />
          <br />
          <br />
          <br />

          <div class="line"></div>
          <div class="flex-two">
            <div class="btn-all btn-set" @click="saveSet">保存配置</div>
            <!--<div class="btn-all btn-go" @click="go_quyuhuafen">打卡点设置</div>-->
            <div class="btn-all btn-cancle" @click="cancleSet">取消</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import { list } from "@/api/login.js";
import { ver } from "@/api/system.js";

export default {
  components: {
    TitleTwo,
  },
  data() {
    return {
      videoSet: 0,
      yjSet: 0,
      themeSet: 1,
      headImg: "",
      userName: "",
      depName: "",
      version: "",
      miaoshu: "",
      // hturl:this.$env_bs=='development'?'http://192.168.2.202:3001':`http://${sessionStorage.hturl}:20000`
      hturl: "",
    };
  },
  created() {
    var host = document.domain;

    this.hturl = "http://" + host + ":20000";

    PubSub.publish("jc_header_show", true);
    let UserInfo = sessionStorage.getItem("UserInfo");
    if (UserInfo) {
      UserInfo = JSON.parse(UserInfo);
    } else {
      this.$router.push("/login");
    }
    this.headImg = UserInfo.avatar;
    this.userName = UserInfo.username;
    this.depName = UserInfo.post;
    this.getVersion();
  },
  methods: {
    //区域划分按钮  点击事件
    go_quyuhuafen() {
      console.log("区域划分按钮");
      this.$router.push({ path: "mapbian" });
    },
    async getVersion() {
      let that = this;
      let versionNumber = sessionStorage.getItem("versionNumber");
      let versionDescription = sessionStorage.getItem("versionDescription");
      if (versionNumber && versionNumber.length > 0) {
        that.version = versionNumber;
        that.miaoshu = this.delHtmlTag(versionDescription);
      } else {
        let params = {};
        params.pageSize = 1;
        params.pageNo = 1;
        let res = await list(params);
        if (res && res.result) {
          that.version = res.result.records[0].versionNumber;
          that.miaoshu = this.delHtmlTag(
            res.result.records[0].versionDescription
          );
          sessionStorage.setItem(
            "versionNumber",
            res.result.records[0].versionNumber
          );
          sessionStorage.setItem(
            "versionDescription",
            res.result.records[0].versionDescription
          );
        }
      }
    },
    saveSet() {
      Message({
        showClose: true,
        message: "功能待开发。。。",
        type: "warning",
        duration: 2000,
      });
    },
    cancleSet() {
      Message({
        showClose: true,
        message: "功能待开发。。。",
        type: "warning",
        duration: 2000,
      });
    },
    loginOut() {
      sessionStorage.setItem("islogin_tiao", 1);
      sessionStorage.removeItem("JC_Token");
      sessionStorage.removeItem("syscode");
      sessionStorage.removeItem("UserInfo");
      sessionStorage.removeItem("PointArr");
      sessionStorage.removeItem("PointArr_type");
      sessionStorage.removeItem("Tracetracing_isfresh");
      // sessionStorage.removeItem("islogin_tiao");
      sessionStorage.removeItem("isfresh");
      sessionStorage.removeItem("QUYU");
      sessionStorage.removeItem("currentVal");
      sessionStorage.removeItem("navigation");
      sessionStorage.removeItem("versionNumber");
      sessionStorage.removeItem("versionDescription");
      sessionStorage.removeItem("isshow_chat");
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scoped>
.changepwd-btn2 {
  width: 90%;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border: 2px solid #00beff;
  color: #00beff;
  font-size: 16px;
  background: #ffffff;
  margin: 0 auto;
}

.border {
  border: 1px solid red;
  box-sizing: border-box;
}
.index_container {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;

  .zhaiwei {
    height: 9%;
  }
  .page-con {
    width: 100%;
    height: 91%;
    .title-box {
      width: 100%;
      height: 40px;
    }
    .left-box {
      position: fixed;
      top: 10%;
      left: 1%;
      width: 18.5%;
      height: 90%;
      display: flex;
      flex-direction: column;
      z-index: 1;
      .con-box {
        padding: 22px 12px;
        width: 100%;
        box-sizing: border-box;
        .con-box-div {
          line-height: 24px;
          color: #333333;
        }
        .head-img {
          width: 100px;
          height: 100px;
          border: 1px solid #00beff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 92px;
            height: 92px;
            border-radius: 50%;
          }
        }
        .con-text {
          padding-left: 20px;
          color: #00beff;
          line-height: 24px;
          .changepwd-btn {
            width: 160px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            border: 2px solid #00beff;
            color: #00beff;
            font-size: 16px;
            background: #ffffff;
          }
        }
      }
    }
    .flex-one {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .grid-one {
      display: grid;
      grid-template-columns: 100px auto;
    }
    .flex-two {
      display: flex;
      flex-direction: row;
    }
    .right-box {
      position: fixed;
      top: 10%;
      right: 0;
      width: 80.4%;
      height: 90%;
      z-index: 2;
      .con {
        .title {
          margin: 45px 0 0 45px;
          color: #00beff;
        }
        .line {
          width: 100%;
          height: 2px;
          margin: 10px 0 19px 36px;
          background: linear-gradient(
            90deg,
            #00beff 0%,
            rgba(221, 221, 221, 0) 100%
          );
        }
        .content {
          margin: 10px 10px 0 45px;
          display: flex;
          flex-direction: row;
          .theme {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;
            .theme-box {
              width: 58px;
              height: 36px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
            }
            .theme-box-one {
              background: #00beff;
              border: 1px solid #00beff;
            }
            .theme-box-two {
              background: #2144b5;
              border: 1px solid #2144b5;
            }
            .theme-box-three {
              background: #050a2f;
              border: 1px solid #050a2f;
            }
            .text-one-sel {
              color: #00beff;
            }
            .text-two-sel {
              color: #2144b5;
            }
            .text-three-sel {
              color: #050a2f;
            }
            .theme-text {
              margin-top: 10px;
              color: #999999;
            }
          }
        }
        .btn-all {
          width: 160px;
          height: 38px;
          line-height: 38px;
          text-align: center;
          margin-left: 36px;
          margin-top: 10px;
        }
        .btn-set {
          background: #00beff;
          border: 2px solid #00beff;
          color: #fff;
        }
        .btn-cancle {
          border: 2px solid #00beff;
          background: #fff;
          color: #00beff;
        }
        .btn-go {
          background: #00beff;
          border: 2px solid #00beff;
          color: #fff;
        }
      }
    }
  }
}
</style>