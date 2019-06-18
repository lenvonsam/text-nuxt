<template lang="pug">
.content
  search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    el-table(ref="multipleTable", :data="tableData", border, @selection-change="selectData", @current-change="selectData")
      template(v-for="head in tableHead")
        el-table-column(v-if="head.type !== 'action'",:label="head.lbl", :width="head.width ? head.width : 'auto'", :min-width="head.minWidth? head.minWidth : 'auto'", :prop="head.prop", :align="head.align ? head.align : 'left'")
          template(slot-scope="scope") 
            template(v-if="head.prop == 'content'") 
              el-popover(trigger="hover", placement="top-start", width="400", :content="scope.row[head.prop]") 
                .ellps-row.full-width(slot="reference") {{scope.row[head.prop]}}
            template(v-else) {{scope.row[head.prop] | rowData(head.prop)}}
    .padding.text-right
      el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="totalCount", @current-change="tableChange")
</template>

<script>
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable,
      searchForm,
      basicTable
    },
    data () {
      return {
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: false,
        tableData: []
      }
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
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    mounted () {
      this.queryObject= {
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
            if (key == 'replyTime') {
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
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/smsReceive', params: this.queryObject})
          if (data.returnCode === 0) {
            this.totalCount = data.total
            this.tableData = data.list
            console.log(data)
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