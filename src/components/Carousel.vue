<template>
  <swiper
    :slides-per-view="3"
    :space-between="30"
    :pagination="{ clickable: true }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="(slide, idx) in slides" :key="idx">
      <img :src="slide.img" class="slide-img" />
      <div class="slide-title">{{ slide.title }}</div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

const slides = [
  {
    img: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316445/%E8%8A%B1%E6%B5%B7_yhrp7t.jpg',
    title: '',
  },
  {
    img: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316485/%E7%B5%90%E5%B1%80%E5%A4%A7%E9%81%A0%E6%99%AF_sb6zdo.jpg',
    title: '',
  },
  { img: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316465/04_frudsv.jpg', title: '' },
  { img: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316498/17_nm1sel.jpg', title: '' },
]

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination],
      slides,
    }
  },
}
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 340px;
}
.slide-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
}
.slide-title {
  text-align: center;
  margin-top: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
