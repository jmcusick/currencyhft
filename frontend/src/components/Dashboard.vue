<template>
  <div class="dashboard">
    <h1 style="padding: 30px; margin-bottom: -10px;">{{ msg }}</h1>

    <!-- Time range selectiong -->
    <el-row>
      <el-tabs v-model="range" @tab-click="handleSelect">
        <el-tab-pane label="1 Day" name="1d"></el-tab-pane>
        <el-tab-pane label="5 Days" name="5d"></el-tab-pane>
        <el-tab-pane label="YTD" name="ytd"></el-tab-pane>
        <el-tab-pane label="1 Year" name="1y"></el-tab-pane>
        <el-tab-pane label="2 Years" name="2y"></el-tab-pane>
        <el-tab-pane label="5 Years" name="5y"></el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- Chart -->
    <el-row>
      <div style="align:left;">
        <svg width="1000" height="440">
        <vn-line :model="trends"
                :x-format="formatDate"
                y-format="">
        </vn-line> 
        </svg>
      </div>
    </el-row>

    <!-- Adds dropdown menus for Start and End currencies -->
    <div style="height: 100px;">
      <el-row>
        <!-- Start -->
        <el-select v-model="start" placeholder="Start currency" @change="handleSelect()">
          <el-option
            v-for="item in startOptions"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
        <!-- End -->
        <el-select v-model="end" placeholder="End currency" @change="handleSelect()">
          <el-option
            v-for="item in endOptions"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-row>
    </div>

    <!-- Ticker data -->
    <div style="width: 100%; height: 450px;">
      <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <h3>Tickers</h3>
          <ticker v-for="ticker in tickers" :ticker="ticker"/>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import Ticker from './Ticker.vue';
import _ from 'lodash';
import d3 from 'd3';

export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'Dashboard',
      tickers: null ,
      chartData: null,
      startOptions: [{
        value: 'Start currency',
        label: 'Start currency',
        disabled: true
      },{
        value: 'AUD',
        label: 'AUD'
      }, {
        value: 'CAD',
        label: 'CAD'
      }, {
        value: 'CHF',
        label: 'CHF'
      }, {
        value: 'EUR',
        label: 'EUR'
      }, {
        value: 'GBP',
        label: 'GBP'
      }, {
        value: 'JPY',
        label: 'JPY'
      }, {
        value: 'NZD',
        label: 'NZD'
      }, {
        value: 'USD',
        label: 'USD'
      }],
      endOptions: [{
        value: 'End currency',
        label: 'End currency',
        disabled: true
      },{
        value: 'AUD',
        label: 'AUD'
      }, {
        value: 'CAD',
        label: 'CAD'
      }, {
        value: 'CHF',
        label: 'CHF'
      }, {
        value: 'EUR',
        label: 'EUR'
      }, {
        value: 'GBP',
        label: 'GBP'
      }, {
        value: 'JPY',
        label: 'JPY'
      }, {
        value: 'NZD',
        label: 'NZD'
      }, {
        value: 'USD',
        label: 'USD'
      }],
      start: 'EUR',
      end: 'USD',
      range: 'ytd'
    }
  },
  components: {
      Ticker
  },
  computed: {
    trends () {
      return [
        {
          key: 'close',
          area: true,
          values: _.map(this.chartData, (t) => {
            return {
              x: t.timestamp,
              y: t.close.toFixed(4)
            }
          })
        },
        {
          key: 'high',
          area: true,
          values: _.map(this.chartData, (t) => {
            return {
              x: t.timestamp,
              y: t.high.toFixed(4)
            }
          })
        },
        {
          key: 'low',
          bar: true,
          values: _.map(this.chartData, (t) => {
            return {
              x: t.timestamp,
              y: t.low.toFixed(4)
            }
          })
        }
      ]
    }
  },
  methods: {
    formatDate (timestamp){
      var fmt = ""
      if (this.range === "1d"){
        console.log("fmt 1")
        fmt = "%I:%M %p"
      } else{
        console.log("fmt 1")
        fmt = "%b %d, %Y"
      }
      return d3.time.format.utc(fmt)(new Date(timestamp*1000))
    }, 
    handleSelect (){
      console.log("HANDLE SELECT");
      if (this.start !== '' && this.end !== '' && this.start !== this.end) {
        
        // http://currencyhft.com:3000/chartData/NZDEUR=X/
        var str = "http://currencyhft.com:3000/chartData/"+this.start+this.end+"=X/" + this.range;

        // call for chartData
        axios.get(str).then( (response) => {
          console.log(response)
          this.chartData = response.data;
        }).catch( (error) => {
          console.log("ERROR:", error)
        })
      }
    },
    handleRange (){
      console.log("Time range selected: ", this.range);
    }
  },
  created () {
    // call for tickerData
    axios.get("http://currencyhft.com:3000/tickerData/").then( (response) => {
      console.log(response)
      this.tickers = response.data;
    }).catch( (error) => {
      console.log("ERROR:", error)
    })

    // call for chartData
    // http://currencyhft.com:3000/chartData/NZDEUR=X/ 
    axios.get("http://currencyhft.com:3000/chartData/EURUSD=X/ytd").then( (response) => {
      console.log(response)
      this.chartData = response.data;
    }).catch( (error) => {
      console.log("ERROR:", error)
    })
  }
}
</script>

<style scoped>
.el-col {
  border-radius: 4px;
}
h1 {
  font-weight: normal;
  font-family: Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif;
  color: #0c5a2f;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

