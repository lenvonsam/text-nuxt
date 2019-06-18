<template lang="pug">
.content
  .mt-15.bg-f9
    .box
      .ft-16.border-bottom-line.pb-10.row
        .col(style="flex:1") 收信人
        div
          el-button(size="mini" @click="clearRecipient") 清空收信人
          el-button(size="mini" type="primary" @click="recipientBox") 添加收信人
      .mt-15
        el-tabs(type="border-card", @tab-click="tabsHandle", v-model="tabsType")
          el-tab-pane(label="选择联系人发送", name="0")
            basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowDel="rowDel")
          el-tab-pane(label="自定义发送", name="1", v-if="mark == '1'")
            el-input(type="textarea", :autosize="{minRows:5}", placeholder="请输入手机号，逗号分隔", v-model="smsMobileStr")
  .mt-15.bg-f9
    .box
      .ft-16.border-bottom-line.pb-10.row
        .col(style="flex:1") 短信内容
        div
          el-button(size="mini" type="primary" @click="clearContent") 清空内容
      .mt-15
        el-input(type="textarea", :autosize="{minRows:3}", maxlength=500, placeholder="请输入内容", v-model="smsForm.content")
        .text-red.ft-13.mt-5 *最多输入500字符
  .mt-15.bg-f9
    .box
      .ft-16.border-bottom-line.pb-10.row
        .col(style="flex:1") 模板预览
        div
          el-select(placeholder="请选择模板分组", size="mini", v-model="groupName", @change="getGroupName")
            el-option(v-for="item in group", :key="item", :label="item", :value="item")
          el-select.ml-10.mr-10(placeholder="请选择模板名称", size="mini", v-model="templateName" @change="getTemplateDetail")
            el-option(v-for="item in groupTemplate", :key="item.id", :label="item.name", :value="item")
          el-button(size="mini" type="primary" @click="insertTemplate") 插入模板
          el-button(size="mini" type="primary", @click="templateManagement") 模板管理
          el-button(size="mini" type="primary", @click="editTemplateHandler") 修改模板
      .mt-15.bg-white.pl-5.pr-5.pt-5.pb-5
        el-input(type="textarea", :autosize="{minRows:3}", maxlength=500, placeholder="请输入内容", v-model="templateDetail.content", :disabled="isDisabled")
        .text-right.mt-5
          el-button(size="mini" type="primary", @click="editTemplateSure", v-if="!isDisabled") 确认
  .mt-20.text-center
    el-radio-group(v-model="sendType")
      el-radio(label='0') 及时发送
      el-radio(label='1') 定时发送
    el-date-picker.ml-10(type="datetime", placeholder="选择日期时间", size="small", v-model="delayTime")
  .mt-20.text-center.mb-30
    el-button(type="primary", @click="sendHandler") 发送
  el-dialog(:visible="recipientShow", width="1200px", :before-close="recipientBox")
    recipientAdd(:close="recipientBox", @rowAdd="addRecipient", @pageAdd="pageaddRecipient", @allAdd="allAddRecipient", v-if="mark == '0'")
    recipientHRAdd(:close="recipientBox", @rowAdd="addRecipient", @pageAdd="pageaddRecipient", @allAdd="allAddRecipient", v-else)
