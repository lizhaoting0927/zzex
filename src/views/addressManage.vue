<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="assetsmanager">
        <div class="main-panel f-cb">
          <asset-side-nav></asset-side-nav>
          <div class="content" id="view">
            <div class="inner-address-manager" id="innerAddressManager">
              <div class="header">{{$t('user.Address')}}</div>
              <div class="addressmanager-main">
                <div class="am-inner">
                  <div class="coin-type input-wrap">
                    <label>{{$t('user.Coin')}}</label>
                    <select v-model="selectCoin">
                      <option value="">{{$t('user.PleaseSelectYourCurrency')}}</option>
                      <option :value="item" v-for="(item,index) in currencyLstArr" :key="index"> {{item}}</option>
                    </select>
                  </div>
                  <div class="coin-address input-wrap">
                    <label>{{$t('user.AddressS')}}</label>
                    <input type="text" 
                    :placeholder="$t('user.PleaseEnterTheWithdrawalAddress')" v-model="address">
                  </div>
                  <div class="coin-note input-wrap">
                    <label>{{$t('user.Remark')}}</label>
                    <input type="text" 
                    :placeholder="$t('user.PleaseEnterRemarks')" v-model="remark">
                  </div>
                  <div class="i-code-input code-input input-wrap f-cb">
                    <label>{{$t('user.PictureVerificationCode')}}</label>
                    <input class="f-fl" type="text" 
                    :placeholder="$t('user.PleaseVerificationCode')" v-model="imgCode">
                    <img class="img-code code f-fl" :src="backImgCode" @click="imgCodeClick">
                  </div>
                  <div class="m-code-input code-input input-wrap f-cb">
                    <label>{{$t('user.verificationCode')}}</label>
                    <input class="f-fl" type="text" 
                    :placeholder="$t('user.PleaseEnterTheverification')" v-model="mobileCode">
                    <get-code @get-kaptcha="getKaptcha" :tokencode="tokencode" :imgCode="imgCode" type="forgot"></get-code>
                  </div>
                  <div class="tips">{{$t('user.SendToCurrentPhoneOrEmailByDefault')}}</div>
                  <button type="button" class="btn-add" id="addBtn" @click="addBtnClick">{{$t('user.Add')}}</button>
                </div>
              </div>
              <div class="address-list">
                <div class="al-title">{{$t('user.AddressList')}}</div>
                <div class="al-list">
                  <div class="al-list-header">
                    <span class="selectoption">
                      <select class="type" v-model="selectType" @change="getCurrencyList">
                        <option value="">{{$t('user.Coin')}}</option>
                        <option :value="item" v-for="(item,index) in currencyLstArr" :key="index"> {{item}}</option>
                      </select>
                    </span>
                    <span class="addr">{{$t('user.WithdrawAddress')}}</span>
                    <span class="note">{{$t('user.Remark')}}</span>
                    <span class="operate">{{$t('user.Action')}}</span>
                  </div>
                  <div class="al-list-main" id="alListMain">
                    <dl v-for="(item,index) in addressList" :key="index">
                      <dd>
                        <div class="al-row">
                          <span>{{item.currency}}</span>
                          <span>{{item.addr}}</span>
                          <span>{{item.addr_label}}</span>
                          <span @click="deleteAddress(item)">{{$t('user.Delete')}}</span>
                        </div>
                      </dd>
                    </dl>
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
import MyHeader from '@/components/Header'
import MyFooter from '@/components/Footer'
import AssetSideNav from '@/components/AssetSideNav'
import GetCode from '@/components/GetCode'
import { getAssetsLst, getKaptcha, getMember, saveWithdrawAddr, getWithdrawAddr, delWithdrawAddr } from '@/api/addressManage'
export default {
  components: {
    MyHeader,
    MyFooter,
    AssetSideNav,
    GetCode
  },
  data () {
    return {
      currencyLstArr: '',
      selectCoin: '',
      selectType: '',
      backImgCode: '',
      tokencode: '',
      useraccount: '',
      imgCode: '',
      address: '',
      remark: '',
      mobileCode: '',
      addressList: []
    }
  },
  mounted () {
    this.getOption()
    this.getKaptcha()
    getMember().then(res => {
      if (res.state === 1) {
        this.useraccount = res.data.m_name
      }
    })
  },
  methods: {
    getOption () {
      getAssetsLst().then(res => {
        if (res.state === 1) {
          let currencyLst = res.data.currencyLst
          let currencyLstArr = []
          for (let i in currencyLst) {
            currencyLstArr.push(currencyLst[i].currency)
          }
          this.currencyLstArr = currencyLstArr
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
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    getKaptcha () {
      getKaptcha().then(res => {
        this.backImgCode = res.check_code_img
        this.tokencode = res.check_code_token
      })
    },
    imgCodeClick () {
      this.getKaptcha()
    },
    addBtnClick () {
      saveWithdrawAddr(this.selectCoin, this.remark, this.address, this.mobileCode).then(res => {
        if (res.state === 1) {
          this.$message({
            type: 'success',
            message: this.$t('header.AddedSuccessfully'),
            duration: 3000,
            showClose: true
          })
          this.selectCoin = ''
          this.imgCode = ''
          this.address = ''
          this.remark = ''
          this.mobileCode = ''
        } else {
          this.getKaptcha()
        }
      })
    },
    getCurrencyList () {
      getWithdrawAddr(this.selectType).then(res => {
        if (res.state === 1) {
          if (res.data.length > 0) {
            let lists = res.data
            this.addressList = lists
          } else {
            this.addressList = []
          }
        }
      })
    },
    deleteAddress (item) {
      let data = {
        'id': item.id
      }
      delWithdrawAddr(data).then(res => {
        if (res.state === 1) {
          this.$message({
            type: 'success',
            message: this.$t('user.DeletedSuccessfully'),
            duration: 3000,
            showClose: true
          })
          this.getCurrencyList()
        }
      })
    }

  }
}
</script>
