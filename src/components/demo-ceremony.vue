<template>
  <el-container class="page-container">
    <el-main class="main-content">

      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(img, index) in images" :key="index">
      <img :src="img" alt="carousel image" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>

      <p style="color: aliceblue;">分鏡腳本Storyboard</p>
      <Carousel />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

// 輸入你的圖片路徑
const images = ref([
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316778/1-1_final_yc01yn.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316781/1-3_final_oweeeg.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316775/5-11_final_ncbjzl.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316777/6-5_1_final_ba94l3.jpg'
])
</script>

<style scoped>

.carousel-image {
  width: 100%;
  height: 400px; /* 可依需求調整高度 */
  object-fit: cover; /* 保持比例填滿容器 */
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
