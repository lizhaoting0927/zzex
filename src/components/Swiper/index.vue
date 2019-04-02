<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="(item,index) in banners" :key="index">
      <img 
        :src="myLang==='zh'?item.a_img_file:item.a_img_file_en" 
        @click="toDetail(item)"
      >
    </swiper-slide>
    <!-- <div class="swiper-pagination" slot="pagination"></div> -->
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
import { getNewsBanner } from '@/api/home.js'
// import {getLang} from '../../libs/utils.js'
export default {
  name: 'carrousel',
  props:{
    lang: {
      type: String,
      default: 'zh'
    },
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 30,
        slidesPerGroup: 1,
        autoplay: true,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      banners: [],
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    myLang(){
      return this.lang
    }
  },

  created () {

    getNewsBanner().then(res => {
      this.banners = res.data
      // console.log(res)
    })
  },
  methods:{
    toDetail(item){
      if(item.is_jump===0){
        this.$router.push({path:'/newsDetail',query:{id:item.id}})
      }else{
        if(item.jump_url){
          window.location.href=item.jump_url;
        }
      }
    }
  }
}
</script>
<style>
.swiper-container{
  padding-top: 90px !important;
  padding-bottom: 30px  !important;
}
.swiper-button-prev{
  margin-top: 8px !important
}
.swiper-button-next{
  margin-top: 8px !important
}
.swiper-pagination .swiper-pagination-clickable .swiper-pagination-bullets{
  position: relative !important;
  top: 18px !important;
}
</style>
