<template>

	<!-- <div :id='nmk' class='weipai' style="position: absolute;height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;"  @mouseover='fo' @mouseleave='bl'> -->
	<div :id='nmk' class='weipai' :class='$route.path=="/diaodu2"?"nysj_the":""'    v-loading="loading">
		<div class="video" v-show="isPlay" :id="elId" ref="container" ></div>

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
import { getVideoUrl ,hikControl,getVideoUrl2,hikControl2,getDeviceStreamUrl } from '@/api/hkvideo.js'
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
				 
				  console.log(newss)
	
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
			try{
				var res = await getDeviceStreamUrl({code:'41130100071120000026',channelNo:(index-1)})
				console.log(res,'res111111')
				this.createPlayer(res, true, 0,true)
			}catch(err){

			}
		},
		async new_bf2(index,name){
			this.tongdaoname = name
			
			
			
			try{
				// this.jc_data.ip= '41130100001110007976'
				var res=  await getVideoUrl({code:this.jc_data.ip,channelNo:index})
				// if(this.$env_bs=='production'){
				// 	res.result = 'http://41.211.252.161:83'+res.result
				// }

				if(res.result.indexOf(":83") > -1){

				}else{
					if(this.$sj_bs == 'thjc'){
						res.result = res.result
					}else{
						res.result = 'http://41.211.252.161:83'+res.result
					}
					
				}
				
				this.createPlayer(res.result, true, 0,true)

				
			}catch(e){

				if(this.$sj_bs == 'thjc'){
					try{
						var res=  await getVideoUrl2({code:this.jc_data.ip,channelNo:index})
						// if(this.$env_bs=='production'){
						// 	res.result = 'http://41.211.252.161:83'+res.result
						// }
						
						if(res.result.indexOf(":83") > -1){

						}else{
							res.result = res.result
						}
						
						this.createPlayer(res.result, true, 0,true)
					}catch(err2){
						if(this.$route.path!='/diaodu2'){
							this.gettongdao(this.jc_data,index)
						}else{
							Message({
								showClose: true,
								message:'网络质量差，稍后再试',
								type:'error',
								duration:2000
							})		
							this.closePlayer()
						}
						
					}
		
				}else{
					if(this.$route.path!='/diaodu2'){
						this.gettongdao(this.jc_data,index)	
					}else{
						Message({
							showClose: true,
							message:'网络质量差，稍后再试',
							type:'error',
							duration:2000
						})
						this.closePlayer()
					}
					
				}
				
				
			}
			

			
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
			
			if(ishk){
				this.moshi='hk'
				this.player = new HlsJsPlayer({
					"id": this.elId,
					"url": url,
					"playsinline": true,
					"whitelist": [
							""
					],
					"crossOrigin":true,
					"autoplay": true,
					"controls":false,
					"ignores": ['loading'],
					"errorTip":''
				});
				var uss=false
				this.player.once('complete',()=>{
					this.dingshicun=setTimeout(()=>{
						if(uss==false){
							console.log('重载')
							
							this.player = new HlsJsPlayer({
								"id": this.elId,
								"url": url,
								"playsinline": true,
								"whitelist": [
										""
								],
								"autoplay": true,
								"controls":false,
								"ignores": ['loading'],
								
							});
						}

						// this.dingshicun=setTimeout(()=>{
						// 	if(uss==false){
						// 		console.log('重载')
						
						// 		this.player = new HlsJsPlayer({
						// 			"id": this.elId,
						// 			"url": url,
						// 			"playsinline": true,
						// 			"whitelist": [
						// 					""
						// 			],
						// 			"autoplay": true,
						// 			"controls":false,
						// 			"ignores": ['loading','play'],
									
						// 		});
						// 	}

						// 	this.dingshicun=setTimeout(()=>{
						// 		if(uss==false){
						// 			console.log('重载')
						// 			this.player.reload()
						// 		}

						// 	},(this.ind+1)*4000)

						// },(this.ind+1)*4000)

					},(this.ind+1)*30000)
					
				})

				this.player.once('play',()=>{
					console.log('播放')
					uss=true

					if(this.dingshicun){
						clearTimeout(this.dingshicun)
						this.dingshicun=null
					}
					
				})
				this.player.once('pause',()=>{
					this.player.play()
				})
				

			
			}else{
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

				
			}				
	
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
