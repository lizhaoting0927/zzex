<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div
        class="container"
        id="assetsmanager"
      >
        <div class="main-panel f-cb">
          <asset-side-nav></asset-side-nav>
          <div
            class="content"
            id="view"
          >
            <div
              class="inner-top-up"
              id="innerRecharge"
            >
              <div class="header">
                <a href="#/myAssets">{{$t('user.MyAssets')}}</a>
                <i class="iconfont icon-angleright"></i>
                <span>{{$t('user.Deposit')}}</span>
              </div>
              <div class="topup-main">
                <div
                  class="tm-inner"
                  id="tmInner"
                >
                  <div class="coin-type input-wrap">
                    <label>{{$t('user.Coin')}}</label>
                    <input
                      type="text"
                      readonly
                      v-model="currency"
                    >
                  </div>
                  <div class="coin-address input-wrap">
                    <label>{{$t('user.AddressS')}}</label>
                    <input
                      type="text"
                      readonly
                      v-model="address"
                    >
                    <i
                      class="iconfont icon-fuzhi"
                      v-clipboard:copy="address"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    ></i>
                    <i class="iconfont icon-erweima" 
                      @mouseenter="qrcodeMouseenter" 
                      @mouseleave="qrcodeMouseleave"
                    ></i>
                    <div class="qrcodeContainer" v-show="qrcodeShow">
                      <qrcode :value="address" :options="{size:130}"></qrcode>
                    </div>
                  </div>
                  <div class="coin-tips input-wrap" v-show="tipShow">
                    <label>{{$t('user.Label')}}</label>
                    <input
                      type="text"
                      readonly
                      v-model="useruid"
                    >
                  </div>
                </div>
                <ul
                  class="tips-list"
                  id="tipsList"
                >
                  <div v-for="(item,index) in currencyLst" :key="index">
                    <li>{{$t('user.ItIsForbiddenTo')}}{{currency}}{{$t('user.AddressRechargeSSS')}}{{currency}}{{$t('user.OtherAssets')}}{{currency}}{{$t('user.TheAddressOfThe')}}{{currency}}{{$t('user.AssetsWillNotBeRecovered')}}</li>
                    <li v-if="currency == 'AAC' || currency == 'EOS'">{{$t('user.PleaseBeSureToFillOut')}}</li>
                    <li v-else>{{$t('user.Use')}}{{currency}}{{$t('user.AddressRecharge')}}</li>
                    <li>{{$t('user.TheMinimumAmount')}}{{' ' + item.c_min_recharge + ' ' + currency}}{{$t('user.RechargeLessThanTheMinimumAmountWill')}}</li>
                    <li v-if="currency==='ETH'">{{$t('user.ETHAdd')}}</li>
                  </div>
                </ul>
              </div>
              <div class="topup-record">
                <div class="tr-title">{{$t('user.DepositHistory')}}</div>
                <div class="tr-list">
                  <div class="tr-list-header">
                    <span class="tlh-addr">{{$t('header.CurrencyAddress')}}</span>
                    <span class="tlh-type">{{$t('header.RechargeCurrency')}}</span>
                    <span class="tlh-num">{{$t('header.NumberOfCoins')}}</span>
                    <span class="tlh-time">{{$t('user.UpdateTime')}}</span>
                    <span class="tlh-state">{{$t('tradecenter.Status')}}</span>
                  </div>
                  <div
                    class="tr-list-main"
                    id="trListMain"
                  >
                    <dl
                      v-for="(item,index) in list"
                      :key="index"
                    >
                      <dd>
                        <div class="tl-row">
                          <span>{{item.r_address}}</span>
                          <span>{{item.currency}}</span>
                          <span>{{item.r_amount}}</span>
                          <span>{{item.r_create_time}}</span>
                          <span>{{item.mystate}}</span>
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

import {
  getAssetsRechargeAddr,
  genCoinAddress,
  getAssetsRecharge,
  getAssetsLst
} from '@/api/recharge'
export default {
  components: {
    MyHeader,
    MyFooter,
    AssetSideNav
  },
  data () {
    return {
      currency: '',
      useruid: '',
      tipShow: false,
      address: '',
      list: '',
      currencyLst: '',
      qrcodeShow:false
    }
  },

  created () {
    // this.$alert('提示：由于钱包升级，ZZEX交易所充币地址已变更，请知悉！', '温馨提示', {
    //   confirmButtonText: '确定',
    // });
 
    this.currency = this.$route.params.currency
    if(!this.currency){
      this.$router.push('/myAssets')
      return
    }
    let specialCoin=['XRP','AAC','EOS']
    let exist= specialCoin.indexOf(this.currency)
    if (exist>-1) {
      this.useruid = JSON.parse(sessionStorage.getItem('useruid'))
      this.tipShow= true
    } 
    this.loadAssetsRechargeAddr()
    this.loadAssetsRecharge()
    this.loadAssetsRechargeTips()
  },
  methods: {
    loadAssetsRechargeAddr () {
      getAssetsRechargeAddr(this.currency).then(response => {
        if (response.state === 1) {

          let rechargeAddr = response.data.rechargeAddr
          if (rechargeAddr == null) {
            let data = {
              currency: this.currency
            }
            genCoinAddress(data).then(response => {
              this.address = response.msg
            })
          } else {
            this.address = rechargeAddr
          }
        } else if (response.state === -1) {
          if (response.msg === 'LANG_NO_LOGIN') {
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
    loadAssetsRecharge () {
      getAssetsRecharge(1).then(response => {
        if (response.state === 1) {
          let rechargeLst = response.data.rechargeLst
          let list = []
          rechargeLst.forEach(ele => {
            if (ele.currency === this.currency) {
              list.push(ele)
            }
          })
          list.forEach(ele=>{
            switch (ele.r_status) {
              case -1:
                ele.mystate=this.$t('user.Obligation')
                break;
              case 0:
                ele.mystate=this.$t('user.Unconfirmed')
                break;
              case 1:
                ele.mystate=this.$t('user.Confirmed')
                break;
              case 2:
                ele.mystate=this.$t('user.Canceled')
                break;
            }
          })
          this.list = list
        } else if (response.state === -1) {
          if (response.msg === 'LANG_NO_LOGIN') {
            this.$message({
              type: 'error',
              message:  this.$t('header.PlaseLogin'),
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
    loadAssetsRechargeTips () {
      getAssetsLst().then(response => {
        let currencyLst = response.data.currencyLst
        let newCurrencyLst = []
        currencyLst.forEach(ele => {
          if (ele.currency === this.currency) {
            newCurrencyLst.push(ele)
          }
        })
        this.currencyLst = newCurrencyLst
      })
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
        message:  this.$t('header.CopyFail'),
        duration: 3000,
        showClose: true
      })
    },
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    qrcodeMouseenter(){
      this.qrcodeShow=true
    },
    qrcodeMouseleave(){
      this.qrcodeShow=false
    }
  }
}
</script>
<style scoped>
.icon-fuzhi{
  position: relative;
  left: -60px;
  margin-top: 2px;
}
.icon-erweima{
  position: relative;
  left: -60px;
  margin-top: 2px;
}
.qrcodeContainer{
  width: 150px;
  height: 150px;
  background-color: #30374f;
  position: relative;
  top: -40px;
  float: right;
  padding-top: 10px;
  padding-left: 10px;
  box-sizing: border-box;
}
.coin-address{
  width: 688px;
}
.topup-main{
  height: 350px;
}
.tips-list{
  line-height:24px;
}
</style>

