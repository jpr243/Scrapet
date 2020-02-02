//Dependencies

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var bodyParser = require("body-parser");
var logger = require("morgan");

//Initialise Express
var app = express();

app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(process.cwd() + "/public"));

//Handlebars
app.engine(
  "handlebars:",
  exphbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/layouts/partials"
  })
);
app.set("view engine", "handlebars");

//Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//var routes = require("./Controller/controller.js");
//app.use("/", routes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on PORT" + port);
});
