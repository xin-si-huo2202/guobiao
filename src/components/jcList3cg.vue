<template>
    
    <div class="index_container depTree bg_color_white jcList" >
       
      

        <div class="ui_box">
           
           
            <div class='sear_box'>
                <el-input
                    class='sear'
                    size='small'
                    placeholder="车牌号搜索"
                    prefix-icon="el-icon-search"
                    v-model="input2">
                </el-input>
                
                <el-button class='sear_btn' type="warning" icon="el-icon-delete" size='mini' @click='xx'>重置</el-button>
                
        
            </div> 
           
            <div class="ui_con" >

                <div class='jkbox'></div>

                <template v-for="(val) in treelist" >
                    <div :class='val.id'>

                        <div class='xm'>{{val.countyName}}</div>

                        <template v-if='val.pcInformations.length!=0'>
                            <div v-for="(val) in val.pcInformations" :carnum='val.carNumber' v-if='val.nvrStatus && (val.ptzStatus == 1 || val.flStatus == 1 || val.frStatus == 1 || val.lgStatus == 1 || val.rgStatus == 1 || val.fmlStatus == 1 || val.fmrStatus == 1 || val.lmgStatus == 1 || val.rmgStatus == 1) ' :key='val.id' class="car_item" :class='val.ads'>
                                <template v-if='!input2 || val.carNumber.indexOf(input2)!=-1 '>
                                    <p @click='xiala(val,"tb")' @dblclick="new_bf_all(val,'tb')" > 
                                        <img v-show='val.xiala_bool' class='xiala_tb' src='../assets/image/x_arr.png' /> 
                                        <img v-show='!val.xiala_bool' class='xiala_tb' src='../assets/image/r_arr.png' /> 
                                        <span>{{val.departName}}-{{val.carNumber}}</span> 
                                    </p>

                                

                                    <ul v-show='val.xiala_bool' >
                                        <li  @dblclick.stop="new_bf(1,'球机',val,'videoTb')">球机</li>
                                        <li @dblclick.stop="new_bf(2,'左前摄像机',val,'videoTb')">左前摄像机</li>
                                        <li @dblclick.stop="new_bf(3,'左中前摄像机',val,'videoTb')">左中前摄像机</li>
                                        <li @dblclick.stop="new_bf(4,'右中前摄像机',val,'videoTb')">右中前摄像机</li>
                                        <li @dblclick.stop="new_bf(5,'右前摄像机',val,'videoTb')">右前摄像机</li>
                                        <li @dblclick.stop="new_bf(6,'左后摄像机',val,'videoTb')">左后摄像机</li>
                                        <li @dblclick.stop="new_bf(7,'左中后摄像机',val,'videoTb')">左中后摄像机</li>
                                        <li @dblclick.stop="new_bf(8,'右中后摄像机',val,'videoTb')">右中后摄像机</li>
                                        <li @dblclick.stop="new_bf(9,'右后摄像机',val,'videoTb')">右后摄像机</li>
                                    </ul>
                                </template>
                            </div>
                        </template>

                        <template v-else>
                            <p class='pad'>此县区当前没有在线警车</p>
                        </template>
                  
    
                    </div>
                </template>
   
            </div>
       


        </div>
        
     
       
    </div>
    
</template>

