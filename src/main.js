// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Carousel3d from 'vue-carousel-3d';
import './assets/iconfont/iconfont.css'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Carousel3d);
Vue.use(Vuex);
//自定义全局指令
Vue.directive('rainbow',{
  bind(el,binding,vnode){
    if(binding.value == 'active'){
      el.style.borderColor = "#" + Math.random().toString(16).slice(2,8);
    }
  }
});
//Vuex
const store = new Vuex.Store({
  state:{
    isLogin:'false',
    nickName:'',
    keyWords:'',
    author:'',
    blogId:''
  },
  mutations:{
    updateIsLogin(state,isLogin){
      state.isLogin = isLogin;
    },
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateKeyWords(state,keywords){
      state.keyWords = keywords;
    },
    updateAuthor(state,author){
      state.author = author;
    },
    updateBlogId(state,blogId){
      state.blogId = blogId;
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
