<template>

	<!-- <div :id='nmk' class='weipai' style="position: absolute;height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;"  @mouseover='fo' @mouseleave='bl'> -->
	<div :id='nmk' class='weipai' :class='$route.path=="/diaodu2"?"nysj_the":""'    v-loading="loading">
		<div class="video" v-show="isPlay" id="playWnd" ref="container" ></div>

		<template v-if='$route.path!="/diaodu2"'>
			<div v-show="!isPlay" class="camera_box">
				<img :src="require('@/assets/image/camera.svg')" alt="" srcset="">
			</div>
	
		</template>
		
		<div class='quanppp'  @dblclick='full_s' ></div>

		<!-- <div class='app-close-btn' v-show='siclo'>
			<i @click="closePlayer" class="btn-hover el-icon-close app-close-btn-c"></i>
		</div>
		<div class='app-full-btn' v-show='siclo'>
			<i @click="full_s" class="btn-hover el-icon-full-screen full_s app-close-btn-c"></i>
		</div> -->
		

		<div class="dingbu" :class='$route.path=="/diaodu2"?"nysj_the":""' v-show="isPlay">

			<div class="dingbu-tit">
				{{jc_data?jc_data.carNumber:''}}-{{tongdaoname}}
			</div>

			<div class="btnzu">
				<img @click="control_bool" :src="require('@/assets/image/v-rocker-button.svg')" alt="" srcset="">
				<img  @click="full_s" :src="require('@/assets/image/v-window-max-button.svg')" alt="" srcset="">
				<img @click="closePlayer" :src="require('@/assets/image/v-close-button.svg')" alt="" srcset="">
			</div>
			
		</div>

		<!--<div class='biaozhi' v-show="isPlay &&　moshi=='hk'">
			hkvis
		</div>

		<div class='biaozhi' v-show="isPlay &&　moshi=='gb'">
			28181
		</div>-->

		<!--<div class="dibu" v-show="isPlay">

			<span>{{sudu}} kb/s</span>
			<span class="suduerror" v-show='sudu<300?true:false'>网络质量不佳</span>
		</div>-->
		
		<div class="sxt_choose" v-show='choose_bool' @click="yincang">
			<div class="sxt_choose-top">
				<div class="sxt_choose-item" @click.stop="new_bf(2,'左前摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>左前</span>
				</div>


				<div class="sxt_choose-item" @click.stop="new_bf(3,'左中前摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>左中前</span>
				</div>
				
				<div class="sxt_choose-item" @click.stop="new_bf(4,'右中前摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>右中前</span>
				</div>

				<div class="sxt_choose-item" @click.stop="new_bf(5,'右前摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>右前</span>
				</div>
			</div>
			<div class="sxt_choose-mid">
				<div class="sxt_choose-item" @click.stop="new_bf(1,'云台')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>云台</span>
				</div>
			</div>
			<div class="sxt_choose-bot">
				<div class="sxt_choose-item" @click.stop="new_bf(6,'左后摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>左后</span>
				</div>


				<div class="sxt_choose-item" @click.stop="new_bf(7,'左中后摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>左中后</span>
				</div>
				 
				<div class="sxt_choose-item" @click.stop="new_bf(8,'右中后摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>右中后</span>
				</div>

				<div class="sxt_choose-item" @click.stop="new_bf(9,'右后摄像机')">
					<img :src="require('@/assets/image/v-open-button.svg')" alt="" srcset="">
					<span>右后</span>
				</div>
			</div>
		</div>


		<div class="control_qiu" :id='qiu_kk' v-show="qiu_bool && !choose_bool">
			
			<template v-if="moshi=='gb'">
				<img class="shang" @mousedown="ptzCamera(0, 2, 0)" @mouseup="ptzCamera(0, 0, 0)" :src="require('@/assets/image/rocker-top.svg')" alt="" srcset="" >
				<img class="xia" @mousedown="ptzCamera(0, 1, 0)" @mouseup="ptzCamera(0, 0, 0)" :src="require('@/assets/image/rocker-down.svg')" alt="" srcset="">
				<img class="zuo" @mousedown="ptzCamera(2, 0, 0)" @mouseup="ptzCamera(0, 0, 0)" :src="require('@/assets/image/rocker-left.svg')" alt="" srcset="">
				<img class="you" @mousedown="ptzCamera(1, 0, 0)" @mouseup="ptzCamera(0, 0, 0)" :src="require('@/assets/image/rocker-right.svg')" alt="" srcset="">
			</template>
			
			<template v-if="moshi=='hk'">
				<img class="shang" @mousedown="hkcontrol('UP',0)" @mouseup="hkcontrol('UP',1)" :src="require('@/assets/image/rocker-top.svg')" alt="" srcset="" >
				<img class="xia" @mousedown="hkcontrol('DOWN',0)" @mouseup="hkcontrol('DOWN',1)" :src="require('@/assets/image/rocker-down.svg')" alt="" srcset="">
				<img class="zuo" @mousedown="hkcontrol('LEFT',0)" @mouseup="hkcontrol('LEFT',1)" :src="require('@/assets/image/rocker-left.svg')" alt="" srcset="">
				<img class="you" @mousedown="hkcontrol('RIGHT',0)" @mouseup="hkcontrol('RIGHT',1)" :src="require('@/assets/image/rocker-right.svg')" alt="" srcset="">
			</template>
			
			<img class="zhong" :src="require('@/assets/image/rocker-center.svg')" alt="" srcset="">

			<span class="tit">云台</span>
		</div>
		
	</div>
