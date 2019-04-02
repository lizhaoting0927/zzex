<template>
  <div>
    <my-header @lang-change="langChange"></my-header>
    <div id="MainView">
      <!-- slider -->
      <div class="home-slider container">
        <div class="swiper-cover">
          <my-swiper :lang="lang"></my-swiper>
        </div>
      </div>
      <!-- topbar-list -->
      <div class="home-topbar-list">
        <div class="news-list container">
          <p class="f-cb" id="news">
            <span v-for="(item,index) in news" :key="item.id">
              <a @click="toNoticeDeatil(item)">{{lang==='zh'?item.a_title:item.a_title_en}}</a>
              <span class="sep" v-show="index<2">/</span>
            </span>
          </p>
        </div>
      </div>
      <!-- topbar-box -->
      <div class="home-topbar-boxs">
        <div class="trade-boxs f-cb">
          <div class="trade-box" v-for="(item,index) in trades" :key="index" @click="toTradeCenter(item)">
            <div class="tb-row1 tb-row f-cb">
              <span class="uppercase f-fl">{{item.dspName}}</span>
              <span class="rate f-fr" :class="item.minorplus<0?'fall':'rise'">{{item.myPricePercent}}</span>
            </div>
            <div class="tb-row2 tb-row">
              <span>{{item.high.toFixed(item.pricePrecision)}}<em>/{{item.low.toFixed(item.pricePrecision)}}</em></span>
            </div>
            <div class="tb-row3 tb-row f-cb">
              <span>
                <em class="amount">成交额: {{item.volume.toFixed(item.volumePrecision)}}<em class="uppercase">{{item.baseCurrencyName}}</em></em>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- ticker -->
      <div class="ticker" id="homeTicker">
        <div class="ticker-head">
          <div class="ticker-nav" id="tickerType">
            <span :class="tabItem===0?'cur':''" @click="selectTab(0)">
              <em>
                <i class="iconfont icon-androidstar"></i>
                {{$t('home.Favofites')}}
              </em>
            </span>
            <span  :class="tabItem===1?'cur':''" @click="selectTab(1)">
              <em class="uppercase">zc</em>
            </span>
            <span  :class="tabItem===2?'cur':''" @click="selectTab(2)">
              <em class="uppercase">eth</em>
            </span>
            <span  :class="tabItem===3?'cur':''" @click="selectTab(3)">
              <em class="uppercase">usdt</em>
            </span>
          </div>
          <div class="search-wrap" id="searchWrap">
            <i class="iconfont icon-search"></i>
            <input type="text" class="uppercase" :placeholder="$t('tradecenter.PleaseEnterTransactionPair')" v-model="searchText" @input="searchChange">
          </div>
        </div>
        <div class="ticker-content">
          <div class="ticker-content-head sort-icon-wrap">
            <span></span>
            <span class="pairs">
              {{$t('home.TradingOn')}}
              <!-- <em>
                    <i class="fa fa-caret-up asc"></i>
                    <i class="fa fa-caret-down desc"></i>
                </em> -->
            </span>
            <span class="last-price">
             {{$t('home.LatestPrices')}}
              <!-- <em>
                    <i class="fa fa-caret-up asc"></i>
                    <i class="fa fa-caret-down desc"></i>
                </em> -->
            </span>
            <span class="change">
              {{$t('home.TopGainers')}}
              <!-- <em>
                    <i class="fa fa-caret-up asc"></i>
                    <i class="fa fa-caret-down desc"></i>
                </em> -->
            </span>
            <span class="high">{{$t('home.TopPrice')}}</span>
            <span class="low">{{$t('home.FloorPrice')}}</span>
            <span class="amount">{{$t('home.HourlyVolume')}}</span>
          </div>
          <div class="ticker-content-main" >
            <div id="userTicker">
              <!-- <p class="no-record">暂无记录</p> -->
            </div>
            <div class="cur" id="zcTicker">
              <dl v-for="(item,index) in areaTicker" :key="index" @click="toTradeCenter(item)">
                <dt></dt>
                <dd>
                  <div class="coin-unit" >
                    <span>
                      <i class="iconfont icon-androidstaroutline"  v-show="item.position<0" @click.stop="starClick(item,index)"></i>
                      <i class="iconfont icon-androidstar"  v-show="item.position>=0" @click.stop="starClick(item,index)"></i>
                    </span>
                    <span class="currency">
                      <em class="base-currency">
                        <em class="desc">{{item.baseCurrencyName.toUpperCase()}}/{{item.quoteCurrencyName.toUpperCase()}}</em>
                      </em>
                    </span>

                    <span class="price" v-if="item.quoteCurrencyName==='ZC'">
                      {{item.close.toFixed(item.pricePrecision)}}
                      <em class="desc"> ≈￥{{item.close.toFixed(2)}}</em>
                    </span>
                    <span class="price" v-else-if="item.quoteCurrencyName==='ETH'">
                      {{item.close.toFixed(item.pricePrecision)}}
                      <em class="desc"> ≈￥{{(ethzcTickerClose*item.close).toFixed(2)}}</em>
                    </span>
                    <span class="price" v-else>
                      {{item.close.toFixed(item.pricePrecision)}}
                      <em class="desc"> ≈￥{{(usdtzcTickerClose*item.close).toFixed(2)}}</em>
                    </span>

                    <span class="rate rise" v-show="item.open-item.close<0">+{{(((item.close - item.open) * 100) / item.open).toFixed(2)|isNaNFilter}} %</span>
                    <span class="rate fall" v-show="item.open-item.close>=0">{{(((item.close - item.open) * 100) / item.open).toFixed(2)|isNaNFilter }} %</span>
                    <span class="high">{{item.high.toFixed(item.pricePrecision)}}</span>
                    <span class="low">{{item.low.toFixed(item.pricePrecision)}}</span>
                    <span class="amount">{{item.volume.toFixed(item.volumePrecision)}}</span>
                  </div>
                </dd>
              </dl>
            </div>
            <div id="ethTicker"></div>
            <div id="btcTicker"></div>
          </div>
        </div>
      </div>
      <!-- preview -->
      <div class="banner-preview container">
        <div class="title-wrap">
          <div class="title">{{$t('home.MobileClientSupport')}}</div>
          <div class="subtitle">{{$t('home.PleaseClickToDownload')}}</div>
        </div>
        <div class="button-wrap">
          <span id="iOSBtn" @mousemove="iosMousemove" @mouseout="iosMouseout">
            <i class="iconfont icon-apple"></i>
            iOS
          </span>
          <span id="AndroidBtn" @mousemove="androidMousemove" @mouseout="androidMouseout">
            <i class="iconfont icon-android"></i> 
            Android
          </span>
          <img class="iOSImg" src="@/assets/images/Androidqrcode.png" alt="" v-show="iOSImg">
          <img class="AndroidImg" src="@/assets/images/Androidqrcode.png" alt="" v-show="androidImg">
        </div>
        <img src="@/assets/images/home-phone.png" alt="">
      </div>
      <!-- trade-now -->
      <div class="home-trade-now" v-show="isTradeShow">
        <div class="trade-user">
          <div class="tu-title">{{$t('home.SoonTrading')}}</div>
          <div class="tu-subtitle">{{$t('home.BlockchainDigital')}}</div>
          <div class="tu-btns f-cb">
            <router-link to="/login" class="tu-btn tu-login-btn">{{$t('home.Login')}}</router-link>
            <router-link to="/register" class="tu-btn tu-reg-btn">{{$t('home.Register')}}</router-link>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
