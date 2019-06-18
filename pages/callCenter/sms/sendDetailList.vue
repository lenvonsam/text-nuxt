<template lang="pug">
  .content
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading")
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
        // require: true
      },
      rowAdd: {
        type: Function,
        default: () => {}
        // require: true
      },
      parentData: {
        type: Object,
        default: () => {
          return {}
        }
        // require: true
      },
      tableValue: {
        type: Object,
        default: () => {
          return {}
        }
        // require: true
      },
      detailKey: {
        type: Array,
        default: () => {
          return []
        }
        // require: true
      }
    },
    data () {
      return {
        searchFormItems: [
          [{label: '状态', model: 'status', type: 'select', placeholder: '请选择状态', val: '', list:[]},
            {label: '接收人姓名', model: 'name', type: 'text', placeholder: '请输入接收人姓名', val: ''},
            {label: '手机号', model: 'phone', type: 'text', placeholder: '请输入手机号', val: ''}],
           [{label: '接收客户', model: 'cstmName', type: 'text', placeholder: '请输入接收客户', val: ''},
            {label: '短信ID', model: 'msgId', type: 'text', placeholder: '请输入短信ID', val: ''}]
        ],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: 5
        },
        loading: true,
        pageSize: 5
      }
    },    
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        smsStatus: state => state.smsStatus
      })
    },
    mounted () {      
      this.$nextTick(() =>{
        this.searchFormItems[0][0].list = this.smsStatus
        this.queryObject = {
          currentPage: this.currentPage - 1,
          mark: this.parentData.mark,
          parentId: this.parentData.id,
          pageSize: 5
        }
        this.loadData()
      })
    },
    methods: {
      searchForm (paramsObj) {
        this.queryObject.currentPage = 0
        for (const key in paramsObj) {
          this.queryObject[key] = paramsObj[key]
          if (this.queryObject[key] === '') {
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
        this.loading = true
        try {
          const { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/smsSend', params: this.queryObject})
          if (data.returnCode === 0) {
            const key = this.detailKey
            const arr = []
            data.list.map((item) => {
              const obj = {}
              for (let i = 0; i < item.length; i++) {
                obj[key[i]] = item[i]
              }
              arr.push(obj)
            })
            this.tableValue.tableData = arr
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