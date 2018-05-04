<template>
  <div>
    <div class="headerBox">
      <carousel-3d>
        <slide v-for="(item,index) in bannerImg" :index="index">
          <a href="javascript:;"><img :src="'./../../blog/static/'+item" alt=""></a>
        </slide>
      </carousel-3d>
    </div>
    <div class="headerMenu">
      <div class="searchBox">
        <input type="text" class="searchBar" placeholder="请输入搜索关键词" v-model="keywords" @keyup.enter="searchBlog"/>
        <button class="searchBtn" @click="searchBlog">搜索</button>
      </div>
      <div class="menuBox">
        <router-link to="/" exact>首页</router-link>
        <router-link to="/myBlog" exact>我的博客</router-link>
        <router-link to="/myResume" exact>站长简历</router-link>
        <router-link to="/contactWay" exact>联系站长</router-link>
      </div>
    </div>
    <div class="breadState">
      <div class="locationState">
        <a href="javascript:;" class="defaultState">首页</a>
        <slot name="locationName"></slot>
      </div>
      <div class="loginState">
        <a href="javascript:;" @click="loginFlag=true" v-if="!isLogin">登录</a>
        <a href="javascript:;" @click="regFlag=true" v-if="!isLogin">注册</a>
        <span class="nickName" v-if="isLogin">{{nickName}}</span>
        <a href="javascript:;" v-if="isLogin" @click="userLogout">退出</a>
        <a href="javascript:;" v-if="isLogin" @click="addBlogFlag=true">发布博客</a>
      </div>
    </div>
    <div class="overLay" v-if="loginFlag" @click="loginFlag=false"></div>
    <div class="overLay" v-if="regFlag" @click="regFlag=false"></div>
    <div class="overLay" v-if="addBlogFlag" @click="addBlogFlag=false"></div>
    <div class="loginBox" v-if="loginFlag" :class="{'showLoginBox':loginFlag}">
      <span class="labelTxt">Login in</span>
      <span class="errorMsg" v-if="errMsg">用户名或者密码错误!</span>
      <div class="inputTxt">
        <input type="text" class="userName" placeholder="User Name" v-model="users.userName" @keyup.enter="userLogin"/>
      </div>
      <div class="inputTxt">
        <input type="password" class="pwd" placeholder="Password" v-model="users.userPwd" @keyup.enter="userLogin"/>
      </div>
      <button class="loginBtn" @click="userLogin">登录</button>
      <span class="closeBtn" @click="loginFlag=false">X</span>
    </div>
    <div class="regBox" v-if="regFlag" :class="{'showRegBox':regFlag}">
      <span class="labelTxt">Reg in</span>
      <span class="errorMsg" v-if="errMsg1">请输入用户名和密码以及上传头像！</span>
      <div class="inputTxt1">
        <input type="text" class="userName" placeholder="User Name" v-model="users.userName" @keyup.enter="userReg"/>
      </div>
      <div class="inputTxt1">
        <input type="password" class="pwd" placeholder="Password" v-model="users.userPwd" @keyup.enter="userReg"/>
      </div>
      <div class="inputTxt1">
        <input class="file" type="file" name="file" accept="image/png,image/gif,image/jpeg" @change="onFileChange"/>
      </div>
      <div class="inputTxt1">
        <Verify @success="alert('success')" @error="alert('error')" :type="3"></Verify>
      </div>
      <button class="regBtn" @click="userReg">注册</button>
      <span class="closeBtn" @click="regFlag=false">X</span>
    </div>
    <div class="addBlogBox" v-if="addBlogFlag" :class="{'showAddBlogBox':addBlogFlag}">
      <span class="labelTxt">Add blog</span>
      <span class="errorMsg" v-if="errMsg2">博客标题、内容或者标签不能为空!</span>
      <div class="inputTxt2">
        <input type="text" class="myBlogTitle" placeholder="博客标题" v-model="title"/>
      </div>
      <div class="inputTxt2">
        <textarea class="myBlogContent" cols="30" rows="5" placeholder="博客内容" v-model="content"></textarea>
      </div>
      <div class="inputTxt2">
        <input type="text" class="myBlogTags" placeholder="博客标签" v-model="tags" @keyup.enter="addBlog"/>
      </div>
      <button class="addBlogBtn" @click="addBlog">发布博客</button>
      <span class="closeBtn" @click="addBlogFlag=false">X</span>
    </div>
  </div>
