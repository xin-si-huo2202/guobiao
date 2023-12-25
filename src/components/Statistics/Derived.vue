<template>
  <depTree @getDeptDatas="getDeptDatas" :MenuData="MenuData">
    <div class="Derived">
      <div class="DerivedTop inquire" ref="tagItem">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item label="选择警车" size="small" v-if="carNumber.length>0">
            <el-select
              v-model="form.policarid"
              clearable
              filterable
              placeholder="请选择警车"
              :disabled="JingChe"
              @focus="setMinWidth"
              @clear="selChangeOpera"
            >
              <el-option
                :label="item.pcId"
                v-for="item in carNumber"
                :key="item.id"
                :value="item.id"
                :style="{ 'min-width': minWidth + 2 + 'px' }"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="日期范围" size="small">
            <el-date-picker
            :editable="false"
              v-model="form.time"
              type="daterange"
              align="right"
              :picker-options="pickerTime"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy - MM - dd "
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item size="small">
            <button class="zd-btn--color" @click.prevent="selChangeOpera()">
              <i class="el-icon-search"></i>
              查询
            </button>
          </el-form-item>
          <el-form-item size="small">
            <el-button  style="color: #fff; background-color: #ffba00; border-color: #ffba00;" @click.prevent="resetOpera()">
              <i class="el-icon-refresh-left"></i>
              重置
            </el-button>
          </el-form-item>
          <el-form-item size="small">
            <button class="zd-btn--color" @click.prevent="statExport()">
              导出
            </button>
          </el-form-item>
        </el-form>
      </div>
      <div class="derivedconten Comconten">
        <span>共计{{ total }}条数据</span>
        <el-table
          ref="multipleTable"
          :data="tableData"
          size="small"
          :header-cell-style="{ background: '#eeeeee', color: '#000' }"
          style="width: 100%"
          @header-click="headerClick"
        >
          <el-table-column label="所属单位" prop="deptId"> </el-table-column>
          <el-table-column prop="syPcInformationId" label="车牌号码"></el-table-column>
          <el-table-column prop="sysGpsTime" label="在线时长" sortable sort-by="sysGpsUp"></el-table-column>
          <el-table-column prop="subImageInfo11" label="采集人像" sortable></el-table-column>
          <el-table-column prop="subImageInfo2" label="采集车牌" sortable></el-table-column>
          <el-table-column prop="subImageInfo" label="采集总数" sortable></el-table-column>
        </el-table>
        <div class="zd-image--pos">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="form.page"
            :page-size="form.rows"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="parseInt(this.total)"
          ></el-pagination>
        </div>
      </div>
    </div>
  </depTree>
</template>

