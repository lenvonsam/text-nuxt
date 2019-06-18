<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", @tableRowEdit="rowEdit", @tableRowDel="rowDel")
    el-dialog(:title="dialogTitle", :visible="dialogShow", width="800px", height="100px",@close="subForm('cancel')")
      .row.flex-center
        .col.flex-100 模板分组
        .col
          el-input(type="text", placeholder="请输入模板分组", v-model="smsTemplate.groupName")
      .row.flex-center.mt-10
        .col.flex-100 模板名称
        .col
           el-input(placeholder="请输入模板名称", v-model="smsTemplate.name")
      .row.flex-center.mt-10
        .col.flex-100 模板内容
        .col
          el-input(type="textarea", :autosize="{minRows:3}", maxlenght=500, placeholder="请输入内容", v-model="smsTemplate.content")
          .ft-13.text-red.mt-10 模板最多输入500个字符
      .dialog-footer.text-right(slot="footer")
        el-button(size="medium", @click="subForm('cancel')") 取消
        el-button(type="primary", size="medium", @click="subForm('ok')") 确认
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable,
      searchForm,
      breadcrumb,
      basicTable,
      buttonGroup
    },
    data () {
      return {
        breadItems: ['模板管理'],
        btnGroups: [{lbl: '返回', type: 'back'}, {lbl: '新增模板', type: 'add'}],
        searchFormItems: [
          [{label: '模板分组', model: 'groupName', type: 'text', placeholder: '请输入模板分组', val: ''},
            {label: '模板名称', model: 'name', type: 'text', placeholder: '请输入模板名称', val: ''},
            {label: '模板内容', model: 'content', type: 'text', placeholder: '请输入模板内容', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: [{
            lbl: '模板分组',
            prop: 'groupName',
            width: 100
          },{
            lbl: '模板名称',
            prop: 'name',
            width: 100
          },{
            lbl: '模板内容',
            prop: 'content'
          }, {
            type: 'action',
            width: '100px',
            fixed: 'right',
            actionBtns: [{
              lbl: '修改',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'del'
            }]
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: false,
        dialogShow: false,
        smsTemplate: {
          groupName: '',
          name: '',
          content: ''
        },
        dialogTitle: '新增模板'
      }
    },
    props: {
      close: {
        type: Function,
        require: true
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
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
        this.loadData()
      })
    },
    methods: {
      searchForm (paramsObj) {
        for (let key in paramsObj) {
          this.queryObject[key] = paramsObj[key]
        }
        this.loadData()
      },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        // this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/template', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      groupBtnClick (type) {
        console.log(type)
        if (type == 'add') {
          this.dialogTitle = '新增模板'
          this.smsTemplate = {id: null, groupName: '', name: '', content: ''}
          this.dialogShow = true
        }
        if (type == 'back') {
          this.back()
        }
      },
      subForm (flg) {
        if (flg == 'cancel') {
          this.dialogShow = false
        } else {
          this.createOrUpdate().then(() => {
            this.loadData()
          })
        }
      },
      async createOrUpdate () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/template/createOrUpdate', params: this.smsTemplate})
          if (data.returnCode === 0) {
            console.log(data)
            this.dialogShow = false
            this.msgShow(this, this.dialogTitle + '成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async delete (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: 'callCenter/template/' + id})
          if (data.returnCode === 0) {
            console.log(data)
            this.dialogShow = false
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      rowEdit (row) {        
        this.dialogShow = true
        this.smsTemplate = JSON.parse(JSON.stringify(row))
        this.smsTemplate['id'] = row.id
        delete this.smsTemplate['createAt']
        delete this.smsTemplate['idx']
        delete this.smsTemplate['updateAt']
        this.dialogTitle = '修改模板'
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.delete(row.id).then(() => {
            this.loadData()
          })
        }, () => {
          console.log('delete')
        })
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