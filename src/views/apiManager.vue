<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="usercenter">
        <div class="main-panel f-cb">
          <side-nav></side-nav>
          <div class="content" id="view">
            <div class="inner-api-manager" id="InnerApiManager">
              <div class="header">{{$t('user.APIManagement')}}</div>
              <div class="api-desc">
                <p>{{$t('user.UsingTheAPI')}}</p>
                <p>{{$t('user.TipsPleaseKeep')}}</p>
              </div>
              <div class="api-list" id="apiList">
                <div class="api-list-header f-cb">
                  <span>{{$t('user.APIDocument')}}</span>
                  <button class="f-fr" id="CreateAPI" @click="createAPIClick">
                    {{$t('user.CreateAPI')}}
                  </button>
                </div>
                <table cellspacing=0>
                  <thead>
                    <tr>
                      <th>{{$t('user.APIName')}}</th>
                      <th>API ID</th>
                      <th>API Key</th>
                      <th>{{$t('user.WhiteList')}}</th>
                      <th>{{$t('user.Privilege')}}</th>
                      <th>{{$t('user.DeleteAPI')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in apiTokens" :key="index">
                      <td>{{item.label}}</td>
                      <td>{{item.id}}</td>
                      <td class="look">{{item.api_key}}</td>
                      <td>{{item.trusted_ip}}</td>
                      <td>
                        <span v-if="item.api_privilege.indexOf('Accounts')!==-1">
                          {{$t('user.Transaction')}}
                        </span>
                        <span v-if="item.api_privilege.indexOf('Withdraw')!==-1">
                          {{$t('user.Withdraw')}}
                        </span>
                      </td>
                      <td class="operate">
                        <span class="edit" @click="editApiClick(item)">
                          {{$t('user.Edit')}}
                        </span>
                        <span class="delete" @click="deleteApiClick(item)">
                          {{$t('user.Delete')}}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="api-delete-dialog" id="apiDelDialog"  v-show="apiDelDialogShow">
        <div class="dialog-content">
          <div class="inner" id="Inner">
            <div class="title f-cb">
              <span></span>
              <img class="close_icon f-fr fa fa-times"  @click="closeApiDelDialog" src="../assets/icons/close.png" alt="">
            </div>
            <div class="input-wrap currency-pwd">
              <label>{{$t('user.MoneyPassword')}}</label>
              <input type="password" :placeholder="$t('user.PleaseEnterFundPassword')" v-model="deletePwd">
            </div>
            <button class="submit" @click="deleteSubmitClick">{{$t('user.Confirm')}}</button>
          </div>
        </div>
      </div>
      <div class="api-dialog" id="apiDialog" v-show="apiDialogShow">
        <div class="dialog-content">
          <div class="inner" id="Inner">
            <div class="title f-cb">
              <span>{{dialogTitle}}</span>
              <img class="close_icon f-fr fa fa-times"  @click="closeApiDialog" src="../assets/icons/close.png" alt="">
            </div>
            <div class="input-wrap api-name">
              <label>{{$t('user.APIName')}}</label>
              <input type="text" placeholder="如：我的API" v-model="apiForm.apiName">
            </div>
            <div class="input-wrap api-ip">
              <label>{{$t('user.WhiteList')}}</label>
              <input type="text" :placeholder="$t('user.IPSeparatedByEnglish')" @blur="apiIpBlur" v-model="apiForm.apiIp">
            </div>
            <div class="input-wrap img-code f-cb">
              <label>{{$t('user.PictureVerificationCode')}}</label>
              <input type="text" class="code-input f-fl" 
              :placeholder="$t('user.PleaseVerificationCode')" v-model="apiForm.imgCode">
              <img :src="backImgCode" alt="" class="f-fl" @click="getImageCode">
            </div>
            <div class="input-wrap mobile-code f-cb">
              <label>{{$t('user.VerificationCodeS')}}</label>
              <input type="text" class="code-input f-fl" 
              :placeholder="$t('user.PleaseEnterYourMobile')" v-model="apiForm.mobileCode">
              <get-code @get-kaptcha="getKaptcha" :tokencode="tokencode" :imgCode="apiForm.imgCode"  type="forgot"></get-code>
            </div>
            <div class="input-wrap currency-pwd">
              <label>{{$t('user.MoneyPassword')}}</label>
              <input type="password" :placeholder="$t('user.PleaseEnterFundPassword')" v-model="apiForm.assetPwd">
            </div>
            <div class="input-wrap api-privilege">
              <label>{{$t('user.Privilege')}}</label>
              <input type="checkbox" value='0' v-model="apiForm.apiPrivilege">
              {{$t('user.Transaction')}}
              <input type="checkbox" value='1' v-model="apiForm.apiPrivilege">
              {{$t('user.Withdraw')}}
              <input type="checkbox" value="2"  disabled v-show="false">
            </div>
            <button class="submit" @click="apiDialogSubmit">{{$t('user.Confirm')}}</button>
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
import SideNav from '@/components/SideNav'
import GetCode from '@/components/GetCode'
import { getKaptcha, apiToken, getApiTokens, putApiToken, deleteApiToken } from '@/api/apiManager'
export default {
  components: {
    MyHeader,
    MyFooter,
    SideNav,
    GetCode
  },
  data () {
    return {
      dialogTitle: '',
      apiDialogShow: false,
      apiDelDialogShow: false,
      backImgCode: '',
      tokencode: '',
      getCodeBtnDisabled: false,
      ipNewArr: [],
      apiForm: {
        apiName: '',
        apiIp: '',
        imgCode: '',
        mobileCode: '',
        assetPwd: '',
        apiPrivilege: ['0','1', '2'],
        id: ''
      },
      apiTokens: '',
      addOrEdit: 0,
      deleteItem: '',
      deletePwd: ''
    }
  },
  mounted () {
    this.getImageCode()

    this.getApi()
  },
  methods: {
    getApi () {
      getApiTokens().then(res => {
        let apiTokens = res.apiTokens
        apiTokens.forEach(ele => {
          if (ele.api_privilege.indexOf('Order') !== -1) {
            ele.myAction = true
          } else {
            ele.myAction = false
          }
        })
        this.apiTokens = apiTokens
      })
    },
    createAPIClick () {
      this.addOrEdit = 0
      this.dialogTitle = this.$t('user.CreateAPI')
      this.apiDialogShow = true
    },
    closeApiDelDialog () {
      this.apiDelDialogShow = false
    },
    closeApiDialog () {
      this.apiDialogShow = false
      this.apiForm = {
        apiName: '',
        apiIp: '',
        imgCode: '',
        mobileCode: '',
        assetPwd: '',
        apiPrivilege: ['0','1', '2'],
        id: ''
      }
    },
    getImageCode () {
      this.getKaptcha()
    },
    getKaptcha () {
      getKaptcha().then(res => {
        this.backImgCode = res.check_code_img
        this.tokencode = res.check_code_token
      })
    },

    apiIpBlur () {
      let regex =
            '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
            '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
            '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
            '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
      let regIP = new RegExp(regex)
      let ipNewArr = []
      let ipArr = this.apiForm.apiIp.split(',')
      for (let i = 0; i < ipArr.length; i++) {
        if (regIP.test(ipArr[i])) {
          ipNewArr.push(ipArr[i])
        }
      }
      this.ipNewArr = ipNewArr
    },
    apiDialogSubmit () {
      let privilegeArr = []
      let privilegeStr = ''
      if (this.apiForm.apiPrivilege.indexOf('0') !== -1) {
        privilegeArr.push('Accounts')
      }
      if (this.apiForm.apiPrivilege.indexOf('1') !== -1) {
        privilegeArr.push('Withdraw')
      }
      if (this.apiForm.apiPrivilege.indexOf('2') !== -1) {
        privilegeArr.push('Order')
      }
      privilegeStr = privilegeArr.toString()
      let data = {
        label: this.apiForm.apiName,
        trusted_ip: this.ipNewStr,
        api_privilege: privilegeStr,
        sms_code: this.apiForm.mobileCode,
        security_pwd: this.apiForm.assetPwd,
        google_auth_code: 0
      }
      if (this.addOrEdit === 0) {
        apiToken(data).then(res => {
          if (res.state === 1) {
            let message='API Secret为:' + res.api_secret + '丢失将无法找回！'
            this.$alert(message, '创建成功！', {
              confirmButtonText: '确定',
            });
            this.closeApiDialog()
            this.getApi()
          } else if (res.state === -1) {
            this.getKaptcha()
          }
        })
      } else {
        data.id = this.apiForm.id
        putApiToken(data).then(res => {
          if (res.state === 1) {
            this.$message({
              type: 'success',
              message: this.$t('user.ModifySuccessfully'),
              duration: 3000,
              showClose: true
            })
            this.closeApiDialog()
            this.getApi()
          } else if (res.state === -1) {
            this.getKaptcha()
          }
        })
      }
    },
    editApiClick (item) {
      this.addOrEdit = 1
      this.dialogTitle = this.$t('user.EditAPI')
      this.apiDialogShow = true
      this.getImageCode()
      this.apiForm.apiName = item.label
      this.apiForm.id = item.id
      this.apiForm.apiIp = item.trusted_ip
      let power = item.api_privilege
      let powerArr = ['2']
      if (power.indexOf('Accounts') !== -1) {
        powerArr.push('0')
      }
      if (power.indexOf('Withdraw') !== -1) {
        powerArr.push('1')
      }
      this.apiForm.apiPrivilege = powerArr
    },
    deleteApiClick (item) {
      this.deleteItem = item
      this.apiDelDialogShow = true
    },
    deleteSubmitClick () {
      let data = {
        id: this.deleteItem.id,
        security_pwd: this.deletePwd,
        google_auth_code: 0
      }
      deleteApiToken(data).then(res => {
        if (res.state === 1) {
          this.$message({
            type: 'success',
            message: this.$t('user.DeletedSuccessfully'),
            duration: 3000,
            showClose: true
          })
          this.closeApiDelDialog()
          this.getApi()
        }
      })
    }
  }
}
</script>
<style scoped>
.close_icon{
  width:30px;
  height: 30px;
}

</style>
<style>
.el-message-box{
  background-color: #30374f;
  border-color: #30374f;
  box-shadow: 2px 2px 10px #000;
}
.el-message-box__message p{
  color: #5975d3;
}
.el-message-box__title span {
  color: #5975d3;
}
.el-message-box__btns button {
  background-color: #5f81ec;
  border-color: #5f81ec;
}
</style>
