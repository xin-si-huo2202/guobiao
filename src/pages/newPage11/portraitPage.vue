<template>
  <div class="portrait-main">
    <Map
      :dataList="jiansuoWeizhiList"
      :jsdingwei="jsdingwei"
      v-show="isJSStatus && weizhiShow"
    />
    <div
      class="portrait-main-left"
      :style="isJSStatus && weizhiShow ? 'backgroundColor:#ddd' : ''"
    >
      <div class="uplode-box">
        <div class="uplode-line">
          <div class="uplode uplodeImgName">
            <el-upload
              class="face-uploader"
              action="#"
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="changeUpload"
              list-type="picture-card"
            >
              <el-image
                style="width: 100%; height: 100%"
                :src="productionImage(paramSel.img_url)"
                v-if="paramSel.img_url.length > 0"
              >
                <div
                  slot="error"
                  class="image-slot img-box"
                  style="font-size: 30px;color: #c8c8c8;background-color: #f4f4f4;"
                >
                  <i class="el-icon-user-solid"></i>
                </div>
              </el-image>
              <div class="uploadBox" v-else>
                <i class="el-icon-user"></i>
              </div>
            </el-upload>
          </div>
          <div class="btn" @click="clearImageEvent">清空</div>
        </div>
        <div>只能上传.jpg/jpeg/png文件，且图片大小不超过5MB</div>
      </div>
      <div class="js-max-num">
        <div>
          <span>最多展示</span>
          <el-input-number
            v-model="paramSel.maxNum"
            :min="1"
            :max="16384"
          ></el-input-number>
          <span>条</span>
        </div>
        <div class="text">最大返回条数不得超过16384</div>
      </div>
      <div class="rate-rang">
        <div class="text">相似率({{ paramSel.rate }})</div>
        <el-slider v-model="paramSel.rate"></el-slider>
        <div class="min-num">0</div>
        <div class="max-num">100</div>
      </div>
      <div class="time-rang">
        <el-date-picker
          v-model="paramSel.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        -
        <el-date-picker
          v-model="paramSel.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </div>
      <div class="sel-btn" @click="getJiansuo">
        查询
        <!-- {{ this.isJSStatus ? "清除并返回" : "检索" }} -->
      </div>

      <div class="quyu">
        <el-input
          class="cars-search"
          v-model="pCarts"
          placeholder="请输入车牌号"
        ></el-input>
        <div
          class="list"
          v-for="(iteml, indexl) in quyuListShow"
          :key="indexl"
          :class="paramSel.gatherCar == iteml.carNumber ? 'sel' : ''"
          @click="selectGatherCar(iteml.carNumber)"
        >
          <div class="line">
            <div class="car">{{ iteml.carNumber }}</div>
          </div>
          <div class="line">
            <div class="part">{{ iteml.sysOrgCode }}</div>
            <div class="num">{{ iteml.count }}条</div>
          </div>
          <!-- <div class="btn" @click="videoLook">视频调度</div> -->
        </div>
      </div>
    </div>
    <div class="portrait-main-conent right-box">
      <div class="videowarp-left" @click="yidong()" v-if="isJSStatus">
        位置
      </div>
      <div class="right-title">
        <title-two>
          <p>共计：</p>
          <p class="num">{{ totalCount }}条</p>
        </title-two>
      </div>
      <div class="right-con">
        <template v-if="dataList && dataList.length > 0">
          <div v-for="(item, index) in dataList" :key="index" class="con-first">
            <div class="time-box" @click="datasel(index, item)">
              <div class="time">{{ item.time }}</div>
              <div class="progress">
                <!-- <span>0</span>
                <div class="progress-line"></div> -->
                <span>{{ item.count }}条</span>
              </div>
              <div class="icon">
                <i
                  :class="
                    showListIndex == index && !isFlot
                      ? 'el-icon-arrow-up'
                      : 'el-icon-arrow-down'
                  "
                ></i>
              </div>
            </div>
            <div
              class="con-box"
              v-show="showListIndex == index"
              :style="
                (isJSStatus && item.list && item.list.length > 30) ||
                (!isJSStatus && caijiList && caijiList.length > 30)
                  ? 'height: 450px;'
                  : ''
              "
              :id="'renxiang-scroll' + index"
              @scroll="scrollEvent"
            >
              <template v-if="item.list && item.list.length > 0">
                <div
                  class="tab-item tab-item-one"
                  v-for="(itemj, indexj) in item.list"
                  :key="itemj.id"
                >
                  <!-- @mousedown="mouseDown($event, item.imgPath, item.id)" -->
                  <el-image
                    style="width: 140px; height: 140px; background: #eee"
                    :src="productionImage(itemj.imgPath)"
                    @click="lookDetailFaceJiansuo(itemj.id, itemj.imgPath)"
                    fit="fill"
                  >
                  </el-image>
                  <div class="portrait-desc">
                    <div class="desc-time">
                      <template
                        v-if="
                          itemj.createTime &&
                            itemj.createTime != '0000:00:00_00:00:00'
                        "
                      >
                        <div class="font-size-13">
                          {{
                            itemj.createTime.substring(0, 10).replace(/:/g, "-")
                          }}
                        </div>
                        <div class="font-size-13">
                          {{ itemj.createTime.substring(11, 19) }}
                        </div>
                      </template>
                      <div v-else class="font-size-13">暂无时间</div>
                      <div class="desc-triangle-one"></div>
                    </div>
                    <div class="desc-rate">
                      <div class="font-size-14">
                        {{ parseInt(itemj.score) }}%
                      </div>
                      <div class="font-s-12">相似率</div>
                    </div>
                  </div>
                  <div class="cp-btn-weizhi" @click.stop="rxWeiZhiJS(itemj)">
                    <i class=" el-icon-location">位置</i>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="tab-item tab-item-two"
                  v-for="(itemcj, indexcj) in caijiList"
                  :key="itemcj.id"
                >
                  <div class="top-img">
                    <el-image
                      style="width: 140px; height: 140px; background: #eee"
                      :src="productionImage(itemcj.smallImageUrl)"
                      @click="lookDetailFaceCaiji(itemcj, indexcj)"
                      fit="fill"
                    >
                    </el-image>
                  </div>
                  <div class="rx-btn">
                    <div class="rx-btn-weizhi" @click="rxWeiZhi(itemcj, 1)">
                      <i class=" el-icon-location">位置</i>
                    </div>
                    <div class="rx-btn-jiansuo" @click="rxJianSuo(itemcj)">
                      <i class=" el-icon-search">检索</i>
                    </div>
                  </div>
                  <div class="time">
                    <template v-if="itemcj.createTime">
                      <div>
                        {{ itemcj.createTime.substring(0, 10) }}
                      </div>
                      <div>{{ itemcj.createTime.substring(11, 19) }}</div>
                    </template>
                    <div v-else>暂无时间</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <EmpMini />
        </template>
      </div>
    </div>
    <div class="page-bk" v-show="dialogVisible">
      <div class="page-bk-box border">
        <div class="cropper-content border">
          <div class="cropper" style="text-align: center">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :centerBox="option.centerBox"
              :infoTrue="option.infoTrue"
              :fixedBox="option.fixedBox"
            ></vueCropper>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn-all btn-ok" @click="finish">确认</div>
          <div class="btn-all btn-cancel" @click="dialogVisible = false">
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Map from "@/components/map.vue";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import { selBigImageUrl } from "@/api/faceForm.js";
import { v4 } from "uuid";
import {
  groupByDateCount,
  getCarListAndCount,
  searchPlate,
  hrFaceSearch,
} from "@/api/resetSecondPage.js";
import { queryByImageId } from "@/api/collectInfo.js";
import { startLoding, endLoding } from "@/request/loading.js";
import EmpMini from "@/components/empMini.vue";
import { upload } from "@/api/public.js";
export default {
  components: {
    TitleTwo,
    EmpMini,
    Map,
  },
  activated() {
    PubSub.publish("nmhead");
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    PubSub.publish("nmhead");
    let nowDate = new Date();
    this.paramSel.endTime = this.rTime(nowDate);
    this.paramSel.startTime = this.rTime(
      new Date(nowDate.getTime() - 86400000 * 30)
    );
    this.getquyuList();
    this.getCaijiDataList();
  },
  data() {
    return {
      isJSStatus: false,
      weizhiShow: false,
      paramSel: {
        rate: 50,
        img_url: "",
        maxNum: 1000,
        gatherCar: "",
        startTime: "",
        endTime: "",
        page: 1,
        size: 40,
        type: 11,
      },
      dataStyle: 1,
      showIndex: 1,
      showListIndex: 1,
      quyuList: [],
      quyuListShow: [],
      pCarts: "",

      dataListJS: [],
      // 控制剪裁页面展示与隐藏
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 300, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        // fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      isFlot: false,

      jsdingwei: null,
      totalCount: 0,
      dataList: {},
      caijiList: [],
      jiansuoWeizhiList: [],
      currentCaijiData: 0,
      isscroll_renxiang: false,
      have_next: true,
    };
  },
  watch: {
    pCarts: {
      handler(news, olds) {
        if (news && news.length == 0) {
          this.quyuListShow = this.quyuList;
        } else {
          this.quyuListShow = this.quyuList.filter((item) => {
            return item.carNumber.includes(news);
          });
        }
      },
    },
    quyuList: {
      handler(news, olds) {
        this.quyuListShow = news;
      },
    },
  },
  methods: {
    videoLook(carNumber) {
      this.$router.push({
        path: "/diaodu",
        query: {
          carNumber: carNumber,
        },
      });
    },
    // 选择警车（采集）
    selectGatherCar(val) {
      // 判断车牌是否存在
      if (this.isJSStatus) return;
      this.paramSel.gatherCar = this.paramSel.gatherCar == val ? "" : val;
      this.getCaijiDataList();
    },
    // 清空按钮
    clearImageEvent() {
      this.isJSStatus = false;
      this.paramSel.img_url = "";
      this.getquyuList();
      this.getCaijiDataList();
    },
    // 检索按钮
    getJiansuo() {
      this.paramSel.gatherCar = "";
      // if (this.isJSStatus) {
      //   this.quyuList = [];
      //   this.dataList = [];
      //   this.isJSStatus = false;
      //   this.paramSel.img_url = "";
      //   this.getquyuList();
      //   this.getCaijiDataList();
      // } else {
      //   console.log("this.paramSel.img_url", this.paramSel.img_url);
      if (this.paramSel.img_url.length == 0) {
        // return this.$message({
        //   message: "请上传需要检索的人像图片",
        //   type: "warning",
        // });
        this.quyuList = [];
        this.dataList = [];
        this.isJSStatus = false;
        this.paramSel.img_url = "";
        this.getquyuList();
        this.getCaijiDataList();
      } else {
        this.quyuList = [];
        this.dataList = [];
        this.getJiansuoDataList();
      }
      // }
    },
    async getJiansuoDataList() {
      this.isJSStatus = true;
      let loading_lo;
      let param = new FormData();
      param.append("img_url", this.paramSel.img_url);
      param.append("similarity", this.paramSel.rate);
      param.append("startTime", this.paramSel.startTime);
      param.append("endTime", this.paramSel.endTime);
      param.append("maxNum", this.paramSel.maxNum);
      try {
        loading_lo = startLoding(".right-con");
        let res = await hrFaceSearch(param);
        let newList = [];
        if (res.result.deptCarList && res.result.deptCarList.length > 0)
          this.quyuList = res.result.deptCarList;
        if (res.result.restultDateMap && res.result.restultDateMap.length > 0) {
          this.dataList = res.result.restultDateMap;
          res.result.restultDateMap.forEach((item) => {
            if (item.list && item.list.length > 0)
              newList = [...newList, ...item.list];
          });
        }
        this.jiansuoWeizhiList = newList;
        this.totalCount = res.count;
        this.showListIndex = 0;
        this.currentCaijiData = "";
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        this.quyuList = [];
        this.dataList = [];
        this.jiansuoWeizhiList = [];
        this.totalCount = 0;
        this.showListIndex = 0;
        this.currentCaijiData = "";
      }
    },
    //采集区域滚动
    scrollEvent() {
      var ts = this;
      if (this.currentCaijiData) {
        var el = document.querySelector(
          "#renxiang-scroll" + this.showListIndex
        );
        var offsetHeight = el.offsetHeight;

        var scrollTop = el.scrollTop;
        var scrollHeight = el.scrollHeight;
        if (offsetHeight + scrollTop - scrollHeight >= -1) {
          // 需要执行的代码
          console.log("已滚动到底部", ts.isscroll_renxiang, ts.have_next);
          if (!ts.isscroll_renxiang && ts.have_next) {
            ts.isscroll_renxiang = true;
            this.paramSel.page++;
            this.getChildDataList();
          }
        }
      }
    },
    // 获取采集信息
    async getCaijiDataList() {
      $(".right-box").animate({ right: 0 + "px" });
      this.caijiList = [];
      this.dataList = [];
      this.totalCount = 0;
      this.showListIndex = 0;
      this.currentCaijiData = "";
      let loading_lo;
      let param = new FormData();
      param.append("gatherCar", this.paramSel.gatherCar);
      param.append("startTime", this.paramSel.startTime);
      param.append("endTime", this.paramSel.endTime);
      param.append("page", 1);
      param.append("size", this.paramSel.size);
      param.append("type", this.paramSel.type);
      try {
        loading_lo = startLoding(".right-con");
        let res = await groupByDateCount(param);
        if (res.code == 200) {
          this.dataList = res.result;
          this.totalCount = res.sum;
          this.showListIndex = 0;
          this.currentCaijiData =
            res.result.length > 0 ? res.result[0].time : "";

          this.paramSel.page = 1;
          this.caijiList = [];
          this.getChildDataList();
        }
        endLoding(loading_lo);
      } catch (err) {
        endLoding(loading_lo);
        this.dataList = [];
        this.totalCount = 0;
        this.showListIndex = 0;
        this.currentCaijiData = "";
        this.paramSel.page = 1;
        this.caijiList = [];
      }
    },
    // 获取采集信息的子集
    async getChildDataList() {
      if (this.currentCaijiData.length == 0) {
        return;
      }
      let param = new FormData();
      param.append("gatherCar", this.paramSel.gatherCar);
      // param.append("startTime", this.paramSel.startTime);
      param.append("date", this.currentCaijiData);
      // param.append("endTime", this.paramSel.endTime);
      param.append("page", this.paramSel.page);
      param.append("size", this.paramSel.size);
      param.append("type", this.paramSel.type);
      let res = await searchPlate(param);
      if (res.code == 200 && res.result.restultDateMap[0]) {
        let newL = res.result.restultDateMap[0].list;
        this.caijiList = [...this.caijiList, ...newL];
        this.have_next = !(newL.length < this.paramSel.size);
      }
      this.isscroll_renxiang = false;
      console.log("caijiList==", this.caijiList);
    },
    // 左侧区域信息
    async getquyuList() {
      let param = new FormData();
      param.append("type", this.paramSel.type);
      param.append("startTime", this.paramSel.startTime);
      param.append("endTime", this.paramSel.endTime);
      let res = await getCarListAndCount(param);
      if (res.code == 200) {
        this.quyuList = res.result;
      }
    },
    datasel(index, item) {
      this.isFlot = false;
      if (this.showListIndex == index) {
        if ($("#renxiang-scroll" + index).css("display") == "none") {
          $("#renxiang-scroll" + index).css("display", "flex");
        } else {
          this.isFlot = true;
          $("#renxiang-scroll" + index).css("display", "none");
        }
      } else {
        this.showListIndex = index;
        if (!item.list) {
          this.currentCaijiData = this.dataList[this.showListIndex].time;
          //分页数据清零
          this.paramSel.page = 1;
          this.caijiList = [];
          this.getChildDataList();
        }
      }
    },

    //人像大图详情
    async lookDetailFaceJiansuo(id, url) {
      console.log("aaa");
      let param = new FormData();
      param.append("id", id);
      let res = await selBigImageUrl({ id: id });
      if (res && res.result) {
        let item = {};
        item.originImageUrl = url;
        item.bigImageUrl = res.result;
        PubSub.publish("detail_box_type_show", 9);
        PubSub.publish("ret_face_data", item);
      }
    },
    rxWeiZhiJS(data) {
      if (!data.gpsLongitude) {
        this.$message.error("没有坐标信息");

        return;
      }

      var p = Object.assign({}, data, { change: v4() });

      this.jsdingwei = p;

      this.yidong();
    },
    yidong() {
      var leftnum = $(".right-box").width();

      var leftarrowwid = $(".videowarp-left").height();

      leftnum = leftnum - leftarrowwid;

      var rightxian = $(".right-box").css("right");

      if (rightxian == "0px") {
        this.weizhiShow = true;
        $(".right-box").animate({ right: -leftnum + "px" });
      } else {
        this.weizhiShow = false;
        $(".right-box").animate({ right: 0 + "px" });
      }
      console.log("weizhiShow==", this.weizhiShow);
    },

    //采集人像-item-位置(采集)
    rxWeiZhi(data, type) {
      data.type = type;
      sessionStorage.setItem("caijiweizhi_date", JSON.stringify(data));
      if (data.gpsLongitude) {
        this.$router.push("/");
      }
    },
    //采集人像-item-检索
    rxJianSuo(data) {
      this.paramSel.img_url = data.smallImageUrl;
      this.quyuList = [];
      this.dataList = [];
      this.getJiansuoDataList();
    },
    //采集人像大图详情
    async lookDetailFaceCaiji(item, index) {
      console.log("aaa");
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.caijiList.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.caijiList.slice(index - 10, index + 10);
        newIndex = 10;
      }
      let res = await queryByImageId({ imageId: item.id });
      if (res && res.result) {
        item.genderCode = res.result.genderCode;
        item.age = res.result.age;
        PubSub.publish("detail_box_type_show", 6);
        PubSub.publish("collect_detail_face_data", {
          item: item,
          listData: newList,
          index: newIndex,
        });
      }
    },
    //切换图片
    changeUpload(file) {
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        return this.$message.error("上传头像图片只能是JPG格式或PNG格式!");
      }
      if (!isLt2M) {
        return this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      this.fileinfo = file;
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        this.dialogVisible = true;
      });
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = "face" + this.fileinfo.uid;
        this.loading = true;
        var selFile = new window.File([data], fileName, {
          type: "image/jpeg",
        });
        this.upLoad1(selFile);
      });
    },
    // 剪裁---上传文件
    async upLoad1(file, isinit = false) {
      const res = await upload({ file: file });
      console.log("res==", res);
      if (res.code == 200) {
        this.paramSel.img_url = res.result;
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
      this.dialogVisible = false;
    },

    //图片——鼠标按下
    // mouseDown(e, url, name) {
    //   var that = this;
    //   let disX = e.clientX;
    //   let disY = e.clientY;
    //   // 鼠标拖动过程
    //   document.onmousemove = (e) => {
    //     e.preventDefault();
    //   };
    //   // 鼠标松开
    //   document.onmouseup = (e) => {
    //     let left = e.clientX;
    //     let top = e.clientY;
    //     var img = $(".uplodeImgName").offset();
    //     let imgDivLeft = img.left;
    //     let imgDivTop = img.top;
    //     var imgw = $(".uplodeImgName").innerWidth();
    //     var imgh = $(".uplodeImgName").innerHeight();

    //     if (
    //       left < imgDivLeft + imgw &&
    //       left > imgDivLeft &&
    //       top < imgDivTop + imgh &&
    //       top > imgDivTop
    //     ) {
    //       that.fileinfo.uid = name;
    //       that.option.img = url;
    //       that.dialogVisible = true;
    //     }
    //     document.onmousemove = null;
    //     document.onmouseup = null;
    //   };
    // },
  },
};
</script>
<style lang="scss" scoped>
.portrait-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .portrait-main-left {
    position: fixed;
    top: 10%;
    left: 1%;
    width: 18.5%;
    height: calc(90% - 10px);
    z-index: 1;
    background-color: #99999933;
    padding: 10px;
    .uplode-box {
      width: 340px;
      // height: 309px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // padding: 10px 0;
      color: #333;
      .uplode-line {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
        .btn {
          background-color: #02befe;
          color: #fff;
          padding: 5px 15px;
          margin-left: 30px;
        }
      }
      .uplode {
        width: 140px;
        height: 140px;
        background: #ffffff;
        // border: 1px solid #00beff;
        margin-bottom: 6px;
      }
    }
    .js-max-num {
      padding: 8px 4px;
      text-align: center;
      background-color: #fff;
      .text {
        margin-top: 4px;
      }
    }
    .rate-rang {
      background-color: #fff;
      padding: 10px;
      margin-top: 10px;
      text-align: center;
      position: relative;
      .min-num {
        position: absolute;
        bottom: 0;
        left: 10px;
      }
      .max-num {
        position: absolute;
        bottom: 0;
        right: 10px;
      }
    }

    .sel-btn {
      margin-top: 10px;
      width: 100%;
      height: 0.6rem;
      background: #97cdff;
      text-align: center;
      line-height: 0.6rem;
      color: #fff;
      background: url("../../assets/image/button-1.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .time-rang {
      margin-top: 10px;
      background-color: #fff;
      padding: 8px 4px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
    .quyu {
      margin-top: 10px;
      cursor: pointer;
      height: calc(100% - 480px);
      overflow-y: auto;
      .cars-search {
        position: sticky;
        font-size: 14px;
        display: inline-block;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 100;
      }
      .sel {
        background-color: #02befe !important;
      }
      .list {
        background-color: #fff;
        margin: 2px 4px;
        padding: 8px;
        position: relative;
        .line {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #746c6c;
          line-height: 22px;
          .car {
            color: #222222;
            font-weight: bold;
          }
        }
        .btn {
          position: absolute;
          top: 5px;
          right: 10px;
          background-color: #02befe;
          color: #fff;
          font-size: 12px;
          padding: 2px 4px;
        }
      }
      .quyu-first {
        color: #303133;
        cursor: pointer;
        .title {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #ebeef5;
          background-color: #fff;
          padding: 0 4px;
          font-size: 14px;
          line-height: 42px;
          position: relative;
          .icon {
            position: absolute;
            top: 0;
            right: 10px;
            i {
              font-size: 20px;
            }
          }
          .part2 {
            margin-left: 8px;
            font-size: 12px;
            text-align: center;

            .num1 {
              color: #02befe;
            }
          }
        }
      }
    }
  }
  .portrait-main-conent {
    position: fixed;
    top: 10%;
    right: 0;
    width: 80.4%;
    height: 90%;
    z-index: 2;
    .videowarp-left {
      position: absolute;
      width: 59px;
      height: 30px;
      // left:-39px;
      top: 50%;
      transform: rotate(90deg);
      font-size: 20px;
      transform-origin: 0 0;
      background: #00beff;
      color: #fff;
      text-align: center;
      line-height: 30px;
      margin-left: 20px; /*no*/
    }
    .right-title {
      width: 100%;
      height: 40px;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .right-con {
      // width: 100%;
      height: calc(100% - 50px);
      margin-left: 20px;
      overflow-y: scroll;
      cursor: pointer;
      padding: 10px;
      background-color: #99999933;
      .con-first {
        margin: 8px 0;
        .time-box {
          padding: 10px 15px;
          background-color: #02befe;
          color: #fff;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          flex-direction: row;
          position: relative;
          .progress {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: 30px;
            .progress-line {
              width: 100px;
              height: 5px;
              background-color: rgb(36, 134, 185);
              margin: 0 10px;
            }
          }
          .icon {
            position: absolute;
            top: 5px;
            right: 10px;
            i {
              font-size: 30px;
            }
          }
        }
        .con-box {
          background-color: #fff;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding-bottom: 10px;
          overflow: auto;
          cursor: pointer;
          .tab-item-two {
            width: 140px; /*no*/
            height: 210px; /*no*/
            .tab-item-top {
              height: calc(100% - 72px); /*no*/
            }
          }
          .tab-item-one {
            width: 140px; /*no*/
            height: 180px; /*no*/
          }
          .tab-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: #fff;
            margin: 10px 0 0 12px; /*no*/
            text-align: center;
            .tab-item-top {
              width: 100%; /*no*/
              background: #e3f6f8;
              padding: 21px 0 11px 0; /*no*/
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              .num-box {
                font-size: 16px; /*no*/
              }
              // img {
              //   width: 130px; /*no*/
              //   height: 60px; /*no*/
              //   display: block;
              // }
            }
            .portrait-desc {
              width: 100%; /*no*/
              height: 36px; /*no*/
              box-sizing: border-box;
              display: flex;
              flex-direction: row;
              background-color: #02befe;
              color: #ffffff;
              border-left: 1px solid #78b6ee; /*no*/
              border-right: 1px solid #78b6ee; /*no*/
              border-bottom: 1px solid #78b6ee; /*no*/
              .desc-time {
                width: 65%;
                background-color: #fff;
                color: #00beff;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                line-height: 16px; /*no*/
                div {
                  font-size: 13px; /*no*/
                }
                .desc-triangle-one {
                  width: 0;
                  height: 0;
                  border-bottom: 36px solid #02befe; /*no*/
                  border-left: 12px solid transparent; /*no*/
                  position: absolute;
                  top: 0;
                  right: 0;
                }
              }
              .desc-rate {
                text-align: center;
                color: #fff;
                font-size: 12px; /*no*/
                line-height: 36px; /*no*/
                width: 35%; /*no*/
                height: 36px; /*no*/
              }
            }
            .cp-btn-weizhi {
              width: 100%; /*no*/
              height: 30px; /*no*/
              background: #02befe;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;

              i,
              span {
                font-size: 12px; /*no*/
              }
            }
            .time {
              height: 34px; /*no*/
              width: 100%;
              border-left: 1px solid #78b6ee; /*no*/
              border-right: 1px solid #78b6ee; /*no*/
              border-bottom: 1px solid #78b6ee; /*no*/
              box-sizing: border-box;
              color: #00beff;
              text-align: center;
              line-height: 16px; /*no*/
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              div {
                font-size: 12px; /*no*/
              }
            }
            .rx-btn {
              height: 32px; /*no*/
              width: 140px; /*no*/
              display: flex;
              flex-direction: row;
              box-sizing: border-box;
              // grid-template-columns: 40% 20% 40%;/*no*/
              border: 1px solid #02befe;
              .rx-btn-tir {
                width: 0;
                height: 0;
                border-right: 20px solid transparent; /*no*/
                border-top: 30px solid #02befe; /*no*/
              }
              .rx-btn-weizhi {
                width: 50%; /*no*/
                height: 30px; /*no*/
                background: #02befe;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;

                i,
                span {
                  font-size: 12px; /*no*/
                }
              }
              .rx-btn-jiansuo {
                width: 50%; /*no*/
                height: 30px; /*no*/
                display: flex;
                justify-content: center;
                align-items: center;
                color: #02befe;
                i {
                  font-size: 12px; /*no*/
                }
              }
            }
            .top-img {
              height: calc(100% - 70px); /*no*/
            }
          }
        }
      }
    }
  }
  .page-bk {
    width: 100%;
    height: 100%;
    background: rgb(255 255 255 / 90%);
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .cropper-content {
      .cropper {
        width: 420px;
        height: 420px;
      }
    }
    .page-bk-box {
      width: 477px;
      height: 564px;
      background-image: url("../../assets/image/upload.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      padding: 55px 0 28px 0;
      .btn-box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
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
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 47%;
}

::v-deep .js-max-num .el-input-number {
  line-height: 38px;
  // width: 160px;
  margin: 0 8px;
}
::v-deep .js-max-num .el-input__inner {
  line-height: 40px;
  height: 40px;
}

::v-deep .el-input--prefix .el-input__inner {
  padding: 0 15px 0 10px;
  font-size: 12px;
}
::v-deep .el-input__prefix {
  font-size: 12px;
  left: 0;
  display: none;
}
::v-deep .el-input__suffix {
  font-size: 10px;
  right: 0;
}
::v-deep .el-slider__bar {
  background-color: #02befe;
}
::v-deep .el-upload-dragger {
  width: 100%;
  height: 100%;
}
::v-deep .face-uploader {
  width: 100%;
  height: 100%;
}
::v-deep .el-upload--picture-card {
  width: 100%;
  height: 100%;
}
</style>
