<template>
    <div class="Map-Video">
       
        <Map :mapcarlist='mapcarlist'  />

        
        <div class="left dvd">
            <!--<div class="left_top">
                <div class="maidai">
                    <TitleTwo title="分屏设置" />
                </div>

                <div class="slider-wrap bg_color_white">
                    <div class="slider-wrap-left">
                        <el-slider v-model="fornum" :max="5"  :min="3" @input="getSlider" @change="getSlider"  :disabled='kto==2?true:false'></el-slider>
                    </div>
                    
                    <div class="slider-wrap-rig">
                          <p class="Typography-color-blue"> {{fornum}} X {{fornum}}</p>
                    </div>
                  
                </div>
            </div>-->

            <div class="left_bot  ">
                <div class="maidai">
                    <TitleTwo title="选择取证时段" />
                </div>

                <div class='time-box left_bot_bot bg_color_white xiba'>
                    <el-date-picker
                        v-model="startTime"
                        type="datetime"
                        placeholder="开始时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerBeginDateBefore"
                    >
                    </el-date-picker>
                    <el-date-picker
                        style="margin-top: 10px"
                        v-model="endTime"
                        type="datetime"
                        placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerBeginDateAfter"
                    >
                    </el-date-picker>
                </div>
               
            
            </div>
           
           
            <div class="left_mid">
               <div class="maidai">
                    <TitleTwo title="选择取证警车" />
                </div>

                <div class="left_bot_bot ">
                    <JcList @song='handlePlay' :detid='detid' @addCar='addCar' @newBf='newBf' />
                </div>
            </div>



            
           

        </div>
       
        <div class="videowarp">
            
           
            
          
            <div class="videowarp-bot">
                
                <div class="videowarp-left-box">
                    
                </div>

                <div class="Map-Video--left"  v-if='$isie'>
                    
                    <p class='tixing'>
                        <span>请使用谷歌浏览器或360极速模式打开视频模块</span>
                    
                    </p>
                </div>
                <div class="Map-Video--left" v-if='!$isie'>
                    
                    <div class="Map-Video--Video">
      
                        <div  :style="!doudong?`flex-wrap:nowrap;`:`flex-wrap:wrap;`"  style="height:100%;width:100%;display:flex;overflow:hidden;position:relative;" >
                           <div id="playWnd" class="playWnd" style="left: 0px; top: 0px;"></div>
                        </div>
                    </div>

                    <div class="tiao">
                    
                    </div>
                    
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import { Message,Loading } from 'element-ui'
import crypto from 'crypto'
import { gb_channels,gb_login,gb_start,gb_stop,gb_devicelist,gb_control} from '@/api/video.js'
import { getVideoUrl ,hikControl,getVideoUrl2,hikControl2,getVideoUrlback, getCameraCode} from '@/api/hkvideo.js'

import Map from '../components/map.vue';

import DepTree from '../components/depTree.vue';

import EmpMini from '../components/empMini.vue';

import JcList from '../components/jcList_back.vue';

import TitleTwo from '../components/basetool/TitleTwo.vue';

