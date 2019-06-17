import jsPlumb from 'jsplumb'
import html2canvas from 'html2canvas'
import canvg from 'canvg'
import Vue from 'vue'

export default () => {
    Vue.prototype.$jsplumb = jsPlumb.jsPlumb
    Vue.prototype.$h2canv = html2canvas
    Vue.prototype.$canvg = canvg
}
