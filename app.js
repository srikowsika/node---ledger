
const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const fs = require("fs");
const Ledger = require('ledger-cli').Ledger;
var replace = require("replace-in-file");
var prependFile = require('prepend-file');
var transId = require('autoincrement');

const loginFormRoute = require('./router/ledgerform')

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use('/', loginFormRoute)

var ledger = new Ledger({ file: 'Journal.dat', binary: '/usr/bin/ledger' });

function objectTOString(entry)
{
  var payee;
    var date;
    entry.effectiveDate === null ? date = `${entry.date}` : date = `${entry.date}=${entry.effectiveDate}]`;
    entry.status === 'cleared' ? payee = `* ${entry.payee}` : payee = `${entry.payee}`;
    entry.pending === 'pending'? payee = `! ${entry.payee}` : payee = `${entry.payee}`;
    transId = transId + 1;
    var code=transId+2;
    var ledgerString = `${date} (${code}:${transId}) ${payee}\n`
    for (posting of entry.postings) {
      if(posting.comments !== null){ledgerString += `  ; ${posting.comments}\n`}
      ledgerString += `  ${posting.account}           ${posting.amount}\n`
    }
    return ledgerString;
}
function findEntryToReplace()
{
  fs.readFile('Journal.dat', 'utf8', function read(err, data) {
    if (err) { console.log('Id not exists') }
    var regexp = /(\d{4}[-|:|\/]\d{2}[-|\/|:]\d{2}).?[(](10:1)[)].*?(^\s*$)/gms
    console.log(regexp)
    console.log(typeof (regexp))
    replaceEntry = data.match(regexp);
  })
  return replaceEntry[0]
}

app.post('/comment', (req, res) => {
  console.log(req.body)
  comments = req.body.formDetails.comments
  prependFile('/node-ledger/Journal.dat', '; ' + comments + '\n', function (err) {
    if (err) {
      throw err
    }
  });
  res.send('Node')
})

app.post('/form', (req, res) => {
    var entry=req.body.formDetails;
    console.log(entry)
    var ledgerString=objectTOString(entry)
    fs.appendFile("Journal.dat", ledgerString + '\n', 'utf-8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    });
  res.send('Node')
})

app.post('/replace',(req,res)=>{
  var replaceEntry=findEntryToReplace();
  var replaceString=objectTOString(req.body.formDetails)
  console.log(replaceEntry);
  console.log(replaceString);
  const results = replace.sync({
    files: 'Journal.dat',
    from: replaceEntry,
    to: replaceString,
    countMatches: true,
  });
  console.log(results);
})

ledger.register()
  .on('data', function (entry) {
    console.log(entry);
  })
  .once('error', function (error) {
    console.log(error)
  });

ledger.accounts()
.on('data', function(entry) {
  console.log(entry)
})

module.exports = app;





// fs.readFile('Journal.dat', 'utf8', function read(err, data) {
//   if (err) { console.log('Id not exists') }
//   var regexp = /(\d{4}[-|:|\/]\d{2}[-|\/|:]\d{2}).?[(](10:1)[)].*?(^\s*$)/gms
//   console.log(regexp)
//   console.log(typeof (regexp))
//   data1 = data.match(regexp);
//   console.log(data1)
//   const results = replace.sync({
//     files: 'Journal.dat',
//     from: data1[0],
//     to: jsonData,
//     countMatches: true,
//   });
//   console.log(results);
// })

