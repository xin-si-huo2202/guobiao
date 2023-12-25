<template>
  <div class="page" v-if="displayShow">
    <div class="box">
      <div class="title-box">
        <title-two title="车牌信息"></title-two>
      </div>
      <div class="box-con">
        <div class="con-left">
          <p>
            车牌号码：{{
              $route.path == "/Tracetracing"
                ? itemData.plateNumber
                : itemData.carNumber
            }}
          </p>
          <br />
          <br />
          <template
            v-if="$route.path != '/Tracetracing' && $route.path != '/index'"
          >
            <p>采集来源：{{ itemData.areaCode }}</p>
            <p>采集单位：{{ itemData.sysOrgCode_dictText }}</p>
          </template>

          <p>采集警车：{{ itemData.policeCarNumber }}</p>
          <p>入库时间：{{ itemData.createTime }}</p>
        </div>
        <div class="con-right" ref="conRight">
          <image-com-one
            :src="productionImage(itemData.bigImageUrl)"
            :imageHeight="2"
          ></image-com-one>
        </div>
      </div>
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
  data() {
    return {
      itemData: {
        policeCarNumber: null,
        areaCode: null,
        sysOrgCode: null,
        policeCarNumber: null,
        createTime: null,
      },
    };
  },
  mounted() {
    PubSub.subscribe("car_trail_data", (msg, data) => {
      this.itemData = data;
    });
  },
  methods: {
    // async getDetail(url) {
    //   let res = await bigImgurl({ imageUrl: url });
    //   if (res && res.result) {
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid red;
  box-sizing: border-box;
}
.page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  .box {
    width: 100%;
    // height: calc(100% - 158px);
    // height: 100%;
    height: calc(95vh - 40px);

    border-bottom: 2px solid #00beff;
    .title-box {
      height: 40px;
      width: 100%;
    }
    .box-con {
      width: 100%;
      // height: calc(100% - 40px);
      height: calc(95vh - 40px);
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
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
    }
  }
  
}
</style>