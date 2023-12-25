<template>
  <div class="page" v-if="displayShow">
    <div class="box border">
      <div class="title-box">
        <title-two title="预警车辆"></title-two>
      </div>
      <div class="box-img">
        <image-com-one :src="productionImage(bigImgUrl)" :imageHeight="3"></image-com-one>
        <!-- <img :src="bigImgUrl" /> -->
      </div>
    </div>
    <div class="bottom">
      <el-table :data="itemList" style="width: 100%">
        <el-table-column
          prop="plateCode"
          label="布控车辆"
          width="200"
        ></el-table-column>
        <!-- <el-table-column
          prop="blackId"
          label="身份证号"
          width="300"
        ></el-table-column> -->
        <el-table-column prop="represent" label="布控描述">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.represent?delHtmlTag(scope.row.represent):''"
              placement="top-start"
            >
              <div class="tab-cons" v-html="scope.row.represent?scope.row.represent:''"></div>
            </el-tooltip>
            
          </template>
        </el-table-column>
        <el-table-column label="预警坐标" width="300">
          <template slot-scope="scope">
            {{ scope.row.longitude }}，{{ scope.row.latitude }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="预警时间" width="250">
        </el-table-column>
        <el-table-column
          prop="departName"
          label="预警单位"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="response"
          label="反馈信息"
          v-if="itemList[0].isResponse == 1"
        >
          <template slot-scope="scope">
             <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.response?delHtmlTag(scope.row.response):''"
              placement="top-start"
            >
              <div class="tab-cons" v-html="scope.row.response?scope.row.response:''"></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="fromCar"
          label="预警警车"
          width="200"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PubSub from "pubsub-js";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import ImageComOne from "@/components/basetool/ImageComOne.vue";
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
  mounted() {
    PubSub.subscribe("detail_car_data", (msg, data) => {
      let listNew = [];
      listNew.push(data);
      this.itemList = listNew;
      this.bigImgUrl = data.bigImgUrl;
    });
  },
  data() {
    return {
      itemList: [],
      bigImgUrl: "",
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
  //   background: #999;
  //   opacity: 0.9;
  .tab-cons{
     overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
  }
  .box {
    width: 100%;
    // height: calc(100% - 138px);
    height: 85vh;
    .title-box {
      height: 40px;
      width: 100%;
    }
    .box-img {
      // height: calc(100% - 40px);
      height: calc(85vh - 40px);
      width: 100%;
      background: #eeeeee;
      opacity: 0.9;
      position: relative;
      overflow: hidden;
      background-color: #eee;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bottom {
    height: 10vh;
  }
  // @media screen and (min-width: 3000px) {
  //   .box {
  //     width: 100%;
  //     height: calc(100% - 138px);
  //   }
  //   .bottom{
  //     height: 138px;
  //     border: 1px solid red;
  //   }
  // }
}
</style>