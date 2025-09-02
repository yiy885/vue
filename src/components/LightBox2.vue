<template>
  <div class="grid-gallery">
    <el-image
      v-for="(img, index) in imageList"
      :key="index"
      :src="img"
      fit="cover"
      class="thumbnail"
      @click="openLightbox(index)"
    />
  </div>

  <el-dialog
    v-model="dialogVisible"
    fullscreen
    append-to-body
    class="lightbox-dialog"
    :show-close="false"
    @keydown.esc="closeDialog"
  >
    <div class="lightbox-content" @click.stop>
      <img :src="currentImage" class="lightbox-image" />

      <!-- 左右切換箭頭 -->
      <button class="nav-btn left" @click="prevImage">←</button>
      <button class="nav-btn right" @click="nextImage">→</button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const dialogVisible = ref(false)
const currentIndex = ref(0)

// 圖片清單，可替換為你的圖片 URL
const imageList = ref([
  'https://picsum.photos/id/1015/800/600',
  'https://picsum.photos/id/1016/800/600',
  'https://picsum.photos/id/1018/800/600',
  'https://picsum.photos/id/1019/800/600',
  'https://picsum.photos/id/1020/800/600',
  'https://picsum.photos/id/1021/800/600',
  'https://picsum.photos/id/1022/800/600',
  'https://picsum.photos/id/1023/800/600',
  'https://picsum.photos/id/1024/800/600',
])

const currentImage = computed(() => imageList.value[currentIndex.value])

function openLightbox(index) {
  currentIndex.value = index
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + imageList.value.length) % imageList.value.length
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length
}

// 鍵盤支援：左右切換 / Esc 關閉
function handleKeydown(e) {
  if (!dialogVisible.value) return
  if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'ArrowRight') nextImage()
  else if (e.key === 'Escape') closeDialog()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.grid-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s;
}
.thumbnail:hover {
  transform: scale(1.03);
}

/* 燈箱樣式 */
.lightbox-dialog .el-dialog__body {
  padding: 0;
  background-color: rgba(0, 0, 0, 0.9);
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.lightbox-image {
  display: block;
  max-width: 90%;
  max-height: 90%;
  margin: 5% auto;
  object-fit: contain;
}

/* 左右箭頭按鈕 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10;
  user-select: none;
  padding: 0 20px;
}
.nav-btn.left {
  left: 0;
}
.nav-btn.right {
  right: 0;
}
</style>
