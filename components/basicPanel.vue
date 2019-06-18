<template lang="pug">
a-layout
  a-layout-sider.border-right-line.bg-f9(v-if="basicPanel.leftSider", width="250", collapsible, :collapsedWidth="0", v-model="collapsed")
    .flex.flex-center.p-10
      .col {{basicPanel.leftSider.title}}
      a-icon.trigger(:type="collapsed ? 'menu-unfold' : 'menu-fold'", @click="collapsedHandler")
    .bg-white.p-10.sider-content-height
      template(v-if="basicPanel.leftSider.type === 'tree'")
        .flex.flex-center.flex-content-between.mt-10
          a-button(icon="plus", size="small") 增加
          a-button(icon="edit", size="small") 修改
          a-button(icon="delete", size="small") 删除
        .sider-tree
          a-directory-tree(multiple, defaultExpandAll, @select="onSelect", @expand="onExpand")
            a-tree-node(title="集团", key="0-0")
              a-tree-node(title="leaf 0-0", key="0-0-0")
                a-tree-node(title="leaf 0-0-0", key="0-0-0-0", isLeaf)
              a-tree-node(title="leaf 0-0", key="0-0-1", isLeaf)
            a-tree-node(title="parent 1", key="0-1")
              a-tree-node(title="leaf 1-0", key="0-1-0", isLeaf)
              a-tree-node(title="leaf 1-0", key="0-1-1", isLeaf)
      template(v-else-if="basicPanel.leftSider.type === 'search'")
        a-form
          a-form-item(v-for="item in basicPanel.leftSider.formItem", :key="item.lbl", :label="item.lbl", :label-col="item.lblCol ? item.lblCol : {span: 8}", :wrapper-col="item.wrapperCol ? item.wrapperCol : {span: 16}")
            a-input(:type="item.type ? item.type : 'text'")
        a-button-group.flex.flex-content-center
          a-button(type="primary", icon="search") 查询
          a-button(icon="reload") 重置
  a-layout-content.p-10.bg-white.box-sizing
    .flag-panel(v-if="basicPanel.buttonGroup")
      a-button-group
        template(v-for="item in basicPanel.buttonGroup")
          a-popconfirm(v-if="item.popconfirm", :title="item.popconfirm.title", :visible="delConfirmShow" @confirm="confirm", @cancel="cancel", okText="确认", cancelText="取消")
            a-button(:icon="item.icon", type="primary", @click="showModal(item)") {{item.text}}
          a-button(v-else, :icon="item.icon", type="primary", @click="showModal(item)") {{item.text}}          
    .content.mt-15(ref="content")
      a-table(size="small", :scroll="basicPanel.panelScroll ? basicPanel.panelScroll : scroll", :rowSelection="{type: basicPanel.rowSelection.type, columnWidth:40, fixed:true, selectedRowKeys: selectedRowKeys, onChange: onSelectChange}", :pagination="pagination" :columns="basicPanel.columns", :dataSource="basicPanel.data", bordered, :rowKey="basicPanel.rowKey")      
        template(v-for="col in dataIndexList", :slot="col", slot-scope="text, record, index")
          .full-width(:key="col")
            a-input(:value="text", v-model="record[col]", style="margin: -5px 0", v-if="editCol === col && editIdx === index", @change="e => handleChange(e.target.value, record.key, col)")
            template(v-else) 
              .full-width(@click="tableClick(text, record, index)", @dblclick="dbTableClick(col, record, index)") {{text ? text : '-'}}
      //- a-pagination.mt-10(:itemRender="itemRender", :defaultCurrent="pagination.current", :defaultPageSize="pagination.pageSize", showSizeChanger, showQuickJumper, :total="pagination.total", :showTotal="total => `共 ${total} 条数据`")
  a-modal(:title="titleModal", :width="1100", :visible="modalShow", @ok="handleOk", :confirmLoading="confirmLoading", @cancel="handleCancel")
    a-form(:form="form")
      a-row(:gutter="24")
        a-col(v-for="(item, index) in basicPanel.formItem", :key="index", :span="item.col ? item.col : 8")
          a-form-item(:label="item.lbl", :label-col="{ span: item.labelCol ? item.labelCol : 7 }", :wrapper-col="{ span: (24 - (item.labelCol ? item.labelCol : 7)) }")            
            a-select(v-decorator="item.decorator", showSearch, v-if="item.type == 'select'")
              a-select-option(v-for="(sItem, index) in item.list", :value="sItem.code", :key="index") {{sItem.name}}
            a-radio-group(v-else-if="item.type == 'radio'", name="radioGroup", :defaultValue="item.defaultValue")
              a-radio(v-for="(sItem, index) in item.list", :value="sItem.code", :key="index") {{sItem.name}}
            a-date-picker(v-else-if="item.type == 'date'", placeholder="请选择日期", @change="onDateChange")
            a-input(v-decorator="item.decorator", v-else)
