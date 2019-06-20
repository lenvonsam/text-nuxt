<template lang="pug">
//- erplr-panel(:right-padding="false")
.content.bg-white
  .padding
    line-chart(:data="lineData", :options="lineOptions")
</template>
<script>
import lineChart from '@/components/lineChart'
// import erplrPanel from '~/components/erplrPanel'
export default {
  layout: 'backend',
  components: {
    // erplrPanel,
    lineChart
  },
  data () {
    return {
      lineData: {
        labels: ['06/10','06/11','06/12','06/13','06/14','06/15','06/16','06/17','06/18','06/19','06/20','06/21'],
        datasets: [{
          label: "总计",
          borderColor: '#5b9bd5',
          data: [1000,1200,900,600,1500,1900,800,900,1000,1100,1100, 900]
        }, {
          label: "线上",
          borderColor: '#ed7d31',
          data: [1200,1000,900,800,1300,1200,900,1000,800,700,500, 1000]
        }, {
          label: "线下",
          borderColor: '#a5a5a5',
          data: [200,1300,1000,1500,1500,1200,1000,1600,1300,1100,1200, 900]
        }]
      },
      lineOptions: {
        plugins:{
          customerRating: false
        },
        maintainAspectRatio: false,
        title:{
          display:false,
          position: 'top',
          fontSize: 14,
          text:'H型钢销售量折线图'
        },
        legend: {
          position: 'bottom'
        },
        elements: {
          line: {
            tension: 0,
            fill: false,
            borderWidth: 2
          }
        }
      }
    }
  }
}
</script>
