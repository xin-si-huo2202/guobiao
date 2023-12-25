<template>
    
    <div class="map_obj_box">
        <div :id="map_obj" class='lkjcsdklc'>
            
                
        </div>


        <div class='guiji'>
            <div class='guiji-tit'>
                <span>轨迹查询</span>

                <div class='xian'></div>

                <img class='reliimg' @click="choose_guiji_type(1)"  :src="guiji_type==1?require('@/assets/image/guiji-active.png'):require('@/assets/image/guiji-not.png')" />

                <span class='reli'>热力图</span>

                <img class='xianluimg' @click="choose_guiji_type(2)"  :src="guiji_type==2?require('@/assets/image/guiji-active.png'):require('@/assets/image/guiji-not.png')" />

                <span class='reli'>线路图</span>
            </div>

            <div class='guiji-sj'>
                
                <div class="guiji-sj-item">
                    <date-picker :confirm='true' confirm-text='确定'   placeholder='开始日期' valueType="format"  :lang="lang" v-model="startTime" type="datetime" ></date-picker>
                   
                </div>

                <div class="guiji-sj-item jieshu">
                    <date-picker :confirm='true' confirm-text='确定'   placeholder='结束日期' valueType="format" :lang="lang" v-model="endTime" type="datetime"></date-picker>
               
                </div>
                
            </div>

            
            <div class="guiji-btn">
                <p class="cha" @click="chaxun_guiji">轨迹查询</p>

                <p class="qu" @click='yincang()'>取消</p>
            </div>
        </div>

        
    </div>
    
    
    
</template>

<script>

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/zh-cn';
import { Message,Loading } from 'element-ui'
import { selectGps } from "@/api/monitor.js";
import PubSub from 'pubsub-js'
import { v4 } from 'uuid';
import {startLoding,endLoding} from '@/request/loading.js'
import { gyxyFaceWarning_edit,gyxyPlateWarning_edit} from '@/api/warningInfo.js'
import { quandata} from '@/api/system.js'
// var map;
// var that.markerList = [];

//计算地图覆盖物缩放比例
var winwid = $(window).width()

var scale_num = winwid/1920

if(scale_num<1){
    scale_num=1
}

scale_num = scale_num * 0.9




