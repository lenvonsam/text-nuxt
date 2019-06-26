<template lang="pug">
.content
  .padding.pt-10.pb-10.bg-container.ft-bold.ft-16 查询
  .mt-10    
    el-form(inline, :model="formItemModel", ref="searchForm", :label-width="labelWidth")
      el-form-item.mb-10.mr-10.ml-5(:label="item.lbl", v-for="item in formItem", :key="item.prop", clearable)
        //- el-input(size="small", v-model="formItemModel[item.prop]")
        template(v-if="item.type == 'select'")
          el-select.full-width(v-model="formItemModel[item.prop]", filterable, clearable, :placeholder="item.placeholder", size="small")
            el-option(v-for="itemIist in item.list", :key="itemIist[item.prop]", :label="itemIist[item.prop]", :value="itemIist[item.valProp ? item.valProp : item.prop]")
        el-date-picker.full-width(v-model="formItemModel[item.prop]", type="date",v-else-if="item.type == 'date'", :placeholder="item.placeholder",size="small", value-format="yyyy-MM-dd")
        el-date-picker.full-width(v-model="formItemModel[item.prop]", type="datetime",v-else-if="item.type == 'datetime'", :placeholder="item.placeholder", size="small", value-format="yyyy-MM-dd HH:mm:ss")
        el-date-picker.full-width.crm-timeLimit(v-model="formItemModel[item.prop]", type="datetimerange", v-else-if="item.type == 'datetimerange'", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", size="small", value-format="yyyy-MM-dd HH:mm:ss")
        el-input(v-model="formItemModel[item.prop]", v-else, :placeholder="item.placeholder", size="small", clearable)
      el-form-item.full-width.justify-center
        el-button-group
          el-button(type="primary", size="small", @click="searchHandler") 搜索
          el-button(size="small", @click="resetForm") 重置
</template>
<script>
export default {
  props: {
    formItem: {
      type: Array,
      required: true
    },
    searchEvent: {
      type: Function,
      required: true
    },
    labelWidth: {
      type: String,
      default: '80px'
    }
  },  
  data () {
    return {
      copyForm: {},
      formItemModel: {}
    }
  },
  mounted () {
    const obj = {}
    this.formItem.map((item) => {
      obj[item.prop] = item.val
      if (item.valProp) obj[item.valProp] = item.val      
    })
    this.formItemModel = obj
    this.copyForm = JSON.parse(JSON.stringify(this.formItemModel))
  },
  methods: {
    searchHandler () {
      this.searchEvent(this.formItemModel)
    },
    resetForm () {
      this.formItemModel = JSON.parse(JSON.stringify(this.copyForm))
    }
  }
}
</script>

<style scoped>
.row {
  align-items: center;
}
.el-form--inline .el-form-item{
  display: flex!important;
}
.justify-center {
  justify-content: center;
}
</style>

