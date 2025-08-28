<template>
  <el-container style="height: 100vh;">
    <!-- 左邊模塊導覽列 -->
    <el-aside width="240px" style="background: #f4f4f4; padding: 16px;">
      <el-card shadow="always">
        <template #header>
          <h3>模塊工具</h3>
        </template>
        <el-menu>

          <el-menu-item v-for="module in availableModules"
          :key="module.type"
          class="module-item">

            <draggable
            v-model="modules"
            group="modules" item-key="id"
            class="canvas"
            style="min-height: 500px; border: 1px dashed #ccc; padding: 16px;">

              <template #item="{ element: module, index }">
                <el-card class="module-card" shadow="hover" :class="{ 'error': hasError(index) }">
                  <!-- 模塊內容 -->
                </el-card>
              </template>
            </draggable>
          </el-menu-item>
        </el-menu>
      </el-card>
    </el-aside>
  <!-- 右邊拖曳儲存葉面 -->
    <!-- <el-main style="padding: 16px;">
      <el-card shadow="always">
        <template #header>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form :model="{ title: pageTitle }" :rules="titleRules" ref="titleForm">
                <el-form-item prop="title">
                  <el-input v-model="pageTitle" placeholder="輸入網頁標題" clearable />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <el-button type="primary" @click="savePage">保存網頁</el-button>
            </el-col>
          </el-row>
        </template>
        <div v-if="loading" class="canvas" style="min-height: 500px; display: flex; justify-content: center; align-items: center;">
          <el-icon :size="40" class="is-loading"><Loading /></el-icon>
        </div>
        <draggable v-else v-model="modules" group="modules" item-key="id" class="canvas" style="min-height: 500px; border: 1px dashed #ccc; padding: 16px;">
          <template #item="{ element: module, index }">
            <el-card class="module-card" shadow="hover" :class="{ 'error': hasError(index) }">
              <el-form :model="module" :rules="formRules(module)" :ref="`formRef${index}`">
                <template v-if="module.type === 'text'">
                  <el-form-item prop="content.find(c => c.field === 'text').value">
                    <el-input
                      v-model="module.content.find(c => c.field === 'text').value"
                      type="textarea"
                      :rows="4"
                      placeholder="輸入文字內容"
                      style="margin-bottom: 8px;"
                    />
                  </el-form-item>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item prop="content.find(c => c.field === 'fontSize').value">
                        <el-input
                          v-model.number="module.content.find(c => c.field === 'fontSize').value"
                          type="number"
                          placeholder="字體大小"
                          :min="12"
                          :max="48"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="content.find(c => c.field === 'color').value">
                        <el-color-picker v-model="module.content.find(c => c.field === 'color').value" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="content.find(c => c.field === 'align').value">
                        <el-select v-model="module.content.find(c => c.field === 'align').value" placeholder="對齊方式">
                          <el-option label="左對齊" value="left" />
                          <el-option label="居中" value="center" />
                          <el-option label="右對齊" value="right" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <p
                    v-if="module.content.find(c => c.field === 'text').value"
                    :style="{ fontSize: module.content.find(c => c.field === 'fontSize').value + 'px', color: module.content.find(c => c.field === 'color').value, textAlign: module.content.find(c => c.field === 'align').value }"
                    style="margin-top: 8px;"
                  >
                    {{ module.content.find(c => c.field === 'text').value }}
                  </p>
                </template>
                <template v-else-if="module.type === 'image'">
                  <el-image
                    v-if="module.content.find(c => c.field === 'url').value"
                    :src="module.content.find(c => c.field === 'url').value"
                    :alt="module.content.find(c => c.field === 'alt').value"
                    style="max-width: 200px; margin-bottom: 8px;"
                    fit="contain"
                  />
                  <el-upload
                    action="#"
                    :http-request="(param) => uploadImage(param, module.id)"
                    :show-file-list="false"
                    accept="image/*"
                    style="margin-bottom: 8px;"
                  >
                    <el-button type="primary">上傳圖片</el-button>
                  </el-upload>
                  <el-form-item prop="content.find(c => c.field === 'url').value">
                    <el-input
                      v-model="module.content.find(c => c.field === 'url').value"
                      placeholder="圖片 URL"
                      style="margin-bottom: 8px;"
                    />
                  </el-form-item>
                  <el-form-item prop="content.find(c => c.field === 'alt').value">
                    <el-input
                      v-model="module.content.find(c => c.field === 'alt').value"
                      placeholder="圖片描述"
                    />
                  </el-form-item>
                </template>
                <template v-else-if="module.type === 'video'">
                  <video
                    v-if="module.content.find(c => c.field === 'url').value"
                    :src="module.content.find(c => c.field === 'url').value"
                    :autoplay="module.content.find(c => c.field === 'autoplay').value"
                    controls
                    style="max-width: 200px; margin-bottom: 8px;"
                  />
                  <el-form-item prop="content.find(c => c.field === 'url').value">
                    <el-input
                      v-model="module.content.find(c => c.field === 'url').value"
                      placeholder="影片 URL"
                      style="margin-bottom: 8px;"
                    />
                  </el-form-item>
                  <el-form-item prop="content.find(c => c.field === 'thumbnail').value">
                    <el-input
                      v-model="module.content.find(c => c.field === 'thumbnail').value"
                      placeholder="縮圖 URL"
                      style="margin-bottom: 8px;"
                    />
                  </el-form-item>
                  <el-checkbox v-model="module.content.find(c => c.field === 'autoplay').value">自動播放</el-checkbox>
                </template>
                <template v-else-if="module.type === 'custom'">
                  <el-form-item v-for="(item, idx) in module.content" :key="idx" :prop="`content[${idx}].value`">
                    <el-input
                      v-model="item.value"
                      :placeholder="`輸入 ${item.field}`"
                      style="margin-bottom: 8px;"
                    />
                  </el-form-item>
                </template>
                <el-button type="danger" @click="removeModule(index)" style="margin-top: 8px;">
                  移除模塊
                </el-button>
              </el-form>
            </el-card>
          </template>
          <template #footer>
            <el-empty v-if="!modules.length" description="請拖放模塊到這裡" />
          </template>
        </draggable>
      </el-card>
    </el-main> -->
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Loading, CollectionTag } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { useUserStore } from '@/stores/user';
import pageService from '@/services/page';

