<template>
    <div>
      <common-header></common-header>
      <all-blog></all-blog>
      <common-footer></common-footer>
    </div>
</template>

<script>
    import CommonHeader from '@/components/CommonHeader'
    import CommonFooter from '@/components/CommonFooter'
    import AllBlog from '@/components/AllBlog'
    export default {
        name: "home",
        data(){
          return{

          }
        },
        components:{
          CommonHeader,
          CommonFooter,
          AllBlog
        }
    }
</script>
