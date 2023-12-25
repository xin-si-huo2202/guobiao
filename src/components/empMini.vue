<template>
  <div class="empMini_container">
    <img
      :class="istarc ? 'guiji-nodata' : ''"
      :src="require('@/assets/image/default-null.svg')"
    />
    <p class="titnodata">暂无数据</p>
  </div>
</template>

<script>
export default {
  name: "empMini",
  props: ["istarc"],
  data() {
    return {};
  },
  destroyed() {},
  watch: {},
  methods: {},

  mounted() {},
  components: {},
};
</script>

<style lang='scss' scoped>
.empMini_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 25%;

    &.guiji-nodata {
      width: 45%;
      height: auto;
    }
  }
}

.titnodata {
  color: #78b6ee;
  margin-top: 3px;
}
</style>
