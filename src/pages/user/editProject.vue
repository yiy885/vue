<!-- src/views/editProject.vue -->
<route lang="yaml">
meta:
  title: '編輯專案'
  login: 'login-only'
  admin: false
</route>

<template>
  <el-container style="height: 100vh">
    <!-- 左邊模塊導覽列 -->
    <el-aside width="240px" style="background: #141414; padding: 16px">
      <el-card shadow="always">
        <template #header>
          <h3>模塊工具</h3>
        </template>
        <el-menu>
          <draggable
            :list="availableModules"
            :group="'modules'"
            :clone="cloneModule"
            item-key="type"
            :sort="false"
            style="cursor: grab"
          >
            <template #item="{ element: module }">
              <el-menu-item class="module-item">
                <span>{{ module.name }}</span>
              </el-menu-item>
            </template>
          </draggable>
        </el-menu>
      </el-card>
    </el-aside>

    <!-- 右邊拖曳儲存葉面 -->
    <el-main style="padding: 16px">
      <el-card shadow="always">
        <template #header>
          <el-row :gutter="15" align="middle">
            <el-col :span="18">
              <el-form :model="{ title: pageTitle }" :rules="titleRules" ref="titleFormRef">
                <el-form-item prop="title">
                  <el-input v-model="pageTitle" placeholder="輸入網頁標題" clearable />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6" style="text-align: right">
              <customButton
                type="primary"
                backgroundColor="rgba(245, 223, 77, 1)"
                textColor="#000000"
                @click="savePage"
              >
                保存網頁</customButton
              >
            </el-col>
          </el-row>
        </template>

        <div
          v-if="loading"
          class="canvas"
          style="min-height: 500px; display: flex; justify-content: center; align-items: center"
        >
          <el-icon :size="40" class="is-loading"><Loading /></el-icon>
        </div>

        <draggable
          v-else
          v-model="modules"
          group="modules"
          item-key="id"
          class="canvas"
          style="min-height: 500px; border: 1px dashed #ccc; padding: 16px"
        >
          <template #item="{ element: module, index }">
            <el-card class="module-card" shadow="hover" :class="{ error: hasModuleError(index) }">
              <!-- 使用 ref 函數動態設置每個模塊表單的引用 -->
              <el-form
                :model="module"
                :rules="formRules(module)"
                :ref="(el) => (moduleFormRefs[index] = el)"
              >
                <div
                  class="module-header"
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                  "
                >
                  <h4>{{ module.name || module.type }} 模塊</h4>
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="removeModule(index)"
                    size="small"
                  ></el-button>
                </div>

                <!-- 文字模塊------------------------------------------------- -->
                <template v-if="module.type === 'text'">
                  <el-form-item prop="content.text.value">
                    <el-input
                      v-model="module.content.text.value"
                      type="textarea"
                      :rows="4"
                      placeholder="輸入文字內容"
                      style="margin-bottom: 8px"
                    />
                  </el-form-item>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item prop="content.fontSize.value">
                        <el-input
                          v-model.number="module.content.fontSize.value"
                          type="number"
                          placeholder="字體大小"
                          :min="12"
                          :max="48"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="content.color.value">
                        <el-color-picker v-model="module.content.color.value" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="content.align.value">
                        <el-select v-model="module.content.align.value" placeholder="對齊方式">
                          <el-option label="左對齊" value="left" />
                          <el-option label="居中" value="center" />
                          <el-option label="右對齊" value="right" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <p
                    v-if="module.content.text.value"
                    :style="{
                      fontSize: module.content.fontSize.value + 'px',
                      color: module.content.color.value,
                      textAlign: module.content.align.value,
                    }"
                    style="margin-top: 8px"
                  >
                    {{ module.content.text.value }}
                  </p>
                </template>

                <!-- 圖片模塊------------------------------------------------------ -->
                <template v-else-if="module.type === 'image'">
                  <el-image
                    v-if="module.content.url.value"
                    :src="module.content.url.value"
                    :alt="module.content.alt.value"
                    style="max-width: 200px; margin-bottom: 8px"
                    fit="contain"
                  />
                  <!-- 圖片上傳功能（可根據實際後端上傳 API 調整） -->
                  <el-upload
                    action="#"
                    :http-request="(param) => uploadImage(param, module.id)"
                    :show-file-list="false"
                    accept="image/*"
                    style="margin-bottom: 8px"
                  >
                    <el-button type="primary">上傳圖片</el-button>
                  </el-upload>
                  <el-form-item prop="content.url.value">
                    <el-input
                      v-model="module.content.url.value"
                      placeholder="圖片 URL"
                      style="margin-bottom: 8px"
                    />
                  </el-form-item>
                  <el-form-item prop="content.alt.value">
                    <el-input v-model="module.content.alt.value" placeholder="圖片描述" />
                  </el-form-item>
                </template>

                <!-- 影片模塊 -------------------------------------------------->
                <template v-else-if="module.type === 'video'">
                  <video
                    v-if="module.content.url.value"
                    :src="module.content.url.value"
                    :autoplay="module.content.autoplay.value"
                    controls
                    style="max-width: 200px; margin-bottom: 8px"
                  />
                  <el-form-item prop="content.url.value">
                    <el-input
                      v-model="module.content.url.value"
                      placeholder="影片 URL"
                      style="margin-bottom: 8px"
                    />
                  </el-form-item>
                  <el-form-item prop="content.thumbnail.value">
                    <el-input
                      v-model="module.content.thumbnail.value"
                      placeholder="縮圖 URL"
                      style="margin-bottom: 8px"
                    />
                  </el-form-item>
                  <el-checkbox v-model="module.content.autoplay.value">自動播放</el-checkbox>
                </template>

                <!-- 自訂模塊（請根據你的實際需求擴展） -->
                <template v-else-if="module.type === 'custom'">
                  <el-form-item prop="content.customField.value">
                    <el-input v-model="module.content.customField.value" placeholder="自訂內容" />
                  </el-form-item>
                </template>

                <!-- 移除模塊按鈕現在移到 header 部分 -->
              </el-form>
            </el-card>
          </template>
          <template #footer>
            <el-empty v-if="!modules.length" description="請拖放模塊到這裡" />
          </template>
        </draggable>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import customButton from '@/components/custom-button.vue'
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, Delete } from '@element-plus/icons-vue' // 引入 Delete 圖標
import draggable from 'vuedraggable'
import { useUserStore } from '@/stores/user'
import pageService from '@/services/page' // 假設 pageService 包含 savePage 和 getPageByUserId
import apiService from '@/services/api' // 假設 apiService 是 axios 實例
import { useRoute } from 'vue-router'

