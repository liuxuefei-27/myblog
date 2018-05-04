<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;我的博客</span>
    </common-header>
    <user-blog></user-blog>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/CommonHeader'
  import CommonFooter from '@/components/CommonFooter'
  import UserBlog from '@/components/UserBlog'
  export default {
    name: "blog-list",
    data(){
      return{

      }
    },
    components:{
      CommonHeader,
      CommonFooter,
      UserBlog
    }
  }
</script>
