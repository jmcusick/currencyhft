<template>
  <div class="profit">
    <div style="height: 100%;">
      <h1 style="padding: 30px; margin-bottom: -10px;">Profits</h1>
      <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <el-input v-model="inputVal" placeholder="Enter amount..."></el-input>
          <h3>Daily Profit: {{dailyReturn * inputVal | currency('$', 2)}}</h3>
          <h3>Daily Return: {{dailyReturn*100 | currency('', 4) }}%</h3>
          <h3>Yearly Profit: {{yearlyReturn * inputVal | currency('$', 2)}}</h3>
          <h3>Yearly Return: {{yearlyReturn*100 | currency('', 4)}}%</h3>
        </el-col>
        <el-col>
          <div style="width: 100%; height: 450px;">
            <el-row :gutter="20">
              <el-col :span="22" :offset="1">
                <h2><strong>Cycles</strong></h2>
                 <cycle v-for="cycle in cycles" :cycle="cycle"/>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Cycle from './Cycle.vue';

export default {
  name: 'profit',
  data () {
    return {
      inputVal: 1, 
      dailyData: null,
      dailyReturn: null,
      yearlyReturn: null,
      cycles:[]
    }
  },
  components: {
      Cycle
  },
  created () {
    // call for the Daily Arbitrage most profitable paths
    axios.get("http://currencyhft.com:3000/dailyArbitrage/").then( (response) => {
      console.log(response)
      this.dailyData = response.data;
      this.dailyReturn = this.dailyData.dailyReturn.toFixed(6);   //multiplied by 100, yields 4 decimal points
      this.yearlyReturn = this.dailyData.yearlyReturn.toFixed(6); //multiplied by 100, yields 4 decimal points
      this.cycles = this.dailyData.cycles;
      console.log("Got Daily:", this.dailyReturn);
      console.log("Got Yearly:", this.yearlyReturn);
      console.log("Got Cycles:", this.cycles);
    }).catch( (error) => {
      console.log("ERROR:", error)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.profit {
  margin:0;
  padding:0;
  min-height: 900px;
  height: 100%;
  box-sizing: border-box;
}
.el-col {
  padding: 25px;
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

a, h2 {
  color: #42b983;
}
</style>
