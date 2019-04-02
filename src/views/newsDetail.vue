<template>
  <div>
    <my-header @lang-change="langChange"></my-header>
    <div id="MainView">
      <div class="container" id="helpCenter">
        <div class="main-panel f-cb">
          <div class="sidebar-nav f-fl">
            <ul>
              <li>{{$t('footer.HelpCenter')}}</li>
              <li>
                <a href="#/newsList"> {{$t('footer.AnnouncementOfTheCenter')}}</a>
              </li>
              <li>
                <a href="#/feeList">{{$t('footer.Rate')}}</a>
              </li>
            </ul>
          </div>
          <div class="content" id="view">
            <div class="inner-news-detail" id="innerNewsDetail">
              <div class="header">
                <a href="#/newsList">{{$t('news.Notice')}}</a>
                <i class="iconfont icon-angleright"></i>
                <span>{{$t('news.Details')}}</span>
              </div>
              <div class="detail-main" id="Detail">
                <div class="title">{{lang==='zh'?news.a_title:news.a_title_en}}</div>
                <div class="sub-title">
                  <span>{{news.a_time}}</span>
                  <span>{{news.a_author}}</span>
                  <span>{{news.a_source}}</span>
                </div>
                <p v-html="lang==='zh'?news.a_content:news.a_content_en"></p>
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
import { getNews } from '@/api/newsDetail'
import {getLang} from '../libs/utils.js'

export default {
  components: {
    MyHeader,
    MyFooter
  },
  data () {
    return {
      id: '',
      news: '',
      lang:'zh'
    }
  },
  mounted () {
    let lang = getLang()
    if(lang){
      this.lang = lang
    }
    this.id = this.$route.query.id
    getNews(this.id).then(res => {
      this.news = res.data
    })
  },
  methods: {
    langChange(lang){
      this.lang=lang
    }
  }
}
</script>
