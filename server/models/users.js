var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "userPic":String,
  "blogList":[
    {
      "blogId":String,
      "title":String,
      "content":String,
      "createDate":String,
      "noticeNum":Number,
      "commentNum":Number,
      "commentList":[
        {
          "commentId":String,
          "commentAuthor":String,
          "commentAuthorPic":String,
          "commentContent":String,
          "commentDate":String
        }
      ],
      "tags":String
    }
  ]
});
module.exports = mongoose.model('User',userSchema);
