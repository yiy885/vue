<template>
  <div>
    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">載入模板中...</div>
    </div>

    <!-- Three.js 畫布容器 -->
    <div ref="container" class="dynamic-grid-canvas"></div>

    <!-- 模板詳情彈窗 -->
    <div v-if="selectedTemplate" class="template-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>

        <!-- 預覽圖片 -->
        <div class="preview-image-container">
          <img :src="selectedTemplate.previewImage" :alt="selectedTemplate.name" />
          <div class="category-badge" :style="{ backgroundColor: getCategoryColor(selectedTemplate.category) }">
            {{ selectedTemplate.category }}
          </div>
        </div>

        <!-- 模板資訊 -->
        <div class="template-info">
          <h3>{{ selectedTemplate.name }}</h3>
          <p class="description">{{ selectedTemplate.description }}</p>

          <div class="template-meta">
            <div class="meta-row">
              <span class="label">分類：</span>
              <span class="value">{{ selectedTemplate.category }}</span>
            </div>
            <div class="meta-row">
              <span class="label">創建時間：</span>
              <span class="value">{{ formatDate(selectedTemplate.createdAt) }}</span>
            </div>
            <div class="meta-row" v-if="selectedTemplate.updatedAt !== selectedTemplate.createdAt">
              <span class="label">更新時間：</span>
              <span class="value">{{ formatDate(selectedTemplate.updatedAt) }}</span>
            </div>
            <div class="meta-row">
              <span class="label">模板 ID：</span>
              <span class="value template-id">{{ selectedTemplate._id }}</span>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="modal-actions">
            <button @click="useTemplate" class="use-btn">
              <span>🚀</span>
              使用模板
            </button>
            <button @click="previewTemplate" class="preview-btn">
              <span>👁️</span>
              預覽模板
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useRouter } from 'vue-router'
import axios from 'axios';

const container = ref(null)
const router = useRouter()

// 狀態管理
const templates = ref([])
const loading = ref(true)
const selectedTemplate = ref(null)

// Three.js 相關變數
let renderer, scene, camera, group, animationId, raycaster, mouse
let templatePlanes = [] // 存儲所有模板平面物件
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

// 初始化 Raycaster
raycaster = new THREE.Raycaster()
mouse = new THREE.Vector2()

// 引入 API 服務 (您需要確保這個路徑正確)
// import templateAPI from '@/services/templateAPI'

