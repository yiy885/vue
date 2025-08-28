<template>
  <div>
    <!-- 你的頁面內容 -->
    <h1>{{ pageTitle }}</h1>
    <!-- 其他模塊內容 -->
  </div>
</template>
<script setup>
// page.vue 的區塊

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import pageService from '@/services/page' // 引入我們定義的 pageService

// ... 其他引入和響應式數據定義 ...

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 從路由參數中獲取 templateId
const templateId = ref(route.params.templateId)

// ... 其他響應式數據：pageTitle, modules, loading, errors ...
// ... 輔助函數：mapContentArrayToObject, mapContentObjectToArray, cloneModule, removeModule, formRules, hasModuleError, uploadImage ...

/**
 * 從後端加載現有網頁數據
 */
const loadPage = async () => {
  loading.value = true
  if (!templateId.value) {
    ElMessage.error('缺少專案 ID，無法加載網頁')
    loading.value = false
    router.push('/projects')
    return
  }
  try {
    // 調用 pageService 中的方法來獲取數據
    const response = await pageService.getPageByTemplateId(templateId.value)
    pageTitle.value = response.data.title
    modules.value = response.data.modules.map((mod) => {
      return {
        ...mod,
        id: mod._id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        content: mapContentArrayToObject(mod.content),
      }
    })
    errors.value = []
  } catch (e) {
    ElMessage.error('加載網頁失敗: ' + (e.response?.data?.error?.message || e.message))
    pageTitle.value = '未命名網頁'
    modules.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 保存網頁數據到後端
 */
const savePage = async () => {
  errors.value = []
  // ... 前端驗證邏輯 ...

  if (!userStore.id) {
    ElMessage.error('請先登錄')
    router.push('/login')
    return
  }
  if (!templateId.value) {
    ElMessage.error('缺少專案 ID，無法保存網頁')
    return
  }

  try {
    const modulesForBackend = modules.value.map((mod) => {
      const { id, content, ...rest } = mod
      return {
        ...rest,
        content: mapContentObjectToArray(content),
      }
    })

    // 調用 pageService 中的方法來保存數據
    await pageService.savePage(templateId.value, {
      title: pageTitle.value,
      modules: modulesForBackend,
    })
    ElMessage.success('網頁已保存')
  } catch (error) {
    console.error('保存網頁錯誤:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
      error.response.data.errors.forEach((err) => {
        const moduleInfo = err.moduleIndex !== undefined ? `模塊 ${err.moduleIndex + 1}` : ''
        ElMessage.error(`${moduleInfo} ${err.field ? err.field + ':' : ''} ${err.message}`)
      })
    } else {
      ElMessage.error(error.response?.data?.error || '無法保存網頁')
    }
  }
}

onMounted(() => {
  if (userStore.id && templateId.value) {
    loadPage()
  } else if (!userStore.id) {
    ElMessage.info('請先登錄以編輯網頁')
    router.push('/login')
    loading.value = false
  } else if (!templateId.value) {
    ElMessage.error('缺少專案 ID，無法加載網頁')
    router.push('/projects')
    loading.value = false
  }
})

// ... 其他邏輯 (cloneModule, removeModule, formRules, hasModuleError, uploadImage) ...
</script>
