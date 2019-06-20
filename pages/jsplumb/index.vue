<template lang="pug">
erplr-panel(:right-padding="false")
  .pr-10(slot="left")
    el-button-group.mt-15.ml-15
      el-button.iconfont.icon-circle(size="small", type="primary", @click="addNode('circle')")
      el-button.iconfont.icon-rectangle(size="small", type="primary", @click="addNode('rectangle')")
      el-button.iconfont.icon-diamond(size="small", type="primary", @click="addNode('diamond')")
      //- el-button(size="small", icon="el-icon-check", type="primary", @click="save()")
    el-button-group.mt-15.ml-15
      el-button(size="small", icon="el-icon-check", type="primary", @click="save('json')") 导出json
      el-button(size="small", icon="el-icon-check", type="primary", @click="save('IMG')") 导出IMG
    .mt-35
      el-form(ref="from", :model="form", label-width="70px")
        el-form-item(label="主标题")
          el-input(v-model="form.mainTitle", ref="nodeForm", size="small")
        el-form-item(label="副标题")
          el-input(v-model="form.title", size="small")
      el-form(:model="form", label-width="70px")        
        el-form-item(label="edge")
          el-input(v-model="edge.label", @input="edgeEdit", ref="edge", size="small")
  .erp-content.no-padding(slot="right")
    .main(id="content-box", ref="content-box", v-if="contentBoxShow")
      .main-content(id="content", ref="content")
        el-tooltip(effect="dark", :content="item.mainTitle +' / '+ item.title", placement="right", v-for="(item, index) in root.dataList", :key="item.id")
          .card-container(:ref="item.id", :id="item.id", @click="checkNode(item, index)", @dblclick="dblclickNode", :style="{top: item.top + 'px', left: item.left + 'px'}")
            div(:class="boxClass(item)")
              .main-text {{item.mainTitle}}
              .value-text {{item.title}}
    el-dialog(:visible="outputShow", @close="closeOutput", width="1200px")
      .padding(v-if="outputData.type === 'json'") {{outputData.data}}
      div(:style="{overflow: 'auto', width: '100%', height: '500px'}", v-else)
        img(:src="outputData.data", alt="alt")
      .text-right
        el-button(type="primary", size="small", @click="saveOutput") 保存
