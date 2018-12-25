<template>
<div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
   <div class="select_box" style="display:flex;justify-content:space-between;align-items:center;">
     <div class="ib mgn20" style="white-space:nowrap;">计量器具名称：</div>
     <Input class="measure_input" @pressEnter='query' v-model='measure_name'/>
     <Button @click='query'>查询</Button>
   </div>
   <Button @click='add'>新增</Button>
</div>
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
  Button,
  Tooltip,
} from "ant-design-vue";
export default{
  props:{
  },
  data(){
    return{
      measure_name:'',
    }
  },
  components:{
    Input,
    Button,
    Tooltip,
  },
  watch:{
  },
  created(){
  },
  methods:{
    query(){
      this.$emit('query',{measure_name:this.measure_name});
    },
    add(){
      this.$emit('add');
    },
  },
  mounted(){
    this.query();
  },
}
</script>

<style lang='less' scoped>
  .select_box{
    width: 120px;
    display: inline-block;
  }
  .ib{
    display: inline-block;
  }
  .mgn20{
    margin:0 15px;
  }
  .ant-btn{
    background: #42B159;
    color: #fff;
  }
  .ft16{
    font-size: 16px;
    font-weight: bold;
  }
  .measure_input{
    width: 200px;
    margin-right: 15px;
  }
</style>
