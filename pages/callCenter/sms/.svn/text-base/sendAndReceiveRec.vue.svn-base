<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="back()") 返回列表
  .mt-15
    el-tabs(type="border-card", value="1", @tab-click="handleClick")
      el-tab-pane(label="发送记录", name="1")
        send-rec(:searchFormItems="sendSearchFormItems", :tableHead="sendTableHead")
      el-tab-pane(label="接收记录", name="2")
        receive-rec(:searchFormItems="recSearchFormItems", :tableHead="recTableHead")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import sendRec from './sendRec.vue'
import receiveRec from './receiveRec.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    searchForm,
    sendRec,
    receiveRec
  },  
  data () {
    return {
      breadItems: ['短信收发记录'],
      tabName: '1',
      sendSearchFormItems: [
          [{label: '发送批号', model: 'id', type: 'text', placeholder: '请输入发送批号', val: ''},
            {label: '操作人', model: 'acctName', type: 'text', placeholder: '请输入操作人姓名', val: ''},
            {label: '发送类型', model: 'type', type: 'select', placeholder: '请选择发送类型', val: '', list:[]}],
           [{label: '状态', model: 'status', type: 'select', placeholder: '请选择状态', val: '', list:[]},
            {label: '接收客户', model: 'cstmName', type: 'text', placeholder: '请输入接收客户', val: ''},
            {label: '接收人姓名', model: 'name', type: 'text', placeholder: '请输入接收人姓名', val: ''}],
           [{label: '接收手机', model: 'phone', type: 'text', placeholder: '请输入接收手机', val: ''},
            {label: '提交时间', model: 'createAt', type: 'datetimerange', val: ''},
            {label: '发送内容', model: 'content', type: 'text', placeholder: '请输入发送内容', val: ''}]
          ],
      sendTableHead: [{
          lbl: '发送批号',
          width: 110,
          prop: 'id'
        },{
          lbl: '操作人',
          prop: 'acctName',
          width: 120
        },{
          lbl: '提交时间',
          prop: 'createAt',
          width: 160
        },{
          lbl: '定时时间',
          prop: 'delayTime',
          width: 160
        },{
          lbl: '发送内容',
          prop: 'content'
        },{
          lbl: '收信人数',
          width: 80,
          prop: 'sendCount'
        },{
          lbl: '状态',
          width: 90,
          prop: 'statusStr'
        }],
      recSearchFormItems: [
        [{label: '短信ID', model: 'msgId', type: 'text', placeholder: '请输入短信ID', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请输入业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''}],
         [{label: '回复人', model: 'name', type: 'text', placeholder: '请输入回复人', val: ''},
          {label: '回复客户', model: 'cstmName', type: 'text', placeholder: '请输入回复客户', val: ''},
          {label: '回复时间', model: 'replyTime', type: 'datetimerange', val: ''}],
         [{label: '回复内容', model: 'content', type: 'text', placeholder: '请输入回复内容', val: ''},
          {label: '回复手机', model: 'phone', type: 'text',placeholder: '请输入回复手机', val: ''}]
      ],
      recTableHead: [{
        lbl: '短信ID',
        width: 110,
        prop: 'msgId'
      },{
        lbl: '回复时间',
        prop: 'replyTime',
        width: 180
      },{
        lbl: '回复内容',
        prop: 'content'
      },{
        lbl: '回复手机',
        prop: 'phone',
        width: 120
      },{
        lbl: '回复客户',
        prop: 'cstmName',
        width: 120
      },{
        lbl: '回复人',
        width: 80,
        prop: 'name',
        width: 130
      },{
        lbl: '业务部门',
        width: 130,
        prop: 'dptName'
      },{
        lbl: '业务员',
        width: 130,
        prop: 'acctName'
      }]
    }
  },
  computed: {
    ...mapState({
      smsStatus: state => state.smsStatus
    })
  },
  mounted () {
    console.log(typeof(this.sendSearchFormItems))
    this.sendSearchFormItems[0][2].list = [{value:'', label:'全部'},{value:'1', label:'及时'},{value:'2', label:'定时'}]
    this.sendSearchFormItems[1][0].list = this.smsStatus
  },
  methods: {
    handleClick(tab, event) {
      this.tabName = tab.name
    }
  }
}
</script>