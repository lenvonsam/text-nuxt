<template lang="pug">
.content
  //- .padding-sm.border-bottom-1px
  el-button-group.padding-xs(v-if="button.length > 0")
    el-button(type="primary", v-for="(item, index) in button", :key="index", :icon="item.icon", size="mini", @click="buttonHandler(item.type)") {{item.label}}
    //- el-button(type="primary", icon="el-icon-document-add", size="mini", @click="buttonHandler('add')")
    //- el-button(type="primary", icon="el-icon-edit", size="mini", @click="buttonHandler('edit')")
    //- el-button(type="primary", icon="el-icon-delete", size="mini", @click="buttonHandler('del')")
  el-tree(ref="tree", accordion, highlight-current, :data="data", :props="treeProps", @node-click="handleNodeClick", check-on-click-node)
    span(slot-scope="{ node, data }") {{node.label}}
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    button: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeProps: {
      type: Object,
      default: () => {
        return { children: 'children', label: 'label' }
      }
    }
  },
  methods: {
    buttonHandler (type) {
      // this.$emit('chooseData', row)
      this.$emit(type + 'Event')
    },
    handleNodeClick (data, node, e) {
      console.log('----------s')
      console.log(data)
      console.log(node)
      console.log(e)
      const obj = {
        data: data,
        node: node
        // e: e
      }
      this.$emit('nodeClick', obj)
    }
  }
}
</script>