<script>
import { queryPoliceList } from "@/api/Photograph.js";
import { statisticsStatement, statExport } from "@/api/echarts";
import depTree from "@/components/System/SelectTree/depTree.vue";
import SelectTree from "@/components/System/SelectTree/SelectTree.vue";
export default {
  name:'derived',
  data() {
    return {
      pickerTime: {
        disabledDate(time) {
          var dateTime=new Date();
          dateTime=new Date(dateTime.setDate(dateTime.getDate()-1))
          return time.getTime() > dateTime;
        },
      },
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "最近一周",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近一个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近三个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //   ],
      // },
      total: 0,

      form: {
        rows: 10, // 条数
        page: 1, //页数
        deptid: "", //部门id
        policarid: "", //警车id
        time: null, //开始时间
      },

      carNumber: [],
      SelectTree: {
        isClearable: true, // 可清空（可选）
        isAccordion: true, // 可收起（可选）
        valueId: null, // 初始ID（可选）
      },
      props: {
        // 配置项（必选）
        value: "id",
        label: "deptName",
        children: "children",
        // disabled:true
      },
      MenuData:
        this.$sj_bs == "nysj"
          ? this.$store.getters.quYu.children
          : JSON.parse(sessionStorage.DEPT_USER)[0].children,
      JingChe: true,
      tableData: [],
      minWidth: "",
    };
  },
  methods: {
     resetOpera(){
        this.form.rows=10;
        this.form.page=1;
        this.form.deptid="";
        this.form.policarid="";
        this.form.time=null;
     },
    //根据搜索条件部门做处理
    async getDeptDatas(id) {
      this.form.deptid = id;
      this.form.policarid = "";
      if (id == null) {
        this.JingChe = true;
      } else {
        this.form.policarid = "";
        const res = await queryPoliceList(id);
        if (res.code == 200) {
          this.JingChe = false;
          this.carNumber = res.data;
        }
      }
      this.selChangeOpera();
    },
    //TABLE表头被点击
    headerClick(column, event){
        console.log("headerClick",column);
        console.log("headerClick",event);
        let id=column.id;
        let num=id.substring(id.lastIndexOf("_")+1,id.length);
        if(num==3){
            this.$refs.multipleTable.clearFilter('subImageInfo11');
            this.$refs.multipleTable.clearFilter('subImageInfo2');
            this.$refs.multipleTable.clearFilter('subImageInfo');
        }else if(num==4){
            this.$refs.multipleTable.clearFilter('sysGpsUp');
            this.$refs.multipleTable.clearFilter('subImageInfo2');
            
            this.$refs.multipleTable.clearFilter('subImageInfo');

        }else if(num==5){
            this.$refs.multipleTable.clearFilter('sysGpsUp');
            this.$refs.multipleTable.clearFilter('subImageInfo11');
            this.$refs.multipleTable.clearFilter('subImageInfo');

        }else{
            this.$refs.multipleTable.clearFilter('sysGpsUp');
            this.$refs.multipleTable.clearFilter('subImageInfo11');
            this.$refs.multipleTable.clearFilter('subImageInfo2');
        }

    },
    
    //搜索
    selChangeOpera() {
      this.form.page = 1;
      this.statisticsStatement();
    },
    // 初始化
    async statisticsStatement() {
      if (!this.form.deptid && this.$sj_bs == "nysj") {
        this.form.deptid=this.$store.getters.quYu.id
      }
      const res = await statisticsStatement(this.form);
      console.log(res);
      let data=res.data.rows;
      data.forEach(item => {
        item.subImageInfo11=parseInt(item.subImageInfo11);
        item.subImageInfo2=parseInt(item.subImageInfo2);
        item.subImageInfo=parseInt(item.subImageInfo);
        item.sysGpsUp=parseInt(item.sysGpsUp);
      });
      this.tableData = data;
      this.total = res.data.totalCount;
    },
    // 分页
    handleCurrentChange(val) {
      this.form.page = val;
      this.statisticsStatement();
    },
    handleSizeChange(val) {
      this.form.rows = val;
      this.statisticsStatement();
    },
    // 取值
    async getValue(e) {
      this.form.deptid = e.value;
      this.form.policarid = "";
      if (e.value == null) {
        this.JingChe = true;
      } else {
        this.form.policarid = "";
        const res = await queryPoliceList(e.value);
        if (res.code == 200) {
          this.JingChe = false;
          this.carNumber = res.data;
        }
      }

      //重新执行查询
      this.selChangeOpera();
    },
    // 导出
    async statExport() {
      if (this.tableData.length > 0) {
        const res = await statExport(this.form);
        window.location.href = res.data.url;
      } else {
        this.$message({
          showClose: true,
          message: "暂无导出数据",
          type: "warning",
        });
      }
    },
    setMinWidth(val) {
      // 无数据的情况下，给请选择提示设置最小宽度
      let domEmpty = document.getElementsByClassName(
        "el-select-dropdown__empty"
      );
      if (domEmpty.length > 0) {
        domEmpty[0].style["min-width"] = val.srcElement.clientWidth + 2 + "px";
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.statisticsStatement();
    });
  },
  components: {
    SelectTree,depTree
  },
};
</script>

<style lang="scss" scoped>
.derivedconten {
  min-height: calc(100% - 62px);
  height: calc(100% - 62px);
  overflow: auto;
  border-top: 1px solid #e6e6e6;
  color: #000;
  // background: #001E64;
  margin: 0 20px;
  padding: 20px 0 0;
  box-sizing: border-box;
  > span {
    display: inline-block;
    margin: 0 5px 10px;
  }
}
</style>