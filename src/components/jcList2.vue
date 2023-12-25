<template>
    
    <div class="index_container depTree bg_color_white jcList" >
         <div class="car_item all" @click="alls" :class='$route.path=="/diaodu2"?"nysj_the":""'>
            <p>全部</p>

        </div>

        <div class="ui_box">
            <!-- <div class="ui_con" v-infinite-scroll="loasd" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled'> -->
            <div class="ui_con" >
                <template v-if='carList.length!=0'> 

                    <div v-for="(val) in carList" :key='val.id' class="car_item" :class='$route.path=="/diaodu2"?"nysj_the":""'>
                        <p @click='xiala(val)' @dblclick="fasong(val)" > <span>{{val.sysOrgCode_dictText}}-{{val.carNumber}}</span> </p>

                       

                        <ul v-if='val.xiala_bool' >
                            <li  @click.stop="new_bf(1,'云台',val)">云台</li>
                            <li @click.stop="new_bf(2,'左前摄像机',val)">左前摄像机</li>
                            <li @click.stop="new_bf(3,'左中前摄像机',val)">左中前摄像机</li>
                            <li @click.stop="new_bf(4,'右中前摄像机',val)">右中前摄像机</li>
                            <li @click.stop="new_bf(5,'右前摄像机',val)">右前摄像机</li>
                            <li @click.stop="new_bf(6,'左后摄像机',val)">左后摄像机</li>
                            <li @click.stop="new_bf(7,'左中后摄像机',val)">左中后摄像机</li>
                            <li @click.stop="new_bf(8,'右中后摄像机',val)">右中后摄像机</li>
                            <li @click.stop="new_bf(9,'右后摄像机',val)">右后摄像机</li>
                        </ul>
                    </div>

                
                </template>

                <template v-if='carList.length==0'> 
                    <EmpMini />
                </template>
            
            </div>
        </div>
        
     
       
    </div>
    
</template>

<script>
import { Message,Loading } from 'element-ui'
import { queryAllPoliceAndDev,selectDept,gyxyPcInformation } from '@/api/system.js'
import {startLoding,endLoding} from '@/request/loading.js'
import EmpMini from './empMini.vue';
import { v4 } from 'uuid';
export default {
    name:'jcList',
    props:[
       'detid'
    ],
    data () {
        return {
            carList:[],
            pagesize:1,
            sysOrgCode:'',
            infinitedisabled:true,
            time:null
        };
    },
    destroyed() {
       
    },
    watch: {
		detid:{
			handler(newss, old) {
				 
		

                this.shitch_dep(newss)
				
					
    		},
    
    		immediate: false
			

		}
    },
    methods: {
        new_bf(index,name,val){
            var p = Object.assign({}, val, {change: v4(),ip:val.gbInfomation,index,name})
            
            this.$emit('newBf',p)
        },
        xiala(val){
            var that = this
                // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
                clearTimeout(that.time)
                that.time = setTimeout(() => {
                    // 写单击事件执行的逻辑代码
                    this.carList.forEach((item,i)=>{
                        if(val.id==item.id){
                            this.$set( this.carList, i,{...item,xiala_bool:!item.xiala_bool} )
                        }
                    })
            },300)

             
        },
        alls(){
            this.shitch_dep('')

            this.$emit('clear_jcid')
        },
        shitch_dep(sysOrgCode){
      
            this.carList=[]
            this.pagesize=1
                
            this.sysOrgCode=sysOrgCode

            this.ggp()

   
        },
        
        loasd(){
           this.pagesize = this.pagesize+1

           this.ggp()
        },
        fasong(data){
             clearTimeout(this.time)
            // console.log(this.$route.path)
            // debugger
            if(this.$route.path=='/diaodu' || this.$route.path=="/diaodu2"){
                
               

                // if(data.ptzStatus==0){
                    
                //     // Message({
                //     //     showClose: true,
                //     //     message:'警车不在线',
                //     //     type:'error',
                //     //     duration:2000
                //     // })
                //     return
                // }

                // data.change = v4()
                var p = Object.assign({}, data, {change: v4(),ip:data.gbInfomation,type:'all'})
                this.$emit('song',p)

            }else if(this.$route.path=='/collectInfo'){
               
                
                var p = Object.assign({}, data, {change: v4(),ip:data.gbInfomation})
                this.$emit('song',p)
            
            }else if(this.$route.path=='/warningInfo'){
               
                
                var p = Object.assign({}, data, {change: v4(),ip:data.gbInfomation})
                this.$emit('song',p)
            
            }
            
        },
        async ggp() {
            var loading_lo;
            try {
                // loading_lo=startLoding('.ui_box')
                this.infinitedisabled = true;
                var res = await gyxyPcInformation(this.sysOrgCode, this.pagesize);
                // endLoding(loading_lo)

                // this.infinitedisabled =false

                if (res && res.result && res.result.records.length != 0) {
                let arrCar = res.result.records;

                var L1 = [],
                    L2 = [],
                    L3 = [];
                // arrCar.forEach((item, i) => {
                //   if (
                //     item.nvrStatus &&
                //     (item.ptzStatus == 1 ||
                //       item.flStatus == 1 ||
                //       item.frStatus == 1 ||
                //       item.lgStatus == 1 ||
                //       item.rgStatus == 1 ||
                //       item.fmlStatus == 1 ||
                //       item.fmrStatus == 1 ||
                //       item.lmgStatus == 1 ||
                //       item.rmgStatus == 1)
                //   ) {
                //     L1.push(item);
                //   }
                // });

                // arrCar = L1;

                this.carList = [...this.carList, ...arrCar];

                this.carList.forEach((item, i) => {
                    item.xiala_bool = true;
                });

                this.$emit("addCar", this.carList);
                }
            } catch (err) {
                console.log(err);

                // endLoding(loading_lo)
                // this.infinitedisabled =false
                Message({
                showClose: true,
                message: "网络异常",
                type: "error",
                duration: 2000,
                });
            }
        }                                   
    },

    mounted (){
     
        this.ggp()

    },
    components: {
        EmpMini
    },
}
</script>

<style lang='scss' scoped>

    .index_container{
        width: 100%;
        height: 100%;
        padding: 10px 0;
        box-sizing: border-box;
        // overflow-y: scroll;
        // overflow-x: hidden;
    }

    .ui_box{
        width: 100%;
        height: calc(100% - 50px);
      
        overflow: hidden;
        // min-height: 100px;/*no*/
    }

    .ui_con{
        width: 100%;
        height: 100%;
       
        overflow-y: scroll;
    }

    .car_item{
        width: 100%;
       
        color: #78b6ee;
        padding:6px 18px;
        box-sizing: border-box;
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        &.nysj_the{
            color:#000
        }
        li{
           text-indent: 20px;
           list-style:none
        }

        li:focus{
            background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
            color:#2cc6ff ;
        }
        li:hover{
            background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
            color:#2cc6ff ;
        }

        p{
            display:flex;
            align-items:center;
        }
        // &:focus{
        //     background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
        //     color:#2cc6ff ;
        // }

        // &:hover{
        //     background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
        //     color:#2cc6ff ;
        // }

        // &.all{
        //     height: 30px;
        //     box-sizing: content-box;
        // }
    }
    
</style>