// API 調用：獲取模板資料
const fetchTemplates = async () => {
  try {
    loading.value = true

    // 使用您的 API 服務
    // 如果您有 templateAPI，請取消註釋下面這行並註釋掉 fetch 版本
    // const response = await templateAPI.getAll()

    // 或者使用原生 fetch (確保路徑與您的後端一致)
    const response = await fetch('/api/templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要認證，添加 Authorization header
        // 'Authorization': `Bearer ${token}`
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 根據您的後端回應結構處理數據
    // 如果後端直接返回模板陣列
    if (Array.isArray(data)) {
      templates.value = data
    }
    // 如果後端返回包含 templates 屬性的物件
    else if (data.templates && Array.isArray(data.templates)) {
      templates.value = data.templates
    }
    // 如果後端返回包含 data 屬性的物件
    else if (data.data && Array.isArray(data.data)) {
      templates.value = data.data
    } else {
      throw new Error('後端返回的數據格式不正確')
    }

    console.log('✅ 成功獲取模板數據:', templates.value.length, '個')
    console.log('模板數據結構:', templates.value[0]) // 查看第一個模板的結構

    // 驗證必要字段
    const validTemplates = templates.value.filter(template => {
      const isValid = template._id && template.name && template.previewImage
      if (!isValid) {
        console.warn('⚠️ 發現無效模板數據:', template)
      }
      return isValid
    })

    templates.value = validTemplates
    console.log(`✅ 有效模板數量: ${validTemplates.length}`)

    // 數據載入完成後，在 Three.js 場景中創建模板預覽
    if (validTemplates.length > 0) {
      createTemplatePreviewsInGrid()
    } else {
      console.warn('⚠️ 沒有有效的模板數據，載入示例數據')
      loadMockData()
    }

  } catch (error) {
    console.error('❌ 獲取模板失敗:', error)
    console.error('錯誤詳情:', error.message)

    // 如果 API 失敗，使用模擬數據作為備用
    console.log('🔄 載入示例數據作為備用')
    loadMockData()
  } finally {
    loading.value = false
  }
}

// 備用模擬數據 (符合您的資料庫結構)
const loadMockData = () => {
  templates.value = [

    {
      _id: '675123456789012345678902',
      name: '創意海報設計',
      description: '色彩豐富的創意海報模板，適合活動宣傳和產品推廣使用，包含多種配色方案和版面設計。',
      createdBy: '675123456789012345678802',
      category: '靜態影像類型',
      customItems: null,
      previewImage: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1755653139/yiyi01-cloud/vuzb9w2vk5xgz4enfgwj.png',
      createdAt: '2024-08-14T14:22:00.000Z',
      updatedAt: '2024-08-14T14:22:00.000Z'
    },
    {
      _id: '675123456789012345678903',
      name: '品牌識別系統',
      description: '完整的品牌識別設計系統，包含標誌、名片、信紙等企業形象設計元素，建立一致性品牌形象。',
      createdBy: '675123456789012345678803',
      category: '平面設計類型',
      customItems: '675123456789012345678701', // 有 customItems 的例子
      previewImage: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1755653139/yiyi01-cloud/vuzb9w2vk5xgz4enfgwj.png',
      createdAt: '2024-08-13T09:15:00.000Z',
      updatedAt: '2024-08-13T09:15:00.000Z'
    },
    {
      _id: '675123456789012345678904',
      name: '動畫片頭模板',
      description: '專業的動畫片頭模板，適合視頻開場和品牌展示，支援多種轉場效果和動畫風格。',
      createdBy: '675123456789012345678804',
      category: '動態影片類型',
      customItems: null,
      previewImage: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1755653139/yiyi01-cloud/vuzb9w2vk5xgz4enfgwj.png',
      createdAt: '2024-08-12T16:45:00.000Z',
      updatedAt: '2024-08-12T16:45:00.000Z'
    },
    {
      _id: '675123456789012345678905',
      name: '社群媒體套組',
      description: 'Instagram、Facebook 等社群媒體專用的設計模板套組，包含貼文、限時動態等多種格式。',
      createdBy: '675123456789012345678805',
      category: '其他',
      customItems: null,
      previewImage: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1755653139/yiyi01-cloud/vuzb9w2vk5xgz4enfgwj.png',
      createdAt: '2024-08-11T11:30:00.000Z',
      updatedAt: '2024-08-11T11:30:00.000Z'
    },
    {
      _id: '675123456789012345678906',
      name: '產品目錄設計',
      description: '專業的產品目錄設計模板，適合產品展示和銷售資料製作，包含多種排版風格。',
      createdBy: '675123456789012345678806',
      category: '平面設計類型',
      customItems: '675123456789012345678702',
      previewImage: 'https://res.cloudinary.com/dsb5x7env/image/upload/v1755653139/yiyi01-cloud/vuzb9w2vk5xgz4enfgwj.png',
      createdAt: '2024-08-10T08:20:00.000Z',
      updatedAt: '2024-08-10T08:20:00.000Z'
    }
  ]

  console.log('✅ 載入模擬數據，包含', templates.value.length, '個模板')
  console.log('📊 分類分布:', {
    '動態影片類型': templates.value.filter(t => t.category === '動態影片類型').length,
    '靜態影像類型': templates.value.filter(t => t.category === '靜態影像類型').length,
    '平面設計類型': templates.value.filter(t => t.category === '平面設計類型').length,
    '其他': templates.value.filter(t => t.category === '其他').length
  })

  createTemplatePreviewsInGrid()
}

// 優化 Cloudinary 圖片 URL
const optimizeCloudinaryUrl = (originalUrl, width = 400, height = 300) => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl
  }

  try {
    // 解析 Cloudinary URL 並添加轉換參數
    const urlParts = originalUrl.split('/upload/')
    if (urlParts.length === 2) {
      const [baseUrl, imagePath] = urlParts
      // 添加轉換參數：調整尺寸、質量優化、格式自動選擇
      const transformations = `c_fill,w_${width},h_${height},q_auto,f_auto`
      return `${baseUrl}/upload/${transformations}/${imagePath}`
    }
  } catch (error) {
    console.warn('無法優化 Cloudinary URL:', error)
  }

  return originalUrl
}

