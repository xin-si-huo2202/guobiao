<template>
    
    <div class="index_container depTree bg_color_white jcList" >
      

        <div class="ui_box">
            <!-- <div class="ui_con" v-infinite-scroll="loasd" :infinite-scroll-immediate='false' :infinite-scroll-disabled='infinitedisabled'> -->
            <div class="ui_con" >
                <template v-if='!isno'> 

                    <template v-for="(val) in carList">
                        <div  v-if='val.nvrStatus && (val.ptzStatus == 1 || val.flStatus == 1 || val.frStatus == 1 || val.lgStatus == 1 || val.rgStatus == 1 || val.fmlStatus == 1 || val.fmrStatus == 1 || val.lmgStatus == 1 || val.rmgStatus == 1) ' :key='val.id' class="car_item" :class='$route.path=="/diaodu2"?"nysj_the":""'>
                            <p @click='xiala(val)' > 
                                <img v-if='val.xiala_bool' class='xiala_tb' src='../assets/image/x_arr.png' /> 
                                <img v-if='!val.xiala_bool' class='xiala_tb' src='../assets/image/r_arr.png' /> 
                                <span>{{val.sysOrgCode_dictText}}-{{val.carNumber}}</span> 
                            </p>

                        

                            <ul v-if='val.xiala_bool' >
                                <li v-if='val.ptzStatus'  @click.stop="new_bf(1,'云台',val)">云台</li>
                                <li v-if='val.flStatus' @click.stop="new_bf(2,'左前摄像机',val)">左前摄像机</li>
                                <li v-if='val.fmlStatus' @click.stop="new_bf(3,'左中前摄像机',val)">左中前摄像机</li>
                                <li v-if='val.fmrStatus' @click.stop="new_bf(4,'右中前摄像机',val)">右中前摄像机</li>
                                <li v-if='val.frStatus' @click.stop="new_bf(5,'右前摄像机',val)">右前摄像机</li>
                                <li v-if='val.lgStatus' @click.stop="new_bf(6,'左后摄像机',val)">左后摄像机</li>
                                <li v-if='val.lmgStatus' @click.stop="new_bf(7,'左中后摄像机',val)">左中后摄像机</li>
                                <li v-if='val.rmgStatus' @click.stop="new_bf(8,'右中后摄像机',val)">右中后摄像机</li>
                                <li v-if='val.rgStatus' @click.stop="new_bf(9,'右后摄像机',val)">右后摄像机</li>
                            </ul>
                        </div>
                    </template>
                    

                
                </template>

                <template v-if='isno'> 
                    <EmpMini />
                </template>
            
            </div>
        </div>
        
     
       
    </div>
    
</template>

<script>
import { Message,Loading } from 'element-ui'
import { queryAllPoliceAndDev,selectDept,gyxyPcInformation2 } from '@/api/system.js'
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login.js";
import {startLoding,endLoding} from '@/request/loading.js'
import { getVideoUrl ,hikControl,getVideoUrl2,hikControl2,getVideoUrlback, getCameraCode} from '@/api/hkvideo.js'
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
            time:null,
            isno:true
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
			

		},
        carList:{
            handler(newss, old) {
				 
                var numjk=0;
                newss.forEach((item,i)=>{
                    if(item.nvrStatus){
                        
                        numjk+=1
                    }
                })
               
				if(numjk){
                    this.isno=false
                }else{
                    this.isno=true
                }
					
    		},
    
    		immediate: true,

            deep:true
        }
    },
    methods: {
        async new_bf(index,name,val){
           
            try{
                var res = await  getCameraCode({channelNo:index,code:val.gbInfomation})
                    
                var bianhao = res.result
            

                var vnb = {
                    bianhao
                }


                window.parent.postMessage({
                    message: 'getCrossHeight',
                    height:JSON.stringify(vnb),
                }, '*');

            }catch(e){
                window.parent.postMessage({
                    message: 'getCrossHeight',
                    error:`未获取到${val.carNumber}的nvr信息`,
                }, '*');

                // Message({
                //     showClose: true,
                //     message:`未获取到${val.carNumber}的nvr信息`,
                //     type:'error',
                //     duration:2000
                // })
            }

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
        async ggp(){
            var loading_lo;
            try {

                var res = await sysLogin({
                    captcha: "",
                    checkKey: "",
                    password: '123456',
                    username: 'admin',
                });
                if (res && res.result) {
                   
                    sessionStorage.setItem("JC_Token", res.result.token);
                    sessionStorage.setItem(
                        "UserInfo",
                        JSON.stringify(res.result.userInfo)
                    );
                    sessionStorage.setItem(
                        "userinfo",
                        JSON.stringify(res.result.userInfo)
                    );
                }
                
				// loading_lo=startLoding('.ui_box')
                this.infinitedisabled =true
              
                var res = await gyxyPcInformation2(this.sysOrgCode,this.pagesize)
                // endLoding(loading_lo)
                
                // this.infinitedisabled =false
        
               if(res && res.result && res.result.records.length!=0){
                
                  
                    let arrCar = res.result.records;
                
                    var L1=[],L2=[],L3=[];
                    arrCar.forEach((item,i)=>{
                        if(item.nvrStatus && (item.ptzStatus == 1 || item.flStatus == 1 || item.frStatus == 1 || item.lgStatus == 1 || item.rgStatus == 1 || item.fmlStatus == 1 || item.fmrStatus == 1 || item.lmgStatus == 1 || item.rmgStatus == 1) ){
                            L1.push(item)
                        }
                    })
                    
                    // arrCar = L1
                    

                    this.carList = [...this.carList,...arrCar]

                    
       
                    this.carList.forEach((item,i)=>{
                        item.xiala_bool=true
                    })


                    

                    // this.$emit('addCar',this.carList)
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
     
        

        PubSub.subscribe('jc_updata',(msg,data)=>{
            this.carList.forEach((item,i)=>{
                // debugger
                if(data.carNumber==item.carNumber){
                    item.pcStatus=data.pcStatus
                    item.boxStatus=data.boxStatus
                    item.nvrStatus=data.nvrStatus
                    item.ptzStatus = data.ptzStatus
                    item.flStatus = data.flStatus
                    item.frStatus = data.frStatus
                    item.lgStatus = data.lgStatus
                    item.rgStatus = data.rgStatus
                    item.fmlStatus = data.fmlStatus
                    item.fmrStatus = data.fmrStatus
                    item.lmgStatus = data.lmgStatus
                    item.rmgStatus = data.rmgStatus
                }
            })
        })


        this.ggp()
    },
    components: {
        EmpMini
    },
}
</script>

<style lang='scss' scoped>
    .xiala_tb{
        width:15px;/*no*/
        margin-right:2px;
    }
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
        height: 100%;
      
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
           text-indent: 30px;/*no*/
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
