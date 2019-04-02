<template>
  <div>
    <my-header :selectHeaderTab="selectHeaderTab" @lang-change="langChange"></my-header>
    <div id="MainView">
      <div class="trade-panel">
        <div class="tp-row-1">
          <div class="sidebar">
            <div class="user-assets">
              <img src="../assets/images/pleaseLogin.png" alt="" v-show="!state" @click="toLogin">
              <div class="user-money" v-show="state">
                <p>
                  <span>{{$t('tradecenter.NetAssetConversion')}}</span>
                  <i class="iconfont icon-eye-slash" @click="hideMoney" v-show="moneyShow"></i>
                  <i class="iconfont icon-eye" @click="showMoney" v-show="!moneyShow"></i>
                </p>
                <p id="usermoney" v-show="moneyShow">{{(money/btcclose).toFixed(6)}} BTC ≈ {{money.toFixed(2)}} CNY
                </p>
                <p id="usermoneyhide" v-show="!moneyShow">****** BTC ≈ ****** CNY
                </p>
              </div>
            </div>
            <ticker-summary 
              :allTicker1="allTicker1"
              :allTicker2="allTicker2"
              :allTicker3="allTicker3"
              :userFavoriteArr="userFavoriteArr"
              @to-user-ticker="toUserTicker"
              @star-click="starClick"
            ></ticker-summary>
          </div>
          <div class="page-content">
            <div class="chart-wrap pc-row-1">
              <coin-summary 
                :ticker="ticker"
                :currentPricePrecision="currentPricePrecision"
                :currentVolumePrecision="currentVolumePrecision"
                :convertCNY="convertCNY"
                v-if="coinSummaryReady"
              />
            </div>
            <!-- 买卖单 -->
            <div class="pc-row-2">
              <div class="pc-row-2-c1" id="pcRow2C1">
                <div class="inner">
                  <div class="buy-and-sold-header">
                    <span>{{$t('tradecenter.BuyOrSell')}}</span>
                  </div>
                  <div class="buy-and-sold-main f-cb">
                    <buy-and-sell 
                      @reload="reload"
                      :quoteCurrencyName="quoteCurrencyName"
                      :baseCurrencyName="baseCurrencyName"
                      :tickerCanRecharge="ticker.canRecharge"
                      :saleoutBalance="saleoutBalance"
                      :balance="buyInBalance"
                      :hashsymbol="hashsymbol"
                      :currentPricePrecision="currentPricePrecision"
                      :ethzcTickerClose="ethzcTickerClose"
                      :usdtzcTickerClose="usdtzcTickerClose"
                      :currentVolumePrecision="currentVolumePrecision"
                      :symbol="hashsymbol"
                      :soldOutPosition="soldOutPosition"
                      buyOrSell="buy"
                      :buyinPriceProps="buyin.price"
                      @buy-or-sell-click="buyOrSellClick"
                    />
                    <sell-panel 
                      @reload="reload"
                      :quoteCurrencyName="quoteCurrencyName"
                      :baseCurrencyName="baseCurrencyName"
                      :tickerCanRecharge="ticker.canRecharge"
                      :balance="saleoutBalance"
                      :hashsymbol="hashsymbol"
                      :currentPricePrecision="currentPricePrecision"
                      :ethzcTickerClose="ethzcTickerClose"
                      :usdtzcTickerClose="usdtzcTickerClose"
                      :currentVolumePrecision="currentVolumePrecision"
                      :symbol="hashsymbol"
                      :soldOutPosition="soldOutPosition"
                      buyOrSell="sell"
                      :buyinPriceProps="sell.price"
                      @buy-or-sell-click="buyOrSellClick"
                    />
                  </div>
                </div>
              </div>
              <div class="pc-row-2-c2" id="depth">
                <last-price 
                  :hashsymbol="hashsymbol"
                  @sell-bar-click="sellBarClick"
                  @buy-bar-click="buyBarClick"
                  :convertCNY="convertCNY"
                  :quoteCurrencyName="quoteCurrencyName"
                  :baseCurrencyName="baseCurrencyName"
                  :currentPricePrecision="currentPricePrecision"
                  :currentVolumePrecision="currentVolumePrecision"
                  :depth="depth"
                  v-if="depthReady"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="tp-row-2">
          <div class="tr2-inner" id="tr2Inner">
            <trade-list 
            :orders = "orders" 
            :historyOrders = "historyOrders"
            @trade-list-reload ="tradeListReload"
            />
            <real-time-trade 
              :quoteCurrencyName="quoteCurrencyName"
              :baseCurrencyName="baseCurrencyName"
              :currentPricePrecision="currentPricePrecision"
              :currentVolumePrecision="currentVolumePrecision"
              :trade="trade"
            />
          </div>
        </div>
        <coin-info 
          :lang="lang"
          :hashsymbol="hashsymbol"
          :baseCurrencyName="baseCurrencyName"
          ></coin-info>
      </div>
    </div>
    <div>
      <TVChartContainer :symbol='hashsymbol.toLowerCase()'  style="position: absolute;top: 120px;right: 10px;left: 380px;z-index: 1;"/>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
