<route lang="yaml">
meta:
  title: '首頁'
  login: 'public'
  admin: false
</route>

<template>
  <el-container class="page-container">
    <!-- 使用全局加載元件 -->
    <GlobalLoading
      v-if="pageLoading"
      :visible="pageLoading"
      :progress="loadingProgress"
      :message="loadingMessage"
      @loaded="onPageLoaded"
    />
    <!-- <DynamicGridDemo /> -->
    <DynamicGridDemo />
    <Button
      class="fab-button"
      :icon="Plus"
      size="large"
      type="primary"
      :round="true"
      backgroundColor="rgba(245, 223, 77, 1)"
      textColor="#000000"
      @click="handleButtonClick"
      >add</Button
    >
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import DynamicGridDemo from '@/components/DynamicGrid-demo.vue'

import Button from '@/components/custom-button.vue'
import { useUserStore } from '@/stores/user.js' // 更新為 useUserStore

const router = useRouter()
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn) // 映射到 isLoggedIn

const handleButtonClick = () => {
  console.log('Button clicked!')
  if (isLoggedIn.value) {
    router.push('/user/addProject') // 已登入，跳轉至專案頁面
  } else {
    router.push('/login') // 未登入，跳轉至登入頁面
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 確保佔滿視窗高度 */
  z-index: 1; /* 保留原始z-index，適用於網格 */
  overflow: hidden;
}

.fab-button {
  margin: 20px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000; /* 高於EleNavBar的z-index: 1000和DynamicGrid2 */
  width: 60px;
  height: 60px;
  border-radius: 50%; /* 確保圓形，若button.vue支持 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 陰影增加立體感 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24px; /* 圖標或文字大小 */
}
</style>
