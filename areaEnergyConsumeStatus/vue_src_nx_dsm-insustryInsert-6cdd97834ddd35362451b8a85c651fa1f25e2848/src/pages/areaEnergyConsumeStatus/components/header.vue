<template>
<div style="display:flex;justify-content:start;align-items:center;margin:20px 0;">
   <div class="select_box">
   <Select  @change='yearChange' v-model='year_data' style='width:100%;float:left;'>
      <Option v-for='(p,index) of years' :value='p.value' :key='index'>{{p.label}}</Option>
   </Select>
   </div>
   <div class="ib mgn20 ft16">年</div>
   <div class="select_box">
   <Select  @change='halfYearChange' v-model='half_year' style='width:100%;float:left;'>
     <Option value='true'>上半年</Option>
     <Option value='false'>下半年</Option>
   </Select>
  </div>
  <div class="select_box" style="margin-left:15px;">
   <Select v-model='area_data' @change="areaChange" style='width:100%;'>
      <Option v-for='(d,i) of districts' :value='d.code' :key='i'>{{d.name}}</Option>
    </Select>
  </div>
  <div class="ib mgn20 ft16">能耗情况</div>
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
    districts:{
      type:Array,
      required:true,
      default:[],
    }
  },
  data(){
    return{
      years:[
        {label:'2015',value:'2015',},
        {label:'2016',value:'2016',},
        {label:'2017',value:'2017',},
        {label:'2018',value:'2018',},
        {label:'2019',value:'2019',},
        {label:'2020',value:'2020',},
        ],
      area_data:'640000',
      year_data:'2018',
      half_year:'true',
    }
  },
  components:{
    Select,
    Option:Select.Option,
    Button
  },
  watch:{
  },
  created(){
    
  },
  methods:{
    yearChange(value){
      this.query();
    },
    halfYearChange(value){
      this.$emit('halfYearChange',value);
    },
    areaChange(){
      this.query();
    },
    query(){
      this.$emit('query',{area_data:this.area_data,year_data:this.year_data,half_year:this.half_year});
    }
  },
  mounted(){
    this.$emit('query',{area_data:this.area_data,year_data:this.year_data,half_year:this.half_year});
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
    margin:0 20px;
  }
  .ant-btn{
    background: #42B159;
    color: #fff;
  }
  .ft16{
    font-size: 16px;
    font-weight: bold;
  }
</style>
