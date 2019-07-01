<template lang="pug">
erplr-panel(:right-padding="false")
  div(slot="left")
    el-collapse(accordion, v-model="collapseName")
      el-collapse-item.slot-left(title="查询", name="1")
        left-search(:formItem="this.activeTab === 'abc' ? hxSearchFormItems : hxSearchFormItems", :searchEvent="searchForm", ref="search", :labelWidth="'90px'")
  .erp-content(slot="right")
    el-tabs(v-model="activeTab", type="border-card", @tab-click="handleTabHandler")
      el-tab-pane(label="农行", name="abc")
        basic-elx-table(
          :loading="tabloading"
          :tableValue="tableValue",
          :total="totalCount",
          :currentPage="currentPage",
          :pageSize="pageSize",     
          @paginateChange="tableChange",      
          @rowSelection="rowSelection")
      el-tab-pane(label="华夏", name="hx")
        basic-elx-table(
          :tableValue="hxTableValue",
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
        collapseName: ['1'],
        activeTab: 'abc',    
        tabloading: true,
        searchFormItems: [          
          {lbl: '开始日期', prop: 'startDate', val: '', type: 'date', placeholder:'请选择开始日期'},
          {lbl: '结束日期', prop: 'endDate', val: '', type: 'date', placeholder:'请选择结束日期'},
          {lbl: '对方账号', prop: 'oppAccNo', val: '', placeholder:'请输入对方账号'},
          {lbl: '对方公司', prop: 'oppName', val: '', placeholder:'请输入对方公司名'},
          {lbl: '交易金额', prop: 'amt', val: '', placeholder:'请输入交易金额'},
          {lbl: '收款公司名', prop: 'accName', val: '', placeholder:'收款公司名'}
        ],
        hxSearchFormItems: [          
          {lbl: '开始日期', prop: 'startDate', val: '', type: 'date', placeholder:'请选择开始日期'},
          {lbl: '结束日期', prop: 'endDate', val: '', type: 'date', placeholder:'请选择结束日期'},
          {lbl: '对方账号', prop: 'oppAccNo', val: '', placeholder:'请输入对方账号'},
          {lbl: '对方公司', prop: 'oppName', val: '', placeholder:'请输入对方公司名'},
          {lbl: '交易金额', prop: 'amt', val: '', placeholder:'请输入交易金额'},
          {lbl: '收款账号', prop: 'zhdAcctNo', val: '', placeholder:'收款收款账号'}
        ],        
        tableValue: {        
          hasCbx: false,
          showRowIndex: false,
          tableHead: [
            {lbl: '编号', prop: 'id', width: '45px'},
            {lbl: '交易日期', prop: 'trDate', width: '80px'},
            {lbl: '交易时间', prop: 'timeStab', width: '80px',  formatter: (row, column, cellValue, index) => {
              return cellValue ? cellValue.substr(8, 2) + ':' + cellValue.substr(10,2) + ':' + cellValue.substr(12,2) : null
            }}, 
            {lbl: '交易金额', prop: 'amt', width: '120px'}, 
            {lbl: '对方账号', prop: 'oppAccNo', width: '200px'}, 
            {lbl: '对方公司名', prop: 'oppName', width: '200px'}, 
            {lbl: '对方开户行', prop: 'oppBkName', width: '230px'},
            {lbl: '收款公司名', prop: 'accName', width: '220px'},
            {lbl: '备注', prop: 'postScript'}
          ],
          tableData: []
        },
        hxTableValue: {        
          hasCbx: false,
          showRowIndex: false,
          tableHead: [
            {lbl: '编号', prop: 'id', width: '45px'},
            {lbl: '交易日期', prop: 'transDate', width: '80px'},
            {lbl: '交易时间', prop: 'transTime', width: '80px'},
            {lbl: '交易金额', prop: 'amount', width: '120px'}, 
            {lbl: '对方账号', prop: 'acctNo', width: '200px'}, 
            {lbl: '对方公司名', prop: 'acctName', width: '200px'}, 
            {lbl: '对方开户行', prop: 'acctBank', width: '230px'},
            {lbl: '收款账号', prop: 'zhdAcctNo', width: '200px'},
            {lbl: '会计流水', prop: 'serial', width: '70px'},
            {lbl: '企业端流水号', prop: 'cropSerial', width: '95px'}
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
        // zhdAcctList: state => state.zhdAcctList
      })
    },
    mounted () {
      // this.searchFormItems[0].list = this.zhdAcctList
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
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage
        for (const key in values) {
          if ((key  === 'startDate' || key === 'endDate') && values[key]) {
            this.queryObject[key] = values[key].replace(/-/g, '')
          } else {
            this.queryObject[key] = values[key]
          }
          if (!this.queryObject[key]) {
            delete this.queryObject[key]
          }          
        }
        this.loadData()       
      },
      handleTabHandler (tab, event) {
        this.activeTab = tab.name
        this.currentPage = 1
        this.queryObject = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        this.$refs.search.resetForm()
        this.loadData()
      },
      async loadData () {
        this.tabloading = true
        try {          
          const url = 'extra-server/v1/bankpay/' + this.activeTab
          const { data } = await this.proxy(this, url, 'post', this.queryObject)
          if (data.return_code === 0) {
            this.tableValue.tableData = data.list
            this.totalCount = data.total
            if (this.activeTab === 'hx') {
              this.hxTableValue.tableData = data.list
            }
          }          
        } catch (e) {
          console.error(e)
        }
        this.tabloading = false
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