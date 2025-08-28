
<template>
  <!-- <div class="flex flex-wrap items-center mb-4">
    <el-button size="large">Large</el-button>
    <el-button>Default</el-button>
    <el-button size="small">Small</el-button>
    <el-button size="large" :icon="Search">Search</el-button>
    <el-button :icon="Search">Search</el-button>
    <el-button size="small" :icon="Search">Search</el-button>
  </div> -->
  <div>
    <!-- <el-button size="large" round>Large</el-button>
    <el-button round>Default</el-button>
    <el-button  :icon="Plus" size="small" round>Small</el-button> -->
    <el-button
    :size="size"
    :type="type"
    :round="round"
    :icon="icon"
    :loading="loading"
    :native-type="nativeType"
    :style="{ width: '100%', height, backgroundColor, color: textColor }"
    @click="onClick"
    >

      <slot />
    </el-button>
    <!-- <el-button :icon="Search" round>Search</el-button>
    <el-button size="small" :icon="Search" round>Search</el-button> -->
  </div>

  <!-- 圓形icon -->
  <!-- <div class="flex flex-wrap items-center">
    <el-button :icon="Search" size="large" circle />
    <el-button :icon="Search" circle />
    <el-button :icon="Search" size="small" circle />
  </div> -->
</template>

<script setup lang="ts">
import { Plus, Search } from '@element-plus/icons-vue'

defineProps({
  size: { type: String, default: 'large' },   // el-button 的 size: large / default / small
  type: { type: String, default: 'primary' }, // primary / success / warning / danger / info / text
  round: { type: Boolean, default: true },    // 圓角
  height: { type: String, default: '' },       // ex: "260px"
  backgroundColor: { type: String, default: '' }, // 自訂背景色
  textColor: { type: String, default: '' },   // 自訂文字顏色
       // Element Plus icon component e.g. :icon="Search"
  icon: { type: Object, default:null },
  loading: { type: Boolean, default: false },
  nativeType: { type: String, default: 'button' } // native button type: button / submit / reset
})

const emit = defineEmits(['click'])
const onClick = (evt: MouseEvent) => {
  emit('click', evt)
}

</script>

<style lang="scss">
.el-button{
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 輕微陰影 */
  border: 1px solid #939597;
}

/* Hover 效果 */
.el-button:hover,
.el-button:focus
{
  /* 覆蓋 Element Plus 的預設 hover 藍色，並保持文字為白色 */
  color: #ffffff !important;
  border-color: #f0efe9; /* 將邊框顏色改為與輸入框一致的黃色 */
  text-shadow: 2px 2px 5px #ffffff;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.7)); /* 增強光暈 */
  /* 移除背景色，改用下方的 ::after 偽元素來實現下劃線效果 */
  background-color: transparent !important;
}

/* Active 效果 */
.el-button:active,
.el-button.is-active {
  background-color: rgba(0, 0, 0, 0.5); /* 按下時深灰色背景 */
  color: #ffffff !important; /* 保持白色文字 */
  text-shadow: 2px 2px 5px #ffffff; /* 保留光暈效果 */
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.7));
  border-color: #F5DF4D; /* 按下時也保持黃色邊框 */
}

</style>
