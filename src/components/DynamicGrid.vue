<template>
  <div ref="container" class="dynamic-grid-canvas"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let renderer, scene, camera, mesh, animationId

onMounted(() => {
  // 初始化 Three.js 場景
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / 1000, 0.1, 1000)
  camera.position.z = 60

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, 1000)
  container.value.appendChild(renderer.domElement)

  // 建立粒子網格
  const gridSize = 30
  const geometry = new THREE.BufferGeometry()
  const positions = []
  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let y = -gridSize; y <= gridSize; y += 2) {
      positions.push(x, y, 0)
    }
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  // 粒子材質
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 })
  mesh = new THREE.Points(geometry, material)
  scene.add(mesh)

  // 動畫循環
  function animate() {
    mesh.rotation.z += 0.0015
    mesh.rotation.x += 0.0007
    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }
  animate()

  // 響應式 resize
  window.addEventListener('resize', onResize)
})

function onResize() {
  if (!renderer || !camera) return
  renderer.setSize(window.innerWidth, 1000)
  camera.aspect = window.innerWidth / 1000
  camera.updateProjectionMatrix()
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer.dispose()
})
</script>

<style scoped>
.dynamic-grid-canvas {
  width: 100vw;
  height: 1000px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}
canvas {
  display: block;
}
</style>
