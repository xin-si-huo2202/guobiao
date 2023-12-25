<template>
  <div class="index_container padding-21">
    <div class="zhaiwei"></div>
    <div class="page-con">
      <div class="left-box">
        <div class="title-box">
          <title-two title="目标人像"></title-two>
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
          <div>只能上传.jpg/jpeg/png文件，且图片大小不超过5MB</div>
        </div>
        <div class="title-box">
          <title-two title="采集日期"></title-two>
        </div>
        <div class="time-box">
          <el-date-picker
            v-model="queryParams.startTime"
            type="datetime"
            placeholder="开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="start"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-top: 10px"
            v-model="queryParams.endTime"
            type="datetime"
            placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="end"
          >
          </el-date-picker>
        </div>
        <div class="title-box">
          <title-two title="相似率"></title-two>
        </div>
        <div class="rate-box">
          <el-slider v-model="queryParams.sim" :min="70"></el-slider>
          <div>建议选择90以上</div>
        </div>
        <div class="btnsp">
          <div class="sel-btn" @click="selBtn">查询</div>
          <div class="sel-btn" @click="cz">重置</div>
        </div>
      </div>

      <div class="right-box">
        <template v-if="facecz">
          <face
            :queryParams="queryParams"
            ref="faceComponents"
            @update_search_id="update_search_ids"
            @update_have_next="update_have_nexts"
            @changeUploadNew="changeUploadNew"
          ></face>
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
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
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
// import DatePicker from "vue2-datepicker";
// import "vue2-datepicker/index.css";
// import "vue2-datepicker/locale/zh-cn";
import TitleTwo from "@/components/basetool/TitleTwo.vue";
import Face from "@/components/CollectionRet/Face.vue";
import { upload } from "@/api/public.js";
import { getBase64, convertBase64ToBlob } from "../request/common.js";
import { v4 } from "uuid";
export default {
  name: "collectionRet",
  data() {
    return {
      start: {
        disabledDate: (time) => {
          if (this.queryParams.endTime) {
            return (
              time.getTime() > new Date(this.queryParams.endTime).getTime()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      end: {
        disabledDate: (time) => {
          if (this.queryParams.startTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.queryParams.startTime).getTime()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      },

      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      facecz: true,
      queryParams: {
        img_usl: "",
        search_id: null,
        have_next: 1,
        startTime: "",
        type: 1,
        endTime: "",
        sim: 90,
        pageSize: 100, // 条数
        pageNo: 1, //页数
      },
      total: 0,
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },

      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 200, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
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
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false,
      fileinfo: { uid: null },
    };
  },
  methods: {
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.queryParams.endTime) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.queryParams.endTime).getTime() < time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.queryParams.startTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.queryParams.startTime).getTime() > time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },

    update_have_nexts(data) {
      this.queryParams.have_next = data;
    },
    update_search_ids(data) {
      this.queryParams.search_id = data;
    },
    cz() {
      this.queryParams = {
        img_usl: "",
        search_id: null,
        have_next: 1,
        startTime: "",
        type: 1,
        endTime: "",
        sim: 90,
        pageSize: 100, // 条数
        pageNo: 1, //页数
      };

      this.facecz = false;

      setTimeout(() => {
        this.facecz = true;
      }, 300);
    },
    // 相似率修改
    getSlider(val) {
      this.queryParams.sim = val;
      this.$refs.faceComponents.getDataList(this.queryParams, 1);
    },
    async selBtn() {
      this.queryParams.startTime = this.queryParams.startTime
        ? this.queryParams.startTime
        : "";
      this.queryParams.endTime = this.queryParams.endTime
        ? this.queryParams.endTime
        : "";
      console.log("this.queryParams==", this.queryParams);
      this.$refs.faceComponents.getDataList(this.queryParams, 1);
    },

    //切换图片
    changeUpload(file) {
      console.log("file====", file);
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
      console.log("fileinfo", file);
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        this.dialogVisible = true;
      });
    },
    //图片拖拽
    changeUploadNew(url, name = "拖拽图片") {
      this.fileinfo.uid = name;
      this.option.img = url;
      this.dialogVisible = true;
    },
    async upLoad(file, isinit = false) {
      console.log("fileInfo====", file);
      const res = await upload({ file: file });
      if (res.code == 200) {
        this.queryParams.img_usl = res.result;
        this.queryParams.search_id = null;

        this.queryParams.cun_search_id = v4();
        // search_id:'',
        //have_next:1,

        if (isinit) {
          setTimeout(() => {
            this.selBtn();
          });
        }
      }
      this.loading = false;
      this.dialogVisible = false;
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = "face" + this.fileinfo.uid;
        this.loading = true;
        const file = new window.File([data], fileName, { type: "image/jpeg" });
        this.upLoad(file);
      });
    },
    xiba() {
      var yesterdsay = this.getNowTime(
        new Date(new Date().getTime() - 86400000 * 90)
      );
      var jkl = this.getNowTime(new Date());
      // this.queryParams.startTime =  yesterdsay + " 00:00:00"
      // this.queryParams.endTime = jkl + " 00:00:00"
      this.queryParams.startTime = yesterdsay;
      this.queryParams.endTime = jkl;
    },
    getNowTime(now) {
      // var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var hour = now.getHours();
      var minu = now.getMinutes();
      var sec = now.getSeconds();

      hour = hour.toString().padStart(2, "0");
      minu = minu.toString().padStart(2, "0");
      sec = sec.toString().padStart(2, "0");
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
      // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
      // console.log(yesterdsay)
      // debugger
      return defaultDate;
    },
  },
  components: {
    TitleTwo,
    Face,
  },
  mounted() {
    PubSub.publish("jc_header_show", true);
    this.xiba();
    // console.log($('#file1').val())
    // console.log(this.$refs.file.files)

    // getBase64(require("@/assets/image/def.jpg"))
    // .then((base64) => {
    //   var picFile = new File([convertBase64ToBlob(base64)], 'anonymous.png');
    //   // 上传
    //   this.upLoad(picFile,true)
    // }, (err) => {
    //   console.log(err);
    //   this.$Message.error('出现错误');
    //   debugger
    // });
  },
  activated() {
    PubSub.publish("nmhead");
  },
};
</script>
<style lang='scss'>
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
  position: relative;

  .zhaiwei {
    height: 9%;
  }
  .page-con {
    width: 100%;
    height: 91%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .left-box {
      position: fixed;
      top: 10%;
      left: 1%;
      width: 18.5%;
      height: 90%;
      display: flex;
      flex-direction: column;
      z-index: 1;

      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
        height: 34px;
      }
      .title-box {
        width: 100%;
        height: 40px;
      }

      .uplode-box {
        width: 340px;
        // height: 309px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        color: #aaa;
        .uplode {
          width: 240px;
          height: 240px;
          background: #ffffff;
          border: 1px solid #00beff;
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
      @media screen and (max-height: 1250px) {
        .uplode-box {
          width: 340px;
          // height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          color: #aaa;
          .uplode {
            width: 240px;
            height: 180px;
            background: #ffffff;
            border: 1px solid #00beff;
            margin-bottom: 10px;
          }
        }
        .sel-btn {
          margin-top: 10px;
        }
      }
      .rate-box {
        display: grid;
        padding: 10px 0;
        grid-template-columns: 200px auto;
        align-items: center;
        justify-content: space-between;
        color: #aaaaaa;
      }

      .mx-datepicker {
        width: 100%;
      }
    }
    .right-box {
      position: fixed;
      top: 10%;
      right: 0;
      width: 80.4%;
      height: 90%;
      z-index: 2;
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
.cropper-content {
  .cropper {
    width: 420px;
    height: 420px;
  }
}
.border {
  border: 1px solid red;
  box-sizing: border-box;
}

.btnsp {
  display: flex;
  justify-content: space-between;
  .sel-btn {
    width: 48% !important;
  }
}
</style>
