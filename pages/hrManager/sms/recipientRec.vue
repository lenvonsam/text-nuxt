<template lang="pug">
erplr-panel
  div(slot="left")
    left-search(:formItem="searchFormItems", :labelWidth="'90px'",  :searchEvent="searchForm", ref="search")
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
        buttonGroupInfo: [
          {lbl: '新增', type: 'add', icon: 'el-icon-plus'},
          {lbl: '修改', type: 'edit', icon: 'el-icon-edit'},
          {lbl: '删除', type: 'del', icon: 'el-icon-delete'},
          {lbl: '刷新', type: 'refresh', icon: 'el-icon-refresh'}
        ],                     
        searchFormItems: [
          {lbl: '开始时间', type:'datetime', prop: 'createAtStart', val: '', placeholder:'请选择开始时间'},
          {lbl: '结束时间', type:'datetime', prop: 'createAtEnd', val: '', placeholder:'请选择结束时间'},
          {lbl: '短信ID', prop: 'id', val: '', placeholder:'请输入短信ID'},
          {lbl: '业务部门', prop: 'dptName', val: '', placeholder:'请输入业务部门'},
          {lbl: '业务员', prop: 'acctName', val: '', placeholder:'请输入业务员'},
          {lbl: '回复人', prop: 'name', val: '', placeholder:'请输入回复人'},
          {lbl: '回复客户', prop: 'cstmName', val: '', placeholder:'请输入回复客户'},          
          {lbl: '回复内容', prop: 'content', val: '', placeholder:'请输入回复内容'},          
          {lbl: '回复手机', prop: 'mobile', val: '', placeholder:'请输入回复手机'}
        ],        
        tableValue: {
          showRowIndex: true,
          tableHead: [
            {lbl: '短信ID', prop: 'id', width: '100px'},
            {lbl: '回复时间', prop: 'createAt', width: '100px'},
            {lbl: '回复内容', prop: 'content'},
            {lbl: '回复手机', prop: 'mobile'},
            {lbl: '手机号', prop: 'mobile'},
            {lbl: '回复人姓名', prop: 'name'}
          ],
          tableData: []
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          direction: 1
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
          pageSize: this.pageSize,
          direction: 1
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