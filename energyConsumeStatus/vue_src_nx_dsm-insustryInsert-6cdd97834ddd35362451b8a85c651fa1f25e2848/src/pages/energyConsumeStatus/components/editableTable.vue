<template>
  <Table :columns="columns" :scroll='scroll' :dataSource="data" bordered>
    <template v-for="col in slots" :slot="col" slot-scope="text, record, index">
      <div>
        <Input
          v-if="record.editable"
          class="edit_input"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>{{text}}</template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record, index">
      <div class='editable-row-operations'>
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <Popconfirm title='确定取消?' okText='确认' cancelText='取消' @confirm="() => cancel(record.key)">
            <a style="margin-left:10px;">取消</a>
          </Popconfirm>
        </span>
        <span v-else>
          <a @click="() => edit(record.key)">编辑</a>
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
  Select
} from "ant-design-vue";
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
  },
  data () {
    return {
      data:[],
      slots:[],
      cacheData:[],
    }
  },
  methods: {
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      // value = value==''?0:1*value;
      let regex = /^(\-|\+)?\d+(\.\d+)?$/;
      if(value!=''&&value!='-'&&!regex.test(value)){
        this.$message.error('非法的输入数据');
        return;
      }
      if (target) {
        target[column] = value;
        this.data = newData
      }
    },
    edit (key) {
      const newData = [...this.data]
      this.cacheData = JSON.parse(JSON.stringify(newData));
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
        this.$emit('update',target);
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
  },
  created(){
    this.$message = message;
  },
  mounted(){
      var node=document.createElement("tr");
      node.className = "ant-table-row  ant-table-row-level-0";
      node.style.height='50px';
      node.style.background='#fafafa';
      var node2=document.createElement("td");
      node2.colSpan = 20;
      node.style.textIndent = '15px';
      node.style.letterSpacing = '1px';
      node.style.fontWeight = 'bold';
	    var textnode=document.createTextNode(this.bottomText);
      node2.appendChild(textnode);
      node.appendChild(node2);
      document.querySelector('.ant-table-fixed').appendChild(node);
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
</style>
