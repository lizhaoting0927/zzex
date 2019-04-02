<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="usercenter">
        <div class="main-panel f-cb">
          <side-nav></side-nav>
          <div class="content" id="view">
            <div class="inner-account-info" id="innerAccountInfo">

              <div class="header">{{$t('user.AccountInfo')}}</div>

              <div class="user-detail f-cb">

                <img class="f-fl" src="../assets/images/default-header.png" alt="">
                <div class="f-fl user-info">
                  <div class="row-1">
                    <span>{{userInfo.m_name_hidden}}</span>
                    <span></span>
                    UID: <input type="text" v-model="userInfo.uid" readonly>
                  </div>
                  <div class="row-2">
                    <span>
                      {{$t('user.LastLoginTime')}} {{userInfo.last_login_time}} 
                    </span>
                    <span>
                      {{$t('user.LastLoginLocation')}} {{userInfo.last_login_ip}} 
                    </span>
                  </div>
                </div>
              </div>
              <div class="user-account-state">
                <div class="title">{{$t('user.AccountStatus')}}</div>
                <div class="lists">
                  <div class="l-phone list f-cb">
                    <i></i>
                    <div class="f-fl phone">
                      <span>{{$t('user.phoneNumber')}}</span>
                      <span>{{phoneText}}</span>
                    </div>
                  </div>
                  <div class="l-email list f-cb">
                    <i></i>
                    <div class="f-fl email">
                      <span>{{$t('user.Email')}}</span>
                      <span>{{emailText}}</span>
                    </div>
                  </div>
                  <div class="l-realname list f-cb">
                    <i></i>
                    <div class="f-fl realname">
                      <span>{{$t('user.Certification')}}</span>
                      <span>{{realnameText}}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div class="user-recommend">

                <div class="title">{{$t('user.MyPromotion')}}</div>
                <div class="lists">
                  <div class="l-invitecode list f-cb">
                    <i></i>
                    <div class="f-fl invitecode">
                      <span>{{$t('user.MyInvitationCode')}}</span>
                      <input type="text" readonly v-model="userInfo.uid">
                      <span class="copy fa fa-files-o" v-clipboard:copy="userInfo.uid" v-clipboard:success="onCopy" v-clipboard:error="onError"><img class="copyIcon" src="../assets/icons/copy.png" alt=""/></span>
                    </div>
                  </div>
                  <div class="l-invitelink list f-cb">
                    <i></i>
                    <div class="f-fl invitelink">
                      <span>{{$t('user.MyInvitationLink')}}</span>
                      <input type="text" value="" readonly v-model="href">
                      <span class="copy fa fa-files-o" v-clipboard:copy="href" v-clipboard:success="onCopy" v-clipboard:error="onError"><img class="copyIcon" src="../assets/icons/copy.png" alt=""/></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
import { getMember, getAuthindentity } from '@/api/accountInfo'
import MyHeader from '@/components/Header'
import MyFooter from '@/components/Footer'
import SideNav from '@/components/SideNav'
export default {
  components: {
    MyHeader,
    MyFooter,
    SideNav
  },
  data () {
    return {
      userInfo: '',
      phoneText: '',
      emailText: '',
      realnameText: '',
      href: ''
    }
  },
  mounted () {
    getMember().then(res => {
      if (res.state === 1) {
        let userInfo = res.data
        this.userInfo = userInfo
        var regPhone = new RegExp('^[1][3,4,5,7,8][0-9]{9}$')
        var regEmail = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$')
        if (regPhone.test(this.userInfo.m_name)) {
          this.phoneText = this.$t('user.HaveSet')
        } else {
          this.phoneText = this.$t('user.NotSet')
        }
        if (regEmail.test(this.userInfo.m_name)) {
          this.emailText = this.$t('user.HaveSet')
        } else {
          this.emailText = this.$t('user.NotSet')
        }
        getAuthindentity().then(res => {
          let data = res.data
          if (res.state === 1) {
            if (data == null || data.id_status === 0 || data.id_status === 2) {
              this.realnameText = this.$t('user.Unverified')
            } else if (data.id_status === 1) {
              this.realnameText = this.$t('user.Certified')
            }
          }
        })

        this.href = location.href.split('#')[0] + '#/register?uid=' + this.userInfo.uid
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
  methods: {
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    onCopy () {
      this.$message({
        type: 'success',
        message: this.$t('header.CopySuccess'),
        duration: 3000,
        showClose: true
      })
    },
    onError () {
      this.$message({
        type: 'error',
        message: this.$t('header.CopyFail'),
        duration: 3000,
        showClose: true
      })
    }
  }
}
</script>
<style scoped>
.copyIcon{
  width: 20px;
  height: 20px
}
</style>
