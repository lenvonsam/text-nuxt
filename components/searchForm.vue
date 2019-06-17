<template lang="pug">
.search-box
  .row.flex-center.text-center
    .col.pt-20
      .row(v-for="(items, index) in copyItems")
        .col(v-for="(item, idx) in items")
          .row.mb-15.flex-center(v-if="item.label")
            .col.flex-120.text-right.pr-5
              label {{item.label}}：
            .col
              el-date-picker.full-width(v-model="item.val", type="date",v-if="item.type == 'date'", :placeholder="item.placeholder",size="small", value-format="yyyy-MM-dd")
              el-date-picker.full-width.crm-timeLimit(v-model="item.val", type="daterange", v-else-if="item.type == 'timeLimit'", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", size="small", value-format="yyyy-MM-dd")
              el-date-picker.full-width.crm-timeLimit(v-model="item.val", type="datetimerange", v-else-if="item.type == 'datetimerange'", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", size="small", value-format="yyyy-MM-dd HH:mm")
              el-autocomplete.full-width(v-model="item.val", value-key="label", v-else-if="item.type == 'autocomplete'", @focus="selectIdx(index, idx)", :fetch-suggestions="querySearchAsync", :placeholder="item.placeholder", size="small")                
              el-select.full-width(v-model="item.val", filterable, clearable, :placeholder="item.placeholder", v-else-if="item.type == 'select'", size="small")
                el-option(v-for="itemIist in item.list", :key="itemIist.value", :label="itemIist.label", :value="itemIist.value")
                  span {{itemIist.label}}
              template(v-else-if="item.type == 'range'")
                .row.flex-center
                  .col
                    el-input(v-model="item.min", :placeholder="item.minPlaceholder", size="small")
                  .col.flex-10.pl-5.pr-5.text-center
                    span -
                  .col
                    el-input(v-model="item.max", :placeholder="item.maxPlaceholder", size="small")
              el-input.full-width(v-model="item.val", v-else, :placeholder="item.placeholder", size="small")
    .text-center(style="flex: 0 0 200px")
      el-button(size="small", type="primary", @click="search('submit')") 查询
      el-button(size="small", @click="search('reset')") 重置
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
     props: {
      searchFormItems: {
        type: Array,
        default: () => {
          return []
        }
        // required: true
      }
    },
    data () {
      return {
        copyItems: null,
        selectIdxArr: []
      }
    },
    computed: {
      ...mapState({
        searchParams: state => state.searchParams
      })
    },
    beforeMount () {
      if (this.searchParams.url === this.$route.path) {
        for (const key in  this.searchParams.params) {
          this.searchFormItems.map((item) => {
            item.map((obj) => {
              if (obj.model === key) {
                obj.val = this.searchParams.params[key]
              }
            })
          })
        }        
      } else if (this.$route.path.indexOf(this.searchParams.url) === -1){
        this.clearSearchParams()
      }
      this.copyItems = Object.assign([], this.searchFormItems)
      if (this.copyItems.length>1){
        const i = 3 - this.copyItems[this.copyItems.length - 1].length
        for (let n = 0; n< i; n++){
          this.copyItems[this.copyItems.length - 1].push({})
        }
      }
    },     
    methods: {
      ...mapActions([
        'setSearchParams',
        'clearSearchParams'
      ]),
      search (type) {
        const itemLength = this.copyItems.length
        const searchParm = {}
          for(let i=0; i<itemLength; i++){
            for(let n=0; n<this.copyItems[i].length; n++){
              if (this.copyItems[i][n].type === 'range' && type === 'submit') {
                const key = this.copyItems[i][n].model
                searchParm[key] = []
                if (this.copyItems[i][n].min.trim() !== '' && this.copyItems[i][n].max.trim() !== '') {
                  if(Number(this.copyItems[i][n].min) > Number(this.copyItems[i][n].max)){
                    this.msgShow(this, '最小值不能大于最大值')
                    return
                  } else {
                    searchParm[key].push(this.copyItems[i][n].min)
                    searchParm[key].push(this.copyItems[i][n].max)
                  }
                } else if (this.copyItems[i][n].min.trim() !== '' && this.copyItems[i][n].max.trim() === '') {
                  this.msgShow(this, '请填写最大值')
                  return
                } else if (this.copyItems[i][n].min.trim() === '' && this.copyItems[i][n].max.trim() !== '') {
                  this.msgShow(this, '请填写最小值')
                  return
                }
              } else if (this.copyItems[i][n].model && type === 'submit') {
                const key = this.copyItems[i][n].model
                searchParm[key] = this.copyItems[i][n].val
              } else if(type === 'reset'){
                this.copyItems[i][n].val = ''
                if (this.copyItems[i][n].type === 'range') {
                  this.copyItems[i][n].min = ''
                  this.copyItems[i][n].max = ''
                }
              }
            }
          }
        if(type === 'submit'){          
          const searchParamsObj = {url: this.$route.path, params: searchParm}
          this.setSearchParams(searchParamsObj)
          this.$emit('search', searchParm)
        }
      },
      querySearchAsync(queryString, cb) {
        const copyItemsIdx = this.selectIdxArr[0]
        const itemsIdx = this.selectIdxArr[1]
        const restaurants = this.copyItems[copyItemsIdx][itemsIdx].list
        const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      selectIdx (index, idx) {
        this.selectIdxArr = [index, idx]
      }
    }
  }
</script>
<style lang="stylus", scoped>
  .search-box
    border: 1px dashed #ddd
</style>
