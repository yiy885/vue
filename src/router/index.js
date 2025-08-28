/**
 * router/index.ts
 *
 * 自動載入 `./src/pages/*.vue` 的路由設定
 */

// Composables
import { setupLayouts } from 'virtual:generated-layouts'

import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'

import { routes } from 'vue-router/auto-routes'

import userService from '@/services/user'
import { useUserStore } from '@/stores/user'
// import HomePage from '@/pages/index.vue'

// const routes = [
//   {
//     path: '/',       // 首頁路徑
//     name: 'home',
//     component: HomePage
//   }
// ]

// 建立 Vue Router 實例，使用 hash 模式歷史記錄，並結合自動路由與佈局
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// ✅ 正確的路由守衛寫法
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = checkAuthStatus()

//   if (to.path === '/login' && isLoggedIn) {
//     next('/dashboard') // 已登入者重定向到儀表板
//   } else if (to.meta.requiresAuth && !isLoggedIn) {
//     next('/login') // 需要認證但未登入
//   } else {
//     next() // 正常通過
//   }
// })

// 全局導航守衛：路由跳轉前檢查權限與登入狀態
router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  // 第一次進入網站且已登入，嘗試抓取使用者資料做初始化
  if (from === START_LOCATION && user.isLoggedIn) {
    try {
      const { data } = await userService.profile()
      user.login(data.user) // 更新使用者狀態
    } catch (error) {
      console.error(error)
      user.token = '' // token 無效則清空
    }
  }

  // 根據路由 meta 設定與登入狀態執行不同的導航邏輯
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 未登入專用頁面，但已登入時導回首頁（例如註冊、登入頁）
    next('/')
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 需要登入的頁面，但未登入時導到登入頁
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 需要管理員身份，但非管理員時導回首頁
    next('/')
  } else {
    // 其他情況不阻擋，正常放行
    next()
  }
})

// 全局路由後置鉤子，設定網頁標題
// router.afterEach(to => {
//   document.title = `${to.meta.title} | 專案管理`
// })
router.afterEach((to) => {
  const defaultTitle = '專案管理'
  if (to.meta?.title) {
    document.title = `${to.meta.title} | ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
})


// 處理 Vite 動態匯入錯誤的 workaround
// 參考 issue: https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reload did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath) // 重新導向當前路徑強制重新載入
    }
  } else {
    console.error(err)
  }
})

// Router 初始化完成後，清除 reload 狀態標記
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
