<template>
  <div class="page">
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
      <div class="text">上传目标人像</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
    };
  },
  methods: {
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = "face" + this.fileinfo.uid;
        this.loading = true;
        const file = new window.File([data], fileName, { type: "image/jpeg" });
        // this.upLoad(file);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.cropper-content {
  .cropper {
    width: 420px;
    height: 420px;
  }
}
.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #999;
  opacity: 0.9;
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
    padding: 90px 0 48px 0;
    position: relative;
    .text{
      position: absolute;
      top: 10px;
      left: 20px;
      color: #fff;
    }
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
</style>