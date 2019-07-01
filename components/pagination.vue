<template lang="pug">
.pagination-box.row.pr-5
  .row.padding-xs
    .page-button
      .el-icon-d-arrow-left(@click="changePage('start')")
    .page-button
      .el-icon-arrow-left(@click="changePage('prev')")
    .page-input.row
      span.pr-5 第
      el-input.input(type="number", size="mini", v-model="currentPage")
      span.pl-5 页, 共{{totalPage}}页
    .page-button
      .el-icon-arrow-right(@click="changePage('next')")
    .page-button
      .el-icon-d-arrow-right(@click="changePage('end')")
    .page-button
      .el-icon-refresh
  //- span 暂无数据
  span 显示1-10条，共10条
</template>
<script>
export default {
  props: {
    pgTotal: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 5
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
  },
  data () {
    return {
      totalPage: 1
    }
  },
  mounted () {
    const totalPage = this.pgTotal / this.pageSize
    this.totalPage = (totalPage === parseInt(totalPage)) ? totalPage : (totalPage + 1)
  },
  methods: {
    changePage(type) {
      this.$emit('current-change')
    }
  }
}
</script>

<style lang="stylus" scoped>
.pagination-box
  justify-content space-between
  width 100%
  background #eee
  align-items center
  .page-button
    width 25px
    height 25px
    line-height 25px
    text-align center
    border 1px #f6f6f6 solid
    cursor pointer
  .page-input
    align-items center
    margin 0 2px
    .input 
      width 30px
      height 25px
</style>

