// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();


/** -> ‘/api/timestamp/’ endpoint that reads the date to be parsed from the URL.
    -> generate the correct strings for unix: and utc:. */
app.use('/api/timestamp', (req, res) => {
  res.json({ 
    unix: Date.now(), 
    utc: Date() 
  });
  
  let dateString = req.params.date_string;
  if (/\d{5,}/.test(dateString)) {
    const dateInt = parseInt(dateString);
    res.json({ 
      unix: dateInt, 
      utc: new Date(dateInt).toUTCString() 
    });
  } else {
    let dateObject = new Date(dateString);
    if (dateObject.toString() === "Error: Invalid Date") {
      res.json({ 
        error: "Error: Invalid Date" 
      });
    } else {
      res.json({ 
        unix: dateObject.valueOf(), 
        utc: dateObject.toUTCString() 
      });
    }
  }
});

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
