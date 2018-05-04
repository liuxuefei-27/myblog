<template>
  <div class="blogBox">
    <div class="blogMainContent">
      <ul class="clearfix">
        <li v-for="(userBlog,index) in filterUserBlogs" @click="goToBlogDetail(userBlog)">
          <div class="blogHead clearfix">
            <img :src="'./../../blog/static/'+userPic" alt="" class="authorHead" v-rainbow="'active'">
            <span class="authorName">{{userName}}</span>
            <span class="createTime">{{userBlog.createDate.substring(0,10)+" "+userBlog.createDate.substring(11,19)}}</span>
          </div>
          <div class="tags">
            {{userBlog.tags}}
          </div>
          <div class="blogInfo">
            <span class="blogTitle">{{userBlog.title}}</span>
            <span class="blogContent">{{userBlog.content}}</span>
          </div>
          <div class="blogState">
            <div class="commentIcon">
              <i class="icon iconfont icon-pinglun"></i>
              <span class="commentNum">{{userBlog.commentNum}}</span>
            </div>
            <div class="noticeIcon">
              <i class="icon iconfont icon-xiazai13"></i>
              <span class="noticeNum">{{userBlog.noticeNum}}</span>
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
  </div>
</template>

<script>
  import '@/assets/css/blog.css';
  import axios from 'axios';
  import {mapState} from 'vuex';
  export default {
    name: "user-blog",
    data(){
      return{
        controlArr:['上一页','下一页'],
        curControlIndex:0,
        filterMenuArr:['All','HTML','CSS','Javascript','Vue','React'],
        curFilterIndex:0,
        showAsideMenu:false,
        userBlogList:[],
        page:0,
        pageSize:4,
        sort:1,
        tags:'',
        blogCount:0,
        loading:false,
        userName:'',
        userPic:''
      }
    },
    mounted(){
      this.getUserBlogList();
      if(this.isLogin){
        this.getUserBlogList();
      }
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
      ...mapState(['isLogin','keyWords']),
      //搜索过滤
      filterUserBlogs(){
        var reg = new RegExp(this.keyWords,'i');
        var reg1 = new RegExp(this.tags,'i');
        if(this.keyWords){
          return this.userBlogList.filter(blog=>{
            return blog.title.match(reg);
          });
        }
        if(this.tags!=''||this.tags!=null){
          return this.userBlogList.filter(function (blog) {
            return blog.title.match(reg1);
          });
        }
      }
    },
    components:{

    },
    methods:{
      //获取用户博客列表
      getUserBlogList() {
        this.userBlogList = [];
        axios.get("/blogApi/getUserBlog")
        .then(response => {
          this.loading = true;
          var res = response.data;
          if (res.status == '0') {
            if (res.result.count > 0) {
              this.blogCount = parseInt(res.result.count);
              this.userName = res.result.userName;
              this.userPic = res.result.userPic;
              setTimeout(() => {
                this.loading = false;
                this.userBlogList = res.result.blogList.slice(this.pageSize*this.page,this.pageSize*(this.page+1));
              }, 500);
            }else{
              this.loading = false;
              console.log(res.msg);
            }
          } else {
            this.loading = false;
            console.log(res.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err.message);
        })
      },
      //标签过滤
      filterBlog(tags,index){
        this.curFilterIndex=index;
        if(tags=='All'){
          this.tags = '';
        }else{
          this.tags = tags;
        }
      },
      //分页
      pagination(index){
        this.curControlIndex=index;
        if(index==0){
          if(this.page<=0){
            return;
          }
          this.page--;
          this.getUserBlogList();
        }else if(index == 1){
          if((this.blogCount-this.pageSize*(this.page-1))<0||this.blogCount<this.pageSize){
            return;
          }
          this.page++;
          this.getUserBlogList();
        }
      },
      //跳转到详情页
      goToBlogDetail(userBlog){
        this.$store.commit("updateAuthor",this.userName);
        this.$store.commit("updateBlogId",userBlog.blogId);
        this.$router.push({
          path:'/blogDetail',
          query:{
            author:this.userName,
            blogId:userBlog.blogId
          }
        });
      }
    }
  }
</script>
