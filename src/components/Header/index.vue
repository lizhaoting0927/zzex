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
          <el-dropdown>
            <span class="el-dropdown-link" style="color:#b4c6ee;">
              {{$t('header.out')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top:20.5px;color:#b4c6ee">
              <el-dropdown-item style="color:#b4c6ee;"><router-link to="/ctc">{{$t('header.ctc')}}</router-link></el-dropdown-item>
              <el-dropdown-item style="color:#b4c6ee;"><a @click.prevent="toFabi">{{$t('header.otc')}}</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <router-link to="/tradecenter" :class="selectHeaderTab===1?'cur':''">{{$t("header.Coins")}}</router-link>
        </li>
        <li>
          <a href="https://www.zzexcoin.com/">{{$t("header.ZZEXCoin")}}</a>
        </li>
        <li>
          <a href="/Shequ/">{{$t("header.Coinstration")}}</a>
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
  </div>
</template>
<script>
import { setLang, getLang } from '../../libs/utils.js'
import { getMemberLogout } from '@/api/logout.js'
import {  getMember,getSSOToken } from '@/api/login.js'
import {jumpUrl} from '../../../public/config.js'
export default {
  props:['selectHeaderTab'],
  data () {
    return {
      loginState: false,
      m_name_hidden: '',
      lang: ''
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

  },
  methods: {
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
      getSSOToken().then(({ data, state, msg }) => {
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

<style scoped>
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

</style>
