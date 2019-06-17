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
    el-dialog(ref="dialog", :title="dialogTitle", :visible="dialogShow",  width="1000px", @close="dialogHandler('cancel')")
      el-form(v-if="dialogShow", :inline="true", :rules="rules", ref="dialogForm", :model="smsTemplate", label-width="90px")
        el-form-item(v-for="item in editForm", :label="item.lbl", :key="item.prop", :prop="item.rules ? item.prop : null")
          template(v-if="item.type === 'textarea'")
            el-input(type="textarea", :rows="2", placeholder="请输入内容", v-model="smsTemplate[item.prop]", size="small", :prop="item.rules ? item.prop : ''")
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
          template(v-else-if="item.type === 'date'")
            el-date-picker.full-width(v-model="smsTemplate[item.prop]", placeholder="请选择起始日期", size="small", value-format="yyyy-MM-dd HH:mm:ss")
          template(v-else)
            el-input.full-width(v-model="smsTemplate[item.prop]", :placeholder="item.placeholder", clearable, size="small")
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
          {lbl: '姓名', prop: 'employeeName', placeholder: '请输入部门', rules: true},
          {lbl: '机构', prop: 'orgName', placeholder: '请输入模板名称', rules: true},
          {lbl: '部门', prop: 'deptName'},
          {lbl: '职位', prop: 'employeeJob'},
          {lbl: '类别', prop: 'employeeClass'},
          {lbl: '性别', prop: 'employeeSex', type:'select', valProp: 'label', list: []},
          {lbl: '学历', prop: 'employeeDegree', type: 'select', valProp: 'label', list: []},
          {lbl: '专业', prop: 'employeeSpecialty'},
          {lbl: '身份证号码', prop: 'employeeIdcard'},
          {lbl: '地址', prop: 'employeeAddr'},
          {lbl: '电话', prop: 'employeePhone'},
          {lbl: '手机', prop: 'employeeMobile'},
          {lbl: '邮箱', prop: 'employeeEmail'},
          {lbl: '职称', prop: 'employeeTechnical'},
          {lbl: '民族', prop: 'employeeNation'},
          {lbl: '政治面貌', prop: 'employeeParty'},
          {lbl: '籍贯', prop: 'employeeNative'},
          {lbl: '婚姻', prop: 'employeeMarriage', type: 'select', list: [], valProp: 'label'},
          {lbl: '出生日期', prop: 'employeeBirthday', type: 'date'},
          {lbl: '进公司时间', prop: 'employeeJoindate', type: 'date'},
          {lbl: '工作组', prop: 'workgroupName'},
          {lbl: '备注', prop: 'employeeRemark'}
        ],
        rules: {
          employeeName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          orgName: [{ required: true, message: '请输入机构', trigger: 'blur' }]
        },             
        searchFormItems: [
          {lbl: '姓名', prop: 'employeeName', val: '', placeholder:'请输入姓名'},
          {lbl: '代码', prop: 'employeeCode', val: '', placeholder:'请输入代码'}
        ],        
        tableValue: {
          hasCbx: true,
          showRowIndex: true,
          tableHead: [
            {lbl: '姓名', prop: 'employeeName', width: '100px'},
            {lbl: '代码', prop: 'memberCode', width: '100px'},
            {lbl: '是否启用',  prop: 'employeeState', formatter: (row, column, cellValue, index) => {
              return cellValue === 1 ? '停用' : '启用'
            }},
            {lbl: '工作组', prop: 'workgroupName'},
            {lbl: '职位', prop: 'employeeJob'},
            {lbl: '类别', prop: 'employeeClass'},
            {lbl: '性别', prop: 'employeeSex'},
            {lbl: '学历', prop: 'employeeDegree'},
            {lbl: '专业', prop: 'employeeSpecialty'},
            {lbl: '身份证号', prop: 'employeeIdcard'},
            {lbl: '地址', prop: 'employeeAddr'},
            {lbl: '电话', prop: 'employeePhone'},
            {lbl: '手机', prop: 'employeeMobile'},
            {lbl: '邮箱', prop: 'employeeEmail'},
            {lbl: '职称', prop: 'employeeTechnical'},
            {lbl: '民族', prop: 'employeeNation'},
            {lbl: '政治面貌', prop: 'employeeParty'},
            {lbl: '籍贯', prop: 'employeeNative'},
            {lbl: '婚姻', prop: 'employeeMarriage'},
            {lbl: '出生日期', prop: 'employeeBirthday', width: '100', formatter: (row, column, cellValue, index) => {
              return cellValue ?  this.date2Str(new Date(cellValue)) : null
            }},
            {lbl: '进公司时间', prop: 'employeeJoindate', width: '100', formatter: (row, column, cellValue, index) => {
              return cellValue ?  this.date2Str(new Date(cellValue)) : null
            }},
            {lbl: '备注', prop: 'employeeRemark'},
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
        dialogTitle: '新增员工',
        tableSelect: []
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr,
        eduOpts: state => state.eduOpts,
        sexOpts: state => state.sexOpts,
        maritalOpts: state => state.maritalOpts
      })
    },
    created () {
      // this.getMsgTemplateGroup()    
      this.editForm[5].list = this.sexOpts
      this.editForm[6].list = this.eduOpts
      this.editForm[17].list = this.maritalOpts
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
            this.dialogTitle = '新增员工'
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
            this.loadData().then(() => {
              this.$message.success('刷新成功')
            })
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
        this.dialogTitle = '编辑员工'
        if (row) {
          this.smsTemplate = Object.assign({}, row)
        }
        this.dialogShow = true
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉记录吗？').then(() => {
          const list = row ? [row] : this.tableSelect
          let params = '/' + list[0].empId
          if (list.length > 1) {
            const spIds = []
            list.map((item) => {
              spIds.push('spIds[]=' + item.empId)
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
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/emp', 'get', this.queryObject)
          if (data.return_code === 0) {    
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          }
        } catch (e) {
          console.error(e)
        }
      },      
      async createOrUpdate () {
        try {
          const methods = this.smsTemplate.empId ? 'put' : 'post'          
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/emp', methods, this.smsTemplate)
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
          const { data } = await this.proxy(this, 'basic-server/v1/basicInfo/emp'+ params, 'del')
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