import Vue from 'vue'
import Router from 'vue-router'
// import CommonHeader from '@/components/CommonHeader'
// import CommonFooter from '@/components/CommonFooter'
import Home from '@/views/Home'
import MyBlog from '@/views/MyBlog'
import MyResume from '@/views/MyResume'
import ContactWay from '@/views/ContactWay'
import BlogDetail from '@/views/BlogDetail'
Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/blog',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/myBlog',
      name: 'MyBlog',
      component: MyBlog
    },
    {
      path: '/myResume',
      name: 'MyResume',
      component: MyResume
    },
    {
      path: '/contactWay',
      name: 'ContactWay',
      component: ContactWay
    },
    {
      path: '/blogDetail',
      name: 'BlogDetail',
      component: BlogDetail
    }
  ]
})
