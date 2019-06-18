<template lang="pug">
  div
    el-upload.crm-simple-upload(:action="fileUploadUrl", :before-upload="beforePicUpload",name="upfile", :data="{'action': action, 'dataType': dataType, 'sheetIdx': sheetIndex}", :on-success="uploadSuccess", :on-progress="uploadProgress", :on-error="uploadError")
      slot
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      dataType: {
        type: String,
        default: 'dpt'
      },
      action: {
        type: String,
        default: 'crmExcelFile'
      },
      sheetIndex: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapState({
        fileUploadUrl: state => state.fileUploadUrl
      })
    },
    methods: {
      beforePicUpload (file) {
        console.log(file)
        const imgType = (file.name.indexOf('xls') > 0) || (file.name.indexOf('xlsx') > 0)
        const imgSize = file.size / 1000000 <= 10
        if (!imgType) {
          this.$message.error('上传文件格式错误!')
        }
        if (!imgSize) {
          this.$message.error('上传文件大不能超过10M!')
        }
        return imgType && imgSize
      },
      uploadSuccess (resp, file, fileList) {
        // this.$emit('input', file.response.url)
        console.log(resp)
        if (resp.state === 'SUCCESS') {
          this.$emit('uploadSuccess')
          this.$message.success('文件批量上传成功')
        } else {
          this.$message.error('文件批量上传失败')
        }
        this.pageHide()
      },
      uploadProgress () {
        this.pageShow(this)
      },
      uploadError () {
        this.pageHide()
      }
    }

  }
</script>

<style lang="stylus" scoped>

</style>
