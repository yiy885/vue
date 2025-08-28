<template>
  <div ref="container" class="dynamic-grid-canvas"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useRouter , useRoute} from 'vue-router';

// import imageUrl from '../img/ci-an/logo/ceromony-logo-white.png'

const container = ref(null)

// 用於處理滑鼠事件的變數
const router = useRouter();
let renderer, scene, camera, group, animationId, raycaster, mouse, demoPlane1, demoPlane2;

// 初始化 Raycaster----------------------------------------------
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();


//  -----------------------------------------------------------

// 追蹤拖曳狀態及前次滑鼠位置
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

// 控制平移的變數
let offset = { x: 0, y: 0 }



const init = () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // 初始化 Three.js 場景
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(8, width / height, 0.1, 1000)
  camera.position.z = 60

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)

  // 建立空心方格網格
  group = new THREE.Group()
  const gridSize = 20 // Number of squares in each direction from the center
  const squareSize = 1
  const gap = 0.3 // Gap between squares


  const material = new THREE.LineBasicMaterial({
    color: 0xcccccc, // 改為淺灰色
    transparent: true, // 啟用透明
    opacity: 0.5 // 設置透明度
  });

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
      const square = new THREE.LineLoop(geometry, material)//繪製封閉的線框
      group.add(square)
    }
  }

  //----------------------------------------------------
  // 載入 Demo 圖片 1
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'src/img/ci-an/logo/ceromony-logo-w.png', // 確保路徑正確
    (texture) => {
      const demoGeometry = new THREE.PlaneGeometry(1, 1);
      const demoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      demoPlane1 = new THREE.Mesh(demoGeometry, demoMaterial);
      demoPlane1.position.z = 0.1;
      demoPlane1.position.x = 0;
      demoPlane1.userData = { route: '/demo-ceremony' }; // 儲存跳轉路由
      group.add(demoPlane1);
    },
    undefined,
    (error) => {
      console.error('Demo 圖片 1 載入失敗:', error);
    }
  );
  //--------------------------------------------------

  scene.add(group)



// 滑鼠拖曳事件綁定

container.value.style.cursor = 'grab'

//這裡用箭頭涵式為沒有宣告名稱，無法綁釘成事件移除
  // container.value.addEventListener('pointerdown', (event) => {
  //   isDragging = true
  //   previousMousePosition = {
  //     x: event.clientX,
  //     y: event.clientY,
  //   }
  //   container.value.style.cursor = 'grabbing'
  // })

  // container.value.addEventListener('pointerup', () => {
  //   isDragging = false
  //   container.value.style.cursor = 'grab'
  // })

  // container.value.addEventListener('pointerleave', () => {
  //   isDragging = false
  //   container.value.style.cursor = 'grab'
  // })

  // container.value.addEventListener('pointermove', (event) => {
  //   if (!isDragging) return

  //   const deltaMove = {
  //     x: event.clientX - previousMousePosition.x,
  //     y: event.clientY - previousMousePosition.y,
  //   }

  //  // 將 group 平移 (X 和 Y 軸)
  //   // 乘以縮放比例調整平移速度，可以依需求微調
  //   const moveSpeed = 0.1
  //   group.position.x += deltaMove.x * moveSpeed
  //   group.position.y -= deltaMove.y * moveSpeed  // Y 軸反向

  //   previousMousePosition = {
  //     x: event.clientX,
  //     y: event.clientY,
  //   }
  // })

  // 定義命名函數以便移除
  const onPointerDown = (event) => {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    container.value.style.cursor = 'grabbing';
  };

  const onPointerUp = () => {
    isDragging = false;
    container.value.style.cursor = 'grab';
  };

  const onPointerLeave = () => {
    isDragging = false;
    container.value.style.cursor = 'grab';
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;

    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };

    const moveSpeed = 0.1;
    group.position.x += deltaMove.x * moveSpeed;
    group.position.y -= deltaMove.y * moveSpeed;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  };


//demo1點擊事件----------------------------------------
const onClick = (event) => {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
   const intersects = raycaster.intersectObjects([demoPlane1], true); // 只檢測 demoPlane1
  if (intersects.length > 0) {
    console.log('圖片被點擊:', intersects[0].object.userData.route);
    const route = intersects[0].object.userData.route;
    if (route) {
      router.push(route);
    }
  } else {
    console.log('未檢測到圖片點擊');
  }
};

//  綁定事件
  container.value.addEventListener('pointerdown', onPointerDown);
  container.value.addEventListener('pointerup', onPointerUp);
  container.value.addEventListener('pointerleave', onPointerLeave);
  container.value.addEventListener('pointermove', onPointerMove);
  container.value.addEventListener('click', onClick);

// 動畫循環----------------------------------------------------
  function animate() {
    // group.rotation.z += 0.0015
    // group.rotation.x += 0.0007
    group.rotation.y += 0.0007
    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)//確保動畫在瀏覽器最佳效能下運行
  }
  animate()

  // 儲存事件監聽器以便清理
  container.value.__eventListeners = {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerMove,
    onClick,
  };
}


//視窗縮放處理 (handleResize)-----------------------------------
const handleResize = () => {
  if (camera && renderer && container.value) {
    const width = container.value.clientWidth
    const height = container.value.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }
}


//Vue 生命週期---------------------------------------------------


//掛載時 → 初始化場景並綁定縮放事件。
onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  // if (container.value) {
  //   container.value.removeEventListener('pointerdown', onPointerDown)
  //   container.value.removeEventListener('pointerup', onPointerUp)
  //   container.value.removeEventListener('pointerleave', onPointerLeave)
  //   container.value.removeEventListener('pointermove', onPointerMove)

  //   // 移除 canvas 以避免 DOM 異常
  //   if (renderer.domElement) {
  //     container.value.removeChild(renderer.domElement)
  //   }
  // }
    if (container.value && container.value.__eventListeners) {
    const { onPointerDown, onPointerUp, onPointerLeave, onPointerMove,onClick } = container.value.__eventListeners;
    container.value.removeEventListener('pointerdown', onPointerDown);
    container.value.removeEventListener('pointerup', onPointerUp);
    container.value.removeEventListener('pointerleave', onPointerLeave);
    container.value.removeEventListener('pointermove', onPointerMove);
    container.value.removeEventListener('click', onClick);
    delete container.value.__eventListeners;
  }

  if (container.value && renderer && renderer.domElement) {
    container.value.removeChild(renderer.domElement);
  }

  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer = null;
  }
  scene = null
  camera = null
  group = null
  renderer = null
  demoPlane1 = null;
})

//卸載時 → 移除事件監聽，取消動畫，釋放 GPU 資源。
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', handleResize)

//   container.value.removeEventListener('pointerdown', onPointerDown)
//   cancelAnimationFrame(animationId)
//   if (renderer) {
//     renderer.dispose()
//   }
// })
</script>


<style scoped>

.dynamic-grid-canvas {
  width: 100%;
  height: calc(100vh - 60px);
  /* pointer-events: none;讓滑鼠點擊事件穿透，不阻擋底層按鈕 */
  overflow: hidden;


}

canvas {
  display: block;

}
</style>
