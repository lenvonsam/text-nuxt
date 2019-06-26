<template lang="pug">
el-container.erp-panel-container
  el-aside.left-panel(:class="{'hide': leftHide}")
    slot(name="left")
  el-main.right-panel(:class="{'no-padding': !rightPadding}")
    .dot(@click="leftHide = !leftHide")
    slot(name="right")

</template>

<script>
export default {
  props: {
    rightPadding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      leftHide: false
    }
  }
}
</script>

<style lang="stylus">
.erp-panel-container {
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .left-panel {
    border-right: 1px solid #ddd;
    width: 280px!important;
    position: relative;
    transition: all 0.5s;

    &.hide {
      width: 0px;
    }

    &.show {
      width: 280px;
    }
  }

  .right-panel {
    position: relative;
    overflow: hidden;
    background: #f6f6f6

    .dot {
      position: absolute;
      width: 10px;
      height: 20px;
      top: 80px;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      left: 0;
      background: #32C8A3;
      z-index: 100;

      &:hover {
        cursor: pointer;
        background: #F17060;
      }
    }

    .erp-content {
      padding:15px;
    }
  }
}
</style>
