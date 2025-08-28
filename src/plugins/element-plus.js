import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 導入 Element Plus 的 CSS 樣式
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'

export const registerPlugins = (app) => {
  app.use(ElementPlus)
}