export default {
    name:'Map',
    props:[
       'mapcarlist',
       'dingwei',
       'mapyujinglist',
       'chepaiwarn',
       'chepaiwarn_rx',
       'guijiList',
       'gujid'
    ],
    watch: {
        gujid:{
             handler(newss, old) {
                var that=this
                if(newss){


                    that.show_guiji_info(newss)
                  
                }

                
    		},
    
    		immediate: false
        },
        guijiList:{
             handler(newss, old) {

                if(newss.length!=0){
               
                    this.clearyujing('guijibox')
                    newss.forEach((item,i)=>{
                        //去除
                        // var point = {
                        //     "lng": 112.504313,
                        //     "lat": 33.003551
                        // }

                        var point = {
                            "lng": item.gpsLongitude,
                            "lat": item.gpsLatitude
                        }
                
                        // 给地图添加点
                        this.createMark_cpguiji(point,i,item);

               
                        //去除
                        // if(item.carNumber=='豫R3D368'){
                        //     this.createMark_car(point,i,item);
                        // }

                        // if(item.carNumber=='豫R892D5'){
                        //     this.createMark_car(point,i,item);
                        // }
                        
                       
                    });
                  
                  
                }

                
    		},
    
    		immediate: false
        },
        chepaiwarn:{
            handler(newss, old) {

                

                var point = {
                    "lng": newss.longitude,
                    "lat": newss.latitude
                }
            
                // 给地图添加点
                this.createMark_yujing(point,0,newss);
                
    		},
    
    		immediate: false
        },
        chepaiwarn_rx:{
            handler(newss, old) {


                // var point = {
                //     "lng": newss.longitude,
                //     "lat": newss.latitude
                // }
            
                // // 给地图添加点
                // this.createMark_yujing_rx(point,0,newss);
                
    		},
    
    		immediate: false
        },
		mapcarlist:{
			handler(newss, old) {
                
                if(newss.length!=0){
                    $('.guiji').appendTo($('.map_obj_box'))

                    $('.infobox').hide()
                    this.clearyujing('zidingyibox')
                    newss.forEach((item,i)=>{
                        var point = {
                            "lng": item.longitude,
                            "lat": item.latitude
                        }
                    
                        // 给地图添加点
                        this.createMark_car(point,i,item);

                        
                        //去除
                        // if(item.carNumber=='豫R3D368'){
                        //     this.createMark_car(point,i,item);
                        // }

                        // if(item.carNumber=='豫R892D5'){
                        //     this.createMark_car(point,i,item);
                        // }
                        
                       
                    });
                  
                  
                }


    		},
    
    		immediate: false
			
        },

        mapyujinglist:{
			handler(newss, old) {

                if(newss.length){
                    
                  
                    
                    // newss.forEach((item,i)=>{
                    //     var point = {
                    //         "lng": item.longitude,
                    //         "lat": item.latitude
                    //     }
                    
                    //     // 给地图添加点
                    //     this.createMark_yujing(point,i,item);
                          
                       
                    // });
               
                }


    		},
    
    		immediate: false
			
        },
        
        dingwei:{
            handler(newss, old) {
                
               
                this.show_car_info(newss)

    		},
    
    		immediate: false
        }
    },
    
    data () {
        return {
            startTime:'',
            
            endTime:'',

             lang: {
                formatLocale: {
                    firstDayOfWeek: 1,
                },
                monthBeforeYear: false,
            },

            guiji_type:2,

            dingwei_pcNumber:'',

            map_obj:v4(),

            mapdui:null,

            markerList:[],

        };
    },
    destroyed() {
       
    },
    
    methods: {
        suyuan(newss){
            
        
            if(this.$route.path=='/index'){
                this.$router.push({
                    path:'/Tracetracing',
                    query: {
                        plateNo: newss.plateCode,
                        timeStart:'',
                        timeEnd:'',
                        pageType: 3,
                    },
                });
            }else{
                this.$router.push({
                    path:'/Tracetracing',
                    query: {
                        plateNo: newss.plateCode,
                        timeStart:'',
                        timeEnd:'',
                    },
                });
            }
          
        },
        //轨迹查询
        async getTrack() {
          
            var form={
                pcNumber: this.dingwei_pcNumber,
                timeStart: this.startTime,
                timeEnd: this.endTime,
            }

            let arr = null;
            let PointArr = [];

            var loading_lo;

            try {
                loading_lo = startLoding(".cha");
                const res = await selectGps(form);
                
                endLoding(loading_lo);
                if(!res.result || res.result.list.length==0 ){
                    this.$message.error("车辆没有行车轨迹!");
                    return
                }
                arr = res.result.list;
                // console.log(arr,'oiuoiuoiuoi')
                
                // console.log(this.typeid, "this.typeid");
                if (this.guiji_type == 1) {
                    for (var i = 0; i < arr.length; i++) {
                        // eslint-disable-next-line no-undef
                        for (var i2 = 0; i2 < arr[i].length; i2++) {
                            PointArr.push(new BMap.Point(arr[i][i2].gpsLon, arr[i][i2].gpsLat));
                        }
                    
                    }
                    // this.$emit("getTrack", PointArr);

                    sessionStorage.setItem('PointArr',JSON.stringify(PointArr))
                    sessionStorage.setItem('PointArr_type',this.guiji_type)
                    this.$router.push({ 
                        path:'/selectgps'
                    });
                

                    
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        // eslint-disable-next-line no-undef
                        PointArr.push([])
                        for (var i2 = 0; i2 < arr[i].length; i2++) {
                            PointArr[i].push(new BMap.Point(arr[i][i2].gpsLon, arr[i][i2].gpsLat));
                        }
                        
                    }
                    console.log(PointArr,'PointArroiuoiuoiuoi')
                    
                    // this.$emit("getTrack_poly", PointArr);

                    sessionStorage.setItem('PointArr',JSON.stringify(PointArr))
                    sessionStorage.setItem('PointArr_type',this.guiji_type)
                    this.$router.push({ 
                        path:'/selectgps'
                    });
                }
            } catch (err) {
                endLoding(loading_lo);
               

                Message({
                    showClose: true,
                    message: "网络异常",
                    type: "error",
                    duration: 2000,
                });
            }
          
            
        
                
            
        },
        chaxun_guiji(){
            this.getTrack()
            // Message({
            //     showClose: true,
            //     message:'接口暂无此功能',
            //     type:'error',
            //     duration:2000
            // })
        },
        show_car_info(data,zt=false){
            var that=this
            this.dingwei_pcNumber=data.carNumber
          
            that.markerList.forEach((d1,i)=>{
               
                if(d1){
                    if($(d1._div).attr('carId') == data.carId){
            
                        $('.guiji').appendTo($(d1._div).find('.infobox'))


                        if(zt=='block'){
                            $(d1._div).find('.infobox').show()
                    
                        }else{
                            $(d1._div).find('.infobox').toggle()
                        }

                        var yuandata = JSON.parse($(d1._div).attr('yuandata')) 
                        

                        var point = {
                            "lng": yuandata.longitude,
                            "lat": yuandata.latitude
                        }


                        var position2={x:'',y:''};

                        var position = that.mapdui.pointToOverlayPixel(point);
                        // debugger
                        position2.x = position.x + 472/2;
                        position2.y = position.y - 381/2;

                        var cen = that.mapdui.overlayPixelToPoint(position2)

                        that.mapdui.setCenter(cen);
                
                        $(d1._div).css({
                            'z-index':2
                        })
                    }else{
                        $(d1._div).find('.infobox').hide()

                        //把预警的都给隐藏
                        $(d1._div).find('.yujing_info').hide()
                        $(d1._div).find('.yujing_info-rx').hide()

                        $(d1._div).css({
                            'z-index':1
                        })
                    } 
                }
                
    
            })
        },
        show_guiji_info(data){
            
            this.markerList.forEach((d1,i)=>{
               
                if(d1){
                    if($(d1._div).attr('createTime') == data.createTime){
            
                        $(d1._div).find('.guiji-info').toggle()

                        $(d1._div).css({
                            'z-index':2
                        })
                    }else{
                        $(d1._div).find('.guiji-info').hide()

                        $(d1._div).css({
                            'z-index':1
                        })
                    } 
                }
                
    
            })
        },
        show_yujing_cp_info(data){
            var that=this
            this.markerList.forEach((d1,i)=>{
               
                if(d1){
                    if($(d1._div).attr('yujingid-cp') == data.id){
            
                        // $(d1._div).find('.yujing_info').toggle()

                        $(d1._div).find('.yujing_info').show()

                        $(d1._div).css({
                            'z-index':2
                        })

                        var yuandata = JSON.parse($(d1._div).attr('yuandata')) 
                        

                        var point = {
                            "lng": yuandata.longitude,
                            "lat": yuandata.latitude
                        }


                        var position2={x:'',y:''};

                        var position = that.mapdui.pointToOverlayPixel(point);
                        // debugger
                        position2.x = position.x + 472/2;
                        position2.y = position.y - 381/2;

                        var cen = that.mapdui.overlayPixelToPoint(position2)

                        that.mapdui.setCenter(cen);
                    }else{
                        $(d1._div).find('.yujing_info').hide()

                        //把人像预警的和警车列表的也隐藏
                        $(d1._div).find('.infobox').hide()
                        $(d1._div).find('.yujing_info-rx').hide()
                        
                        $(d1._div).css({
                            'z-index':1
                        })
                    } 
                }
                
    
            })
        },
        show_yujing_rx_info(data){
            var that =this
            this.markerList.forEach((d1,i)=>{
               
                if(d1){
                    if($(d1._div).attr('yujingid-rx') == data.id){
            
                        // $(d1._div).find('.yujing_info-rx').toggle()

                        $(d1._div).find('.yujing_info-rx').show()

                        $(d1._div).css({
                            'z-index':2
                        })

                        var yuandata = JSON.parse($(d1._div).attr('yuandata')) 
                        

                        var point = {
                            "lng": yuandata.longitude,
                            "lat": yuandata.latitude
                        }


                        var position2={x:'',y:''};

                        var position = that.mapdui.pointToOverlayPixel(point);
                        // debugger
                        position2.x = position.x + 472/2;
                        position2.y = position.y - 530/2;

                        var cen = that.mapdui.overlayPixelToPoint(position2)

                        that.mapdui.setCenter(cen);
                    }else{
                        $(d1._div).find('.yujing_info-rx').hide()

                        //把警车预警的和警车列表的也隐藏
                        $(d1._div).find('.infobox').hide()
                        $(d1._div).find('.yujing_info').hide()
                        
                        $(d1._div).css({
                            'z-index':1
                        })
                    } 
                }
                
    
            })
        },
        yincang(){
            $('.infobox').hide()
        },
        choose_guiji_type(type){
            this.guiji_type=type
           
        },
        //初始化地图
        async baiduMapInit(){
            
            var hfh=this.map_obj
            // 百度地图API功能
            this.mapdui =  new BMap.Map(hfh,{minZoom:5,maxZoom:18});    // 创建Map实例

            // mapLatitude: 12124.1111111111
            // mapLongitude: 123.00000000000001

            var mapLatitude,mapLongitude;

            if(sessionStorage.mapLongitude){
                mapLongitude = sessionStorage.mapLongitude
                mapLatitude = sessionStorage.mapLatitude
            }

            this.mapdui.centerAndZoom(new BMap.Point(mapLongitude,mapLatitude), 18);  // 初始化地图,设置中心点坐标和地图级别
            // debugger
            this.mapdui.enableScrollWheelZoom(true);  //开启鼠标滚轮缩放

            //  map.addEventListener("click", function (e) {
                
            //     $('.infobox').hide()
            //     debugger

            // });

            console.log(this.$source_name,'source_name')
            // if(this.$route.path=='/index' && (this.$source_name == '测试服务器' || process.env.NODE_ENV == 'development') ){
            if(this.$route.path=='/index' ){
                console.log(this.$source_name)
                // debugger
                // if(!sessionStorage.quandata){
                //     var quanda =  await quandata()
                   
                //     sessionStorage.setItem("quandata",JSON.stringify( quanda.result ) );
                // }

                


            
                var ri= $('.index_ri').position().left

                var yhei = $(document).height()*10/100
                var ywid = $(document).width() - ri

          
                var that= this
                //图画样式  -- 圆红色边框
                var styleOptions = {
                    strokeColor: "red", //边线颜色。  
                    fillColor: "white", //填充颜色。当参数为空时，圆形将没有填充效果。  
                    strokeWeight: 2, //边线的宽度，以像素为单位。  
                    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。  
                    fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。  
                    strokeStyle: 'solid' //边线的样式，solid或dashed。  
                }
               //实例化鼠标绘制工具  
                var drawingManager = new BMapLib.DrawingManager(that.mapdui, {
                    enableCalculate: true, //是否开启测量模式
                    isOpen: false, //是否开启绘制模式
                    enableDrawingTool: true, //是否显示工具栏
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                        offset: new BMap.Size(ywid, yhei), //偏离值  左，上
                     
                        scale: 0.8, //工具栏缩放比例
                        drawingModes: [
                            
                            BMAP_DRAWING_CIRCLE,
                       
                            BMAP_DRAWING_CLEAR,
                        ]
                    },
               
                    circleOptions: styleOptions, //圆的样式  
                  
                });
                var dty;
                var that=this
                var cun,nums,r,che_nums,ren_nums;

                

                // if(dty.result && dty.result.length!=0){
                //     sessionStorage.setItem("quandd", 1) 
                // }
              
               
                drawingManager.addEventListener('overlaycomplete', async function(e) {
                    
                    cun = []
                    nums= 0
                    che_nums=0
                    ren_nums=0
                    
                    console.log(e,'789')

                    if(!dty){
                       drawingManager.close() 

                        // Message({
                        //     showClose: true,
                        //     message:'数据尚未返回，请稍后再试',
                        //     type:'error',
                        //     duration:2000
                        // })
                        that.createMark_loading(e.overlay.point,0,nums,cun,r,che_nums,ren_nums)
                       return
                    }

                   

                    
                    dty.result.forEach((item,i)=>{
                        var pointssy = new BMap.Point(item.gpsLongitude, item.gpsLatitude);
                        if(BMapLib.GeoUtils.isPointInCircle(pointssy, e.overlay)) {
                            
            

                            nums++

                            if(item.sortType==2){
                                che_nums++
                            }else{
                                ren_nums++
                            }

           
                        }

                    })
                    
                    r= Math.sqrt(e.calculate /Math.PI)

                    console.log(r,'半径')

                    that.createMark_loading(e.overlay.point,0,nums,cun,r,che_nums,ren_nums)
                })
                drawingManager.addEventListener('circlecomplete', async function(e,overlay) {
                    
                    var miaonum = 0;

                    var miaocun = [];

                    overlay.addEventListener('click',function(){
                        $('.quanbox').css({
                            'z-index':122
                        })

                        $('.loadingbox').css({
                            'z-index':2
                        })
                    })

                    console.log(overlay,'123')
            
                    drawingManager.close()



                    that.clearyujing('quanbox')
                    
                    // cun = []

                    // nums= 0
                    
               
                    // var loadingpoint = overlay

                    // var loadingid = v4()

                    // that.createMark_loading(overlay.point,0,loadingid)

                    // setTimeout(()=>{
                    //     var loading_lo;
                
                    //     loading_lo=startLoding('#'+loadingid)
                    // },200)
                    
                    that.markerList.forEach((d1,i)=>{
                        

                        if(d1){
                            console.log($(d1._div).attr('class'))
                            if($(d1._div).attr('class') == 'loadingbox'){
                                
                                
                                that.mapdui.removeOverlay(d1);

                                
                                that.$set(that.markerList,i,null)
                                
                            }
                        }
                    
            
                    })

                 

                    dty.result.forEach((item,i)=>{
                        var pointssy = new BMap.Point(item.gpsLongitude, item.gpsLatitude);
                        if(BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                            miaonum++

                            miaocun.push(item)
                        }

                    })

                    console.log(miaonum,'miaonum+++++++++++-------------')

                    if(that.mapdui.getZoom()>=14){
                        if(miaonum>200){
                            var suiji = that.getRandomArrayElements(miaocun,200) 
                            suiji.forEach((item,i)=>{
                                var pointssy = new BMap.Point(item.gpsLongitude, item.gpsLatitude);
                                if(BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                                    
                                    
                                    var point = {
                                        "lng": item.gpsLongitude,
                                        "lat": item.gpsLatitude
                                    }

                                    // cun = [...cun,item]

                                    // nums++
                                    // 给地图添加点
                                    that.createMark_quan(point,i,item);

                                }

                            })

                            
                        }else{
                            miaocun.forEach((item,i)=>{
                                var pointssy = new BMap.Point(item.gpsLongitude, item.gpsLatitude);
                                if(BMapLib.GeoUtils.isPointInCircle(pointssy, overlay)) {
                                    
                                    
                                    var point = {
                                        "lng": item.gpsLongitude,
                                        "lat": item.gpsLatitude
                                    }

                                    // cun = [...cun,item]

                                    // nums++
                                    // 给地图添加点
                                    that.createMark_quan(point,i,item);

                                }

                            })
                        }
                    }
                   

                    // that.createMark_loading(overlay.point,0,nums,cun)
   
                })

                dty =  await quandata()
                
  
            }
        },
        getRandomArrayElements(arr, count) {
         
            var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        },
        // 给地图添加点
        createMark_car(point,index,data,zt=false){

            if(!point.lng || !point.lat){
                return   
            }

            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;
            var carid=data.carId;
            var info_box_html;
            var spyls;

            // if(data.nvrStatus){
            //     spyls = `<span class='spyl' ><img  src="${require("@/assets/image/bf.png")}" /> <span>视频预览</span> </span>`
            // }else{
            //     spyls = ""
            // }

            spyls = ""


            //在线离线公共部分

            info_box_html = `<div class='infobox'>
                <div class='yincang_infobox-left'></div>
                <div class='yincang_infobox-bot'></div>
                <p class='tit-s'>
                    <img  src="${require("@/assets/image/Menu/LOGO.png")}" />
                    
                    <span>${data.carNumber}</span>

                   `+spyls+`
                </p>

                <div class='tit-con'>
                    <p>所属单位：${data.sysOrgCode?data.sysOrgCode:'无数据'}</p>
                    <p>离线时间：${data.updateTime?data.updateTime:'无数据'}</p>
                
                    
                </div>

            
                <div class='tit-con3'>
                    <div class='tit-left'>
                        <p><i  class='${data.pcStatus?"online-icon":"offineline-icon"}'></i><span>平板状态</span> </p>
                        <p><i  class='${data.boxStatus?"online-icon":"offineline-icon"}'></i><span>盒子状态</span> </p>
                        <p><i  class='${data.nvrStatus?"online-icon":"offineline-icon"}'></i><span>NVR状态</span></p>
                        <p><i  class='${data.ptzStatus?"online-icon":"offineline-icon"}'></i><span>摄像头云台</span> </p>
                        
                    </div>

                    <div class='tit-left'>
                        <p><i  class='${data.flStatus?"online-icon":"offineline-icon"}'></i><span>摄像头左前</span> </p>
                        <p><i  class='${data.frStatus?"online-icon":"offineline-icon"}'></i><span>摄像头右前</span> </p>
                        <p><i  class='${data.lgStatus?"online-icon":"offineline-icon"}'></i><span>摄像头左后</span></p>
                        <p><i  class='${data.rgStatus?"online-icon":"offineline-icon"}'></i><span>摄像头右后</span></p>
                    </div>
            
                    <div class='tit-left'>
                
                        <p><i  class='${data.fmlStatus?"online-icon":"offineline-icon"}'></i><span>摄像头左中前</span> </p>
                        <p><i  class='${data.fmrStatus?"online-icon":"offineline-icon"}'></i><span>摄像头右中前</span> </p>
                        <p><i  class='${data.lmgStatus?"online-icon":"offineline-icon"}'></i><span>摄像头左中后</span> </p>
                        <p><i  class='${data.rmgStatus?"online-icon":"offineline-icon"}'></i><span>摄像头右中后</span> </p>
                    </div>
                
                </div>

            
            </div>`


            if(data.pcStatus ==  1 && data.boxStatus ==  1 && data.nvrStatus == 1){
                innerHTML = `
                
                    <img class='carimg zai' src='${require("@/assets/image/autoMap/car_nor.gif")}'  />
                
                    <label class='labes zai'>${data.carNumber}</label>

                `+info_box_html
                
                classname = 'zaixian'
                carindex = 2
            }else {
                innerHTML = `
                
                    <img class='carimg li' src='${require("@/assets/image/autoMap/car_noline.png")}'  />
                
                    
                    <label class='labes li'>${data.carNumber}</label>
                `+info_box_html
            
                carindex = 1
            }
            
          

        
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'zidingyibox';
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";

                el.setAttribute('carId',carid)
                el.setAttribute('yuandata',JSON.stringify(data))
                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);


                $('.zidingyibox').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')'
                })

                if(zt=='block'){
                    
               

                        
                    $('.guiji').appendTo($(el).find('.infobox'))



                    $(el).find('.infobox').show()
                    
            
         
                }

        
                //阻止冒泡
                $(el).on('click','.infobox' ,function(e){
                    e.stopPropagation()
                  
                })


                $('body').on('click','.BMap_mask' ,function(e){
                    e.stopPropagation()
                    $(el).find('.infobox').hide()
                })

                $(el).on('click','.yincang_infobox-left' ,function(e){
                    e.stopPropagation()
                    $(el).find('.infobox').hide()
                })

                $(el).on('click','.yincang_infobox-bot' ,function(e){
                    e.stopPropagation()
                    $(el).find('.infobox').hide()
                })


                $(el).on('click','.spyl' ,function(e){
                    e.stopPropagation()

                    sessionStorage.setItem('obchushi',1)
                    

                    that.$router.push({
                        path:'/diaodu',
                        query: {
                            carNumber: data.carNumber
                        },
                    });
                })


                // 监听点击
                $(el).on('click', function(e){
                  
                    e.stopPropagation()
                   
                    that.show_car_info(data)
                
                   
                })

                $(el).hover(function(){
                   
                    $(this).find('.cartip').show()
                   
                },function(){
                    $(this).find('.cartip').hide()
                })
        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2 + "px";
            };
        
            var mark = new customizeOverlay(point, 42);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);


            return
        },



        createMark_yujing(point,index,data){
            if(!point.lng || !point.lat){
                return   
            }

            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;
            var carid=data.carId;
            
         
            //  width: 472px;/*no*/
            //  height: 381px;/*no*/
            var position2={x:'',y:''};

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472/2;
            position2.y = position.y - 381/2;

            var cen = that.mapdui.overlayPixelToPoint(position2)
            

            // var pointss = new BMap.Point(data.longitude,data.latitude);
     
            that.mapdui.setCenter(cen);

            var infos=`
                <div class='yujing_info'>
                    <p class='tis'>车牌预警</p>

                    <div class='yujing_info_box'>
                        <div class='yujing_info_box-le'>
                            <img src='${that.productionImage(data.smallImgUrl)}' />
                            <p >${data.plateCode?data.plateCode:'无数据'}</p>
                       </div>

                       <div class='yujing_info_box-ri'>
                            <p>布控车辆：${data.plateCode?data.plateCode:'无数据'}</p>
                            <p>车辆品牌：${data.plateBrand?data.plateBrand:'无数据'}</p>
                            <p title='${data.represent?that.delHtmlTag(data.represent):'无数据'}'>布控描述：${data.represent?that.delHtmlTag( data.represent ):'无数据'}</p>
                            <p>预警坐标：${data.longitude}，${data.latitude}</p>
                            <p>预警时间：${data.createTime?data.createTime:'无数据'}</p>
                            <p>预警单位：${data.departName?data.departName:'无数据'}</p>
                            <p>预警警车：${data.fromCar?data.fromCar:'无数据'}</p>
                       </div>
                    </div>

                    <div class='yujing_info_bot'>
                        <div class='jj' id='a${data.id}'>${data.isResponse==1?'已反馈':data.isRead==1?'反馈':'接警'}</div>

                        <div class='sy'>预警溯源</div>

                     

                        <div class='qx'>取消</div>
                    </div>
                </div>
            `
            //    <div class='hf'>预警回放</div>

            innerHTML = `
                
                <img class='cpimg' src='${require("@/assets/image/warning-license-plate.svg")}'  />
                
                <label>${data.plateCode?data.plateCode:'无数据'}</label>

            `+infos
        

        
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'yujingbox';
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                // el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";

                el.setAttribute('yujingid-cp',data.id)

                el.setAttribute('yuandata',JSON.stringify(data))
             
                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);

                $('.yujingbox').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')'
                })


            //    $('body').on('click','.BMap_mask' ,function(e){
            //         e.stopPropagation()
            //         $(el).find('.yujing_info').hide()
            //     })

                // //阻止冒泡
                $(el).on('click','.yujing_info' ,function(e){
                    e.stopPropagation()
                  
                })

                // $(el).on('click','.yincang_infobox-left' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

                // $(el).on('click','.yincang_infobox-bot' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

               

                // 监听点击
                $(el).on('click', function(){

                    // $(this).find('.yujing_info').toggle()

                    that.show_yujing_cp_info(data)
                })

                //添加取消事件
                $(el).on('click', '.qx',function(){

                    $(el).find('.yujing_info').hide()

                })

                //sy
                $(el).on('click', '.sy',function(){

                    that.suyuan(data)

                })

                 //预警回放
                $(el).on('click', '.hf',function(){

                    that.huifang(data)

                })

                //接警
                $(el).on('click', '.jj',function(){

                    that.dealInfoOpera_cp(data,$(this),'a'+data.id)

                })
                
        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2 + "px";
            };
        
            var mark = new customizeOverlay(point, 66);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);
        },

        createMark_yujing_rx(point,index,data){
         
            if(!point.lng || !point.lat){
                return   
            }
            
            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;
            var carid=data.carId;

            //  width: 472px;/*no*/
            //  height: 530px;/*no*/
            var position2={x:'',y:''};

            var position = that.mapdui.pointToOverlayPixel(point);
            // debugger
            position2.x = position.x + 472/2;
            position2.y = position.y - 530/2;

            var cen = that.mapdui.overlayPixelToPoint(position2)
            

            // var pointss = new BMap.Point(data.longitude,data.latitude);
     
            that.mapdui.setCenter(cen);

            var infos=`
                <div class='yujing_info-rx' >
                    <p class='tis'>人像预警</p>

                    <div class='yujing_info_box'>
                        <div class='yujing_info_box-le'>
                            <img src='${that.productionImage(data.faceImage)}' />
                            <p >布控</p>
                       </div>

                        <div class='yujing_info_box-mid'>
                            <p class='baifen'>${data.points ? (data.points*100).toFixed(1) : 0}%</p>
                            <p class='zi'>相似率</p>
                       </div>

                       <div class='yujing_info_box-ri'>
                            <img src='${that.productionImage(data.smallImgUrl)}' />
                            <p >预警</p>
                       </div>
                    </div>

                    <div class='yujing_info_pp'>
                        <p>姓名：${data.name?data.name:'无数据'}</p>
                        <p>身份证号：${data.certificatesNumber?data.certificatesNumber:'无数据'}</p>
                        <p title='${data.represent?that.delHtmlTag(data.represent):'无数据'}'>布控描述：${data.represent?that.delHtmlTag(data.represent):'无数据'}</p>
                        <p>预警坐标：${data.longitude}，${data.latitude}</p>
                        <p>预警时间：${data.createTime?data.createTime:'无数据'}</p>
                        <p>预警单位：${data.departName?data.departName:'无数据'}</p>
                        <p>预警警车：${data.fromCar?data.fromCar:'无数据'}</p>
                    </div>


                    <div class='yujing_info_bot'>
                        <div class='jj' id='a${data.id}' >${data.isResponse==1?'已反馈':data.isRead==1?'反馈':'接警'}</div>

                    

                       

                        <div class='qx'>取消</div>
                    </div>
                </div>
            `

            //  <div class='hf'>预警回放</div>

            innerHTML = `
                
                <img class='crximg' src='${that.productionImage(data.smallImgUrl)}'  />
                


            `
            +infos
    

        
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'yujingbox_rx';
                // el.id = 'a'+data.id;
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                // el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";

                el.setAttribute('yujingid-rx',data.id)

             

                el.setAttribute('yuandata',JSON.stringify(data))

               
             
                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);

                $('.yujingbox_rx').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')'
                })


            //    $('body').on('click','.BMap_mask' ,function(e){
            //         e.stopPropagation()
            //         $(el).find('.yujing_info-rx').hide()
            //     })

                // //阻止冒泡
                $(el).on('click','.yujing_info-rx' ,function(e){
                    e.stopPropagation()
                  
                })

                // $(el).on('click','.yincang_infobox-left' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

                // $(el).on('click','.yincang_infobox-bot' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

               

                // 监听点击
                $(el).on('click', function(){

                    // $(this).find('.yujing_info-rx').toggle()
                    that.show_yujing_rx_info(data)

                })

                //添加取消事件
                $(el).on('click', '.qx',function(){

                    $(el).find('.yujing_info-rx').hide()

                })
                
                //预警回放
                $(el).on('click', '.hf',function(){

                    that.huifang(data)

                })

                //接警
                $(el).on('click', '.jj',function(){

                    that.dealInfoOpera(data,$(this),'a'+data.id)

                })
        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2 + "px";
            };
        
            var mark = new customizeOverlay(point, 66);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);
        },
        createMark_cpguiji(point,index,data){
            if(!point.lng || !point.lat){
                return   
            }
            
            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;
            var carid=data.carId;
            
            if(index==0){
                var pointss = new BMap.Point(data.gpsLongitude,data.gpsLatitude);
        
                that.mapdui.setCenter(pointss);
            }
       

            var infos=`
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>${data.plateNumber}</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(data.smallImageUrl)}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `

            innerHTML = `
                
                <img class='gjimg' src='${require("@/assets/image/car-collect.svg")}'  />
                


            `
            +infos
    

        
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'guijibox';
                // el.id = 'a'+data.id;
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                // el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";

                el.setAttribute('createTime',data.createTime)

                
             
                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);

                $('.guijibox').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')'
                })

                if(index==0){
                    $(el).find('.guiji-info').show()
                    $(el).css({
                        'z-index':2
                    })
                }


            //    $('body').on('click','.BMap_mask' ,function(e){
            //         e.stopPropagation()
            //         $(el).find('.guiji-info').hide()
            //     })

                // //阻止冒泡
                $(el).on('click','.guiji-info' ,function(e){
                    e.stopPropagation()
                  
                })

                // $(el).on('click','.yincang_infobox-left' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

                // $(el).on('click','.yincang_infobox-bot' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

               

                // 监听点击
                $(el).on('click', function(){

                    // $(this).find('.guiji-info').toggle()

                    that.show_guiji_info(data)

                })

                // 点击大图
                $(el).on('click', '.guijicarimg',function(){

                    that.lookDetailPlate(data)

                })

                // //添加取消事件
                $(el).on('click', '.qx',function(){

                    $(el).find('.guiji-info').hide()

                })
                
        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2 + "px";
            };
        
            var mark = new customizeOverlay(point, 36);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);
        },
        createMark_loading(point,index,num,arr,R,che_nums,ren_nums){
            if(!point.lng || !point.lat){
                return   
            }
            
            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;

            innerHTML = `
                
                <div class='gongji'>
                    <div class='ml zs'> <span>采集总数</span><span class='shuzi'>:${num}</span></div>
                    <div class='ml car'> <img src='${require("@/assets/image/quan_car.png")}' /><span class='shuzi'>:${che_nums}</span> </div>
                    <div class='ml ren'> <img src='${require("@/assets/image/quan_ren.png")}' /><span class='shuzi'>:${ren_nums}</span> </div>
                </div>
                
                

            `
  
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'loadingbox';
                // el.id = 'a'+data.id;
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                // el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";
                
                var id = 'a'+v4()
                el.setAttribute('id',id)

                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);


                var loadingbox_hei = $('.gongji').height()

                $('.loadingbox').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')',
                    'margin-top': -loadingbox_hei + 'px'
                })

                // 监听点击
                $(el).on('click', function(){

                   $('.quanbox').css({
                        'z-index':112
                    })

                    $('.loadingbox').css({
                        'z-index':1
                    })

                })

               

                // $(el).on('click', '.gongji',function(){
                    
                //     if(arr.length!=0){

                        
                //         var loading_lo;
                    
                //         loading_lo=startLoding('#'+id)
                //         $(this).remove()
                //         setTimeout(()=>{
                //             arr.forEach((item5,i5)=>{
                //                 var point = {
                //                     "lng": item5.gpsLongitude,
                //                     "lat": item5.gpsLatitude
                //                 }
                            
                //                 that.createMark_quan(point,i5,item5);
                //             })
                //             endLoding(loading_lo)
                //         },1500)
                        
                //     }
                    

                // })

        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2  + "px";
            };
        
            var mark = new customizeOverlay(point, 36);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);
        },
        createMark_quan(point,index,data){
            if(!point.lng || !point.lat){
                return   
            }
            
            var that = this;
            // 创建盒子内部内容
            var innerHTML;
            var carindex;
            var classname;
            var carid=data.carId;
            
            if(index==0){
                var pointss = new BMap.Point(data.gpsLongitude,data.gpsLatitude);
        
                that.mapdui.setCenter(pointss);
            }
       

            var infos=`
                <div class='guiji-info' >
                    <p class='guiji-info-tit'>采集信息</p>

                    <div class='guiji-info-mid'>
                        <img class='guijicarimg' src='${that.productionImage(data.smallImageUrl)}' />
                        <p>入库时间：${data.createTime}</p>
                        <p>采集警车：${data.policeCarNumber}</p>
                        <p>位置：${data.gpsLongitude}，${data.gpsLatitude}</p>
                    </div>

                    <div class='qx'>取消</div>
                </div>
            `

            innerHTML = `
                
                <img class='gjimg' src='${data.sortType==2?require("@/assets/image/car-collect.svg"):require("@/assets/image/warning-car.svg")}'  />


            `
            +infos
    

        
            // 定义绘制图标方法
            function customizeOverlay(center, length){
                this._center = center;
                this._length = length;
            }
            customizeOverlay.prototype = new BMap.Overlay();
        
            customizeOverlay.prototype.initialize = function(map){
                // 保存map对象实例
                this._map = map;
        
                // 创建div元素，作为自定义覆盖物的容器
                var el = document.createElement("div");
                el.className = 'quanbox';
                // el.id = 'a'+data.id;
                el.innerHTML = innerHTML;
                el.style.position = "absolute";
                el.dataset.index =index;
                // el.style.zIndex = carindex;
                el.style.cursor ='pointer';
                el.style.width = this._length + "px";
                el.style.height = this._length + "px";

                el.setAttribute('createTime',data.createTime)

                
             
                
                // 将el添加到覆盖物容器中
                map.getPanes().markerPane.appendChild(el);

                $('.quanbox').css({
                    '-webkit-transform':'scale('+scale_num+')',
                    'transform':'scale('+scale_num+')'
                })

                if(index==0){
                    $(el).find('.guiji-info').show()
                    $(el).css({
                        'z-index':2
                    })
                }


            //    $('body').on('click','.BMap_mask' ,function(e){
            //         e.stopPropagation()
            //         $(el).find('.guiji-info').hide()
            //     })

                // //阻止冒泡
                $(el).on('click','.guiji-info' ,function(e){
                    e.stopPropagation()
                  
                })

                // $(el).on('click','.yincang_infobox-left' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

                // $(el).on('click','.yincang_infobox-bot' ,function(e){
                //     e.stopPropagation()
                //     $(el).find('.infobox').hide()
                // })

               

                // 监听点击
                $(el).on('click', function(){

                    // $(this).find('.guiji-info').toggle()

                    that.show_guiji_info(data)

                })

                // 点击大图
                $(el).on('click', '.guijicarimg',function(){

                    that.lookDetailPlate(data)

                })

                // //添加取消事件
                $(el).on('click', '.qx',function(){

                    $(el).find('.guiji-info').hide()

                })
                
        
                // 保存div实例
                this._div = el;
                // 需要将el元素作为方法的返回值，当调用该覆盖物的show、hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return el;
            }
        
            // 根据地理坐标转换为像素坐标，并设置给容器
            customizeOverlay.prototype.draw = function(){
                var position = this._map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - this._length / 2 + "px";
                this._div.style.top = position.y - this._length / 2 + "px";
            };
        
            var mark = new customizeOverlay(point, 36);
            that.markerList.push(mark); // 把mak加入到数组中方便下次添加mark时清除原有点和操作选中状态
            that.mapdui.addOverlay(mark);
        },
        lookDetailPlate(item) {
            PubSub.publish("detail_box_type_show", 10);
            PubSub.publish("car_trail_data", item);
        },
        async dealInfoOpera(data,EL,id){
      
            if(EL.html()=='已反馈'){
                return ;
            }else if(EL.html()=='接警'){
                //接警
                var loading_lo;
                try {
                    loading_lo=startLoding('#'+id)
                  
                    var res = await gyxyFaceWarning_edit({ids:data.id})
                    endLoding(loading_lo)
                
                    EL.html('反馈')
                }catch (err) {
                    console.log(err,'dscdascsda')
                    endLoding(loading_lo)
                    Message({
                        showClose: true,
                        message:'网络异常',
                        type:'error',
                        duration:2000
                    })
                }
            }else{
                //反馈
                // PubSub.publish("detail_box_type_show", 4);
                data.isrx=true
                PubSub.publish("fankui_data", data);
            }
        },
        async dealInfoOpera_cp(data,EL,id){
      
            if(EL.html()=='已反馈'){
                return ;
            }else if(EL.html()=='接警'){
                //接警
                var loading_lo;
                try {
                    loading_lo=startLoding('#'+id)
                  
                    var res = await gyxyPlateWarning_edit({ids:data.id})
                    endLoding(loading_lo)
                
                    EL.html('反馈')
                }catch (err) {
                    console.log(err,'dscdascsda')
                    endLoding(loading_lo)
                    Message({
                        showClose: true,
                        message:'网络异常',
                        type:'error',
                        duration:2000
                    })
                }
            }else{
                //反馈
                // PubSub.publish("detail_box_type_show", 4);
                data.iscp=true
                PubSub.publish("fankui_data", data);
            }
        },
        huifang(data){
            PubSub.publish("warnVideoshow", data);
        
        },
        clearyujing(clas){
            var that=this   
            console.log(that.markerList)
            
            that.markerList.forEach((d1,i)=>{
                

                if(d1){
                    console.log($(d1._div).attr('class'))
                    if($(d1._div).attr('class') == clas){
                        
                        
                        that.mapdui.removeOverlay(d1);

                        
                        this.$set(that.markerList,i,null)
                        
                    }
                }
              
    
            })
        
        }
    },

    activated(){
       
    },

    mounted (){

        var that=this

       
        this.baiduMapInit()
        
      

        if(this.$route.path=='/warningInfo'){
            PubSub.subscribe('warn_rx',(msg,data)=>{
            
                var point = {
                    "lng": data.longitude,
                    "lat": data.latitude
                }
                this.clearyujing('yujingbox_rx')
                this.clearyujing('yujingbox')
                // 给地图添加点
                this.createMark_yujing_rx(point,0,data);
        
            })


            PubSub.subscribe('warn_cp',(msg,data)=>{
                var point = {
                    "lng": data.longitude,
                    "lat": data.latitude
                }
                this.clearyujing('yujingbox_rx')
                this.clearyujing('yujingbox')
                // 给地图添加点
                this.createMark_yujing(point,0,data);
            })
        }


        if(this.$route.path=='/index'){
            PubSub.subscribe('jc_updata',(msg,data)=>{
 
                try{
                    if(this.$route.path=='/index'){
                        that.markerList.forEach((d1,i)=>{
                            
                            if(d1){
                                if($(d1._div).attr('carId') == data.carId){
                                    var yuandata = JSON.parse($(d1._div).attr('yuandata'))   
                                    //先清除 -清除前先过去信息框的显示隐藏状态
                                    var zt = $(d1._div).find('.infobox')[0].style.display

                                
                                    $(d1._div).find('.guiji').appendTo($('.map_obj_box'))
                                

                                    that.mapdui.removeOverlay(d1);

                                
                                    // this.$delete(that.markerList,i)
                                    this.$set(that.markerList,i,null)

                            
                                    var point = {
                                        "lng": data.longitude,
                                        "lat": data.latitude
                                    }

                                    data.sysOrgCode = yuandata.sysOrgCode
                                
                                    // 给地图添加点
                                    this.createMark_car(point,i,data,zt);
                                
                                    throw new Error()
                            
                                }
                            }
                            
              
                        })
                    }       
                    
                } catch(e){

                }
            })

            PubSub.subscribe('warn-face',(msg,data)=>{
              
                var point;
            
                this.markerList.forEach((d1,i)=>{
                    
                    if(d1){
                        if($(d1._div).attr('yujingid-rx') == data.id){
                            //第二次
                            // data.longitude = $(d1._div).attr('longitude')
                            // data.latitude = $(d1._div).attr('latitude')
                            var yuandata = JSON.parse($(d1._div).attr('yuandata')) 
                            
                            var videoUrl = data.videoUrl

                            data = yuandata

                            data.videoUrl = videoUrl
                            
                            point = {
                                "lng": data.longitude,
                                "lat": data.latitude
                            }
                            
                            that.mapdui.removeOverlay(d1);

                        
                            // this.$delete(that.markerList,i)
                            this.$set(that.markerList,i,null)
                        }else{
                            //第一次
                            point = {
                                "lng": data.longitude,
                                "lat": data.latitude
                            }
                        }
                    }
                    
        
                })

                
                //先把信息框都隐藏掉
                $('.yujing_info').hide()
                $('.yujing_info-rx').hide()

                // 给地图添加点
                this.createMark_yujing_rx(point,0,data);
            })  
            PubSub.subscribe('warn-cp',(msg,data)=>{
                
                var point ;

                this.markerList.forEach((d1,i)=>{
                    if(d1){
                        if($(d1._div).attr('yujingid-cp') == data.id){
                            var yuandata = JSON.parse($(d1._div).attr('yuandata')) 
                            
                            var videoUrl = data.videoUrl

                            data = yuandata

                            data.videoUrl = videoUrl
                            
                            point = {
                                "lng": data.longitude,
                                "lat": data.latitude
                            }
                            
                            that.mapdui.removeOverlay(d1);

                        
                            // this.$delete(that.markerList,i)
                            this.$set(that.markerList,i,null)
                        }else{
                            //第一次
                            point = {
                                "lng": data.longitude,
                                "lat": data.latitude
                            }
                        }
                    }
                    
        
                })
                
                //先把信息框都隐藏掉
                $('.yujing_info').hide()
                $('.yujing_info-rx').hide()
               
                // 给地图添加点
                this.createMark_yujing(point,0,data);
            })      
        }
        
        
        


    },
    components: {
        DatePicker 
    },
}
</script>
<style lang='scss'>
.cartip{
    width:112px;/*no*/
    padding:10px;/*no*/
    border-radius:5px;/*no*/
    height:319px;/*no*/
    background:#303133;
    position:absolute;
    top:0;
    left:150px;/*no*/
    color:#fff;
    display:none;
    .za{
        position: absolute;
       
        width: 30px;/*no*/
        left: -20px;/*no*/
        top: 6px;/*no*/
    }
    .arraw{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 6px;/*no*/
    }
    .content-item{
        display:flex;
        align-items:center;
        margin-top:10px;/*no*/
        span{
            font-size: 13px;/*no*/
        }
    }
    .content-top{
        display:flex;
        align-items:center;
        span{
            margin-right:5px;/*no*/
        }
    }
    .online-icon{
        width:10px;/*no*/
        height:10px;/*no*/
        border-radius:10px;/*no*/
        background:#13d913;
        margin-right:5px;/*no*/
    }
    .offineline-icon{
        width:10px;/*no*/
        height:10px;/*no*/
        border-radius:10px;/*no*/
        background:red;
        margin-right:5px;/*no*/
    }
}