const router = useRouter();
const userStore = useUserStore();

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
      { field: 'width', value: 300, rules: ['min:100'] },
      { field: 'height', value: 200, rules: ['min:100'] },
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
    content: [
      { field: 'customField', value: '', rules: ['required'] },
    ],
  }
]

const modules = ref([]);
const loading = ref(true);
const errors = ref([]);

const titleRules = {
  title: [{ required: true, message: '標題不能為空', trigger: 'blur' }],
};

const formRules = (module) => {
  const rules = {};
  module.content.forEach((item, idx) => {
    const ruleArray = [];
    if (item.rules.includes('required')) {
      ruleArray.push({ required: true, message: `${item.field} 為必填項`, trigger: 'blur' });
    }
    if (item.rules.some((r) => r.startsWith('max:'))) {
      const max = parseInt(item.rules.find((r) => r.startsWith('max:')).split(':')[1], 10);
      ruleArray.push({ max, message: `${item.field} 長度不能超過 ${max} 字元`, trigger: 'blur' });
    }
    if (item.rules.some((r) => r.startsWith('min:'))) {
      const min = parseInt(item.rules.find((r) => r.startsWith('min:')).split(':')[1], 10);
      ruleArray.push({ min, message: `${item.field} 長度不能少於 ${min} 字元`, trigger: 'blur' });
    }
    if (item.rules.includes('url')) {
      ruleArray.push({ type: 'url', message: `${item.field} 必須是有效的 URL`, trigger: 'blur' });
    }
    if (item.rules.includes('color')) {
      ruleArray.push({
        pattern: /^#[0-9A-Fa-f]{6}$/,
        message: `${item.field} 必須是有效的 HEX 顏色碼`,
        trigger: 'blur',
      });
    }
    if (item.rules.some((r) => r.startsWith('enum:'))) {
      const options = item.rules.find((r) => r.startsWith('enum:')).split(':')[1].split(',');
      ruleArray.push({
        validator: (rule, value, callback) => {
          if (!options.includes(value)) {
            callback(new Error(`${item.field} 必須是 ${options.join(' 或 ')} 之一`));
          } else {
            callback();
          }
        },
        trigger: 'change',
      });
    }
    rules[`content[${idx}].value`] = ruleArray;
  });
  return rules;
};

