<template lang="pug">
  div
    elx-table.mt-15(ref="basicEditable", 
      :data.sync="tableValue.tableData", 
      size="small", 
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
                template(v-for="(btn, index) in head.actionBtns", v-if="canShowRowBtn(btn.type, scope, btn.lbl) && scope.row['actionBtns']")                  
                  el-button(type="text", v-if="scope.row['actionBtns'][index] || btn.lbl", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row['actionBtns'][index] ? scope.row['actionBtns'][index] : btn.lbl}}
                template(v-else-if="canShowRowBtn(btn.type, scope, btn.lbl)")                             
                  el-button(type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.$index, scope.row, btn.type)") {{scope.row.btnLbl ? scope.row.btnLbl : btn.lbl}}
          template(v-else)
            elx-table-column(show-overflow-tooltip, 
              :formatter="head.formatter ? head.formatter : null", 
              :prop="head.prop",
              :width="head.width ? head.width : ''", 
              :min-width="head.minWidth? head.minWidth : ''", 
              :label="head.lbl")
    .mt-15.text-right
      el-pagination(background, layout="prev, pager, next, jumper", :total="pgTotal", :page-size="pageSize", :current-page="currentPage", @current-change="pgChange")
</template>

<script>
export default {
  props: {
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
  watch: {
    total(newVal, oldVal) {
      console.log('total newval:>', newVal)
      this.pgTotal = newVal
    }
  },
  beforeMount() {
    console.log('total:>>', this.total)
    this.pgTotal = this.total    
    this.tableHeight = (window.innerHeight - 250) + 'px'
    // this.tableHeight = (50 * this.pageSize) + 'px'
    window.addEventListener('resize', () => {
      this.tableHeight = (window.innerHeight - 250) + 'px'
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
      let result = true
      let condition = true
      // if (this.currentUser.id !== 1) {
      //   let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
      //   const currentAuth = this.currentUser.auths[idx]
      //   if (type === 'edit' && currentAuth.hasUpdate === 0) result = false
      //   if (type === 'delete' && currentAuth.hasDelete === 0) result = false
      // }
      condition = !((scope.row.mainStatus == 1 || scope.row.mainAcct == 1 || scope.row.del == false) && lbl == '删除')
      return result && condition
    }
  }
}
</script>
