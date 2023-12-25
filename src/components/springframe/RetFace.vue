<template>
  <div class="page" v-if="displayShow">
    <div class="top">
      <div class="box">
        <div class="title-box">
          <title-two title="目标人像"></title-two>
        </div>
        <div class="box-img">
           <image-com-one :src="originImageUrl" :imageHeight="2"></image-com-one>
          <!-- <image-com :src="originImageUrl"></image-com> -->
          <!-- <el-image
          style="width:100%;height:100%"
            :src="originImageUrl"
            fit="cover"
          ></el-image> -->
        </div>
      </div>
      <div class="line"></div>
      <div class="box">
        <div class="title-box">
          <title-two title="检索人像"></title-two>
        </div>
        <div class="box-img">
           <!-- <image-com :src="bigImageUrl" indexNum="2"></image-com> -->
           <image-com-other :src="productionImage(bigImageUrl)" :imageHeight="2"></image-com-other>
           <!-- <image-com-one :src="bigImageUrl"></image-com-one> -->
          <!-- <el-image
          style="width:100%;height:100%"
            :src="bigImageUrl"
            fit="fit"
          ></el-image> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PubSub from "pubsub-js";
import TitleTwo from "@/components/basetool/TitleTwo.vue";

import ImageCom from "@/components/basetool/ImageCom.vue";
import ImageComOther from '@/components/basetool/ImageComOther.vue';
import ImageComOne from '@/components/basetool/ImageComOne.vue';
export default {
  components: {
    TitleTwo,
    ImageCom,
    ImageComOther,
    ImageComOne,
  },
  props: {
    displayShow: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    PubSub.subscribe("ret_face_data", (msg, data) => {
      console.log("data==", data);
      let listNew = [];
      listNew.push(data);
      this.itemList = listNew;
      this.originImageUrl=data.originImageUrl
      this.bigImageUrl=data.bigImageUrl
    });
  },
  data() {
    return {
      itemList: [],
      bigImageUrl:"",
      originImageUrl:""
    };
  },
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  // background: #999;
  // opacity: 0.9;
  .top {
    // height: 100%;
    height: 95vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    // display: grid;
    // grid-template-columns: 930px 20px 930px;
    border-bottom: 2px solid #00beff;
    .line {
      width: 2px;
      height: 100%;
      background: #00beff;
      margin: 0 9px;
    }
    .box {
      width: 930px;
      // height: 100%;
      height: 95vh;
      .title-box {
        height: 40px;
        width: 100%;
      }
      .box-img {
        height: calc(95vh - 40px);
        // height: calc(100% - 40px);
        width: 100%;
        background: #eeeeee;
        opacity: 0.9;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background-color: #eee;
      }
    }
  }
}
</style>