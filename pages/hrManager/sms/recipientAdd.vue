<template lang="pug">
  .content
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", ref="table", @tableRowAdd="tableRowAdd")
    .mt-5.text-center
      el-button(type="", size="small", @click="toggleSelection") 选择当前页
      el-button(type="", size="small", @click="selectClose") 取消选择
      el-button(type="", size="small", @click="tableAllAdd") 添加全部
      el-button(type="primary", size="small" @click="tablePageAdd") 添加
      el-button(type="", size="small", @click="close") 关闭
</template>

<script>
  import { mapState } from 'vuex'
  import basicTable from '~/components/basicTable.vue'
  import searchForm from '~/components/searchForm.vue'  
  export default {
    layout: 'backend',
    components: {
      basicTable,
      searchForm
    },
    props: {
      close: {
        type: Function,
        default: () => {}
      },
      rowAdd: {
        type: Function,
        default: () => {}
      }
    },
    data () {
      return {
        searchFormItems: [
          [{label: '姓名', model: 'name', type: 'text', placeholder: '请输入姓名', val: ''},
            {label: '手机号', model: 'phone', type: 'text', placeholder: '请输入手机号', val: ''},
            {label: '标签', model: 'label', type: 'text', placeholder: '请输入标签', val: ''}],
          [{label: '备注', model: 'remark', type: 'text', placeholder: '请输入备注', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: [{
            lbl: '姓名',
            prop: 'name',
            width: 100
          }, {
            lbl: '手机号',
            prop: 'phone',
            width: 120
          }, {
            lbl: '标签',
            prop: 'label'
          }, {
            lbl: '备注',
            prop: 'remark',
            width: 200
          }, {
            type: 'action',
            width: '60px',
            fixed: 'right',
            actionBtns: [{
              lbl: '添加',
              type: 'add'
            }]
          }]
        },
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: false
      }
    },    
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    mounted () {      
      this.$nextTick(() =>{
        this.queryObject = {
            currentPage: this.currentPage - 1,
            pageSize: 5
          }
        this.loadData()
      })
    },
    methods: {
      searchForm (paramsObj) {
        this.queryObject.currentPage = 0
        for (const key in paramsObj) {
          if (paramsObj[key].trim() !== '') {
            this.queryObject[key] = paramsObj[key]
          } else {
            delete this.queryObject[key] 
          }          
        }
        this.loadData()
      },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        try {
          const { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/outLinker', params: this.queryObject})
          if (data.returnCode === 0) {
            console.log(data)
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      dataFilter (dataList) {
        const key = ['linkName', 'linkPhone', 'mainStatus','createAt','updateAt','compName','mark','region','busiName','acctName','dptName','proName','billDate','summaryLevel']
        const arr = []
        dataList.map((item) => {
          const obj = {}
          for (let i=0;i<item.length;i++) {
            obj[key[i]] = item[i]
          }
          obj.name = obj.linkName
          arr.push(obj)
        })
        return arr
      },
      toggleSelection () {
        const table = this.$refs.table.$refs.multipleTable;
        for (let i=0;i<table.tableData.length; i++) {
          table.toggleRowSelection(table.tableData[i]);
        }        
      },
      selectClose () {
        this.$refs.table.$refs.multipleTable.clearSelection();
      },
      tableRowAdd (row) {
        this.$emit('rowAdd', row)
      },
      tablePageAdd () {
        const table = this.$refs.table.$refs.multipleTable;
        this.$emit('pageAdd', table.selection)
      },
      tableAllAdd () {
        const params = {}
        this.searchFormItems.map((row) => {
          row.map((item) => {
            if (item.val !== '') {
              params[item.model] = item.val
            }
          })
        })
        this.loadAllData(params)
      },
      async loadAllData (params) {
        try {
          const { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/outLinkerAll', params: params})
          if (data.returnCode === 0) {
            const arr = data.list
            this.$emit('allAdd', arr)
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      }
    }
  }
</script>
<style>
  .baidu-map{
    width: 100%;
    height: 550px;
  }
  .bm-serch{
  }
</style>