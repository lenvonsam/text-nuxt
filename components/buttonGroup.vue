<template lang="pug">
  el-button-group
    template(v-for="(btn,idx) in actionBtns")
      excel-upload.float-left(v-if="btn.type == 'excel'", :dataType="btn.dataType", @uploadSuccess="fileUploadSuccess")
        el-button(size="small") {{btn.lbl}}
      el-button(:type="getBtnClass(btn, idx)", size="small", @click="btnGroupClick(btn.type)", v-else) {{btn.lbl}}
</template>

<script>
  import { mapState } from 'vuex'
  import excelUpload from './excelUpload.vue'
  export default {
    components: {
      excelUpload
    },
    props: {
      btns: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        actionBtns: []
      }
    },    
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser
      })
    },
    beforeMount () {
      this.$nextTick(() => {
        if (this.currentUser.id !== 1) {          
          const idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
          const authObj = this.currentUser.auths[idx]
          this.btns.map(itm => {
            if (itm.type === 'add' || itm.type === 'start' || itm.type === 'stop' || itm.type === 'conversion') {
              if (authObj.hasCreate === 1 && itm.type === 'add') this.actionBtns.push(itm)
              if (authObj.hasUpdate === 1 && (itm.type === 'start' || itm.type === 'stop')) this.actionBtns.push(itm)
              if (authObj.hasUpdate === 1 && itm.type === 'conversion') this.actionBtns.push(itm)  
            } else {
              this.actionBtns.push(itm)
            }            
            // if (itm.type === 'delRec' || itm.type === 'conversionRec' || itm.type === 'outflow' || itm.type === 'back' || itm.type === 'res' || itm.type === 'edit' || itm.type === 'statistics') this.actionBtns.push(itm)            
          })
        } else {
          this.actionBtns = this.btns
        }
      })
    },
    methods: {
      btnGroupClick (type) {
        this.$emit('groupBtnClick', type)
      },
      fileUploadSuccess () {
        this.$emit('fileUploadSuccess')
      },
      getBtnClass (btn, idx) {
        if (btn.class) {
          return btn.class
        } else {
          switch (idx) {
            case 0:
              return 'primary'
            case 1:
              return 'success'
            case 2:
              return 'danager'
            default:
              return 'default'
          }
        }
      }
    }
  }
</script>

<style lang="stylus", scoped>

</style>
