<script>
import { Bar } from 'vue-chartjs'
export default {
  // props: ['data', 'options'],
  extends: Bar,
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