</template>
<script>
import erplrPanel from '~/components/erplrPanel'
export default {
  layout: 'backend',  
  components: {
    erplrPanel
  },
  data () {
    return {
      contentBoxShow: true,
      outputShow: false,
      outputData: {
        type: 'json',
        data: ''
      },
      edge: {
        label: ''
      },
      form: {
        title: '',
        mainTitle: ''   
      },      
      config: {        
        maxConnections: -1,
        endpoint: ['Dot', {
          radius: 15,
          fill: '#cfe7ff'
        }], // 端点的形状
        paintStyle: {
          strokeStyle: '#1e8151',
          stroke: '#3086fb',
          fill: '#cfe7ff',
          fillStyle: '#cfe7ff',
          radius: 8,
          lineWidth: 2
        },
        hoverPaintStyle: { fill: 'red' },
        endpointHoverStyle: {fill: 'red'},
        connectorStyle: {stroke: '#999', strokeWidth: 1},
        connectorHoverStyle: {stroke: 'red', strokeWidth: 3},
        isSource: true, // 是否可以拖动（作为连线起点）
        connector: ['Flowchart', { gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        isTarget: true,        
        ConnectionOverlays: [],
        Container: 'content-box'
      },
      dataDraw: {},
      nodeIdx: null,
      connInfo: {},      
      root: {
        edgesList: [],
        dataList: [],
        top: -500000,
        left: -500000,
        activeNode: 'node0',
      },
      jsPlumbObj: {}
    }
  },
  created () {
    const me = this
    me.config.ConnectionOverlays = [
      ["Arrow", {location: 1}],
      ["Label", {location: 0.5, label: '', id: "label", events: {
            tap: function (connInfo, event) {
                me.edge.label = connInfo.label
                me.edge.connInfo = this
            }
          }              
        }
      ]
    ]
  },
  mounted() {    
    this.root = JSON.parse('{ "edgesList": [ { "id": "con_85", "sourceId": "node0", "targetId": "node1", "label": "", "uuids": [ "node0-right", "node1-left" ] }, { "id": "con_87", "sourceId": "node0", "targetId": "node1", "label": "333", "uuids": [ "node0-top", "node1-top" ] }, { "id": "con_89", "sourceId": "node0", "targetId": "node1", "label": "", "uuids": [ "node0-bottom", "node1-bottom" ] }, { "id": "con_91", "sourceId": "node2", "targetId": "node1", "label": "333", "uuids": [ "node2-top", "node1-right" ] }, { "id": "con_93", "sourceId": "node3", "targetId": "node2", "label": "", "uuids": [ "node3-left", "node2-right" ] }, { "id": "con_95", "sourceId": "node4", "targetId": "node0", "label": "111", "uuids": [ "node4-top", "node0-left" ] }, { "id": "con_97", "sourceId": "node5", "targetId": "node3", "label": "", "uuids": [ "node5-bottom", "node3-top" ] }, { "id": "con_99", "sourceId": "node6", "targetId": "node3", "label": "", "uuids": [ "node6-top", "node3-right" ] }, { "id": "con_101", "sourceId": "node6", "targetId": "node3", "label": "", "uuids": [ "node6-left", "node3-bottom" ] }, { "id": "con_103", "sourceId": "node2", "targetId": "node4", "label": "", "uuids": [ "node2-left", "node4-bottom" ] } ], "dataList": [ { "mainTitle": "申请人", "title": "zhjm", "id": "node0", "top": 499082, "left": 498874, "shape": "circle" }, { "mainTitle": "申请人1", "title": "zhjm2", "id": "node1", "top": 499252, "left": 499091, "shape": "rectangle" }, { "mainTitle": "申请人", "title": "zhjm1", "id": "node2", "top": 499493, "left": 499356, "shape": "diamond" }, { "mainTitle": "申请人", "title": "zhjm", "id": "node3", "top": 499508, "left": 499647, "shape": "circle" }, { "mainTitle": "申请人", "title": "zhjm", "id": "node4", "top": 499434, "left": 498714, "shape": "rectangle" }, { "mainTitle": "申请人", "title": "zhjm", "id": "node5", "top": 499081, "left": 499563, "shape": "circle" }, { "mainTitle": "申请人", "title": "zhjm", "id": "node6", "top": 499052, "left": 498631, "shape": "diamond" } ], "top": -498959, "left": -498559, "activeNode": "node0" }')
    this.$nextTick(() => {      
      this.$refs.content.style.cssText = "left:" + this.root.left +"px; top:" + this.root.top + "px"
      console.log('---------------init')
      window.jsPlumb.ready(this.init)
    })  
  },
  methods: {
    init() {
      console.log('------------>init')
      // 初始化界面
      const me = this     
      this.jsPlumbObj = window.jsPlumb.getInstance()
      this.jsPlumbObj.setContainer('diagramContainer')
      this.jsPlumbObj.importDefaults(this.config)       
      this.jsPlumbObj.bind('beforeDrop', (connInfo) => {
        let isSame = true
        if (connInfo.sourceId === connInfo.targetId) {
          isSame = false
        }        
        const uuid = [connInfo.sourceId, connInfo.targetId]
        if (connInfo.dropEndpoint.connections.length > 0) {
          connInfo.dropEndpoint.connections.map((item) => {
            const itemUuid = [item.sourceId, item.targetId]
            if (uuid.sort().toString() === itemUuid.sort().toString()) {
              isSame = false
            }
          })
        }        
        return isSame
      })
      this.jsPlumbObj.bind('connection', (connInfo, originalEvent) => {        
        me.jsPlumbObj.bind('click', (conn, event) => {
          me.$refs.edge.focus()
          me.edge.label = conn.getOverlay("label").label
          me.edge.connInfo = conn.getOverlay("label")
        })
        this.jsPlumbObj.bind('dblclick',  (conn, event) => {          
          me.confirmDialog(me, '您确认要删除当前连线吗').then(() => {
            me.jsPlumbObj.deleteConnection(conn)
            me.edge.label = ''        
            delete me.edge.connInfo
          })
        })
      })      
      if (this.root.dataList.length > 0) {
        this.root.dataList.map((item) => {
          this.setNode(item)    
        })
      }      
      if (this.root.edgesList.length > 0) {
        this.root.edgesList.map((item) => {
          const connection = this.jsPlumbObj.connect({
            uuids: item.uuids,          
          })
          if (!item.label) {
            connection.getOverlay("label").canvas.hidden = true
          } else {            
            connection.getOverlay("label").canvas.className = "jtk-overlay edge-label"
            connection.getOverlay("label").setLabel(item.label)            
          }        
        })
      }
      this.dragContent()
    },
    setNode(item) {
      // 增加锚点
      const node = document.getElementById(item.id)
      console.log(node)
      this.jsPlumbObj.addEndpoint(node, {
        anchors: [ 'Right' ],
        uuid: item.id + '-right'
      }, this.config)
      this.jsPlumbObj.addEndpoint(node, {
        anchors: [ 'Left' ],
        location: 1,
        uuid: item.id + '-left'
      }, this.config)
      this.jsPlumbObj.addEndpoint(node, {
        anchors: [ 'Top' ],
        uuid: item.id + '-top'
      }, this.config)
      this.jsPlumbObj.addEndpoint(node, {
        anchors: [ 'Bottom' ],
        uuid: item.id + '-bottom'
      }, this.config)      
      this.jsPlumbObj.draggable(node, {
        containment: 'content',
        start: () => {
          this.jsPlumbObj.destroyDraggable('content')
        },
        stop: () => {
          this.dragContent()
        }
      })      
    },
    dragContent() {
      this.jsPlumbObj.draggable('content')
    },
    addNode(shape) {
      // 添加节点
      let nodeId = 'node0'  
      if (this.root.dataList.length > 0) {
        const lastNodeId = this.root.dataList[this.root.dataList.length - 1].id
        nodeId = 'node' + (Number(lastNodeId.replace('node', '')) + 1)
      }      
      const obj = {
        mainTitle: '申请人',
        title: 'zhjm',
        id: nodeId,
        top: Math.abs(this.$refs.content.offsetTop) + 50,
        left: Math.abs(this.$refs.content.offsetLeft) + 50,
        shape: shape
      }      
      this.root.dataList.push(obj)
      this.$nextTick(() => {
        this.setNode(obj)
      })      
    },
    checkNode(item, index) {
      this.$refs.nodeForm.focus()
      this.form = item   
      this.nodeIdx = index
    },
    delNode() {      
      if (this.nodeIdx === null) {
        this.$message.error('请选择需要删除的节点')
        return
      }
      this.confirmDialog(this, '您确认要删掉当前节点吗').then(() => {
        this.edge.label = ''
        delete this.edge.connInfo
        const node = this.root.dataList[this.nodeIdx]
        this.jsPlumbObj.remove(node.id)
        this.jsPlumbObj.setSuspendDrawing(false, true)
        this.root.dataList.splice(this.nodeIdx, 1)
      })
    },
    dblclickNode() {
      // 双击删除节点
      this.delNode()
    },
    edgeEdit() {
      // 编辑线上的label
      if (this.edge.connInfo) {
        this.edge.connInfo.setLabel(this.edge.label)
        if (this.edge.label) {
          this.edge.connInfo.canvas.className = "jtk-overlay edge-label"
          this.edge.connInfo.canvas.hidden = false
        } else {
          this.edge.connInfo.canvas.className = "jtk-overlay"
        }
      }
    },
    save(type) {      
      if(type === 'json') {
        // 导出json
        const connect = this.jsPlumbObj.getConnections()
        this.root.dataList.map((item) => {        
          const nodeDom = this.$refs[item.id][0]
          item.top = nodeDom.offsetTop
          item.left = nodeDom.offsetLeft
        })
        const edgeArr = []
        connect.map((item) => {
          const uuid = []
          item.endpoints.map((endpoint) => {          
            uuid.push(endpoint._jsPlumb.uuid)
          })        
          const obj = {
            id: item.id,
            sourceId: item.sourceId,
            targetId: item.targetId,
            label: item.getOverlay("label").label,
            uuids: uuid
          }
          edgeArr.push(obj)
        })
        this.root.left = this.$refs.content.offsetLeft
        this.root.top = this.$refs.content.offsetTop
        this.root.activeNode = 'node0'
        this.root.edgesList = edgeArr          
        this.outputData.type = 'json'
        this.outputData.data = this.root
      } else {
        this.getImg()
      }
      this.outputShow= true
    },
    getImg () {
      // 导出png
      if (typeof window.html2canvas !== 'undefined') {
        // 以下是对svg的处理
        const nodesToRecover = []
        const nodesToRemove = []
        const svgElem = Array.prototype.slice.call(document.getElementById('content-box').getElementsByTagName('svg'))
        svgElem.map((node) => {
          const parentNode = node.parentNode
          const svg = node.outerHTML.trim()          
          const canvas = document.createElement('canvas')
          window.canvg(canvas, svg)      
          if (node.style.position) {
            canvas.style.position += node.style.position
            canvas.style.left += node.style.left
            canvas.style.top += node.style.top
          }          
          nodesToRecover.push({
            parent: parentNode,
            child: node
          });
          parentNode.removeChild(node);
          nodesToRemove.push({
            parent: parentNode,
            child: canvas
          });
          parentNode.appendChild(canvas);
        })                
        // const drawDom = this.$refs['content-box']
        window.html2canvas(document.querySelector("#content-box")).then(canvas => {          
          const imgUrl = canvas.toDataURL()          
          this.outputData.type = 'img'
          this.outputData.data = imgUrl
        })
      }
    },
    closeOutput() {
      this.outputShow = false
      if (this.outputData.type === 'img') {
        // 重置流程图
        this.contentBoxShow = false
        const me = this
        this.$nextTick(() => {
          me.contentBoxShow = true
          me.$nextTick(() => {
            this.$refs.content.style.cssText = "left:" + this.root.left +"px; top:" + this.root.top + "px"
            console.log('---------------init')
            window.jsPlumb.ready(this.init)
          })
        })
      }      
    },
    saveOutput() {
      this.closeOutput()
    },
    boxClass(item) {
      // 节点样式
      let boxClassName = ''
      switch(item.shape){
        // case 'rectangle': 
        //   boxClassName = 'rectangle-box'
        //   break
        case 'circle': 
          boxClassName = 'circle-box'
          break
        case 'diamond': 
          boxClassName = 'diamond-box'
          break
        default:
          boxClassName = 'rectangle-box'
      }
      const activeName = this.root.activeNode === item.id ? 'active-node' : 'node'
      return activeName + ' ' + boxClassName
    }
  }
}
</script>
<style lang="stylus">
@import '../../assets/stylus/common'
.main{
  height 100vh
  width 100vw
  padding 0
  overflow hidden  
  position relative
}
.main-content{
  position relative
  // position absolute
  background #f2f2f2  
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  left: -500000px
  top: -500000px
  height 1000000px
  width 1000000px
  // cursor move
}
.aside{
  height: 100vh;
  width: 300px;
}
.header{
  height: 50px;
}
.card-container{
  // cursor pointer
  position: absolute
  // position: relative
  text-align center  
  // padding 0 15px  
  box-sizing border-box
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.main-text {
  width 100%  
  border-bottom 2px #3086fb solid
  line-height 30px
  margin-bottom 5px
  overflow: hidden
  text-overflow:ellipsis
  white-space: nowrap
}
.value-text{
  width 100%
  overflow: hidden
  text-overflow:ellipsis
  white-space: nowrap
}
.circle-box{
  width 100px
  height 100px
  border-radius 100%
}
.circle-box .main-text{
  margin-top 15px
}
.rectangle-box{
  width 150px
  height 80px
  border-radius 5px
}
.rectangle-box .main-text{
   margin-top 8px
}
.diamond-box {
  width: 100px;
  height: 100px;
  margin: 15px;
  box-sizing border-box
  background: pink;
  transform: rotate(45deg);
  text-align: center;
  line-height: 50px;
  position relative
}
.diamond-box .main-text{
  // position: absolute;
  width 100px  
  transform: rotate(-45deg) translateX(-30%);
}
.diamond-box .value-text{
  transform: rotate(-45deg) translate(10%, 5px);
}

.active-node{
  background #c0ecc0
  border 1px green solid
  box-sizing border-box
  padding 0 10px
}
.active-node .main-text{
  border-bottom 2px green solid
}
.node{
  background #cfe7ff
  border 1px #3086fb solid
  box-sizing border-box
  padding 0 10px
}
.node:hover{
  border 2px #3086fb solid
}
.active-node:hover{
  border 2px green solid
}
.content-box{
  height 1000000px
  width 1000000px
}
.edge-label{
  padding 5px
  background #cfe7ff
  border 1px #3086fb solid
  border-radius 5px
  font-size 13px
}

</style>

