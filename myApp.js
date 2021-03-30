var express = require('express');
var app = express();

// 7) Implement a Root-Level Request Logger Middleware.------------
// example: GET /json - ::ffff:127.0.0.1

app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// 1) Meet the Node console.---------------------------------------
console.log("Hello World");

// 2) A first working Express Server. -----------------------------
/*
app.get("/", function(req, res) {
  res.send("Hello Express");
});
*/

// 3) Serve an HTML file.------------------------------------------
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// 4) Serve static assets.-----------------------------------------
app.use("/public", express.static(__dirname + "/public"));

// 5) Serve JSON on a specific route.------------------------------
/*
app.get("/json", (req, res) => {
  res.json({
    "message": "Hello json"
  });
});
*/

// 6) Use the .env file.-------------------------------------------
app.get("/json",(req,res) => {
  process.env.MESSAGE_STYLE=="uppercase" ? res.json({
    "message": "Hello json".toUpperCase()
  }) : res.json({
    "message": "Hello json"
  })}
);


// 7) Root-level Middleware - A logger (above everything).---------
// example from the logs: 'GET /public/style.css - x.x.x.x'

//8) Chain Middleware to Create a Time Server.---------------------
/* Middleware can be mounted at a specific route using 
   app.METHOD(path, middlewareFunction). 
   Middleware can also be chained inside route definition. */


app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
    res.send({"time": req.time});
  }
);




 module.exports = app;
