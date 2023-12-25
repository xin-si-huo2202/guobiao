<template>
  <div class="title-box">
    <div class="title-item">
      <span class="gongji">共计:</span>

      <span class="num">{{ title?title:0 }}条</span>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleThree",
  data() {
    return {};
  },
  computed: {},
  props: {
    title: {}
  },
};
</script>

<style lang="scss" scoped>
//11c1fe
.title-box {
  background-image: url("./images/title-bg.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  box-sizing: border-box;
}
.title-item {
  height: 75%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00beff;
  font-weight: 600;
  font-size: 16px;
}

.gongji{
  color: #999999;
  margin-left: 30px;
}

.num{
  margin-left: 11px;
}
</style>