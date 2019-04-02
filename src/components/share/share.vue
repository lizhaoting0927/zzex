<template>

  <div class="home-header">
 
    <div class="placeholder"></div>
    <div class="inner-header f-cb">
      <h1 class="head-logo f-fl">
        <router-link to="/">
          <img src="@/assets/images/logo.png" alt="ZZEX全球领先区块链数字资产交易平台">
        </router-link>
      </h1>
      <ul class="head-nav f-fl">
        <li >
          <!-- <a @click.prevent="toFabi">{{$t("header.FiatDeal")}}</a> -->
          <!-- <router-link to="/otc" :class="selectHeaderTab===0?'cur':''">{{$t("header.FiatDeal")}}</router-link> -->
          <a href="/Shequ/">法币交易</a>
        <li>
          <router-link to="/tradecenter" :class="selectHeaderTab===1?'cur':''">{{$t("header.Coins")}}</router-link>
        </li>
        <li>
          <a href="https://www.zzexcoin.com/">{{$t("header.ZZEXCoin")}}</a>
        </li>
        <li>
          <a href="/Shequ/">{{$t("header.Coinstration")}}</a>
        </li>
        <li>
          <a href="/Shequ/">最新活动</a>
        </li>
        <li>
          <a href="/Shequ/">邀请返佣</a>
        </li>
        <!-- <li>
          <a href="#/activity">{{$t("header.rank")}}</a>
        </li> -->
      </ul>
      <ul class="head-user f-fr">
        <li class="change-language">
         <a  @click.prevent="changeLanguage">{{lang|langFilter}}</a>
        </li>
      </ul>
      <ul class="head-user f-fr" id="headlogin" v-show="loginState">
        <li class="user li-asset-manager">
          <el-dropdown>
            <span class="el-dropdown-link" style="color:#b4c6ee;">
              {{$t('user.Assets')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top:20.5px;color:#b4c6ee">
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/myAssets">{{$t('user.MyAssets')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/addressManage">{{$t('user.Address')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/assetsRecord">{{$t('user.Financial')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/tradeBill">{{$t('user.Bills')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/myLockup">{{$t('user.LockPosition')}}</router-link></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="user li-user-center">
          <el-dropdown>
            <span class="el-dropdown-link" style="color:#b4c6ee;">
              {{m_name_hidden}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top:20.5px;color:#b4c6ee">
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/accountInfo">{{$t('user.AccountInfo')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/identityVerify">{{$t('user.Certification')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/accountSecurity">{{$t('user.AccountSecurity')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/loginRecord">{{$t('user.LoginRecord')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/apiManager">{{$t('user.APIManagement')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;" ><span @click="logoutClick">{{$t('user.LogOut')}}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
      <ul class="head-user f-fr" id="headlogout" v-show="!loginState">
        <li>
          <router-link to="/login">{{$t("header.Login")}}</router-link>
        </li>
        <li>
          <router-link to="/register">{{$t("header.Register")}}</router-link>
        </li>
      </ul>
    </div>
    <div class="banner"></div>



    <div class="main">
        <div class="top">
          <h1>我的分享方式</h1>
          <h2>通过专属链接或者邀请码邀请好友，好友交易时您将获得返佣，微信邀请好友时候请告知好友，在浏览器打开链接</h2>
          <dl class="done">
            <dd>专属邀请码</dd>
            <dt>
              <input type="text" readonly v-model="userInfo.uid">
              
              <button v-clipboard:copy="userInfo.uid">复制邀请码</button>
            </dt>
          </dl>
          <dl class="dtwo">
            <dd>专属注册链接</dd>
            <dt>
              <input type="text" v-model="href">
              <button v-clipboard:copy="href">复制分享链接</button>
            </dt>
          </dl>
        </div>
        <div class="center">
          <div class="top_left">
          <p @click="getdata">邀请人数</p>
          <p>邀请总人数<b>0</b></p>
          </div>
          <div class="top_right">
          <p>累计所得返佣</p>
          <p>0.00000<b>ZC</b></p>
          </div> 
        </div>
        <div class="invitationRecord">
          <div class="invitationRecord_head" style="cursor:pointer ">
            <span @click="cur=0" :class="{active:cur==0}">邀请记录</span>
            <span @click="cur=1" :class="{active:cur==1}">返佣记录</span>
          </div>
          <div class="tab-content">
              <div v-show="cur==0">内容一</div>
              <div v-show="cur==1">内容二</div>
          </div>
 
        </div> 
      <div class="activityRules">
      <h1>{{$t("activityRules.ActivityRules")}}</h1>
      <ul>
        <li>{{$t("activityRules.ActivityRulesOne")}}</li>
        <li>{{$t("activityRules.ActivityRulesTwo")}}</li>
        <li>{{$t("activityRules.ActivityRulesThree")}}</li>
        <li>{{$t("activityRules.ActivityRulesFour")}}</li>
        <li>{{$t("activityRules.ActivityRulesFive")}}</li>
      </ul>
      <p>{{$t("activityRules.RightofInterpretation")}}</p>
    </div> 
    </div>  

    

      <div class="home-footer">
      <div class="footer-content f-cb">
        <div class="footer-left f-fl">
          <img src="@/assets/images/footer-logo.png" alt="">
          <p class="logo-desc">{{$t('footer.SafeAndProfessional')}}</p>
          <p class="copy">&copy; 2017-2019 ZZEX.PRO</p>
          <p>Singapore Zhizhi Technologies Ltd</p>
        </div>
        <div class="footer-right f-fr" id="footer-right">
          <dl>
            <dt>{{$t('footer.CustomerService')}}</dt>
            <dd>
              <router-link to="/userAgreement">{{$t('footer.UserAgreement')}}</router-link>
            </dd>
            <dd>
              <router-link to="/userAgreement">{{$t('footer.ApplicationForCurrency')}}</router-link>
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
  </div>
</template>

<script>
import { setLang, getLang } from '../../libs/utils.js'
import { getMemberLogout } from '@/api/logout.js'
import {  getMember,getSSOToken } from '@/api/login.js'
import {jumpUrl} from '../../../public/config.js'
import {invitation}from '@/api/share.js'
import axios from 'axios'

export default {
  props:['selectHeaderTab'],
  data () {
    return {
      userInfo: '',
      href: '',
      loginState: false,
      m_name_hidden: '',
      lang: '',
      wxImgShow:false,
      cur:0 
    }
  },
  filters: {
    langFilter (value) {
      if (value === '' || value === 'zh') { 
        return 'English'
      } else {
        return '简体中文'
      }
    }
  },
  mounted () {
    this.lang = getLang()
    this.isUserLogin()
    getMember().then(res => {
      if (res.state === 1) {
        let userInfo = res.data
        this.userInfo = userInfo
        this.href = location.href.split('#')[0] + '#/register?uid=' + this.userInfo.uid
      } 
    })
  },
  methods: {
    // rs(){
    //    invitation().then(res =>{
    //      console.log(res)
    //   })
    // },
    getdata: function() {
        invitation().then(result=>{
            // console.log(result.data);
            // var goodlist= '';
            // this.goodlist = result.data;
            console.log(result.data);
        });
    },
    changeLanguage () {
      if (this.lang === '' || this.lang === 'zh') {
        this.lang = 'en'
        this.$i18n.locale = this.lang
        setLang('en')
        this.$emit('lang-change','en')
      } else {
        this.lang = 'zh'
        this.$i18n.locale = this.lang
        this.$emit('lang-change','zh')        
        setLang('zh')
      }
    },
     
    logoutClick () {
      getMemberLogout().then(res => {
        if (res.state === 1) {
          this.userLogout()
        }
      })
    },
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    isUserLogin () {
      getMember().then(res => {
        if (res.state === 1) {
        // 用户处于登录状态，将状态保存到session
          let loginState = true
          let userInfo = res.data
          sessionStorage.setItem('loginState', loginState)
          sessionStorage.setItem('useruid', userInfo.uid)
          sessionStorage.setItem('m_name_hidden', userInfo.m_name_hidden)

          // this.topbarUserOptionList()
        } else {
          let loginState = false
          sessionStorage.setItem('loginState', loginState)
        }
        let loginState = sessionStorage.getItem('loginState')
        if (loginState === 'true') {
          this.loginState = true
        } else {
          this.loginState = false
        }
        this.m_name_hidden = sessionStorage.getItem('m_name_hidden')
      })
    },
    toFabi(){
      getSSOToken().then(({ data, state}) => {
        if (state === 1) {
          window.location.href = `${jumpUrl}home?&test=test&api_key=${data.api_key}&sign=${data.sign}&timestamp=${data.timestamp}`;
        } else {
          window.location.href = jumpUrl;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  margin: 0;
  padding: 0;
}
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
.banner{
  width: 100%;
  height: 442px;
  z-index:-10;
  background: url(../../assets/images/share.png)repeat-y center;
  zoom: 1;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
.main{
  width: 100%;
  height: 1500px;
  background: #f2f3f8;
  padding-top: 18px;
}
.cur {
  color:#5F81EC 
}
.el-dropdown-menu{
  background-color: rgb(32, 41, 62);
  border:rgb(32, 41, 62);
  box-shadow: 2px 2px 10px #000
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
  background-color: #1f2431 ;
}
.el-dropdown{
  cursor: pointer;
}

.top{
  margin-left: 20%;
  width: 60%;
  height: 239px;
  background: #fff;
  padding-bottom: 15px;
  h1{
    width: 100%;
    font-size: 18px;
    color: #25425a;
    height: 60px;
    line-height: 60px;
    font-weight: normal;
    text-indent: 30px;
    background: #f9f9f9;
    box-shadow: 0px 5px 5px #e2e2e2;
  }
  h2{
    font-size: 13px;
    color: #25425a;
    width: 100%;
    height: 55px;
    line-height: 55px;
    font-weight: normal;
    text-indent: 30px;
  }
  dl{
    float: left;
    background: #fff;
    
    dd{
      color: #25425a;
      line-height: 35px;
    }
    dt{
      input{
        border: 0;
        background: #F2F3F8;
        width: 49%;
        height: 48px;
        border-right: 1px solid #DDDDDD;
        text-align: center;
        color: #25425a;
      }
      button{
        border: 0;
        background: #f2f3f8;
        width: 50%;
        height: 48px;
        color: #ebaa01;
      }
    }
   
  }
  .done{
    margin-left: 60px;
    width: 25%;
    height: 120px;

  }
  .dtwo{
    margin-left: 60px;
    width: 50%;
    height: 120px;
    dt{
      input{width: 79%}
      button{
        width: 20%;
      }
    }
  }
}

.center{
  width: 60%;
  margin-left: 20%;
  color: #25425a;
  height: 160px;
  margin-top: 20px;
}

.top_left{
  float: left;
  width: 49%;
  height: 160px;
  background: #fff;
  P:nth-child(1){
     margin-top: 44px;
     margin-left: 60px;
  }
  P:nth-child(2){
     margin-top: 30px;
     margin-left: 60px;
     b{
       margin-left: 28px;
       font-size: 20px;
     }
  }
}

.top_right{
  float: left;
  width: 50%;
  height: 160px;
  margin-left: 1%;
  background: #fff;
  P:nth-child(1){
     margin-top: 44px;
     margin-left: 60px;
  }
  P:nth-child(2){
     margin-top: 30px;
     margin-left: 60px;
     b{
       margin-left: 28px;
       font-size: 20px;
     }
  }
}
.invitationRecord{
  width: 60%;
  margin-top: 20px;
  margin-left: 20%;
  height: 562px;
  background: #fff;
}
.invitationRecord_head{
  width: 100%;
  height: 60px;
  background: #F9F9F9;
  box-shadow: 0px 5px 5px #e2e2e2;
  span{
       line-height: 60px;
       color: #333; 
       height: 57px;
       float: left;
  }
  span:nth-child(1){
    margin-left: 30px;
  }
  span:nth-child(2){
    margin-left: 60px;
  }
}
.invitationRecord_head .active{
    color: #ebaa01;
    border-bottom: 3px solid #ebaa01;
}
.tab-tilte{
    width: 90%;
}
.tab-tilte li{
    float: left;
    width: 25%;
    padding: 10px 0;
    text-align: center;
    background-color:#f4f4f4;
    cursor: pointer;
}

.tab-content div{
    float: left;
    width: 25%;
    line-height: 100px;
    text-align: center;
}

.activityRules{
  width: 60%;
  height: 361px;
  background: #fff;
  margin-left: 20%;
  color: #25425a;
  margin-top:20px;
  h1{
    height: 55px;
    width: 100%;
    box-shadow: 0px 5px 5px #e2e2e2;
    font-weight: normal;
    text-indent: 30px;
    line-height: 55px;
    font-size: 20px;
  }
  ul{
    margin-top: 34px;
    margin-left: 28px;
    line-height: 30px;
    li{
      color: #25425a;
    }
  }
  p{
    margin-left: 30px;
    margin-top: 30px;
  }
}
.head-nav li a{
  color: #97a7c9;
}
#headlogout li a{color: #97a7c9;}
.change-language a{color: #97a7c9}
#footer-right dl dt{color: #516696}
#footer-right dl dd a{color: #77839f}
.footer-left p{color: #77839f}
</style>
