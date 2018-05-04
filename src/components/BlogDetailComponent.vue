<template>
  <div class="detailBox">
    <div class="blogDetailBox">
      <div class="detailMainContent">
        <span class="blogHeadTxt">博客详情</span>
        <div class="blogHead clearfix">
          <img :src="'./../../blog/static/'+authorPic" alt="" class="authorHead" v-rainbow="'active'">
          <span class="authorName">{{author}}</span>
          <span class="createTime">{{createDate}}</span>
        </div>
        <div class="tags">
          {{curBlog.tags}}
        </div>
        <div class="blogInfo">
          <span class="blogTitle">{{curBlog.title}}</span>
          <span class="blogContent">{{curBlog.content}}</span>
        </div>
        <div class="blogState">
          <div class="commentIcon">
            <i class="icon iconfont icon-pinglun"></i>
            <span class="commentNum">{{curBlog.commentNum}}</span>
          </div>
          <div class="noticeIcon">
            <i class="icon iconfont icon-xiazai13"></i>
            <span class="noticeNum">{{curBlog.noticeNum}}</span>
          </div>
        </div>
      </div>
      <div class="commentMainContent">
        <span class="commentHeadTxt">评论列表</span>
        <ul>
          <li v-for="comment in commentList">
            <div class="commentHead clearfix">
              <img :src="'./../../blog/static/'+comment.commentAuthorPic" alt="" class="commentAuthorPic" v-rainbow="'active'">
              <span class="commentAuthor">{{comment.commentAuthor}}</span>
              <span class="commentDate">{{comment.commentDate.substring(0,10)+" "+comment.commentDate.substring(11,19)}}</span>
            </div>
            <div class="commentContent">{{comment.commentContent}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
    import '@/assets/css/blogDetail.css';
    import axios from 'axios';
    import {mapState} from 'vuex';
    export default {
        name: "blog-detail-component",
        data(){
            return{
              authorPic:'',
              curBlog:{},
              createDate:'',
              commentList:[]
            }
        },
        mounted(){
          this.getBlogDetail();
        },
        computed:{
          ...mapState(['author','blogId'])
        },
        methods:{
          //获取博客详情
          getBlogDetail(){
            let author = this.author;
            let blogId = this.blogId;
            var param = {
              userName:author,
              blogId:blogId
            };
            axios.get("/blogApi/getBlogDetail",{
              params:param
            })
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                this.authorPic = res.result.authorPic;
                this.curBlog =  res.result.curBlog;
                this.createDate = this.curBlog.createDate.substring(0,10)+" "+this.curBlog.createDate.substring(11,19);
                this.commentList = this.curBlog.commentList;
              }
            })
          }
        }
    }
</script>
