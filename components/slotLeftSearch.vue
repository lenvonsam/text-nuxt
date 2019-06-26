<template lang="pug">
.content
  .padding.bg-container 查询
  el-form.ft-12(inline, :model="formItem.model", ref="searchForm", :label-width="'80px'")
    el-form-item.mb-10.mr-5.ml-5(:label="item.lbl", v-for="item in formItem.form", :key="item.prop", clearable)
      el-input(size="small", v-model="formItem.model[item.prop]")
    el-form-item.full-width.text-center
      el-button-group
        el-button(type="primary", size="small", @click="searchHandler") 搜索
        el-button(size="small", @click="resetForm") 重置
</template>
<script>
export default {
  props: {
    formItem: {
      type: Object,
      required: true
    },
    searchEvent: {
      type: Function,
      required: true
    }
  },  
  data () {
    return {
      copyForm: {}
    }
  },
  mounted () {
    this.copyForm = JSON.parse(JSON.stringify(this.formItem.model))
  },
  methods: {
    searchHandler () {
      this.searchEvent(this.formItem)
    },
    resetForm () {
      this.formItem.model = JSON.parse(JSON.stringify(this.copyForm))
    }
  }
}
</script>

