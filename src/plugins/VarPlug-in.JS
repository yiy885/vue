/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
  * 此檔案會自動在 `./src/main.js` 中被引入
 * 用來集中註冊所有全域的 Vue 插件
 */

import VueFileAgentNext from '@boindil/vue-file-agent-next'// 上傳檔案元件 (Next 版)
// Plugins
import router from '@/router'// Vue Router
import pinia from '@/stores'// Pinia 狀態管理
// import vuetify from './vuetify'// Vuetify UI 框架設定
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'// Vue File Agent 樣式

export function registerPlugins (app) {
  app
    // UI 框架 Vuetify
    // .use(vuetify)

    // 全域對話框與訊息 API（可快速呼叫 alert、confirm、snackbar 等）
    // .use(VuetifyUseDialog, {
    //   snackbar: {
    //     showCloseButton: false,// 是否顯示關閉按鈕
    //     snackbarProps: {
    //       timeout: 2000,// 預設顯示時間
    //     },
    //   },
    // })
    // 上傳檔案元件
    .use(VueFileAgentNext)
    // 路由系統
    .use(router)
    // 狀態管理
    .use(pinia)
}
