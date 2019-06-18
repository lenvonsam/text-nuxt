<template lang="pug">
erplr-panel(:right-padding="false")
  div(slot="left")
    left-search(:formItem="searchFormItems", :searchEvent="searchForm", ref="search", :labelWidth="'90px'")
  .erp-content(slot="right")
    basic-elx-table(
      :tableValue="tableValue",
      :total="totalCount",
      :currentPage="currentPage",
      :pageSize="pageSize",     
      @paginateChange="tableChange",      
      @rowSelection="rowSelection")    
</template>

<script>
  import { mapState } from 'vuex'
  import erplrPanel from '~/components/erplrPanel'
  import basicElxTable from '~/components/basicElxTable'
  import leftSearch from '~/components/leftSearch'  
  export default {
    layout: 'backend',
    components: {      
      basicElxTable,
      erplrPanel,
      leftSearch
    },
    data () {
      return {       
        searchFormItems: [
          {lbl: '数据类型', prop: 'deptName', val: '', type: 'select', placeholder:'请选择数据类型', list: []},
          // {lbl: '开始日期', prop: 'deptName', val: '', placeholder:'请选择开始日期'},
          // {lbl: '结束日期', prop: 'deptName', val: '', placeholder:'请选择结束日期'},
          // {lbl: '对方账号', prop: 'deptName', val: '', placeholder:'请输入对方账号'},
          // {lbl: '对方公司名', prop: 'deptName', val: '', placeholder:'请输入对方公司名'},
          // {lbl: '交易金额', prop: 'deptName', val: '', placeholder:'请输入交易金额'},
          // {lbl: '交易金额', prop: 'deptName', val: '', placeholder:'收款公司名'}
        ],        
        tableValue: {          
          hasCbx: true,
          showRowIndex: true,
          tableHead: [
            {lbl: '编号', prop: 'deptCode', width: '100px'},
            {lbl: '交易日期', prop: 'deptName', width: '100px'},
            {lbl: '交易时间', prop: 'deptManager'}, 
            {lbl: '交易金额', prop: 'deptRemark'}, 
            {lbl: '对方账号', prop: 'deptRemark'}, 
            {lbl: '对方公司名', prop: 'deptRemark'}, 
            {lbl: '对方开户行', prop: 'deptRemark'},
            {lbl: '收款公司名', prop: 'deptRemark'},
            {lbl: '备注内容', prop: 'deptRemark'}
          ],
          tableData: []
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        },
        tableSelect: []
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    mounted () {
      this.$nextTick(()=>{
        this.queryObject = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        this.loadData()
      })
    },
    methods: {
      rowSelection (row) {
        this.tableSelect = row
      },
      tableChange (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage
        this.loadData()
      },
      searchForm (values) {
        for (const key in values) {
          this.queryObject[key] = values[key]
          if (!this.queryObject[key]) {
            delete this.queryObject[key]
          }
        }
        this.loadData()       
      },
      async loadData () {
        try {
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/dpt', 'get', this.queryObject)
          if (data.return_code === 0) {
            if (this.searchFormItems[0].list.length === 0) {
              this.searchFormItems[0].list = data.list
            }            
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          }
        } catch (e) {
          console.error(e)
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