<template lang="pug">
  div
    el-button-group(v-if="tableValue.topBtns")
      template(v-for="btn in tableValue.topBtns")
        el-button(type="primary", size="small", icon="el-icon-plus", @click="actionBtns(btn)", v-if="btn.type === 'create'") 新增
        el-button(type="primary", size="small", icon="el-icon-edit", @click="actionBtns(btn)", v-else-if="btn.type === 'edit'") 编辑
        el-button(type="primary", size="small", icon="el-icon-delete", @click="actionBtns(btn)", v-else-if="btn.type === 'del'") 删除
        el-button(type="primary", size="small", icon="el-icon-refresh", @click="actionBtns(btn)" v-else-if="btn.type === 'refresh'") 刷新
        el-button(v-else, type="primary", size="small", :icon="btn.icon", @click="actionBtns(btn)") {{btn.text}}    
    elx-editable.mt-15(ref="basicEditable", 
      :data.sync="tableValue.tableData", 
      size="small", 
      border, 
      :edit-config="{trigger: 'dblclick', mode: 'row'}", 
      :edit-rules="tableValue.validRules || null", 
      show-all-overflow, 
      @selection-change="handleSelectionChange", 
      @blur-active="cellEdit")
      elx-editable-column(type="selection", width="40", v-if="tableValue.hasCbx")
      elx-editable-column(type="index", width="40", v-if="tableValue.showRowIndex")
      template(v-for="column in tableValue.tableHead")
        elx-editable-column(:prop="column.prop", :width="column.width? column.width : ''", :label="column.lbl", :edit-render="column.noedit ? null : {name: 'ElDatePicker'}", v-if="column.type == 'date'")
        elx-editable-column(:prop="column.prop", :width="column.width? column.width : ''", :label="column.lbl", :edit-render="column.noedit ? null : {name: 'ElInput'}", v-else)
    .mt-15.text-right
      el-pagination(background, layout="prev, pager, next, jumper", :total="pgTotal", :page-size="pageSize", :current-page="currentPage", @current-change="pgChange")
    el-dialog(ref="dialog", :title="dialogConfig.title", :visible.sync="dialogConfig.show")
      el-form(ref="dialogForm", :model="tableValue.dialogModel", :inline="true", :label-width="dialogConfig.labelWidth")
        el-form-item(v-for="item in tableValue.editForm", :prop="item.rules ? item.prop : ''", :rules="item.rules" :label="item.lbl", :key="item.prop")
          template(slot-scope="scope")
            el-input(v-model="tableValue.dialogModel[item.prop]", size="small")
      .dialog-footer(slot="footer")
        el-button(@click="dialogHandler('cancel')", size="small") 取消
        el-button(@click="dialogHandler('sure')", type="primary", size="small") 确定
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
      default: null
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
      rowSelection: []  
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
  },
  methods: {
    cellEdit(row, cell, idx, event) {
      this.$emit('rowEditInfo', row)
    },
    handleSelectionChange(val) {
      this.rowSelection = val
      this.$emit('rowSelection', val)
    },
    actionBtns(btn) {
      const me = this  
      switch (btn.type) {
        case 'create':
          me.dialogConfig.show = true
          break
        case 'edit':
          if (me.rowSelection.length  === 0) {
            me.$message.error('请选择需要编辑的数据')
            return false
          }
          me.tableValue.dialogModel = me.rowSelection[me.rowSelection.length - 1]
          me.dialogConfig.title = '编辑'
          me.dialogConfig.show = true
          break
        case 'del':
          if (me.rowSelection.length  === 0) {
            me.$message.error('请选择需要删除的数据')
            return false
          }
          me.confirmDialog(me, '您确认要删掉本行记录吗？')
          break
        case 'refresh':
          break
        default:
          this.$emit('handleTopActions', btn.type)
      }
      if (btn.handler) {
        btn.handler()
      }      
    },
    pgChange(val) {
      this.$emit('paginateChange', val)
    },
    dialogHandler(type) {
      const me = this
      if (type === 'sure') {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            if (me.tableDialogFun(this.tableValue.dialogModel)) {
              this.dialogConfig.show = false
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        this.dialogConfig.show = false
      }
    }
  }
}
</script>