</template>
<script>
const showTotalTemplate = total => {
  return '共' + total + '条数据'
}
export default {
  // layout: 'backend',
  props: {
    basicPanel: {
      type: Object,
      required: true
    },
    cb: {
      type: Function,
      required: true
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      editCol: '',
      editIdx: null,
      delConfirmShow: false,
      scroll: { x: 0, y: 600 },
      alertShow: false,
      titleModal: '新增机构',
      modalShow: false,
      formLayout: 'horizontal',
      form: null,
      confirmLoading: false,
      pagination: {
        // simple: true,
        size: 'small',
        defaultCurrent: 1,
        total: 0,
        defaultPageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: true,
        showTotal: showTotalTemplate
      },
      collapsed: false,
      selectedRowKeys: [],
      selectedRows: [],
      dataIndexList: []
    }
  },
  beforeMount() {
    console.log('org form:>>.', this.$form)
    this.form = this.$form.createForm(this)
    this.pagination.total = this.total
    const dataIndexList = []
    this.basicPanel.columns.map(item => {
      const customRender = item.dataIndex
      dataIndexList.push(customRender)
      // item.edit = false
      item.scopedSlots = {}
      item.scopedSlots.customRender = customRender
    })
    console.log(dataIndexList)
    this.dataIndexList = dataIndexList
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.basicPanel.panelScroll) {
        this.basicPanel.columns.map(item => {
          this.scroll.x += item.width
        })
        console.log('scroll.x:' + this.scroll.x)
        if (this.scroll.x < this.$refs.content.offsetWidth) {
          this.scroll.x = this.$refs.content.offsetWidth
          // delete this.scroll.x
        }
        // this.scroll.x = this.scroll.x - 62
        console.log(this.$refs.content.offsetWidth)
      }
      this.scroll.y = this.$refs.content.offsetHeight - 104
      this.$forceUpdate()
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    collapsedHandler() {
      this.collapsed = !this.collapsed
    },
    onSelect(keys) {
      console.log('Trigger Select', keys)
    },
    onExpand() {
      console.log('Trigger Expand')
    },
    showModal(item) {
      switch (item.type) {
        case 'edit':
          if (this.selectedRowKeys.length > 0) {
            this.modalShow = true
            const formVal = this.selectedRows[0]
            console.log(formVal)
            setTimeout(() => {
              this.form.setFieldsValue(formVal)
            }, 100)
          } else {
            this.$message.warning('请选择需要操作的数据')
            return false
          }
          this.titleModal = item.text
          break
        case 'add':
          this.titleModal = '新增'
          this.modalShow = true
          break
        case 'del':
          if (this.selectedRowKeys.length > 0) {
            this.delConfirmShow = true
          } else {
            this.$message.warning('请选择需要删除的数据')
          }
          break
        case 'reload':
          console.log('reload')
          break
      }
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          setTimeout(() => {
            this.modalShow = false
            this.confirmLoading = false
          }, 2000)
          // this.form.getForm()
          console.log('Received values of form: ', values)
        }
      })
      // this.ModalText = 'The modal will be closed after two seconds';
    },
    handleCancel(e) {
      e.preventDefault()
      console.log('Clicked cancel button')
      this.form.resetFields()
      this.modalShow = false
    },
    confirm(e) {
      console.log(e)
      this.delConfirmShow = false
      this.cb('edit')
    },
    cancel(e) {
      console.log(e)
      this.delConfirmShow = false
      // this.$message.error('Click on No')
    },
    onDateChange(val) {
      console.log(val)
    },
    tableClick(text, record, index) {
      const me = this
      if (me.basicPanel.rowSelection.type === 'radio') {
        this.selectedRowKeys = [record[me.basicPanel.rowKey]]
        this.selectedRows = [record]
      } else {
        this.selectedRowKeys.push(record[me.basicPanel.rowKey])
        this.selectedRows.push(record)
      }
    },
    dbTableClick(col, record, index) {
      console.log('---------1')
      this.editCol = col
      this.editIdx = index
    },
    handleChange(value, key, column) {
      const newData = [...this.basicPanel.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.basicPanel.data = newData
      }
    }
  }
}
</script>
<style>
.sider-content-height {
  height: calc(100vh - 142px);
}
.box-sizing {
  box-sizing: border-box;
}
.content {
  height: calc(100vh - 175px);
}
</style>
