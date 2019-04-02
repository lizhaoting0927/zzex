<template>
  <div>
    <div class="head">
      <div class="title f-fl">
        {{$t('home.LatestPrices')}}
        <span class="transform uppercase">≈ <em>{{convertCNY.toFixed(2)}}</em> cny</span>
      </div>
      <div class="up-and-down f-fr">
        <span class="up" :class="upDownSelect===0?'hideheight':'showshell'" @click="upDownTabClick(0)"></span>
        <span class="down" :class="upDownSelect===1?'hideheight':'showshell'" @click="upDownTabClick(1)"></span>
        <span class="mixed" :class="upDownSelect===2?'hideheight':'showshell'" @click="upDownTabClick(2)"></span>
      </div>
    </div>
    <div class="main-header">
      <dl>
        <dt>
          <div class="header">
            <span class="type">{{$t('tradecenter.Type')}}</span>
            <span class="price">{{$t('tradecenter.Price')}}(<i>{{quoteCurrencyName}}</i>)</span>
            <span class="num">{{$t('tradecenter.Num')}}(<i>{{baseCurrencyName}}</i>)</span>
            <span class="amount">{{$t('tradecenter.Total')}}(<i>{{baseCurrencyName}}</i>)</span>
          </div>
        </dt>
      </dl>
    </div>
    <div class="main">
      <div class="depth-sell" :class="depthSellStyle">
        <dl class="sell-bar" id="sellBar">
          <dd @click="sellBarClick(item)" v-for="(item,index) in depthAsksArr" :key="index">
            <div class="inner">
              <span class="type">{{item.type}}</span>
              <span class="price fall">{{item[0].toFixed(currentPricePrecision)}}</span>
              <span class="num">{{item[1].toFixed(currentVolumePrecision)}}</span>
              <span class="amount">{{sellAmountArr[index]}}</span>
              <span class="bg-dd-red" :style="SellBackgroundWidth[index]"></span>
            </div>
          </dd>
        </dl>
      </div>
      <div class="dl-hr"></div>
      <div class="depth-buy" :class="depthBuyStyle">
        <dl class="buy-bar" id="buyBar">
          <dd @click="buyBarClick(item)" v-for="(item,index) in depthBidsArr" :key="index">
            <div class="inner">
              <span class="type">{{$t('header.TradeCenterBuy')}}{{index+1}}</span>
              <span class="price rise">{{item[0].toFixed(currentPricePrecision)}}</span>
              <span class="num">{{item[1].toFixed(currentVolumePrecision)}}</span>
              <span class="amount">{{buyAmountArr[index]}}</span>
              <span class="bg-dd-green" :style="backgroundWidth[index]"></span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['convertCNY','quoteCurrencyName','baseCurrencyName','currentPricePrecision','currentVolumePrecision','depth','hashsymbol'],
  data(){
    return{
      upDownSelect:2,
      depthBuyStyle: '',
      depthSellStyle: '',
      depthBidsArr:[],
      depthAsksArr:[],
      sellAmountArr:[],
      buyAmountArr:[],
      SellBackgroundWidth: [],
      backgroundWidth:[]
    }
  },
  created() {
    this.loadDepthPanel()
  },
  watch:{
    depth(){
      this.loadDepthPanel()
    },
    hashsymbol(){
      this.upDownTabClick(2)
    }
  },
  methods:{
    loadDepthPanel () {
      //bid数组
      let depthBidsArr = this.depth.bids.slice(0, 12)
      this.depthBidsArr = depthBidsArr
      //ask数组
      let depthAsksArr = this.depth.asks.slice(0, 12)
      depthAsksArr.forEach((ele, index) => {
        ele.type = this.$t('header.TradeCenterSell') + (index + 1)
      })
      this.depthAsksArr = depthAsksArr.reverse()

      this.depthBuyPanel()
      this.depthSellPanel()
    },
    //BUY样式动态生成
    depthBuyPanel () {
      let buyAmount = 0
      let buyAmountArr = []
      let buyVolumeArr = []
      let buyVolumeDivideArr = []
      let depthBidsArrLength = this.depthBidsArr.length >= 12 ? 12 : this.depthBidsArr.length
      for (let i = 0; i < depthBidsArrLength; i++) {
        buyVolumeArr.push(this.depthBidsArr[i][1])
      }
      let maxVolume = Math.max.apply(null, buyVolumeArr)
      for (let j = 0; j < buyVolumeArr.length; j++) {
        buyAmount += buyVolumeArr[j]
        buyAmountArr.push(buyAmount.toFixed(this.currentVolumePrecision))
        buyVolumeDivideArr.push((buyVolumeArr[j] * 100 / maxVolume).toFixed(0) + '%')
      }
      this.buyAmountArr = buyAmountArr
      this.backgroundWidth=[]
      for (let k = 0; k < depthBidsArrLength; k++) {
        this.backgroundWidth.push({ width: buyVolumeDivideArr[k] })
      }
    },
    //SELL样式动态生成
    depthSellPanel () {
      let sellAmount = 0
      let sellAmountArr = []
      let sellVolumeArr = []
      let sellVolumeDivideArr = []
      let depthAsksArrLength = this.depthAsksArr.length 
      
      for (let i = depthAsksArrLength-1; i >= 0; i--) {
        sellVolumeArr.push(this.depthAsksArr[i][1])
      }
      let maxVolume = Math.max.apply(null, sellVolumeArr)
      for (let j = 0; j < sellVolumeArr.length; j++) {
        sellAmount += sellVolumeArr[j]
        sellAmountArr.push(sellAmount.toFixed(this.currentVolumePrecision))
        sellVolumeDivideArr.push((sellVolumeArr[j] * 100 / maxVolume).toFixed(0) + '%')
      }
      this.sellAmountArr = sellAmountArr.reverse()
      this.SellBackgroundWidth=[]
      for (let k = depthAsksArrLength - 1; k >= 0; k--) {
        this.SellBackgroundWidth.push({ width: sellVolumeDivideArr[k] })
      }
    },
    
    sellBarClick (item) {
      this.$emit('sell-bar-click',item)
    },    
    buyBarClick (item) {
      this.$emit('buy-bar-click',item)
    },    
    upDownTabClick (index) {
      this.upDownSelect = index
      switch (index) {
        case 0:
          this.depthBuyStyle = 'showshell'
          this.depthSellStyle = 'hideheight'
          break
        case 1:
          this.depthBuyStyle = 'hideheight'
          this.depthSellStyle = 'showshell'
          break
        case 2:
          this.depthBuyStyle = ''
          this.depthSellStyle = ''
          break
        default:
          break
      }
    },
  }
}
</script>