</template>

<script>
import crypto from 'crypto'
import { Message,Loading } from 'element-ui'
import { v4 } from 'uuid';
import { gb_channels,gb_login,gb_start,gb_stop,gb_devicelist,gb_control,ss} from '@/api/video.js'
import { getVideoUrl ,hikControl,getVideoUrl2,hikControl2,getVideoUrlback } from '@/api/hkvideo.js'
import {beFull,toggleFull,exitFull} from 'be-full';
import {startLoding,endLoding} from '@/request/loading.js'
// import Player from 'xgplayer';
import HlsPlayer from 'xgplayer-hls';
// import axios from 'axios'
export default {
	name: 'CusPlayer',
	components: {},
	props:['ind','rtspurl','statusind','deviceId','channelId','jc_data'],
	watch: {
		jc_data:{
			handler(newss, old) {
				 
					if(newss){
						
						if(this.$route.path=='/index'){
							this.new_bf(1,'云台')

							return
						}
						this.new_bf(newss.hk_index,newss.hk_name)

						// this.choose_bool=true
						
						// debugger

						// this.gettongdao(newss)

						// this.hkvideo(newss)

						// 去除
						
					}
    		},
    
    		immediate: false
			

		}
    },
	data() {
		return {
			controSpeed: 60,
			choose_bool:false,
			jessibuca: null,
			isPlay: false,
			player: null,
			elId: '',
			isfull:false,
			siclo:true,
			nmk:'',
			qiu_kk:'',
			qiu_bool:false,
			tongdaolist:[],
			loading:false,
			sudu:0,
			tongdaoname:'',
			moshi:'',
			dingshicun:null
		};
	},
	created() {
		this.elId = v4(); // 避免key重复
		this.nmk = v4();
		this.qiu_kk = v4();
	},
	mounted() {

		this.control_bianimg()
		
		var that = this;
	
		that.qiu_reset()
		window.addEventListener("resize",function(){
			that.qiu_reset()
		});

		
	},
	methods: {
		async hkcontrol(command,action){
			try{
				
				var res=  await hikControl({code:this.jc_data.ip,command,action})
				

			}catch(e){
				if(this.$sj_bs == 'thjc'){
					try{
						var res=  await hikControl2({code:this.jc_data.ip,command,action})
					}catch(err2){
						Message({
							showClose: true,
							message:'网络质量差，稍后再试',
							type:'error',
							duration:2000
						})

						
					}
				}else{
					Message({
						showClose: true,
						message:'网络质量差，稍后再试',
						type:'error',
						duration:2000
					})
				}
				
			

			}		
		},
	
		async ptzCamera(leftRight, upDown, zoom) {
            console.log('云台控制：' + leftRight + ' : ' + upDown + " : " + zoom);
            var channelId=this.tongdaolist[this.$IS_company?1:0].channelId
            let control_data={
                deviceId:this.jc_data.ip,
                channelId,
                leftRight,
                upDown,
                zoom,
                controSpeed:this.controSpeed
			}
			

			// debugger
		    try {
			
				await gb_control(control_data);
				
			
            }catch (err) {
             
				Message({
					showClose: true,
					message:'网络质量差，稍后再试',
					type:'error',
					duration:2000
				})
            }
          
        },
		control_bianimg(){
			$(`#${this.nmk} .shang`).hover(function(){
			
				$(this).attr('src',require('@/assets/image/rocker-top-a.svg'))
			},function(){
				$(this).attr('src',require('@/assets/image/rocker-top.svg'))
			})

			$(`#${this.nmk} .xia`).hover(function(){
			
				$(this).attr('src',require('@/assets/image/rocker-down-a.svg'))
			},function(){
				$(this).attr('src',require('@/assets/image/rocker-down.svg'))
			})

			$(`#${this.nmk} .zuo`).hover(function(){
			
				$(this).attr('src',require('@/assets/image/rocker-left-a.svg'))
			},function(){
				$(this).attr('src',require('@/assets/image/rocker-left.svg'))
			})

			$(`#${this.nmk} .you`).hover(function(){
			
				$(this).attr('src',require('@/assets/image/rocker-right-a.svg'))
			},function(){
				$(this).attr('src',require('@/assets/image/rocker-right.svg'))
			})

		
		},
		async gettongdao(data,index){
			
            
			var loading_lo;
			var dizhi;
            try {
				// loading_lo=startLoding('.weipai')

				this.loading=true

				let loginParam = {
					username: 'admin',
					password: crypto.createHash('md5').update('admin', "utf8").digest('hex')
				}
				var that = this;
				
				await gb_login(loginParam)

				this.$cookies.set("session", {"username": 'admin'}) ;

				
				var res = await gb_channels(data.ip);
				// endLoding(loading_lo)
				this.loading=false
				if(res && res.list){
					this.tongdaolist = res.list;

					if(!this.$IS_company){
						dizhi = await this.S_gb_start(this.tongdaolist[index-1])
					}else{
						dizhi = await this.S_gb_start(this.tongdaolist[index])
					}
					

					this.createPlayer(dizhi, true, 0)

				
				}
				
				
            }catch (err) {
             
				// endLoding(loading_lo)
				this.loading=false
				Message({
					showClose: true,
					message:'网络质量差，稍后再试',
					type:'error',
					duration:2000
				})
				this.closePlayer()
            }
          
			
		},
		async new_bf(index,name){
			this.tongdaoname = name
			//页面加载时创建播放实例初始化
    $(window).load(function () {
        initPlugin();
    });

    //声明公用变量
    var initCount = 0;
    var pubKey = '';

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
                
                    oWebControl.JS_CreateWnd("playWnd", 1000, 600).then(function () {         //JS_CreateWnd创建视频播放窗口，宽高可设定
                        console.log("JS_CreateWnd success");
                        init();                                 //创建播放实例成功后初始化
                    });
                }, function () {

                });
            },
            cbConnectError: function () {
                console.log("cbConnectError");
                oWebControl = null;
                $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
                WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
                initCount ++;
                if (initCount < 3) {
                    setTimeout(function () {
                        initPlugin();
                    }, 3000)
                } else {
                    $("#playWnd").html("插件启动失败，请检查插件是否安装！");
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
			var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
			//var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
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
					buttonIDs: buttonIDs                       //自定义工具条按钮
					//reconnectTimes：reconnectTimes,            //重连次数
					//reconnectDuration：reconnectTime           //重连间隔
                })
            }).then(function (oData) {
				oWebControl.JS_Resize(1000, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
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
	
	// 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
	 $(window).resize(function () { 
        if (oWebControl != null) {
            oWebControl.JS_Resize(1000, 600);
            setWndCover();
        }
    });
	
	// 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
	$(window).scroll(function () {
        if (oWebControl != null) {
            oWebControl.JS_Resize(1000, 600);
            setWndCover();
        }
    });
	
	
	// 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    function setWndCover() {
        var iWidth = $(window).width();
        var iHeight = $(window).height();
        var oDivRect = $("#playWnd").get(0).getBoundingClientRect();

        var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left): 0;
        var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top): 0;
        var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
        var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = (iCoverLeft > 1000) ? 1000 : iCoverLeft;
        iCoverTop = (iCoverTop > 600) ? 600 : iCoverTop;
        iCoverRight = (iCoverRight > 1000) ? 1000 : iCoverRight;
        iCoverBottom = (iCoverBottom > 600) ? 600 : iCoverBottom;

		oWebControl.JS_RepairPartWindow(0, 0, 1001, 600);   // 多1个像素点防止还原后边界缺失一个像素条
        if (iCoverLeft != 0) {
			oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
        }
        if (iCoverTop != 0) {
            oWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
        }
        if (iCoverRight != 0) {
            oWebControl.JS_CuttingPartWindow(1000 - iCoverRight, 0, iCoverRight, 600);
        }
        if (iCoverBottom != 0) {
            oWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, 1000, iCoverBottom);
        }
    }
	

    //录像回放功能
    $("#startPlayback").click(function () {

        var cameraIndexCode  = $("#cameraIndexCode").val();         //获取输入的监控点编号值，必填
        var startTimeStamp = new Date($("#startTimeStamp").val().replace('-', '/').replace('-', '/')).getTime();    //回放开始时间戳，必填
        var endTimeStamp = new Date($("#endTimeStamp").val().replace('-', '/').replace('-', '/')).getTime();        //回放结束时间戳，必填
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
    });

    // 停止回放
    $("#stopAllPlayback").click(function () {
        oWebControl.JS_RequestInterface({
            funcName: "stopAllPlayback"
        })
    });

    //设置录像回放时间的默认值
    var endTime = dateFormat(new Date(), "yyyy-MM-dd 23:59:59");
    var startTime = dateFormat(new Date(), "yyyy-MM-dd 00:00:00");
    $("#startTimeStamp").val(startTime);
    $("#endTimeStamp").val(endTime);

    // 格式化时间
    function dateFormat(oDate, fmt) {
        var o = {
            "M+": oDate.getMonth() + 1, //月份
            "d+": oDate.getDate(), //日
            "h+": oDate.getHours(), //小时
            "m+": oDate.getMinutes(), //分
            "s+": oDate.getSeconds(), //秒
            "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
            "S": oDate.getMilliseconds()//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // 标签关闭
    $(window).unload(function () {
        if (oWebControl != null){
			oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避插件窗口滞后于浏览器消失问题
            oWebControl.JS_Disconnect().then(function(){}, function() {});
        }
    });
			
			
			// try{
			
			// 	// var res=  await getVideoUrl({code:this.jc_data.ip,channelNo:index})
		

			// 	// if(res.result.indexOf(":83") > -1){

			// 	// }else{
			// 	// 	if(this.$sj_bs == 'thjc'){
			// 	// 		res.result = res.result
			// 	// 	}else{
			// 	// 		res.result = 'http://41.211.252.161:83'+res.result
			// 	// 	}
					
			// 	// }

			// 	var res=  await getVideoUrlback({code:this.jc_data.ip,channelNo:index,startTime:this.jc_data.startTime,endTime:this.jc_data.endTime})
			// 	this.createPlayer(res.result.url, true, 0,true)

				
			// }catch(e){
			// 	Message({
			// 		showClose: true,
			// 		message:'网络质量差，稍后再试',
			// 		type:'error',
			// 		duration:2000
			// 	})
				
			// }
			

			
		},
		async S_gb_start(data){
			
			if(!data || !data.deviceId || !data.channelId){
				Message({
					showClose: true,
					message:'网络质量差，稍后再试',
					type:'error',
					duration:2000
				})

				this.closePlayer()

				return
			}
            var da = {
                deviceId:data.deviceId,
                channelId:data.channelId
            }
        
            if(this.$IS_company){

					var loading_lo;
					try {
						// loading_lo=startLoding('.weipai')
						this.loading=true
						var res = await gb_start(da);
						// endLoding(loading_lo)
						this.loading=false
					  	if(res.code==0 && res.data && res.data.ws_flv){
			
						
							let urls;
							
							urls=res.data.ws_flv
						
						
							return urls
						}else{
							

							return false
						}
					
					}catch (err) {
					
						// endLoding(loading_lo)
						this.loading=false
					
						return false
					}
				
               
              
            }else{
                let Webscocket_video = sessionStorage.Webscocket_video
                let urls= `ws://${Webscocket_video}:30001/rtp/${data.deviceId}/${data.channelId}.flv`;
  
                return urls
            }
            
            
        },
		control_bool(){
			this.qiu_bool = !this.qiu_bool
		},
		qiu_reset(){
		
			var bili=1;
			
			var cont_width = $(`#${this.nmk} .control_qiu`).height()

			var win_width = $(`#${this.nmk} .quanppp`).height()

			if(cont_width/win_width != 0.4){

				bili = win_width*0.4/cont_width

				$(`#${this.nmk} .control_qiu`).css({
					'-webkit-transform':'scale('+bili+')',
					'transform':'scale('+bili+')'
				})
			}
			
			
		},
		yincang(){
			this.choose_bool=false
		},
		full_s(){
			var el = document.getElementById(this.nmk);
			toggleFull(el);
		},
		async createPlayer(url, hasCloseBtn, index,ishk) {	

			var that =this
			
			if (!url) {
				return;
			}

			if (this.player) {
				this.player.destroy();
				this.player=null
			}

			this.isPlay = true;
			this.choose_bool = false
			
			this.moshi='gb'
			let options =  {};
			this.jessibuca = new window.Jessibuca(Object.assign(
				{
					container: this.$refs.container,
					videoBuffer: 0.5, // 最大缓冲时长，单位秒
					decoder: "/jus/demo/public/index.js",
					// text: "WVP-PRO",
					// background: "bg.jpg",
					loadingText: "加载中",
					
					// useMSE:true
				},
				options
			));
			this.jessibuca.play(url);
			this.jessibuca.on("play", () => {
		
				// this.$emit('bofang',this.statusind)
			});
			
			if (this.jessibuca.hasLoaded()) {
				this.jessibuca.play(url);
			} else {
				this.jessibuca.on("load", () => {
					console.log("load 播放")
					this.jessibuca.play(url);
				});
			}

			this.jessibuca.on('kBps', function (kBps) {
				// debugger
				that.sudu = Math.round(kBps);
				console.log(kBps,this.sudu,'65465465*************')
				
			});

					
			
	
		},
		fo(){
			this.siclo=true
		},
		bl(){
			this.siclo=false
		},
		quanpp(){
			var el = document.getElementById(this.nmk);

			exitFull();

			
			if(!this.isfull){
				// this.player.getFullscreen(this.player.root)
				this.$emit('quanping',{ind:this.ind,status:1})
				this.isfull=true


			}else{
				this.$emit('quanping',{ind:this.ind,status:2,iscaozuo:true})
				this.isfull=false
				// this.player.exitFullscreen(this.player.root)
			}

			
			setTimeout(()=>{
				this.qiu_reset()
			},100)
			

			// setTimeout(()=>{
			// 	this.jessibuca.resize()
			// },500)
			
		},
	
		async closePlayer() {
			exitFull();
			this.$emit('quanping',{ind:this.ind,status:2})

			

			this.isfull=false
			this.isPlay = false;

			this.qiu_bool = false
			if (this.player) {
				
				this.player.destroy();
				this.player=null
			
			}

			if (this.jessibuca) {
				
				this.jessibuca.destroy();
				this.jessibuca.clearView();
				this.jessibuca=null
			
			}
		}
	},

	async beforeDestroy() {
		this.closePlayer();
		
	}

	// destroyed() {
	//   if(this.player){
	//     this.player.destroy();
	//   }
	// }
};
</script>
<style scoped>

