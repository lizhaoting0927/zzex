<template>
  <div class="tp-row-3">
    <div
      class="tr3-inner"
      id="tr3Inner"
    >
      <div class="head"><span>{{$t('tradecenter.CurrencyData')}}</span></div>
      <div class="main">
        <div class="coin-intro">
          <div class="title">{{currencyInfo.name}}</div>
          <p class="desc" v-html="lang==='zh'?currencyInfo.introduce_en:currencyInfo.introduce_cn"></p>
        </div>
        <table>
          <tbody>
            <tr>
              <td> <span>{{$t('header.PublishTime')}}</span> <span class="release-time">{{currencyInfo.release_time}}</span> </td>
              <td> <span>{{$t('header.PublishPrice')}}</span> <span class="release-price">{{currencyInfo.release_price}}</span> </td>
            </tr>
            <tr>
              <td> <span>{{$t('tradecenter.TotalIssue')}}</span> <span class="release-amount">{{currencyInfo.release_amount}}</span> </td>
              <td> <span>{{$t('tradecenter.TotalCirculation')}}</span> <span class="circulation">{{currencyInfo.circulation_amount}}</span> </td>
            </tr>
            <tr>
              <td> <span>{{$t('tradecenter.Website')}}</span> <span class="official-website"><a :href="currencyInfo.site">{{currencyInfo.site}}</a></span> </td>
              <td> <span>{{$t('tradecenter.WhiteBook')}}</span> <span class="white-paper"><a :href="currencyInfo.white_paper">{{currencyInfo.white_paper}}</a></span> </td>
            </tr>
            <tr>
              <td> <span>{{$t('tradecenter.BlockTheQuery')}}</span> <span class="block-search"><a :href="currencyInfo.block_search">{{currencyInfo.block_search}}</a></span> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {getCurrencyInfo } from '@/api/tradecenter'
export default {
  props:{
    lang:{
      type:String,
      default:'zh'
    },
    hashsymbol:{
      type:String,
      default:'ETHZC'
    },
    baseCurrencyName:{
      type:String,
      default:'ETH'
    }
  },
  data(){
    return{
      currencyInfo:'',
    }
  },
  watch:{
    hashsymbol(){
      this.getCoinInfo()
    },
    baseCurrencyName(){
      this.getCoinInfo()
    }
  },
  methods:{
    getCoinInfo () {
      getCurrencyInfo(this.baseCurrencyName).then((response) => {
        let currencyInfo = response.data
        this.currencyInfo = currencyInfo
      })
    },
  }
}
</script>