//声明公用变量
var initCount = 0;
var pubKey = '';
var backbox;
var oWebControl;

 // 创建WebControl实例与启动插件
    function initPlugin () {
        oWebControl = new WebControl({
            szPluginContainer: "playWnd",                       //指定容器id
            iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
            iServicePortEnd: 15909,
            cbConnectSuccess: function () {
                // setCallbacks();
                //实例创建成功后需要启动服务
                oWebControl.JS_StartService("window", {
                    dllPath: "./VideoPluginConnect.dll"
                }).then(function () {
					oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
						cbIntegrationCallBack: cbIntegrationCallBack
					});
                
                    oWebControl.JS_CreateWnd("playWnd", backbox.width, backbox.height).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
                        console.log("JS_CreateWnd success");
                        init();                                 //创建播放实例成功后初始化
                    });
                }, function () {

                });
            },
            cbConnectError: function () {
                console.log("cbConnectError");
                oWebControl = null;
                $("#playWnd").html("插件未启动，请下载安装后重新刷新页面,<a download href='/playback/demo/VideoWebPlugin.exe'>下载</a>");
                WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
                initCount ++;
                if (initCount < 3) {
                    setTimeout(function () {
                        initPlugin();
                    }, 3000)
                } else {
                    $("#playWnd").html("插件未启动，请下载安装后重新刷新页面,<a download href='/playback/demo/VideoWebPlugin.exe'>下载</a>");
                }
            },
            cbConnectClose: function () {
                console.log("cbConnectClose");
                oWebControl = null;
            }
        });
    }
    
    // 推送消息
    function cbIntegrationCallBack(oData) {
        console.log(JSON.stringify(oData.responseMsg));
    }

    //初始化
    function init()
    {
        getPubKey(function () {
		
			////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
            var appkey = "29548490";                           //综合安防管理平台提供的appkey，必填
            var secret = setEncrypt("4TxibSw3LTeIqp3ShQrH");   //综合安防管理平台提供的secret，必填
            var ip = "41.211.252.159";                           //综合安防管理平台IP地址，必填
            var playMode = 1;                                  //初始播放模式：0-预览，1-回放
            var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
            var snapDir = "D:\\SnapDir";                       //抓图存储路径
            var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
            var layout = "1x1";                                //playMode指定模式的布局
            var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
            var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
			var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
			var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
			// var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
            var buttonIDs = "769";  //自定义工具条按钮;  //自定义工具条按钮
            var toolBarButtonIDs ='2050,2306,2307,2308,2309,4097';
			var reconnectTimes = 1;                            // 重连次数，回放异常情况下有效
			//var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
			////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

            oWebControl.JS_RequestInterface({
                funcName: "init",
                argument: JSON.stringify({
                    appkey: appkey,                            //API网关提供的appkey
                    secret: secret,                            //API网关提供的secret
                    ip: ip,                                    //API网关IP地址
                    playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
                    port: port,                                //端口
                    snapDir: snapDir,                          //抓图存储路径
                    videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
                    layout: layout,                            //布局
                    enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
                    encryptedFields: encryptedFields,          //加密字段
					showToolbar: showToolbar,                  //是否显示工具栏
					showSmart: showSmart,                      //是否显示智能信息
					buttonIDs: buttonIDs,                       //自定义工具条按钮
                    toolBarButtonIDs:toolBarButtonIDs,
					reconnectTimes:reconnectTimes            //重连次数
					//reconnectDuration：reconnectTime           //重连间隔
                })
            }).then(function (oData) {
				oWebControl.JS_Resize(backbox.width, backbox.height);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            });
        });
    }

    // 获取公钥
    function getPubKey (callback) {
        oWebControl.JS_RequestInterface({
            funcName: "getRSAPubKey",
            argument: JSON.stringify({
                keyLength: 1024
            })
        }).then(function (oData) {
            console.log(oData);
            if (oData.responseMsg.data) {
                pubKey = oData.responseMsg.data;
                callback()
            }
        })
    }

    // RSA加密
    function setEncrypt (value) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        return encrypt.encrypt(value);
    }

