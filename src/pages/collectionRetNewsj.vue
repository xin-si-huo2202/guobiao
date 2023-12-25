<template>
  <div class="index_container padding-21">
    <!-- <div class="zhaiwei"></div> -->
    <div class="page-con">
      <div class="left-box">
        <div class="title-box">
          <span class='scsc'>上传检索图片:</span>
        </div>
        <div class="uplode-box">
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
                :src="productionImage(queryParams.img_usl)"
                v-if="queryParams.img_usl.length > 0"
              >
                <div
                  slot="error"
                  class="image-slot img-box"
                  style="
                    font-size: 30px;
                    color: #c8c8c8;
                    background-color: #f4f4f4;
                  "
                >
                  <i class="el-icon-user-solid"></i>
                </div>
              </el-image>
              <div class="uploadBox" v-else>
                <i class="el-icon-user"></i>
              </div>
            </el-upload>
          </div>
   
        </div>
        <div class="title-box">
          <span class='scsc'>选择相似率:{{queryParams.similarity}}％</span>
        </div>
        <div class="rate-box">
          <el-slider
            v-model="queryParams.similarity"
            :min="0"
            :max="100"
          ></el-slider>
       
        </div>
        <!--<div class="title-box">
          <title-two title="最大返回条数"></title-two>
        </div>
        <div class="num-box1">
          <el-input-number
            v-model="queryParams.maxNum"
            controls-position="right"
            :min="1"
            :max="16384"
          ></el-input-number>
          <div>最大返回条数不得超过16384</div>
        </div>-->
        <div class="btnsp">
          <!--<div class="sel-btn" @click="selBtn">查询</div>
          <div class="sel-btn" @click="cz">重置</div>-->

          <el-button type="primary" plain @click="selBtn" size="small"
                   style="margin-left:10px; width: 95px">查询
          </el-button>

           <el-button type="primary" plain @click="cz" size="small"
                   style="margin-left:10px; width: 95px">重置
          </el-button>
        </div>
        <!-- <div class="sel-btn" @click="loading ? '' : selBtn()">查询</div> -->
      </div>
      <div class="right-box">
        <template v-if="facecz">
          <div
            class="box-all"
            v-loading="loading"
            element-loading-text="正在拼命加载中~~"
          >
             <!--<div class="right-title">
              <title-two>
                <p>共计：</p>
                <p class="num">{{ total }}条</p>
              </title-two>
            </div>-->
            <div class="right-con">
              <div class="tab-con" v-if="dataList.length != 0">
                <div
                  class="tab-item"
                  v-for="item in dataList"
                  :key="item.id"
                  @click="lookDetailFace(item.id)"
                >
                  <el-image
                    style="width: 140px; height: 140px; background: #eee"
                    :src="item.imgPath"
                    fit="fill"
                    lazy
                    @mousedown="mouseDown($event, item.imgPath, item.id)"
                  >
                  </el-image>
                  <div class="portrait-desc">
                    <div class="desc-time">
                      <template
                        v-if="
                          item.createTime &&
                          item.createTime != '0000:00:00_00:00:00'
                        "
                      >
                        <div class="font-size-13">
                          {{
                            item.createTime.substring(0, 10).replace(/:/g, "-")
                          }}
                        </div>
                        <div class="font-size-13">
                          {{ item.createTime.substring(11, 19) }}
                        </div>
                      </template>
                      <div v-else class="font-size-13">暂无时间</div>
                      <div class="desc-triangle-one"></div>
                    </div>
                    <div class="desc-rate">
                      <div class="font-size-14">
                        {{ parseInt(item.score) }}%
                      </div>
                      <div class="font-s-12">相似率</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-con"
                v-else-if="dataList.length == 0 && dataListNew.length != 0"
                id="tabBox-rxjs"
                @scroll="scrollEvent"
              >
                <div
                  class="tab-item"
                  v-for="item in dataListNew"
                  :key="item.id"
                  @click="lookDetailFace(item.id)"
                >
                  <!-- @click="lookDetailFace2(item, i)" -->
                  <el-image
                    style="width: 140px; height: 140px; background: #eee"
                    :src="item.imgPath"
                    fit="fill"
                    lazy
                    @mousedown="mouseDown($event, item.imgPath, item.id)"
                  >
                  </el-image>
                  <div class="portrait-desc">
                    <div class="desc-time">
                      <template
                        v-if="
                          item.createTime &&
                          item.createTime != '0000:00:00_00:00:00'
                        "
                      >
                        <div class="font-size-13">
                          {{
                            item.createTime.substring(0, 10).replace(/:/g, "-")
                          }}
                        </div>
                        <div class="font-size-13">
                          {{ item.createTime.substring(11, 19) }}
                        </div>
                      </template>
                      <div v-else class="font-size-13">暂无时间</div>
                      <div class="desc-triangle-one"></div>
                    </div>
                    <div class="desc-rate">
                      <div class="font-size-14">
                        {{ parseInt(item.score) }}%
                      </div>
                      <div class="font-s-12">相似率</div>
                    </div>
                  </div>
                </div>
              </div>
              <noDataPage message="暂时没有检索数据" v-else></noDataPage>
            </div>
          </div>
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
var ip='http://41.201.0.218:18888';
import PubSub from "pubsub-js";
import noDataPage from "@/components/noDataPage.vue";
import { startLoding, endLoding } from "@/request/loading.js";
import { searchFace, selPageFace, selBigImageUrl } from "@/api/faceForm_sj.js";
import { upload } from "@/api/publicsj.js";
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login_sj.js";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
export default {
  name: "faceLook",
  components: {
    TitleTwo,
    noDataPage,
  },
  data() {
    return {
      facecz: true,
      loading: false,
      queryParams: {
        img_usl: "",
        similarity: 50,
        maxNum: 100,
        // pageSize: 100, // 条数
        // pageNo: 1, //页数
      },
      queryParamsNew: {
        pageSize: 100, // 条数
        pageNo: 1, //页数
        have_next: true,
      },
      dataList: [],
      dataListNew: [],
      isscroll_rxjs: false,
      total: 0,
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
      selFile: null,
      lookInfo: {},
      lookList: [],
      lookSelIndex: 0,
      lookDetilBox: false,

      fileinfo: {
        uid: "",
      },
    };
  },
  methods: {
    cz() {
      this.queryParams = {
        img_usl: "",
        similarity: 50,
        maxNum: 100,
      };

      this.facecz = false;
      this.dataList=[];
      this.total = 0;

      setTimeout(() => {
        this.facecz = true;
      }, 300);
    },
    //滚动事件
    scrollEvent() {
      // 可存this指向
      var ts = this;
      var el = document.querySelector("#tabBox-rxjs");
      var offsetHeight = el.offsetHeight;

      var scrollTop = el.scrollTop;
      var scrollHeight = el.scrollHeight;
      if (offsetHeight + scrollTop - scrollHeight >= -1) {
        // 需要执行的代码
        console.log("已滚动到底部");
        if (!ts.isscroll_rxjs) {
          ts.isscroll_rxjs = true;
          ts.loasd();
        }
      }
    },
    loasd() {
      if (this.queryParamsNew.have_next) {
        this.queryParamsNew.pageNo = this.queryParamsNew.pageNo + 1;
        this.getDefaultList();
      }
    },
    // 获取页面默认数据
    async getDefaultList() {
      var that = this;
      var loading_lo;
      try {
        loading_lo = startLoding(".right-con");
        let param = new FormData();
        param.append("pageNo", that.queryParamsNew.pageNo);
        param.append("pageSize", that.queryParamsNew.pageSize);
        const res = await selPageFace(param);
        if (res.code == 200) {
          that.dataListNew = [...that.dataListNew, ...res.result];
          that.total = res.faceCount;
          // 判断返回条数是否等于设置条数
          if (that.queryParamsNew.pageSize == res.result.length) {
            that.queryParamsNew.have_next = true;
          } else {
            that.queryParamsNew.have_next = false;
          }
        } else {
          that.$message.error(res.message);
        }
        endLoding(loading_lo);
        that.isscroll_rxjs = false;
      } catch (err) {
        endLoding(loading_lo);
        that.isscroll_rxjs = false;
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
        // console.log("selFile",this.selFile)
        this.upLoad1(selFile);
        // this.queryParams.img_usl = URL.createObjectURL(data);
        // this.loading = false;
        // this.dialogVisible = false;
      });
    },
    // 剪裁---上传文件
    async upLoad1(file, isinit = false) {
       
       
        var res = await sysLogin({
          captcha: "",
          checkKey: "",
          password: '123456',
          username: 'admin',
      },ip);

      // sessionStorage.setItem("JC_Token", res.result.token);

      var tokens = res.result.token
    
    
      var res = await upload({ file: file ,tokens,ip});
      if (res.code == 200) {
        this.queryParams.img_usl = res.result;
        // this.selFile = file;
      }
      this.loading = false;
      this.dialogVisible = false;
    },
    async lookDetailFace2(item, index) {
      let newList = [];
      let newIndex = 10;
      if (index < 10) {
        newList = this.beiyong_list.slice(0, 20);
        newIndex = index;
      } else {
        newList = this.beiyong_list.slice(index - 10, index + 10);
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
    //人像大图详情
    async lookDetailFace(id) {
      let param = new FormData();
      param.append("id", id);

      
       
      var res = await sysLogin({
          captcha: "",
          checkKey: "",
          password: '123456',
          username: 'admin',
      },ip);

      // sessionStorage.setItem("JC_Token", res.result.token);

      var tokens = res.result.token

      var res = await selBigImageUrl({ id: id ,ip,tokens});
      if (res && res.result) {
        let item = {};
        item.originImageUrl = this.queryParams.img_usl;
        item.bigImageUrl = res.result;
        PubSub.publish("detail_box_type_show", 9);
        PubSub.publish("ret_face_data", item);
      }
    },
    //查询信息
    async selBtn() {
      var that = this;
      var loading_lo;
      this.total = 0;
      this.dataList = [];
      if (!this.queryParams.img_usl || this.queryParams.img_usl.length == 0) {
        this.$message.error("请选择查询人像图片");
        return;
      }
      try {
        loading_lo = startLoding(".right-con");
        this.loading = true;
        let param = new FormData();
        param.append("img_url", this.queryParams.img_usl);
        param.append("similarity", this.queryParams.similarity);
        param.append("maxNum", this.queryParams.maxNum);

        
       
        var res = await sysLogin({
          captcha: "",
          checkKey: "",
          password: '123456',
          username: 'admin',
      },ip);

      // sessionStorage.setItem("JC_Token", res.result.token);

      var tokens = res.result.token

      
        var res = await searchFace(param,ip,tokens);
        if (res.code == 200) {
          this.dataList = res.result ? res.result : [];
          this.total = res.count;
        } else {
          this.dataList = [];
          this.$message.error(res.message);
        }
        that.dataListNew = [];
        endLoding(loading_lo);
        this.loading = false;
      } catch (err) {
        endLoding(loading_lo);
        this.loading = false;
      }
    },

    //图片——鼠标按下
    mouseDown(e, url, name) {
      var that = this;
      let disX = e.clientX;
      let disY = e.clientY;
      // 鼠标拖动过程
      document.onmousemove = (e) => {
        e.preventDefault();
      };
      console.log("aaaaaaaaaaaa");
      // 鼠标松开
      document.onmouseup = (e) => {
        console.log("bbbbbbbbbbb");
        let left = e.clientX;
        let top = e.clientY;
        var img = $(".uplodeImgName").offset();
        let imgDivLeft = img.left;
        let imgDivTop = img.top;
        var imgw = $(".uplodeImgName").innerWidth();
        var imgh = $(".uplodeImgName").innerHeight();

        if (
          left < imgDivLeft + imgw &&
          left > imgDivLeft &&
          top < imgDivTop + imgh &&
          top > imgDivTop
        ) {
          that.fileinfo.uid = name;
          that.option.img = url;
          that.dialogVisible = true;
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  mounted() {
    // PubSub.publish("jc_header_show", true);
    // this.getDefaultList();
      window.onmessage=function(e){
          if(e.data.name=='X县'){
            ip = 'http://41.201.0.218:18888'
          }else if(e.data.name=='X县'){
            ip = 'http://41.208.9.226:18888'
          }else if(e.data.name=='X县'){
            ip = 'http://41.205.32.246:18888'
          }else if(e.data.name=='卧龙区'){
            ip = 'http://41.211.252.154:18888'
          }
      }
  },
};
</script>
<style lang='scss'>
.scsc{
  font-size:20px;/*no*/
}
.face-uploader {
  width: 100%;
  height: 100%;
  .el-upload--picture-card {
    width: 100%;
    height: 100%;
    border: none;
    .uploadBox {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-upload-dragger {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang='scss' scoped>
.index_container {
  width: 100%;
  height: 100%;
  background: #fff;
  // position: relative;

  .page-con {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 10%;
    left: 0;
    .left-box {
      position: fixed;
      top: 0%;
      left: 1%;
      width: 18.5%;
      height: 100%;
      display: flex;
      flex-direction: column;
      z-index: 1;
      border-right: 1px solid #ccc;
      .btnsp {
        display: flex;
        justify-content: space-between;
        .sel-btn {
          width: 48% !important;
        }
      }
      .el-input-number {
        margin: 10px 0;
        width: 100%;
      }
      .title-box {
        width: 100%;
        height: 40px;
      }
      .rate-box {
        margin-bottom: 10px;
      }
    }
    .right-box {
      position: fixed;
      top: 0%;
      right: 0;
      width: 80.4%;
      height: 100%;
      z-index: 2;
    }
  }

  .page-all {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .left-page {
    position: sticky;
    top: 0;
    min-width: 220px;
    .el-input-number {
      margin: 10px 0;
      width: 100%;
    }
    .title-box {
      width: 100%;
      height: 40px;
    }
    .rate-box {
      margin-bottom: 10px;
    }
  }
  .right-page {
    max-width: calc(100% - 220px);
    height: 100%;
  }
  .uplode-box {
    //   width: 340px;
    //   height: 309px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    color: #aaa;
    .uplode {
      // width: 240px;
      // height: 240px;
      width: 80%;
      height: 200px;
      background: #ffffff;
      border: 1px solid rgb(44,44,227);
      margin-bottom: 20px;
    }
  }
  .time-box {
    width: 100%;
    text-align: center;
    // line-height: 50px;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .sel-btn {
    margin-top: 40px;
    width: 100%;
    height: 48px;
    background: #97cdff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    color: #fff;
    background-image: url("../assets/image/button-1.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .box-all {
    width: 100%;
    height: 100%;
    .right-title {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 20px;
      box-sizing: border-box;
      // background: #a4f8ff;
      // color: #999999;
      .num {
        color: rgb(44,44,227);
        font-size: 12px;
      }
    }
    .right-con {
      width: 100%;
      height: calc(100% - 40px); /*no*/
      margin-left: 20px; /*no*/
      overflow-y: scroll;
      .tab-con {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        overflow-y: scroll;
        .tab-item {
          width: 134px; /*no*/
          height: 180px; /*no*/
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #fff;
          margin: 10px 0 0 12px; /*no*/
          font-size: 0;
          .portrait-desc {
            width: 100%; /*no*/
            height: 36px; /*no*/
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            background-color: rgb(44,44,227);
            color: #ffffff;
            border-left: 1px solid #78b6ee; /*no*/
            border-right: 1px solid #78b6ee; /*no*/
            border-bottom: 1px solid #78b6ee; /*no*/
            .desc-time {
              width: 65%;
              background-color: #fff;
              color: rgb(44,44,227);
              position: relative;

              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              line-height: 16px; /*no*/
              .desc-triangle-one {
                width: 0;
                height: 0;
                border-bottom: 36px solid rgb(44,44,227); /*no*/
                border-left: 12px solid transparent; /*no*/
                position: absolute;
                top: 0;
                right: 0;
              }
            }
            .desc-rate {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-size: 14px; /*no*/
              line-height: 16px; /*no*/
              width: 35%;
            }
            .font-s-12 {
              font-size: 12px; /*no*/
            }
          }
        }
      }
    }
    .font-size-14 {
      font-size: 14px; /*no*/
    }
    .font-size-13 {
      font-size: 13px; /*no*/
    }
  }
  .cropper-content {
    .cropper {
      width: 420px;
      height: 420px;
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
    .page-bk-box {
      width: 477px;
      height: 564px;
      background-image: url("../assets/image/upload.svg");
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
          background: rgb(44,44,227);
          border: 2px solid rgb(44,44,227);
          color: #fff;
          margin-right: 20px;
        }
        .btn-cancel {
          border: 2px solid rgb(44,44,227);
          background: #fff;
          color: rgb(44,44,227);
        }
      }
    }
  }
}
</style>