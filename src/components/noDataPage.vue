<template>
    <div class="no-data-box">
        <img class="no-data-img" :src="require('@/assets/image/default-null.svg')">
        <div class="no-data-str">{{message}}</div>
    </div>
</template>
<script>
export default {
    name:"nodatapage",
    props:{
        message:{
            type:String,
            default:""
        }
    },
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
.no-data-box{
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.no-data-img{
    width: 150px;
    height: 150px;

}
.no-data-str{
    font-size: 18px;
    color: #999;

}
</style>