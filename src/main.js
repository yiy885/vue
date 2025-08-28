import 'element-plus/dist/index.css'
//響應式類別https://element-plus.org/en-US/component/layout.html#utility-classes-for-hiding-elements
import 'element-plus/theme-chalk/display.css'
import './assets/main.css'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import router from './router'

// Plugins
import { registerPlugins } from '@/plugins/element-plus'

import 'viewerjs/dist/viewer.css'


// Styles
import 'unfonts.css'

import { createPinia } from 'pinia'


const app = createApp(App)
document.documentElement.classList.add('dark'); // 啟動時設為暗黑模式

app.use(router)
app.use(createPinia())


registerPlugins(app)


app.mount('#app')
