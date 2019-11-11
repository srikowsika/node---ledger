
const express=require('express');
const app= express();
var replace = require("replace-in-file");
var prependFile = require('prepend-file');
const cors=require('cors');
const fs = require("fs");
const Ledger = require('ledger-cli').Ledger;
const bodyParser = require('body-parser');
const loginFormRoute=require('./router/ledgerform')
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use('/',loginFormRoute)
var ledger = new Ledger({ file: 'Journal.dat',binary:'/usr/bin/ledger' });

app.post('/',(req,res)=>{
  console.log(req.body)
  
  comments=req.body.formDetails.comments
  //console.log(comments)
    prependFile('Journal.dat', '; '+comments+'\n', function (err) {
      if (err) {
          throw err
      }
      //console.log('The "data to prepend" was prepended to file!');
  });
  res.send('Node')
})
var entry={ 
  date: '2019-12-01',
  effectiveDate: null,
  code: '10',
  cleared: false,
  pending: false,
  payee: 'Checking balance',
  postings:
   [ { account: 'Expenses:Auto:Gas', commodity:{ currency: '£', amount: 37, formatted: '£ 37.50' }  },
     { account: 'Assets:Checking', commodity:{ currency: '£', amount: 37.50, formatted: '£ -37.50' }} ] 
    }
    var payee;
    var date=entry.date;
    entry.cleared===true ? payee=`* ${entry.payee}` : payee=`${entry.payee}`;
    entry.pending===true ? payee=`! ${entry.payee}`  : payee=`${entry.payee}`;
    
    var jsonData = `${date} (${entry.code}) ${payee}\n`
    for(posting of entry.postings)
    {
      jsonData+=`  ${posting.account}           ${posting.commodity.formatted}\n`
    }
    
fs.appendFile("Journal.dat",jsonData+'\n', 'utf-8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
      console.log("JSON file has been saved.");
  });

ledger.register(entry.code===1)
.on('data', function(entry) {
  console.log(entry);
  console.log(entry.postings);
})
.once('error', function(error) {
  console.log(error)
});

fs.readFile('Journal.dat', 'utf8', function read(err, data) {
  if (err) {throw err;}
  var regexp=/(\d{4}[-|:|\/]\d{2}[-|\/|:]\d{2}).?[(](5)[)].*?(^\s*$)/gms
  
  console.log(regexp)
  console.log(typeof(regexp))
  data1= data.match(regexp);
  console.log(data1)
  const results = replace.sync({
    files: 'Journal.dat',
    from: data1[0],
    to: jsonData,
    countMatches: true,
  });
  console.log(results);
  })  

ledger.accounts()
.on('data', function(entry) {
  console.log(entry)
})

  
module.exports = app;