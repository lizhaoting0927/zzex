<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="page-register">
        <div class="register-wrap">
          <div class="inner-form">
            <div class="title">{{$t("register.WelcomeToSignUp")}}</div>
            <div class="change-reg-way-input">
              <div class="input-wrap">
                <span>{{$t('register.MobilePhoneEmail')}}</span>
                <input type="text" :placeholder="$t('register.PleaseEnter')" id="userRegAccount" v-model="userRegAccount" @blur="accountCheck">
              </div>
              <div class="input-tip red">
                <span v-show="accountTip1">{{$t('register.MobilePhoneEmpty')}}</span>
                <span v-show="accountTip2">{{$t('register.TheAccountFormatIsIncorrect')}}</span>
              </div>
              <div class="input-wrap img-validate f-cb">
                <span>{{$t('user.PictureVerificationCode')}}</span>
                <input class="f-fl" type="text" :placeholder="$t('register.PleaseVerificationCode')" id="userRegImgCode" v-model="userRegImgCode" @blur="imgCodeCleck">
                <img class="imgCodeBtn f-fl" :src="imgcode" alt="" id="imgCode" @click="getKaptcha">
              </div>
              <div class="input-tip red"><span v-show="imgCodeTip">{{$t('register.ImageVerificationEmpty')}}</span></div>
              <div class="input-wrap mobile-validate f-cb">
                <span>{{$t('user.verificationCode')}}</span>
                <input class="f-fl" type="text" :placeholder="$t('register.PleaseEnterYourMobile')" id="userRegMCode" v-model="userRegMCode" @blur="codeCheck">
                <button type="button" class="codeBtn f-fl" id="codeBtn" @click="sendCode" :disabled="sendCodeDisable" :class="sendCodeDisable?'forbidBtn':''">{{sendCodeText}}</button>
              </div>
              <div class="input-tip red"><span v-show="codeTip">{{$t('register.VerificationEmpty')}}</span></div>
              <div class="input-wrap">
                <span>{{$t('user.LoginPassword')}}</span>
                <input type="password" :placeholder="$t('register.PleaseEnterYourLoginPassword')" id="loginPwd" v-model="loginPwd" @blur="loginPwdCheck">
              </div>
              <div class="input-tip red"><span v-show="loginPwdTip">{{$t('login.PasswordCannotBeEmpty')}}</span></div>
              <div class="input-wrap">
                <span>{{$t('register.ConfirmPassword')}}</span>
                <input type="password" :placeholder="$t('register.PleaseConfirmTheLoginPassword')" id="confirmPwd" v-model="confirmPwd" @blur="confirmPwdCheck">
              </div>
              <div class="input-tip red">
                <span v-show="confirmPwdTip1">{{$t('register.VerifyPasswordEmpty')}}</span>
                <span v-show="confirmPwdTip2">{{$t('register.TwoInputPasswords')}}</span>
              </div>
              <div class="input-wrap">
                <span>{{$t('register.InvitationCode')}}</span>
                <input type="text" :placeholder="$t('register.PleaseEnterInviterUID')" id="inviterId" v-model="inviterId">
              </div>
              <div class="input-tip"></div>
            </div>
            <div class="agreement">
              <input type="checkbox" id="Agreement" v-model="agreement">
              {{$t('register.IAgreeToThe')}}<a href="">{{$t('register.ServiceAgreement')}}</a>
            </div>
            <div class="reg-back">
              <button type="button" id="regBtn" @click="regBtnClick">{{$t('register.SignUp')}}</button>
              <button type="button" id="backLoginBtn" @click="backLoginBtnClick">{{$t('register.BackToLogin')}}</button>
            </div>
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
import { getKaptcha, getMail, member } from '@/api/register'
export default {
  components: {
    MyHeader,
    MyFooter
  },
  data () {
    return {
      userRegAccount: '',
      userRegAccount_state: false,
      userRegImgCode: '',
      userRegMCode: '',
      loginPwd: '',
      loginPwd_state: false,
      confirmPwd: '',
      inviterId: '',
      agreement: false,
      accountTip1: false,
      accountTip2: false,
      imgCodeTip: false,
      codeTip: false,
      loginPwdTip: false,
      confirmPwdTip1: false,
      confirmPwdTip2: false,
      imgcode: '',
      tokencode: '',
      sendCodeText: '发送验证码',
      sendCodeDisable: false,
      second:60,
    }
  },
  mounted () {
    if (location.hash.indexOf('?') !== -1) {
      this.inviterId = location.hash.split('?')[1].split('=')[1]
    }
    this.getKaptcha()
  },
  beforeDestroy(){
    window.clearInterval(this.clock)
  },
  methods: {
    accountCheck () {
      let regPhone = new RegExp('^[1][3,4,5,7,8][0-9]{9}$')
      let regEmail = new RegExp(
        '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$'
      )
      if (this.userRegAccount.trim() === '') {
        this.accountTip1 = true
        this.accountTip2 = false
        this.userRegAccount_state = false
      } else if (
        !regEmail.test(this.userRegAccount.trim()) &&
        !regPhone.test(this.userRegAccount.trim())
      ) {
        this.accountTip1 = false
        this.accountTip2 = true
        this.userRegAccount_state = false
      } else {
        this.accountTip1 = false
        this.accountTip2 = false
        this.userRegAccount_state = true
      }
    },
    imgCodeCleck () {
      if (this.userRegImgCode.trim() === ''||this.userRegImgCode.trim().length!=4) {
        this.imgCodeTip = true
      } else {
        this.imgCodeTip = false
      }
    },
    codeCheck () {
      if (this.userRegMCode.trim() === '') {
        this.codeTip = true
      } else {
        this.codeTip = false
      }
    },
    loginPwdCheck () {
      if (this.loginPwd.trim() === '') {
        this.loginPwdTip = true
      } else {
        this.loginPwdTip = false
      }
    },
    confirmPwdCheck () {
      if (this.confirmPwd.trim() === '') {
        this.confirmPwdTip1 = true
        this.confirmPwdTip2 = false
        this.loginPwd_state = false
      } else if (this.loginPwd !== this.confirmPwd) {
        this.confirmPwdTip1 = false
        this.confirmPwdTip2 = true
        this.loginPwd_state = false
      } else {
        this.confirmPwdTip1 = false
        this.confirmPwdTip2 = false
        this.loginPwd_state = true
      }
    },
    sendCode () {
      if(this.userRegAccount===''){
        this.$message({
          type: 'error',
          message: this.$t('header.EnterPhoneOrEmail'),
          duration: 3000,
          showClose: true
        })
        return
      }
      if(this.userRegImgCode===''){
        this.$message({
          type: 'error',
          message: this.$t('header.EnterImgCode'),
          duration: 3000,
          showClose: true
        })
        return
      }
      if (this.userRegAccount_state) {
        getMail(this.tokencode, this.userRegImgCode, this.userRegAccount, 'reg')
          .then(res => {
            if (res.state === 1) {
              this.countDown()
              this.$message({
                type: 'success',
                message: this.$t('header.SendScuucess'),
                duration: 3000,
                showClose: true
              })
              this.sendBtnDisable = true
            } else if (res.state === -1) {
              this.getKaptcha()
            }
          })
      } else {
        this.getKaptcha()
        this.$message({
          type: 'error',
          message: this.$t('header.PhoneOrEmailError'),
          duration: 3000,
          showClose: true
        })
      }
    },
    regBtnClick () {
      if (this.userRegAccount_state && this.loginPwd_state) {
        if(!this.agreement){
          this.$message({
            type: 'error',
            message: this.$t('header.SelectServeAgreement'),
            duration: 3000,
            showClose: true
          })
          return
        }
        let data = {
          m_name: this.userRegAccount,
          m_pwd: this.loginPwd,
          sms_code: this.userRegMCode,
          introduce_m_id: this.inviterId
        }
        member(data).then(res => {
          if (res.state === 1) {
            this.$router.push('/login')
            this.$message({
              type: 'success',
              message: this.$t('header.RegisterSuccess'),
              duration: 3000,
              showClose: true
            })
          } else {
            this.getKaptcha()
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t('register.PleaseCompleteTheFormInformation'),
          duration: 3000,
          showClose: true
        })
      }
    },
    backLoginBtnClick () {
      this.$router.push('/login')
    },
    getKaptcha () {
      getKaptcha().then(res => {
        this.imgcode = res.check_code_img
        this.tokencode = res.check_code_token
      })
    },
    countDown () {
      if (this.sendCodeDisable) return
      this.sendCodeDisable = true
      this.sendCodeText = this.second + 's后重新发送'
      let clock = window.setInterval(() => {
        this.second--
        this.sendCodeText = this.second + 's后重新发送'
        if (this.second < 0) {
          window.clearInterval(clock)
          this.sendCodeText = '发送验证码'
          this.second = 60
          this.sendCodeDisable = false
        }
      }, 1000)
      this.clock = clock
    },
  }
}
</script>
<style scoped>
.red {
  color: red;
  transition: 0.6s;
}
</style>
