<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="assetsmanager">
        <div class="main-panel f-cb">
          <asset-side-nav></asset-side-nav>
          <div class="content" id="view">
            <div class="inner-my-assets" id="innerMyAssets">
              <div class="header">{{$t('user.MyAssets')}}</div>
              <div class="estimate-all-assets">
                <div class="eaa-inner f-cb" v-show="btnShow">

                  <div class="btns f-fl">
                    <button class="btn btn-topup">
                      <router-link to="/ctc">{{$t('user.FiatRecharge')}}</router-link>
                    </button>
                    <button class="btn btn-getcoin">
                      <router-link to="/ctc">{{$t('user.FiatWithdraw')}}</router-link>
                    </button>
                  </div>
                  <div class="money f-fl">
                    <span class="moneyyg">{{$t('tradecenter.NetAssetConversion')}}</span>
                    <span class="moneyzc"> {{moneyzc.toFixed(2)}}ZC </span>
                    <span class="moneybtc"> ≈ {{(moneyzc/moneybtc).toFixed(6)}} BTC </span>
                  </div>
                </div>
              </div>
              <div class="currency-type-detail">
                <div class="title-wrap f-cb">
                  <div class="tw-title f-fl">{{$t('user.CurrencyAssetDetails')}}</div>
                  <div class="tw-search-box f-fr">
                    <i class="iconfont icon-search"></i>
                    <input type="text" class="uppercase" 
                    :placeholder="$t('user.SearchTheCurrency')" @input="searchChange" v-model="searchText">
                  </div>
                  <div class="tw-check-box f-fr">
                    <input type="checkbox" v-model="hideZeroInput" @click="hideZeroClick">{{$t('user.HideTheCurrencyOf0')}}
                  </div>
                </div>
                <div class="table-wrap">
                  <div class="currency-header sort-icon-wrap">
                    <span class="type">{{$t('user.Coin')}}</span>
                    <span class="use">{{$t('user.Available')}}</span>
                    <span class="freeze">{{$t('user.OnOrders')}}</span>
                    <span class="estimate">{{$t('user.Total')}}</span>
                    <span class="operate">{{$t('user.Action')}}</span>
                  </div>
                  <div class="currency-list">
                    <dl  v-for="(item,index) in currencyLst" :key="index">
                      <dd>
                        <div class="cl-row">
                          <span>{{item.currency}}</span>
                          <span>{{item.position>=0?accountsLstObj[item.currency].balance:0}}</span>
                          <span>{{item.position>=0?accountsLstObj[item.currency].frozen_balance:0}}</span>
                          <span>{{item.position>=0?accountsLstObj[item.currency].total_balance:0}}</span>
                          <span>
                            <em v-if="item.can_recharge===0" style="color:#999">
                              {{$t('user.Deposit')}}
                            </em>
                            <em v-else @click="toCharge(item)">
                              {{$t('user.Deposit')}}
                            </em>
                            <em v-if="item.can_withdraw===0" style="color:#999">
                              {{$t('user.Withdraw')}}
                            </em>
                            <em v-else @click="toWithdraw(item)">
                              {{$t('user.Withdraw')}}
                            </em>
                          </span>
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
import { getAccountsI, getAssetsLst, getSummary } from '@/api/myAssets'
export default {
  components: {
    MyHeader,
    MyFooter,
    AssetSideNav
  },
  data () {
    return {
      btnShow: false,
      data: '',
      currencyLst: '',
      accountsLstObj: '',
      accountsLstArr: [],
      currencyLstArr: [],
      currencyLstObj: '',
      hideZeroInput: false,
      currencyLstAll: '',
      searchText: '',
      moneyzc:0,
      moneybtc:0
    }
  },
  created () {
    getAccountsI().then(res => {
      if (res.state === 1) {
        this.btnShow = true
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
    this.getList()
    this.getSummary()
  },
  methods: {
    getList () {
      getAssetsLst().then(res => {
        if (res.state === 1) {
          let data = res.data
          this.data = data
          let currencyLst = data.currencyLst
          let accountsLst = data.accountsLst
          let accountsLstObj = {}
          let accountsLstArr = []
          let currencyLstObj = {}
          let currencyLstArr = []
          for (let i in accountsLst) {
            accountsLstObj[accountsLst[i].currency] = accountsLst[i]
            if (accountsLst[i].total_balance) {
              accountsLstArr.push(accountsLst[i].currency)
            }
          }
          for (let i in currencyLst) {
            currencyLstObj[currencyLst[i].currency] = currencyLst[i]
            currencyLstArr.push(currencyLst[i].currency)
          }
          currencyLst.forEach(ele => {
            ele.position = accountsLstArr.indexOf(ele.currency)
          })
          let newList = []
          currencyLst.forEach(ele => {
            let exit = ele.currency_name.indexOf(this.searchText.toUpperCase()) !== -1
            if (exit) {
              newList.push(ele)
            }
          })
          let newList2 = []
          if (this.hideZeroInput === true) {
            newList.forEach(ele => {
              if (ele.position >= 0) {
                newList2.push(ele)
              }
            })
            this.currencyLst = newList2
          } else {
            this.currencyLst = newList
          }
          currencyLst.sort(this.sortNumber)
          this.currencyLstAll = currencyLst
          this.accountsLstArr = accountsLstArr
          this.accountsLstObj = accountsLstObj
          this.currencyLstObj = currencyLstObj
          this.currencyLstArr = currencyLstArr
        }
      })
    },
    sortNumber (a, b) {
      return a.c_order - b.c_order
    },
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    toCharge (item) {
      this.$router.push({ name: 'Recharge', params: { currency: item.currency } })
    },
    toWithdraw (item) {
      this.$router.push({ name: 'Withdraw', params: { currency: item.currency } })
    },
    hideZeroClick () {

      this.getList()
    },
    searchChange () {

      this.getList()
    },
    getSummary(){
      getSummary('btczc', '1min', '0', '1', 'market').then(response=>{
        if (response.state == 1) {
          let moneyzc = 0;
          let moneybtc = 0;
          for (let i in response.data.currencyLst){
            if (response.data.currencyLst[i].zc_balance && response.data.currencyLst[i].zc_balance!==null){
                moneyzc += response.data.currencyLst[i].zc_balance
            }
          }
          for (let i in response.data.tickersMap){
            if(response.data.tickersMap[i].symbol == 'btczc'){
            moneybtc = response.data.tickersMap[i].close
            break
            }
          }
          this.moneyzc=moneyzc
          this.moneybtc=moneybtc
        }
      })
    }
  }
}
</script>
<style scoped>
.moneyzc{
  color: #b4c6ee !important;
  font-size: 24px !important;
}
.moneyyg{
  color: #5f78b2 !important;
  font-size: 16px !important;
}
.moneybtc{
  color: #5f78b2 !important;
  font-size: 14px !important;
}
.money{
  height: 120px !important;
  float: left !important;
}
.btns{
  float: right !important;
}

</style>
