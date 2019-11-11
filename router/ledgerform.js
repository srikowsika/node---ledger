const express = require('express');
const router = express.Router();
const fs = require("fs");
const Ledger = require('ledger-cli').Ledger;
var ledger = new Ledger({ file: 'Journal.dat',binary:'/usr/bin/ledger' });
router.post('/ledgerform',(req,res)=>{
   
  console.log(req.body.formDetails);
  entry=req.body.formDetails;   
  var payee;
  var date=entry.date;
  entry.cleared===true ? payee=`* ${entry.payee}` : payee=`${entry.payee}`;
  entry.pending===true ? payee=`! ${entry.payee}`  : payee=`${entry.payee}`;
  //var postings=entry.postings;
  
//   var jsonData = `${date} ${payee}\n`
//   //for(posting of postings)
//   //{
//     jsonData+=`  ${entry.account}           ${entry.amount}\n`
  //}
 // console.log(jsonData)
  // fs.appendFile("Journal.dat",jsonData+'\n', 'utf-8', function (err) {
  //     if (err) {
  //         console.log("An error occured while writing JSON Object to File.");
  //         return console.log(err);
  //     }
  //     console.log("JSON file has been saved.");
  // });
  
   
// })
// router.get('/datfile' , (req,res) =>{
  
//   var stream;
//   stream = fs.createReadStream('Journal.dat');
  
//   stream.on("data", function(data) {
//       var chunk = data.toString();
//       console.log('chunck');
//       console.log(chunk);
//       //res.send(chunk)
//   }); 
//   //res.send(chunk)

 })


module.exports=router;