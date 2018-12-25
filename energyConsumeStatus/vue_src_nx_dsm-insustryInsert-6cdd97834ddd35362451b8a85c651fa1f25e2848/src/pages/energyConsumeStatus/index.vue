<template>
  <div>
    <Header @projectChange='projectChange' @query='headQuery' :timeZone='timeZone' :districts = 'districts'/>
    <Spin :spinning='loading'>
      <EditableTable :tableData='tableData' :bottomText='bottomText' :scroll='tableScoll' @update='update' :slots_arr='slots_arr' :columns='columns'/>
    </Spin>
  </div>
</template>

<script>
import EditableTable from "./components/editableTable";
import Header from "./components/header";
import { Spin,message} from "ant-design-vue";
import { getList,updateList,getTimeZone,getDistricts} from "../../common/public.js";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const INIT_TIME_ZONE = '000210001';
const currentYear = new Date().getFullYear();
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {},
  };
  if (index === 4) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
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
      datas: [],
      timeZone: [],
      districts: [],
      loading:true,
      columns:[],
      tableData:[],
      slots_arr:[],
      type:'',
      area:'',
      timeZoneMapping:{},
      yearMap:{},
      tableScoll:{x: 1300,y:0},
      bottomText:'注:"-"表示降低或减量',
    };
  },
  watch: {},
  computed: {},
  methods: {
    generateColumns(value){
      let scrollX = 900;
      let slots_arr = ['percent','data_value'];
      const columns = [{
        title: '地区',
        align:'center',
        dataIndex: 'area_name',
      },
      ];
      let yearIndex = this.timeZoneMapping[value].indexOf(currentYear);
      let currentArr = this.timeZoneMapping[value].slice(0,yearIndex+1);
      columns.push({
        title:`"${this.yearMap[value]}"双控"目标任务`,
        children:[
          {title:'单位GDP能耗下降目标（%）',align:'center',dataIndex:'percent',width:250,scopedSlots:{customRender:'percent'}},
          {title:'能耗增量控制目标（万吨标准煤）',align:'center',dataIndex:'data_value',width:250,scopedSlots:{customRender:'data_value'}}
        ],
      });
      currentArr.map((item,index,arr)=>{
        let column_obj = {};
        column_obj['title'] = `${item}年能耗"双控"目标完成情况`;
        column_obj['children'] = [
          {title:'单位GDP能耗累计下降（%）',dataIndex:`a${index+1}`,align:'center',width:250,scopedSlots:{customRender:`a${index+1}`}},
          {title:'总量增减（万吨标准煤）',dataIndex:`b${index+1}`,align:'center',width:250,scopedSlots:{customRender:`b${index+1}`}},
        ];
        columns.push(column_obj);
        slots_arr = slots_arr.concat([`a${index+1}`,`b${index+1}`]);
        scrollX+=500;
      })
      columns.push({
        title:'操作',
        width:200,
        dataIndex:'operation',
        fixed:'right',
        align:'center',
        scopedSlots:{customRender:'operation'}
      })
      this.tableScoll['x'] = scrollX;
      this.slots_arr = slots_arr;
      this.columns = columns;
    },
    query(value){
      getList({
        "area": this.area,
        "type": this.type,
      }).then((res)=>{
        this.loading = false;
        this.tableData = res.data;
        this.generateColumns(value);
      })
    },
    update(value){
      updateList(value).then((res)=>{
        if(res&&res.code==0){
          this.$message.success('更新成功');
        }else{
          this.$message.error('更新失败');
          this.query();
        }
      })
    },
    projectChange(value){
      this.type = value;
      this.query(value);
    },
    generateTimeZone(){
      let obj = {},obj2 = {};
      this.timeZone.map((item,index)=>{
        let yearArr = [],firstYear=2016+index*5;
        for(let i=0;i<5;i++){
          yearArr.push(firstYear);
          firstYear++;
        }
        obj[item['code']] = yearArr;
        obj2[item['code']] = item['name']
      })
      this.timeZoneMapping = obj;
      this.yearMap = obj2;
    },
    headQuery(value){
      this.loading = true;
      this.area = value.area_data;
      this.type = value.timeZone_data;
      this.query(this.type);
    }
  },
  mounted() {
    // this.query(INIT_TIME_ZONE);
  },
  created(){
    this.$message = message;
    //获取计划
    getTimeZone('000210000').then((res)=>{
      if(res.code==0){
        this.timeZone = res.data.list;
        //生成code-计划键值对
        this.generateTimeZone();
      }
    })
    //获取地区
    getDistricts().then((res)=>{
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