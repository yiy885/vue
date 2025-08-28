<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    background-color="#000000"
    text-color="#ffffff"
    @select="handleSelect"
  >
    <el-menu-item index="/">
      <img
        style="width: 50px"
        src="../assets/img/ci-an/logo/ceromony-logo-w.png"
        alt="Logo"
      />
    </el-menu-item>
 <el-menu-item
      v-for="item in navItems"
      :key="item.to"
      :index="item.to"
      v-show="item.show"
    >
      {{ item.title }}
    </el-menu-item>

  </el-menu>
</template>

<script lang="ts" setup>
import 'element-plus/dist/index.css'
import { computed } from 'vue';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import userService from '@/services/user'
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'


const user = useUserStore()
const route = useRoute()
const router = useRouter()

const navItems = computed(() => [
  { title: 'about', to: '/about', show: true },
  { title: "let's talk", to: '/talk', show: true },
  { title: 'Login', to: '/login', show: !user.isLoggedIn },
  { title: 'Sign Up', to: '/register', show: !user.isLoggedIn },
  { title: 'Logout', to: '/logout', show: user.isLoggedIn },
]);



const logout = async () => {
  try {
    await userService.logout()
  } catch (error) {
    console.error(error)
  }
  user.logout()
  router.push('/')
  ElMessage.success('登出成功')
}

const activeIndex = computed(() => {
  if (route.path.startsWith('/login')) return '/login';
  return route.path;
});

function handleSelect(key: string) {
  if (key === '/logout') {
    logout();
  } else {
    router.push(key);
  }
}

</script>

<style scoped>

.el-menu{
    width: 100%;
    position: fixed;
    top: 0; /* 固定在頂部 */

}
/* 霧面玻璃效果 */
.el-menu-demo {
  background-color: rgba(0, 0, 0, 0.3); /* 半透明背景 */
  backdrop-filter: blur(20px); /* 模糊效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari 兼容 */
  border-bottom: none; /* 去除底部邊框 */
  top: 0;
  z-index: 1000; /* 確保層級在上 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 輕微陰影 */
}

/* 調整 logo 項目的 margin */
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}


/* Hover 效果 */
.el-menu-item:hover,
.el-sub-menu__title:hover
{
  /* 覆蓋 Element Plus 的預設 hover 藍色，並保持文字為白色 */
  color: #ffffff !important;
  text-shadow: 2px 2px 5px #ffffff;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.7)); /* 增強光暈 */
  /* 移除背景色，改用下方的 ::after 偽元素來實現下劃線效果 */
  background-color: transparent !important;
}


/* 移除選中項目預設樣式 */
/* Element Plus 對於 is-active 的項目會預設加上主題色的文字顏色和下邊框。 */
/* 以下 CSS 會覆蓋這些預設樣式，讓選中項目看起來和未選中一樣。 */
.el-menu--horizontal .el-menu-item.is-active,
.el-menu--horizontal .el-sub-menu.is-active .el-sub-menu__title {
  border-bottom: none !important; /* 移除預設的下邊框 */
  color: #ffffff !important; /* 覆蓋預設的 active 文字顏色，與 text-color 屬性一致 */
  background-color: transparent !important;

}

/* 滑順過渡效果 & 為下劃線定位 */
.el-menu-item,
.el-sub-menu__title {
  position: relative; /* 為 ::after 偽元素提供定位上下文 */
  transition: color 0.5s ease; /* 只保留文字顏色過渡 */

}

/* Hover 下劃線效果 */
.el-menu-item::after,
.el-sub-menu__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px; /* 根據你的要求設定高度 */
  background-color: rgba(255, 255, 255, 0.886); /* 下劃線顏色，可自行調整 */
  transform: scaleX(0); /* 初始狀態下，寬度為 0 (隱藏) */
  transition: transform 0.5s ease-out; /* 動畫效果 */
  transform-origin: center; /* 動畫從中間展開 */
}

.el-menu-item:hover::after,
.el-sub-menu__title:hover::after {
  transform: scaleX(1); /* Hover 時，寬度變為 100% (顯示) */
}
</style>
