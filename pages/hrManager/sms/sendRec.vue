<template lang="pug">
erplr-panel(:right-padding="false")
  div(slot="left")
    el-collapse(accordion, v-model="collapseName")
      el-collapse-item.slot-left(title="查询", name="1")
        left-search(:formItem="searchFormItems", :labelWidth="'90px'",  :searchEvent="searchForm", ref="search")
  .erp-content(slot="right")
    button-group(:btns="buttonGroupInfo", @groupBtnClick="buttonGroupClick")
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
  import buttonGroup from '~/components/buttonGroup.vue'  
  import erplrPanel from '~/components/erplrPanel'
  import basicElxTable from '~/components/basicElxTable'
  import leftSearch from '~/components/leftSearch'  
  export default {
    layout: 'backend',
    components: {      
      basicElxTable,
      erplrPanel,
      leftSearch,
      buttonGroup
    },
    data () {
      return {
        collapseName: ['1'],
        buttonGroupInfo: [
          {lbl: '刷新', type: 'refresh', icon: 'el-icon-refresh'}
        ],                     
        searchFormItems: [
          {lbl: '开始时间', type:'datetime', prop: 'createAtStart', val: '', placeholder:'请选择开始时间'},
          {lbl: '结束时间', type:'datetime', prop: 'createAtEnd', val: '', placeholder:'请选择结束时间'},
          // {lbl: '提交时间', prop: 'createAt', type:'datetimerange', val: '', placeholder:'请选择发送类型'},
          {lbl: '发送批号', prop: 'id', val: '', placeholder:'请输入发送批号'},
          {lbl: '操作人', prop: 'acctName', val: '', placeholder:'请输入操作人姓名'},
          {lbl: '发送类型', prop: 'type', val: '', placeholder:'请选择发送类型'},
          {lbl: '状态', prop: 'status', val: '', placeholder:'请选择状态'},
          {lbl: '接收人姓名', prop: 'name', val: '', placeholder:'请输入接收人姓名'},
          {lbl: '接收手机', prop: 'phone', val: '', placeholder:'请输入接收手机'},          
          {lbl: '发送内容', prop: 'content', val: '', placeholder:'请选择发送类型'}
        ],        
        tableValue: {
          showRowIndex: true,
          tableHead: [
            {lbl: '发送批号', prop: 'id', width: '100px'},
            {lbl: '操作人', prop: 'acctName', width: '100px'},
            {lbl: '提交时间', prop: 'createAt'},
            {lbl: '定时时间', prop: 'taskSendTime'},
            {lbl: '手机号', prop: 'mobile'},
            {lbl: '发送内容', prop: 'content'},
            {lbl: '收信人数', prop: 'content'},
            {lbl: '状态', prop: 'statusStr'}
          ],
          tableData: []
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        },
        loading: false,
        dialogShow: false,
        smsTemplate: {groupName: '', groupId: '', name: '', content: ''},
        copySmsTemplate: {},
        dialogTitle: '新增模板',
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
      buttonGroupClick (type) {
        this.$refs.search.searchHandler()
        // this.loadData().then(() => {
        //   this.$message.success('刷新成功')
        // })
      },
      async loadData () {
        try {
          const { data } = await this.proxy(this, 'extra-server/v1/message', 'get', this.queryObject)
          if (data.return_code === 0) {
            this.tableValue.tableData = data.data
            this.tableValue.tableData.map((item) => {
              if (!item.acctName) item.acctName = '--'
              item.statusStr = (item.status === 1) ? '发送中' : (item.status === 2) ? '全部成功' : (item.status === 3) ? '发送失败' : (item.status === 0) ? '定时发送' : '已取消'
            })
            this.totalCount = data.total_page
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