.mx-icon-calendar{
    color: #00beff;
}
.mx-input{
    border: 1px solid  #00beff;
}

@media screen and (min-width: 3000px) {
    .mx-icon-calendar{
     
        // margin-top: 4px;/*no*/
        display: none;
    }

    .mx-date-row div{
        font-size: 16px;/*no*/
    }
    .mx-time-column .mx-time-item{
        font-size: 16px;/*no*/
    }
    .mx-btn{
        font-size: 16px;/*no*/
    }
    .mx-input{
        padding-right: 0;
    }
}

.guijibox{
    .gjimg{
        width: 100%;
        height: 100%;
    }
}
.quanbox{
    .gjimg{
        width: 100%;
        height: 100%;
    }
}
.carimg{
    width:100%;/*no*/
    height: 100%;/*no*/
    border-radius: 49px;/*no*/
    position: relative;
    z-index: 2;
    box-sizing: border-box;
    &.zai{
        border: 2px solid rgb(64,158,255);/*no*/
    }

    &.li{
        border: 2px solid #fff;/*no*/
        background: rgb(153,153,153);
    }
}

.loadingbox{
    .gongji{
        font-size: 16px;/*no*/
        // width: 200px;/*no*/
        margin-left: -129px;/*no*/
        width: 310px;/*no*/
        display: flex;
        justify-content: space-around;
        align-items: center;
        // background: #00beff;
        // background: #35758b;
        // color:#00beff;
        // background: #024e64c7;
        background: linear-gradient(
      to right,
      #a4f8ff,
      rgba(255, 255, 255, 0.7)
    );
        border: 1px solid #a6e7ff;/*no*/
        text-align: center;
        border-radius: 10px;/*no*/
        padding: 10px;/*no*/
        // background-image: url("../assets/image/button-1.svg");
        // background-repeat: no-repeat;
        // background-size:100% 100%;
//         background: linear-gradient(
// 90deg,rgba(86, 113, 124,1) 0%, rgba(50, 155, 244, 1) 100%);
        div{
            // margin-top: 5px;/*no*/
        }
        span{
            font-size: 16px;/*no*/
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &.shuzi{
                // width: 48px;/*no*/

            }
        }

        .ml{
            margin-right: 10px;/*no*/
            display: flex;
            align-items: center;
            font-weight: bold;
            
            &.zs{
                // color:#fff;
                color: #00beff;
            }
            &.car{
                color: #00beff;
            }
            &.ren{
                color:#ff8400 ;
            }
            img{
                width: 32px;/*no*/
               
            }
        }
    }
}
.labes{
    width: 83px;/*no*/
    height: 30px;/*no*/
    padding-right: 12px;/*no*/
    line-height: 30px;/*no*/
    position: absolute;
    top: 50%;
    margin-top: -15px;/*no*/
    left: 19px;/*no*/
    padding-left: 24px;/*no*/
    font-size: 14px!important;/*no*/
    z-index: 1;
    &.zai{
        background:  rgb(64,158,255);
        color: #fff;
        border-radius: 30px ;/*no*/
    }

    &.li{
        background: rgb(153,153,153)!important;
        color: #fff;
        border-radius: 30px ;/*no*/
    }
}
.guiji-info{
    width: 319px;/*no*/
    height: 328px;/*no*/
    bottom: 14px;/*no*/
    left: 13px;/*no*/
    z-index: -1;
    position: absolute; 
    background-image: url('../assets/image/details-box-car.svg');
    background-size: cover;
    
    display: none;
    .guiji-info-tit{
        color: #00beff;
        font-size: 17px;/*no*/
        margin-top: 18px;/*no*/
        margin-left: 45px;/*no*/
    }
    .guiji-info-mid{
        margin-left: 45px;/*no*/
           
        margin-top: 31px;/*no*/

        img{
            width:96px;/*no*/
            height: 55px;/*no*/
        }

        p{
            margin-top:5px;/*no*/
            font-size: 14px;/*no*/
        }
    }

    .qx{
        margin-left: 196px;/*no*/
        margin-top: 18px;/*no*/
        width: 100px;/*no*/
        height: 30px;/*no*/
        line-height: 30px;/*no*/
        background: none;
        border:1px solid  #00beff;/*no*/
        text-align: center;
        box-sizing: border-box;
        color:#00beff ;
        font-size: 16px;/*no*/
    }
}
.infobox{
    width: 378px;/*no*/
    height: 372px;/*no*/
    bottom: 21px;/*no*/
    left: 11px;/*no*/
    position: absolute; 
    background-image: url('../assets/image/details-box.svg');
    background-size: cover;
    
    display: none;
    .tit-s{
        display: flex;
        align-items: center;
        margin-top: 21px;/*no*/
        margin-left: 45px;/*no*/
        width:314px;/*no*/
        img{
            width: 21px;/*no*/

        }

        span{
            font-size: 16px!important;/*no*/
            color: #00beff;
            margin-left: 14px;/*no*/

        
        }
    
        .spyl{
            font-size: 13px!important;/*no*/
            margin-left:auto;
            display:flex;
            align-items:center;
            background:#00beff;
            padding:4px;
            span{
                font-size: 13px!important;/*no*/
                margin-left: 0px;/*no*/
                color:#fff;
            }
            img{
                width:15px;/*no*/
            }
        }
    }

    .tit-con{
        margin-top: 21px;/*no*/
       
        margin-left: 45px;/*no*/
        p{
            margin-bottom: 6px;/*no*/
           
            font-size: 13px!important;/*no*/
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .tit-con2{
        margin-top: 0px;/*no*/

        display: flex;
        align-items: center;
        width: 311px;/*no*/
        margin-left: 45px;/*no*/
        justify-content: space-between;
      

        p{
            display: flex;
            align-items: center;
            span{
                font-size: 14px!important;/*no*/
            }
            .tng{
                font-size: 16px!important;/*no*/

                font-weight: bolder;
                color:#00beff;
                margin-left: 10px;/*no*/

            }
        }
    }

    .tit-con3{
        margin-top: 0px;/*no*/

        display: flex;
        flex-wrap:wrap;
        align-items: center;
        width: 311px;/*no*/
        margin-left: 45px;/*no*/
        justify-content: space-between;
        // overflow-x:scroll;

        p{
            display: flex;
            align-items: center;
            // margin-right:10px;/*no*/
            span{
                font-size: 12px!important;/*no*/
                white-space:nowrap;
            }
            .tng{
                font-size: 12px!important;/*no*/

                font-weight: bolder;
                color:#00beff;
                // margin-left: 10px;/*no*/

            }
            .online-icon{
                width:10px;/*no*/
                height:10px;/*no*/
                border-radius:10px;/*no*/
                background:#13d913;
                margin-right:5px;/*no*/
            }
            .offineline-icon{
                width:10px;/*no*/
                height:10px;/*no*/
                border-radius:10px;/*no*/
                background:red;
                margin-right:5px;/*no*/
            }
        }
    }

    .guiji{
      
        margin-top: 9px;/*no*/
        margin-left: 45px;/*no*/
        position: relative!important;
        z-index: 1;
        .guiji-tit{
            display: flex;
            width: 330px;/*no*/
            align-items: center;

            span{
                color: #00beff;
                font-size: 14px!important;/*no*/
            }

            .xian{
                width: 90px;/*no*/
                height: 1px;/*no*/
                background: #00beff;
                margin-left: 14px;/*no*/
            }

            .reliimg{
                margin-left: 12px;/*no*/
            }


            .xianluimg{
                margin-left: 15px;/*no*/
            }

            .reli{
                margin-left: 7px;/*no*/
            }
        }

        .guiji-sj{
            display: flex;
            
            position: relative;
           
            z-index: 2;
            margin-top: 8px;/*no*/
            .guiji-sj-item {
            
                width: 150px;/*no*/
                height: 32px;/*no*/

                // .el-date-editor.el-input, .el-date-editor.el-input__inner{
                //     width: 150px;/*no*/
                //     height: 32px;/*no*/

                    
                // }

                .mx-datepicker,.mx-input-wrapper,.mx-input{
                    width: 150px;/*no*/
                    height: 30px;/*no*/
                }

                &.jieshu{
                    margin-left: 11px;/*no*/
                }
            }
        }

        .guiji-btn{
            display: flex;
           
            margin-top: 11px;/*no*/
            p{
                font-size: 14px;/*no*/
            }
            .cha{   
                width: 180px;/*no*/
                height: 30px;/*no*/
                line-height: 30px;/*no*/
                background: #00beff ;
                color: #fff;
                text-align: center;
            }

            .qu{
                width: 100px;/*no*/
                height: 30px;/*no*/
                line-height: 30px;/*no*/
                background: none;
                border:1px solid  #00beff;/*no*/
                text-align: center;
                box-sizing: border-box;
                margin-left: 31px;/*no*/
            }
        }
    }
}

.yincang_infobox-left{
    position: absolute;
 
    left: 0;
    top: 0;
    width: 20px;/*no*/
    height: 100%;
}

.yincang_infobox-bot{
    position: absolute;
   
    left: 0;
    bottom: 0;
    width: 100%;
    height: 65px;/*no*/
}

.guiji{
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
}
.yujingbox_rx{
    .crximg{
        width: 100%;
        height: 100%;
        border-radius: 66px;/*no*/
        border:1px solid #ff0000;/*no*/
        box-sizing: border-box;
    }

    .yujing_info-rx{
        width: 472px;/*no*/
        height: 530px;/*no*/
        background-image: url('../assets/image/warning-face-box.svg');
        background-size: 100% 100%;
        position: absolute;
        top: -488px;/*no*/
        left: 27px;/*no*/
        z-index: -1;
        .tis{
            color: #ff0000;
            font-size: 16px;/*no*/
            margin-top: 20px;/*no*/
            margin-left: 50px;/*no*/
        }
        .yujing_info_box{
            margin-left: 50px;/*no*/
            display: flex;
            margin-top: 26px;/*no*/
        }
    
        .yujing_info_box-le,.yujing_info_box-ri{
            img{
                width: 120px;/*no*/
                height: 120px;/*no*/
                
            }
            p{
                border:1px solid #ff0000;/*no*/
                border-top: none;
                height: 27px;/*no*/
                width: 120px;/*no*/
                box-sizing: border-box;
                line-height: 27px;/*no*/
                text-align: center;
                color:#ff0000 ;
                font-size: 12px;/*no*/
            }
        }
        .yujing_info_box-mid{
            margin-left: 47px;/*no*/
            margin-right: 47px;/*no*/
            .baifen{
                color: #b82424;
             
                font-size: 24px;/*no*/
                margin-top: 33px;/*no*/
            }
            .zi{
                font-size: 14px;/*no*/
                margin-top: 30px;/*no*/
            }
        }
      
        .yujing_info_pp{
            margin-top: 20px;/*no*/
            margin-left: 56px;/*no*/
            p{
                margin-bottom: 5px;/*no*/
                font-size: 12px;/*no*/
                max-width: 394px;/*no*/

                overflow: hidden;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                box-orient: vertical;
                display: -webkit-box;

            }
        }
        .yujing_info_bot{
            display: flex;
            margin-left: 50px;/*no*/
            margin-top: 14px;/*no*/
            .jj{
                width: 120px;/*no*/
                height: 30px;/*no*/
                background: #ff0000;
                color: #fff;
                text-align: center;
                line-height: 30px;/*no*/
            }
            .sy,.hf,.qx{
                width: 120px;/*no*/
                height: 30px;/*no*/
                border: 1px solid  #ff0000;/*no*/
                margin-left: 10px;/*no*/
                color:#ff0000;
                text-align: center;
                line-height: 30px;/*no*/
                box-sizing: border-box;
                font-size: 12px;/*no*/
            }
           
        }
    }
}
 
.yujingbox{
    .cpimg{
        width: 100%;

        
    }
    
    label{
        position: absolute;
        font-size: 12px;/*no*/
        top: 3px;/*no*/
        left: 5px;/*no*/
        color: #fff;
    }
    .yujing_info{
        width: 472px;/*no*/
        height: 381px;/*no*/
        background-image: url('../assets/image/warning-car-box.svg');
        background-size: 100% 100%;
        position: absolute;
        top: -335px;/*no*/
        left: 27px;/*no*/
        z-index: -1;

        .tis{
            color: #ff0000;
            font-size: 16px;/*no*/
            margin-top: 20px;/*no*/
            margin-left: 50px;/*no*/
        }

        .yujing_info_box{
            margin-left: 50px;/*no*/
            display: flex;
            margin-top: 20px;/*no*/
            .yujing_info_box-le{
                img{
                    width: 120px;/*no*/
                    height: 120px;/*no*/
                }
                p{
                    border: 1px solid #ff0000;/*no*/
                    border-top: none;
                    width: 120px;/*no*/
                    height: 37px;/*no*/
                    font-size: 14px;/*no*/
                    color: #000;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 37px;/*no*/
                }
            }

            .yujing_info_box-ri{
    
                margin-left: 18px;/*no*/
                p{
                    font-size: 12px;/*no*/
                    margin-top: 5px;/*no*/
                    max-width: 270px;/*no*/

                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    box-orient: vertical;
                    display: -webkit-box;

                }
            }

           
        }

         .yujing_info_bot{
            display: flex;
            margin-left: 50px;/*no*/
            margin-top: 28px;/*no*/
            .jj{
                width: 120px;/*no*/
                height: 30px;/*no*/
                background: #ff0000;
                color: #fff;
                text-align: center;
                line-height: 30px;/*no*/
            }
            .sy,.hf,.qx{
                width: 80px;/*no*/
                height: 30px;/*no*/
                border: 1px solid  #ff0000;/*no*/
                margin-left: 10px;/*no*/
                color:#ff0000;
                text-align: center;
                line-height: 30px;/*no*/
                box-sizing: border-box;
                font-size: 12px;/*no*/
            }
           
        }
    }
}
</style>

<style lang='scss' scoped>
.map_obj_box{
    width: 100%;
    height: 100%;
}
#map_obj{
    width: 100%;
    height: 100%;
    
}

.lkjcsdklc{
    width: 100%;
    height: 100%;
}

</style>
