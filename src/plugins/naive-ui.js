/**
 * plugins/naive.js
 *
 * Naive UI 框架設定檔
 * 官方文件：https://www.naiveui.com
 */

import { create, NCard, NButton, NDialogProvider,NMessageProvider } from 'naive-ui'

// 建立並匯出 Naive UI 實例
export default create({
  components: [
    NCard,
    NButton,
    NDialogProvider,
    NMessageProvider,

    // 可以在這裡加入更多你需要的 Naive UI 元件
  ]
})