import MyHeader from '@/components/Header/index.vue'
import MyFooter from '@/components/Footer'
import MySwiper from '@/components/Swiper'
import { getNewsList, getAllTicker, getFavorite, favorite, favoriteDel,tokenLogin ,getRecently} from '@/api/home.js'
import {setTrade} from '@/libs/utils'
import { getMember } from '@/api/login.js'
import {getLang} from '../libs/utils.js'
import Cookies from 'js-cookie'

export default {
  components: {
    MyHeader,
    MyFooter,
    MySwiper
  },
  data () {
    return {
      news: [],
      trades: [],
      allTicker: [],
      allTickerArr: [],
      areaTicker: [],
      areaTicker1: [],
      areaTicker2: [],
      areaTicker3: [],
      userFavoriteArr: [],
      userFavorite: '',
      state: '',
      isTradeShow: true,
      searchText: '',
      allTickerSymArr: [],
      allTickerSymObj: {},
      tabItem: 1,
      ethzcTickerClose: '',
      usdtzcTickerClose: '',
      clicktimes: 0,
      starimg: '',
      loop: '',
      iOSImg: false,
      androidImg: false,
      lang:'zh',
      token: {
        api_key: null,
        sign: null,
        timestamp: null,
      },

    }
  },
  filters:{
    isNaNFilter(val){
      if(isNaN(val)){
        return 0
      }else{
        return val
      }
    }
  },

  created () {
    let lang = getLang()
    if(lang){
      this.lang= lang
    }
    getNewsList(304, 1, 3).then(res => {
      this.news = res.data.list
    })
    // getRecently(1, 3).then(res => {
    //   console.log(res)
    //   this.news = res.data
    // })
    this.tickerInit(true)
    this.isUserLoginHome()
  },
  mounted () {
    this.loop = setInterval(() => {
      this.tickerInit(false)
    }, 3000)
    this.tokenLogin();
  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  },
  methods: {
    tokenLogin() {
      this.token.api_key = this.getQueryString('api_key');

      this.token.sign = this.getQueryString('sign');
      this.token.timestamp = this.getQueryString('timestamp');
      console.log(this.token);

      if (this.token.api_key !== null) {
        tokenLogin(this.token).then(res=>{
            if (res.state === 1) {
              let loginState = true
              sessionStorage.setItem('loginState', loginState)
              this.isUserLogin()
              this.$router.push('/')
              // localStorage.setItem('ZZEX_TOKEN',res.data.token)
              Cookies.set('ZZEX_TOKEN', res.data.token)
            } else if (res.state === -1) {
              this.$router.push('/login')
            }
        });
      }
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
      })
    },
    getQueryString(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.href.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    toTradeCenter(item){
      this.$router.push({name:'Tradecenter'})
      setTrade(item.symbol.toUpperCase())
    },
    toNoticeDeatil(item){
      // this.$router.push({path:'/newsdeta',query:{id:item.parent_id}})
      this.$router.push({path:'/newsDetail',query:{id:item.id}})
    },
    tickerInit (flag) {
      getAllTicker().then(res => {
        let allTicker = res.data
        this.allTicker = allTicker
        let allTickerArr = []
        let allTickerSymArr = []
        let allTickerSymObj = {}
        let ethzcTickerClose = ''
        let usdtzcTickerClose = ''
        let userFavoriteArr = []
        for (let i in allTicker) {
          var symbol = i.split('_')[0]
          allTickerSymArr.push(symbol)
          allTickerArr.push(allTicker[i])
          allTickerSymObj[symbol] = allTicker[i]
          ethzcTickerClose = allTicker['ethzc_ticker'].close
          if (allTicker['usdtzc_ticker']) {
            usdtzcTickerClose = allTicker['usdtzc_ticker'].close
          } else {
            usdtzcTickerClose = 0
          }
        }

        getFavorite().then(res => {
          let favoriteData = res.data
          this.state = res.state
          let userFavorite = []
          if (this.state === 1) {
            favoriteData.forEach(ele => {
              userFavorite.push(ele.pair_dsp_name)
            })
          }

          this.userFavorite = userFavorite

          allTickerArr.forEach(ele => {
            ele.position = this.userFavorite.indexOf(ele.symbol.toUpperCase())
            if (ele.position >= 0) {
              userFavoriteArr.push(ele)
            }
          })
          this.ethzcTickerClose = ethzcTickerClose
          this.usdtzcTickerClose = usdtzcTickerClose
          this.allTickerSymArr = allTickerSymArr
          this.allTickerSymObj = allTickerSymObj
          allTickerArr.sort(this.sortby)
          let trades = allTickerArr.slice(0, 5)
          let areaTicker1 = []
          let areaTicker2 = []
          let areaTicker3 = []
          allTickerArr.forEach(ele => {
            switch (ele.areaId) {
              case 1:
                areaTicker1.push(ele)
                break
              case 2:
                areaTicker2.push(ele)
                break
              default:
                areaTicker3.push(ele)
                break
            }
          })
          if (flag) {
            this.areaTicker = areaTicker1
          }
          this.userFavoriteArr = userFavoriteArr
          this.areaTicker1 = areaTicker1
          this.areaTicker2 = areaTicker2
          this.areaTicker3 = areaTicker3
          this.allTickerArr = allTickerArr
          trades.forEach(ele => {
            ele.myPricePercent = this.upAndDown(ele)
            ele.minorplus = ele.close - ele.open
          })
          this.trades = trades
        })

      // this.loadDataToTb()
      })
    },
    starClick (item) {
      setTimeout(() => {
        this.selectTab(this.tabItem)        
      }, 2000);
      if (item.position < 0) {
        favorite(item.symbol.toUpperCase()).then(res => {
          if (res.state === 1) {
            // this.$set(this.areaTicker[index], 'position', 0)
            this.$message({
              type: 'success',
              message: this.$t('header.Collection')+' '+`${item.symbol}`+' '+this.$t('header.success'),
              duration: 3000,
              showClose: true
            })

            this.tickerInit(false)
          } else if (res.state === -1) {
            if (res.msg === 'LANG_NO_LOGIN') {
              setTimeout(() => {
                this.userLogout()
              }, 2000)
            }
          }
        })
      } else {
        favoriteDel(item.symbol.toUpperCase()).then(res => {
          if (res.state === 1) {
            // this.$set(this.areaTicker[index], 'position', -1)
            this.$message({
              type: 'success',
              message:this.$t('header.CancelCollection')+' '+`${item.symbol}`+' '+this.$t('header.success'),
              duration: 3000,
              showClose: true
            })
            this.tickerInit(false)
          } else if (res.state === -1) {
            if (res.msg === 'LANG_NO_LOGIN') {
              setTimeout(() => {
                this.userLogout()
              }, 2000)
            }
          }
        })
      }
      this.tickerInit(false)
      // this.selectTab(this.tabItem)
    },
    selectTab (index) {
      this.tabItem = index
      let selectTabTicker = []
      switch (index) {
        case 1:
          selectTabTicker = this.areaTicker1
          break
        case 2:
          selectTabTicker = this.areaTicker2
          break
        case 3:
          selectTabTicker = this.areaTicker3
          break
        default:
          selectTabTicker = this.userFavoriteArr
          break
      }
      this.areaTicker = selectTabTicker.filter(item => item.symbol.toUpperCase().indexOf(this.searchText.toUpperCase()) !== -1)
    },
    userLogout () {
      this.loginState = false
      sessionStorage.setItem('loginState', this.loginState)
      this.$router.push('/login')
    },
    searchChange () {
      this.selectTab(this.tabItem)
    },

    sortby (a, b) {
      return a.order - b.order
    },
    isUserLoginHome () {
      getMember().then(
        res => {
          if (res) {
            if (res.state === 1) {
              this.isTradeShow = false
            }
          }
        }

      )
    },
    sortNumber (a, b) {
      return a.order - b.order
    },
    upAndDown (ele) {
      var pricePrecision = ele.pricePrecision
      var open = ele.open.toFixed(pricePrecision)
      var close = ele.close.toFixed(pricePrecision)
      var sign
      if (open - close < 0) {
        sign = '+'
      } else {
        sign = ''
      }
      var pricePercent =
        sign + (((close - open) * 100) / open).toFixed(2) + '%'
      return pricePercent
    },
    iosMousemove () {
      this.iOSImg = true
    },
    iosMouseout () {
      this.iOSImg = false
    },
    androidMousemove () {
      this.androidImg = true
    },
    androidMouseout () {
      this.androidImg = false
    },
    langChange(lang){
      this.lang=lang
    }
  }
}
</script>
<style scoped>
/* a{
  color: #faf7f4;
}
a:hover{
  color: #d98746;
}
.home-topbar-list .news-list .sep{
  color: #e5e5e5;
}
#MainView,
.home-topbar-list{
  background-color: #131519;
}
.ticker .ticker-content .ticker-content-main dl dd{
  color: #444;
}
.ticker .search-wrap input{
  color: #444;
}
.ticker .ticker-content .ticker-content-main dl .coin-unit span .desc,
.home-topbar-boxs .trade-box .tb-row span:first-child{
  color: #999;
}
.home-topbar-boxs .trade-box .tb-row span:first-child .amount,
.ticker .ticker-nav span{
  color: #444; 
}
.ticker .ticker-content .ticker-content-main dl .coin-unit span:first-child i,
.ticker .ticker-nav span em i{
  color: #f3b584;
}
.ticker .ticker-content .ticker-content-head span{
  color: #999;
}
.star_icon{
  width: 20px;
  height: 20px;
}
.home-slider{
  background-color: #060300;
}
.ticker,
.home-trade-now,
.home-topbar-boxs{
  background-color: #f5f5f5;
}
.home-topbar-boxs .trade-box{
  border: 1px solid #e5e5e5;
  background-color: #faf8f6;
}
.home-topbar-boxs .trade-box:hover{
  background-color: #dfdfe0;
}
.ticker .ticker-nav{
  border-left: 1px solid #e5e5e5;
}
.ticker .search-wrap,
.ticker .ticker-content{
  border: 1px solid #e5e5e5;
}
.ticker .ticker-nav span{
  border: 1px solid #e5e5e5;
  border-left: none;
}
.ticker .search-wrap{
  background-color: #faf8f6; 
}
.ticker .ticker-nav span.cur{
  background: #f5f5f5;
  border-bottom: none;
}
.ticker .ticker-content .ticker-content-main dl{
  box-shadow: 0 0 1px #e5e5e5;
}
.ticker .ticker-content .ticker-content-main dl:hover{
  background-color: #dfdfe0;
}
.ticker .ticker-content .ticker-content-main{
  background-color: #faf8f6;
}
.banner-preview .button-wrap,
.banner-preview .title-wrap{
  color: #fff;
}
.banner-preview .button-wrap span{
  border: 1px solid #999;
}
.home-trade-now .trade-user .tu-title,
.home-trade-now .trade-user .tu-subtitle{
  color: #444444;
}
.home-trade-now .trade-user .tu-btn{
  border-radius: 0;
  border: none;
}
.home-trade-now .trade-user .tu-reg-btn{
  background-color: #dd9b60;
}
.ticker .ticker-content .ticker-content-main::-webkit-scrollbar{
  display: none;
}
.ticker .search-wrap i{
  color: #dd9b60;
} */
</style>