// 在網格中創建模板預覽
const createTemplatePreviewsInGrid = () => {
  if (!templates.value.length || !group) return

  const textureLoader = new THREE.TextureLoader()
  const gridCols = 6 // 每行顯示的模板數量
  const spacing = 2   // 模板間距

  // 設置 CORS 支援
  textureLoader.setCrossOrigin('anonymous')

  templates.value.forEach((template, index) => {
    // 計算位置
    const col = index % gridCols
    const row = Math.floor(index / gridCols)
    const x = (col - gridCols / 2) * spacing
    const y = (row - Math.floor(templates.value.length / gridCols) / 2) * -spacing

    // 優化 Cloudinary 圖片 URL
    const optimizedImageUrl = optimizeCloudinaryUrl(template.previewImage, 400, 300)

    console.log(`載入模板 ${template.name} 預覽圖:`, optimizedImageUrl)

    // 載入預覽圖片
    textureLoader.load(
      optimizedImageUrl,
      (texture) => {
        // 設置材質屬性以獲得更好的顯示效果
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter
        texture.generateMipmaps = true

        // 創建材質和幾何體
        const geometry = new THREE.PlaneGeometry(2, 1.5)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.1, // 處理透明度
        })

        const plane = new THREE.Mesh(geometry, material)
        plane.position.set(x, y, 0.1)

        // 儲存模板資料到 userData
        plane.userData = {
          template: template,
          originalPosition: { x, y, z: 0.1 },
          isLoaded: true
        }

        // 加入群組和追蹤陣列
        group.add(plane)
        templatePlanes.push(plane)

        // 添加懸停效果
        addHoverEffect(plane)

        console.log(`✅ 成功載入模板: ${template.name}`)
      },
      (progress) => {
        // 載入進度 (可選)
        console.log(`載入進度 ${template.name}:`, (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error(`❌ 載入模板 ${template.name} 的預覽圖失敗:`, error)
        console.error('原始 URL:', template.previewImage)
        console.error('優化後 URL:', optimizedImageUrl)

        // 創建佔位符
        createPlaceholderPlane(template, x, y)
      }
    )
  })
}

// 創建佔位符平面（當圖片載入失敗時）
const createPlaceholderPlane = (template, x, y) => {
  const geometry = new THREE.PlaneGeometry(2, 1.5)
  const material = new THREE.MeshBasicMaterial({
    color: 0x666666,
    transparent: true,
    opacity: 0.7
  })

  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(x, y, 0.1)
  plane.userData = {
    template: template,
    originalPosition: { x, y, z: 0.1 },
    isPlaceholder: true
  }

  group.add(plane)
  templatePlanes.push(plane)
  addHoverEffect(plane)
}

// 添加懸停效果
const addHoverEffect = (plane) => {
  // 儲存原始縮放
  plane.userData.originalScale = { x: plane.scale.x, y: plane.scale.y, z: plane.scale.z }

  // 為懸停效果添加邊框
  const borderGeometry = new THREE.PlaneGeometry(2.1, 1.6)
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  })

  const border = new THREE.Mesh(borderGeometry, borderMaterial)
  border.position.copy(plane.position)
  border.position.z -= 0.01 // 稍微後移

  plane.userData.hoverBorder = border
  group.add(border)
}

