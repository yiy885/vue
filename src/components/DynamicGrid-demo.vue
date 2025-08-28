<template>
  <div ref="container" class="dynamic-grid-canvas">
    <!-- 這裡的內容將由 Three.js 渲染 -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useRouter } from 'vue-router';
import projectService from '@/services/project.js';

const container = ref(null)
const templates = ref([]); // 用於儲存模板資料
const clickableObjects = []; // 用於儲存所有可點擊的預覽圖平面
const isLoading = ref(false);
const errorMessage = ref('');

// 建立背景的空心方格網格
const gridSize = 20
const squareSize = 1
const gap = 0
// const margin = 0.2

const router = useRouter();
let renderer, scene, camera, group, animationId, raycaster, mouse;

// 初始化 Raycaster
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// 追蹤拖曳狀態
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

const init = () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // 初始化 Three.js 場景
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(5, width / height, 0.1, 1000) // 增加 FOV 至 45 度
  camera.position.z = 60

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  group = new THREE.Group()
  scene.add(group)

  // 建立背景網格
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.5
  });

  for (let i = -gridSize; i <= gridSize; i++) {
    for (let j = -gridSize; j <= gridSize; j++) {
      const points = [];
      const x = i * (squareSize + gap);
      const y = j * (squareSize + gap);
      points.push(new THREE.Vector3(x - squareSize / 2, y - squareSize / 2, 0));
      points.push(new THREE.Vector3(x + squareSize / 2, y - squareSize / 2, 0));
      points.push(new THREE.Vector3(x + squareSize / 2, y + squareSize / 2, 0));
      points.push(new THREE.Vector3(x - squareSize / 2, y + squareSize / 2, 0));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const square = new THREE.LineLoop(geometry, lineMaterial);
      group.add(square);
    }
  }
  // 加載模板
  loadTemplatePreviews();
  // 設定滑鼠事件
  setupMouseEvents();

  // 動畫循環
  animate()
}

