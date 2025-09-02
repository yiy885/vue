// 📁 components/GlobalLoading.vue
<template>
  <transition name="loading-fade">
    <div v-if="visible" class="global-loading-overlay">
      <div class="loading-content">
        <div class="loading-logo">{{ logo }}</div>
        <div class="loading-title">{{ title }}</div>
        <div class="loading-subtitle">{{ message }}</div>

        <!-- 使用 Element Plus 進度條 -->
        <el-progress
          :percentage="progress"
          :stroke-width="8"
          :show-text="false"
          color="#ffffff"
          style="margin: 20px 0;">
        </el-progress>

        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  message: {
    type: String,
    default: '正在加載...'
  },
  title: {
    type: String,
    default: '加載中'
  },
  logo: {
    type: String,
    default: '🚀'
  }
})

const emit = defineEmits(['loaded'])

// 當進度達到100%時觸發完成事件
computed(() => {
  if (props.progress >= 100) {
    setTimeout(() => emit('loaded'), 500)
  }
})
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 50px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  min-width: 300px;
}

.loading-logo {
  font-size: 64px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.loading-title {
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.loading-subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 30px;
}

.progress-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-top: 10px;
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

// 📁 components/LoadingButton.vue
<template>
  <el-button
    :type="type"
    :size="size"
    :loading="isLoading"
    @click="handleClick"
    :disabled="disabled">
    <el-icon v-if="icon && !isLoading" style="margin-right: 5px;">
      <component :is="icon" />
    </el-icon>
    {{ isLoading ? loadingText : text }}
  </el-button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  loadingText: {
    type: String,
    default: '加載中...'
  },
  type: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'default'
  },
  icon: String,
  disabled: Boolean,
  loadingDuration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['click', 'loading-start', 'loading-end'])

const isLoading = ref(false)

const handleClick = async () => {
  isLoading.value = true
  emit('loading-start')
  emit('click')

  setTimeout(() => {
    isLoading.value = false
    emit('loading-end')
  }, props.loadingDuration)
}
</script>

// 📁 components/ContentLoading.vue
<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
    :element-loading-spinner="spinner"
    :element-loading-background="background"
    :style="{
      minHeight: minHeight,
      borderRadius: '8px',
      background: contentBackground
    }"
    class="content-loading-wrapper">
    <slot v-if="!loading"></slot>
    <div v-else-if="placeholder" class="loading-placeholder">
      {{ placeholder }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '正在加載內容...'
  },
  minHeight: {
    type: String,
    default: '200px'
  },
  spinner: String,
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.8)'
  },
  contentBackground: {
    type: String,
    default: 'transparent'
  },
  placeholder: String
})
</script>

<style scoped>
.content-loading-wrapper {
  transition: all 0.3s ease;
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
  font-style: italic;
}
</style>

// 📁 components/TableLoading.vue
<template>
  <div class="table-loading-container">
    <div class="table-header" v-if="$slots.header || showRefresh">
      <slot name="header">
        <el-button
          @click="handleRefresh"
          :loading="loading"
          icon="Refresh">
          {{ refreshText }}
        </el-button>
      </slot>
    </div>

    <el-table
      :data="data"
      v-loading="loading"
      :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :empty-text="emptyText"
      style="width: 100%"
      v-bind="$attrs">
      <slot></slot>

      <!-- 默認列定義 -->
      <template v-if="!$slots.default">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width">
          <template #default="scope" v-if="column.type === 'tag'">
            <el-tag :type="getTagType(scope.row[column.prop])">
              {{ scope.row[column.prop] }}
            </el-tag>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  loadingText: {
    type: String,
    default: '正在加載表格數據...'
  },
  emptyText: {
    type: String,
    default: '暫無數據'
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  refreshText: {
    type: String,
    default: '刷新'
  },
  columns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['refresh'])

const handleRefresh = () => {
  emit('refresh')
}

const getTagType = (status) => {
  const statusMap = {
    '在線': 'success',
    '離線': 'info',
    '忙碌': 'warning',
    '故障': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.table-loading-container {
  width: 100%;
}

.table-header {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>


