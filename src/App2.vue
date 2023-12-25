<template>
  <div id="app" class="noselect">
    <div id="jc_footer">
      <keep-alive :include="tagsList">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>


<script>
import PubSub from "pubsub-js";

import { v4 } from "uuid";

export default {
  name: "app",
  data() {
    return {
      tagsList: [],
    };
  },

  destroyed() {},
  computed: {},
  watch: {},
  methods: {},

  mounted() {},
  components: {},
};
</script>


<style lang="scss" scoped>
@import "@/assets/css/theme.scss";
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none; /* Non-prefixed version, currently

  not supported by any browser */
}
* {
  margin: 0;
  padding: 0;
  outline: none;
  font-size: 14px;
}
.bkms_span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.time-box {
  .el-input--prefix .el-input__inner {
    height: 100% !important;
    font-size: 14px;
    padding-left: 25px;
  }
  .el-input--suffix .el-input__inner {
    height: 100% !important;
    font-size: 14px;
    padding-right: 25px;
  }
  .el-input__suffix {
    right: 0px;
  }
  .el-input__prefix {
    left: 0px;
  }
  .el-input__prefix,
  .el-input__suffix {
    i {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 0 10px;
      box-sizing: border-box;
    }
  }
}

.el-range-editor .el-range-input {
  font-size: 14px;
}
.el-date-table td span {
  font-size: 12px; /*no*/
}
.el-date-editor .el-range__icon {
  font-size: 14px;
}
.el-tree {
  background: none;
}

.el-tree {
  color: #78b6ee;
  .el-tree-node:focus > .el-tree-node__content {
    background: linear-gradient(
      to right,
      #a4f8ff,
      rgba(255, 255, 255, 0)
    ) !important;
    color: #2cc6ff;
  }

  .el-tree-node__content:hover {
    background: linear-gradient(
      to right,
      #a4f8ff,
      rgba(255, 255, 255, 0)
    ) !important;
    color: #2cc6ff;
  }
  .el-tree-node__label {
    font-size: 14px;
  }
  .el-tree-node__content {
    height: auto;

    // padding-bottom: 2px;
    padding: 3px 0;
  }
}

.big-Typography {
  font-size: 16px;
}

.bg_color_white {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
}

.Typography-color-blue {
  color: #00beff;
  &.nysj_the {
    color: #000;
  }
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  .spring-frame2 {
  }
  .spring-frame {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
  }
  .close-icon {
    position: fixed;
    top: 10px;
    right: 20px;
    z-index: 10;
    width: 28px;
    height: 28px;
    margin-top: 16px;
    margin-left: 47px;
    background-image: url("./assets/image/close-page.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
#jc_header {
  width: 100%;
  height: 9%;
  background: linear-gradient(to bottom, rgb(225 253 255), rgb(255 255 255));

  opacity: 0.88;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  //display: grid;
  //grid-template-columns: 668px auto 668px;
  padding: 0 21px;
  box-sizing: border-box;
  .header-center {
    background-image: url("./assets/image/nav-centent.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    /* justify-content: right; */
    align-items: flex-end;
  }
  .title-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: calc(100% - 10px);
    width: 89%;
    .title-item {
      font-size: 20px;
      font-weight: 600;
      .jstx {
        text-decoration: none;
        color: #333;
      }
      .router-link-active {
        text-decoration: none;
        color: #00beff;
      }
      .router-link {
        text-decoration: none;
        color: #333;
      }
      a {
        text-decoration: none;
        color: #333;
        cursor: pointer;
      }
    }
    .set-icon {
      width: 30px;
      height: 30px;
      background-image: url("./assets/image/nav-button-user.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .title-center {
    height: calc(100% - 10px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #222222;
    font-size: 28px;
    font-weight: 700;
    font-family: "标题";
    //7df5ff  #999
  }
  .title-img {
    width: 100%;
    height: 10px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .title-left-img {
    background-image: url("./assets/image/nav-line-left.svg");
  }
  .title-right-img {
    background-image: url("./assets/image/nav-line-right.svg");
  }
  .title-center-img {
    height: 4px;
    margin-top: 3px;
    background-image: url("./assets/image/nav-line-cent.svg");
  }
}

#jc_footer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

//查看大图
.el-image-viewer__wrapper {
  position: fixed;
  top: 10%;
  right: 0;
  bottom: 0;
  left: 0;
}

//进度条颜色
.el-slider__bar {
  background-color: #00beff;
}
</style>
