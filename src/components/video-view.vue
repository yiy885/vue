<template>
  <div class="media-carousel">
    <video
      v-if="media[currentIndex].type === 'video'"
      :src="media[currentIndex].src"
      controls
      autoplay
      muted
      loop
      class="carousel-media"
    ></video>
    <img
      v-else
      :src="media[currentIndex].src"
      alt="Carousel Image"
      class="carousel-media"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
const createSnackbar = (text, type = 'success') => ElMessage({ message: text, type })

const media = [
  { type: 'video', src: '/video/0Jc_001_1080p.mp4' },
  { type: 'video', src: '/video/Cerememory__1m30s.mp4' },
]

const currentIndex = ref(0)
let intervalId = null

onMounted(() => {
  // 僅當媒體陣列有多於一項時啟動輪播
  if (media.length > 1) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % media.length
    }, 20000) // 每 5 秒切換
  }
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.media-carousel {
  width: 100%;
  /* height: 600px; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  position: relative;
  overflow: hidden;
  object-fit: cover;
}

/* 黑色透明遮罩 */
.media-carousel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.carousel-media {
  width: 100%;
  height: 100%;
  /*
    object-fit: cover; 會填滿整個容器，可能會裁切掉部分影片/圖片邊緣。
    object-fit: contain; 會完整顯示影片/圖片，但可能會在容器中留下黑邊。
    您可以根據需求選擇其中一個。'cover' 通常在當作背景時效果較好。
  */
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
.carousel-media.fade {
  opacity: 1;
}
</style>
