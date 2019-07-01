<template lang="pug">
  el-dialog(ref="dialog", :title="title", :visible="dialogShow",  width="800px", @close="dialogHandler('cancel')")
    el-form(ref="dialogForm", :model="form", :rules="rules", label-width="90px")
      el-form-item(label="组织名称", prop="orgName")        
        el-input.full-width(v-model="form.orgName", clearable, size="small", placeholder="请输入组织名称")
      el-form-item(label="备注")        
        el-input.full-width(v-model="form.orgRemark", clearable, size="small", placeholder="请输入备注")
    .dialog-footer(slot="footer")
      el-button(@click="dialogHandler('cancel')", size="small") 取消
      el-button(@click="dialogHandler('sure')", type="primary", size="small") 确定
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '新增组织'
    },
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        orgName: '',
        orgRemark: ''
      },
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    dialogHandler (type) {
      if (type === 'cancel') {
        this.$emit('close')
      } else {
        this.$emit('save', this.form)
      }
    }
  }
}
</script>

