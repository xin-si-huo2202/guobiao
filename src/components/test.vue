<template>
  <div class="scroll-box">
      <slot></slot>
  </div>
</template>

<script>
export default {
    mounted(){
        let that=this;
        document.querySelector(".scroll-box").addEventListener('scroll',function(){
            let box1 = document.querySelector(".scroll-box");


            console.log("aaaaaaaaaa")
            console.log("scrollTop==",box1.scrollTop)
            console.log("innerHeight==",box1.clientHeight)
            console.log("offsetHeight==",box1.scrollHeight)
            if(box1.scrollTop+box1.clientHeight>=box1.scrollHeight){
                console.log("一滚动到底部");
            }
        })
    },
    data(){
        return{
            height:1600,
        }
    },
    methods:{

    }
}
</script>

<style lang='scss' scoped>
.scroll-box {
  width:1200px;
  height: 800px;
  border: 1px solid red;
  overflow: scroll;
}
</style>