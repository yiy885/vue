<template>
    <el-container style="height: 100vh;">
    <!-- 左邊模塊導覽列 -->
      <el-aside width="240px" style="background: #141414; padding: 16px;">
        <el-card shadow="always">
          <template #header>
            <h3>模塊工具</h3>
          </template>
          <el-menu>
            <draggable :list="availableModules" :group="'modules'" :clone="cloneModule" item-key="type" :sort="false">
              <template #item="{ element: module }">
                <el-menu-item class="module-item">
                  <span>{{ module.name }}</span>
                </el-menu-item>
              </template>
            </draggable>
          </el-menu>
        </el-card>
      </el-aside>
    <!-- <el-aside width="240px" style="background: #141414; padding: 16px;">
        <el-card shadow="always">
          <template #header>
            <h3>模塊工具</h3>
          </template> -->
          <!-- 這裡不用 draggable，只是清單 -->
          <!-- <el-menu>
            <el-menu-item
            v-for="module in availableModules"
            :key="module.type"
            class="module-item">

            {{ module.name }}

              <draggable v-model="modules"
              :group="modules"
              item-key="id"
                class="canvas"
                style="min-height: 500px; border: 1px dashed #ccc; padding: 16px;">

                <template #item="{ element: module, index }">
                  <el-card class="module-card" shadow="hover" :class="{ 'error': hasError(index) }"> -->
                    <!-- 模塊內容 -->
                  <!-- </el-card>
                </template>
              </draggable>

            </el-menu-item>

          </el-menu>
        </el-card>
      </el-aside> -->


      <!-- 右邊拖曳儲存葉面 -->
    <el-main style="padding: 16px;">
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


              <!-- 文字模塊------------------------------------------------- -->
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

                <!-- 圖片模塊------------------------------------------------------ -->
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

                <!-- 影片模塊 -------------------------------------------------->
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

                <!-- 移除模塊 ------------------------------------------------------>
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
    </el-main>
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

// onMounted(loadPage);

</script>
