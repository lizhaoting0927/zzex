<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="assetsmanager">
        <div class="main-panel f-cb">
          <asset-side-nav></asset-side-nav>
          <div class="content" id="view">
            <div class="inner-get-coin" id="innerGetCoin">
              <div class="header">
                <a href="#/myAssets">{{$t('user.MyAssets')}}</a>
                <i class="iconfont icon-angleright"></i>
                <span>{{$t('user.Withdraw')}}</span>
              </div>
              <div class="getcoin-main">
                <div class="gm-inner">
                  <div class="coin-type input-wrap">
                    <label>{{$t('user.Coin')}}</label>
                    <input type="text" readonly v-model="currency">
                  </div>
                  <div class="coin-addr input-wrap">
                    <label>{{$t('user.WithdrawAddress')}}</label>
                    <select class="type" v-model="form.selectAddress">
                      <option value>{{$t('user.PleaseSelectTheWithdrawalAddress')}}</option>
                      <option
                        :value="item.addr"
                        v-for="(item,index) in data"
                        :key="index"
                      >{{item.addr}}</option>
                    </select>
                  </div>
                  <div class="coin-tips input-wrap" v-if="isInETH===2">
                    <label>{{$t('header.AddressLabel')}}</label>
                    <input
                      type="text"
                      :placeholder="$t('user.PleaseFillInTheAddressLabel')"
                      v-model="form.coinTips"
                      class="coin_tips"
                    >
                    <div class="flex_container">
                      <p>填写错误可能导致资产损失，请仔细核对</p>
                      <el-tooltip
                        effect="dark"
                        :content="$t('header.WithdrawNode')"
                        placement="top"
                      >
                        <div class="iconfont_container">
                          <i class="iconfont icon-info"></i>
                        </div>
                      </el-tooltip>
                    </div>
                    <!-- <span class="tip" >{{$t('header.WithdrawNode')}}</span> -->
                  </div>
                  <div class="coin-num input-wrap">
                    <label>{{$t('user.MentionACurrency')}}</label>
                    <input type="text" :placeholder="$t('header.EnterNumCoins')" v-model="form.num">
                    <button class="all f-fl" @click="selectAll">{{$t('user.All')}}</button>
                    <div class="tip rest cloumn_flex_container">
                      <p>
                        {{$t('header.AvailableAssets')}}
                        <em>{{canUseAssets}}</em>
                      </p>
                      <p>
                        {{$t('header.RemainWithdraw')}}{{withdraw.amount}}/{{withdraw.max_withdraw}}
                        <span
                          v-show="withdraw.limit_withdraw!==0"
                        >{{$t('header.RemainWithdrawTimes')}}{{withdraw.times}}/{{withdraw.limit_withdraw}}</span>
                      </p>
                    </div>
                  </div>
                  <div class="code input-wrap">
                    <label>{{$t('user.ImageVerification')}}</label>
                    <input
                      type="text"
                      :placeholder="$t('user.PleaseVerificationCode')"
                      v-model="form.imgCode"
                    >
                    <img :src="backImgCode" alt class="btn-img f-fl" @click="getKaptcha">
                  </div>
                  <div class="code input-wrap">
                    <label>{{$t('user.verificationCode')}}</label>
                    <input
                      type="text"
                      class="mobile"
                      :placeholder="$t('user.PleaseEnterTheverification')"
                      v-model="form.mobileCode"
                    >
                    <get-code
                      @get-kaptcha="getKaptcha"
                      :tokencode="tokencode"
                      :imgCode="form.imgCode"
                      type="forgot"
                    ></get-code>
                  </div>
                  <div class="tradepwd input-wrap">
                    <label>{{$t('user.TradersPassword')}}</label>
                    <input
                      type="password"
                      :placeholder="$t('header.EnterTransPwd')"
                      v-model="form.password"
                    >
                    <button @click="toAccountSecurity">{{$t('user.ForgetPassword')}}</button>
                  </div>
                  <!-- <button type="button" class="btn-confirm" @click="confirmBtnClick" :disabled="confirmBtnDisable">
                    <span class="text">{{$t('user.ConfirmToMentionMoney')}}</span>
                    <span class="loading" v-show="confirmBtnDisable"></span>
                  </button>-->
                  <el-button
                    class="btn-confirm"
                    @click="confirmBtnClick"
                    :disabled="confirmBtnDisable"
                    :loading="confirmBtnDisable"
                  >
                    <span class="text">{{$t('user.ConfirmToMentionMoney')}}</span>
                  </el-button>
                </div>
              </div>
              <ul class="tips-list" id="tipsList">
                <li
                  v-for="(item,index) in currencyLst"
                  :key="index"
                >{{$t('user.MinimumWithdrawalAmount')}} {{item.c_min_withdraw }} {{currency}}{{$t('user.ASingleChargeIsRequired')}} {{item.withdraw_fee}} {{currency}}</li>
                <li v-show="currency==='GBT'">{{$t('user.GBTTips')}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
import MyHeader from "@/components/Header";
import MyFooter from "@/components/Footer";
import GetCode from "@/components/GetCode";
import AssetSideNav from "@/components/AssetSideNav";
import {
  getWithdrawAddr,
  getKaptcha,
  withdrawCreateI,
  getAssetsLst,
  getwithdrawInfo
} from "@/api/withdraw";
export default {
  components: {
    MyHeader,
    MyFooter,
    AssetSideNav,
    GetCode
  },
  data() {
    return {
      currency: "",
      data: "",
      form: {
        selectAddress: "",
        coinTips: "",
        num: "",
        imgCode: "",
        password: "",
        mobileCode: ""
      },
      backImgCode: "",
      tokencode: "",
      confirmBtnDisable: false,
      currencyLst: "",
      canUseAssets: "",
      canUseAssetsNum: "",
      isInETH: "",
      withdraw: {
        times: 0,
        amount: 0,
        max_withdraw: 0,
        limit_withdraw: 0
      }
    };
  },
  created() {
    let currency = this.$route.params.currency;
    if (!currency) {
      this.$router.push("/myAssets");
    }
    this.currency = currency;
    getWithdrawAddr(this.currency).then(response => {
      if (response.state === 1) {
        let data = response.data;
        this.isInETH = response.is_in_eth;
        this.data = data;
      }
    });

    this.getKaptcha();

    getAssetsLst().then(response => {
      let accountsLst = response.data.accountsLst;
      let accountsLstArr = [];
      let currencyLst = response.data.currencyLst;
      let newCurrencyLst = [];
      currencyLst.forEach(ele => {
        if (ele.currency === this.currency) {
          newCurrencyLst.push(ele);
        }
      });
      this.currencyLst = newCurrencyLst;

      for (let j = 0; j < accountsLst.length; j++) {
        accountsLstArr.push(accountsLst[j].currency);
        if (accountsLst[j].currency === this.currency) {
          this.dataBalance = accountsLst[j].balance;
          this.canUseAssets =
            " " + accountsLst[j].balance + " " + this.currency;
          this.canUseAssetsNum = accountsLst[j].balance;
        }
      }
      let position = accountsLstArr.indexOf(this.currency);
      if (position === -1) {
        this.dataBalance = 0;
        this.canUseAssets = " " + 0 + " " + this.currency;
        this.canUseAssetsNum = 0;
      }
    });
  },
  mounted() {
    getwithdrawInfo(this.currency).then(res => {
      if (res.state === 1) {
        if (res.data) {
          this.withdraw.times = res.data.times;
          this.withdraw.amount = res.data.amount;
          this.withdraw.max_withdraw = res.data.max_withdraw;
          this.withdraw.limit_withdraw = res.data.limit_withdraw;
        }
      }
    });
  },
  methods: {
    selectAll() {
      const remainAmount =
        parseFloat(this.withdraw.max_withdraw) - this.withdraw.amount;
      const all = Math.min(this.canUseAssetsNum, remainAmount);
      if (
        this.withdraw.times === this.withdraw.limit_withdraw &&
        this.withdraw.limit_withdraw !== 0
      ) {
        this.form.num = 0;
      } else {
        this.form.num = all;
      }
    },
    getKaptcha() {
      getKaptcha().then(res => {
        let imgcode = res.check_code_img;
        let tokencode = res.check_code_token;
        this.backImgCode = imgcode;
        this.tokencode = tokencode;
      });
    },
    userLogout() {
      this.loginState = false;
      sessionStorage.setItem("loginState", this.loginState);
      this.$router.push("/login");
    },
    toAccountSecurity() {
      this.$router.push("/accountSecurity");
    },
    confirmBtnClick() {
      if (this.form.num <= 0) {
        this.$message({
          type: "error",
          message: '请输入正确的数量',
          duration: 3000,
          showClose: true
        });
        return;
      }
      if (this.confirmBtnDisable) {
        return;
      }
      this.confirmBtnDisable = true;
      let data = {
        currency: this.currency,
        addr:
          this.isInETH === 2
            ? this.form.selectAddress + "▲" + this.form.coinTips
            : this.form.selectAddress,
        amount: this.form.num,
        sms_code: this.form.mobileCode,
        m_security_pwd: this.form.password
      };

      withdrawCreateI(data).then(response => {
        this.confirmBtnDisable = false;
        if (response.state === 1) {
          this.$message({
            type: "success",
            message: this.$t("header.SubmitSuccess"),
            duration: 3000,
            showClose: true
          });
          this.$router.push("/assetsRecord");
          this.getwithdrawInfo();
        } else if (response.state === -1) {
          this.getKaptcha();
        }
      });
    }
  }
};
</script>
<style scoped>
.iconfont_container {
  display: flex;
  align-items: center;
  height: 40px;
  width: 16px;
}
.coin_tips {
  width: 120px !important;
}
.flex_container {
  display: flex;
  align-items: center;
}
.flex_container p {
  color: #ba4f4f;
  margin-right: 5px;
}
.cloumn_flex_container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 40px;
  padding-left: 10px;
}
</style>

<style>
.gm-inner .el-button {
  padding-top: 0px;
}
</style>
