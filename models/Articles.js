var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticlesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Article = mongoose.model("Article", ArticlesSchema);
module.exports = Articles;
