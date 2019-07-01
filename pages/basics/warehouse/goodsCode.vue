<template lang="pug">
erplr-panel(:right-padding="false")
  div(slot="left")
    el-collapse(v-model="collapseName")
      el-collapse-item.slot-left(title="品名大类", name="1")
        left-tree(ref="leftTree", :data="treeData", :props="defaultProps", @nodeClick="treeNodeClick", @addEvent="addOrgHandler", @editEvent="editOrgHandler", @delEvent="delOrgHandler")
      el-collapse-item.slot-left(title="查询", name="2")
        left-search(:formItem="searchFormItems", :searchEvent="searchForm", ref="search", :labelWidth="'70px'")
  .erp-content(slot="right")
    button-group(:btns="buttonGroupInfo", @groupBtnClick="buttonGroupClick")
    basic-elx-table(
      :tableValue="tableValue",
      :total="totalCount",
      :currentPage="currentPage",
      :pageSize="pageSize",
      :loading="loading"   
      @paginateChange="tableChange",
      @tableRowEdit="rowEdit",
      @tableRowDel="rowDel",
      @rowSelection="rowSelection")
    el-dialog(ref="dialog", :title="dialogTitle", :visible="dialogShow",  width="800px", @close="dialogHandler('cancel')")
      el-form(v-if="dialogShow", ref="dialogForm", :model="smsTemplate", label-width="90px")
        el-form-item(v-for="item in editForm", :label="item.lbl", :key="item.prop")
          template(v-if="item.type === 'textarea'")
            el-input(type="textarea", :rows="2", placeholder="请输入内容", v-model="smsTemplate[item.prop]", size="small")
          template(v-else-if="item.type === 'select'")
            el-select.full-width(
              v-model="smsTemplate[item.prop]", 
              :multiple="item.multiple ? item.multiple : false",
              :filterable="item.filterable",
              :reserve-keyword="item.reserveKeyword",
              :placeholder="item.placeholder"
              :remote-method="item.remoteMethod",
              size="small"
            )
              el-option(v-for="itemIist in item.list", :key="itemIist[item.valProp]", :label="itemIist[item.labelProp? item.labelProp : item.valProp]", :value="itemIist[item.valProp]")            
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
  import leftTree from '@/components/leftTree'
  import leftSearch from '~/components/leftSearch'  
  export default {
    layout: 'backend',
    components: {      
      basicElxTable,
      erplrPanel,
      buttonGroup,
      leftTree,
      leftSearch
    },
    data () {
      return {
        collapseName: ['1', '2'],
        searchFormItems: [
          {lbl: '品名大类', prop: 'orgAbbreviate', val: ''},
          {lbl: '品名', prop: 'deptName', val: ''},
          {lbl: '材质', prop: 'test1', val: ''},
          {lbl: '规格', prop: 'test2', val: ''},
          {lbl: '产地', prop: 'test3', val: ''},
        ],
        treeData: [{
          label: '品名大类', 
          children: [{label: '板材'}, {label: '型材'}, {label: '管材'}, {label: '优管'}, {label: '建材'}, {label: '橡胶'}, {label: '纸品'}]}],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        buttonGroupInfo: [
          {lbl: '新增', type: 'add', icon: 'el-icon-plus'},
          {lbl: '修改', type: 'edit', icon: 'el-icon-edit'},
          {lbl: '删除', type: 'del', icon: 'el-icon-delete'},
          {lbl: '下载导入模板', type: 'formula', icon: 'el-icon-edit'},
          {lbl: '导入', type: 'coefficient', icon: 'el-icon-edit'}
        ],
        editForm: [
          {lbl: '品名', prop: 'orgName', type: 'select', filterable: true, labelProp: 'deptName', valProp: 'deptCode', list: []},
          {lbl: '材质', prop: 'orgAbbreviate'},
          {lbl: '规格', prop: 'deptCode'},
          {lbl: '产地', prop: 'deptCode', type: 'select', filterable: true, labelProp: 'deptName', valProp: 'deptCode', list: []},
          {lbl: '数量单位', prop: 'deptCode', type: 'select', filterable: true, labelProp: 'deptName', valProp: 'deptCode', list: []},
          {lbl: '重量单位', prop: 'deptCode', type: 'select', filterable: true, labelProp: 'deptName', valProp: 'deptCode', list: []},
          {lbl: '助记码', prop: 'orgBankname'},
          {lbl: '备注', prop: 'orgRemark', type: 'textarea'}
        ],
        tableValue: {          
          hasCbx: true,
          showRowIndex: true,
          tableHead: [
            {lbl: '物资代码', prop: 'orgName', width: '100px'},
            {lbl: '品名大类', prop: 'orgCode'},
            {lbl: '品名', prop: 'orgAbbreviate'}, 
            {lbl: '材质', prop: 'orgCorporation'}, 
            {lbl: '规格', prop: 'orgPhone'},
            {lbl: '产地', prop: 'orgFax'},
            {lbl: '税率', prop: 'orgAccounts'},
            {lbl: '数量单位', prop: 'orgBankname'},
            {lbl: '重量单位', prop: 'orgTanu', width: '120px'},
            {lbl: '助记码', prop: 'orgAddr'},
            {lbl: '备注', prop: 'orgRemark'},
            {lbl: '计件模式', prop: 'orgRemark'},
            {lbl: '计重模式', prop: 'orgRemark'},
            {lbl: '计量方式', prop: 'orgRemark'},
            {lbl: '计价方式', prop: 'orgRemark'},
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
        smsTemplate: {},
        copySmsTemplate: {},
        dialogTitle: '新增物资代码设置',
        tableSelect: [],
        checkNode: {}
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
      this.copySmsTemplate = JSON.parse(JSON.stringify(this.smsTemplate))
    },
    mounted () {
      this.$nextTick(()=>{
        this.queryObject = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        // this.loadData()
      })
    },
    methods: {
      searchForm (values) {
        for (const key in values) {
          this.queryObject[key] = values[key]
          if (!this.queryObject[key]) {
            delete this.queryObject[key]
          }
        }
        this.loadData()       
      },
      treeNodeClick (obj) {
        console.log(obj)
        this.checkNode = obj
      },
      leftOrgSave (data) {
        console.log(this.$refs.leftTree.$refs.tree)
        // let newNodeId = null
        // if (!this.checkNode.node) {
        //   newNodeId = this.$refs.leftTree.data[0].$treeNodeId
        // } else {
        //   newNodeId = this.checkNode.node.id++
        //   if (!this.checkNode.data.children) {
        //     this.$set(this.checkNode.data, 'children', [])
        //   }
        // }        
        // const newChild = {
        //   id: newNodeId,
        //   label: data.orgName,
        //   children: []
        // }        
        // this.checkNode.data.children.push(newChild)
        // this.leftOrgDialog = false
      },
      addOrgHandler () {
        console.log('---------add')
        this.leftOrgDialog = true
      },
      editOrgHandler () {
        this.leftOrgTitle = '编辑组织'
        this.leftOrgDialog = true
      },
      delOrgHandler () {},
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
            this.dialogTitle = '新增物资代码设置'
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
            // this.$refs.search.searchHandler()
            this.loadData()
            break
        }
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
        this.dialogTitle = '编辑物资代码设置'
        if (row) {
          this.smsTemplate = Object.assign({}, row)
        }
        this.dialogShow = true
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉记录吗？').then(() => {
          const list = row ? [row] : this.tableSelect
          let params = '/' + list[0].orgId
          if (list.length > 1) {
            const spIds = []
            list.map((item) => {
              spIds.push('spIds[]=' + item.orgId)
            })
            const spIdsStr = spIds.toString().replace(/,/g, '&')
            params = '?' + encodeURI(spIdsStr)
          }
          console.log(params)
          this.delete(params)
        })
      },      
      async loadData () {
        try {
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/org', 'get', this.queryObject)
          if (data.return_code === 0) {          
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          }
        } catch (e) {
          console.error(e)
        }
        this.loading = false
      },      
      async createOrUpdate () {
        try {
          const methods = this.smsTemplate.orgId ? 'put' : 'post'          
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/org', methods, this.smsTemplate)
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
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/org'+ params, 'del')
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
  .bm-serch{}
</style>