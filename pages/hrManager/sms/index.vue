<template lang="pug">
.content-scroll
  .bg-white.padding
    //- breadcrumb(:breadItems="breadItems")
    //- .pt-15
    //-   button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    //- .mt-15
    recipient(mark="1", :tableValue="tableValue")
</template>

<script>
  import buttonGroup from '~/components/buttonGroup.vue'
  import recipient from '~/pages/callCenter/sms/recipient.vue'
  export default {
    layout: 'backend',
    components: {
      // breadcrumb,
      buttonGroup,
      recipient
    },
    data () {
      return {
        loading: false,
        // breadItems: ['行政人资', '发送短信']
        btnGroups: [
          {lbl: '发送记录', type: 'sendRec'},
          {lbl: '接收记录', type: 'recipientRec'}
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
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
        if (type === 'sendRec') {
          this.jump({path: '/hrManager/sms/sendRec'})
        } else if (type === 'recipientRec') {
          this.jump({path: '/hrManager/sms/recipientRec'})
        }
      }
    }
  }
</script>