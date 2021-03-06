// server.js

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


let resObj = {};
//to show IP adress/enable property
app.enable('trust proxy'); 

app.get('/api/whoami', (req, res) => {
  resObj['ipaddress'] = req.ip;
  //get method to extract stored language from the header field
  resObj['language'] = req.get('Accept-Language');
  //get method to extract stored software information from the header field
  resObj['software'] = req.get('User-Agent');
  res.json(resObj);
});
