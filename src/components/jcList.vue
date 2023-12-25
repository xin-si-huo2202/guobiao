<template>
    
    <div class="index_container depTree bg_color_white jcList" >
         <div class="car_item all" @click="alls">
            <p>全部</p>

        </div>

        <div class="ui_box">
            <!-- <div class="ui_con" v-infinite-scroll="loasd" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled'> -->
            <div class="ui_con" >
                <template v-if='carList.length!=0'> 

                    <div v-for="(val) in carList" :key='val.id' class="car_item" @click="fasong(val)" >
                        <p>{{val.sysOrgCode_dictText}}-{{val.carNumber}}</p>

                  
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
            infinitedisabled:true
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
            
            var p = Object.assign({}, data, {change: v4(),ip:data.gbInfomation})
            this.$emit('song',p)
            
        },
        async ggp(){
            var loading_lo;
            try {
				// loading_lo=startLoding('.ui_box')
                this.infinitedisabled =true
                var res = await gyxyPcInformation(this.sysOrgCode,this.pagesize)
                // endLoding(loading_lo)
                
                // this.infinitedisabled =false
          
               if(res && res.result && res.result.records.length!=0){
                
                  
                    let arrCar = res.result.records;

                    this.carList = [...this.carList,...arrCar]


                    this.$emit('addCar',this.carList)
               }
				
            }catch (err) {
                console.log(err)
            
                // endLoding(loading_lo)
                // this.infinitedisabled =false
				Message({
					showClose: true,
					message:'网络异常',
					type:'error',
					duration:2000
                })
              
            }
          
        },
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:focus{
            background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
            color:#2cc6ff ;
        }

        &:hover{
            background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
            color:#2cc6ff ;
        }

        // &.all{
        //     height: 30px;
        //     box-sizing: content-box;
        // }
    }
    
</style>
