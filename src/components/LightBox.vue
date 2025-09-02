<template>
  <div class="image-gallery">
    <!-- 圖片網格 -->
    <div class="grid-gallery">
      <el-image
        v-for="(img, index) in imageList"
        :key="img.id || index"
        :src="img.url || img"
        :alt="`圖片 ${index + 1}`"
        fit="cover"
        class="thumbnail"
        :class="{ 'thumbnail-loading': loading }"
        :preview-disabled="true"
        lazy
        @click="openLightbox(index)"
        @load="onImageLoad"
        @error="onImageError"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>載入失敗</span>
          </div>
        </template>
      </el-image>
    </div>

    <!-- 載入提示 -->
    <div v-if="loading" class="loading-overlay">
      <el-loading-service />
    </div>

    <!-- 燈箱對話框 -->
    <el-dialog
      v-model="dialogVisible"
      fullscreen
      append-to-body
      class="lightbox-dialog"
      :show-close="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="closeDialog"
    >
      <div class="lightbox-content" @click.self="closeDialog">
        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="closeDialog" aria-label="關閉">
          <el-icon><Close /></el-icon>
        </button>

        <!-- 圖片計數器 -->
        <div class="image-counter">{{ currentIndex + 1 }} / {{ imageList.length }}</div>

        <!-- 主圖片容器 -->
        <div class="image-container">
          <el-image
            :src="currentImageUrl"
            :alt="`圖片 ${currentIndex + 1}`"
            class="lightbox-image"
            fit="contain"
            :preview-disabled="true"
            @load="onLightboxImageLoad"
            @error="onLightboxImageError"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon class="loading-icon"><Loading /></el-icon>
              </div>
            </template>
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <span>圖片載入失敗</span>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 導航按鈕 -->
        <button
          v-if="imageList.length > 1"
          class="nav-btn left"
          @click="prevImage"
          :disabled="isNavigating"
          aria-label="上一張"
        >
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button
          v-if="imageList.length > 1"
          class="nav-btn right"
          @click="nextImage"
          :disabled="isNavigating"
          aria-label="下一張"
        >
          <el-icon><ArrowRight /></el-icon>
        </button>

        <!-- 縮略圖導航 -->
        <div v-if="imageList.length > 1" class="thumbnail-nav">
          <div class="thumbnail-track" :style="thumbnailTrackStyle">
            <div
              v-for="(img, index) in imageList"
              :key="img.id || index"
              class="mini-thumbnail"
              :class="{ active: index === currentIndex }"
              @click="goToImage(index)"
            >
              <el-image :src="img.url || img" fit="cover" :preview-disabled="true" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Loading, Close, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// Props 定義
const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Number,
    default: 3,
  },
  gap: {
    type: Number,
    default: 12,
  },
})

// Emits 定義
const emit = defineEmits(['imageClick', 'lightboxOpen', 'lightboxClose'])

// 響應式數據
const dialogVisible = ref(false)
const currentIndex = ref(0)
const loading = ref(false)
const isNavigating = ref(false)
const loadedImages = ref(new Set())

// 圖片清單處理
const imageList = computed(() => {
  if (props.images.length > 0) {
    return props.images
  }
  // 默認示例圖片
  return [
    {
      id: 1,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316778/1-1_final_yc01yn.jpg',
    },
    {
      id: 2,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316781/1-3_final_oweeeg.jpg',
    },
    {
      id: 3,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316777/8-2_final_uaemwa.jpg',
    },
    {
      id: 4,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316774/5-1_3_final_nyxa7s.jpg',
    },
    {
      id: 5,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316776/5-10_final_hm1b1h.jpg',
    },
    {
      id: 6,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316775/5-11_final_ncbjzl.jpg',
    },
    {
      id: 7,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316777/6-5_1_final_ba94l3.jpg',
    },
    {
      id: 8,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756698198/8-4_final_dygyfv.jpg',
    },
    {
      id: 9,
      url: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1756698111/8-3_1_final_ejpuly.jpg',
    },
  ]
})

// 當前圖片URL
const currentImageUrl = computed(() => {
  const current = imageList.value[currentIndex.value]
  return current?.url || current
})

// 網格樣式
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  gap: `${props.gap}px`,
}))

// 縮略圖導航軌道樣式
const thumbnailTrackStyle = computed(() => {
  const offset = Math.max(0, currentIndex.value - 2) * 60
  return {
    transform: `translateX(-${offset}px)`,
  }
})

// 功能函數
function openLightbox(index) {
  if (index < 0 || index >= imageList.value.length) return

  currentIndex.value = index
  dialogVisible.value = true
  emit('lightboxOpen', { index, image: imageList.value[index] })

  // 預加載相鄰圖片
  preloadAdjacentImages()
}

function closeDialog() {
  dialogVisible.value = false
  emit('lightboxClose', currentIndex.value)
}

function prevImage() {
  if (isNavigating.value || imageList.value.length <= 1) return

  isNavigating.value = true
  currentIndex.value = (currentIndex.value - 1 + imageList.value.length) % imageList.value.length

  setTimeout(() => {
    isNavigating.value = false
  }, 150)

  preloadAdjacentImages()
}

