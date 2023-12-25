<template>
  <div class="page" v-if="displayShow">
    <div class="box">
      <div class="title-box">
        <title-two title="采集信息"></title-two>
      </div>
      <div class="box-con">
        <div class="con-left">


        
          <template v-if='itemData.age'>

            <p>年龄：{{ zdage(itemData.age) }}</p>
          
          </template>

          <template v-if='itemData.plateNumber'>

            <p>车牌号码：{{ itemData.plateNumber }}</p>
          
          </template>
          
         
          
          <br />
          <br />
          <!-- <template
            v-if="$route.path != '/Tracetracing' && $route.path != '/index'"
          >
            <p>采集来源1：{{ itemData.areaCode }}</p>
            <p>采集单位：{{ itemData.sysOrgCode_dictText }}</p>
          </template> -->

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
      selectIndex: 0,
      itemData: {
        policeCarNumber: null,
        areaCode: null,
        sysOrgCode: null,
        policeCarNumber: null,
        createTime: null,
      },
      imgList: [],
    };
  },
  mounted() {
    PubSub.subscribe("car_trail_data", (msg, data) => {
      //debugger
      this.itemData = data;
    });
  },
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
  },
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid red;
  box-sizing: border-box;
}
.swiper-button-next {
  right: 0;
}
.swiper-button-prev {
  left: 0;
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
    // height: calc(100% - 158px);
    // height: 100%;
    height: 100%;

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
        position: relative;
        overflow: hidden;
        background-color: #eee;
      }
    }
  }
}
</style>