<script>
import { Message,Loading } from 'element-ui'
import { queryAllPoliceAndDev,selectDept,gyxyPcInformation ,gyxyPcInformationcg} from '@/api/system_sj.js'
import {startLoding,endLoding} from '@/request/loading.js'
import EmpMini from './empMini.vue';
import { ongo, getEncryption, sysLogin, gyxySyMap } from "@/api/login_sj.js";
import { getVideoUrl ,hikControl,getVideoUrl2,hikControl2,getVideoUrlback, getCameraCode} from '@/api/hkvideosj.js'
import { v4 } from 'uuid';
export default {
    name:'jcList',
    props:[
       'detid'
    ],
    data () {
        return {
            carList_xichuan:[],
            carList_tb:[],
            carList_thjc:[],
            carList_tjc:[],
            carList_nz:[],
            carList_nxjc:[],
            carList_sqjc:[],
            carList_xy:[],
            pagesize:1,
            sysOrgCode:'',
            infinitedisabled:true,
            time:null,
            input2:"",
            treelist:[]
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
        xx(){
            this.input2 = null
        },
        cpsear(){
            
        },
        async new_bf_all(val,bs){
            clearTimeout(this.time)
            var vnb = [ 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 1 
                }, 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 2 
                }, 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 3 
                } , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 4 
                }  , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 5 
                }  , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 6 
                }   , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 7
                } , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 8
                }   , 
                { 
                    cameraIndexCode: "", 
                    ezvizDirect: 0, 
                    gpuMode: 0, 
                    streamMode: 0, 
                    transMode: 1, 
                    wndId: 9
                }  
            ] 
            try{
                
                this.new_bf(1,'',val,'')
                this.new_bf(2,'',val,'')
                this.new_bf(3,'',val,'')
                this.new_bf(4,'',val,'')
                this.new_bf(5,'',val,'')
                this.new_bf(6,'',val,'')
                this.new_bf(7,'',val,'')
                this.new_bf(8,'',val,'')
                this.new_bf(9,'',val,'')
                //--------------------------
                // var res = await  getCameraCode({channelNo:1,code:val.gbInfomation})
                    
                // var bianhao = res.result
            

                // vnb[0].cameraIndexCode = bianhao

                // var res = await  getCameraCode({channelNo:2,code:val.gbInfomation})
                    
                // var bianhao = res.result
            

                // vnb[1].cameraIndexCode = bianhao

                // vnb[2].cameraIndexCode = bianhao

                // vnb[3].cameraIndexCode = bianhao

                // vnb[4].cameraIndexCode = bianhao

                // vnb[5].cameraIndexCode = bianhao

                // vnb[6].cameraIndexCode = bianhao

                // vnb[7].cameraIndexCode = bianhao

                // vnb[8].cameraIndexCode = bianhao

                // window.parent.postMessage({
                //     message: 'getCrossHeight2',
                //     height:JSON.stringify(vnb),
                // }, '*');

            }catch(e){
                // window.parent.postMessage({
                //     message: 'getCrossHeight2',
                //     error:`未获取到${val.carNumber}的nvr信息`,
                // }, '*');

                // Message({
                //     showClose: true,
                //     message:`未获取到${val.carNumber}的nvr信息`,
                //     type:'error',
                //     duration:2000
                // })
            }

        },
        async new_bf(index,name,val,bs){
       
            try{
                var ip = 'http://41.211.252.154:18888'
                var res = await sysLogin({
                    captcha: "",
                    checkKey: "",
                    password: 'Splice@Gy$1212',
                    username: 'admin',
                },ip);

                // sessionStorage.setItem("JC_Token", res.result.token);

                var tokens = res.result.token
                
                var res = await  getCameraCode({channelNo:index,code:val.gbInfomation},ip,tokens)
                    
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
        xiala(val,bs){
            var that = this
                // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
                clearTimeout(that.time)
                that.time = setTimeout(() => {
                // 写单击事件执行的逻辑代码
                
            
              

                val.xiala_bool = !val.xiala_bool
                  
                    
            },300)

             
        },
     
       
        fasong(data,bs){
            clearTimeout(this.time)
        
            var p = Object.assign({}, data, {change: v4(),ip:data.gbInfomation,type:'all',bs})
            this.$emit('song',p)

        },
        async gg(ip,bs){
            var loading_lo;
            var tokens;
            try {
                try{
                    var res = await sysLogin({
                        captcha: "",
                        checkKey: "",
                        password: 'Splice@2769',
                        username: 'admin',
                    },ip);

                    tokens = res.result.token
    
                }catch(err){
                 
                        
                }
		
                this.infinitedisabled =true

                var res = await gyxyPcInformationcg(ip,tokens)

        

                res.result.forEach((item,i)=>{
                  
                    item.pcInformations.forEach((item2,i2)=>{

   
                        if(item2.carNumber == this.$route.query.name){
                            item2.xiala_bool=true

                            item2.ads = 'acti'


                            console.log($(`.${item.id}`),$('.jkbox'),'d2sa5')
                                

                            setTimeout(()=>{
                                $('.'+item.id).appendTo($('.jkbox'))
                            })    
                            
                            
                            
                        }else{
                            item2.xiala_bool=false
                        }
                       
                    })
                })
                

                this.treelist = res.result
            }catch (err) {
         
                console.log(err,'err------')
            }
        },
   
    

    },

    async mounted (){

    
        this.gg('http://41.211.252.150:18889','tb')

        
    },
    components: {
        EmpMini
    },
}
</script>



<style lang='scss' scoped>



    ::v-deep ::-webkit-input-placeholder {
        color: #fff;
        font-size: 15px;
    }


    ::v-deep .el-input__inner {
        background-color: rgb(0,62,118) !important;
        border: 1px solid #1296db;
        color: #fff;
    
    }

    .sear_box{
        display:flex;
        // flex-direction: column;
        // align-items: center;
        
    }
    .sear{
        width:95%;
       
        border:1px solid #4696df;
        color:#4696df;
    }
    .btnu{
        width:95%;
      
        display:flex;
        justify-content:space-between;
        margin-top: 5px;/*no*/
    }
    .sear_btn{
        width:47%;
    }
    *{
        font-size:14px;/*no*/
    }
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
        height: calc(100% - 50px);
      
        overflow-y: scroll;
        // min-height: 100px;/*no*/
    }

    .ui_con{
        width: 100%;
        height: 100%;
       
        // overflow-y: scroll;
    }

    .xm{
        margin-left:10px;
        font-weight:bold;
        margin-top:40px;
    }

    .car_item{
    
        
        width: 100%;
        font-weight:bold;
        color: #4696df;
        padding:6px 18px;
        box-sizing: border-box;
        padding-left:20px;
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        &.nysj_the{
            color:#000
        }
        &.acti{
            color:rgb(88 98 167);
            font-weight: bold;
            background:rgb(159 173 249 / 50%);
            
        }
        ul{
            margin-left:50px;
        }
        li{
          
           text-indent: 16px;/*no*/
           list-style:none;
           cursor: pointer;
        }

       
        li:hover{
            font-weight: bold;
            background: #006be6;
            font-size:18px;/*no*/
            color:#fff;

        }

        &:hover{
            p{
                font-weight: bold;
                background: #006be6;
                
                color:#fff;

                span{
                    font-size:18px;/*no*/
                }
                img{
                    width:17px;/*no*/
                }
            }

        }

        p:hover{
            font-weight: bold;
            background: #006be6;
            
            color:#fff;

            span{
                font-size:18px;/*no*/
            }
            img{
                width:17px;/*no*/
            }
        }

        p{
            display:flex;
            align-items:center;
            cursor: pointer;
        }

    }
    
    .pad{
        text-indent:30px;
    }
</style>
