// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 使用者狀態管理 Store
 * 採用 setup 風格定義
 */
export const useUserStore = defineStore('user', () => {
  // 使用者帳號
  const account = ref('')

  // 購物車商品數量總和
  const cartTotal = ref(0)

  // 使用者角色，預設為普通使用者 'user'
  const role = ref('user')

  // 使用者認證 token
  const token = ref('')

  // 判斷是否已登入（token 有值即已登入）
  const isLoggedIn = computed(() => token.value.length > 0)

  // 判斷是否為管理員（角色為 admin）
  const isAdmin = computed(() => role.value === 'admin')

  /**
   * 登入方法
   * @param {Object} data - 從 API 拿到的使用者資料
   */
  const login = data => {
    account.value = data.account
    cartTotal.value = data.cartTotal
    role.value = data.role

    // 有 token 才更新（通常登入 API 回傳的 token）
     // 重新整理頁面時，用 token 取得使用者資料
    // 這個回應不包含 token
    if (data.token) {
      token.value = data.token
    }
  }

  /**
   * 登出方法
   * 清除使用者資料與 token
   */
  const logout = () => {
    account.value = ''
    cartTotal.value = 0
    role.value = 'user'
    token.value = ''
  }

  return {
    account,
    cartTotal,
    role,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  }
}, {
  // 持久化設定，只將 token 存在 localStorage 的 key: 'shop-user'
  persist: {
    key: 'shop-user',
    pick: ['token'],
  },
})
