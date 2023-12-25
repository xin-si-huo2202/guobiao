<template>
  <div class="title-box">
    <div class="title-item" :class="selType == -1 ? 'title-btn' : ''"  @click="choose(-1)" v-if="titleH&&titleH.length>0">
      {{ titleH }}
    </div>
    <div class="title-item" :class="selType == 1 ? 'title-btn' : ''"  @click="choose(1)">
      {{ titleH1 }}
    </div>
    <template v-if='titleH2'>
      <div class="title-item" :class="selType == 2 ? 'title-btn' : ''"  @click="choose(2)">
        {{ titleH2 }}
      </div>
    </template>
    <template v-if='titleH3'>
      <div class="title-item" :class="selType == 3 ? 'title-btn' : ''"  @click="choose(3)">
        {{ titleH3 }}
      </div>
    </template>
    <template v-if='titleH4'>
      <div class="title-item" :class="selType == 4 ? 'title-btn' : ''"  @click="choose(4)">
        {{ titleH4 }}
      </div>
    </template>
  
  </div>
</template>

<script>
export default {
  name: "TitleOne",
  data() {
    return {
      selType:1
    };
  },
  computed: {},
  props: {
    titleH:{
      type: String,
      default: "",
    },
    titleH1: {
      type: String,
      default: "",
    },
    titleH2: {
      type: String,
      default: "",
    },
    titleH3: {
      type: String,
      default: "",
    },
    titleH4: {
      type: String,
      default: "",
    },
    selTypedefault:{
      type: Number,
      default: 1,
    }
  },
  mounted(){
    this.selType=this.selTypedefault
  },
  methods: {
    

    choose(type){
      this.selType=type
  
      this.$emit('choosetab',type)
    }
  
  }
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
}
.title-item {
  height: 75%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: 500;
  font-size: 14px;
  cursor:pointer;
}
.title-btn {
  background-image: url("./images/title-button.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
</style>