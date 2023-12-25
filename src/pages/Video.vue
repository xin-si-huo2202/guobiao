<!-- 轨迹 -->
<template>
    <div class="Map-Video">
    <div class="Map-Video--left"  v-if='$isie'>
        <p class='tixing'>
            <span>请使用谷歌浏览器或360极速模式打开视频模块</span>
           
        </p>
        </div>
        <div class="Map-Video--left" v-if='!$isie'>
            <div class="Map-Video--Video">
                <!-- 3*3 -->
                <div style="height:100%;width:100%;display:flex;flex-wrap:wrap;overflow:hidden" v-if='update_video'>
                    <template v-for='(item,i) in pingarr'>
                        <div @click='choose_pl=i'  :class='i==choose_pl?"video3":"video2"'  :style=" (isquanping==true && isquanping_ind!=i) ? `opacity:0;width:${item.width};height:${item.height}`:`opacity:1;width:${item.width};height:${item.height}`">
                           
                           <cus-player :key='item.re'  @des='des' :ind='i' @ended='ended' @quanping='quanping' @bofang='bofang' @error='error' @pause='pause'  :statusind='item.status_ind' :deviceId='item.deviceId' :channelId='item.channelId'  :ref="item.re"></cus-player>
                            
                            <!--<template v-if='!$isie'>
                              <cus-player :key='item.re'  @des='des' :ind='i' @ended='ended' @quanping='quanping' @bofang='bofang' @error='error' @pause='pause'  :statusind='item.status_ind' :deviceId='item.deviceId' :channelId='item.channelId'  :ref="item.re"></cus-player>
                            </template>
                            <template v-if='$isie'>
                                <cus-player2 :key='item.re'  @des='des' :ind='i' @ended='ended' @quanping='quanping' @bofang='bofang' @error='error' @pause='pause'  :statusind='item.status_ind' :deviceId='item.deviceId' :channelId='item.channelId'  :ref="item.re"></cus-player2>
                            </template>-->
                        </div>
                    </template>
                    
                </div>
            </div>
            <div class="Map-VideoImage">
                <div class="Map-Video--image" >
                   <span class="face-image"></span>
                    <!-- <viewer :images="VideoImage.face" class="viewer">
                        <div  class="Map-Video--imageconter" v-for="src in VideoImage.face" :key="src" >
                            <el-image  :src="src"  fit="contain" ></el-image>
                        </div>
                    </viewer> 
                    <el-image v-for="src in VideoImage.face" :key="src"  :src="src"   :preview-src-list="src"></el-image> --> 
                    
                    <div id='face-pre' class='imgwrap'>
                        <img class='nmf' v-for="src in VideoImage.face" :key="src"  :src="src" @click='openpic(src,1)' />
                    </div>
                    
       
                </div>
                <div class="Map-Video--image">
                    <span class="car-image"></span>
                    <!--<viewer :images="VideoImage.plate" class="viewer">
                        <el-image class="Map-Video--imageconter" v-for="src in VideoImage.plate" :src="src" :key="src"  fit="contain"></el-image>
                    </viewer>-->
                    <div id='car-pre' class='imgwrap'>
                        <img class='nmf' v-for="src in VideoImage.plate" :key="src"  :src="src" @click='openpic(src,2)' />
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="Map-Video--right">
            <span class="Map-Video--rightbtn" @click="getindex()"  >
                <i class="el-icon-arrow-left"></i>
                <span>返回警车列表</span>
            </span>

            <div class="Map-Video--right--tree" :key='timerso' >
                <h2 class="platejk">{{$route.query.plate}}</h2>
                <div class='nodata' v-if='status_arr.length==0'>暂无通道</div>
                <span :class="item2.isonline?'Carviode': 'Carviode noline'" v-for="(item2,index2) in status_arr" :key='item2.kl' >

                    <!-- 0关闭  1正在播放  2异常 -->
                            
                            <!--<div class='dian'></div>-->

                            <div class='sts'>
                                <template v-if='item2.isonline'>
                                  在线
                                </template>
                                <template v-if='!item2.isonline'>
                                  离线
                                </template>
                            </div>

                            <template v-if='status_arr[index2].status==0'>
                                <span @click="handlePlay('111222333&111222333&35',index2,item2.da)" style='color:#fff' >
                                
                                {{item2.name}} -  关闭
                                
                                </span>

                            </template>
                            
                            <template v-if='status_arr[index2].status==1'>
                                <span @click="handlePlay('111222333&111222333&35',index2,item2.da)" style='color:yellow' >
                                
                                {{item2.name}} -  暂停
                                
                                </span>

                            </template>

                            <template v-if='status_arr[index2].status==2'>
                              <span @click="handlePlay('111222333&111222333&35',index2,item2.da)" style='color:#00ff00' >
                            
                              {{item2.name}} -  正在播放
                            
                            </span>

                            </template>

                            <template v-if='status_arr[index2].status==4'>
                                <span @click="handlePlay('111222333&111222333&35',index2,item2.da)" style='color:#00ff00' >
                            
                                    {{item2.name}} -  正在连接
                            
                                </span>

                            </template>

                            <template v-if='status_arr[index2].status==3'>
                                <span @click="handlePlay('111222333&111222333&35',index2,item2.da)" style='color:red' >
                                
                                {{item2.name}} -  异常
                                
                                </span>

                            </template>
                        
                      
                     
               
                   
                </span>


            </div>
             <div class="Map-Video--right--btn" >
                <div class="Map-Video--right--btn-head">
                    <p class="tit" v-if='huifang_bool'>选择回放时间段</p>
                    <div v-if='huifang_bool' class="choose_playback_time">


                        <el-date-picker type="datetime" align="center" v-model="timeStart" default-time="['08:00:00']"
                        :picker-options="pickerstartTime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>


                        <el-date-picker type="datetime" v-model="timeEnd"  default-time="['23:59:59']"
                            :picker-options="pickerendTime"  placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>

                        <el-button type="primary" size='mini' @click="StartPlayback()">开始回放</el-button>
                        <el-button type="primary" size='mini' @click="stopbackPlay()" style='margin:0 auto'>关闭回放</el-button>
                    </div>
                    <div class="Map-Video--right--btn-footer">
                        <div class="Video--right--btn-footer--Slider">
                            <span>分屏</span>
                            <el-slider v-model="fornum" :max="3" :min="1" @input="getSlider" @change="getSlider"></el-slider>
                            <p style="margin-left: 10px;width:45px;white-space: nowrap;"> {{fornum}} X {{fornum}}</p>
                        </div>
                    </div>
                    <div class="yuntai" v-if='yuntai_control_bool'>
                      

                        <el-button type="primary" size='mini'  @mousedown.native="ptzCamera(0, 0, 1)" @mouseup.native="ptzCamera(0, 0, 0)">放大+</el-button>
                        <el-button type="primary" size='mini' @mousedown.native="ptzCamera(0, 0, 2)" @mouseup.native="ptzCamera(0, 0, 0)">缩小-</el-button>
                    </div>
                    <div class="Head--btn-video" v-if='yuntai_control_bool'>
                        <div class="Viode-btn">


                            <div class="btn-shang"  @mousedown="ptzCamera(0, 2, 0)" @mouseup="ptzCamera(0, 0, 0)">
                                
                            </div>

                            <div class="btn-zuo" @mousedown="ptzCamera(2, 0, 0)" @mouseup="ptzCamera(0, 0, 0)">
                               
                            </div>

                            <div class="btn-xia" @mousedown="ptzCamera(0, 1, 0)" @mouseup="ptzCamera(0, 0, 0)">
                                
                            </div>

                            <div class="btn-you" @mousedown="ptzCamera(1, 0, 0)" @mouseup="ptzCamera(0, 0, 0)">
                                
                            </div>
                          
                        </div>

                    </div>
                  
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import { Message,Loading } from 'element-ui'
import { v4 } from 'uuid';
import crypto from 'crypto'
import { gb_channels,gb_login,gb_start,gb_stop,gb_control} from '@/api/video.js'
import 'xgplayer';
import FlvJsPlayer from 'xgplayer-flv.js';
import CusPlayer from './CusPlayer';
// import CusPlayer2 from './CusPlayer2';
export default {
    name:'Video',
    data () {
        return {
            status_arr:[
            //   {
            //     status_ind:0,
            //     status:0,
            //     kl:90,
            //     name:'云台'
            //   },
            //   {
            //     status_ind:1,
            //     status:0,
            //     kl:91,
            //     name:'左前摄像机'
            //   },
            //   {
            //     status_ind:2,
            //     status:0,
            //     kl:92,
            //     name:'左中前摄像机'
            //   },
            //   {
            //     status_ind:3,
            //     status:0,
            //     kl:93,
            //     name:'右中前摄像机'
            //   },
            //   {
            //     status_ind:4,
            //     status:0,
            //     kl:94,
            //     name:'右前摄像机'
            //   },
            //   {
            //     status_ind:5,
            //     status:0,
            //     kl:95,
            //     name:'左后摄像机'
            //   },
            //   {
            //     status_ind:6,
            //     status:0,
            //     kl:96,
            //     name:'左中后摄像机'
            //   },
            //   {
            //     status_ind:7,
            //     status:0,
            //     kl:97,
            //     name:'右中后摄像机'
            //   },
            //   {
            //     status_ind:8,
            //     status:0,
            //     kl:98,
            //     name:'右后摄像机'
            //   }
            ],
            pingarr:[
                //一平
                // {
                //     width:'100%',
                //     height:'100%'
                // },
                // {
                //     width:'50%',
                //     height:'50%'
                // },
                // {
                //     width:'50%',
                //     height:'50%'
                // },
                // {
                //     width:'50%',
                //     height:'50%'
                // },
                // {
                //     width:'100%',
                //     height:'100%'
                // },
                // {
                //     width:'100%',
                //     height:'100%'
                // },
                // {
                //     width:'100%',
                //     height:'100%'
                // },
                // {
                //     width:'100%',
                //     height:'100%'
                // },
                // {
                //     width:'100%',
                //     height:'100%'
                // }
                //四分平
                {
                    width:'50%',
                    height:'50%',
                    timer:'0',
                    re:'video0',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'50%',
                    height:'50%',
                    timer:'0',
                    re:'video1',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'50%',
                    height:'50%',
                    timer:'0',
                    re:'video2',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'50%',
                    height:'50%',
                    timer:'0',
                    re:'video3',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'100%',
                    height:'100%',
                    timer:'0',
                    re:'video4',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'100%',
                    height:'100%',
                    timer:'0',
                    re:'video5',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'100%',
                    height:'100%',
                    timer:'0',
                    re:'video6',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'100%',
                    height:'100%',
                    timer:'0',
                    re:'video7',
                    deviceId:'',
                    channelId:''
                },
                {
                    width:'100%',
                    height:'100%',
                    timer:'0',
                    re:'video8',
                    deviceId:'',
                    channelId:''
                }

                //九分平
                
                // {
                //     width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //      width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //     width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //      width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //      width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //      width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //      width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //     width:'33.3%',
                //     height:'33.3%'
                // },
                // {
                //     width:'33.3%',
                //     height:'33.3%'
                // }
            ],
            DataTree:[{
                index_win:1,
                status:false
            },
            {
                index_win:2,
                status:false
            },{
                index_win:3,
                status:false
            },{
                index_win:4,
                status:false
            },{
                index_win:5,
                status:false
            },{
                index_win:6,
                status:false
            },{
                index_win:7,
                status:false
            },{
                index_win:8,
                status:false
            },{
                index_win:9,
                status:false
            }],
            websock: null,
            VideoImage:{
                plate:[],
                face:[]
            },
            fornum: 2,
            Name_NVR_IP: null,
            timeStart:'',
            timeEnd:'',
            yuntai_control_bool:true,
            timerso:'',
            update_video:true,
            huifang_bool:false,
            huifang_index:'',

            controSpeed: 60,
            selected: 0, //表格类型
			videoIndex: 0, //表格索引
			tableData: [], //列表
			selectValue: '', //当前选择的相机
			playUrl: '', //播放的url

            timer0:'',
            timer1:'',
            timer2:'',
            timer3:'',
            timer4:'',
            timer5:'',
            timer6:'',
            timer7:'',
            timer8:'',
            storerefs:'',
            choose_pl:0,
            isquanping:false,
            isquanping_ind:''
        };
    },
    activated(){
     
        var isfresh = sessionStorage.isfresh
        console.log('actived======',isfresh)
        if(isfresh==1){
           
            sessionStorage.setItem('isfresh',0)
            
            this.update_s()
            // location.reload()
        }
        
    },
    destroyed() {
        this.websock.close() //离开路由之后断开websocket连接
    },
    watch: {
        fornum(val){
            console.log(val,'jghsv')
            this.isquanping=false,
            this.isquanping_ind=''
            if(val==1){
                this.pingarr.forEach((item,i)=>{
                    if(i==0){
                        item.width='100%'
                        item.height='100%'
                    }else{
                        item.width='0%'
                        item.height='0%'
                    }
                    
                })
                // this.pingarr=[
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video0'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video1'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video2'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video3'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video4'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video5'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video6'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video7'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video8'
                //     }
                // ]
            }else if(val==2){
                this.pingarr.forEach((item,i)=>{
                    item.width='50%'
                    item.height='50%'
                   
                })
                // this.pingarr=[
                //    {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video0'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video1'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //          re:'video2'
                //     },
                //     {
                //         width:'50%',
                //         height:'50%',
                //         timer:'0',
                //         re:'video3'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video4'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video5'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video6'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video7'
                //     },
                //     {
                //         width:'100%',
                //         height:'100%',
                //         timer:'0',
                //         re:'video8'
                //     }
                // ]
            }else if(val==3){
                this.pingarr.forEach((item,i)=>{
                    item.width='33.3%'
                    item.height='33.3%'
                   
                })
                // this.pingarr=[
                //    {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video0'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video1'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video2'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video3'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video4'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video5'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video6'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video7'
                //     },
                //     {
                //         width:'33.3%',
                //         height:'33.3%',
                //         timer:'0',
                //         re:'video8'
                //     }
                // ]
            }
        }
    },
    methods: {
        async ptzCamera(leftRight, upDown, zoom) {
            console.log('云台控制：' + leftRight + ' : ' + upDown + " : " + zoom);
            
            let control_data={
                deviceId:this.status_arr[0].da.deviceId,
                channelId:this.status_arr[0].da.channelId,
                leftRight,
                upDown,
                zoom,
                controSpeed:this.controSpeed
            }

            await gb_control(control_data)
          
            // let that = this;
            // this.$axios({
            //     method: 'post',
            //     // url: '/api/ptz/' + this.deviceId + '/' + this.channelId + '?leftRight=' + leftRight + '&upDown=' + upDown +
            //     //     '&inOut=' + zoom + '&moveSpeed=50&zoomSpeed=50'
            //     url: '/api/ptz/control/' + this.deviceId + '/' + this.channelId + '?cmdCode=' + (zoom * 16 + upDown * 4 + leftRight) + '&horizonSpeed=' + this.controSpeed + '&verticalSpeed=' + this.controSpeed + '&zoomSpeed=' + this.controSpeed
            // }).then(function (res) {});
        },
        previewImg(url) {
            // var img = new Image();  
            // img.src = obj.src;
            // var imgHtml = "<img src='" + url + "' />";  
            // //弹出层
            // layer.open({  
            //     type: 1,  
            //     shade: true,  
            //     title: false, //不显示标题  
            //     area:['auto','auto'],
            //     content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响  
            //     cancel: function () {  
                    
            //     }  
            // }); 
           
        },

        openpic(url,type){
            
            // window.open(url)
            // this.previewImg(url) 
            let photos;
            if(type==1){
                photos='#face-pre'
            }else{
                photos='#car-pre'
            }
            layer.photos({
                photos
                ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
            });
        },
        ended(val){

            if(this.status_arr[val]){
                this.status_arr[val].status=0
            }
            
            
            // this.timerso=new Date().getTime()
        },
        bofang(val){
            if(this.status_arr[val]){
                this.status_arr[val].status=2
            }
            // this.timerso=new Date().getTime()
        },
        pause(val){
            if(this.status_arr[val]){
                this.status_arr[val].status=1
            }
            // this.timerso=new Date().getTime()
        },
        error(val){
            if(this.status_arr[val]){
                this.status_arr[val].status=3
            }
            // this.timerso=new Date().getTime()
        },
        quanping(val){
            if(val.status==1){
                this.pingarr.forEach((item,i)=>{
                    if(i==val.ind){
                        this.pingarr[i].width='100%'
                        this.pingarr[i].height='100%'
                    }else{
                        this.pingarr[i].width='0%'
                        this.pingarr[i].height='0%'
                    }
                })
                this.isquanping=true
                this.isquanping_ind=val.ind
            }else{
                this.isquanping=false
                this.isquanping_ind=''
                if(this.fornum==1){
                   this.pingarr.forEach((item,i)=>{
                        item.width='100%'
                        item.height='100%'
                   })
                }else if(this.fornum==2){
                   this.pingarr.forEach((item,i)=>{
                        item.width='50%'
                        item.height='50%'
                   })
                }else if(this.fornum==3){
                    this.pingarr.forEach((item,i)=>{
                        item.width='33.3%'
                        item.height='33.3%'
                   })
                }
            }
          
        },
       async  des(val,val2,deviceId,channelId){
           
            setTimeout(()=>{
                this.status_arr[val2].status=0
          
                // this.timerso=new Date().getTime()
            },500)
            this.pingarr[val].timer=new Date().getTime()

           


            // if(val==0){
            //     this.timer0=new Date().getTime()
            // }else if(val==1){
            //     this.timer1=new Date().getTime()
            // }else if(val==2){
            //     this.timer2=new Date().getTime()
            // }else if(val==3){
            //     this.timer3=new Date().getTime()
            // }else if(val==4){
            //     this.timer4=new Date().getTime()
            // }else if(val==5){
            //     this.timer5=new Date().getTime()
            // }else if(val==6){
            //     this.timer6=new Date().getTime()
            // }else if(val==7){
            //     this.timer7=new Date().getTime()
            // }else if(val==8){
            //     this.timer8=new Date().getTime()
            // }
            
        },
        IEVersion() {
            if (document.documentMode) return document.documentMode;
        },
        checkchrome(){
            if (!this.IEVersion()) {
                window.location.href='/updatechrome.html'
            }
        },
        fuuping(index){
            // this.$refs.HKvideo.changeWndNum(index)
            this.yuntai_control_bool=true
            this.huifang_bool=false
            if(this.fornum==1){
                this.fornum=2
            }else if(this.fornum!=1){
                this.fornum=1
            }
            this.$refs.HKvideo.changeWndNum(this.fornum)
        },
        playback_btn(index){
            this.huifang_bool=true
            this.yuntai_control_bool=false
            this.huifang_index=index
            console.log(this.huifang_index,'this.huifang_index')
        },
        StartPlayback(){
            console.log(this.huifang_index,this.timeStart,this.timeEnd+'回放')
            if(this.huifang_index===''){
                  this.$notify({
                    title: '提示',
                    message: '请选择摄像头',
                    type: 'error'
                });
                return;
            }
            if(!this.timeStart || !this.timeEnd){
                this.$notify({
                    title: '提示',
                    message: '请选择回放时间段',
                    type: 'error'
                });
                return;
            }
            this.$refs.HKvideo.clickStartPlayback(this.huifang_index,this.timeStart,this.timeEnd)
        },
        // 窗口分割
        getSlider(val){
            // this.$refs.HKvideo.changeWndNum(val)
           
        },
        // 通道
        channels(val){
            setTimeout(()=>{
                    console.log(val,10000)
                    val.forEach((item,i)=>{
                        this.DataTree.push({
                            index_win :item,
                            status:false
                        })
                    })
            },1500)
          
            // this.DataTree = val
        },
        async handlePlay(playUrl,index,da,isyuntai=false) {
            // if(isyuntai){
            //     this.yuntai_control_bool=true
            // }else{
            //     this.yuntai_control_bool=false
            // }
            // this.huifang_bool=false
            this.pingarr[this.choose_pl].status_ind=index
            this.pingarr[this.choose_pl].deviceId=da.deviceId
            this.pingarr[this.choose_pl].channelId=da.channelId
            
            this.status_arr[index].status=4
        
            // this.timerso=new Date().getTime()
            if (playUrl) {
              let ref = 'video' + this.choose_pl;
         
                    playUrl=await this.S_gb_start(da,index)
                    
              

                if(playUrl){
                
                    this.$refs[ref][0].createPlayer(playUrl, true, index);
                }else{
                    // this.$message.error('播放地址无效');
                }
                
              
            } else {
            //   this.$message.error('播放地址无效');
            }

            // this.DataTree.forEach((item,i)=>{
            //     if(i==index){
            //         item.status=true
            //     }
            // })
        },
        handleclose(index){
         
            let ref = 'video' + index;

            this.$refs[ref][0].closePlayer()

            this.DataTree.forEach((item,i)=>{
                if(i==index){
                    item.status=false
                }
            })
        },
        // 视频预览
        clickStartRealPlay(val,isyuntai=false){
            console.log(val+'预览')
            if(isyuntai){
                this.yuntai_control_bool=true
            }else{
                this.yuntai_control_bool=false
            }
            this.huifang_bool=false
            this.timerso=new Date().getTime()
            this.$refs.HKvideo.clickStartRealPlay(val)

            this.DataTree.forEach((item,i)=>{
                if(i==val){
                    item.status=true
                }
            })
        },
        stopRealPlay(val){
            this.$refs.HKvideo.stopRealPlay(val)

            this.DataTree.forEach((item,i)=>{
                if(i==val){
                    item.status=false
                }
            })
        },
        stopbackPlay(){
            this.$refs.HKvideo.stopRealPlay(this.huifang_index)
        },
        // 云台控制
        mouseDownPTZControl(val){
            console.log(val)
            this.$refs.HKvideo.mouseDownPTZControl(val)
        },
        mouseUpPTZControl(){
            this.$refs.HKvideo.mouseUpPTZControl()
        },
        //返回首页
        getindex(){
            this.$router.push('/examine/map');
        },


        initWebSocket(){ //初始化weosocket
            let webscok = sessionStorage.Webscocket
            let chepai;
            if(sessionStorage.pcId){
                chepai = sessionStorage.pcId;
            }else{
                chepai = JSON.parse(sessionStorage.carVideo).pcId;
            }
            
            
            const wsuri = `ws://${webscok}:8987/websocketapi/vmcNo=gundong_${chepai}`;
            this.websock = new WebSocket(wsuri);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onopen = this.websocketonopen;
            this.websock.onerror = this.websocketonerror;
            this.websock.onclose = this.websocketclose;
        },
        //连接建立之后执行send方法发送数据
        websocketonopen(){
            let actions = {"test":"gundong"};

            this.websocketsend(JSON.stringify(actions));

        },
        //连接建立失败重连
        websocketonerror(){
            // this.initWebSocket();
           // console.log('连接建立失败重连')
        },
        //数据接收
        websocketonmessage(e){
            console.log(JSON.parse(e.data))
            var str = new RegExp("http");
            var str1 = new RegExp("https");
            let  face = JSON.parse(e.data).face
            let  plate = JSON.parse(e.data).plate
            if(str.test(face) || str1.test(face)){ //是否是 url
                this.VideoImage.face.unshift(face)

                this.VideoImage.face = this.unique(this.VideoImage.face)
               
            }else if(str.test(plate) || str1.test(plate)){ //是否是 url
                this.VideoImage.plate.unshift(plate)

                this.VideoImage.plate = this.unique(this.VideoImage.plate)
            }else{
                return
            }

        },
        unique(arr) {
            return Array.from(new Set(arr))
        },
        websocketsend(Data){//数据发送
            this.websock.send(Data);
            console.log('数据发送'+Data)
        },
        websocketclose(e){  //关闭
            console.log('断开连接',e);
        },

        async S_gb_channels(deviceId){
            let loginParam = {
                username: 'admin',
                password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
            }
            var that = this;
            
            await gb_login(loginParam)

            this.$cookies.set("session", {"username": 'admin'}) ;
           
          
            var res = await gb_channels(deviceId);

            var deviceChannelList = res.list;
            this.status_arr=[]
            deviceChannelList.forEach((item,i)=>{

                var na;
                if(this.$IS_company){
                    if(i==1){
                        na='云台'
                    }else if(i==2){
                        na='左前摄像机'
                    }else if(i==3){
                        na='左中前摄像机'
                    }else if(i==4){
                        na='右中前摄像机'
                    }else if(i==5){
                        na='右前摄像机'
                    }else if(i==6){
                        na='左后摄像机'
                    }else if(i==7){
                        na='左中后摄像机'
                    }else if(i==8){
                        na='右中后摄像机'
                    }else if(i==9){
                        na='右后摄像机'
                    }

                    if(i!=0){
                        this.status_arr.push({
                            status_ind:i,
                            status:0,
                            kl:item.channelId+v4(),
                            name:na,
                            isonline:item.status,
                            da:item
                        })
                    }
                    
                }else{
                    if(i==0){
                        na='云台'
                    }else if(i==1){
                        na='左前摄像机'
                    }else if(i==2){
                        na='左中前摄像机'
                    }else if(i==3){
                        na='右中前摄像机'
                    }else if(i==4){
                        na='右前摄像机'
                    }else if(i==5){
                        na='左后摄像机'
                    }else if(i==6){
                        na='左中后摄像机'
                    }else if(i==7){
                        na='右中后摄像机'
                    }else if(i==8){
                        na='右后摄像机'
                    }

                    this.status_arr.push({
                        status_ind:i,
                        status:0,
                        kl:item.channelId+v4(),
                        name:na,
                        isonline:item.status,
                        da:item
                    })
                }
                

              
            })
            
        },

        async S_gb_start(data,index){
            var da = {
                deviceId:data.deviceId,
                channelId:data.channelId
            }
     
            if(this.$IS_company){
                var res = await gb_start(da);
                if(res.code==0){
                    let Webscocket_video = sessionStorage.Webscocket_video
                    // let urls='http://'+Webscocket_video + ':18080/#/play/wasm/' + encodeURIComponent(res.data.ws_hls)
                    // let baseZlmApi = this.$env_bs=='development' ? `${location.host}/liu`:`${location.host}/zlm` 
                    // let urls = `/liu/${res.data.app}/${res.data.streamId}.flv`;
                    let urls;
                    if(!this.$isie){
                        urls=res.data.ws_flv
                    }else{
                        urls=res.data.ws_flv
                    }
                    // let urls= `ws://${Webscocket_video}:30001/${res.data.app}/${res.data.streamId}.flv`;
                    console.log(urls,'----======')
                    return urls
                }else{
                    Message({
                        showClose: true,
                        message:'设备异常',
                        type:'error',
                        duration:2000
                    })

                    return false
                }
            }else{
                let Webscocket_video = sessionStorage.Webscocket_video
                let urls= `ws://${Webscocket_video}:30001/rtp/${data.deviceId}/${data.channelId}.flv`;
                // let urls= `http://${Webscocket_video}:30001/index/api/webrtc?app=rtp&stream=${data.deviceId}/${data.channelId}&type=play`
                console.log(urls,'----======')
                return urls
            }
        },

        update_s(){
            var deviceId = this.$route.query.id
            this.S_gb_channels(deviceId)
            this.update_video=false
            if(this.websock){
                this.websock.close()
            }
           
            setTimeout(()=>{
                this.update_video=true
                this.initWebSocket();
            },200)
        }
    },

    mounted (){
        // this.VideoImage.face = this.unique(this.VideoImage.face)
        // var t=setInterval(()=>{
        //     this.VideoImage.face.unshift('/ren.jpg')
        // },1000)

        var isfresh = sessionStorage.isfresh
        console.log('mounted======',isfresh)
        if(isfresh==1){
           
            sessionStorage.setItem('isfresh',0)
            
            // location.reload()
            this.update_s()
        }
        // var huancun=[
        //     'map',  //首页
        //     'collect', //采集库
        //     'chat',  //即时通讯
        //     'infocompare', //采集检索
        //     'statistics',  //数据统计
        //     'derived', // 统计报表
        //     'caralarm', //车牌预警
        //     'facealarm', //人像预警
        //     'carcontril', //车辆布控
        //     'facecontril',  //人像布控
        //     'videoDispatch',
        //     'Video'
        // ]
        // this.$store.commit("changehuancun", huancun);
        // var deviceId = '34020000001110000001'
        var deviceId = this.$route.query.id
        this.S_gb_channels(deviceId)
        // this.checkchrome()
        // this.Name_NVR_IP = this.$route.query.id
        this.initWebSocket();

    },
    components: {
        CusPlayer,
        // CusPlayer2
    },
}
</script>
<style>
    /* .el-popper{
        width: 240px;
        left: auto;
        right:0
    } */
    /* .el-date-picker .el-picker-panel__content {
        width: 223px!important;
    } */
    .Carviode .el-button {
        min-width: 50px;
        width: 50px;
        border: none;
    }
    .yuntai{

        padding: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .yuntai .el-button {

        width: 40%;
        border: none;
        margin-top: 5px;
        margin-left: 5px;
        margin-right: 5px;
    }
    .choose_playback_time .el-date-editor.el-input{
        /* width: 90%;
        display: block;
        margin: 0 auto; */
        margin-bottom: 5px;
    }
    .choose_playback_time{
        padding: 10px;
    }

    .choose_playback_time .el-button{
        width: 100%;
    }
</style>
<style lang='scss' scoped>
.tit{
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}

.Map-Video{
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background: #001E63;
    .Map-Video--left{
        width: calc(100% - 300px);
        height: 100%;
        margin-right: 10px;
        position: relative;
        .Map-Video--Video{
            width: 100%;
            height: 85%;
            background: #001854;
            box-sizing: border-box;
            overflow: auto;
            position:relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .Map-VideoImage{
            width: 100%;
            height: calc(15% - 10px);
            display: flex;
            justify-content: space-between;
        }
        .Map-Video--image{
            width:  calc(50% - 5px);
            margin-top: 10px;
            height: 100%;
            // padding: 10px 10px;
            background: #001854;
            box-sizing: border-box;
            white-space: nowrap;
            // border: 1px solid #001854;
            // overflow-y: hidden;
            // overflow-x:scroll;
           
            position: relative;
            display:flex;
            justify-content:flex-start;
            .el-image__inner{
                width:auto
            }
            .face-image{
                width: 68px;
                height: 68px;
                background: url('../../../assets/image/autoMap/face-gather.png');
                background-repeat: no-repeat;
                // background-size: 100% 100%;
                // z-index: 11;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -34px;
                margin-left: -34px;
                
            }
            .car-image{
                width: 68px;
                height: 68px;
                background: url('../../../assets/image/autoMap/Licenseplate-gather.png');
                background-repeat: no-repeat;
                // background-size: 100% 100%;
                // z-index: 11;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -34px;
                margin-left: -34px;
            }
            i{
                width: 40px;
                height: 40px;
                line-height: 40px;
                z-index: 111;
                color: cornsilk;
                font-size: 18px;
                background: #000;
                opacity: .5;
                text-align: center;
                border-radius: 50%;
                margin: auto;
                display: none;
            }
            .viewer{
                width: 100%;
                height: 100%;
                padding: 10px;
                // background: #001854;
                box-sizing: border-box;
            }
            .Map-Video--imageconter{
                // float: left;
                width: 10.3%;
                height: 100%;
                color: #fff;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: inline-block;
                border: 1px solid  #2A9DE6;
                box-sizing: border-box;
                .el-image{
                    // width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
                &::-webkit-scrollbar {
                    display: none;
                }
            }
            .Map-Video--imageconter:nth-child(2n){
                margin: 0 10px;
            }
            &::-webkit-scrollbar {
                display: none;
            }
            &:first-child{
                margin-right: 5px;
            }
        }
        .Map-Video--image:hover{
            i{
                display: block;
            }
        }
        .zd-border-video{
            border:1px solid #fff;
            box-sizing: border-box;
        }
    }
    .Map-Video--right{
        // width: 20%;
        width: 300px;
        height: 100%;
        box-sizing: border-box;
        .Map-Video--rightbtn{
            width: 100%;
            color: #fff;
            font-size: 14px;
            padding: 10px 0;
            background: #001854;
            display: flex;
            align-items: center;
            cursor: pointer;
            justify-content: center;
            i{
                font-size: 16px;
                color: #2A9DE6;
                margin-right: 10px;
            }
        }
        .Map-Video--right--tree{
            width: 100%;
           
         height: calc((100% - 36px)/2 - 20px);
           margin: 10px 0; 
            background: #001854;
            box-sizing: border-box;
            overflow-y: auto;
            .el-tree{
                color: #fff;
                background: #001854;

                    ::v-deep  .el-tree-node.is-current.is-focusable{
                        .el-tree-node__content{
                            background: #0A1080 !important;
                        }
                    }

                 ::v-deep .el-tree-node{
                    .el-tree-node__content:hover{
                        background: #0A1080;
                    }
                    .el-tree-node__content:focus{
                        background: #0A1080;
                    }
                    &:focus{
                        background: #0A1080;
                        .el-tree-node__content{
                            background: #0A1080 !important;
                        }
                    }
                }

            }
            .Carviode.noline .dian{
                width:10px;
                height:10px;
                background: red;
            }
            
            .Carviode .dian{
                width:10px;
                height:10px;
                background:#00ff00;
            }
            .Carviode .sts{
                white-space:nowrap;
                color:#00ff00;
            }
            .Carviode.noline .sts{
                color: red;
            }
            .Carviode{
                width: 100%;
                color: #fff;
                // display: inline-block;
                display: flex;
                padding: 10px;
                cursor: pointer;
                box-sizing: border-box;
                align-items: center;
                span{
                    width: 100%;
                    cursor: pointer;
                    display: block;
                    padding: 0px 10px 2px;
                    box-sizing: border-box;
                    .zd-forbidden{
                        color: rgb(100, 103, 105);
                    }
                }
                span:hover{
                    background: #0A1080 !important;
                }
                .carhover:hover{
                    background: #0A1080 !important;
                }
            }
        }
        .Map-Video--right--btn{
            width: 100%;
            // height: 80px; //添加的---后期删除
            // line-height: 80px; //添加的---后期删除
            // margin: 10px 0; //添加的---后期删除
            height: calc((100% - 36px)/2); //后期换上
            background: #001854;
            box-sizing: border-box;
            .Map-Video--right--btn-head{
                width: 100%;
                height: 100%;
                position: relative;
                // display: flex;
                overflow: auto;
                .Head--btn-video{
                    width: 100%;
                    background: #001854;
                    // height: 100%;
                     position: relative;
                    .Viode-btn{
                        width: 200px;
                        height: 200px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        position: relative;
                        background: #001854;
                        transform: scale(0.85) translateY(-19px);
                        .Viode-btn--box{
                            width: 55px;
                            height: 55px;
                            position: absolute;
                            // transition: 0.5s;
                            cursor: pointer;
                            // border: 1px solid red;
                        }
                        .Viode-btn--lt{
                            top: 33px;
                            left: 50%;
                            margin-left: -75px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -400px -61px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: -15px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--center{
                            top: 50%;
                            left: 50%;
                            width: 35px;
                            height: 35px;
                            margin-left: -17px;
                            margin-top: -8px;
                            background-image: url('../../../assets/image/xuanzhuan.png');
                            background-size: cover;
                            /* background-position: -400px -61px; */
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: -15px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--lt:hover{
                            background-position: -400px 4px;
                        }
                        .Viode-btn--t{
                            top: 20px;
                            left: 50%;
                            margin-left: -27px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: 0px -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: 20px;
                                bottom: -10px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--t:hover{
                            background-position: 0px 0;
                        }
                        .Viode-btn--tr{
                            top: 33px;
                            left: 50%;
                            margin-left: 19px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -60px -61px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                right: -15px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--tr:hover{
                             background-position: -60px 4px;
                        }
                        .Viode-btn--r{
                            top: 85px;
                            left: 50%;
                            margin-left: 37px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -114px -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: -10px;
                                top: 18px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--r:hover{
                            background-position: -114px 0px;
                        }
                        .Viode-btn--rb{
                            top: 132px;
                            left: 50%;
                            margin-left: 23px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -170px  -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                right: -10px;
                                bottom: 0px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--rb:hover{
                            background-position: -170px  0px;
                        }
                        .Viode-btn--b{
                            top: 150px;
                            left: 50%;
                            margin-left: -27px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -231px  -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: 20px;
                                top: -10px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--b:hover{
                            background-position: -231px  0px;
                        }
                        .Viode-btn--bl{
                            top: 133px;
                            left: 50%;
                            margin-left: -77px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -293px -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                left: -15px;
                                bottom: 0px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--bl:hover{
                            background-position: -293px 0;
                        }
                        .Viode-btn--l{
                            top: 85px;
                            left: 50%;
                            margin-left: -93px;
                            background-image: url('../../../assets/image/btn.png');
                            background-size: 450px;
                            background-position: -346px -65px;
                            background-repeat: no-repeat;
                            p{
                                position: absolute;
                                right: -10px;
                                top: 18px;
                                color: #fff;
                            }
                        }
                        .Viode-btn--l:hover{
                            background-position: -346px  0px;
                        }
                    }

                }
                .Map-Video--right--btn-footer{
                    width: 100%;
                    box-sizing: border-box;
                    .Video--right--btn-footer--Slider{
                        width: 100%;
                        padding: 0 20px;
                        color: #fff;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        box-sizing: border-box;
                        span{
                            width: 45px;
                        }
                        ::v-deep .el-slider{
                            width: 80%;
                            .el-slider__button{
                                width: 12px;
                                height: 12px;
                            }
                            .el-slider__runway,.el-slider__bar{
                                height: 4px;
                            }
                        }
                    }
                }
            }
        }
    }
}
.selectVideo {
	border: solid 2px red;
	height: 100%;
	width: 100%;
	position: relative;
}
.video2 {
	border: solid 1px #55557f;
  
	position: relative;
    box-sizing:border-box
}

.video3 {
	border: solid 2px #14f114;
  
	position: relative;
    box-sizing:border-box
}

.nmf{
    height: 100%;
    position: relative;
    margin-right: 5px;
    z-index: 10;
}
.nodata{
    color:#fff;
    font-size:14px;
    text-align:center;
    margin-top:20px;
}

.imgwrap{
    overflow-x:scroll;

    overflow-y:hidden;
    
}

.imgwrap::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
}

.imgwrap::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: #02adf7;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

.imgwrap::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #1b5aa9;
}
.btn-shang{
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../../../assets/image/btn.png');
    background-repeat: no-repeat;
    background-position: 0px -42px;
    left:50%;
    top:10px;
    margin-left:-70px
}

.btn-zuo{
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../../../assets/image/btn.png');
    background-repeat: no-repeat;
    background-position: 0px -42px;
    left: -39px;
    top: 78px;
    /* margin-left: -70px; */
    transform: rotate(-89deg);
}

.btn-xia{
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../../../assets/image/btn.png');
    background-repeat: no-repeat;
    background-position: 0px -42px;
    left: 50%;
    top: 146px;
    margin-left: -72px;
    transform: rotate(180deg);
}

.btn-you{
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../../../assets/image/btn.png');
    background-repeat: no-repeat;
    background-position: 0px -42px;
    right: -37px;
    top: 78px;
    margin-left: -72px;
    transform: rotate(90deg);
}
.jianrong_s{
  width:180px
}
.tixing{
  width:100%;
  height:100%;
  color:#fff;
  font-size:19px;
  display:flex;
  justify-content:center;
  align-items:center;
}
.platejk{
    color: #fff!important;
    text-align: center;
    margin: 10px;
}
</style>
