<template>
  <div class="title">
    <div class="title-top">
     
      <div class="title-box" :class='$route.path=="/diaodu2"?"nysj_the":""'>
        {{ title }}
        <slot></slot>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TitleTwo",
  data() {
    return {};
  },
  computed: {},
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 100%;
  position: relative;
  .title-top {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 2px);
    .title-box {
      background: linear-gradient(
        90deg,
        #a4f8ff 0%,
        rgba(164, 248, 255, 0) 100%
      );
      padding-left: 0px;
      height: 100%;
      width: 100%;
      color: #00beff;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
     
      &.nysj_the{
        background: linear-gradient(
          90deg,
          #005258 0%,
          #001E64 100%
        );
        color:#fff;
        text-indent:10px;
      }
    }
    .triangle {
      width: 0;
      height: 0;
      border-bottom: 38px solid #a4f8ff;
      border-left: 28px solid transparent;
      border-top-width: calc(100% - 2px);
    }
  }
  .title-line {
    height: 2px;
    width: 100%;
    background: linear-gradient(90deg, #00beff 0%, rgba(221, 221, 221, 0) 100%);
    &.nysj_the{
        background: linear-gradient(
          90deg,
          #a4f8ff 0%,
          #001E64 100%
        );
      }
  }
}
// .title-item {
//   height: 75%;
//   padding: 0 20px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
</style>