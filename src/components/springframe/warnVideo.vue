<template>
  <div>
    <div class="page-bk-box border ">

      <p class="hf_tit">预警回放-{{warnvideodata.createTime}}</p>
      
      
        <div class="videsss" v-show='rtpes==1?true:false'>
          <div   id="elId" ></div>
  

          
       
        </div>
   
      
      
        <div class="videsss warnvideo-boxs" v-show='rtpes==2?true:false'>
          <div id='wdq' class="scxasvsad" ref="containesadr" ></div>

          <!-- <video id="mse" autoplay='true' playsinline controls="controls" :key='videossf'>
            <source :src="klj" type="video/mp4">
            your browser does not support the video tag
          </video> -->

          <div class="videowarn_progress">
            
            <!-- <i class="el-icon-video-play" v-if='!paly_bool' @click="tolls(1)"></i>
            <i class="el-icon-video-pause" v-if='paly_bool' @click="tolls(2)"></i> -->
            
            <el-progress  :percentage="percentage" ></el-progress>
          </div>
        </div>

        <div class="warnvideo——qx" @click="warnvideo_qxss">取消</div>
    </div>
  </div>
</template>
<script>
import Player from 'xgplayer';

import { gb_channels,gb_login,gb_start,gb_stop,gb_devicelist,gb_control,hf_yujing} from '@/api/video.js'
import {startLoding,endLoding} from '@/request/loading.js'
import { Message,Loading } from 'element-ui'
import FlvJsPlayer from 'xgplayer-flv.js';
import { v4 } from "uuid";

