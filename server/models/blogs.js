var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
  "blogId":String,
  "title":String,
  "content":String,
  "author":String,
  "authorPic":String,
  "createDate":String,
  "noticeNum":Number,
  "commentNum":Number,
  "tags":String
});
module.exports = mongoose.model('Blog',blogSchema);
