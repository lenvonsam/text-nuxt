<template lang="pug">
.pagination-box.row.pr-5
  .row.padding-xs
    .page-button(@click="changePage('start')")
      .el-icon-d-arrow-left
    .page-button(@click="changePage('prev')")
      .el-icon-arrow-left
    .page-input.row
      span.pr-5 第
      el-input.input(type="number", size="mini", v-model="page", @blur="changePage")
      span.pl-5 页, 共{{totalPage}}页
    .page-button(@click="changePage('next')")
      .el-icon-arrow-right
    .page-button(@click="changePage('end')")
      .el-icon-d-arrow-right
    .page-button(@click="changePage('reload')")
      .el-icon-refresh
  span(v-if="pgTotal > 0") 显示1-{{pageSize}}条，共{{pgTotal}}条
  span(v-else) 暂无数据  
</template>
<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 5
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      totalPage: 1,
      page: 1,
      pgTotal: 0
    }
  },
  watch: {
    total(newVal, oldVal) {
      this.pgTotal = newVal
      const totalPage = this.pgTotal / this.pageSize
      this.totalPage = (totalPage === parseInt(totalPage)) ? parseInt(totalPage) : (parseInt(totalPage) + 1)
    }
  },
  mounted () {
    this.page = JSON.parse(JSON.stringify(this.currentPage))
  },
  methods: {
    changePage(type) {
      switch (type) {
        case 'reload':
        case 'start':
          this.page = 1
          break
        case 'prev':
          if (this.page > 1) this.page = this.page - 1         
          break
        case 'next':
          if (this.page < this.totalPage) this.page++    
          break
        case 'end':
          this.page = this.totalPage
          break
        // default: 
          // console.log(type)
          // console('----------error')
      }
      if (this.page > this.totalPage) { this.page = this.totalPage}
      this.$emit('current-change', Number(this.page))
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

