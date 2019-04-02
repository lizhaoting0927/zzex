<template>
  <div>
    <my-header @lang-change="langChange"></my-header>
    <div id="MainView">
      <div class="container" id="customerService">
          <div class="main-panel f-cb">
              <div class="sidebar-nav f-fl">
                  <ul>
                      <li>{{$t('footer.CustomerService')}}</li>
                      <li>
                          <a href="#/userAgreement">{{$t('footer.UserAgreement')}}</a>
                      </li>
                      <!-- <li>
                          <a href="#/feeList">上币申请</a>
                      </li> -->
                      <li>
                          <a href="https://github.com/ZZEXPRO/ZZEX-API-Docs" target="_blank">{{$t('footer.APISupports')}}</a>
                      </li>
                  </ul>
              </div>
              <div class="content" id="view">
                  <div class="inner-user-agreement" id="innerUserAgreement">
                      <div class="header">{{$t('footer.UserAgreement')}}</div>
                      <div class="lists-main" id="userAgreementTB">
                          <p v-html="lang==='zh'?data.a_content:data.a_content_en"></p>
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
import { getNews } from '@/api/userAgreement'
import {getLang} from '../libs/utils.js'
export default {
  components: {
    MyHeader,
    MyFooter
  },
  data () {
    return {
      data: '',
      lang:'zh'
    }
  },
  created () {
    let lang =getLang()
    if(lang) {
      this.lang=lang
    }
    getNews('151').then((response) => {
      if (response.state === 1) {
        let data = response.data
        this.data=data
      }
    })
  },
  methods: {
    langChange(lang){
      this.lang=lang
    }
  }
}
</script>
