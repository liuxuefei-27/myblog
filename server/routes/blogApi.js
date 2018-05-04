var express = require('express');//导入express
var router = express.Router();//导入路由
var formidable=require('formidable');//上传功能的插件
var path=require('path');
var fs=require('fs');
var mongoose = require('mongoose');//导入mongoose
var Users = require('./../models/users');//导入数据模型
var Blogs = require('./../models/blogs');
require('./../util/util');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/myblog');
//监听MongoDB数据库连接状态
mongoose.connection.on("connected",function(){
  console.log("MongoDB connected success.");
});
mongoose.connection.on("error",function(){
  console.log("MongoDB connected fail.");
});
mongoose.connection.on("disconnected",function(){
  console.log("MongoDB disconnected.");
});

//首页获取博客文章列表数据接口
router.get("/getAllBlog",function(req,res,next){
  //前端传递过来的请求参数
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let tags = req.param("tags");
  let reg = new RegExp(tags,'i');//不区分大小写
  //实现分页
  let skip = (page-1)*pageSize;
  //查询条件
  var params = {
    $or:[
      {tags:{$regex:reg}}
    ]
  };
  //开始查询
  let blogsModel = Blogs.find(params).skip(skip).limit(4);
  blogsModel.sort({'createDate':sort});
  blogsModel.exec(function(err,blogDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(blogDoc){
        res.json({
          status:'0',
          msg:'',
          result:{
            count:blogDoc.length,
            blogList:blogDoc
          }
        });
      }
    }
  });
});

//用户登录
router.post("/login",function(req,res,next){
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  var params = {
    userName:userName,
    userPwd:userPwd
  };
  Users.findOne(params,function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(userDoc){
        //cookie  在服务端  响应
        res.cookie("userId",userDoc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",userDoc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:userDoc.userName
          }
        });
      }
    }
  });
});

//用户注册
router.post("/userReg",function (req,res,next) {
  var uploadDir='./static/';
  var form=new formidable.IncomingForm();
  form.encoding='utf-8';//文件的编码格式
  form.uploadDir=uploadDir;//文件的上传路径
  form.extensions=true;//文件的后缀名
  form.maxFieldsSize = 2 * 1024 * 1024;//文件的大小限制
  form.parse(req,function(err,fields,files){
    //fields为上传文件string类型的信息
    //files为上传的文件
    var userName=fields.userName;
    var userPwd=fields.userPwd;
    var code = fields.code;
    var file=files.photo;
    var fileName=userName+file.name;
    var oldPath =path.normalize(file.path);//返回正确格式的路径
    var newPath=uploadDir+fileName;

    //生成用户Id
    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var userId = sysDate;

    //写入数据库的信息
    var userDoc = {
      userId:userId,
      userName:userName,
      userPwd:userPwd,
      userPic:fileName,
      blogList:[]
    };
    //将老的图片路径改为新的图片路径
    fs.rename(oldPath,newPath,function(err){
      if(err){
        console.error("改名失败"+err);
      }else {
        if(code == 'success'){
          Users.create(userDoc,function(err,doc){
            if (err) {
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            } else {
              if(doc){
                res.json({
                  status:'0',
                  msg:'',
                  result:'恭喜您注册成功！'+code
                });
              }
            }
          });
        }
      }
    });
  })
});

//用户登出
router.post('/logout',function(req,res,next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  });
  res.cookie("userName","",{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:'0',
    msg:'',
    result:''
  });
});

//检查用户是否登录
router.get('/checkLogin',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    if(userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName||''
      });
    }else{
      res.json({
        status:'1',
        msg:'未登录',
        result:''
      });
    }
  }
});

//获取当前用户的博客文章列表
router.get("/getUserBlog",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    Users.findOne({userId:userId},function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          res.json({
            status:'0',
            msg:'',
            result:{
              count:userDoc.blogList.length,
              blogList:userDoc.blogList,
              userName:userDoc.userName,
              userPic:userDoc.userPic
            }
          });
        }
      }
    });
  }
});

