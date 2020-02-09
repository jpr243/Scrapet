# Scrapet

var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

//var Comments = require("../models/Comments.js");
//var Articles = require("../models/Articles.js");

//app.get("/", function(req, res) {
// res.redirect("/articles");
//});

//app.get("/scrape", function(req, res) {
axios.get("https://www.perthnow.com.au/").then(function(response) {
  var $ = cheerio.load(response.data);
  var results = [];

  $(".Card-HeadlineText").each(function(i, element) {
    var title = $(element)
      .text()
      .trim();
    var link = $(element).attr("href");

    if (title.length == 0) {
      return;
    }

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  console.log(results);
});


 var link = $(element).children("a").attr("href");

      if(result.title !== "" && result.link !== ""){

        if (titlesArray.indexOf(result.title) == -1){
            titlesArray.push(results.title);

            Articles.count({ title: result.title }, function(err, test) {
                if (test === 0){
                    var entry = new Articles(result);

                    entry.save(function(err, doc){
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(doc);
                        }
                    })
                }
            })

        } else {
            console.log("Article already exists.");

      } else {
          console.log("Not saved to DB, missing data");

      }
    });
    res.redirect("/");
  });
});