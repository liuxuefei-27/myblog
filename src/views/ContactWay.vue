<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;联系站长</span>
    </common-header>
    <div class="contactWayMainContent">
      <div class="contactWayBox">
        <div class="myPic1"></div>
        <div class="myInfo">
          <ul>
            <li>
              <span class="leftTxt">邮箱：</span>
              <span class="infoDetail">13361653754@163.com</span>
            </li>
            <li>
              <span class="leftTxt">QQ：</span>
              <span class="infoDetail">2467851745</span>
            </li>
            <li>
              <span class="leftTxt">微信：</span>
              <span class="infoDetail">liuxuefei3754</span>
            </li>
            <li>
              <span class="leftTxt">学校：</span>
              <span class="infoDetail">江西农业大学</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/CommonHeader'
  import CommonFooter from '@/components/CommonFooter'
  import './../assets/css/contactWay.css'
  export default {
    name: "contact-way",
    data(){
      return{

      }
    },
    components:{
      CommonHeader,
      CommonFooter
    }
  }
</script>
