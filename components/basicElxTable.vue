<template lang="pug">
  div
    elx-table.mt-15(ref="basicEditable",
      v-loading="loading",
      :data.sync="tableValue.tableData", 
      size="mini",
      border, 
      :height="tableHeight",
      highlight-current-row,
      @row-click="selectRow"
      @selection-change="handleSelectionChange")
        elx-table-column(type="selection", width="40", v-if="tableValue.hasCbx")
        elx-table-column(type="index", width="40", v-if="tableValue.showRowIndex")
        template(v-for="(head, index) in tableValue.tableHead")
          template(v-if="head.type === 'action'")
            elx-table-column(
              :align="head.align ? head.align : 'left'" 
              :fixed="head.fixed", 
              label="操作", 
              :width="head.width ? head.width : 'auto'",
              :prop="head.prop")
              template(slot-scope="scope")
                .row.tab-row
                  template(v-for="(btn, index) in head.actionBtns", v-if="canShowRowBtn(btn.type, scope, btn.lbl) && scope.row['actionBtns']")                  
                    .row-button(v-if="scope.row['actionBtns'][index] || btn.lbl", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row['actionBtns'][index] ? scope.row['actionBtns'][index] : btn.lbl}}
                    //- el-button(type="text", v-if="scope.row['actionBtns'][index] || btn.lbl", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row['actionBtns'][index] ? scope.row['actionBtns'][index] : btn.lbl}}
                  template(v-else-if="canShowRowBtn(btn.type, scope, btn.lbl)")                             
                    .row-button(:class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row.btnLbl ? scope.row.btnLbl : btn.lbl}}
                    //- el-button(type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row.btnLbl ? scope.row.btnLbl : btn.lbl}}
          template(v-else)
            elx-table-column(show-overflow-tooltip, 
              :formatter="head.formatter ? head.formatter : null", 
              :prop="head.prop",
              :width="head.width ? head.width : ''", 
              :min-width="head.minWidth? head.minWidth : ''", 
              :label="head.lbl")
    pageination(:total="total", :pageSize="pageSize", :currentPage="currentPage", @current-change="pgChange")
    //- .mt-5.text-right
      el-pagination(background, layout="prev, pager, next, jumper", :total="pgTotal", :page-size="pageSize", :current-page="currentPage", @current-change="pgChange")
    //- .padding.text-right.row(v-if="tableValue.page ? tableValue.page : true")
    //-   .col
    //-     el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="total", @current-change="pgChange")
    //-   span(style="padding-bottom: 3px;") 共 {{total}} 条数据
      
</template>

<script>
import pageination from '@/components/pagination'
export default {
  components: {
    pageination
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tableValue: {
      type: Object,
      required: true
    },
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
    },
    dialogBox: {
      type: Object,
      default: null
    },
    tableDialogFun: {
      type: Function,
      default: function () {
        return true
      }
    },
    selectRowFun: {
      // 选择时执行
      type: Function,
      default: function () {
        return true
      }
    }
  },
  data() {
    return {
      pgTotal: 0,
      dialogConfig: {
        title: '新增',
        show: false,
        labelWidth: '100px'
      },
      rowSelection: [],
      resetDialog: {},
      tableHeight: '500px'
    }
  },
  // watch: {
  //   total(newVal, oldVal) {
  //     console.log('total newval:>', newVal)
  //     this.pgTotal = newVal
  //   }
  // },
  beforeMount() {
    console.log('total:>>', this.total)
    this.pgTotal = this.total    
    this.tableHeight = (window.innerHeight - 210) + 'px'
    window.addEventListener('resize', () => {
      this.tableHeight = (window.innerHeight - 210) + 'px'
    }) 
  },
  methods: {
    handleSelectionChange(val) {
      // 选中
      this.rowSelection = val
      this.$emit('rowSelection', val)
    },
    pgChange(val) {
      // 翻页
      this.$emit('paginateChange', val)
    },
    selectRow (row, column, event) {      
      this.$refs.basicEditable.clearSelection()
      this.$refs.basicEditable.toggleRowSelection(row)
    },
    handerRowBtn (idx, row, btnType) {
      row.idx = idx
      this.isVerify = true
      if (this.isVerify) {
        this.$emit(`tableRow${btnType.substring(0, 1).toUpperCase()}${btnType.substring(1)}`, row)
      }
    },
    canShowRowBtn (type, scope, lbl) {
      const result = true
      let condition = true
      // if (this.currentUser.id !== 1) {
      //   let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
      //   const currentAuth = this.currentUser.auths[idx]
      //   if (type === 'edit' && currentAuth.hasUpdate === 0) result = false
      //   if (type === 'delete' && currentAuth.hasDelete === 0) result = false
      // }
      condition = !((scope.row.mainStatus === 1 || scope.row.mainAcct === 1 || scope.row.del === false) && lbl === '删除')
      return result && condition
    }
  }
}
</script>
<style scoped>
.row{
  align-items: center;
}
.row-button{
  padding: 0 3px;
  margin: 0 2px;  
  cursor: pointer;
}
.tab-row{
  justify-content: space-around;
}
</style>

