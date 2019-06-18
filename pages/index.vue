<template lang="pug">
div test
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
