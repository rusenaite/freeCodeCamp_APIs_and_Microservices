//server.js

const express     = require('express');
const bodyParser  = require("body-parser");
const mongoose    = require('mongoose');
//const cors        = require('cors');
//const dns         = require('dns');
//const urlParser   = require('url');

const validUrl    = require("valid-url");
const shortid     = require("shortid");


const app         = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const db = process.env.DB_URI;

let host = "https://boilerplate-project-urlshortener-2.rusenaite.repl.co/";

require('dotenv').config();

//setting static folder
app.use(express.static('public'));

//parsing application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//connecting to the database
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//if error
mongoose.connection.on('error', (err) => {
  console.log('Connection Error: ${err}');
});
//if connected
mongoose.connection.on('connected', () => {
  console.log("MongoDB database connected successfully.");
});

//defining URL model
let userUrlSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  original_url: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});
let UserUrl = mongoose.model('UserUrl', userUrlSchema);

//-----------------------------------------------

//app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//index route
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ 
    greeting: 'hello API' 
  });
});

//-----------------------------------------------
//API post and get methods

//CHANGE AFTER SUBMITTING
//app.post('/new/:url', (req, res) => {

app.post('/new/:url(*)', (req, res) => {
  let url = req.body.url;
  console.log(req.body.url);
  //let cleanedUrl = url.replace(/^https?:\/\//, '');
  let cleanedUrl = "";
  
  //validation of url
  if(validUrl.isUri(url)) {
    UserUrl.findOne({ original_url: url }, (err, doc) => {
      if(doc) {
        let short = '${host}${doc._id}';
        res.send({
          "original_url": url,
          "short_url": short
        });
      } else {
        let newUrl = new UserUrl({
          original_url: url
        });
        
        //saving the new link
        newUrl.save((err) => {
          if(err) {
            //console.log(err);
            res.send({ err: "invalid URL" });
          }
        });
        
        cleanedUrl = '${host}${newUrl._id}';
        res.send({
          "original_url": url,
          "short_url": cleanedUrl
        });
      }
    });
  } else {
      res.send({ "error": "invalid Url" });
  }
});

//redirecting the user

//CHANGE AFTER SUBMITTING
//app.get('/:id', (req, res) => {

app.get('/:short_id', (req, res) => {
  let short_id = req.params.short_id;
  
  //find short url from the database
  UserUrl.findOne({_id: short_id}, (err, doc) => {
    if(doc) {
      return res.redirect(doc.original_url);
    } else {
      res.json({ "error": "Invalid URL" }); 
      //res.redirect('${host}');
    }
  });
});

//-----------------------------------------------

//catching all urls
app.get("*", (req, res) => {
  res.redirect('${host}');
});


app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
