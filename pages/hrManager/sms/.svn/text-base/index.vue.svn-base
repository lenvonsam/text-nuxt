<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      recipient(mark="1", :tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import recipient from './../../callCenter/sms/recipient.vue'
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
        breadItems: ['行政人资', '发送短信'],
        btnGroups: [{lbl: '短信收发记录', type: 'rec'},{lbl: '通讯录管理', type: 'addressBook'}],
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
        let path="/hrManager/sms/sendAndReceiveRec"
        if (type == 'addressBook') {
          this.jump({path: '/hrManager/sms/addressBook'})
        } else if (type == 'rec') {
          this.jump({path: '/hrManager/sms/sendAndReceiveRec'})
        }
      }
    }
  }
</script>