</style>
<style lang='scss'>
.app-full-btn{
	position: absolute;
  	bottom: 0px;
  	right: 5px;
  	z-index: 500;
}
.full_s{
	/* margin-right: 10px; */
	

}
.camera_box{
	position: absolute;
	top:0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #fff;
	// background: linear-gradient(to top right, #fff,#e2e2e2)!important;
	display: flex;
	justify-content: center;
	align-items: center;
}
.weipai{

	background: #000;
	position: absolute;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	 &.nysj_the{
		 background:#000;
	 }
}
.btn-hover:hover {
	color: #08979c;
	cursor: pointer;
}
.btn-hover {
	color: #ffffff;
}
.video {
	position: relative !important;
	width:100%!important;
	height:100%!important;
	padding-top: 0px !important;
}
.app-close-btn {
  position: absolute;
  top: 0px;
  right: 5px;
  z-index: 500;
 
}
.app-close-btn-c {
  color: #aaffff;
  font-size: 25px;
  pointer-events: auto;
  z-index: 500;
}
.quanppp{
	width:100%;
	height:100%;
	position:absolute;
	left:0;
	top:0;
	z-index:1;
}
.weipai canvas{
	width:100%;
	height:100%;
	transform:scale(1)!important;
	left:0!important;
	top:0!important;
}
.dibu{
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	// height: 49px;
	background: rgba(255,255,255,0.9);
	z-index: 2;
	span{
		margin-left: 15px;
		// color: #78b6ee;
	}
}
.dingbu{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	// height: 49px;
	padding-top: 2px;
	padding-bottom: 2px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: rgba(255,255,255,0.9);
	z-index: 200;
	&.nysj_the{
		
	}
	.dingbu-tit{
		color: #78b6ee;
		overflow:hidden;

		text-overflow:ellipsis;

		white-space:nowrap;
		margin-left: 15px;
	}

	.btnzu{
		margin-right: 15px;
		display: flex;
		img{

			height: 15px;
			margin-left: 15px;
		}
	}

}

