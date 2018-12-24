<template>
<div style="margin:20px 0;text-align:left;">
   <div class="select_box">
   <Select  @change='projectChange' v-model='timeZone_data' style='width:100%;'>
      <Option v-for='(p,index) of timeZones' :value='p.code' :key='index'>{{p.name}}</Option>
    </Select>
  </div>
  <div class="ib mgn20">地区：</div>
  <div class="select_box">
   <Select v-model='area_data' style='width:100%;'>
      <Option v-for='(d,i) of districts' :value='d.code' :key='i'>{{d.name}}</Option>
    </Select>
  </div>
  <Button class="mgn20" @click='query'>查询</Button>
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
  Button
} from "ant-design-vue";
export default{
  props:{
    timeZone:{
      type:Array,
      required:true,
      default:[],
    },
    districts:{
      type:Array,
      required:true,
      default:[],
    }
  },
  data(){
    return{
      timeZones:[],
      area_data:'640000',
      timeZone_data:'000210001',
    }
  },
  components:{
    Select,
    Option:Select.Option,
    Button
  },
  watch:{
    timeZone(newV,old){
      this.timeZones = newV;
    }
  },
  created(){
    this.$emit('query',{area_data:this.area_data,timeZone_data:this.timeZone_data});
  },
  methods:{
    projectChange(value){
      // this.$emit('projectChange',value);
    },
    query(){
      this.$emit('query',{area_data:this.area_data,timeZone_data:this.timeZone_data});
    }
  }
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
    margin:0 20px;
  }
  .ant-btn{
    background: #42B159;
    color: #fff;
  }
</style>
