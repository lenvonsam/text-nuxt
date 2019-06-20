<script>
import { Line } from 'vue-chartjs'
export default {
  // props: ['data', 'options'],
  extends: Line,
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
  },
  methods: {
    update () {
      this.renderChart(this.data, this.options)
    }
  }
}
</script>
