<template lang="pug">
  .content
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      .text-left 已选择 {{checkTotal}} 位联系人
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
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable,
      searchForm
    },
    data () {
      return {
        searchFormItems: [
          [{label: '姓名', model: 'name', type: 'text', placeholder: '请输入姓名', val: ''},
            {label: '手机号', model: 'phone', type: 'text', placeholder: '请输入手机号', val: ''},
            {label: '联系人类型', model: 'mainStatus', type: 'select', placeholder: '请选择联系人类型', val: '', list: []}],
          [{label: '所属客户', model: 'compName', type: 'text', placeholder: '请输入所属客户', val: ''},
          {label: '地区', model: 'region', type: 'text', placeholder: '请选择地区', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请输入业务部门', val: ''}],
          [{label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''},
          {label: '业务关系', model: 'busiRelation', type: 'select', placeholder: '请选择业务关系', val: '客户', list: []},
          {label: '客户类型', model: 'mark', type: 'select', placeholder: '请选择客户类型', val: '2', list: []}],
          [{label: '客户性质', model: 'customProperty', type: 'select', placeholder: '请选择客户性质', val: '', list: []},
          {label: '客户等级', model: 'level', type: 'select', placeholder: '请选择客户等级', val: '', list: []},
          {label: '未开单天数', model: 'billDate', type: 'select', placeholder: '请选择未开单天数', val: '', list: []}],
          [{label: '上线情况', model: 'xyMark', type: 'select', placeholder: '请选择上线情况', val: '', list: []}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: [{
            lbl: '姓名',
            prop: 'name'
          },{
            lbl: '手机号',
            prop: 'linkPhone',
            width: 120
          },{
            lbl: '业务员',
            prop: 'acctName',
            width: 130
          },{
            lbl: '业务部门',
            prop: 'dptName',
            width: 200
          },{
            lbl: '所属地区',
            prop: 'region',
            width: 120
          },{
            lbl: '所属客户',
            prop: 'compName'
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
        currentPage: 1,
        totalCount: 0,
        pageSize: 5,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        checkTotal: 0,
        loading: false
      }
    },
    props: {
      close: {
        type: Function,
        require: true
      },
      rowAdd: {
        type: Function,
        require: true
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr,
        customerMarkOpts: state => state.customerMarkOpts,
        customPropertyOpts: state => state.customPropertyOpts,
        levelOpts: state => state.levelOpts,
        billDateOpts: state => state.billDateOpts,
        mainStatusTypeOpts: state => state.mainStatusTypeOpts,
        busiRelationOpts: state => state.busiRelationOpts,
        xyMarkList: state => state.xyMarkList
      })
    },
    mounted () {      
      this.$nextTick(() =>{
        this.searchFormItems[0][2].list = this.mainStatusTypeOpts
        this.searchFormItems[2][1].list = this.busiRelationOpts
        this.searchFormItems[2][2].list = this.customerMarkOpts
        this.searchFormItems[3][0].list = this.customPropertyOpts
        this.searchFormItems[3][1].list = this.levelOpts
        this.searchFormItems[3][2].list = this.billDateOpts
        this.searchFormItems[4][0].list = this.xyMarkList
        this.queryObject = {
            currentPage: this.currentPage - 1,
            mark: '2',
            busiRelation: '客户',
            pageSize: 5
          }
        this.loadData()
      })
    },
    methods: {
      searchForm (paramsObj) {
        this.currentPage = 1
        this.queryObject['currentPage'] = this.currentPage - 1
        for (let key in paramsObj) {
          if (paramsObj[key].trim() != '') {
            this.queryObject[key] = paramsObj[key]
          } else {
            delete this.queryObject[key] 
          }          
        }
        this.loadData()
      },
      selectData (val) {        
        this.chooseArray = val
        if (val.length !== undefined) {
          this.outLinkerIdsData = []
          this.checkTotal = val.length
          val.map((item) => {
            this.outLinkerIdsData.push(item.id)
          })
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        try {
          this.queryObject['uid'] = this.currentUser.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/linker', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = this.dataFilter(data.list)          
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
        // let key = ['linkName', 'linkPhone', 'mainStatus','createAt','updateAt','compName','mark','region','busiName','acctName','dptName','proName','billDate','summaryLevel']
        let key = ['linkName', 'linkPhone', 'acctName','dptName','region','compName','mainStatus']
        let arr = []
        dataList.map((item) => {
          let obj = {}
          for (let i=0;i<item.length;i++) {
            obj[key[i]] = item[i]
          }
          obj['name'] = obj['linkName']
          arr.push(obj)
        })
        return arr
      },
      toggleSelection () {
        this.selectClose()
        let table = this.$refs.table.$refs.multipleTable;
        for (let i=0;i<table['tableData'].length; i++) {
          table.toggleRowSelection(table['tableData'][i]);
        }
      },
      selectClose () {
        this.$refs.table.$refs.multipleTable.clearSelection();
      },
      tableRowAdd (row) {
        this.$emit('rowAdd', row)
      },
      tablePageAdd () {
        let table = this.$refs.table.$refs.multipleTable;
        this.$emit('pageAdd', table.selection)
      },
      tableAllAdd () {
        let params = {}
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
          params['uid'] = this.currentUser.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/linkerAll', params: params})
          if (data.returnCode === 0) {
            let arr = this.dataFilter(data.list)
            this.toggleSelection()
            this.checkTotal = data.total
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
      },
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