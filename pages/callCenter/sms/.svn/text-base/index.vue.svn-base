<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    recipient(mark="0", :tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import recipient from './recipient.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      buttonGroup,
      recipient
    },
    data () {
      return {
        loading: false,
        breadItems: ['客服中心', '短信中心'],
        btnGroups: [{lbl: '短信收发记录', type: 'rec'}],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '姓名',
            width: 200,
            prop: 'name'
          }, {
            lbl: '联系方式',
            width: 200,
            prop: 'linkPhone'
          }, {
            lbl: '类型',
            type: 'object',
            width: 200,
            prop: 'mainStatus',
            factValue (val) {
              return (val == 1) ? '主联系人' : '子联系人'              
            }
          }, {
            lbl: '所属客户',
            minWidth: 200,
            prop: 'compName'
          }, {
            type: 'action',
            width: 100,
            fixed: 'right',
            actionBtns: [{
              lbl: '移除',
              type: 'del'
            }]
          }]
        }
      }
    },
    methods: {
      groupBtnClick (type) {
        this.jump({path: '/callCenter/sms/sendAndReceiveRec'})
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
</style>