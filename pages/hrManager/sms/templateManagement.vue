<template lang="pug">
erplr-panel(:right-padding="false")
  div(slot="left")
    left-search(:formItem="searchFormItems", :searchEvent="searchForm", ref="search")
  .erp-content(slot="right")
    button-group(:btns="buttonGroupInfo", @groupBtnClick="buttonGroupClick")
    basic-elx-table(
      :tableValue="tableValue",
      :total="totalCount",
      :currentPage="currentPage",
      :pageSize="pageSize",     
      @paginateChange="tableChange",
      @tableRowEdit="rowEdit",
      @tableRowDel="rowDel",
      @rowSelection="rowSelection")
    el-dialog(ref="dialog", :title="dialogTitle", :visible="dialogShow",  width="800px", @close="dialogHandler('cancel')")
      el-form(v-if="dialogShow", ref="dialogForm", :rules="rules", :model="smsTemplate", label-width="90px")
        el-form-item(v-for="item in editForm", :label="item.lbl", :key="item.prop", :prop="item.rules ? item.prop : null")
          template(v-if="item.type === 'textarea'")
            el-input(type="textarea", :rows="2", placeholder="请输入内容", v-model="smsTemplate[item.prop]", size="small")
          template(v-else-if="item.type === 'select'")
            el-select.full-width(
              v-model="smsTemplate[item.prop]", 
              :multiple="item.select.multiple ? item.select.multiple : false", 
              :filterable="item.select.filterable",
              :reserve-keyword="item.select.reserveKeyword",
              :placeholder="item.placeholder"
              :remote-method="item.select.remoteMethod",
              size="small"
            )
              el-option(v-for="obj in item.select.list", :key="obj[item.select.labelProp]", :label="obj[item.select.labelProp]", :value="obj[item.select.labelProp]")
          template(v-else)
            el-input.full-width(v-model="smsTemplate[item.prop]", clearable, size="small", :placeholder="item.placeholder")
      .dialog-footer(slot="footer")
        el-button(@click="dialogHandler('cancel')", size="small") 取消
        el-button(@click="dialogHandler('sure')", type="primary", size="small") 确定
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
        editForm: [
          {lbl: '模板分组', prop: 'groupName', rules: true, placeholder: '请选择模板分组', select: {
            list: [],
            filterable: true,            
            labelProp: 'name',
            valueProp: 'id'
          }, type: 'select'},
          {lbl: '模板名称', prop: 'name', rules: true, placeholder: '请输入模板名称'},
          {lbl: '模板内容', prop: 'content', rules: true, type: 'textarea', placeholder: '请输入模板内容'}
        ], 
        rules: {
          groupName: [{ required: true, message: '请选择模板分组', trigger: 'change' }],
          name: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
          content: [{ required: true, message: '模板内容', trigger: 'change' }]
        },           
        searchFormItems: [
          {lbl: '模板分组', prop: 'groupId', val: '', type: 'select', lblProp: 'name', valProp: 'id', placeholder:'请输入模板分组', list: []},
          {lbl: '模板名称', prop: 'name', val: '', placeholder:'请输入模板名称'},
          {lbl: '模板内容', prop: 'content', val: '', placeholder:'请输入模板内容'}
        ],        
        tableValue: {          
          hasCbx: true,
          showRowIndex: true,
          tableHead: [
            {lbl: '模板分组', prop: 'groupName', width: '100px'},
            {lbl: '模板名称', prop: 'name', width: '100px'},
            {lbl: '模板内容', prop: 'content'}, 
            {type: 'action', width: '100px', fixed: 'right', actionBtns: [
                {lbl: '修改', type: 'edit'}, 
                {lbl: '删除', type: 'del'}
              ]
            }
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
    created () {
      this.getMsgTemplateGroup()
      this.copySmsTemplate = JSON.parse(JSON.stringify(this.smsTemplate))
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
      buttonGroupClick (type) {
        switch (type) {
          case 'add':
            this.dialogTitle = '新增模板'
            this.dialogShow = true
            break
          case 'edit':
            if (this.tableSelect.length < 1) {
              this.$message.error('请选择需要编辑的数据')
              return false
            }
            if (this.tableSelect.length > 1) {
              this.$message.error('只能选择一条数据编辑')
              return false
            }
            this.smsTemplate = JSON.parse(JSON.stringify(this.tableSelect[0]))
            this.rowEdit()
            break
          case 'del':
            if (this.tableSelect.length < 1) {
              this.$message.error('请选择需要删除的数据')
              return false
            }
            this.rowDel() 
            break
          case 'refresh':
            this.$refs.search.searchHandler()
            break
        }
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
      dialogHandler (type) {
        if (type === 'sure') {
          this.$refs.dialogForm.validate((valid) => {
            if (valid) {
              this.createOrUpdate().then(() => {                
                this.loadData()                
                this.dialogShow = false
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })          
        } else {
          this.dialogShow = false
        }
        this.smsTemplate = JSON.parse(JSON.stringify(this.copySmsTemplate))      
      },
      rowEdit (row) {        
        this.dialogTitle = '编辑模板'
        if (row) {
          this.smsTemplate = Object.assign({}, row)
        }
        this.dialogShow = true
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉记录吗？').then(() => {
          const list = row ? [row] : this.tableSelect
          let params = '/' + list[0].id
          if (list.length > 1) {
            const spIds = []
            list.map((item) => {
              spIds.push('id=' + item.id)
            })
            const spIdsStr = spIds.toString().replace(/,/g, '&')
            params = '?' + encodeURI(spIdsStr)
          }
          this.delete(params)   
        })
      },
      async loadData () {
        try {
          const { data } = await this.proxy(this, 'extra-server/v1/msg_template', 'get', this.queryObject)
          if (data.return_code === 0) {
            this.tableValue.tableData = data.data
            this.tableValue.tableData.map((item) => {
              if (!item.groupName) item.groupName = '--'
            })
            this.totalCount = data.total_page
          }
        } catch (e) {
          console.error(e)
        }
      },
      async getMsgTemplateGroup () {
        try {
          const { data } = await this.proxy(this, 'extra-server/v1/msg_template_group', 'get', {currentPage: 1, pageSize: 50})
          console.log(data)
          if (data.return_code === 0) {
            // const arr = []
            // data.data.map((item) => {
            //   const obj = {
            //     label: item.name,
            //     value: item.id
            //   }
            //   arr.push(obj)
            // })
            this.editForm[0].select.list = data.data
            this.searchFormItems[0].list = data.data
            // console.log(this.searchFormItems[0].list)
          }
        } catch (e) {
          console.error(e)
        }
      },
      
      async createOrUpdate () {
        try {
          const methods = this.smsTemplate.id ? 'put' : 'post'          
          const { data } = await this.proxy(this, 'extra-server/v1/msg_template', methods, this.smsTemplate)
          if (data.return_code === 0) {            
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
      async delete (params) {
        try {          
          const { data } = await this.proxy(this, 'extra-server/v1/msg_template'+ params, 'del')
          if (data.return_code === 0) {
            this.dialogShow = false
            this.msgShow(this, '删除成功', 'success')
            this.loadData()
          } else {
            this.msgShow(this, data.message)
          }
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