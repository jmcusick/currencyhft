/**
 * Module dependencies.
 */

const addon = require('./src/build/Release/addon');

var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  //all html in public
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


console.log("__dirname: "+__dirname);

app.listen(3000, function () {
  console.log('photosbyjac.com node server listening on port 3000');
});

app.get('/exchange/:id', function(req, res) {

    // log id
    console.log(req.params.id);

    ret = addon.exchange(req.params.id);
    console.log(ret);
    
    res.send(ret);
});

app.get('/table/:tableName', function(req, res) {
    // log table name
    console.log(req.params.tableName);

    ret = addon.table(req.params.tableName);
    console.log(ret);

    res.send(ret);
});

app.get('/tickerData/', function(req, res) {
    // function takes 0 args (automatic load)

    ret = addon.tickerData();
    console.log(ret);
    
    res.send(ret);

});

app.get('/chartData/:ticker/:timeframe/:startDate/:endDate', function(req, res) {
    // log chartId
    console.log(req.params.ticker);
    console.log(req.params.timeframe);
    console.log(req.params.startDate);
    console.log(req.params.endDate);

    ret = addon.chartData(req.params.ticker,req.params.timeframe,req.params.startDate,req.params.endDate);
    console.log(ret);

    res.send(ret);
});

app.get('/arbitrageData/:startCurr/:endCurr/:maxNumberExchanges', function(req, res) {
    console.log("arbitrage data endpoint");

    console.log("startCurr: ",req.params.startCurr);
    console.log("endCurr: ",req.params.endCurr);
    console.log("exclude: ",req.query.exclude);
    console.log("maxNumExch: ",req.params.maxNumberExchanges);

    if (req.query.exclude === undefined){
        req.query.exclude = [];
    }

    ret = addon.arbitrageData(req.params.startCurr, req.params.endCurr, req.params.maxNumberExchanges, req.query.exclude);
    console.log(ret);

    res.send(ret);
});

app.get('/calculatorData/:startCurr/:endCurr', function(req, res) {
    console.log("calculator data endpoint");

    ret = addon.calculatorData(req.params.startCurr, req.params.endCurr);
    console.log(ret);

    if(isNaN(ret["rate"])){
        console.log("rate is not a number, returning 1.")
        ret["rate"] = 1;
    }

    res.send(ret);
});



function exitHandler(options, err) {
    if (options.cleanup){
      console.log('Press Control-D to exit immediately.');
      addon.shutdown();
      console.log('Cleanup complete. Goodbye :)');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));