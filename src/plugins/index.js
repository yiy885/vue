/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

//element plus----------------------------------------------
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

//naive-----------------------------------------------------
import naive from '../plugins/naive-ui'


import VueFileAgentNext from '@boindil/vue-file-agent-next'
// Plugins
import router from '@/router'
import pinia from '@/stores/PinaiaSetting'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'



// 註冊所有 Element Plus 元件 (通常用 .use(ElementPlus) 就行)
// 如果你想按需引入，可以用 components 方式
export function registerPlugins (app) {
  app
    // .use(vuetify)
    // .use(VuetifyUseDialog, {
    //   snackbar: {
    //     showCloseButton: false,
    //     snackbarProps: {
    //       timeout: 2000,
    //     },
    //   },
    // })
    .use(ElementPlus)
    .use(VueFileAgentNext)
    .use(router)
    .use(pinia)
    .use(naive)
}