</template>
<script>
  import basicTable from '@/components/BasicTable.vue'
  import recipientAdd from './recipientAdd.vue'
  import recipientHRAdd from './../../hrManager/sms/recipientAdd.vue'
  import { mapState } from 'vuex'
  export default {
    components: {
      basicTable,
      recipientAdd,
      recipientHRAdd
    },
    props: {
      mark: {
        type: String,
        default: '0'
      },
      tableValue: {
        type: Object,
        require: true
      }
    },
    computed: {
      ...mapState({
        sexOpts: state => state.sexOpts,
        mainStatusOpts: state => state.mainStatusOpts,  
        eduOpts: state => state.eduOpts,
        currentUser: state => state.user.currentUser
      })
    },
    data () {
      return {
        loading: false,
        tableData: [],
        currentPage: 1,
        totalCount: 0,
        pageSize: 5,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: 5
        },
        sendType: '0',        
        smsForm: {
          content: '',
          mobile: [],
          mark: '0',
          uid: ''
        },
        smsMobileStr: '',
        delayTime: new Date(),
        group: [],
        groupName: null,
        templateName: null,
        groupTemplate: [],
        recipientShow: false,
        templateDetail: {},
        isDisabled: true,
        tabsType: '0'
      }
    },
    mounted () {
      this.queryGroupName()
    },
    methods: {
      groupBtnClick (type) {
        this.jump({path: '/callCenter/sms/sendAndReceiveRec'})
      },
      tableChange (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        let tableData = JSON.parse(JSON.stringify(this.tableData))
        let numSort = this.queryObject.currentPage * this.pageSize
        this.tableValue.tableData = tableData.splice(numSort, 5)
      },
      rowDel (row) {
        let num = (this.currentPage -1) * this.pageSize
        let rowStr = JSON.stringify(row)
        let tableData = JSON.stringify(this.tableData)
        let currentPage = this.currentPage
        this.tableData.splice(num + row.idx,1)
        tableData = JSON.parse(JSON.stringify(this.tableData))
        this.totalCount = tableData.length
        let tableDataArr = tableData.splice(num,5)
        this.tableValue.tableData = tableDataArr
        if (tableDataArr.length > 0) {
          this.tableValue.tableData = tableDataArr
        } else {
          this.currentPage = this.currentPage - 1
          this.tableValue.tableData = tableData.splice((this.currentPage - 1) * this.pageSize ,5)
        }
      },
      clearRecipient () {
        this.tableData = []
        this.totalCount = 0
        this.smsMobileStr = ''
        this.tableValue.tableData = []
      },
      async loadData (params) {},
      recipientBox () {        
        this.recipientShow = !this.recipientShow
      },
      templateManagement () {
        if (this.mark == '0') {
          this.jump({path: '/callCenter/sms/templateManagement'})  
        } else if (this.mark == '1') {
          this.jump({path: '/hrManager/sms/templateManagement'})
        }        
      },
      addRecipient (row) {
        if (row.idx > -1) delete row.idx
        let rowStr = JSON.stringify(row)
        let tableData = JSON.stringify(this.tableData)
        let linkNameArr = []
        if (tableData.indexOf(rowStr) == -1) {
          this.tableValue.tableData = []
          this.tableData.unshift(row)
          tableData = JSON.parse(JSON.stringify(this.tableData))
          this.totalCount = this.tableData.length
          this.tableValue.tableData = tableData.splice(0,5)
        } else {
          this.msgShow(this,'已添加')
          return
        }
      },
      pageaddRecipient (pageRow) {
        let count = pageRow.length
        pageRow.map((row) => {
          this.addRecipient(row)
        })
      },
      allAddRecipient (allRow) {
        let tableData = JSON.stringify(this.tableData)
        let linkNameArr = []
        allRow.map((row) => {
          let rowStr = JSON.stringify(row)
          if (tableData.indexOf(rowStr) == -1) {
            this.tableData.unshift(row)
          }
        })
        tableData = JSON.parse(JSON.stringify(this.tableData))
        this.totalCount = this.tableData.length
        this.tableValue.tableData = tableData.splice(0,5)
        this.recipientShow = false        
      },
      clearContent () {
        this.smsForm.content = ''
      },
      getGroupName () {
        let params = {
          currentPage: 0,
          pageSize: 10,
          groupName: this.groupName
        }
        this.templateSerch(params)
      },
      getTemplateDetail (row) {
        this.templateDetail = row
      },
      insertTemplate () {
        if (this.templateDetail.content) {
          this.smsForm.content = JSON.parse(JSON.stringify(this.templateDetail.content))
        } 
      },
      sendHandler () {
        this.smsForm['uid'] = this.currentUser.id
        this.smsForm['mark'] = this.mark
        let mobileArr = []
        if (this.mark == '0') {          
          this.tableData.map((item) => {
            mobileArr.push(item.linkPhone)
          })
          this.smsForm['mobile'] = mobileArr.toString()
        } else {
          if (this.tabsType == '0') {
            let mobileArr = []
            this.tableData.map((item) => {
              mobileArr.push(item.phone)
            })
            this.smsForm['mobile'] = mobileArr.toString()
          } else {
            this.smsForm['mobile'] = this.smsMobileStr.replace(/\，/g,',').replace(/\ /g,'')
            mobileArr = this.smsForm['mobile'].split(',')
            let mobileReg = []
            for (let i=0; i<mobileArr.length; i++) {
              let reg = this.phoneReg
              if (!reg.test(mobileArr[i])) {
                mobileReg.push(mobileArr[i])
              }         
            }
            if (mobileReg.length > 0) {
              this.msgShow(this,'手机号码：' + mobileReg.toString() + '格式错误')
              return
            }
          }
        }
        if (this.smsForm['mobile'] == '') {
          this.msgShow(this,'请选择联系人发送')
          return
        }

        if (this.smsForm['content'] == '') {
          this.msgShow(this,'请输入短信内容')
          return 
        }
        let delayTimeStr = this.datetime2Str(this.delayTime)
        if (this.sendType == 1) {
          this.smsForm['delayTime'] = delayTimeStr.slice(0,-3)  
        } else {
          delete this.smsForm.delayTime
        }
        console.log(this.smsForm)
        this.smsCreate()
      },
      editTemplateHandler () {
        this.isDisabled = false
      },
      editTemplateSure () {
        delete this.templateDetail['createAt']
        // delete this.templateDetail['idx']
        delete this.templateDetail['updateAt']
        this.createOrUpdate(this.templateDetail)
      },
      tabsHandle (tab, event) {
        console.log(this.tabsType)
        // console.log('---------type')
        // console.log(tab)
        // console.log(event)
        // if (tab.label == '自定义发送') {

        // }
      },
      async createOrUpdate (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/template/createOrUpdate', params: params})
          if (data.returnCode === 0) {
            this.isDisabled = true
            this.msgShow(this, '修改模板成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async smsCreate () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/smsCreate', params: this.smsForm})
          if (data.returnCode === 0) {
            if (data.numMsg != '') {
              this.msgShow(this, '存在重复号码，重复号码只会发送1次', 'success')    
            } else {
              this.msgShow(this, '设置成功', 'success')
            }            
            this.clearRecipient()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async templateSerch (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/template', params: params})
          if (data.returnCode === 0) {
            this.templateName = data.list[0].name
            this.templateDetail = data.list[0]
            this.groupTemplate = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async queryGroupName () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'callCenter/template/queryGroupName'})
          if (data.returnCode === 0) {
            console.log(data)
            this.group = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      }
    }
  }
</script>
<style>
  .ft-color{
    color: #303133;
  }
  .box-detail{
    background: #f9f9f9; 
    padding: 20px;
  }
  .box{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #606266;
    background-color: #fff;
  }
</style>