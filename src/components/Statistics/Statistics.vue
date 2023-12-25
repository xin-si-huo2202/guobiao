<template>
    <div class="statistics">
        <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <div class="zd-stat-style">
                    <div class="zd-stat-head">
                        采集数量统计
                    </div>
                    <div class="zd-stat-conter">
                        <Bar :barArr="barCJ" v-if="barCJ.length > 0" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
                <div class="zd-stat-style">
                    <div class="zd-stat-head">
                        <span>采集数量走势</span>
                        <div style="float: right;">
                            <button class="zd-btn--statis" :class="Linebtn == 1?'zd-stat-btn' :''" @click="selectCarAndFaceYear()">本年度</button>
                            <button class="zd-btn--statis" :class="Linebtn == 2?'zd-stat-btn' :''" @click="selectCarAndFaceMonth()">近一月</button>
                            <button class="zd-btn--statis" :class="Linebtn == 3?'zd-stat-btn' :''" @click="selectCarAndFaceToday()">今日</button>
                        </div>
                    </div>
                    <div class="zd-stat-conter">
                        <Lines :lineArr="lineArr" :Linebtn='Linebtn' v-if="lineArr.car && lineArr.face " />
                    </div>
                </div>
            </el-col>
             <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="9">
                <div class="zd-stat-style">
                    <div class="zd-stat-head">
                        布控/预警统计
                    </div>
                    <div class="zd-stat-conter">
                        <Bar :barArr="barBK" v-if="barBK.length > 0" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="9">
                <div class="zd-stat-style">
                    <div class="zd-stat-head">
                        采集排名
                    </div>
                    <div class="zd-stat-conter">
                        <!-- <Pie /> -->
                        <Cjpm :barArr="Cjpmdata" v-if="Cjpmdata.length > 0" />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="6">
                <div class="zd-stat-style">
                    <div class="zd-stat-head">
                        警车出勤统计
                    </div>
                    <div class="zd-stat-conter">
                        <div class="zd--foot-conter--incident-case" >
                            <div class="zd--foot-conter--incident-case-number" v-text="Vehicle.ljcx"></div>
                            <span>累计出巡次数</span>
                        </div>
                        <div class="zd--foot-conter--incident-case" >
                            <div class="zd--foot-conter--incident-case-number" v-text="Vehicle.jczx"></div>
                            <span>当前出勤警车</span>
                        </div>
                        <div class="zd--foot-conter--incident-case" >
                            <div class="zd--foot-conter--incident-case-number" v-text="Vehicle.jclx"></div>
                            <span>当前离线警车</span>
                        </div>
                        <div class="zd--foot-conter--incident-case" >
                            <div class="zd--foot-conter--incident-case-number" v-text="Vehicle.jcyc"></div>
                            <span>警车设备异常</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Bar from './ehcarts/bar'
import Lines from './ehcarts/line'
import Pie from './ehcarts/pie'
import Cjpm from './ehcarts/Cjpm'
import { controlInfo, sysNdCj,SysqueryJcCx,selectCarAndFaceYear,selectCarAndFaceMonth,selectCarAndFaceToday,collectionRankingDept } from '@/api/echarts.js'
export default {
    name:'statistics',
    data () {
        return {
            barBK: [],
            barCJ: [],
            Vehicle: {},
            Linebtn: 1,
            lineArr: {},
            Cjpmdata:[],
            deptid:this.$store.getters.quYu.id
        }
    },
    methods:{
        async controlInfo(){
            const res = await controlInfo(this.deptid,this.$sj_bs)
            this.barBK = res.data
        },
        async sysNdCj(){
            const res = await sysNdCj(this.deptid,this.$sj_bs)
            this.barCJ = res.data
            console.log(this.barCJ)
        },
        async SysqueryJcCx(){
            const res = await SysqueryJcCx(this.deptid,this.$sj_bs)
            this.Vehicle = res.data
        },
        async selectCarAndFaceYear(){
            this.Linebtn = 1;
            this.lineArr = {};
            const res = await selectCarAndFaceYear(this.deptid,this.$sj_bs)
            this.lineArr = res.data
        },
        async selectCarAndFaceMonth(){
            this.Linebtn = 2;
             this.lineArr = {}
            const res = await selectCarAndFaceMonth(this.deptid,this.$sj_bs)
            this.lineArr = res.data
           
        },
        async selectCarAndFaceToday(){
            this.Linebtn = 3;
            this.lineArr = {}
            const res = await selectCarAndFaceToday(this.deptid,this.$sj_bs)
            this.lineArr = res.data
            
        },
        async collectionRankingDept(){
            const res = await collectionRankingDept(this.deptid,this.$sj_bs)
            console.log(res)
            this.Cjpmdata=res.data
        }
    },
    created(){
          this.selectCarAndFaceYear()
            this.controlInfo()
            this.sysNdCj()
            this.SysqueryJcCx(),
            this.collectionRankingDept()
    },
    components: {
        Bar,
        Lines,
        Pie,
        Cjpm
    },
}
</script>

<style lang="scss" scoped>
.statistics{
    width: 100%;
    height: 100%;
    /* padding: 10px; */
    background: #0F1353;
    color: #e2d9d9;
    overflow: auto;
    box-sizing: border-box;
    .zd-stat-style{
        height: calc((100vh - #{$header-height} - 38px - 60px) / 2);
        margin: 10px 0;
        background: #121445; 
        padding: 10px;
        box-sizing: border-box;
        .zd-stat-head{
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid rgb(44, 148, 233);
            font-size: 16px;
            
        }
        .zd-stat-conter{
            height: calc(100% - 45px);
            display: flex;
            flex-wrap: wrap;
            .zd--foot-conter--incident-case{
                    width: 50%;
                    display: flex;
                    justify-content: center;
                   
                    flex-direction: column;
                    color: #0274A1;
                    .zd--foot-conter--incident-case-number{
                        width: 80px;
                        height: 80px;
                        line-height: 80px;
                        font-family:"RIGELSTAR";
                        text-align: center;
                        background: url(../../index/image/rigthbottom.png);
                        background-size: 100% 100%;
                        margin: 0 auto 20px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    span{
                        text-align: center;
                        display: inline-block;
                        font-size: 16px;
                    }
                }
        }
    }
  
    .zd-stat-btn{
        border: 0;
        background: rgb(44, 148, 233);
    }
}
@media screen and (max-width: 1200px) {
    .zd-stat-style{
        min-height: 380px;
        height: auto;
    }
}
</style>