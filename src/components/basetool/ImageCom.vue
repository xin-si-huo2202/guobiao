<template>
  <div class="page-img">
    <div class="image-move-wapper">
      <div class="image-show-box" ref="imageShowBox">
        <div
          class="drag-container"
          ref="dragContainer"
          :style="
            'left:' +
            dragContainer.newPoint.left +
            'px; top:' +
            dragContainer.newPoint.top +
            'px'
          "
          @mousedown="DragContainerMouseDown"
        >
          <div class="drag-image-box">
            <img
              :src="src"
              class="imgBox"
              :class="imageHeight==1?'img1':imageHeight==2?'img2':imageHeight==3?'img3':''"
              draggable="false"
              object-fit="contain"
              ref="imgDiv"
              @mousewheel="bigimg($event)"
            />
          </div>
        </div>
      </div>
    </div>
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
      dragContainer: {
        box: {
          w: 0,
          h: 0,
        },
        point: {
          left: 0,
          top: 0,
        },
        newPoint: {
          left: 0,
          top: 0,
        },
      },
      mousePoint: {
        x: 0,
        y: 0,
      },
      imageShowBox: {
        box: {
          w: 0,
          h: 0,
        },
        dragcheck: {
          h: true,
          v: true,
        },
      },
    };
  },
  updated() {
    let _this = this;
    // 确保DOM元素已经渲染成功，然后获取拖拽容器和显示区域的大小
    _this.$nextTick(function () {
      _this.dragContainer.box = {
        w: _this.$refs.dragContainer.offsetWidth,
        h: _this.$refs.dragContainer.offsetHeight,
      };

      _this.imageShowBox.box = {
        w: _this.$refs.imageShowBox.offsetWidth,
        h: _this.$refs.imageShowBox.offsetHeight,
      };

      // 判断是否允许拖拽
      _this.imageShowBox.dragcheck = {
        h: _this.imageShowBox.box.w > _this.dragContainer.box.w ? false : true,
        v: _this.imageShowBox.box.h > _this.dragContainer.box.h ? false : true,
      };
    });
  },
  methods: {
    // 鼠标在拖拽容器中按下时触发
    DragContainerMouseDown(e) {
      const _this = this;
      // 记录鼠标点击时的初始坐标
      this.mousePoint = {
        x: e.clientX,
        y: e.clientY,
      };
      _this.dragContainer.point = _this.dragContainer.newPoint;
      document.body.onmousemove = _this.DragContainerMouseMove;
      document.onmouseup = _this.DragContainerMouseUp;
      return false;
    },
    // 容器拖拽时触发
    DragContainerMouseMove(e) {
      const _this = this;
      // 鼠标偏移量 = 初始坐标 - 当前坐标
      let dx = e.clientX - _this.mousePoint.x;
      let dy = e.clientY - _this.mousePoint.y;

      // 获取拖拽容器移动后的left和top值
      if (_this.imageShowBox.dragcheck.h)
        var newx =
          dx > 0
            ? Math.min(0, _this.dragContainer.point.left + dx)
            : Math.max(
                -_this.dragContainer.box.w + _this.imageShowBox.box.w,
                _this.dragContainer.point.left + dx
              );
      if (_this.imageShowBox.dragcheck.v)
        var newy =
          dy > 0
            ? Math.min(0, _this.dragContainer.point.top + dy)
            : Math.max(
                -_this.dragContainer.box.h + _this.imageShowBox.box.h,
                _this.dragContainer.point.top + dy
              );

      _this.dragContainer.newPoint = {
        left:
          typeof newx != "undefined" ? newx : _this.dragContainer.point.left,
        top: typeof newy != "undefined" ? newy : _this.dragContainer.point.top,
      };
      console.log(_this.dragContainer.newPoint);
      return false;
    },
    // 移动完成  取消onmousemove和onmouseup事件
    DragContainerMouseUp(e) {
      document.body.onmousemove = null;
      document.onmouseup = null;
    },
    PointMouseDown(e) {
      console.log("ss", e);
      //阻止事件冒泡
      e.stopPropagation();
    },

    // 缩放图片
    bigimg(e) {
      console.log("缩放图片", e);
      //   let box = this.$refs.imgDiv;
      let box = document.querySelector(".imgBox");
      console.log("box", box.offsetWidth);
      //获取图片的当前大小
      var wSize = box.offsetWidth;
      var hSize = box.offsetHeight;
      // 分别计算出scaleX,scaleY的倍数
      let scaleX = e.offsetX / wSize;
      let scaleY = e.offsetY / hSize;
      //console.log(e.screenX)
      //滚轮上下滚动值
      var UpDown = event.wheelDelta;
      // console.log(UpDown)
      //大于0滚轮向上滚动,小于0滚轮向下滚动
      if (UpDown > 0) {
        this.MaxBen();
      } else {
        this.MinBen();
      }
      // 鼠标为中心的开始点,如果去掉这个将会以左上角开始滚动图片
      let newWidth = box.offsetWidth;
      let newHeight = box.offsetHeight;
      box.style.left = box.offsetLeft - scaleX * (newWidth - wSize) + "px";
      box.style.top = box.offsetTop - scaleY * (newHeight - hSize) + "px";
      return false; //阻止默认事件
    },
    MaxBen() {
      this.iszoom = true;
      //   let box = this.$refs.imgDiv;
      let box = document.querySelector(".imgBox");
      let boxPhotoDetail = document.querySelector(".page-img");
      var wDSize = boxPhotoDetail.offsetWidth;
      var hDSize = boxPhotoDetail.offsetHeight;
      //获取图片的当前大小
      var wSize = box.offsetWidth;
      var hSize = box.offsetHeight;
      console.log("wSize", wSize);
      if (wSize < 3500) {
        wSize += wDSize * 0.1;
        hSize += hDSize * 0.1;
        //  this.ratio = `当前比例：${this.deg}`
        box.style.width = wSize += "px";
        box.style.height = hSize += "px";
      }
    },
    MinBen() {
      this.iszoom = true;
      //   let box = this.$refs.imgDiv;
      let box = document.querySelector(".imgBox");
      let boxPhotoDetail = document.querySelector(".page-img");
      var wDSize = boxPhotoDetail.offsetWidth;
      var hDSize = boxPhotoDetail.offsetHeight;
      //获取图片的当前大小
      var wSize = box.offsetWidth;
      var hSize = box.offsetHeight;
      if (wSize > 600) {
        // this.deg = --this.deg
        wSize -= wDSize * 0.1;
        hSize -= hDSize * 0.1;
        // this.ratio = `当前比例：${wSize}`
        box.style.width = wSize += "px";
        box.style.height = hSize += "px";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-img {
  background: #444;
  width: 100%;
  height: 100%;
  position: relative;
  .image-move-wapper {
    width: 100%;
    height: 100%;
    // position: absolute;
    // right: 50px;
    // top: 50px;
    background: #fff;
    box-shadow: rgba(255, 255, 255, 0.5);
    // padding: 10px;
  }
  .image-show-box {
    width: 100%;
    height: 100%;
    cursor: move;
    overflow: hidden;
    position: relative;
    .drag-container {
      min-height: 100%;
      min-width: 100%;
      position: absolute;
      left: 0px;
      top: 0;
      /*禁止元素选中*/
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
      .drag-image-box {
        position: relative;
        img {
          width: 100%;
          // height: calc(100vh - 1.2rem - 38px);
        }
        .point {
          position: absolute;
          background: red;
          height: 30px;
          width: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>