// 處理滑鼠懸停效果
const handleMouseHover = (event) => {
  if (isDragging) return

  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(templatePlanes, true)

  // 重置所有懸停效果
  templatePlanes.forEach(plane => {
    if (plane.userData.hoverBorder) {
      plane.userData.hoverBorder.material.opacity = 0
    }
    // 恢復原始縮放
    if (plane.userData.originalScale) {
      plane.scale.copy(plane.userData.originalScale)
    }
  })

  // 應用懸停效果到當前物件
  if (intersects.length > 0) {
    const hoveredPlane = intersects[0].object
    container.value.style.cursor = 'pointer'

    // 顯示邊框
    if (hoveredPlane.userData.hoverBorder) {
      hoveredPlane.userData.hoverBorder.material.opacity = 0.6
    }

    // 輕微放大
    hoveredPlane.scale.multiplyScalar(1.05)
  } else {
    container.value.style.cursor = isDragging ? 'grabbing' : 'grab'
  }
}

// 初始化 Three.js 場景
const init = () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // 建立場景
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(8, width / height, 0.1, 1000)
  camera.position.z = 60

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  // 建立背景網格
  group = new THREE.Group()
  createBackgroundGrid()
  scene.add(group)

  // 設定互動事件
  setupInteractionEvents()

  // 開始動畫循環
  animate()

  // 載入模板資料
  fetchTemplates()
}

// 創建背景網格
const createBackgroundGrid = () => {
  const gridSize = 20
  const squareSize = 1
  const gap = 0.3

  const material = new THREE.LineBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.3
  })

  for (let i = -gridSize; i <= gridSize; i++) {
    for (let j = -gridSize; j <= gridSize; j++) {
      const points = []
      const x = i * (squareSize + gap)
      const y = j * (squareSize + gap)

      points.push(new THREE.Vector3(x - squareSize / 2, y - squareSize / 2, 0))
      points.push(new THREE.Vector3(x + squareSize / 2, y - squareSize / 2, 0))
      points.push(new THREE.Vector3(x + squareSize / 2, y + squareSize / 2, 0))
      points.push(new THREE.Vector3(x - squareSize / 2, y + squareSize / 2, 0))

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const square = new THREE.LineLoop(geometry, material)
      group.add(square)
    }
  }
}

// 設定互動事件
const setupInteractionEvents = () => {
  container.value.style.cursor = 'grab'

  // 定義事件處理函數
  const onPointerDown = (event) => {
    isDragging = true
    previousMousePosition = { x: event.clientX, y: event.clientY }
    container.value.style.cursor = 'grabbing'
  }

  const onPointerUp = () => {
    isDragging = false
    container.value.style.cursor = 'grab'
  }

  const onPointerLeave = () => {
    isDragging = false
    container.value.style.cursor = 'grab'
  }

  const onPointerMove = (event) => {
    if (isDragging) {
      // 拖拽邏輯
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      }

      const moveSpeed = 0.1
      group.position.x += deltaMove.x * moveSpeed
      group.position.y -= deltaMove.y * moveSpeed

      previousMousePosition = { x: event.clientX, y: event.clientY }
    } else {
      // 懸停效果
      handleMouseHover(event)
    }
  }

  const onClick = (event) => {
    if (isDragging) return // 避免拖拽時觸發點擊

    event.preventDefault()

    // 計算滑鼠在畫布中的標準化座標
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // 射線檢測
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(templatePlanes, true)

    if (intersects.length > 0) {
      const clickedTemplate = intersects[0].object.userData.template
      console.log('🎯 點擊模板:', {
        id: clickedTemplate._id,
        name: clickedTemplate.name,
        category: clickedTemplate.category,
        description: clickedTemplate.description
      })

      selectedTemplate.value = clickedTemplate

      // 可選：導航到模板詳情頁
      // router.push(`/template/${clickedTemplate._id}`)
    }
  }

  // 綁定事件
  container.value.addEventListener('pointerdown', onPointerDown)
  container.value.addEventListener('pointerup', onPointerUp)
  container.value.addEventListener('pointerleave', onPointerLeave)
  container.value.addEventListener('pointermove', onPointerMove)
  container.value.addEventListener('click', onClick)

  // 儲存事件處理函數以便清理
  container.value.__eventListeners = {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerMove,
    onClick,
  }
}

