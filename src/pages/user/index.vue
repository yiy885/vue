<template>
  <el-header class="flex justify-end items-center p-4">
    <template v-if="userStore.user">
      <!-- 頭像 -->
      <el-avatar
        :src="userStore.user.avatar || defaultAvatar"
        size="40"
        class="mr-3"
      />
      <!-- 使用者名稱 -->
      <el-text class="mr-4">{{ userStore.user.name }}</el-text>

      <!-- 登出按鈕 -->
      <el-button type="danger" size="small" @click="logout">
        登出
      </el-button>
    </template>

    <template v-else>
      <!-- 如果還沒登入，顯示登入按鈕 -->
      <el-button type="primary" @click="router.push('/login')">
        登入
      </el-button>
    </template>
  </el-header>
</template>

<script setup>
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"

const userStore = useUserStore()
const router = useRouter()

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp" // 預設頭像

const logout = () => {
  userStore.logout() // 清除使用者狀態
  router.push("/login") // 導回登入頁面
}
</script>