// Vue Router 實例
const router = useRouter()
// 用戶狀態管理 (假設 useUserStore 提供了用戶 ID)
const userStore = useUserStore()

// 響應式數據
const pageTitle = ref('') // 網頁標題
const modules = ref([]) // 畫布上的模塊列表
const loading = ref(true) // 加載狀態
const errors = ref([]) // 後端返回的錯誤列表

// Element Plus 表單引用
const titleFormRef = ref(null) // 網頁標題表單引用
const moduleFormRefs = ref([]) // 模塊表單引用列表 (由 ref 函數動態設置)
const templateId = computed(() => route.params.projectId)
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 網頁標題驗證規則
const titleRules = {
  title: [{ required: true, message: '網頁標題不能為空', trigger: 'blur' }],
}

// 所有可用的模塊定義
const availableModules = [
  {
    type: 'text',
    name: '文字模塊',
    content: [
      { field: 'text', value: '', rules: ['required', 'max:200'] },
      { field: 'fontSize', value: 16, rules: ['min:12', 'max:48'] },
      { field: 'color', value: '#000000', rules: ['color'] },
      { field: 'align', value: 'left', rules: ['enum:left,center,right'] },
    ],
  },
  {
    type: 'image',
    name: '圖片模塊',
    content: [
      { field: 'url', value: '', rules: ['required', 'url'] },
      { field: 'alt', value: '', rules: [] },
      // 移除 width/height，因為後端 Schema 中沒有定義這些字段
      // { field: 'width', value: 300, rules: ['min:100'] },
      // { field: 'height', value: 200, rules: ['min:100'] },
    ],
  },
  {
    type: 'video',
    name: '影片模塊',
    content: [
      { field: 'url', value: '', rules: ['required', 'url'] },
      { field: 'autoplay', value: false, rules: [] },
      { field: 'thumbnail', value: '', rules: ['url'] },
    ],
  },
  {
    type: 'custom',
    name: '自訂模塊',
    content: [{ field: 'customField', value: '', rules: ['required'] }],
  },
]

/**
 * 將模塊內容陣列轉換為物件映射，方便前端綁定
 * 例: [{ field: 'text', value: 'abc' }] => { text: { value: 'abc', rules: [] } }
 */
const mapContentArrayToObject = (contentArray) => {
  const obj = {}
  contentArray.forEach((item) => {
    // 進行深拷貝以避免引用問題，並確保規則也複製過來
    obj[item.field] = JSON.parse(JSON.stringify(item))
  })
  return obj
}

