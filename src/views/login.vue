<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="login-wrap page-login">
        <div class="inner-form" v-if="!exchange">
          <div class="title">{{$t('login.WelcomeToLogin')}}</div>
          <div class="input-wrap" id="userAccount">
            <span>{{$t('login.MobilePhoneEmail')}}</span>
            <input type="text" :placeholder="$t('login.PleaseEnter')" v-model="account" @blur="useraccountIdentification">
          </div>
          <div class="input-tip red"><span v-show="accountTip">{{accountTipContent}}</span></div>
          <div class="input-wrap" id="userPwd">
            <span>{{$t('login.Password')}}</span>
            <input type="password" :placeholder="$t('login.PleaseEnterYourLoginPassword')" v-model="password" @blur="userpasswordIdentification">
          </div>
          <div class="input-tip red">
            <span v-show="pwdTip">{{$t('login.PasswordCannotBeEmpty')}}</span>
          </div>
          <div id="captcha2"></div>
          <div class="login-forget" id="loginBtn">
            <button type="button" class="login-btn" @click="loginClicknext" ref="loginBtn">
                {{$t('login.logIn')}}
              </button>
            <a href="#/resetpassword">{{$t('login.ForgotPassword')}}</a>
          </div>
        </div>
  
        <div class="inner-form" v-if="exchange">
          <div class="title">{{$t('login.EnterConfirmationCode')}}</div>
          <div class="input-tip mtext-exchange">
            <span>{{$t('login.PleaseEnters')}} {{account}} {{$t('login.VerificationCodeReceived')}}</span>
          </div>
          <div class="m-code-input code-input input-wrap f-cb">
            <span>{{$t('login.SMSVerificationCode')}}</span>
            <input class="f-fl code" type="text" :placeholder="$t('user.PleaseEnterTheverification')" v-model="mobileCode" @blur="codeCheck">
          </div>
          <div class="input-tip red">
            <span v-show="codeTip">{{$t('register.VerificationEmpty')}}</span>
          </div>
          <div class="input-tip againsend">
            <span v-show="!sendBtnDisable" @click="sendCodeClick" :class="sendBtnDisable?'forbidBtn':''">{{sendCodeText}}</span>
            <span v-show="sendBtnDisable" :class="sendBtnDisable?'forbidBtn':''">{{sendCodeText}}</span>
          </div>
          <div class="login-forget" id="loginBtn">
            <button type="button" class="login-btn" @click="loginClick" ref="loginBtn">{{$t('resetpassword.Affirm')}}</button>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import MyHeader from '@/components/Header'
  import MyFooter from '@/components/Footer'
  import {
    getGtValidateCode,
    memberLogin,
    getMember,
    getKaptcha,
    getMail,
    verification
  } from '@/api/login.js'
  import gtInit from '@/libs/gt.js'
  import Cookies from 'js-cookie'
  
  export default {
    components: {
      MyHeader,
      MyFooter
    },
    data() {
      return {
        isclick: true,
        account: '',
        password: '',
        captchaObj: {},
        pwdTip: false,
        accountTip: false,
        accountTipContent: '',
        exchange: false,
        mobileCode: "",
        imgcode: '',
        tokencode: '',
        sendCodeText: '再次发送',
        sendBtnDisable: false,
        second: 60,
        token: '',
        hasLoadRobotIdentification:false
      }
    },
    mounted() {
      this.getKaptcha()
      this.getGtValidateCode()
    },
    methods: {
      getGtValidateCode() {
        getGtValidateCode().then(res => {
          let response = res
          if (response.success === 1) {
            this.loadRobotIdentification(this.isclick, response)
          } else {
            this.$message({
              type: 'error',
              message: this.$t('login.ButtonValidationError'),
              duration: 3000,
              showClose: true
            })
          }
        })
      },
      loadRobotIdentification(isclick, response) {
        if(!this.hasLoadRobotIdentification){
          this.hasLoadRobotIdentification=true;
          let _this = this
          window.initGeetest({
              gt: response.gt,
              challenge: response.challenge,
              new_captcha: response.new_captcha,
              offline: !response.success,
              product: 'popup',
              width: '608px'
            },
            function(captchaObj) {
              captchaObj.appendTo('#captcha2')
              _this.captchaObj = captchaObj
            }
          )
        }
      },
      useraccountIdentification() {
        let regPhone = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$')
        let regEmail = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$')
        if (this.account === '') {
          this.accountTip = true
          this.accountTipContent = this.$t('login.TheAccountCannotBeEmpty')
        } else if (!regEmail.test(this.account) &&
          !regPhone.test(this.account)
        ) {
          this.accountTip = true
          this.accountTipContent = this.$t('login.TheAccountFormatIsIncorrect')
        } else {
          this.accountTip = false
        }
      },
  
      userpasswordIdentification() {
        if (this.password === '') {
          this.pwdTip = true
        } else {
          this.pwdTip = false
        }
      },
      upsetArr(arr) {
        return arr.sort(function() {
          return Math.random() - 0.5
        })
      },
      sendCodeClick() {
        var check_code = this.upsetArr((this.account + new Date().getTime()).split('')).join('')
        getMail(this.tokencode, check_code, this.account, 'login').then(res => {
          if (res.state === 1) {
            this.$message({
              type: 'success',
              message: this.$t('header.SendScuucess'),
              duration: 1000,
              showClose: true
            })
            this.countDownBtn()
            this.sendBtnDisable = true
          } else if (res.state === -1) {
            this.getKaptcha()
          }
        })
      },
      getKaptcha() {
        getKaptcha().then(res => {
          this.imgcode = res.check_code_img
          this.tokencode = res.check_code_token
        })
      },
      countDownBtn() {
        if (this.sendBtnDisable) return
        this.sendBtnDisable = true
        this.sendCodeText = this.second + '秒后重新发送'
        let clock = window.setInterval(() => {
          this.second--
            this.sendCodeText = this.second + '秒后重新发送'
          if (this.second < 0) {
            window.clearInterval(clock)
            this.sendCodeText = '再次发送'
            this.second = 60
            this.sendBtnDisable = false
          }
        }, 1000)
        this.clock = clock
      },
      codeCheck() {
        if (this.mobileCode.trim() === '') {
          this.codeTip = true
        } else {
          this.codeTip = false
        }
      },
      //账号密码下一步
      loginClicknext() {
        if (this.accountTip) return
        if (this.pwdTip) return
        let result = this.captchaObj.getValidate()
        if (!result) {
          this.$message({
            type: 'error',
            message: '请完成按钮验证',
            duration: 1000,
            showClose: true
          })
        } else {
          if (this.isclick) {
              let result = this.captchaObj.getValidate()
              let data = {
                m_name: this.account,
                m_pwd: this.password,
  
                geetest_challenge: result.geetest_challenge,
                geetest_validate: result.geetest_validate,
                geetest_seccode: result.geetest_seccode
              };
              memberLogin(data).then(res => {
                if (res.state === 1) {
                  this.token = res.data
                  this.isclick = false
                  this.exchange = true
                    setTimeout(() => {
                      this.isclick = true
                    }, 1000)
                  this.sendCodeClick()
                } else if (res.state === -1) {
                  this.exchange = false
                  this.mobileCode = ''
                  this.getGtValidateCode()
                  setTimeout(() => {
                    this.captchaObj.reset();
                  }, 1500);
                }
              });
              document.getElementsByClassName('geetest_radar_success')[0].remove()
          }
        }
      },
      //登陆
      loginClick() {
        this.isclick = false;
        if (this.mobileCode.trim() !== '') {
          verification(this.account, this.mobileCode,this.token).then(res => {
            if (res.state == 1) {
             
                  let loginState = true;
                  sessionStorage.setItem("loginState", loginState);
                  this.isUserLogin();
                  this.$router.push("/");
                  // localStorage.setItem('ZZEX_TOKEN',res.data.token)
                  Cookies.set("ZZEX_TOKEN", res.data.token);
            }
          })
  
        }else{
          this.codeTip = true
        }
  
      },
      isUserLogin() {
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
        })
      }
  
    }
  }
</script>

<style scoped>
  .red {
    color: red;
    transition: 0.6s;
  }
</style>
