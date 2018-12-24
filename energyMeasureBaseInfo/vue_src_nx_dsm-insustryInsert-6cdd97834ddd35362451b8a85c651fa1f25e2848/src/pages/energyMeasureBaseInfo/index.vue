<template>
  <div>
    <Header @add='headAdd' @query='headQuery' />
    <Spin :spinning='loading'>
      <EditableTable :tableData.sync='tableData'  :bottomText='bottomText' :scroll='tableScoll' @add='add' @update='update' @del='del' :slots_arr='slots_arr' :columns='columns'/>
    </Spin>
  </div>
</template>

<script>
import EditableTable from "./components/editableTable";
import Header from "./components/header";
import { Spin,message} from "ant-design-vue";
import { getList,updateList,getUserInfo,addList,delList} from "../../common/public.js";
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
      enterprise_id:'',
      measure_name:'',
      halfYearMapping:{'true':'1-6月','false':'7-12月'},
      tableScoll:{x: 1300,y:0},
      bottomText:'注:"-"表示降低或减量',
    };
  },
  watch: {},
  computed: {},
  methods: {
    generateColumns(){
      let scrollX = 150;
      let slots_arr = ['operation'];
      const columns = [
        {title:'计量器具名称',dataIndex:'metering_name',align:'center',scopedSlots:{customRender:'metering_name'}},
        {title:'计量器具类型','width':150,dataIndex:'metering_type',align:'center',scopedSlots:{customRender:'metering_type'}},
        {title:'器具等级','width':100,dataIndex:'metering_level',align:'center',scopedSlots:{customRender:'metering_level'}},
        {title:'计量相关参数','width':150,dataIndex:'metering_parameter',align:'center',scopedSlots:{customRender:'metering_parameter'}},
        {title:'所属上报数据组合编码','width':200,dataIndex:'data_code',align:'center',scopedSlots:{customRender:'data_code'}},
        {title:'生产厂家','width':100,dataIndex:'manu_facturer',align:'center',scopedSlots:{customRender:'manu_facturer'}},
        {title:'型号规格','width':100,dataIndex:'type_specification',align:'center',scopedSlots:{customRender:'type_specification'}},
        {title:'准确度等级','width':120,dataIndex:'accuracy_level',align:'center',scopedSlots:{customRender:'accuracy_level'}},
        {title:'测量范围','width':100,dataIndex:'measure_range',align:'center',scopedSlots:{customRender:'measure_range'}},
        {title:'管理编号','width':100,dataIndex:'manage_code',align:'center',scopedSlots:{customRender:'manage_code'}},
        {title:'检定/校准状态','width':150,dataIndex:'calibration_state',dataType:'select',align:'center',scopedSlots:{customRender:'calibration_state'}},
        {title:'检定/校准周期','width':150,dataIndex:'calibration_cycle',align:'center',scopedSlots:{customRender:'calibration_cycle'}},
        {title:'最近一次检定/校准时间','width':200,dataIndex:'lately_calibration1',dataType:'time',align:'center',scopedSlots:{customRender:'lately_calibration1'}},
        {title:'下一次检定/校准时间','width':200,dataIndex:'next_calibration1',dataType:'time',align:'center',scopedSlots:{customRender:'next_calibration1'}},
        {title:'未检定/校准原因','width':150,dataIndex:'not_calibration',align:'center',scopedSlots:{customRender:'not_calibration'}},
        {title:'安装地点','width':100,dataIndex:'installation_site',align:'center',scopedSlots:{customRender:'installation_site'}},
        {title:'安装方','width':150,dataIndex:'install_org',align:'center',dataType:'select',scopedSlots:{customRender:'install_org'}},
        {title:'安装时间','width':200,dataIndex:'install_date1',align:'center',dataType:'time',scopedSlots:{customRender:'install_date1'}},
        {title:'接入系统','width':100,dataIndex:'usr_system',align:'center',scopedSlots:{customRender:'usr_system'}},
        {title:'目前状态','width':150,dataIndex:'measure_state',align:'center',dataType:'select',scopedSlots:{customRender:'measure_state'}},
        {title:'状态发生时间','width':200,dataIndex:'measure_state_date1',align:'center',dataType:'time',scopedSlots:{customRender:'measure_state_date1'}},
      ];
      columns.push({
        title:'操作',
        width:150,
        dataIndex:'operation',
        fixed:'right',
        align:'center',
        scopedSlots:{customRender:'operation'}
      })
      columns.map((item,index)=>{
        item['dataIndex']&&this.slots_arr.push(item['dataIndex']);
        item['width']&&(scrollX+=item['width']);
      })
      this.tableScoll['x'] = scrollX;
      this.columns = columns;
    },
    query(metering_name){
       getUserInfo().then((res)=>{
      let enterprise_id = '';
      if(res.code==0){
        enterprise_id = res.data.enterprise_id;
        this.enterprise_id = enterprise_id;
        let query_obj = {
          enterprise_id:enterprise_id
        }
        metering_name&&(query_obj['metering_name'] = metering_name);
        getList({
          params:query_obj
        }).then((res)=>{
          if(res.code==0){
            let rows = res.rows;
            rows.map((item,index)=>{
              item['key'] = index;
            })
            this.generateColumns();
            this.tableData = res.rows;
            this.loading = false;
          }
        })
      }
    });
    },
    update(value){
      updateList(value).then((res)=>{
        if(res.code==0){
         this.$message.success('更新成功');
        }else{
          this.$message.success('更新失败');
        }
      });
    },
    del(value){
      let id_arr = [];
      id_arr.push(value['id']);
      delList([...id_arr]).then(res=>{
        if(res.code==0){
         this.$message.success('删除成功');
        }else{
          this.$message.success('删除失败');
        }
      })
    },
    halfYearChange(value){
      this.loading = true;
      this.half_year = value;
      this.query();
    },
    headQuery(value){
      this.loading = true;
      this.measure_name = value;
      this.query(this.measure_name.measure_name);
    },
    add(value){
      value['enterprise_id'] = this.enterprise_id;
      addList(value).then(res=>{
        if(res.code==0){
         this.$message.success('增加成功');
        }else{
          this.$message.success('增加失败');
        }
      })
    },
    headAdd(){
      let key  = new Date().getTime();
      this.tableData.unshift({
        editable:true,
        key:key,
        metering_name:'',
        metering_type:'',
        metering_level:'',
        metering_params:'',
        data_code:'',
        manu_facturer:'',
        type_specification:'',
        accuracy_level:'',
        measure_range:'',
        manage_code:'',
        calibration_state:'',
        calibration_cycle:'',
        lately_calibration1:'',
        measure_org:'',
        calibration_cycle:'',
        next_calibration1:'',
        not_calibration:'',
        installation_site:'',
        install_org:'',
        install_date1:'',
        usr_system:'',
        measure_state:'',
        measure_state_date1:'',
      });
      this.$eventBus.$emit('add',key);
    },
  },
  mounted() {
    this.loading = false;
  },
  created(){
    this.$message = message;
  },
};
</script>
<style lang="less" scoped>
.wrapper {
}
</style>