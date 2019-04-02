<template>
  <div
    class="chart-header"
    id="chartHeader"
  >
    <dl class="f-cb">
      <dd><span class="dspName">{{ticker.dspName}}</span></dd>
      <dd><span class="desc">{{ticker.close.toFixed(currentPricePrecision)}}</span></dd>
      <dd><span class="cny-bar uppercase">{{'≈ ' + convertCNY.toFixed(2) + ' cny'}}</span></dd>
      <dd>
        <span class="rate-pre">{{$t('home.TopGainers')}}</span>
        <span
          class="rate"
          :class="headerRiseFallPercent>0?'raise':'fall'"
        >
          {{headerRiseFallPercent|isNaNFilter}}%
        </span>
      </dd>
      <dd>
        <span class="high">
          {{$t('tradecenter.High')}} {{ticker.high.toFixed(currentPricePrecision)}}
        </span>
      </dd>
      <dd>
        <span class="low">
          {{$t('tradecenter.Low')}} {{ticker.low.toFixed(currentPricePrecision)}}
        </span>
      </dd>
      <dd>
        <span class="amount uppercase">
            {{$t('tradecenter.Quantity')}} {{ticker.volume.toFixed(currentVolumePrecision)+' '+ticker.baseCurrencyName}}
        </span>
      </dd>
      <dd class="ticker-logo"><img src="https://bigen.oss-cn-shanghai.aliyuncs.com/images/ticker-logo.png"></dd>
    </dl>
  </div>
</template>
<script>
export default {
  props: ["ticker", "currentPricePrecision", "convertCNY","currentVolumePrecision"],
  data() {
    return {};
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
  computed: {
    headerRiseFallPercent() {

      let open = this.ticker.open.toFixed(this.currentPricePrecision);
      let close = this.ticker.close.toFixed(this.currentPricePrecision);
      let sign;
      if (open - close < 0) {
        sign = "+";
      } else {
        sign = "";
      }
      return sign + (((close - open) * 100) / open).toFixed(2);

    }
  },
  methods: {}
};
</script>
