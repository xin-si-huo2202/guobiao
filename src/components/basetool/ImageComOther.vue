<template>
  <div class="showImg" @mousewheel="bbimg(this)">
    <img
      :src="src"
      alt=""
      class="a1"
      :class="
        imageHeight == 1
          ? 'img1'
          : imageHeight == 2
          ? 'img2'
          : imageHeight == 3
          ? 'img3'
          : imageHeight == 4
          ? 'img4'
          : ''
      "
      :style="test"
      @mousedown="imgMove"
      @mouseover="overfunc"
    />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
    },
    imageHeight: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      test: "",
      test1: "",
      test2: "",
      params: {
        zoomVal: 1,
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        flag: false,
      },
      file: "",
    };
  },
  updated() {},
  methods: {
    // 实现图片放大缩小
    bbimg() {
      let e = e || window.event;
      this.params.zoomVal += e.wheelDelta / 1200;
      if (this.params.zoomVal >= 0.2) {
        this.test2 = `transform:scale(${this.params.zoomVal},${this.params.zoomVal});`;
        this.test = this.test1 + this.test2;
      } else {
        this.params.zoomVal = 0.2;
        this.test2 = `transform:scale(${this.params.zoomVal},${this.params.zoomVal});`;
        this.test = this.test1 + this.test2;
        return false;
      }
    },
    overfunc(e) {
      console.log("overfunc", e);
    },
    // 实现图片拖拽
    imgMove(e) {
      let oImg = e.target;
      let disX = e.clientX - oImg.offsetLeft;
      let disY = e.clientY - oImg.offsetTop;
      document.onmousemove = (e) => {
        e.preventDefault();
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        this.test1 = `left: ${left}px;top: ${top}px;`;
        this.test = this.test1 + this.test2;
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.showImg {
  background-color: rgba(0, 0, 0, 1);
  // position: fixed;
  // position: absolute;
  z-index: 20;
  margin: 0 auto;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img1 {
  height: calc(85vh - 40px);
}
.img2 {
  height: calc(95vh - 40px);
}
.img3 {
  height: calc(85vh - 40px);
}
.img4 {
  height: calc(95vh - 178px);
}
.a1 {
  // left: 0;
  top: 0;
  position: absolute;
  z-index: 22;
 max-width: 100%;
  // margin-top: 40px;
  cursor: move;
}
.zoom-box {
  cursor: zoom-in;
}
.photo_box {
  margin: 0 5px 5px 0;
}
</style>