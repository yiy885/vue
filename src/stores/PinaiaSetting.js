// Utilities
import { createPinia } from 'pinia' // 引入 Pinia 主體函式
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 Pinia 狀態持久化插件

// 建立 Pinia 實例
const pinia = createPinia()

// 使用狀態持久化插件，讓 Pinia 狀態可保存於 localStorage
pinia.use(piniaPluginPersistedstate)

// 匯出 Pinia 實例，供 Vue app 掛載
export default pinia
