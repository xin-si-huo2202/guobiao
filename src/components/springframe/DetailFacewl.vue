<template>
  <div class="page" v-if="displayShow">
    <div class="top">
      <div class="box">
        <div class="title-box">
          <title-two title="外来布控人像"></title-two>
        </div>
        <div class="box-img">
          <image-com-one :src="productionImage(faceImage)" :imageHeight="3"></image-com-one>
          <!-- <el-image
          style="width:100%;height:100%"
            :src="faceImage"
            fit="fit"
          ></el-image> -->
        </div>
      </div>
      <div class="line"></div>
      <div class="box">
        <div class="title-box">
          <title-two title="外来预警人像"></title-two>
        </div>
        <div class="box-img">
          <image-com-other :src="productionImage(bigImgUrl)" :imageHeight="3"></image-com-other>
          <!-- <el-image
          style="width:100%;height:100%"
            :src="bigImgUrl"
            fit="fit"
          ></el-image> -->
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-table :data="itemList" style="width: 100%">
        
       
        <el-table-column label="预警坐标" width="300">
          <template slot-scope="scope">
            {{ scope.row.longitude }}，{{ scope.row.latitude }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="预警时间" width="250">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PubSub from "pubsub-js";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import ImageComOne from "@/components/basetool/ImageComOne.vue";
import ImageComOther from "@/components/basetool/ImageComOther.vue";
export default {
  components: {
    TitleTwo,
    ImageComOne,
    ImageComOther,
  },
  mounted() {
    PubSub.subscribe("detail_face_data", (msg, data) => {
      console.log("data==", data);
      let listNew = [];
      listNew.push(data);
      this.itemList = listNew;
      this.faceImage = data.faceImage;
      this.bigImgUrl = data.bigImgUrl;
    });
  },
  props: {
    displayShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      itemList: [],
      bigImgUrl: "",
      faceImage: "",
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
  .tab-cons{
     overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
  }
  // background: #999;
  // opacity: 0.9;
  .top {
    // height: calc(100% - 100px);
    height: 85vh;
    width: 100%;
    // display: grid;
    // grid-template-columns: auto 20px auto;
    align-items: flex-end;

    display: flex;
    flex-direction: row;
    border-bottom: 2px solid #00beff;
    .line {
      width: 2px;
      height: calc(100% - 41px);
      background: #00beff;
      margin: 0 9px;
    }
    .box {
      width: 100%;
      height: 100%;
      .title-box {
        height: 40px;
        width: 100%;
      }
      .box-img {
        height: calc(85vh - 40px);
        width: 100%;
        background: #eeeeee;
        opacity: 0.9;
        position: relative;
        overflow: hidden;
        background-color: #eee;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .bottom{
    height: 10vh;
  }
  
}
</style>