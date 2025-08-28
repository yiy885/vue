<template>
  <n-layout-header bordered>
    <n-menu mode="horizontal">
      <n-menu-item key="home" name="home"> 首頁 </n-menu-item>
      <n-menu-item key="about" name="about"> 關於我們 </n-menu-item>
      <n-menu-item key="services" name="services"> 服務項目 </n-menu-item>
      <n-menu-item key="contact" name="contact"> 聯絡我們 </n-menu-item>
    </n-menu>
  </n-layout-header>
</template>

<script>
import { defineComponent } from 'vue'
import { NLayoutHeader, NMenu } from 'naive-ui'

export default defineComponent({
  components: {
    NLayoutHeader,
    NMenu,
  },
})
</script>
