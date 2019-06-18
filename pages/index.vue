<template lang="pug">
no-ssr
  .padding
    h1 123
    el-button(@click="$refs.elxEditable.insert()") 新增
    elx-editable(border, :edit-config="{trigger: 'dblclick'}", :data.sync="list", @selection-change="handleSelectionChange",ref="elxEditable", @blur-active="cellEdit")
      elx-editable-column(type="index", width="55")
      elx-editable-column(prop="name", label="名字", min-width="300", :edit-render="{name: 'ElInput'}")
      elx-editable-column(prop="code", label="编号", min-width="300")
</template>

<script>
// import XEUtils from 'xe-utils'
// import XEAjax from 'xe-ajax'
// import { MessageBox, Message } from 'element-ui'

export default {
  middleware: 'indexJump',
  data() {
    return {
      loading: false,
      list: [],
      multipleSelection: [],
      sexList: [],
      regionList: [],
      isClearActiveFlag: true
    }
  },
  beforeMount() {
    this.loadDptData()
  },
  methods: {
    cellEdit(row, cell, idx, event) {
      console.log('cell edit')
      console.log(row)
      console.log(cell)
      console.log(idx)
      console.log(event)
    },
    async loadDptData() {
      try {
        const { data } = await this.apiStreamPost('/proxy/common/get', {
          url: 'basicInfo/dpt?currentPage=1&pageSize=8'
        })
        console.log(data)
        if (data.return_code === 'SUCCESS') {
          this.list = data.list
        }
      } catch (e) {
        console.error(e)
      }
    },
    handleSelectionChange(val) {
      console.log('val:>>', val)
    },
    insertEvent() {
      const activeInfo = this.$refs.elxEditable.getActiveRow()
      const { insertRecords } = this.$refs.elxEditable.getAllRecords()
      console.log(
        'activeinfo:>>',
        activeInfo,
        '; insert records:>>',
        insertRecords
      )
      // if (!activeInfo && !insertRecords.length) {
      //   this.$refs.elxEditable
      //     .insert({
      //       name: `New ${Date.now()}`,
      //       age: 26,
      //       rate: 2
      //     })
      //     .then(({ row }) => {
      //       this.$refs.elxEditable.setActiveRow(row)
      //     })
      // }
    }
  }
}
</script>

<style>
.scroll-table1-oper {
  margin-bottom: 18px;
}
.scroll-table1.elx-editable .elx-editable-row.new-insert,
.scroll-table1.elx-editable .elx-editable-row.new-insert:hover > td {
  background-color: #f0f9eb;
}
</style>