function nextImage() {
  if (isNavigating.value || imageList.value.length <= 1) return

  isNavigating.value = true
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length

  setTimeout(() => {
    isNavigating.value = false
  }, 150)

  preloadAdjacentImages()
}

function goToImage(index) {
  if (index === currentIndex.value || isNavigating.value) return

  currentIndex.value = index
  preloadAdjacentImages()
}

// 圖片預加載
function preloadAdjacentImages() {
  const preloadIndexes = [
    (currentIndex.value - 1 + imageList.value.length) % imageList.value.length,
    (currentIndex.value + 1) % imageList.value.length,
  ]

  preloadIndexes.forEach((index) => {
    const img = imageList.value[index]
    const url = img?.url || img
    if (url && !loadedImages.value.has(url)) {
      const image = new Image()
      image.onload = () => loadedImages.value.add(url)
      image.src = url
    }
  })
}

// 事件處理
function onImageLoad(e) {
  const url = e.target.src
  loadedImages.value.add(url)
}

function onImageError(e) {
  console.warn('圖片載入失敗:', e.target.src)
  ElMessage.warning('圖片載入失敗')
}

function onLightboxImageLoad() {
  // 燈箱圖片載入完成
}

function onLightboxImageError() {
  ElMessage.error('無法載入圖片')
}

// 鍵盤事件處理（優化）
function handleKeydown(e) {
  if (!dialogVisible.value) return

  // 防止在輸入框中觸發
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prevImage()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextImage()
      break
    case 'Escape':
      e.preventDefault()
      closeDialog()
      break
    case ' ': // 空格鍵切換下一張
      e.preventDefault()
      nextImage()
      break
  }
}

// 觸控支援
let startX = 0
function handleTouchStart(e) {
  startX = e.touches[0].clientX
}

function handleTouchEnd(e) {
  if (!dialogVisible.value) return

  const endX = e.changedTouches[0].clientX
  const diff = startX - endX

  if (Math.abs(diff) > 50) {
    // 最小滑動距離
    if (diff > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
})

// 監聽對話框狀態變化
watch(dialogVisible, async (newVal) => {
  if (newVal) {
    // 燈箱開啟時禁止頁面滾動
    document.body.style.overflow = 'hidden'
    await nextTick()
    preloadAdjacentImages()
  } else {
    // 燈箱關閉時恢復頁面滾動
    document.body.style.overflow = ''
  }
})

// 暴露方法給父組件
defineExpose({
  openLightbox,
  closeDialog,
  prevImage,
  nextImage,
  currentIndex: readonly(currentIndex),
  dialogVisible: readonly(dialogVisible),
})
</script>

<style scoped>
.image-gallery {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid-gallery {
  display: grid;
  grid-template-columns: v-bind('gridStyle.gridTemplateColumns');
  gap: v-bind('gridStyle.gap');
  margin-bottom: 20px;
}

/* 響應式網格 */
@media (max-width: 768px) {
  .grid-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .grid-gallery {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}

.thumbnail {
  width: 100%;
  height: 200px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.thumbnail:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.thumbnail-loading {
  opacity: 0.7;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
}

.image-error .el-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

/* 燈箱樣式 */
:deep(.lightbox-dialog) {
  .el-dialog__body {
    padding: 0;
    background-color: rgba(0, 0, 0, 0.95);
    height: 100vh;
    overflow: hidden;
  }
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.image-counter {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 15;
  backdrop-filter: blur(10px);
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: white;
}

.loading-icon {
  font-size: 2rem;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 導航按鈕 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.nav-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn.left {
  left: 20px;
}

.nav-btn.right {
  right: 20px;
}

.nav-btn .el-icon {
  font-size: 1.5rem;
}

/* 縮略圖導航 */
.thumbnail-nav {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 400px;
  height: 60px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  padding: 5px;
}

.thumbnail-track {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  gap: 5px;
  align-items: center;
}

.mini-thumbnail {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.mini-thumbnail.active {
  border-color: var(--el-color-primary);
  transform: scale(1.1);
}

.mini-thumbnail:hover {
  transform: scale(1.05);
}

.mini-thumbnail .el-image {
  width: 100%;
  height: 100%;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .image-container {
    padding: 40px 20px;
  }

  .nav-btn {
    width: 48px;
    height: 48px;
  }

  .nav-btn.left {
    left: 10px;
  }

  .nav-btn.right {
    right: 10px;
  }

  .close-btn {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
  }

  .image-counter {
    top: 10px;
    left: 10px;
    font-size: 12px;
    padding: 6px 12px;
  }

  .thumbnail-nav {
    bottom: 10px;
    height: 50px;
  }

  .mini-thumbnail {
    width: 40px;
    height: 40px;
  }
}

/* 暗色主題適配 */
.dark .thumbnail {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .thumbnail:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

/* 無障礙優化 */
.thumbnail:focus,
.nav-btn:focus,
.close-btn:focus {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

/* 動畫優化 */
.lightbox-image {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 打印樣式 */
@media print {
  .grid-gallery {
    display: block;
  }

  .thumbnail {
    display: block;
    margin-bottom: 20px;
    page-break-inside: avoid;
  }

  .lightbox-dialog {
    display: none;
  }
}
</style>