const hasError = (moduleIndex) => {
  return errors.value.some((err) => err.moduleIndex === moduleIndex);
};


const cloneModule = (module) => ({
  ...module,
  id: Date.now() + Math.random(),
  order: modules.value.length,
});

const removeModule = (index) => {
  modules.value.splice(index, 1);
  modules.value.forEach((m, i) => (m.order = i));
};

const uploadImage = async (param, moduleId) => {
  try {
    const { data } = await pageService.uploadImage(param.file, userStore.id);
    const module = modules.value.find((m) => m.id === moduleId);
    if (module && data.data && data.data.modules) {
      const uploadedUrl = data.data.modules[0].content.find((c) => c.field === 'url')?.value;
      if (uploadedUrl) {
        module.content.find((c) => c.field === 'url').value = uploadedUrl;
      }
    }
    ElMessage.success('圖片上傳成功');
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '圖片上傳失敗');
  }
};

const loadPage = async () => {
  try {
    if (!userStore.id) {
      ElMessage.error('請先登錄');
      router.push('/login');
      return;
    }
    const { data } = await pageService.getByUserId(userStore.id);
    if (data.data) {
      pageTitle.value = data.data.title || '我的個人網頁';
      modules.value = data.data.modules.map((m, i) => ({
        ...m,
        id: m._id || Date.now() + Math.random(),
        order: m.order ?? i,
      }));
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '無法載入網頁數據');
  } finally {
    loading.value = false;
  }
};

const savePage = async () => {
  try {
    // 驗證標題和模塊表單
    await Promise.all([
      new Promise((resolve, reject) => {
        this.$refs.titleForm.validate((valid) => (valid ? resolve() : reject()));
      }),
      ...modules.value.map((_, i) =>
        new Promise((resolve, reject) => {
          this.$refs[`formRef${i}`][0].validate((valid) => (valid ? resolve() : reject()));
        })
      ),
    ]);
    if (!userStore.id) {
      ElMessage.error('請先登錄');
      router.push('/login');
      return;
    }
    errors.value = [];
    const response = await pageService.save(userStore.id, {
      title: pageTitle.value,
      modules: modules.value.map(({ id, ...rest }) => rest),
      partialUpdate: false,
    });
    ElMessage.success('網頁已保存');
    router.push(`/project/${userStore.id}`);
  } catch (error) {
    const errorData = error.response?.data?.error;
    if (Array.isArray(errorData)) {
      errors.value = errorData;
      errorData.forEach((err) => ElMessage.error(err.error));
    } else {
      ElMessage.error(errorData || '無法保存網頁');
    }
  }
};

onMounted(loadPage);

</script>

<route lang="yaml">
meta:
  title: '編輯項目'
  requiresAuth: false
</route>


<style scoped>
.canvas {
  background: #f9f9f9;
  border-radius: 8px;
}
.module-card {
  margin-bottom: 16px;
  cursor: move;
  transition: border 0.3s;
}
.module-card.error {
  border: 2px solid #f56c6c;
}
.module-item .draggable-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: move;
}
.module-item .draggable-item:hover {
  background: #f5f7fa;
}
</style>


