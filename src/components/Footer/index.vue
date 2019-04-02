<template>
  <div class="home-footer">
    <div class="footer-content f-cb">
      <div class="footer-left f-fl">
        <img src="@/assets/images/footer-logo.png" alt="">
        <p class="logo-desc">{{$t('footer.SafeAndProfessional')}}</p>
        <p class="copy">&copy; 2017-2019 ZZEX.PRO</p>
        <p>Singapore Zhizhi Technologies Ltd</p>
      </div>
      <div class="footer-right f-fr">
        <dl>
          <dt>{{$t('footer.CustomerService')}}</dt>
          <dd>
            <router-link to="/userAgreement">{{$t('footer.UserAgreement')}}</router-link>
          </dd>
          <!-- <dd>
            <a href="#">{{$t('footer.OnCurrencyApplication')}}</a>
          </dd> -->
          <dd>
            <a href="https://github.com/ZZEXPRO/ZZEX-API-Docs" target="_blank">{{$t('footer.APISupports')}}</a>
          </dd>
        </dl>
        <dl>
          <dt>{{$t('footer.HelpCenter')}}</dt>
          <dd>
            <a href="#/newsList">{{$t('footer.AnnouncementOfTheCenter')}}</a>
          </dd>
          <dd>
            <a href="#/feeList">{{$t('footer.Rate')}}</a>
          </dd>
        </dl>
        <dl>
          <dt>{{$t('footer.ContactUs')}}</dt>
          <dd>
            <a href="#">{{$t('footer.ServiceEmail')}}</a>
          </dd>
          <dd>
            <a href="#">{{$t('footer.BusinessEmail')}}</a>
          </dd>
          <dd class="icon-wrap">
            <a href="#" @click.prevent="">
              <i class="iconfont icon-weixin" 
                @mouseenter="wxImgShow=true"
                @mouseleave="wxImgShow=false"
                ></i>
            </a>
          </dd>
          <dd>
            <img src="../../assets/images/wxImg.png" alt="" v-show="wxImgShow" class="wx_img_style">
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      wxImgShow:false
    }
  }
}
</script>
<style scoped>
a{
  color: #faf7f4;
}
a:hover{
  color: #d98746;
}
.wx_img_style{
  position:relative;
  top: -150px;
  right: 100px;
  float: right
}
.home-footer .footer-content{
  color: #faf7f4;
}
.home-footer .footer-content .footer-right dl dt{
  color: #999;
}
.home-footer .footer-content .footer-right dl dd.icon-wrap i{
  font-size: 26px;
}
</style>

