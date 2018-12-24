<template>
  <Table :columns="columns" :scroll='scroll' :dataSource="data" bordered>
    <template v-for="col in slots" :slot="col" slot-scope="text, record, index">
      <div>
        <Tooltip v-if="record.editable" placement="bottom" >
          <template v-if='record.descriptions[col]' slot="title">
           <span>{{record.descriptions[col]}}</span>
          </template>
          <Select @change="v => selectChange(v, record.key, col)" :defaultValue="['合格','不合格'][text]" class="edit_select" v-if="col=='calibration_state'">
            <Option value='1'>合格</Option>
            <Option value='0'>不合格</Option>
          </Select>
          <DatePicker format='YYYY-MM-DD HH:mm:ss' @change="(moment,dateStr)=>dateChange(moment,dateStr, record.key, col)"  v-else-if="col=='lately_calibration1'||col=='next_calibration1'||col=='install_date1'||col=='measure_state_date1'">
          </DatePicker>
          <Select @change="v => selectChange(v, record.key, col)" :defaultValue="['','用能单位','能源供应公司','第三方公司'][text]" class="edit_select" v-else-if="col=='install_org'">
            <Option value='1'>用能单位</Option>
            <Option value='2'>能源供应公司</Option>
            <Option value='3'>第三方公司</Option>
          </Select>
          <Select @change="v => selectChange(v, record.key, col)" :defaultValue="['','正常','故障','停用'][text]" class="edit_select" v-else-if="col=='measure_state'">
            <Option value='1'>正常</Option>
            <Option value='2'>故障</Option>
            <Option value='3'>停用</Option>
          </Select>
          <Input v-else
          class="edit_input"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        </Tooltip>
        <template v-else>
          <span v-if='col=="calibration_state"'>{{['合格','不合格'][text]}}</span>
          <span v-else-if='col=="install_org"'>{{['','用能单位','能源供应公司','第三方公司'][text]}}</span>
          <span v-else-if='col=="measure_state"'>{{['','正常','故障','停用'][text]}}</span>
          <span v-else>{{text}}</span>
        </template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record, index">
      <div class='editable-row-operations'>
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <Popconfirm title='确定取消?' @confirm="() => cancel(record.key)">
            <a style="margin-left:10px;">取消</a>
          </Popconfirm>
        </span>
        <span v-else>
          <a @click="() => edit(record.key,'edit')" style="margin-right:10px">编辑</a>|
          <Popconfirm title='确定删除?' @confirm="() => del(record.key)">
            <a style="margin-left:10px;">删除</a>
          </Popconfirm>
        </span>
      </div>
    </template>
  </Table>
</template>
<script>
import {
  Table,
  Tag,
  Divider,
  Icon,
  Input,
  Popconfirm,
  message,
  Select,
  DatePicker,
  Tooltip,
} from "ant-design-vue";
import moment from 'moment';
import { deleteRecord, editRecord } from "../../../common/public.js";
export default {
  props:{
    columns:{
      type:Array,
      required:true,
    },
    tableData:{
      type:Array,
      required:true,
    },
    slots_arr:{
      type:Array,
      required:true,
      default:[1,2,3],
    },
    scroll:{
      type:Object,
    },
    bottomText:{
      type:String,
      default:'',
    }
  },
  components: {
    Table,
    Tag,
    Divider,
    Icon,
    Input,
    Popconfirm,
    Select,
    Option: Select.Option,
    message,
    DatePicker,
    Tooltip,
  },
  data () {
    return {
      data:[],
      slots:[],
      cacheData:[],
      ope:'edit',
    }
  },
  methods: {
    moment,
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value;
        this.data = newData
      }
    },
    dateChange(moment,value,key,column){
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value;
        this.data = newData
      }
    },
    selectChange(value,key,column){
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value;
        this.data = newData
      }
    },
    edit (key,ope) {
      ope&&(this.ope=ope);
      const descriptions = 
        {
          'metering_name':'填写计量器具的简称或俗称,要与"计量器具类型"栏填写的类别对应',
          'metering_type':'按照《JJF1051-2009 计量器具命名与分类编码》填写本计量器具所属的类型，如用"1206100"表示"连续累计自动衡器(皮带秤)"',
          'metering_level':`1.表示进出用能计量器具。\n2.表示主要次级用能计量器具。\n3.表示主要用能设备计量器具。`,
          'data_code':'指与该计量器具相关联的采集上报数据组合编码。一个采集上报数据组合编码可对应多个计量器具。',
          'manu_facturer':'指计量器具的生产厂家',
          'measure_state_date':'指目前状态发生的日期，如什么时候开始正常使用，什么时候开始发生当前故障等',
        };
      const newData = [...this.data]
      this.cacheData = JSON.parse(JSON.stringify(newData));
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true
        target.descriptions = descriptions
        this.data = newData
      }
    },
    save (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]     
      if (target) {
        delete target.editable
        delete target.descriptions
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
        if(this.ope=='edit'){
          this.$emit('update',target);
        }else{
          this.$emit('add',target);
        }
        this.$emit('update:tableData',this.data);
      }
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    },
    del(key){
      let newData = [...this.data];
      let target = {};
      newData.map((item,index)=>{
        if(item.key==key){
          target = item;
          newData.splice(index,1);
        }
      })
      this.data = newData;
      this.$emit('update:tableData',this.data);
      this.$emit('del',target)
    }
  },
  created(){
    this.$message = message;
    this.$eventBus.$on('add',(v)=>{
      this.ope = 'add';
      this.edit(v);
    });
  },
  mounted(){
  },
  watch:{
    slots_arr(newval,old){
      this.slots = newval;
    },
    tableData(newVal){
      this.data = newVal;
    }
  }
}
</script>

<style lang='less' scoped>
  /deep/.ant-pagination-item-active a{
    color:#fff;
  }
  /deep/.ant-pagination-item-active a:hover{
    color:#fff;
  }
  /deep/.ant-pagination-item-active{
    background: #42B159 !important;
    color:#fff;
  }
  /deep/.ant-table-tbody > tr:nth-child(even){
    background:#fafafa;
  }
   /deep/ tr:hover{
    border:#4BD361;
  }
  a{
    color:#42B159;
  }
  /deep/ td{
    position: relative;
  }
 .ant-tooltip-inner{
    background:red;
  }
  .edit_input{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    border: #3B9F50;
    border-radius: 0;
    background: rgba(61,196,89,0.2);
  }
    
  .ant-input:focus{
    outline: 0;
    box-shadow: 0px 0px 5px 1px green;
    background: #fff !important;
  }

  .ant-input:hover{
    background: rgba(61, 196, 89, 0.5);
  }
  .edit_select{
    width: 100%;
    // position: absolute;
    // top: 20%;
    // left: 0px;
  }
</style>