</template>
<script>
    import { Carousel3d, Slide } from 'vue-carousel-3d';
    import './../assets/css/common.css';
    import axios from 'axios';
    import {mapState} from 'vuex';
    import Verify from 'vue2-verify';
    export default {
        name: "common-header",
      data () {
        return {
          bannerImg:['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg'],
          keywords:'',
          isLogin:false,
          loginFlag:false,
          regFlag:false,
          errMsg:false,
          errMsg1:false,
          errMsg2:false,
          users:{
            userName:'',
            userPwd:'',
            photo:null,
            code:''
          },
          addBlogFlag:false,
          title:'',
          content:'',
          tags:''
        }
      },
      mounted(){
        this.checkLogin();
      },
      computed:{
        ...mapState(['nickName'])
      },
      components: {
        Carousel3d,
        Slide,
        Verify
      },
      methods:{
        //提交搜索的关键词到store
        searchBlog(){
          this.$store.commit('updateKeyWords',this.keywords);
        },
        //检查是否登录
        checkLogin(){
          axios.get("/blogApi/checkLogin")
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                this.isLogin = true;
                this.$store.commit("updateUserInfo",res.result);
              }else{
                console.log(res.msg);
                this.isLogin = false;
              }
            })
            .catch(err=>{
              console.log(err.message);
            })
        },
        //用户登录
        userLogin(){
          if(!this.users.userName||!this.users.userPwd){
            this.errMsg = true;
            return;
          }
          axios.post("/blogApi/login",{
            userName:this.users.userName,
            userPwd:this.users.userPwd
          })
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                this.errMsg = false;
                this.loginFlag = false;
                this.isLogin = true;
                this.$store.commit("updateIsLogin",true);
                this.$store.commit("updateUserInfo",res.result.userName);
              }else{
                console.log(res.msg);
              }
            })
            .catch(err=>{
              console.log(err.message);
            })
        },
        //用户登出
        userLogout(){
          axios.post("/blogApi/logout")
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                this.isLogin = false;
                this.$store.commit("updateUserInfo",'');
              }
            })
            .catch(err=>{
              console.log(err.message);
            })
        },
        //上传头像
        onFileChange(e){
          var files = e.target.files || e.dataTransfer.files;
          if(!files.length)return;
          this.users.photo = files[0];
        },
        //滑动验证
        alert(text) {
          console.log(text);
          this.users.code = text;
        },
        //用户注册
        userReg(){
          var form = new FormData();
          for(var key in this.users){ //读取data中所要上传的内容循环append到form中
            if(key){
              form.append(key,this.users[key]);
            }
          }
          //添加请求头
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          };
          if(!this.users.userName||!this.users.userPwd||!this.users.photo){
            this.errMsg1 = true;
            return;
          }
          axios.post('/blogApi/userReg',form,config)
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.regFlag = false;
              alert(res.result);
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
        },
        //发布博客
        addBlog(){
          if(!this.title||!this.content||!this.tags){
            this.errMsg2 = true;
            return;
          }
          axios.post("/blogApi/addBlog",{
            title:this.title,
            content:this.content,
            tags:this.tags
          })
            .then(response=>{
              let res = response.data;
              if(res.status == '0'){
                alert(res.result);
                this.addBlogFlag = false;
              }else{
                console.log(res.msg);
              }
            })
            .catch(err=>{
              console.log(err.message);
            })
        }
      }
    }
</script>
