<template>
    
    <div class="index_container depTree bg_color_white" :class='$route.path=="/diaodu2"?"nysj_the":""'>
         <template v-if='MenuData.length!=0'> 
            <el-tree
                :data="MenuData"
                :props="defaultProps"
                default-expand-all
                node-key="value"
                ref="tree"
                :expand-on-click-node="false"
                @node-click="getTreeDatas"
            >
                <span class="custom-tree-node" slot-scope="{ node , data }">
                    <span @dblclick="clickNode(node,data)" class="node">{{node.label}}</span>
                </span>
            
            </el-tree>
        </template>
       
        <template v-if='MenuData.length==0'> 
            <EmpMini />
        </template>
    </div>
    
</template>

<script>
import { selectDept,queryTreeList ,gyxyPcInformation } from '@/api/system.js'

import {startLoding,endLoding} from '@/request/loading.js'
import EmpMini from '../components/empMini.vue';
import { v4 } from 'uuid';
import PubSub from 'pubsub-js'
export default {
    name:'DepTree',
    data () {
        return {
            filterText: "",
            countTree:0,
            defaultProps: {
                value: "id",
                label: "departName",
                children: "children",
            },
            MenuData:[],
            time:null 
        };
    },
    destroyed() {
       
    },
    watch: {
    },
    methods: {
        clickNode(node,data){
          
            clearTimeout(this.time)
            
            this.ggp(data.id)
           
        },
        async ggp(depid){
            var loading_lo;
            try {
			
                var res = await gyxyPcInformation(depid,1)
              
          
               if(res && res.result && res.result.records.length!=0){
                
                  
                    let arrCar = res.result.records;
                
                    var L1=[],L2=[],L3=[];
                    arrCar.forEach((item,i)=>{
                        if(item.ptzStatus == 1){
                            L1.push(item)
                        }else {
                            L2.push(item)
                        }
                    })
                    if(this.$route.path=="/diaodu" || this.$route.path=="/diaodu2"){
                        arrCar = L1
                    }else{
                        arrCar = L1.concat(L2)
                    }

                    arrCar.forEach((item2,i2)=>{
                        item2.ip=item2.gbInfomation
                    })


                 
                    var p = Object.assign({}, {}, { arr:arrCar, change: v4()})
                    
                    this.$emit("carall", p);
                
               }
				
            }catch (err) {
                console.log(2222)
            
                
            }
          
        },
         async getdept(){
        

            var loading_lo;
            try {
                loading_lo=startLoding('.depTree')
                // const res = await selectDept();
                const res = await queryTreeList()
                endLoding(loading_lo)
        
                if(res && res.result){
                   
                    this.MenuData =res.result 
                    
                    // Object.assign({}, {id:'',departName:'全部',children:[]}, {children: res.result})
                   
                }   
            }catch (err) {
             
                endLoding(loading_lo)
                console.log(err) 
            }
          

           
        },
        getTreeDatas(data) {
              var that = this
                // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
                clearTimeout(that.time)
                that.time = setTimeout(() => {
                    // 写单击事件执行的逻辑代码
                    var p = Object.assign({}, data, {change: v4()})
                    this.$emit("getDeptDatas", p);
            },300)
          

    
        },
    },

    mounted (){
     
        this.getdept()

    },
    components: {
        EmpMini
    },
}
</script>

<style lang='scss' scoped>
    .nysj_the{
        .el-tree {
            color: #000;
        }
    }
    .index_container{
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 10px 0;
        box-sizing: border-box;

    }

</style>
