<template lang="pug">
.content
  search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    el-table(ref="multipleTable", :data="tableData", v-loading="loading", border, @selection-change="selectData", @current-change="selectData")
      template(v-for="head in tableHead")
        el-table-column(v-if="head.type !== 'action'",:label="head.lbl", :width="head.width ? head.width : 'auto'", :min-width="head.minWidth? head.minWidth : 'auto'", :prop="head.prop", :align="head.align ? head.align : 'left'")
          template(slot-scope="scope")
            template(v-if="head.prop == 'content'")
              el-popover(trigger="hover", placement="top-start", width="500", :content="scope.row[head.prop]") 
                .ellps-row.full-width(slot="reference") {{scope.row[head.prop]}}
            template(v-else) 
              .ellps-row.full-width {{scope.row[head.prop] | rowData(head.prop)}}
      el-table-column(label="操作", width="150", fixed="right")
        template(slot-scope="scope")
          el-button(type="text", @click="handerRowBtnDetail(scope.row)") 查看详情
          el-button(type="text", @click="handerRowBtnCancel(scope.row)", v-if="scope.row['status'] == 4") 取消
    .padding.text-right
      el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="totalCount", @current-change="tableChange")
  el-dialog(:visible="dialogShow", width="1200px", :before-close="closeDialog")
    send-detail-list(:parentData="parentData", v-if="dialogShow", :tableValue="tableValue", :detailKey="detailKey")
</template>

<script>
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import sendDetailList from './sendDetailList.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable,
      searchForm,
      basicTable,
      sendDetailList
    },
    props: {
      searchFormItems: {
        type: Array,
        require: true
      },
      tableHead: {
        type: Array,
        require: true
      },
      mark: {
        type: String,
        default: '0'
      }
    },
    data () {
      return {
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: true,
        dialogShow: false,
        parentData: {},
        tableData: [],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: []
        },
        detailKey: [],
        popover: false
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    // beforeMount () {
      
    // },
    mounted () {
      if (this.mark == '0') {
        this.tableValue.tableHead = [{lbl: '短信ID', prop: 'msgId', width: 75},
        {lbl: '姓名', prop: 'linkName', width: 150},
        {lbl: '联系方式', prop: 'linkPhone', width: 120},
        {lbl: '类型', width: 100, prop: 'mainStatus', type: 'object', factValue (val) {return (val == 0) ? '子联系人' : '主联系人'}},
        {lbl: '所属客户',prop: 'compName'},
        {lbl: '状态', width: 100, prop: 'status', type:'object', factValue(val){return (val == 0) ? '发送成功' : (val == 1) ? '发送中' : (val == 2) ? '发送失败' : (val == 3) ? '定时发送' : '已取消'}}]
        this.detailKey = ['compName','linkName','linkPhone','parentId','status','msgId','createAt','updateAt','mainStatus']
      } else if (this.mark == '1') {
        this.tableValue.tableHead = [{lbl: '短信ID', prop: 'msgId'},
        {lbl: '姓名', prop: 'linkName'},
        {lbl: '联系方式', prop: 'linkPhone'},
        {lbl: '状态', prop: 'status', type:'object', factValue(val){return (val == 0) ? '发送成功' : (val == 1) ? '发送中' : (val == 2) ? '发送失败' : (val == 3) ? '定时发送' : '已取消'}}]
        this.detailKey = ['linkName','linkPhone','parentId','status','msgId','createAt','updateAt']
      }
      this.queryObject = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          mark: this.mark
        }
      this.loadData()
    },
    methods: {
      searchForm (paramsObj) {        
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        delete this.queryObject['startTime']
        delete this.queryObject['endTime']
        for (let key in paramsObj) {
          if (paramsObj[key] !== '' && paramsObj[key] !== null) {       
            if (key == 'createAt') {
              this.queryObject['startTime'] = paramsObj[key][0]
              this.queryObject['endTime'] = paramsObj[key][1]
            } else {
              this.queryObject[key] = paramsObj[key]  
            }
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
      handerRowBtnDetail (row) {
        this.parentData = row
        this.parentData['mark'] = this.queryObject.mark
        this.dialogShow = true
      },
      handerRowBtnCancel (row) {
        this.smsCancel(row.id).then(() => {
          this.loadData()
        })
      },
      async smsCancel (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'callCenter/smsCancel/' + id})
          if (data.returnCode === 0) {
            console.log(data)
            this.msgShow(this, '取消成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      closeDialog () {
        this.dialogShow = false
      },
      async loadData () {
        this.loading = true
        try {          
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/smsStatistic', params: this.queryObject})
          if (data.returnCode === 0) {
            let keyArr = ['id','acctName', 'createAt', 'updateAt', 'delayTime', 'content', 'sendCount', 'status', 'failureNum', 'phone']          
            let arr = []
            data.list.map((item)=>{
              let obj = {}
              for (let i=0;i<12;i++) {
                obj[keyArr[i]] = item[i]
                if (keyArr[i] == 'status') {
                  obj['statusStr'] = (obj['status'] == 1) ? '发送中' : (obj['status'] == 2) ? '全部成功' : (obj['status'] == 3) ? item[8] + '发送失败' : (obj['status'] == 4) ? '定时发送' : '已取消'
                }
              }
              arr.push(obj)
            })            
            this.totalCount = data.total
            this.tableData = arr
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
<style lang="stylus", scoped>
@import "../../../assets/stylus/color"
.el-table__row
  .cell
    a
      color $color-main
      &:hover
        cursor pointer
    i.iconfont.icon-locka:hover,
    i.iconfont.icon-lockb:hover
      cursor pointer
.baidu-map
  width: 100%
  height: 550px
.table-scope{
  /*position: relative;*/
  /*height: 100%;*/
}
.table-content{
  position: absolute;
  background: #fff;
  width: 100%;
  border-radius: 3px;
  padding: 10px;
  line-height: 25px;
  top: -20px;
  left: 0;
  z-index: 100;
  box-shadow: 0,0,1,#000;
  display: none;
}
.table-scope:hover .table-content{
  display: block;
}
</style>