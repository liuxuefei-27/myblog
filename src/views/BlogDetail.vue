<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;博客详情</span>
    </common-header>
    <blog-detail-component></blog-detail-component>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/CommonHeader'
  import CommonFooter from '@/components/CommonFooter'
  import BlogDetailComponent from '@/components/BlogDetailComponent'
  export default {
    name: "blog-detail",
    data(){
      return{

      }
    },
    components:{
      CommonHeader,
      CommonFooter,
      BlogDetailComponent
    }
  }
</script>
