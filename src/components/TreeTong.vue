<template>
    
    <div class="index_container">
        
        <el-tree
            :data="MenuData"
            :props="defaultProps"
            default-expand-all
            node-key="value"
            ref="tree"
            :expand-on-click-node="false"
            @node-click="getTreeDatas"
          >
        </el-tree>
       
    </div>
    
</template>

<script>

export default {
    name:'TreeTong',
    props: {
        MenuData: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data () {
        return {
            filterText: "",
            countTree:0,
            defaultProps: {
                value: "id",
                label: "deptName",
                children: "children",
            },
        };
    },
    destroyed() {
       
    },
    watch: {
    },
    methods: {
        getTreeDatas(data) {
       
            this.$emit("getDeptDatas", data);
        },
    },

    mounted (){
     
        
      

    },
    components: {
        
    },
}
</script>

<style lang='scss' scoped>

    .index_container{
        width: 100%;
        height: 100%;
        overflow-y: scroll;

    }

</style>
