<template>
  <div ref="container" class="dynamic-grid-canvas"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { useRouter } from 'vue-router';
import axios from 'axios';

const container = ref(null);
const router = useRouter();
let renderer, scene, camera, group, animationId, raycaster, mouse;

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:4000/projects');
    return response.data;
  } catch (error) {
    console.error('無法獲取專案列表:', error);
    return [];
  }
};

const init = async () => {
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(8, width / height, 0.1, 1000);
  camera.position.z = 60;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  group = new THREE.Group();
  const gridSize = 20;
  const squareSize = 1;
  const gap = 0.3;

  const textureLoader = new THREE.TextureLoader();
  const projects = await fetchProjects();

  projects.forEach((project, index) => {
    textureLoader.load(
      project.previewImage,
      (texture) => {
        const demoGeometry = new THREE.PlaneGeometry(1, 1);
        const demoMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const demoPlane = new THREE.Mesh(demoGeometry, demoMaterial);

        const x = (index % gridSize) * (squareSize + gap) - (gridSize / 2) * (squareSize + gap);
        const y = Math.floor(index / gridSize) * (squareSize + gap) - (gridSize / 2) * (squareSize + gap);

        demoPlane.position.set(x, y, 0.1);
        demoPlane.userData = { route: `/project/${project.id}` };
        group.add(demoPlane);
      },
      undefined,
      (error) => {
        console.error('圖片載入失敗:', error);
      }
    );
  });

  scene.add(group);

  const onClick = (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children, true);
    if (intersects.length > 0) {
      const route = intersects[0].object.userData.route;
      if (route) {
        router.push(route);
      }
    }
  };

  container.value.addEventListener('click', onClick);

  function animate() {
    group.rotation.y += 0.0007;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();

  onBeforeUnmount(() => {
    container.value.removeEventListener('click', onClick);
    cancelAnimationFrame(animationId);
    renderer.dispose();
  });
};

onMounted(() => {
  init();
});
</script>

<style scoped>
.dynamic-grid-canvas {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
}
</style>