/**
 * 將模塊內容物件映射轉換回陣列，用於發送給後端
 * 例: { text: { value: 'abc', rules: [] } } => [{ field: 'text', value: 'abc', rules: [] }]
 */
const mapContentObjectToArray = (contentObject) => {
  const arr = []
  for (const field in contentObject) {
    // 只傳遞 field, value, rules 給後端 (如果 rules 是必須的話)
    const { value, rules } = contentObject[field]
    arr.push({ field, value, rules })
  }
  return arr
}

/**
 * 拖曳模塊時創建新模塊的克隆函數
 */
const cloneModule = (original) => {
  const cloned = JSON.parse(JSON.stringify(original))
  // 為新模塊生成唯一 ID，確保 draggable item-key 的唯一性
  cloned.id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
  // 將 availableModules 的 content 陣列格式轉換為物件格式，方便 v-model 綁定
  cloned.content = mapContentArrayToObject(original.content)
  return cloned
}

/**
 * 移除畫布上的模塊
 */
const removeModule = (index) => {
  modules.value.splice(index, 1)
  // 移除對應的表單引用
  moduleFormRefs.value.splice(index, 1)
}

/**
 * 動態生成模塊表單的驗證規則
 */
const formRules = (module) => {
  const moduleRules = {}
  for (const fieldKey in module.content) {
    const item = module.content[fieldKey]
    const fieldRules = []

    item.rules.forEach((rule) => {
      if (rule === 'required') {
        fieldRules.push({ required: true, message: `${item.field} 為必填項`, trigger: 'blur' })
      } else if (rule.startsWith('max:')) {
        const max = parseInt(rule.split(':')[1], 10)
        fieldRules.push({
          validator: (r, val, callback) => {
            if (
              (typeof val === 'string' && val.length > max) ||
              (typeof val === 'number' && val > max)
            ) {
              callback(new Error(`${item.field} 超過最大值 ${max}`))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        })
      } else if (rule.startsWith('min:')) {
        const min = parseInt(rule.split(':')[1], 10)
        fieldRules.push({
          validator: (r, val, callback) => {
            if (
              (typeof val === 'string' && val.length < min) ||
              (typeof val === 'number' && val < min)
            ) {
              callback(new Error(`${item.field} 低於最小值 ${min}`))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        })
      } else if (rule === 'url') {
        fieldRules.push({ type: 'url', message: `${item.field} 必須是有效的 URL`, trigger: 'blur' })
      } else if (rule === 'color') {
        fieldRules.push({
          validator: (r, val, callback) => {
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            if (val && !colorRegex.test(val)) {
              callback(new Error(`${item.field} 必須是有效的顏色代碼 (例如 #RRGGBB)`))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        })
      } else if (rule.startsWith('enum:')) {
        const allowedValues = rule.substring(5).split(',')
        fieldRules.push({
          validator: (r, val, callback) => {
            if (val !== undefined && val !== null && !allowedValues.includes(String(val))) {
              callback(new Error(`${item.field} 的值必須是 ${allowedValues.join(', ')} 之一`))
            } else {
              callback()
            }
          },
          trigger: 'change', // 對於下拉選擇框使用 change 觸發
        })
      }
    })
    // Element Plus 的 prop 路徑格式: 'content.fieldKey.value'
    moduleRules[`content.${fieldKey}.value`] = fieldRules
  }
  return moduleRules
}

/**
 * 檢查指定模塊是否有錯誤
 */
const hasModuleError = (moduleIndex) => {
  return errors.value.some((err) => err.moduleIndex === moduleIndex)
}

/**
 * 處理圖片上傳（這裡只是一個模擬，需要連接實際的上傳服務）
 */
const uploadImage = (param, moduleId) => {
  ElMessage.info(`模擬上傳圖片: ${param.file.name} 到模塊 ID: ${moduleId}`)
  // 這裡應該呼叫後端上傳 API，獲取圖片 URL 後更新模塊的 content.url.value
  // const module = modules.value.find(m => m.id === moduleId);
  // if (module) {
  //   module.content.url.value = 'YOUR_UPLOADED_IMAGE_URL';
  // }
}

/**
 * 保存網頁數據到後端
 */
const savePage = async () => {
  // 清除之前的後端錯誤
  errors.value = []

  try {
    // 驗證網頁標題表單
    const isTitleValid = await titleFormRef.value.validate()
    if (!isTitleValid) {
      ElMessage.error('請檢查網頁標題')
      return
    }

    // 驗證所有模塊表單
    const moduleValidationPromises = modules.value.map(async (module, index) => {
      const formRef = moduleFormRefs.value[index]
      if (formRef) {
        return await formRef.validate()
      }
      return true // 如果沒有表單引用，視為有效 (理論上不會發生)
    })

    const allModulesValid = await Promise.all(moduleValidationPromises)
    // 如果任何一個模塊表單驗證失敗，則停止保存
    if (allModulesValid.some((isValid) => !isValid)) {
      ElMessage.error('請檢查模塊表單中的錯誤')
      return
    }

    // 將 modules 數據從 contentMap 格式轉換回後端所需的 content 陣列格式
    const modulesForBackend = modules.value.map((mod) => {
      const { id, content, ...rest } = mod // 排除前端使用的 'id'
      return {
        ...rest,
        content: mapContentObjectToArray(content), // 轉換 content 物件為陣列
      }
    })

    // 調用後端服務保存網頁
    // await pageService.savePage(userStore.id, {
    //   title: pageTitle.value,
    //   modules: modulesForBackend,
    // })

    // const templateId = route.params.id
    // console.log('Request URL:', `/pages/${templateId}`)
    // await pageService.savePage(templateId, pageData)
    // console.log('BaseURL:', pageService.apiAuth.defaults.baseURL)

    ElMessage.success('網頁已保存')
    // router.push(`/project/${userStore.id}`) // 導航到項目頁面
    router.push('/')
  } catch (error) {
    console.error('保存網頁錯誤:', error)
    // 處理後端返回的結構化錯誤
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors // 儲存後端錯誤
      error.response.data.errors.forEach((err) => {
        // 根據錯誤結構顯示更詳細的訊息
        const moduleInfo = err.moduleIndex !== undefined ? `模塊 ${err.moduleIndex + 1}` : ''
        ElMessage.error(`${moduleInfo} ${err.field ? err.field + ':' : ''} ${err.message}`)
      })
    } else {
      ElMessage.error(error.response?.data?.error || '無法保存網頁')
    }
  }
}

/**
 * 從後端加載現有網頁數據
 */
const loadPage = async () => {
  loading.value = true
  try {
    const response = await pageService.getPageByTemplateId(templateId.id)
    pageTitle.value = response.data.title
    modules.value = response.data.modules.map((mod) => {
      // 為每個從後端獲取的模塊生成前端使用的 ID
      // 並將 content 陣列轉換為 contentMap 物件格式
      return {
        ...mod,
        id: mod._id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        content: mapContentArrayToObject(mod.content),
      }
    })
    errors.value = [] // 清除之前的錯誤
  } catch (e) {
    ElMessage.error('加載網頁失敗: ' + (e.response?.data?.error?.message || e.message))
    pageTitle.value = ''
    modules.value = []
  } finally {
    loading.value = false
    // 等待 DOM 更新後，確保 moduleFormRefs 能夠正確收集到表單引用
    await nextTick()
  }
}

// 組件掛載時加載網頁數據
onMounted(() => {
  loadPage()
})
</script>

<style scoped>
.el-aside {
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e0e0e0;
}
.el-main {
  background-color: #000000;
}
.el-card {
  border-radius: 8px;
}
.module-item {
  cursor: grab;
  margin-bottom: 8px;
  background-color: #000000;
  border: 1px solid #939597;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 輕微陰影 */
  border-radius: 4px;
}
.module-item:hover {
  /* 覆蓋 Element Plus 的預設 hover 藍色，並保持文字為白色 */
  color: #ffffff !important;
  border-color: #f0efe9; /* 將邊框顏色改為與輸入框一致的黃色 */
  text-shadow: 2px 2px 5px #ffffff;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))
    drop-shadow(0 0 12px rgba(255, 255, 255, 0.7)); /* 增強光暈 */
  /* 移除背景色，改用下方的 ::after 偽元素來實現下劃線效果 */
  background-color: transparent !important;
}
.canvas {
  background-color: #000000;
  border-radius: 8px;
  min-height: 500px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.module-card {
  margin-bottom: 16px;
  border: 1px solid rgba(245, 223, 77, 1);
  border-radius: 8px;
  transition: all 0.3s ease;
}
.module-card.error {
  border-color: #f56c6c; /* 錯誤時邊框變紅 */
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.4);
}
.module-card:hover {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
.el-form-item {
  margin-bottom: 18px; /* 增加表單項間距 */
}
.el-input,
.el-select,
.el-color-picker {
  width: 100%; /* 確保表單控件佔滿寬度 */
}
video,
.el-image {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
