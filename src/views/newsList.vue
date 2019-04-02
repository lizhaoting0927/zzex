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
                <router-link to="/newsList">{{$t('footer.AnnouncementOfTheCenter')}}</router-link>
              </li>
              <li>
                <router-link to="/feeList">{{$t('footer.Rate')}}</router-link>
              </li>
            </ul>
          </div>
          <div class="content" id="view">
            <div class="inner-news-list" id="innerNewsList">
              <div class="header">{{$t('news.Notice')}}</div>
              <div class="lists-main" id="Lists">
                <div class="list f-cb" v-for="(item,index) in lists" :key="index" @click="toDetail(item)">
                  <span class="f-fl">{{lang==='zh'?item.a_title:item.a_title_en}}</span>
                  <span class="f-fr">{{item.a_time}}</span>
                </div>
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
import { getNewsList } from '@/api/newsList'
import {getLang} from '../libs/utils.js'
export default {
  components: {
    MyHeader,
    MyFooter
  },
  data () {
    return {
      lists: '',
      lang:'zh'
    }
  },
  created () {
    let lang = getLang()
    if(lang) {
      this.lang =lang
    }
    getNewsList(304, 1, 15).then(res => {
      if (res.state === 1) {
        this.lists = res.data.list
      }
    })
  },
  methods: {
    toDetail (item) {
      this.$router.push({ name: 'NewsDetail', query: { id: item.id } })
    },
    langChange(lang){
      this.lang=lang
    }
  }
}
</script>