export default {
  props:['warnvideodata','warnVideoshow'],
  data() {
    return {
      radio: 1,
      textarea:"",
      player:null,
      jessibuca:null,
      rtpes:1,
    

      klj:'',

      videossf:0,

      percentage:0,

      hasbofang:0,

      paly_bool:false,

      urlsf:''
    };
  },
  
 
  watch:{
    warnVideoshow:{
        handler(newss, old) {

          if(!newss){
            if (this.jessibuca) {
            
              this.jessibuca.destroy();
              this.jessibuca.clearView();
              this.jessibuca=null
             
            }
          }

        },
        
        immediate: false
    },
    warnvideodata:{
        handler(newss, old) {

          var winhei = $(window).height()

          var scale_num2 = winhei/1080

          scale_num2 = scale_num2 * 0.6
          
          $('.page-bk-box').css({
              '-webkit-transform':'scale('+scale_num2+')',
              'transform':'scale('+scale_num2+')'
          })
          
          // newss.videoUrl = 'https://video.pearvideo.com/mp4/adshort/20211214/cont-1747849-15805363_adpkg-ad_hd.mp4'

          if(newss.videoUrl && newss.videoUrl.indexOf('mp4') !=-1){
            this.rtpes=1
            this.createPlayer(newss.videoUrl)

           
         
          }else{

            if(!newss.gbInfomation){
              Message({
                showClose: true,
                message:'未配置国标信息',
                type:'error',
                duration:2000
              })

              return
            }
          
            newss.ip=newss.gbInfomation

            this.rtpes=2
            this.gettongdao(newss)
          
          }


        },
        
        immediate: false
    },
  },
  methods: {
    tolls(tpye){
      if(tpye==1){
       
         
          
          this.jessibuca.play()
        
      }else{

        this.jessibuca.pause()
      }

    },
    warnvideo_qxss(){
      this.$emit('warnvideo_qxss')
    },
     getNowTime(now) {
        // var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date}`;
        // var yesterdsay = new Date(new Date().getTime() - 86400000*90);
        // console.log(yesterdsay)
        // debugger
        return defaultDate
    },
    xiba(){
        var yesterdsay = this.getNowTime(new Date(new Date().getTime() - 86400000*90));
        var jkl = this.getNowTime(new Date());
       
    },
    zhuan(data){
          
      let d = new Date(data)
      let date = (d.getFullYear()) + "-" + 
           (d.getMonth() + 1) + "-" +
           (d.getDate()) + " " + 
           (d.getHours()) + ":" + 
           (d.getMinutes()) + ":" + 
           (d.getSeconds());

      return date
    },
    async gethuifang(data,data2){
      // var res = await hf_yujing(data)

      // if(res.ws_flv){
      //   this.tyoeoss(res.ws_flv)
      // }else{
      //   Message({
      //     showClose: true,
      //     message:'视频通道网络异常',
      //     type:'error',
      //     duration:2000
      //   })
      // }
      console.log(data2,'556')


      var timestamp2 = Date.parse(new Date(data2.createTime));



      var qian = this.zhuan(timestamp2 - 15000)
      var hou = this.zhuan(timestamp2 + 15000)


      var loading_lo;
      try {
        loading_lo=startLoding('.warnvideo-boxs')
        
        // data.startTime=this.getNowTime(new Date())+' 00:00:00'
        // data.endTime=this.getNowTime(new Date())+' 23:59:59'
        data.startTime = qian
        data.endTime = hou
        
        var res = await hf_yujing(data);
        endLoding(loading_lo)
        if(res.ws_flv){
          this.urlsf=res.ws_flv
          this.tyoeoss(res.ws_flv)

          // this.createPlayer(res.ws_fmp4)

          // this.klj = res.fmp4

          // this.videossf = v4()

            // this.player = new FlvJsPlayer({
            //   id: 'wdq',
            //   url: res.ws_flv,
            //   fluid: true,
            //   autoplay: true,
            //   isLive: true,
            //   playsinline: false,
            //   screenShot: true,
            //   whitelist: [''],
            //   ignores: ['replay'],
            //   closeVideoClick: true,
            //   closeInactive: true,
            //   controls: true,
            //   errorTips: `网络异常`
            // });
        }else{
          Message({
            showClose: true,
            message:'网络质量差，稍后再试',
            type:'error',
            duration:2000
          })
        }
  

      }catch (err) {
        console.log(err)
        endLoding(loading_lo)
        Message({
          showClose: true,
          message:'网络质量差，稍后再试',
          type:'error',
          duration:2000
        })
      }
    
    
    },
    async gettongdao(data){


      var loading_lo;
      try {
        loading_lo=startLoding('.warnvideo-boxs')
        var res = await gb_channels(data.ip);
        endLoding(loading_lo)
        if(res && res.list){
 
          
          
          this.gethuifang(this.$IS_company?res.list[1]:res.list[0],data)
        
        }
  

      }catch (err) {
        
        endLoding(loading_lo)
        Message({
          showClose: true,
          message:'网络质量差，稍后再试',
          type:'error',
          duration:2000
        })
      }
          
			
    },
    tyoeoss(url){
        var that=this
        let options =  {};
				this.jessibuca = new window.Jessibuca(Object.assign(
					{
            container: this.$refs.containesadr,
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
          
          that.paly_bool = true
					
        });
        this.jessibuca.on("pause", (e) => {
         
          that.paly_bool = false
					
        });
        this.jessibuca.on('timeUpdate',function (ts) {
          console.log('timeUpdate',ts);
          that.percentage = (ts/300).toFixed(1)

          if(that.percentage>100){
            that.percentage = 100
          }
        })
				if (this.jessibuca.hasLoaded()) {
          this.jessibuca.play(url);
          
          
				} else {
					this.jessibuca.on("load", () => {
						console.log("load 播放")
            this.jessibuca.play(url);
            
           
					});
				}
    },

    createPlayer(url, hasCloseBtn, index) {
  
        // url='http://127.0.0.1:2001/1.flv'
        if (!url) {
          return;
        }

		
				this.player = new Player({
					id: 'elId',
          url: url,
          width: 1478,
          height: 780,
					fluid: true,
					autoplay: true,
					isLive: true,
					playsinline: false,
					screenShot: true,
					whitelist: [''],
					ignores: ['replay'],
          closeVideoClick: true,
          closeInactive: true,
					controls: true,
          errorTips: `视频地址无效`,
					flvOptionalConfig: {
						enableStashBuffer: false, //启用缓存
          }
          
				});

		},
      finish(){

      },
      cancel(){

      }
  },
  
  mounted(){
 
   
    
  }
};
</script>
<style lang="scss">
.con-result {
  .el-textarea__inner {
    border: 1px solid #00beff;
  }
}

.videowarn_progress{
  .el-progress__text{
    color: #fff;
  }
}

</style>

<style lang="scss" scoped>
// .page {
 
  // width: 100%;
  // height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // box-sizing: border-box;

  // opacity: 0.9;
  .page-bk-box {
    width: 1535px;/*no*/
    height: 922px;/*no*/
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -767.5px;/*no*/
    margin-top: -461px;/*no*/
    z-index: 3;
    background-image: url("../../assets/image/warning-video-box-2.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  
    .videsss{
      width: 1478px!important;/*no*/
      height: 780px!important;/*no*/
      background: #000;
      margin-top: 35px;/*no*/
      margin-left: 35px;/*no*/
      padding: none;/*no*/
      position: relative;
      #elId{
        // width: 100%;
        // height: 100%;
      }

      .videowarn_progress{
        position: absolute;
        width: 100%;
        bottom: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        background: #000;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-progress{
          width: 100%;
          
        }
        
        i{
          // width: 30px;
          // height: 30px;
          font-size: 70px;
          color:#fff;
        }
      }
    }
  }
// }

.hf_tit{
  color: #fff;
  margin-top: 4px;/*no*/
  margin-left: 14px;/*no*/
  font-size: 20px;/*no*/
}

.scxasvsad{
  width: 100%;
  height: 100%;
}

 .warnvideo——qx{
  position: absolute;
  right: 24px;/*no*/
  bottom: 22px;/*no*/
  width: 141px;/*no*/
  height: 44px;/*no*/
  line-height: 44px;/*no*/
  background: none;
  border:1px solid  #00beff;/*no*/
  text-align: center;
  box-sizing: border-box;
  color:#00beff ;
  font-size: 20px;/*no*/
}

.warnvideo-boxs{
  position: relative;
}

#mse{
  width: 100%;
  height: 100%;
}
</style>