export default {
    name:'videoDispatch',
    data () {
        return {
          
            startTime:"",
            endTime:"",
            hk_arr:[
                {
                    hk_index:1,
                    hk_name:'云台'
                },
                {
                    hk_index:2,
                    hk_name:'左前摄像机'
                },
                {
                    hk_index:3,
                    hk_name:'左中前摄像机'
                },
                {
                    hk_index:4,
                    hk_name:'右中前摄像机'
                },
                {
                    hk_index:5,
                    hk_name:'右前摄像机'
                },
                {
                    hk_index:6,
                    hk_name:'左后摄像机'
                },
                {
                    hk_index:7,
                    hk_name:'左中后摄像机'
                },
                {
                    hk_index:8,
                    hk_name:'右中后摄像机'
                },
                {
                    hk_index:9,
                    hk_name:'右后摄像机'
                }
            ],
            pickerBeginDateBefore: {
                disabledDate: (time) => {
                    // this.electricityStatisticsEndDate是结束时间date控件的v-model值
                    let beginDateVal = new Date(this.endTime)
                    //debugger
                    if (beginDateVal) {
                        return time.getTime() < beginDateVal.getTime() - 30 * 24 * 60 * 60 * 1000 || time.getTime() > beginDateVal.getTime()
                    }
                }
            },
            pickerBeginDateAfter: {
                disabledDate: (time) => {
                    // this.electricityStatisticsStartDate是开始时间date控件的v-model值
                    let beginDateVal = new Date(this.startTime)
                    if (beginDateVal) {
                        return time.getTime() > beginDateVal.getTime() + 30 * 24 * 60 * 60 * 1000 || time.getTime() < beginDateVal.getTime()
                    }
                }
            },
            kto:1,
            dingwei:null,
            mapcarlist:[],
            MenuData:[],
            controSpeed: 60,
            status_arr:[],
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
                //25平
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video0',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video1',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video2',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video3',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video4',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video5',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video6',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video7',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video8',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video9',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video10',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video11',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video12',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video13',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video14',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video15',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video16',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video17',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video18',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video19',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video20',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video21',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video22',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video23',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
                },
                {
                    width:'20%',
                    height:'20%',
                    timer:'0',
                    re:'video24',
                    status_ind:0,
                    deviceId:'',
                    channelId:'',
                    jc_data:null
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
                status:false,
                name:'警车1'
            },
            {
                index_win:2,
                status:false,
                name:'警车2'
            },{
                index_win:3,
                status:false,
                name:'警车3'
            },{
                index_win:4,
                status:false,
                name:'警车4'
            },{
                index_win:5,
                status:false,
                name:'警车5'
            },{
                index_win:6,
                status:false,
                name:'警车6'
            },{
                index_win:7,
                status:false,
                name:'警车7'
            },{
                index_win:8,
                status:false,
                name:'警车8'
            },{
                index_win:9,
                status:false,
                name:'警车9'
            },{
                index_win:10,
                status:false,
                name:'警车10'
            }],
            websock: null,
            VideoImage:{
                plate:[],
                face:[]
            },
            fornum: 5,
            Name_NVR_IP: null,
            timeStart:'',
            timeEnd:'',
          
            timerso:0,
            huifang_bool:false,
            huifang_index:'',


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
            isquanping_ind:'',

            detid:'',

            doudong:true
        };
    },
    destroyed() {
       
    },
    async beforeDestroy() {
  
        if (oWebControl != null){
			oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题 
            oWebControl.JS_Disconnect().then(function(){  // 断开与插件服务连接成功
			}, 
			function() {  // 断开与插件服务连接失败
			});
        }
		
	},
    watch: {
        fornum(val){
           
            this.isquanping=false,
            this.isquanping_ind=''
            if(val==3){
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
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video9'
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video10'
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video11'
                //     },
                //     {
                //         width:'25%',
                //         height:'25%',
                //         timer:'0',
                //         re:'video12'
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video13'
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video14'
                //     },
                //     {
                //         width:'0%',
                //         height:'0%',
                //         timer:'0',
                //         re:'video15'
                //     }
                // ]
              
            }else if(val==4){
                 this.pingarr.forEach((item,i)=>{
                    item.width='25%'
                    item.height='25%'
                })
                
            }else if(val==5){
                 this.pingarr.forEach((item,i)=>{
                    item.width='20%'
                    item.height='20%'
                })
                
            }
        }
    },
    methods: {
     
        async newBf(data){
            
            try{

                var res = await  getCameraCode({channelNo:data.index,code:data.ip})

                var bianhao = res.result
                var hk_index=data.index
                var hk_name = data.name
               
                this.pingarr[this.choose_pl].jc_data = Object.assign({}, data, {hk_index,hk_name,bianhao })


                var vnb = {
                    bianhao
                }

                var cameraIndexCode  = vnb.bianhao;         //获取输入的监控点编号值，必填
                var startTimeStamp = new Date(this.startTime.replace('-', '/').replace('-', '/')).getTime();    //回放开始时间戳，必填
                var endTimeStamp = new Date(this.endTime.replace('-', '/').replace('-', '/')).getTime();        //回放结束时间戳，必填
                var recordLocation = 1;                                     //录像存储位置：0-中心存储，1-设备存储
                var transMode = 1;                                          //传输协议：0-UDP，1-TCP
                var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
                var wndId = -1;                                             //播放窗口序号（在2x2以上布局下可指定播放窗口）

                oWebControl.JS_RequestInterface({
                    funcName: "startPlayback",
                    argument: JSON.stringify({
                        cameraIndexCode: cameraIndexCode,                   //监控点编号
                        startTimeStamp: Math.floor(startTimeStamp / 1000).toString(),  //录像查询开始时间戳，单位：秒
                        endTimeStamp: Math.floor(endTimeStamp / 1000).toString(),      //录像结束开始时间戳，单位：秒
                        recordLocation: recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
                        transMode: transMode,                               //传输协议：0-UDP，1-TCP
                        gpuMode: gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
                        wndId:wndId                                         //可指定播放窗口
                    })
                })
            }catch(e){
                Message({
                    showClose: true,
                    message:`未获取到${data.carNumber}的nvr信息`,
                    type:'error',
                    duration:2000
                })
            }

        },   
        addCar(data){
            this.mapcarlist = data
          
        },
        carall(data){
          
           data.arr.forEach((item,i)=>{
                 
                try{
                    this.pingarr.forEach((item2,i2)=>{
                        if(!item2.jc_data){
                            var hk_index = 1
                            var hk_name = '云台'
                            this.pingarr[i2].jc_data = Object.assign({}, item, {hk_index,hk_name })

                            console.log(this.pingarr)

                            throw Error()
                        }
                    })

                }catch(err){
                    console.log(err)
                }   
           })
        },
        getDeptDatas(data){

            this.detid = data.id
        },
        song(data){
            console.log(data,'datay')
        },
        yidong(type){
            
            if(type==1){
                var topnum = $('.videowarp-bot').height()
                topnum = topnum *75/100 

                var topxian =  $('.videowarp').position().top;

                var apphei = $('#app').height()*10/100
                if(topxian>apphei){
                    $('.videowarp').animate({top:apphei+'px'});

                    this.kto=1
                }else{
                    $('.videowarp').animate({top:(topxian+topnum)+'px'});


                    this.kto=2
                }
               
            }else{
                
                var leftnum = $('.videowarp-bot').width()
                leftnum = leftnum *75/100 

                var rightxian =  $('.videowarp').css('right');

                
                if(rightxian == '0px'){
                  
                    $('.videowarp').animate({right:(-leftnum)+'px'});

                    this.kto=2
                }else{
                  
                    $('.videowarp').animate({right:0+'px'});

                    this.kto=1
                }

            }
        },
        getTreeDatas(data){
            console.log(data)
        },
         // 窗口分割
        getSlider(val){
           
        },
        async ptzCamera(leftRight, upDown, zoom) {
            console.log('云台控制：' + leftRight + ' : ' + upDown + " : " + zoom);
            
            let control_data={
                deviceId:this.pingarr[this.choose_pl].deviceId,
                channelId:this.pingarr[this.choose_pl].channelId,
                leftRight,
                upDown,
                zoom,
                controSpeed:this.controSpeed
            }

            await gb_control(control_data)
        },
      ended(val){
        this.status_arr[val].status=0
        
        //   this.timerso=new Date().getTime()
      },
      bofang(val){
          this.status_arr[val].status=2
        
        //   this.timerso=new Date().getTime()
      },
      pause(val){
          this.status_arr[val].status=1
         
        //   this.timerso=new Date().getTime()
      },
      error(val){
          this.status_arr[val].status=3
         
        //    this.timerso=new Date().getTime()
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

                if(!val.iscaozuo){
                    this.pingarr[val.ind].jc_data=null

                }
                this.isquanping=false
                this.isquanping_ind=''
                if(this.fornum==3){
                    this.pingarr.forEach((item,i)=>{
                        item.width='33.3%'
                        item.height='33.3%'
                    })
                }else if(this.fornum==4){
                    this.pingarr.forEach((item,i)=>{
                        item.width='25%'
                        item.height='25%'
                    })
                }else if(this.fornum==5){
                    this.pingarr.forEach((item,i)=>{
                        item.width='20%'
                        item.height='20%'
                    })
                }
            }
            // this.doudong = false;

            // setTimeout(()=>{
            //     this.doudong = true;
            // },200)
            

        },
        des(val,val2){
        
            setTimeout(()=>{
               this.status_arr[val2].status=0
          
           
            },500)
           
          
            this.pingarr[val].timer=new Date().getTime()
       
            
        },
        async handlePlay(data) {
           
          

            
            if(data.type=='all'){
               

                this.hk_arr.forEach((item,i)=>{
                    try{
                        this.pingarr.forEach((item2,i2)=>{
                            if(!item2.jc_data){
                                var hk_index = this.hk_arr[i].hk_index
                                var hk_name = this.hk_arr[i].hk_name
                                this.pingarr[i2].jc_data = Object.assign({}, data, {hk_index,hk_name })

                                throw Error()
                            }
                        })
                    }catch(err){
                        console.log(err)
                    }   
                  
                })
                
                // [this.choose_pl].jc_data=data
            }
            
            
        }, 
      

       

        async S_gb_channels(deviceId){
            // let loginParam = {
            //     username: 'admin',
            //     password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
            // }
            // var that = this;
            
            // await gb_login(loginParam)

            // this.$cookies.set("session", {"username": 'admin'}) ;
           
          
            var res = await gb_channels(deviceId);

            var deviceChannelList = res.list;

            return deviceChannelList
            
        },
        async S_gb_devicelist(islogin){
            // let loginParam = {
            //     username: 'admin',
            //     password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
            // }
            // var that = this;
            
            // await gb_login(loginParam)

            // this.$cookies.set("session", {"username": 'admin'}) ;
           
          
            var res = await gb_devicelist();

            var devicelList = res.list;

            devicelList = this.gaizao(devicelList)

            devicelList.forEach(async (item,i)=>{
                var channels = await this.S_gb_channels(item.deviceId)
                this.status_arr.push({
                    status_ind:i,
                    status:0,
                    kl:i,
                    name:item.name,
                    isonline:item.online,
                    da:item,
                    channels:channels
                })
            })

            //实时刷新警车状态
            // setInterval(async ()=>{
            //     var res = await gb_devicelist();

            //     var devicelList = res.list;

            //     devicelList = this.gaizao(devicelList)

            //     devicelList.forEach(async (item,i)=>{

            //         var channels = await this.S_gb_channels(item.deviceId)

            //         this.status_arr[i].isonline = item.online

            //         if(!this.status_arr[i].isonline){
            //             this.status_arr[i].status=0
            //         }
                   
            //     })
            //     // this.timerso=new Date().getTime()
            // },2000)
            
        },

        gaizao(arr){
            var L1=[],L2=[];
            arr.forEach((item,i)=>{
               if(item.online ){
                    L1.push(item)
               }else if(!item.online){
                    L2.push(item)
               }
           })
           var ews = L1.concat(L2)

           return ews
        },
        getNowTime(now) {
            // var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth(); //得到月份
            var date = now.getDate(); //得到日期
            var hour = now.getHours();
            var minu = now.getMinutes();
            var sec = now.getSeconds();

            hour = hour.toString().padStart(2, "0");
            minu = minu.toString().padStart(2, "0");
            sec = sec.toString().padStart(2, "0");
            month = month + 1;
            month = month.toString().padStart(2, "0");
            date = date.toString().padStart(2, "0");
            var defaultDate = `${year}-${month}-${date} ${hour}:${minu}:${sec}`;
            // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
            // console.log(yesterdsay)
            // debugger
            return defaultDate;
        },
        getNowTime2(now) {
            // var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth(); //得到月份
            var date = now.getDate(); //得到日期
            var hour = now.getHours();
            var minu = now.getMinutes();
            var sec = now.getSeconds();

            hour = hour.toString().padStart(2, "0");
            minu = minu.toString().padStart(2, "0");
            sec = sec.toString().padStart(2, "0");
            month = month + 1;
            month = month.toString().padStart(2, "0");
            date = date.toString().padStart(2, "0");
            var defaultDate = `${year}-${month}-${date}`;
            // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
            // console.log(yesterdsay)
            // debugger
            return defaultDate;
        },
        xiba() {
            
            var yesterdsay = this.getNowTime2(
                new Date()
            );
         
            var jkl = this.getNowTime(new Date());
  
            this.startTime = yesterdsay + " 00:00:00";
            this.endTime = jkl;



            // this.startTime = yesterdsay + " 08:03:00";
            // this.endTime = yesterdsay + " 12:05:00";
       
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
            
            
        }
    },

    async beforeDestroy() {
  
        if (oWebControl != null){
			oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题 
            oWebControl.JS_Disconnect().then(function(){  // 断开与插件服务连接成功
			}, 
			function() {  // 断开与插件服务连接失败
			});
        }
		
	},
    activated(){
        PubSub.publish("nmhead");
    },
    mounted (){
        PubSub.publish("jc_header_show", true);
        PubSub.publish("nmhead");
        this.fornum = 3


        this.xiba()
      

        var obj = $('.Map-Video--Video').offset()

        var imgw=$('.Map-Video--Video').innerWidth()
        var imgh=$('.Map-Video--Video').innerHeight()

        backbox ={
            top:obj.top,
            left:obj.left,
            width:imgw,
            height:imgh


        }

        // $(window).load(function () {
           
            
            // $('.playWnd').css('marginTop',`${backbox.top}px`)
            // $('.playWnd').css('marginLeft',`${backbox.left}px`)

            // setTimeout(()=>{
            initPlugin();
            // },5000)
           
        // });

    },
    components: {
        Map,
        DepTree,
        EmpMini,
        JcList,
        TitleTwo
    },
}
</script>
<style lang='scss'>
    // .Map-Video{
        .el-popper{
            width: 330px;
            left: auto;
            right:0
        } 
        .el-date-picker .el-picker-panel__content {
            width: 300px!important;
        } 
    // }
    
    .playWnd {
        /* margin: 30px 0 0 400px; */
        width: 100%;                   /*播放容器的宽和高设定*/
        height: 100%;
        /* border: 1px solid red; */
    }
   .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
        height: 34px;
      }
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