.biaozhi{
	position: absolute;
	bottom: 0;
	left: 0;
	background: rgba(255,255,255,0.9);
	z-index: 200;
}

.sxt_choose{
	position: absolute;
	z-index: 4;
	background: #000;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.sxt_choose-top{
	display: flex;

	justify-content:space-around ;
}
.sxt_choose-mid{
	display: flex;

	justify-content:center ;
}
.sxt_choose-bot{
	display: flex;

	justify-content:space-around ;
}
.sxt_choose-item{
	position: relative;
	width: 60px;
	height: 28px;
	color: #fff;
	text-align: center;
	line-height: 28px;
	img{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	span{
		
		position: relative;
		z-index: 2;
		font-size: 12px;
		
	}
}

.control_qiu{
	width: 140px;/*no*/
	height: 140px;/*no*/
	position: absolute;
	right: 0;
	bottom: 0;
	// transform: scale(calc(380));
	// : ;
	z-index: 5;
	transform-origin: right bottom;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #00beff;
	.zuo{
		position: absolute;
		width: 40px;/*no*/
		height: 97px;/*no*/
		left: 0;
		top: 50%;
		margin-top: -48.5px;/*no*/
	}

	.shang{
		position: absolute;
		width:97px;/*no*/
		height:40px;/*no*/
		top: 0;
		left: 50%;
		margin-left: -48.5px;/*no*/
	}

	.you{
		position: absolute;
		width: 40px;/*no*/
		height: 97px;/*no*/
		right: 0;
		top: 50%;
		margin-top: -48.5px;/*no*/
	}
	.xia{
		position: absolute;
		width: 97px;/*no*/
		height: 40px;/*no*/
		bottom: 0;
		left: 50%;
		margin-left: -48.5px;/*no*/
	}
	.zhong{
		position: absolute;
		width: 79px;/*no*/
		height: 79px;/*no*/
		left: 50%;
		top:50%;
		margin-left: -39.5px;/*no*/
		margin-top: -39.5px;/*no*/
	}

}
</style>
