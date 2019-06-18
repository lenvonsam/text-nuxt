<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-5
    .text-left 已选择 {{checkTotal}} 位联系人
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", ref="table", @tableRowEdit="rowEdit", @tableRowDel="rowDel")
  .mt-5.text-center
    el-button(type="", size="small", @click="toggleSelection") 选择当前页
    el-button(type="", size="small", @click="selectClose") 取消选择
    el-button(type="", size="small", @click="selectAll") 选择全部
    el-button(type="primary", size="small", @click="addAlllabel") 批量贴标签
    el-button(type="", size="small", @click="delAll") 批量删除
  el-dialog(:title="dialogTitle", :visible="dialogShow", width="800", @close="linkerClose")
    el-form(:model="linker", :rules="rules", ref="linkerForm", label-width="80px", label-position="right")
      el-form-item(label="姓名", prop="name", placeholder="请输入联系人姓名")
        el-input(v-model="linker.name")
      el-form-item(label="手机号", prop="phone", placeholder="请输入手机号")
        el-input(v-model="linker.phone")
      el-form-item(label="标签")
        el-input(v-model="linker.label", placeholder="多个标签请用逗号隔开")
      el-form-item(label="备注")
        el-input(v-model="linker.remark")
      el-form-item.text-right
        el-button(type="primary", size="small", @click="linkerHandler") 确认
        el-button(size="small", @click="linkerClose") 取消
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable,
      breadcrumb,
      buttonGroup,
      searchForm
    },
    data () {
      var phoneValid = (rule, value, callback) => {
        let reg = this.phoneReg
        if (value.trim().length === 0) {
          callback(new Error('手机号不能为空'))
        } else if (value.trim().length != 11) {
          callback(new Error('手机号位数要是11位'))
        } else if (!reg.test(value.trim())) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      return {
        breadItems: ['通讯录管理'],
        btnGroups: [{lbl:'返回', type:'back'},{lbl: '新增联系人', type: 'addLinker'},{lbl: '导入Excel', dataType: 'outLinker', type: 'excel'},{lbl: '联系人模板', type: 'template'},{lbl: '导出全部联系人',  type: 'export'}],
        searchFormItems: [
          [{label: '姓名', model: 'name', type: 'text', placeholder: '请输入姓名', val: ''},
            {label: '手机号', model: 'phone', type: 'text', placeholder: '请输入手机号', val: ''},
            {label: '标签', model: 'label', type: 'text', placeholder: '请输入标签', val: ''}],
          [{label: '备注', model: 'remark', type: 'text', placeholder: '请输入备注', val: ''}]          
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: [{
            lbl: '姓名',
            prop: 'name',
            width: 100
          }, {
            lbl: '手机号',
            prop: 'phone',
            width: 120
          }, {
            lbl: '标签',
            prop: 'label'
          }, {
            lbl: '备注',
            prop: 'remark',
            width: 200
          }, {
            type: 'action',
            width: '120px',
            fixed: 'right',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'del'
            }]
          }]
        },
        currentPage: 1,
        totalCount: 0,
        pageSize: 5,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },        
        loading: false,
        dialogTitle: '新增联系人',
        dialogShow: false,
        linker: { id: '', phone: '', name: '', label: '', remark:'', uid: ''},
        rules: {
          name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          phone: [{ validator: phoneValid, trigger: 'blur', required: true}]
        },
        outLinkerIdsData: [],
        checkTotal: 0,
        isOutLinkerIds: false
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser
      })
    },
    mounted () {      
      this.$nextTick(() =>{
        this.queryObject = {
            currentPage: this.currentPage - 1,
            pageSize: this.pageSize
          }
        this.loadData()
      })
    },
    methods: {
      groupBtnClick (type) {
        if (type == 'back') {
          this.back()
        } else if (type == 'addLinker') {
          this.dialogShow = true
          this.linker = { id: '', phone: '', name: '', label: '', remark:'', uid: ''}
        } else if (type == 'template') {
          this.download('1')
        } else if (type == 'export') {
          this.download('2')
        }
      },
      searchForm (paramsObj) {
        this.queryObject['currentPage'] = 0
        for (let key in paramsObj) {
          if (paramsObj[key].trim() != '') {
            this.queryObject[key] = paramsObj[key]
          } else {
            delete this.queryObject[key] 
          }          
        }
        this.loadData()
      },
      selectData (val) {
        this.chooseArray = val
        if (val.length !== undefined && !this.isOutLinkerIds) {
          this.outLinkerIdsData = []
          this.checkTotal = val.length
          val.map((item) => {
            this.outLinkerIdsData.push(item.id)
          })
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/outLinker', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
          console.log(this.totalCount)
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      dataFilter (dataList) {
        let key = ['linkName', 'linkPhone', 'mainStatus','createAt','updateAt','compName','mark','region','busiName','acctName','dptName','proName','billDate','summaryLevel']
        let arr = []
        dataList.map((item) => {
          let obj = {}
          for (let i=0;i<item.length;i++) {
            obj[key[i]] = item[i]
          }
          obj['name'] = obj['linkName']
          arr.push(obj)
        })
        return arr
      },
      toggleSelection () {
        this.selectClose()
        let table = this.$refs.table.$refs.multipleTable;
        for (let i=0;i<table['tableData'].length; i++) {
          table.toggleRowSelection(table['tableData'][i]);
          // table.toggleAllSelection()
        }        
      },
      selectClose () {
        this.$refs.table.$refs.multipleTable.clearSelection()
      },
      rowEdit (row) {
        let obj = {
          id: row.id,
          name: row.name,
          label: row.label,
          phone: row.phone,
          remark: row.remark
        }
        this.linker = JSON.parse(JSON.stringify(obj))
        this.dialogShow = true
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.outLinkerDel(row.id).then(() => {          
            this.loadData()
          })
        }, () => {
          console.log('delete')
        })
      },
      linkerHandler () {
         this.$refs['linkerForm'].validate((valid) => {
          if (valid) {
            this.linker.uid = this.currentUser.id
            this.createOrUpdate().then(() => {
              this.queryObject['currentPage'] = 0
              this.loadData()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      linkerClose () {
        this.dialogShow = false
      },
      selectAll () {
        let params = {}
        this.searchFormItems.map((row) => {
          row.map((item) => {
            if (item.val !== '') {
              params[item.model] = item.val
            }
          })
        })
        this.outLinkerIds(params)
      },
      addAlllabel () {
        this.$prompt('请输入标签', '批量贴标签', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '请输入标签'
        }).then(({ value }) => {
          let params = {}          
          params['label'] = value
          params['ids'] = this.outLinkerIdsData.toString()
          this.batchUpdate(params).then(() => {
            this.loadData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      delAll () {
        let params={}
        params['ids'] = this.outLinkerIdsData.toString()
        this.batchDel(params)
      },
      async batchUpdate (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/batchUpdate', params: params})
          if (data.returnCode === 0) {
            this.msgShow(this, '操作成功', 'success')
            this.dialogLableShow = false            
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async createOrUpdate () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/outLinker/createOrUpdate', params: this.linker})
          if (data.returnCode === 0) {
            this.msgShow(this, '新增成功', 'success')
            this.dialogShow = false            
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async outLinkerDel (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: 'callCenter/outLinker/' + id})
          if (data.returnCode === 0) {
            this.msgShow(this, '删除成功', 'success')
            this.dialogShow = false
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async outLinkerIds (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/outLinkerIds', params: params})
          if (data.returnCode === 0) {
            this.outLinkerIdsData = data.ids.split(',')
            this.checkTotal = data.total
            this.isOutLinkerIds = true
            this.toggleSelection()    
            this.isOutLinkerIds = false
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async batchDel (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/batchDel', params: params})
          if (data.returnCode === 0) {
            this.msgShow(this, '删除成功', 'success')
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async download (mark) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'file/address/' + mark})
          if (data.returnCode === 0) {
            let downUrl = decodeURIComponent(data.addr)
            window.location.href = downUrl
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