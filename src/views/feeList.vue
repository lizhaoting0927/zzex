<template>
  <div>
    <my-header></my-header>
    <div id="MainView">
      <div class="container" id="helpCenter">
        <div class="main-panel f-cb">
          <div class="sidebar-nav f-fl">
            <ul>
              <li>{{$t('footer.HelpCenter')}}</li>
              <li>
                <router-link to="/newsList">
                {{$t('footer.AnnouncementOfTheCenter')}}</router-link>
              </li>
              <li>
                <router-link to="/feeList">{{$t('footer.Rate')}}</router-link>
              </li>
            </ul>
          </div>
          <div class="content" id="view">
            <div class="inner-fee-list" id="innerFeeList">
              <div class="header">{{$t('footer.Rate')}}</div>
              <div class="lists-main" id="feeTB" v-html="data.a_content"></div>
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
import { getNews } from '@/api/feeList'
export default {
  components: {
    MyHeader,
    MyFooter
  },
  data () {
    return {
      data: ''
    }
  },
  created () {
    getNews('143').then(res => {
      if (res.state === 1) {
        this.data = res.data
      }
    })
  },
  methods: {}
}
</script>
