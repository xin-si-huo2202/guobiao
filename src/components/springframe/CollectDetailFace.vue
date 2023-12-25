<template>
  <div class="page" v-if="displayShow">
    <div class="box">
      <div class="title-box">
        <title-two title="人像信息"></title-two>
      </div>
      <div class="box-con">
        <div class="con-left">
          <!--<p>
            性别：{{
              itemData.genderCode == 0
                ? "男"
                : itemData.genderCode == 1
                ? "女"
                : "未知"
            }}
          </p>-->
          <p>年龄：{{ zdage(itemData.age) }}</p>
          <br />
          <br />
          <template v-if="$route.path != '/index'">
            <!-- <p>采集来源：{{ itemData.areaCode }}</p> -->
            <p>采集单位：{{ itemData.sysOrgCode_dictText }}</p>
          </template>

          <p>采集警车：{{ itemData.policeCarNumber }}</p>
          <p>入库时间：{{ itemData.createTime }}</p>
        </div>
        <div class="con-right">
          <image-com-one
            :src="productionImage(itemData.bigImageUrl)"
            :imageHeight="4"
          ></image-com-one>
          <!-- <el-image
            style="width: 100%; height: 100%"
            :src="itemData.bigImageUrl"
            fit="fill"
          ></el-image> -->
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide swiper-item"
            :class="selectIndex == index ? 'swiper-item-selitem' : ''"
            v-for="(item, index) in imgList"
            :key="index"
            @click="selImage(item, index)"
          >
            <!-- {{ index }} -->
            <el-image
              style="width: 100%; height: 100%"
              :src="productionImage(item.smallImageUrl)"
              fit="contain"
            ></el-image>
            <div v-if="selectIndex != index" class="swiper-nosel"></div>
          </div>
        </div>
        <!-- Add Pagination -->
        <!-- <div class="swiper-pagination"></div> -->
        <!-- Add Arrows -->
        <div class="swiper-button-next arrow-position" @click="nextClick">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="swiper-button-prev arrow-position" @click="prevClick">
          <i class="el-icon-arrow-left"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PubSub from "pubsub-js";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import ImageComOne from "@/components/basetool/ImageComOne.vue";
import "@/utils/swiper/swiper.min.css";
import "@/utils/swiper/swiper.min.js";

import { startLoding, endLoding } from "@/request/loading.js";
import { queryByImageId } from "@/api/collectInfo.js";

export default {
  components: {
    TitleTwo,
    ImageComOne,
  },
  props: {
    displayShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectIndex: 0,
      itemData: {
        genderCode: null,
        age: null,
        areaCode: null,
        sysOrgCode: null,
        policeCarNumber: null,
        createTime: null,
      },
      imgList: [],
    };
  },
  computed: {},
  mounted() {
    PubSub.subscribe("collect_detail_face_data", (msg, data) => {
      this.itemData = data.item;
      this.imgList = data.listData;
      this.selectIndex = data.index;
      this.lood();
    });
  },
  created() {},
  methods: {
    zdage(val) {
      if (val < 7 && val > 0) {
        return "童年";
      } else if (val < 18 && val > 6) {
        return "少年";
      } else if (val < 40 && val > 17) {
        return "青年";
      } else if (val < 51 && val > 39) {
        return "中年";
      } else if (val > 50) {
        return "老年";
      }
    },
    prevClick() {
      let selectIndex = this.selectIndex;
      if (selectIndex == 0) {
        return;
      }
      selectIndex--;
      let val = this.imgList[selectIndex];
      this.selImage(val, selectIndex);
    },
    nextClick() {
      let selectIndex = this.selectIndex;
      if (selectIndex == this.imgList.length - 1) {
        return;
      }
      selectIndex++;
      let val = this.imgList[selectIndex];
      this.selImage(val, selectIndex);
    },
    async selImage(val, index) {
      //获取信息
      var loading_lo;
      var that = this;
      try {
        loading_lo = startLoding(".bottom");

        let res = await queryByImageId({ imageId: val.id });
        if (res && res.result) {
          val.genderCode = res.result.genderCode;
          val.age = res.result.age;
          that.itemData = val;
          that.selectIndex = index;
        }
        console.log("selectIndex===", that.selectIndex);
        console.log("itemData===", that.itemData);
        endLoding(loading_lo);
      } catch (err) {
        console.log(err, "err====");
        endLoding(loading_lo);

        Message({
          showClose: true,
          message: "网络异常",
          type: "error",
          duration: 2000,
        });
      }
    },
    lood() {
      var swiper = new Swiper(".swiper-container", {
         slidesPerView: 15,
        spaceBetween: 15,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
      });
      setTimeout(() => {
        swiper.slideTo(this.selectIndex, 50, false);
      }, 50);
    },
  },
};
</script>
<style lang="scss" scoped>
.border {
  border: 1px solid red;
  box-sizing: border-box;
}
.swiper-button-next{
  right:0;
}
.swiper-button-prev{
  left:0;
}
.arrow-position {
  width: 36px;
  height: 90px;
  background: #00beff;
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 42px;
    color: #ffffff;
  }
}
.page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  .box {
    width: 100%;
    // height: 100%;
    // height: 95vh;
    height: calc(95vh - 138px);
    border-bottom: 2px solid #00beff;
    .title-box {
      height: 40px;
      width: 100%;
    }
    .box-con {
      width: 100%;
      // height: calc(100% - 40px);
      // height: calc(95vh - 40px);
      height: calc(95vh - 178px);
      display: flex;
      flex-direction: row;
      .con-left {
        width: 19%;
        height: 100%;
        padding: 25px 21px;
        box-sizing: border-box;
        p {
          line-height: 30px;
          color: #00beff;
        }
      }
      .con-right {
        width: 81%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: #eee;
      }
    }
  }
  .bottom {
    height: 158px;
    box-sizing: border-box;
    .swiper-container {
      width: 100%;
      height: 158px;
      margin: 20px auto;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;
      height: 138px;
      // border: 1px solid red;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      position: relative;

      // .swiper-item {
      //         // width: 396px;
      //         img {
      //           width: 100%;
      //           height: 300px;
      //         }
      //         &:not(:last-child) {
      //           margin-right: 60px;
      //         }
      //       }
    }
    .swiper-item {
      width: 100%;
      background: #eee;
      // img {
      //   width: 100%;
      //   height: 108px;
      // }
    }
    .swiper-item-selitem {
      border: 3px solid #00beff;
      box-sizing: border-box;
    }
    .swiper-nosel {
      background: rgba(0, 0, 0, 0.7);
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 3;
    }
    // .swiper-sel{
    //   background: red;
    // }
    .append-buttons {
      text-align: center;
      margin-top: 20px;
    }
    .append-buttons a {
      display: inline-block;
      border: 1px solid #007aff;
      color: #007aff;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 4px;
      margin: 0 10px;
      font-size: 13px;
    }
  }
}
</style>