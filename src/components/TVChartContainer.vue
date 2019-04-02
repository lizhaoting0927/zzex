<template>
  <div
    class="TVChartContainer  chart-main"
    id="tv_chart_container"
    
  />
</template>

<script>
import { widget } from "../charting_library.min";
import request from "@/libs/axios";
import {getChartData, send} from '@/api/chart.js'
import{baseUrl} from '../../public/config.js'

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default {
  name: "TVChartContainer",
  data(){
    return{
      loop:''
    }
  },
  beforeDestroy(){
    window.clearInterval(this.loop);
  },
  props: {
    symbol: {
      default: 'ethzc',
      type: String,
    },
    interval: {
      default: 'D',
      type: String,
    },
    containerId: {
      default: 'tv_chart_container',
      type: String,
    },
    datafeedUrl: {
      default: baseUrl,
      // default: '',
      // default: 'http://47.95.199.42:8080',
      type: String,
    },
    libraryPath: {
      default: '/charting_library/',
      type: String,
    },
    chartsStorageUrl: {
      default: 'https://saveload.tradingview.com',
      type: String,
    },
    chartsStorageApiVersion: {
      default: '1.1',
      type: String,
    },
    clientId: {
      default: 'tradingview.com',
      type: String,
    },
    userId: {
      default: 'public_user_id',
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    }
  },
  mounted() {
    this.TVChartInit()
  },
  watch:{
    symbol(){
      this.TVChartInit()
    }
  },
  methods:{
    TVChartInit(){
    var mythat=this
    var Datafeeds = {};
    var staticResolutioin = 15;
    Datafeeds.WebsockFeed = function() {
      // var ROOT_URL = document.location.protocol + "//" + document.domain;
      // var port = window.location.port;
      // if (port != 80 && port != 443) {
      //   ROOT_URL += ":" + port;
      // }
      
      // this._datafeedURL = ROOT_URL;
      this._datafeedURL = mythat.datafeedUrl;
      // this._datafeedURL = "http://47.91.208.111:8080";
    };

    Datafeeds.WebsockFeed.prototype.onReady = function(callback) {
      var config = {};
      config.exchanges = [];
      config.supported_resolutions = ["1","5","15","30","60","240","1D","1W","1M"];
      config.supports_group_request = false;
      config.supports_marks = false;
      config.supports_search = false;
      config.supports_time = true;
      config.supports_timescale_marks = false;

      setTimeout(function() {
        callback(config);
      }, 0);
    };

    Datafeeds.WebsockFeed.prototype.resolveSymbol = function(symbolName,onSymbolResolvedCallback,onResolveErrorCallback) {
      // symbolName =location.hash.split("?")[0].substr(1) === "/tradecenter"
      //     ? location.hash.split("=")[1]
      //     : "ethzc";
      // if (symbolName == undefined || symbolName == "") {
      //   symbolName = "ethzc";
      // } else {
      //   symbolName = symbolName.toLowerCase();
      // }    
      symbolName=mythat.symbol

      let data = {
        symbol: symbolName,
        has_daily: true,
        ticker: symbolName,
        name: symbolName,
        description: symbolName,
        type: "bitcoin",
        exchange: "zzex.pro",
        listed_exchange: "zzex.pro",
        timezone: "Asia/Shanghai",
        has_weekly_and_monthly: true,
        has_intraday: true,
        session: "24x7",
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        intraday_multipliers: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        has_fractional_volume: false,
        full_name: "",
        has_empty_bars: false,
        "exchange-traded": symbolName,
        minmove2: 0,
        minmov: 1,
        pricescale: 10000,
        data_status: "streaming",
        force_session_rebuild: false,
        has_no_volume: false
      };
      // 实时获取价格精度
      getChartData(this._datafeedURL).then(res=>{
        if (res.state == 1) {
          var ticker = res.data[symbolName + "_ticker"];
          data.pricescale = Math.pow(10, ticker.pricePrecision);
        }
        if (symbolName.match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
          data.pricescale = 100;
        }
        setTimeout(function() {
          onSymbolResolvedCallback(data);
        }, 0);
      })
    };

    Datafeeds.WebsockFeed.prototype._send = function(url, params) {
      
      let requesturl = url + params.symbol + "/" + params.type + "/" + params.size;
      return send(requesturl)
    };
    // 时间周期格式转换
    var getResolutionFormat = function(resolution) {
      let reg = /^[0-9]*$/;
      if (reg.test(resolution)) {
        resolution = resolution + "min";
      } else if (resolution.includes("D")) {
        resolution = "1day";
      } else if (resolution.includes("W")) {
        resolution = "1week";
      } else if (resolution.includes("M")) {
        resolution = "1mon";
      }
      return resolution;
    };

    Datafeeds.WebsockFeed.prototype.getBars = function(
      symbolInfo,
      resolution,
      from,
      to,
      onHistoryCallback,
      onErrorCallback,
      firstDataRequest
    ) {
      
      if (from > 0 && (from + "").length > 10) {
        throw ["Got a JS time instead of Unix one.", from, to];
      }

      resolution = getResolutionFormat(resolution);

      // 根据时间周期来加载
      if (firstDataRequest) {
        this._send(this._datafeedURL + "/m/kline/", {
          symbol: symbolInfo.name,
          type: resolution,
          size: "1000"
        })
          .then(function(res) {
            var data = res.data.lines;
            var lastData =[]
            data.forEach(ele => {
              if(ele[5]!==0){
                lastData.push(ele)
              }
            });
            if (lastData.length > 1) {
              var bars = lastData.map(el => {
                return {
                  time: el[0],
                  close: el[1],
                  high: el[2],
                  low: el[3],
                  open: el[4],
                  volume: el[5]
                };
              });

              
              bars.reverse();
            }
            
            onHistoryCallback(bars, {
              noData: false
            });
          })
          .catch(function(reason) {
            onErrorCallback(reason);
          });
      } else {
        onHistoryCallback([], {
          noData: true
        });
      }
    };

    // 订阅K线数据
    Datafeeds.WebsockFeed.prototype.subscribeBars = function(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      listenerGUID,
      onResetCacheNeededCallback
    ) {
      
      let that = this;
      var hash = location.hash.split("?")[0].substr(1) === "/tradecenter";
      if (hash) {
        subscribeK();
         mythat.loop = setInterval(function() {
          subscribeK();
        }, 3000);
        
      }

      function subscribeK() {
        
        resolution = getResolutionFormat(staticResolutioin);
        request({
          url:
            that._datafeedURL +
            "/m/kline/" +
            symbolInfo.symbol +
            "/" +
            resolution +
            "/1",
          method: "get"
        }).then(res => {
          var data = res.data.lines;
          if (data.length > 0 && data[0][5]!==0) {
            var bars = data.map(el => {
              return {
                time: el[0],
                close: el[1],
                high: el[2],
                low: el[3],
                open: el[4],
                volume: el[5]
              };
            });

            // 服务器返回的数据塞进去
            onRealtimeCallback(bars[0]);
          }
        });
      }
    };

    const widgetOptions = {
      fullscreen: false,
      symbol: this.symbol,
      interval: 15,
      width: "100%",
      height: "480px",
      container_id: "tv_chart_container",
      timezone: "Asia/Shanghai",
      loading_screen: {
        backgroundColor: "rgb(24, 27, 42)"
      },
      datafeed: new Datafeeds.WebsockFeed(),
      locale: getParameterByName("lang") || "zh",
      library_path: "/charting_library/",
      hideSyMBOLsEARCH: true,
      drawings_access: {
        type: "black",
        tools: [
          {
            name: "Regression Trend"
          }
        ]
      },
      disabled_features: [
        "header_symbol_search",
        "header_symbol_search",
        "header_widget_dom_node",
        "source_selection_markers",
        "header_indicators",
        "adaptive_logo",
        "constraint_dialogs_movement",
        "display_market_status",
        "header_chart_type",
        "header_compare",
        "header_undo_redo",
        "header_screenshot",
        "volume_force_overlay",
        "symbol_search_hot_key",
        "property_pages",
        "header_saveload",
        "timeframes_toolbar",
        "symbol_info",
        "border_around_the_chart",
        "main_series_scale_menu",
        "star_some_intervals_by_default",
        "datasource_copypaste",
        "right_bar_stays_on_scroll",
        "context_menus",
        "go_to_date",
        "header_resolutions"
      ],
      enabled_features: ["study_templates", "hide_left_toolbar_by_default"],
      time_frames: [
        {
          text: "1min",
          resolution: "1",
          description: "1分钟"
        }
      ],
      charts_storage_url: "http://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      // custom_css_url: "/charting_library/static/css/cust.css",
      custom_css_url: "../../charting_library/static/css/cust.css",
      client_id: "tradingview.com",
      theme: "Dark",
      user_id: "public_user_id",
      overrides: {
        "mainSeriesProperties.style": 8,
        "paneProperties.background": "#1f2431", // 背景色
        "mainSeriesProperties.candleStyle.upColor": "#64ae74",
        "mainSeriesProperties.candleStyle.downColor": "#df5f61",
        // 烛心
        "mainSeriesProperties.candleStyle.drawWick": true,
        // 烛心颜色
        "mainSeriesProperties.candleStyle.wickUpColor": "#64ae74",
        "mainSeriesProperties.candleStyle.wickDownColor": "#df5f61",
        // 边框
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor": "#64ae74",
        "mainSeriesProperties.candleStyle.borderDownColor": "#df5f61",
        // 网格
        "paneProperties.vertGridProperties.style": 0,
        "paneProperties.horzGridProperties.color": "#2E313A", // 横行线
        "paneProperties.vertGridProperties.color": "#2E313A", // 竖行线
        // 坐标轴和刻度标签颜色
        // 区域+字坐标颜色
        "scalesProperties.lineColor": "#8a8a8a",
        "scalesProperties.textColor": "#8a8a8a",
        // shezhizuigaok线柱距离top-border的高度
        "paneProperties.topMargin": 20,
        "paneProperties.bottomMargin": 5,
        "timeScale.barSpacing": 50,
        // 收起左上角标题
        "paneProperties.legendProperties.showLegend": false,
        "symbolWatermarkProperties.transparency": 90
      },
      toolbar_bg: "#181B2A"
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.chart().createStudy("Moving Average", true, true, [5], null, {
        "plot.color": "#b7248a"
      });
      tvWidget.chart().createStudy("Moving Average", true, true, [10], null, {
        "plot.color": "#84aad5"
      });
      tvWidget.chart().createStudy("Moving Average", true, true, [15], null, {
        "plot.color": "#55b263"
      });
      tvWidget.chart().createStudy("Moving Average", true, true, [20], null, {
        "plot.color": "#965fc4"
      });
      
      // 创建按钮
      tvWidget.createButton()
        .attr("title", "1min")
        .text("1min")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = 1;
          tvWidget.chart().setResolution("1", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "5min")
        .text("5min")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = 5;
          tvWidget.chart().setResolution("5", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "15min")
        .text("15min")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = 15;
          tvWidget.chart().setResolution("15", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "30min")
        .text("30min")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = 30;
          tvWidget.chart().setResolution("30", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "1hour")
        .text("1hour")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = 60;
          tvWidget.chart().setResolution("60", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "1day")
        .text("1day")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = "D";
          tvWidget.chart().setResolution("D", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "1week")
        .text("1week")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = "W";
          tvWidget.chart().setResolution("W", function onReadyCallback() {});
        });
      tvWidget
        .createButton()
        .attr("title", "1mon")
        .text("1mon")
        .on("click", function() {
          // $(this)
          //   .parents(".left")
          //   .children()
          //   .find(".button")
          //   .removeAttr("style");
          staticResolutioin = "M";
          tvWidget.chart().setResolution("M", function onReadyCallback() {});
        });
    });
    }
  }

};
</script>
