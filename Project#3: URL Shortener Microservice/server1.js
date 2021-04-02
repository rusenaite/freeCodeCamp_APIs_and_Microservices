//server.js

const express     = require('express');
const bodyParser  = require("body-parser");
const mongoose    = require('mongoose');
const mongo       = require('mongodb');
const cors        = require('cors');
const dns         = require('dns');
const urlParser   = require('url');
const app         = express();
require('dotenv').config();

// Basic Configuration
const port = process.env.PORT || 3000;
const mongodb = process.env.DB_URI;

//connecting to the database
mongoose.connect(process.env.DB_URI, {
  userNewUrlParser: true,
  UseUnifiedTopology: true
});
const db = mongoose.connect;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () =>{
  console.log("MongoDB database connected successfully.");
})
console.log(mongoose.connection.readyState);

//defining URL model
const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: String,
  short_url: String
});
const URLmodel = mongoose.model('Url', urlSchema);

app.use(bodyParser.urlencoded({
  extended: false
}));

//-----------------------------------------------

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//-----------------------------------------------
//API post and get methods

const urls = [];
let ID = 0;
app.post('/api/shorturl/new', (req, res) => {
  const { url } = req.body;
  const cleanedUrl = url.replace(/^https?:\/\//,'');
  //validation of url
  dns.lookup(cleanedUrl, (err) => {
    if(err) {
      return res.json({ err: "invalid URL" });
    } else {
      ++ID;
      const newUrl = {
        original_url: url,
        short_url: ID
      };
      urls.push(newUrl);
      console.log(urls);
      return res.json(newUrl);
    };
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const newUrl = urls.find(link => link.short_url === ID)
  URL.findById(id, (err, data) => {
    if(!newUrl) {
      res.json({ error: "Invalid URL" });
    } else {
      //redirect to the ID
      return res.redirect(newUrl.original_url);
    }
  });
});

//-----------------------------------------------

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
