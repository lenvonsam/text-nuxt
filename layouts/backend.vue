<template lang="pug">
no-ssr
  .server-container
    .sidebar(:class="{'collapse': collapse}")
      .side-wrap
        .logo.row.text-white.flex-center(style="height: 56px;background:#409eff")
          .col.pl-15(v-if="!collapse")
            h3.ft-16 智恒达供应链
          .text-center(@click="collapse = !collapse", style="flex: 0 0 64px")
            i.ft-18.el-icon-menu
        .search.padding-sm(v-if="!collapse")
          el-input(size="small", prefix-icon="el-icon-search", placeholder="请输入菜单名称", v-model="menuSearch")
        .menu
          el-menu(background-color="#222d32", text-color="#eee",:router="true", :default-active="activeKey", @select="sidebarSelect", :collapse="collapse")
            template(v-for="(menu,idx) in menuList")
              el-menu-item(v-if="!menu.subItems", :key="menu.path", :index="menu.path")
                i(:class="menu.iconClass" ,text-color="#eee!important")
                span {{menu.title}}
              el-submenu(v-else, :index="'' + idx")
                template(slot="title") 
                  i(:class="menu.iconClass")
                  span(slot="title") {{menu.title}}
                el-menu-item(v-for="sub in menu.subItems", :key="sub.path", :index="sub.path")
                  span {{sub.title}}
    .right-part
      .topbar
        //- .relative
          el-tabs.top-tab(v-model="topActiveKey")
            el-tab-pane(v-for="p in topPanes", :label="p.title", :name="p.key", :key="p.key")
          el-button.no-border.float-right(size="medium", icon="logout", style="position: absolute; top: 3px; right: 0px;") 退出
        .relative
          el-tabs.top-tab(v-model="topActiveKey")
            el-tab-pane(v-for="p in topPanes", :label="p.title", :name="p.key", :key="p.key")   
          .right-box
            .row
              el-dropdown(size="small")
                .avatar-box(:style="{background: 'url(https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg) no-repeat center', backgroundSize: 'cover'}")              
                el-dropdown-menu(slot="dropdown")
                  el-dropdown-item zhjm
                  el-dropdown-item(icon="logout") 退出
              .ft-14.pl-10 郑家敏
        el-tabs.bottom-tab(v-model="activeKey", type="card", closable, @edit="onEdit", style="position: relative", @tab-click="tabClick")
          el-tab-pane(v-for="p in panes", :label="p.title", :name="p.path", :key="p.path")
      .content
        nuxt
</template>

<script>
import { mapState } from 'vuex'
export default {
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/jsPlumb/2.10.0/css/jsplumbtoolkit-defaults.min.css' }
    ],
    script: [
      { src: 'https://cdn.bootcss.com/jsPlumb/2.10.0/js/jsplumb.min.js', async: true,  defer: true }
    ]
  },
  data() {
    return {
      collapse: false,
      menuSearch: '',
      activeKey: '/basics/InstitutionalSet/organization',
      panes: [],
      topActiveKey: 'basic',
      menuList: []
    }
  },
  computed: {
    ...mapState({
      topPanes: state => state.topPanes,
      modeMenus: state => state.modeMenus
    })
  },
  watch: {
    menuSearch(newVal, oldVal) {
      console.log('newval:>>', newVal)
      if (newVal.length === 0) {
        this.menuList = Object.assign([], this.modeMenus[this.topActiveKey])
      } else {
        this.menuList = this.modeMenus[this.topActiveKey].filter(
          itm =>
            itm.subItems.findIndex(sim => sim.title.indexOf(newVal) >= 0) >= 0 ||
            itm.title.indexOf(newVal) >= 0
        )
      }
    }
  },
  beforeMount() {
    console.log(this.$route.path)
    this.activeKey = this.$route.path
    this.menuList = Object.assign([], this.modeMenus[this.topActiveKey])
    this.addTopPanel()
  },
  methods: {
    addTopPanel() {
      const pidx = this.panes.findIndex(itm => itm.path === this.activeKey)
      if (pidx < 0) {
        for (let i = 0; i < this.menuList.length; i++) {
          const item = this.menuList[i]
          if (item.subItems) {
            const idx = item.subItems.findIndex(
              itm => itm.path === this.activeKey
            )
            if (idx >= 0) {
              this.panes.push(item.subItems[idx])
              break
            }
          } else if (item.path === this.activeKey) {
            this.panes.push({
              title: item.title,
              path: item.path
            })
            break
          }
        }
      }
    },
    sidebarSelect(val) {
      console.log('menu val:>>', val)
      this.activeKey = val
      console.log('activekey:>>', this.activeKey)
      this.addTopPanel()
      this.redirect(this.activeKey)
    },
    onEdit(targetKey, action) {
      if (action === 'remove') {
        if (this.panes.length === 1) {
          this.msgShow(this, '只有一个标签不能删除')
          return
        }
        this.panes = this.panes.filter(itm => itm.path !== targetKey)
        console.log(this.panes)
        this.activeKey = this.panes[this.panes.length - 1].path
        console.log(this.activeKey)
        this.redirect(this.activeKey)
      }
    },
    tabClick () {
      this.redirect(this.activeKey)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common';
.avatar-box{
  width 30px
  height 30px
  border 1px #f2f2f2 solid 
  border-radius 100%
  overflow hidden  
}
.right-box{
  position absolute
  right 15px
  top 8px
  bottom 0
}
.right-box .row{
  // align-content center
  align-items: center
}
</style>
