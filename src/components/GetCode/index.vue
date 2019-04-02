<template>
  <button class="f-fl" @click="sendCodeClick" :disabled="sendCodeDisable" :class="sendCodeDisable?'forbidBtn':''"> {{sendCodeText}}</button>
</template>
<script>
import { getMail, getMember } from '@/api/accountSecurity'

export default {
  props: {
    tokencode: String,
    imgCode: String,
    type: String
  },
  data () {
    return {
      sendCodeDisable: false,
      sendCodeText: '发送验证码',
      second: 60,
      clock: '',
      data: ''
    }
  },
  beforeDestroy () {
    window.clearInterval(this.clock)
  },
  methods: {
    sendCodeClick () {
      if (this.sendCodeDisable === true) {
        return
      }
      if (this.imgCode === '') {
        this.$message({
          type: 'error',
          message: this.$t('header.EnterImgCode'),
          duration: 3000,
          showClose: true
        })
        return
      }
      this.getMobileCode()
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
          this.sendCodeText = this.$t('user.SendVerificationCode')
          this.second = 60
          this.sendCodeDisable = false
        }
      }, 1000)
      this.clock = clock
    },
    getMobileCode () {
      getMember().then(res => {
        if (res.state === 1) {
          this.data = res.data
          this.sendCode()
        } else if (res.state === -1) {
          if (res.msg === 'LANG_NO_LOGIN') {
            this.$message({
              type: 'error',
              message: this.$t('header.PlaseLogin'),
              duration: 3000,
              showClose: true
            })
            setTimeout(() => {
              this.userLogout()
            }, 2000)
          }
        }
      })
    },
    sendCode () {
      getMail(this.tokencode, this.imgCode, this.data.m_name, this.type).then(res => {
        if (res.state === 1) {
          this.countDown()
          this.$message({
            type: 'success',
            message: this.$t('header.SendScuucess'),
            duration: 3000,
            showClose: true
          })
        } else if (res.state === -1) {
          this.$emit('getKaptcha')
        }
      })
    },
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    }
  }
}
</script>
