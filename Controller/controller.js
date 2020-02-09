//Dependencies

var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var axios = require("axios");

//Require all models

var db = require("../models");

//Scraper

module.exports = router => {
  //Get scraped articles
  router.get("/scrape", (req, res) => {
    axios.get("https://www.perthnow.com.au/").then(response => {
      // Load the HTML into cheerio and save it to a variable
      var $ = cheerio.load(response.data);
      var results = {};
      $(".LandscapeStackedCard").each((i, element) => {
        //Headline - Title
        results.title = $(element)
          .find(".Card-HeadlineText")
          .text()
          .trim();
        //Article Link
        results.link = $(element).attr("href");
        //Article Summary
        results.summary = $(element)
          .find($(".Card-Teaser"))
          .text()
          .trim();
        //Article Section
        db.Article.create(results)
          .then(dbArticle => res.json(dbArticle))
          .catch(err => res.json(err));
      });
      res.redirect("/articles");
    });
  });

  //Get Home

  router.get("/", (req, res) => res.render("scrape"));

  //Get articles from DB

  router.get("/articles", (req, res) => {
    db.Article.find()
      .sort({ _id: -1 })
      .limit(6)
      .exec((err, doc) => {
        if (err) {
          res.json(err);
        } else {
          var article = { article: doc };
          res.render("index", article);
        }
      });
  });

  //Get saved articles

  router.get("/saved", (req, res) => {
    db.Article.find({ saved: true }, (error, result) => {
      if (error) {
        res.json(err);
      } else {
        res.render("saved", {
          article: result
        });
      }
    }).sort({ _id: -1 });
  });

  //Put status from false to true

  router.put("/savedarticles/:id", (req, res) => {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { saved: true } },
      { new: true }
    )
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  //Clear all

  router.delete("/clear", (req, res) => {
    db.Article.deleteMany({})
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  //Get article and populate with comment

  router.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  //Post comment

  router.post("/articles/:id", (req, res) => {
    db.Comment.create(req.body)
      .then(dbComment => {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { comment: dbComment._id },
          { new: true }
        );
      })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });
};