import MyHeader from '@/components/Header'
import MyFooter from '@/components/Footer'
import TVChartContainer from '../components/TVChartContainer.vue'
import CoinInfo from '@/components/TradeCenter/CoinInfo'
import RealTimeTrade from '@/components/TradeCenter/RealTimeTrade'
import LastPrice from '@/components/TradeCenter/LastPrice'
import CoinSummary from '@/components/TradeCenter/CoinSummary'
import TradeList from '@/components/TradeCenter/TradeList'
import TickerSummary from '@/components/TradeCenter/TickerSummary'
import BuyAndSell from '@/components/TradeCenter/buyAndSell'
import SellPanel from '@/components/TradeCenter/SellPanel'
import {  favorite, favoriteDel } from '@/api/home.js'
import { getTicker, getSummary, getFavorite,getOrdersI } from '@/api/tradecenter'
import {getTrade,setMoneyShow,getMoneyShow} from '@/libs/utils'

export default {
  components: {
    MyHeader,
    MyFooter,
    TVChartContainer,
    CoinInfo,
    RealTimeTrade,
    LastPrice,
    CoinSummary,
    TradeList,
    TickerSummary,
    BuyAndSell,
    SellPanel
  },
  data () {
    return {
      selectHeaderTab:1,
      hashsymbol: 'ETHZC',
      quoteCurrencyName: '',
      baseCurrencyName: '',
      // search: '',
      allTickerArr: [],
      allTickerObj: '',
      state: false,
      userFavorite: '',
      userFavoriteObj: '',
      ticker: '',
      currentPricePrecision: '',
      currentVolumePrecision: '',
      ethzcTickerClose: '',
      usdtzcTickerClose: '',
      convertCNY: '',
      coinSummaryReady:false,
      headerRiseFallPercent: '',
      currencyLst: '',
      saleoutBalance: 0,
      soldOutPosition: '',
      buyInBalance: 0,
      buyInPosition: '',
      depth: '',
      depthReady:false,
      depthBidsArr: '',
      depthAsksArr: '',
      buyAmountArr: [],
      sellAmountArr: [],
      backgroundWidth: [],
      SellBackgroundWidth: [],
      trade: '',
      symbol: '',
      // selectTab: 0,
      // entrustTab: 0,
      upDownSelect: 2,
      depthSellStyle: '',
      depthBuyStyle: '',
      getFavoriteState: '',
      userFavoriteArr: [],//自选列表
      allTicker1: [],//areId=1的coinsummary
      allTicker2: [],//areId=2的coinsummary
      allTicker3: [],//areId=3的coinsummary
      buyinConvertedval: '',
      dragBarPosition: '',
      orders:'',
      historyOrders:'',
      buyin:{
        price:''
      },
      sell:{
        price:''
      },
      money:0,
      btcclose:0,
      moneyShow:false,
      lang:'zh'
    }
  },
  watch: {
    hashsymbol () {
      this.getTicker()
      this.tradeSummary()
      this.currentEntrustPanel()
      this.historyEntrustPanel()
    }
  },
  created () {
    this.state = JSON.parse(sessionStorage.getItem('loginState'))
    this.moneyShow =getMoneyShow()
    let hash =getTrade()
    if (hash) {
      this.hashsymbol = hash
    }

    this.getTicker()
    this.tradeSummary()
    this.loop = setInterval(() => {
      this.tradeSummary()
    }, 2000)
    this.currentEntrustPanel()
    this.historyEntrustPanel()
  },
  beforeDestroy () {
    window.clearInterval(this.loop)
  },
  methods: {
    buyOrSellClick(){
      this.getTicker()
      this.tradeSummary()
      this.currentEntrustPanel()
      this.historyEntrustPanel()
    },
    tradeListReload(){
      this.currentEntrustPanel();
      this.historyEntrustPanel();
    },
    reload(){
      this.currentEntrustPanel();
      this.historyEntrustPanel();
      this.tradeSummary();
    },
    currentEntrustPanel () {
      getOrdersI(this.hashsymbol, '1', '0').then((response) => {
        if (response.state === 1) {
          let orders = response.orders
          this.orders = orders
        }
      })
    },
    historyEntrustPanel () {
      getOrdersI(this.hashsymbol, '1', '1').then((response) => {
        if (response.state === 1) {
          let orders = response.orders
          orders.forEach(ele=>{
            switch (ele.o_status) {
              case 'done':
                ele.status=this.$t('tradecenter.Transaction')
                break;
            case 'canceled':
                ele.status=this.$t('tradecenter.Cancellations')
                break;
             case 'partial-canceled':
                ele.status=this.$t('tradecenter.PartOfIts')
                break;
            }
          })
          this.historyOrders = orders
        }
      })
    },
    getTicker () {
      getTicker(this.hashsymbol).then((response) => {
        this.baseCurrencyName = response.baseCurrencyName
        this.quoteCurrencyName = response.quoteCurrencyName
        this.symbol = response.symbol.toUpperCase()
        this.currentPricePrecision = response.pricePrecision
        this.currentVolumePrecision = response.volumePrecision
        // this.userBuyInPanel()
        // this.userSoldOutPanel()
      })
    },
    tradeSummary () {
      getSummary(this.hashsymbol, '1min', '0', '1', 'market').then((response) => {
        //hashsymbol类型币种的具体的信息
        let ticker = response.data.ticker
        this.ticker = ticker
        //所有币种的具体信息
        let tickersMap = response.data.tickersMap
        //ethzc的收盘价
        let ethzcTickerClose = tickersMap['ethzc_ticker'].close
        this.ethzcTickerClose = ethzcTickerClose
        //usdtzc的收盘价
        let usdtzcTickerClose = ''
        if (tickersMap['usdtzc_ticker']) {
          usdtzcTickerClose = tickersMap['usdtzc_ticker'].close
        } else {
          usdtzcTickerClose = 0
        }
        this.usdtzcTickerClose = usdtzcTickerClose
        //货币等于多少rmb
        let convertCNY = ''
        if (ticker.areaId === 1) {
          convertCNY = ticker.close
        } else if (ticker.areaId === 2) {
          convertCNY = ticker.close * ethzcTickerClose
        } else if (ticker.areaId === 3) {
          convertCNY = ticker.close * usdtzcTickerClose
        }
        this.convertCNY = convertCNY
        this.coinSummaryReady=true


        //用户登录之后后台才返回的字段 
        let currencyLst = response.data.currencyLst
        this.currencyLst = currencyLst

        //hashsymbol的深度信息
        let depth = response.data.depth
        this.depth = depth
        this.depthReady=true
        //hashsymbol的交易信息
        let trade = response.data.trade
        this.trade = trade

        //所有币种的对象集合 （貌似和tickersMap无差）
        let allTickerObj = {}
        //所有币种的symbol集合
        let allTickerArr = []
        let btcclose= 0
        for (let i in tickersMap) {
          if(tickersMap[i].symbol=='btczc'){
              btcclose = tickersMap[i].close
              break
          }
        }
        this.btcclose=btcclose
        for (let i in tickersMap) {
          let tickerMapSymbol = tickersMap[i].symbol
          allTickerArr.push(tickerMapSymbol)
          allTickerObj[tickerMapSymbol] = tickersMap[i]
        }
        this.allTickerArr = allTickerArr
        this.allTickerObj = allTickerObj
        this.allTickerFilter()
        //获取用户喜欢的交易对
        getFavorite().then((response) => {
          //获取用户喜欢交易对 是否成功
          this.getFavoriteState = response.state
          //用户喜欢的交易对 只含名称
          let userFavorite = response.data
          this.userFavorite= userFavorite
          let userFavoriteSymbol = []
          if (this.getFavoriteState === 1) {
            userFavorite.forEach(ele => {
              userFavoriteSymbol.push(ele.pair_dsp_name)
            })
            this.userFavoriteSymbol = userFavoriteSymbol
            this.userFavoriteFilter()
          }else{
            this.splitAllTicker()
          }
        })
        this.soldOutCanUseHeader()
        this.buyInCanUseHeader()

      })
    },
    allTickerFilter(){
      let allTickerArr = []
      for (let j in this.allTickerObj) {
        allTickerArr.push(this.allTickerObj[j])
        allTickerArr.sort(this.sortNumber)
      }
      allTickerArr.forEach(ele => {
        ele.tickerRiseFallPercent = this.riseFallPercent(ele, ele.pricePrecision)
      })
      this.allTickerArr = allTickerArr
    },
    splitAllTicker(){
      let allTicker1 = []
      let allTicker2 = []
      let allTicker3 = []
      let allTickerArr = this.allTickerArr
      for (let i = 0; i < allTickerArr.length; i++) {
        let areaId = allTickerArr[i].areaId
        if (areaId === 1) {
          allTicker1.push(allTickerArr[i])
        }
        if (areaId === 2) {
          allTicker2.push(allTickerArr[i])
        }
        if (areaId === 3) {
          allTicker3.push(allTickerArr[i])
        }
      }
      this.allTicker1 = allTicker1
      this.allTicker2 = allTicker2
      this.allTicker3 = allTicker3
    },
    userFavoriteFilter () {
      let userFavoriteObj = {}
      let userFavoriteArr = []
      this.allTickerArr.forEach( ele =>{
        ele.position=this.userFavoriteSymbol.indexOf(ele.symbol.toUpperCase())!==-1
      })
      this.splitAllTicker()
      //如果获取用户喜欢交易对成功
      for (let i = 0; i < this.userFavorite.length; i++) {
        //获取用户喜欢交易对的symbol
        let favorSymbol = this.userFavorite[i].pair_dsp_name.toLowerCase()
        //如果所有交易对包含这个用户喜欢的symbol
        if (this.allTickerObj[favorSymbol]) {
            //将这个交易对的对象传给userFavoriteObj
          userFavoriteObj[favorSymbol] = this.allTickerObj[favorSymbol]
        }
      }
      //将自选对象转化成数组
      for (let a in userFavoriteObj) {
        userFavoriteArr.push(userFavoriteObj[a])
      }
      userFavoriteArr.forEach(ele => {
        ele.tickerRiseFallPercent = this.riseFallPercent(ele, ele.pricePrecision)
      })
      this.userFavoriteArr = userFavoriteArr
    },

    sortNumber (a, b) {
      return a.order - b.order
    },
    riseFallPercent (ticker, precision) {
      let open = ticker.open.toFixed(precision)
      let close = ticker.close.toFixed(precision)
      let sign
      if (open - close < 0) {
        sign = '+'
      } else {
        sign = ''
      }
      return sign + (((close - open) * 100) / open).toFixed(2)
    },

    buyInCanUseHeader () {
      let quoteCurrencyNameArr = []
      if (this.state) {
        
        for (let i = 0; i < this.currencyLst.length; i++) {
          quoteCurrencyNameArr.push(this.currencyLst[i].currency)
        }
        let position = quoteCurrencyNameArr.indexOf(this.quoteCurrencyName)
        let buyInBalance = ''
        this.buyInPosition = position
        if (position >= 0) {
          buyInBalance = this.currencyLst[position].balance
        } else {
          buyInBalance = 0
        }
        this.buyInBalance = buyInBalance
      }
    },

    soldOutCanUseHeader () {
      let baseCurrencyNameArr = []
      let money = 0
      if (this.state) {
        for (let i = 0; i < this.currencyLst.length; i++) {
          money+=this.currencyLst[i].zc_balance
          baseCurrencyNameArr.push(this.currencyLst[i].currency)
        }
        this.money = money
        let position = baseCurrencyNameArr.indexOf(this.baseCurrencyName)
        let balance = ''
        this.soldOutPosition = position
        if (position >= 0) {
          balance = this.currencyLst[position].balance
        } else {
          balance = 0
        }
        this.saleoutBalance = balance
      }
    },
    starClick(item){
      if (!item.position) {
        favorite(item.symbol.toUpperCase()).then(res => {
          if (res.state === 1) {
            // this.$set(this.areaTicker[index], 'position', 0)
            this.$message({
              type: 'success',
              message: this.$t('header.Collection')+' '+`${ item.symbol }`+' '+this.$t('header.success'),
              duration: 3000,
              showClose: true
            })
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
              message:this.$t('header.CancelCollection')+' '+`${ item.symbol }`+' '+this.$t('header.success'),
              duration: 3000,
              showClose: true
            })
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
    },



    buyBarClick (item) {
      this.buyin.price = item[0].toFixed(this.currentPricePrecision)
      this.sell.price = item[0].toFixed(this.currentPricePrecision)
    },
    sellBarClick (item) {
      this.buyin.price = item[0].toFixed(this.currentPricePrecision)
      this.sell.price = item[0].toFixed(this.currentPricePrecision)
    },
    toUserTicker (item) {
      this.hashsymbol = item.symbol.toUpperCase()
    },
    hideMoney(){
      this.moneyShow=false
      setMoneyShow(false)
    },
    showMoney(){
      this.moneyShow=true
      setMoneyShow(true)
    },
    langChange(lang){
      this.lang=lang
    },
    toLogin(){
      this.$router.push('/login')
    }
  }
}
</script>
<style>
.el-slider__stop{

}
</style>