.nodata{
   width:100%;
   height: 100%;
}
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
   
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
   
    .Map-Video--left{
        width: 98.9%;
        height: 100%;
       
        position: relative;
        .Map-Video--Video{
            width: 100%;
            height: 100%;
            background:#fff;
            // background: #001854;
            box-sizing: border-box;
            overflow: auto;
            position:relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .tiao{
            width:100%;
            height:200px;
        }
        .Map-VideoImage{
            width: 100%;
            height: calc(15% - 10px);
            display: flex;
        }
        .Map-Video--image{
            width:  calc(100% - 10px);
            margin-top: 10px;
            height: 100%;
            padding: 10px 10px;
            background: #001854;
            box-sizing: border-box;
            white-space: nowrap;
          
            overflow: hidden;
            position: relative;
            .face-image{
                width: 68px;
                height: 68px;
                background: url('../assets/image/autoMap/face-gather.png');
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
                background: url('../assets/image/autoMap/Licenseplate-gather.png');
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
                border: 1px solid  #2A9DE6;/*no*/
                box-sizing: border-box;
                .el-image{
                    width: 100%;
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
            border:1px solid #fff;/*no*/
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
            // padding: 10px 0;
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
           
         height: calc((100% - 36px)/2 - 20px + 13%);
           margin: 10px 0; 
            background: #001854;
            box-sizing: border-box;
            overflow-y: auto;
            // .el-tree{
            //     color: #fff;
            //     background: #001854;

            //         ::v-deep  .el-tree-node.is-current.is-focusable{
            //             .el-tree-node__content{
            //                 background: #0A1080 !important;
            //             }
            //         }

            //      ::v-deep .el-tree-node{
            //         .el-tree-node__content:hover{
            //             background: #0A1080;
            //         }
            //         .el-tree-node__content:focus{
            //             background: #0A1080;
            //         }
            //         &:focus{
            //             background: #0A1080;
            //             .el-tree-node__content{
            //                 background: #0A1080 !important;
            //             }
            //         }
            //     }

            // }
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
        .Map-Video--right--btn{
            width: 100%;
            // height: 80px; //添加的---后期删除
            // line-height: 80px; //添加的---后期删除
            // margin: 10px 0; //添加的---后期删除
            height: calc((100% - 36px)/2 - 13%); //后期换上
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/xuanzhuan.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
                            background-image: url('../assets/image/btn.png');
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
              
            }
        }
    }
}

.video2 {
	border: solid 1px #a4f8ff;/*no*/
  
	position: relative;
    box-sizing:border-box
}

.video3 {
	border: solid 2px #14f114;/*no*/
  
	position: relative;
    box-sizing:border-box
}

.btn-shang{
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../assets/image/btn.png');
    background-repeat: no-repeat;
    background-position: 0px -42px;
    left:50%;
    top:10px;
    margin-left:-70px
}

#playWnd{
    width:100%;
    height:100%;
}

.btn-zuo {
    width: 140px;
    height: 56px;
    position: absolute;
    cursor: pointer;
    background-image: url('../assets/image/btn.png');
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
    background-image: url('../assets/image/btn.png');
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
    background-image: url('../assets/image/btn.png');
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

.videowarp{
    position: fixed;
    top: 10%;
    right: 0;
    width: 80.4%;
    height: 90%;
    z-index: 2;
    .videowarp-top{
        width: 100%;
        height: 2%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        img{
            width: 59px;
            height: 20px;
            max-height: 100%;
            display: block;

            &.wai{
                transform: rotate(0deg);
            }


            &.nei{
                transform: rotate(180deg);
            }
        }
    }
    .videowarp-bot{
        width: 100%;
        height: 100%;
        display: flex;
    }
}

.videowarp-left-box{
    width: 1.1%;
    display: flex;
}
.videowarp-left{
    // position: absolute;
    // width: 59px;
    // height: 20px;
    // left:-39px;
    // top: 50%;
    // transform: rotate(90deg);
   
    // transform-origin: 0 0;

    &.wai{
        position: absolute;
        width: 59px;
        height: 20px;
        left:-39px;
        top: 50%;
        transform: rotate(-90deg);
    }

    &.nei{
        position: absolute;
        width: 59px;
        height: 20px;
        left:-39px;
        top: 50%;
        transform: rotate(90deg);
    }
}


 .left.dvd{
    position: fixed;
    top: 10%;
    left: 1%;
    width: 18.5%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1;
    .left_top{
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
    }
    .left_mid{
        width: 100%;
        height: calc((100% - 170px) );
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
    }
    .left_bot{
        width: 100%;
       
        height: 150px;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        
        .xiba{
            padding:10px;
        }
    }
}
.slider-wrap{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .slider-wrap-left{
        width: 70%;
    }
}

.maidai{
    width: 100%;
    height: 40px;
}

.left_mid_bot{
    width: 100%;
    height: calc(100% - 50px);
}

.left_bot_bot{
    width: 100%;
    height: calc(100% - 50px);
    
}

.el-tree-node:focus>.el-tree-node__content {
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
    color:#2cc6ff ;
}

.el-tree-node__content:hover{
    background: linear-gradient(to right, #a4f8ff, rgba(255, 255, 255, 0))!important;
    color:#2cc6ff ;
}

.playback{
    width:100%;
    height:100%;
   
}
</style>
