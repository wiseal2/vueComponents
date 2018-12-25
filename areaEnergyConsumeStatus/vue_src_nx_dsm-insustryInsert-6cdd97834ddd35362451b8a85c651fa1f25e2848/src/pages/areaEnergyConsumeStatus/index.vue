<template>
  <div>
    <Header @halfYearChange='halfYearChange' @query='headQuery' :districts = 'districts'/>
    <Spin :spinning='loading'>
      <EditableTable :tableData='tableData' :bottomText='bottomText' :scroll='tableScoll' @update='update' :slots_arr='slots_arr' :columns='columns'/>
    </Spin>
  </div>
</template>

<script>
import EditableTable from "./components/editableTable";
import Header from "./components/header";
import { Spin,message} from "ant-design-vue";
import { getList,updateList,getCityList} from "../../common/public.js";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  components: {
    EditableTable,
    Header,
    Spin,
    message,
  },
  props: {},
  data() {
    return {
      districts: [],
      loading:true,
      columns:[],
      tableData:[],
      slots_arr:[],
      type:'',
      area_data:'',
      year_data:'',
      halfYearMapping:{'true':'1-6月','false':'7-12月'},
      half_year:'true',
      tableScoll:{x: 1300,y:0},
      bottomText:'注:"-"表示降低或减量',
      table_title:'',
    };
  },
  watch: {},
  computed: {},
  methods: {
    generateColumns(){
      let scrollX = 0;
      let slots_arr = ['energy_increase_target','gdp_lower_target','total_energy_consumption','unit_lower'];
      const columns = [{
        title: '地区',
        width:150,
        align:'center',
        dataIndex: 'cityName',
      },
      ];
      this.table_title = this.halfYearMapping[this.half_year];
      columns.push({
        title:'年度能耗双控目标',
        children:[
          {title:'能耗增量控制目标（万吨标准煤）',align:'center',dataIndex:'energy_increase_target',width:250,scopedSlots:{customRender:'energy_increase_target'}},
          {title:'单位GDP能耗降低目标',align:'center',dataIndex:'gdp_lower_target',width:250,scopedSlots:{customRender:'gdp_lower_target'}},
        ],
      });
      let column_obj = {};
      column_obj['title'] = `${this.table_title}能耗数据`;
      column_obj['children'] = [
        {title:'能耗总量（万吨标准煤）',dataIndex:'total_energy_consumption',align:'center',width:250,scopedSlots:{customRender:'total_energy_consumption'}},
        {title:'同比增减',dataIndex:'month_on_lower',align:'center',width:250,scopedSlots:{customRender:'month_on_lower'}},
        {title:'能耗增量（万吨标准煤）',dataIndex:'energy_add',align:'center',width:250,scopedSlots:{customRender:'energy_add'}},
        {title:'单位GDP能耗同比增减',dataIndex:'unit_lower',align:'center',width:250,scopedSlots:{customRender:'unit_lower'}},
      ];
      columns.push(column_obj);
      scrollX=1850;
      this.tableScoll['x'] = scrollX;
      columns.push({
        title:'操作',
        width:200,
        dataIndex:'operation',
        fixed:'right',
        align:'center',
        scopedSlots:{customRender:'operation'}
      })
      this.slots_arr = slots_arr;
      this.columns = columns;
    },
    query(){
      getList({
        "parent_city": this.area_data,
        "is_half_year": this.half_year,
        "year":this.year_data
      }).then(res=>{
        if(res.code==0){
          this.generateColumns();
          this.loading = false;
          this.tableData = res.data;
        }
     
      })
    },
    update(value){
      if(this.half_year=='true'){
        value['is_half_year'] = true;
      }else{
        value['is_half_year'] = false;
      }
      value['year'] = this.year_data;
      value['parent_city'] = this.area_data;
      value['energy_increase_target'] = value['energy_increase_target']?value['energy_increase_target']:0;
      value['gdp_lower_target'] = value['gdp_lower_target']?value['gdp_lower_target']:0;
      value['total_energy_consumption'] = value['total_energy_consumption']?value['total_energy_consumption']:0;
      updateList(value).then((res)=>{
        if(res.code==0){
          this.$message.success('更新成功');
        }else{
          this.$message.error('更新失败');
        }
        this.query();
      });
    },
    halfYearChange(value){
      this.loading = true;
      this.half_year = value;
      this.table_title = this.halfYearMapping[this.half_year];
      this.query();
    },
    headQuery(value){
      this.loading = true;
      this.area_data = value.area_data;
      this.year_data = value.year_data;
      this.half_year = value.half_year;
      this.query();
    }
  },
  mounted() {
    // this.query(INIT_TIME_ZONE);
  },
  created(){
    this.$message = message;
    //获取地区
    getCityList().then((res)=>{
      if(res.code==0){
        this.districts = res.data.list;
      }
    })
  },
};
</script>
<style lang="less" scoped>
.wrapper {
}
</style>