// 動畫循環
function animate() {
  group.rotation.y += 0.0007
  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

// 視窗縮放處理
const handleResize = () => {
  if (camera && renderer && container.value) {
    const width = container.value.clientWidth
    const height = container.value.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

// 關閉模態框
const closeModal = () => {
  selectedTemplate.value = null
}

// 格式化日期 (處理 MongoDB timestamps)
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('日期格式化失敗:', dateString)
    return '日期無效'
  }
}

// 模板操作函數
const useTemplate = async () => {
  if (!selectedTemplate.value) return

  try {
    console.log('🚀 使用模板:', selectedTemplate.value._id)

    // 根據您的業務邏輯，這裡可能需要：
    // 1. 複製模板
    // 2. 創建新項目
    // 3. 導航到編輯器

    // 示例：導航到編輯器並傳遞模板 ID
    router.push({
      name: 'editor', // 或您的編輯器路由名稱
      params: { templateId: selectedTemplate.value._id },
      query: { mode: 'create' }
    })

    closeModal()
  } catch (error) {
    console.error('❌ 使用模板失敗:', error)
    alert('使用模板失敗，請稍後再試')
  }
}

const previewTemplate = () => {
  if (!selectedTemplate.value) return

  console.log('👁️ 預覽模板:', selectedTemplate.value._id)

  // 導航到預覽頁面
  router.push({
    name: 'template-preview', // 或您的預覽路由名稱
    params: { id: selectedTemplate.value._id }
  })

  closeModal()
}

// 根據分類獲取顏色
const getCategoryColor = (category) => {
  const colors = {
    '動態影片類型': '#FF6B6B',
    '靜態影像類型': '#4ECDC4',
    '平面設計類型': '#45B7D1',
    '其他': '#96CEB4'
  }
  return colors[category] || '#999999'
}

// Vue 生命週期
onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  // 清理事件監聽器
  if (container.value && container.value.__eventListeners) {
    const { onPointerDown, onPointerUp, onPointerLeave, onPointerMove, onClick } = container.value.__eventListeners
    container.value.removeEventListener('pointerdown', onPointerDown)
    container.value.removeEventListener('pointerup', onPointerUp)
    container.value.removeEventListener('pointerleave', onPointerLeave)
    container.value.removeEventListener('pointermove', onPointerMove)
    container.value.removeEventListener('click', onClick)
    delete container.value.__eventListeners
  }

  // 清理 Three.js 資源
  if (container.value && renderer && renderer.domElement) {
    container.value.removeChild(renderer.domElement)
  }

  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  // 清理模板平面
  templatePlanes.forEach(plane => {
    if (plane.material.map) {
      plane.material.map.dispose()
    }
    plane.material.dispose()
    plane.geometry.dispose()
  })
  templatePlanes = []

  scene = null
  camera = null
  group = null
})
</script>

<style scoped>
.dynamic-grid-canvas {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  color: white;
  font-size: 18px;
  padding: 20px;
  border: 2px solid #ffffff;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
}

.template-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 0;
  border-radius: 12px;
  max-width: 600px;
  max-height: 85vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.preview-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.preview-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.template-info {
  padding: 24px;
}

.template-info h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 14px;
}

.template-meta {
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.meta-row .label {
  font-weight: 600;
  color: #555;
  min-width: 80px;
  font-size: 13px;
}

.meta-row .value {
  color: #777;
  font-size: 13px;
}

.template-id {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.use-btn, .preview-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.use-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.use-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.preview-btn {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.preview-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

canvas {
  display: block;
}
</style>