const loadTemplatePreviews = async () => {
  if (templates.value.length > 0) {
    console.log('模板已加載，跳過重複請求');
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { data } = await projectService.getAll();
    console.log('API 回傳資料:', data);
    if (data && Array.isArray(data.data)) {
      templates.value = data.data;
    } else {
      console.error('API 回傳的資料無效或不是陣列:', data);
      templates.value = [];
      errorMessage.value = '無法載入模板資料，請稍後再試';
      return;
    }

    if (templates.value.length === 0) {
      console.warn('模板資料為空，跳過渲染');
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    console.log('使用 API URL:', API_URL);

    const step = squareSize; // 1.3
    const cols = Math.min(gridSize, Math.ceil(Math.sqrt(templates.value.length))); // 動態列數
    const rows = Math.ceil(templates.value.length / cols); // 動態行數
    const offsetX = ((cols )) * step; // 水平偏移量
    const offsetY = ((rows )) * step; // 垂直偏移量

    templates.value.forEach((template, index) => {
      const imageUrl = template.previewImage;
      if (!imageUrl) {
        console.warn(`模板 ${template._id} 缺少預覽圖 URL`);
        return;
      }
      textureLoader.load(
        imageUrl,
        (texture) => {
          // const imageSize = squareSize - margin * 0; // 減去兩側邊界空間
          const demoGeometry = new THREE.PlaneGeometry(squareSize*0.5, squareSize*0.5); // 與網格方格大小一致
          const demoMaterial = new THREE.MeshBasicMaterial({
            map: texture,
              transparent: true,
              side: THREE.DoubleSide,
              opacity: 0.8, // 可選：調整透明度
          });
          const demoPlane = new THREE.Mesh(demoGeometry, demoMaterial);
          // 計算圖片在網格中的位置 (居中，從上到下)
          // const scale = 0.6; // 將圖片縮小至原尺寸的 60%，可調整
          // texture.offset.set((1 - scale) / 2, (1 - scale) / 2); // 居中偏移
          // texture.repeat.set(2, 2); // 縮放紋理
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = (col * step) - offsetX;
          const y = offsetY - (row * step); // 從上到下

          demoPlane.position.set(x, y, 0.1);
          demoPlane.userData = { route: `/project/${template._id}` };
          group.add(demoPlane);
          clickableObjects.push(demoPlane);
        },
        undefined,
        (error) => {
          console.error(`圖片加載失敗: ${imageUrl}`, error);
          // const imageSize = squareSize - margin * 2; // 佔位符與圖片一致
          const demoGeometry = new THREE.PlaneGeometry(squareSize * 0.5, squareSize * 0.5); // 佔位符與網格一致
          const demoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
          const demoPlane = new THREE.Mesh(demoGeometry, demoMaterial);
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = (col * step) - offsetX;
          const y = offsetY - (row * step);
          demoPlane.position.set(x, y, 0.1);
          demoPlane.userData = { route: `/project/${template._id}` };
          group.add(demoPlane);
          clickableObjects.push(demoPlane);
        }
      );
    });
  } catch (error) {
    console.error('獲取模板資料失敗:', error.message, error.config?.url, error.stack);
    templates.value = [];
  }
};

// 設定滑鼠事件
const dragThreshold = 10; // 定義拖曳的最小移動距離（像素）

const setupMouseEvents = () => {
  container.value.style.cursor = 'grab';

  const onPointerDown = (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
    container.value.style.cursor = 'grabbing';
  };

  const onPointerUp = (event) => {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > dragThreshold) {
      // 如果移動距離超過閾值，視為拖曳，取消點擊事件
      isDragging = false;
      container.value.style.cursor = 'grab';
      return;
    }

    // 如果移動距離未超過閾值，視為點擊
    isDragging = false;
    container.value.style.cursor = 'grab';
    onClick(event);
  };

  const onPointerLeave = () => {
    isDragging = false;
    container.value.style.cursor = 'grab';
  };

  const onPointerMove = (event) => {
    if (!isDragging) {
      // 檢查滑鼠是否懸停在可點擊對象上
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        container.value.style.cursor = 'pointer'; // 懸停時顯示手型光標
      } else {
        container.value.style.cursor = 'grab'; // 否則保持抓取光標
      }
    }

    if (isDragging) {
      const deltaMove = { x: event.clientX - previousMousePosition.x, y: event.clientY - previousMousePosition.y };
      const moveSpeed = 0.1;
      group.position.x += deltaMove.x * moveSpeed;
      group.position.y -= deltaMove.y * moveSpeed;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  };

  const onClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
      const route = intersects[0].object.userData.route;
      if (route) {
        router.push(route);
      }
    }
  };

  container.value.addEventListener('pointerdown', onPointerDown);
  container.value.addEventListener('pointerup', onPointerUp);
  container.value.addEventListener('pointerleave', onPointerLeave);
  container.value.addEventListener('pointermove', onPointerMove);

  container.value.__eventListeners = { onPointerDown, onPointerUp, onPointerLeave, onPointerMove };
};

// 動畫循環
function animate() {
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
}

// 處理視窗縮放
const handleResize = () => {
  if (camera && renderer && container.value) {
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

// Vue 生命週期
onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  if (container.value && container.value.__eventListeners) {
    const { onPointerDown, onPointerUp, onPointerLeave, onPointerMove } = container.value.__eventListeners;
    container.value.removeEventListener('pointerdown', onPointerDown);
    container.value.removeEventListener('pointerup', onPointerUp);
    container.value.removeEventListener('pointerleave', onPointerLeave);
    container.value.removeEventListener('pointermove', onPointerMove);
    delete container.value.__eventListeners;
  }

  if (container.value && renderer && renderer.domElement) {
    container.value.removeChild(renderer.domElement);
  }

  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
  }
  scene = null
  camera = null
  group = null
  renderer = null
  clickableObjects.length = 0;
})
</script>

<style scoped>
.dynamic-grid-canvas {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

canvas {
  display: block;
}
</style>
