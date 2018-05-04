<template>
  <div class="blogBox">
    <div class="blogMainContent">
      <ul class="clearfix">
        <li v-for="(blog,index) in filterBlogs" @click="goToBlogDetail(blog)">
          <div class="blogHead clearfix">
            <img :src="'./../../blog/static/'+blog.authorPic" alt="" class="authorHead" v-rainbow="'active'">
            <span class="authorName">{{blog.author}}</span>
            <span class="createTime">{{blog.createDate.substring(0,10)+" "+blog.createDate.substring(11,19)}}</span>
          </div>
          <div class="tags">
            {{blog.tags}}
          </div>
          <div class="blogInfo">
            <span class="blogTitle">{{blog.title}}</span>
            <span class="blogContent">{{blog.content}}</span>
          </div>
          <div class="blogState">
            <div class="commentIcon">
              <i class="icon iconfont icon-pinglun" @click.stop="commentPop(blog)"></i>
              <span class="commentNum">{{blog.commentNum}}</span>
            </div>
            <div class="noticeIcon">
              <i class="icon iconfont icon-xiazai13" @click.stop="editNotice(blog,index)" :class="{'noticeActive':noticeFlag && curBlogIndex==index}"></i>
              <span class="noticeNum">{{blog.noticeNum}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="controlBar">
        <span v-for="(controlBtn,index) in controlArr" @click="pagination(index)" class="controlBtn" :class="{'activeControl':curControlIndex==index}">{{controlBtn}}</span>
      </div>
      <img src="./../../static/loading/loading-spin.svg" alt="" v-show="loading" class="loadingState"/>
    </div>
    <div class="asideMenu">
      <div class="filterMenu" :class="showAsideMenu?'filterAnimation1':'filterAnimation2'">
        <ul>
          <li v-for="(tags,index) in filterMenuArr" @click="filterBlog(tags,index)" :class="{'activeFilter':curFilterIndex==index}">{{tags}}</li>
        </ul>
      </div>
      <div class="transformIcon" @click="showAsideMenu=!showAsideMenu">
        <i class="icon iconfont icon-dayuhao"></i>
      </div>
    </div>
    <div class="overLay" v-if="commentFlag" @click="commentFlag=false"></div>
    <div class="commentBox" v-if="commentFlag" :class="{'showCommentBox':commentFlag}">
      <span class="labelTxt">Add comment</span>
      <span class="errorMsg" v-if="errMsg">评论内容不能为空！</span>
      <div class="inputTxt">
        <textarea class="commentContent" cols="30" rows="5" v-model="commentContent" placeholder="请输入评论内容！"></textarea>
      </div>
      <button class="commentBtn" @click="addComment">提交</button>
      <span class="closeBtn" @click="commentFlag=false">X</span>
    </div>
  </div>
</template>

<script>
   import '@/assets/css/blog.css';
   import axios from 'axios';
   import {mapState} from 'vuex';
    export default {
        name: "all-blog",
        data(){
          return{
            controlArr:['上一页','下一页'],
            curControlIndex:0,
            filterMenuArr:['All','HTML','CSS','Javascript','Vue','React'],
            curFilterIndex:0,
            showAsideMenu:false,
            blogList:[],
            page:1,
            pageSize:4,
            sort:1,
            tags:'',
            blogCount:0,
            loading:false,
            noticeFlag:false,
            curBlogIndex:0,
            commentFlag:false,
            commentContent:'',
            commentNum:0,
            author:'',
            blogId:'',
            errMsg:false
          }
        },
        mounted(){
          this.getBlogList();
          //全局拦截器
          // axios.interceptors.request.use(config=>{
          //   this.loading = true;
          //   return config;
          // },error => {
          //   return Promise.reject(error);
          // });
        },
        filters:{

        },
        computed:{
          ...mapState(['keyWords','nickName']),
          //搜索过滤
          filterBlogs(){
            var reg = new RegExp(this.keyWords,'i');
            return this.blogList.filter(blog=>{
              return blog.title.match(reg);
            });
          }
        },
        components:{

        },
        methods:{
          //获取全部博客列表
          getBlogList(){
            this.blogList = [];
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sort,
              tags:this.tags
            };
            axios.get("/blogApi/getAllBlog",{
              params:param
            })
            .then(response=>{
              this.loading = true;
              var res = response.data;
              if(res.status == '0'){
                if(res.result.count>0){
                  this.blogCount = parseInt(res.result.count);
                  setTimeout(()=>{
                    this.loading = false;
                    this.blogList = res.result.blogList;
                  },500);
                }else{
                  this.loading = false;
                  console.log(res.msg);
                }
              }else{
                this.loading = false;
                console.log(res.msg);
              }
            })
            .catch(err=>{
              this.loading = false;
              console.log(err.message);
            })
          },
          //分页
          pagination(index){
            this.curControlIndex=index;
            if(index==0){
              if(this.page<=1){
                return;
              }
              this.page--;
              this.getBlogList();
            }else if(index == 1){
              if((this.blogCount-this.pageSize*(this.page-1))<0||this.blogCount<this.pageSize){
                return;
              }
              this.page++;
              this.getBlogList();
            }
          },
          //标签过滤
          filterBlog(tags,index){
            this.curFilterIndex=index;
            this.page = 1;
            if(tags=='All'){
              this.tags = '';
            }else{
              this.tags = tags;
            }
            this.getBlogList();
          },
          //点击关注
          editNotice(blog,index){
            this.noticeFlag = !this.noticeFlag;
            this.curBlogIndex = index;
            let author = blog.author;
            let blogId = blog.blogId;
            let noticeNum = 0;
            if(this.noticeFlag){
              if(!this.nickName){
                return;
              }
              noticeNum = blog.noticeNum + 1;
              axios.post("/blogApi/addNotice",{
                author:author,
                blogId:blogId,
                noticeNum:noticeNum
              })
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.getBlogList();
                }else{
                  console.log(res.msg);
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
            }else{
              if(!this.nickName){
                return;
              }
              noticeNum = blog.noticeNum - 1;
              axios.post("/blogApi/offNotice",{
                author:author,
                blogId:blogId,
                noticeNum:noticeNum
              })
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.getBlogList();
                }else{
                  console.log(res.msg);
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
            }
          },
          //点击评论
          commentPop(blog){
            if(!this.nickName){
              return;
            }
            this.commentFlag = true;
            this.commentNum = blog.commentNum + 1;
            this.author = blog.author;
            this.blogId = blog.blogId;
          },
          //发布评论
          addComment(){
            if(!this.commentContent){
              this.errMsg = true;
              return;
            }
            axios.post("/blogApi/addComment",{
              author:this.author,
              blogId:this.blogId,
              commentNum:this.commentNum,
              commentContent:this.commentContent
            })
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                alert(res.result);
                this.getBlogList();
                this.commentFlag = false;
              }else{
                console.log(res.msg);
              }
            })
            .catch(err=>{
              console.log(err.message);
            })
          },
          //跳转到博客详情页
          goToBlogDetail(blog){
            this.$store.commit("updateAuthor",blog.author);
            this.$store.commit("updateBlogId",blog.blogId);
            this.$router.push({
              path:'/blogDetail'
            });
          }
        }
    }
</script>