//添加关注
router.post("/addNotice",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    let blogId = req.body.blogId;
    let author = req.body.author;
    let noticeNum = req.body.noticeNum;
    Blogs.update({
      author:author,
      blogId:blogId
    },{$set:{noticeNum:noticeNum}},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(doc){
          Users.update({
            userName:author,
            'blogList.blogId':blogId
          },{'blogList.$.noticeNum':noticeNum},function(err1,doc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:''
              });
            }else{
              if(doc1){
                res.json({
                  status:'0',
                  msg:'',
                  result:'添加关注成功！'
                });
              }
            }
          });
        }
      }
    });
  }
});

//取消关注
router.post("/offNotice",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    let blogId = req.body.blogId;
    let author = req.body.author;
    let noticeNum = req.body.noticeNum;
    Blogs.update({
      author:author,
      blogId:blogId
    },{$set:{noticeNum:noticeNum}},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(doc){
          Users.update({
            userName:author,
            'blogList.blogId':blogId
          },{'blogList.$.noticeNum':noticeNum},function(err1,doc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:''
              });
            }else{
              if(doc1){
                res.json({
                  status:'0',
                  msg:'',
                  result:'取消关注成功！'
                });
              }
            }
          });
        }
      }
    });
  }
});

//添加评论
router.post("/addComment",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    //前端传递过来的参数
    let commentContent = req.body.commentContent;
    let commentNum = req.body.commentNum;
    let author = req.body.author;//被评论者相关参数
    let blogId = req.body.blogId;
    //评论者相关参数
    let commentAuthor = '';
    let commentAuthorPic = '';
    //生成评论Id
    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
    var commentDoc = {};
    Users.findOne({userId:userId},function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          commentAuthor = userDoc.userName;
          commentAuthorPic = userDoc.userPic;
          commentDoc = {
            commentId:sysDate,
            commentAuthor:commentAuthor,
            commentAuthorPic:commentAuthorPic,
            commentContent:commentContent,
            commentDate:createDate
          };
          Users.findOne({userName:author},function(err1,userDoc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:''
              });
            }else{
              if(userDoc1){
                userDoc1.blogList.forEach(function(item){
                  if(item.blogId == blogId){
                    item.commentList.push(commentDoc);
                    item.commentNum = commentNum;
                  }
                });
                userDoc1.save(function(err2,doc){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message,
                      result:''
                    });
                  }else{
                    if(doc){
                      Blogs.update({
                        blogId:blogId
                      },{$set:{commentNum:commentNum}},function(err3,doc1){
                        if(err3){
                          res.json({
                            status:'1',
                            msg:err2.message,
                            result:''
                          });
                        }else{
                          if(doc1){
                            res.json({
                              status:'0',
                              msg:'',
                              result:'评论成功！'
                            });
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
});

//获取博客详情
router.get("/getBlogDetail",function(req,res,next){
  let userName = req.param('userName');
  let blogId = req.param("blogId");
  Users.findOne({userName:userName},function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(userDoc){
        var curBlog = {};
        userDoc.blogList.filter(function(item){
          if(item.blogId == blogId){
            curBlog = item;
          }
        });
        res.json({
          status:'0',
          msg:'',
          result:{
            author:userDoc.userName,
            authorPic:userDoc.userPic,
            curBlog:curBlog
          }
        });
      }
    }
  });
});

//发布博客
router.post("/addBlog",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    //从前端传过来的参数
    let title = req.body.title;
    let content = req.body.content;
    let tags = req.body.tags;
    //生成blogId
    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
    let blog = {};
    Users.findOne({userId:userId},function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          blog = {
            blogId:sysDate,
            title:title,
            content:content,
            createDate:createDate,
            noticeNum:0,
            commentNum:0,
            commentList:[],
            tags:tags
          };
          userDoc.blogList.push(blog);
          userDoc.save(function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else{
              if(doc){
                blog = {
                  blogId:sysDate,
                  title:title,
                  content:content,
                  author:userDoc.userName,
                  authorPic:userDoc.userPic,
                  createDate:createDate,
                  noticeNum:0,
                  commentNum:0,
                  tags:tags
                };
                Blogs.create(blog,function(err2,doc1){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err.message,
                      result:''
                    });
                  }else{
                    if(doc1){
                      res.json({
                        status:'0',
                        msg:'',
                        result:'添加博客成功！'
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
});
module.exports = router;
