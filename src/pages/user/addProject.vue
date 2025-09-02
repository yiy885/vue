<template>
  <el-container class="project-container">
    <el-main>
      <el-dialog
        v-model="showDialog"
        title="創建新專案"
        width="60%"
        :before-close="handleBeforeClose"
        top="30vh"
      >
        <!-- 根據 activeStep 動態顯示內容 -->

        <div class="dialog-content">
          <template v-if="activeStep === 0">
            <p>成功的專案即使是過程也充滿了故事性，</p>
            <p>在這裡留下你的想法!</p>
            <p class="mt-4 text-sm text-gray-500">（請先填寫專案基本資訊，然後會進入網頁編輯器）</p>
          </template>
        <!-- 第二步驟內容 -->
        <template v-else-if="activeStep === 1">
          <el-form :model="formValues" :rules="rules" ref="formRef" label-width="120px">
              <!-- 專案名稱 -->
              <el-form-item label="專案名稱" prop="name">
                <el-input v-model="name.value.value" placeholder="請輸入專案名稱" />
                <div style="color: red">{{ name.errorMessage }}</div>
              </el-form-item>

              <!-- 專案簡介 -->
              <el-form-item label="專案簡介" prop="description">
                <el-input
                  type="textarea"
                  v-model="description.value.value"
                  placeholder="請輸入專案簡介"
                  :rows="3"
                />
                <div style="color: red">{{ description.errorMessage }}</div>
              </el-form-item>

              <!-- 創建者 -->
              <el-form-item label="創建者" prop="createdBy">
                <el-input v-model="createdBy.value.value" placeholder="請輸入創建者" />
                <div style="color: red">{{ createdBy.errorMessage }}</div>
              </el-form-item>

              <!-- 專案類別 -->
              <!-- prop="category" element plus內建表單驗證 -->
              <el-form-item label="專案類別">
                <el-select
                v-model="category.value.value"
                placeholder="請選擇類別">
                  <el-option
                    v-for="opt in categoryOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <!-- <div style="color: red">{{ category.errorMessage }}</div> -->
              </el-form-item>

              <!-- 預視圖 -->
              <el-form-item label="專案預視圖" prop="previewImage" :error="previewImage.errorMessage.value">
                <el-upload
                  ref="uploadRef"
                  v-model:file-list="fileList"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit="1"
                  :accept="'image/jpeg,image/png'"
                  :on-change="handleFileChange"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :show-file-list="true"
                  :aria-label="'上傳專案預視圖'"
                  aria-describedby="upload-tip"
                >
                  <el-icon v-if="fileList.length === 0" ><Plus /></el-icon>
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="預視圖" />
                      <span class="el-upload-list__item-actions">
                        <span
                          v-if="!isSubmitting"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                  <template #tip>
                    <div id="upload-tip" class="el-upload__tip">
                      僅支援 JPEG/PNG 格式，檔案大小不得超過 1MB，建議上傳正方形圖片
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <!-- <el-form-item label="預視圖" prop="previewImage">
                <VueFileAgent
                  ref="fileAgent"
                  v-model="fileRecords"
                  v-model:raw-model-value="rawFileRecords"
                  accept="image/jpeg,image/png"
                  deletable
                  :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
                  help-text="選擇或拖拽檔案"
                  max-size="1MB"
                  @change="updatePreviewImage"
                />
                <div style="color: red">{{ previewImage.errorMessage }}</div>
              </el-form-item> -->
            </el-form>
            </template>
          <!-- 步驟 2 -->
            <!-- <template v-else-if="activeStep === 2">
              <div>
                <h3>完成填寫！</h3>
                <pre>{{  }}</pre>
              </div>
            </template> -->
        </div>

        <template #footer>
          <el-button @click="prevStep" v-if="activeStep > 0" :disabled="isSubmitting" >返回上一步</el-button>
          <el-button v-if="activeStep === 1" @click="goHome">沒有要新增，回首頁</el-button>
          <el-button v-if="activeStep < 2" @click="nextStep" :disabled="isSubmitting">下一步</el-button>


          <el-button v-if="activeStep === 2" @click="submit"  :disabled="isSubmitting" :loading="isSubmitting"  :underline="false">提交</el-button>


        </template>
      </el-dialog>

      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="步驟 1" description="創建新專案" />
        <el-step title="步驟 2" description="設定專案參數" />
        <el-step title="步驟 3" description="儲存並提交" />

      </el-steps>
    </el-main>
  </el-container>
</template>

<script setup>
import * as yup from 'yup'
import { useField,useForm } from 'vee-validate';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElUpload, ElOption, ElInput, ElSelect, ElForm, ElFormItem, ElButton, ElSteps, ElStep, ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus';
import 'vue-file-agent/dist/vue-file-agent.css';
import projectService from '@/services/project';
import { useUserStore } from '@/stores/user'
import { Plus, Delete } from '@element-plus/icons-vue';

const createSnackbar = (text, type = 'success') => ElMessage({ message: text, type })
const router = useRouter();
const showDialog = ref(true);
const activeStep = ref(0);
const fileList = ref([])

const categoryOptions = [
  { label: '動態影片類型', value: '動態影片類型' },
  { label: '靜態影像類型', value: '靜態影像類型' },
  { label: '平面設計類型', value: '平面設計類型' },
  { label: '其他', value: '其他' },
];

  // 關閉對話框前的處理elment plus表單規則 這邊用了validate所以不用
  const rules = {
    name: [
      { required: true, message: '專案名稱是必填的', trigger: 'blur' },
      { min: 1, max: 15, message: '名稱長度需在 1 到 15 個字之間', trigger: 'blur' },
    ],
    description: [
      { required: true, mes0sage: '專案簡介是必填的', trigger: 'blur' },
      { min: 1, max: 500, message: '描述長度需在 1 到 500 個字之間', trigger: 'blur' },
    ],
    createdBy: [{ required: true, message: '創建者是必填的', trigger: 'blur' }],
    category: [{ required: true, message: '請選擇專案類別', trigger: 'change' }],
    previewImage: [{ required: true, message: '請上傳專案預視圖，盡量為正方形比例', trigger: 'change' }],
  };

const categoryValues = categoryOptions.map(opt => opt.value);
const { handleSubmit, resetForm, values: formValues , validateField } = useForm({
 validationSchema: yup.object({
  name:yup
  .string()
  .required('專案名稱是必填的')
  .min(1, '名稱長度需在 1 到 15 個字之間')
  .max(15, '名稱長度需在 1 到 15 個字之間'),

  description: yup
  .string()
  .required('專案簡介是必填的')
  .min(1, '描述長度需在 1 到 500 個字之間')
  .max(500, '描述長度需在 1 到 500 個字之間'),

  category:yup
  .string()
  .required('分類是必填的')
  .oneOf(categoryValues,'請選擇有效的專案類別'),

  createdBy: yup
  .string()
  .required('創建者是必填的'),

  previewImage: yup
  .string()
  .required('請上傳專案預視圖，盡量為正方形比例'),

  }),
  //Formik (React) 或 一些表單套件裡面
  initialValues: {
    name: '',
    description: '',
    createdBy: '',
    category: '',
    previewImage: '',
  },
 })
const formRef = ref(null);
const name = useField('name')
const description = useField('description')
const createdBy = useField('createdBy')
const category = useField('category')
const previewImage = useField('previewImage')
const fileRecords =ref([])
// const rawFileRecords = ref([])
const uploadRef = ref(null); // 用於操作 el-upload 元件
const isSubmitting = ref(false); // 控制提交狀態
const dialogVisible = ref(false)
const previewImageUrl = ref('')
const userStore = useUserStore()





onMounted(() => {
  showDialog.value = true;
});




const handlePictureCardPreview = (file) => {
  // 圖片預覽邏輯保持不變
  previewImageUrl.value = file.url;
  previewDialogVisible.value = true;
};

const handleRemove = (file) => {
  // 移除檔案
  fileList.value = fileList.value.filter(f => f.uid !== file.uid);
  previewImage.value.value = ''; // 清空表單驗證值
  if (uploadRef.value) {
    uploadRef.value.clearFiles(); // 清空上傳元件的檔案列表
  }
  ElNotification({
    title: '提示',
    message: '圖片已移除，請重新上傳新圖片',
    type: 'info',
  });
  // 觸發表單驗證
  validateField('previewImage');
};

const handleExceed = () => {
  ElNotification({
    title: '錯誤',
    message: '只能上傳一張圖片！',
    type: 'error',
  });
};
const handleFileChange = (file) => {
  if (file.raw) {
    // 驗證檔案大小和格式
    if (file.raw.size > 1024 * 1024 || !['image/jpeg', 'image/png'].includes(file.raw.type)) {
      ElNotification({
        title: '錯誤',
        message: file.raw.size > 1024 * 1024 ? '檔案大小不得超過 1MB' : '僅支援 JPEG/PNG 格式',
        type: 'error',
      });
      fileList.value = [];
      previewImage.value.value = '';
      if (uploadRef.value) uploadRef.value.clearFiles();
      validateField('previewImage');
      return;
    }
    // 更新檔案列表和表單驗證值
    fileList.value = [file];
    previewImage.value.value = file.name; // 設置文件名用於驗證
    ElNotification({
      title: '成功',
      message: '圖片上傳成功！可點擊刪除圖示重新上傳',
      type: 'success',
    });
    validateField('previewImage');
  }
};


// 提交表單
const submit = handleSubmit(async (values) => {
  try {
    // 如果圖片欄位有錯誤，不執行
    if (fileRecords.value[0]?.error) {
      createSnackbar({
        text: '請選擇有效的圖片檔案',
        snackbarProps: {
          color: 'red',
        },
      });
      return;
    }

    // 建立 FormData 格式資料
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('description', values.description);
    fd.append('createdBy', values.createdBy);
    fd.append('category', values.category);
    fd.append('previewImage', fileList.value[0].raw);
    if (fileRecords.value.length > 0) {
      fd.append('previewImage', fileRecords.value[0].file);
    }


    // 呼叫後臺 API 儲存專案
    await projectService.create(fd)
    // const response = await projectService.create(fd); // 假設 `create` 是後臺 API 方法

    // router.push({ name: 'editProject', params: { id: projectId } });
    // 跳轉到編輯專案頁面
    // const router = useRouter()
    // const templateId = response.data.data._id;  // 因為你後端回傳格式是 data 裡有 createdTemplate

    createSnackbar('專案儲存成功', 'success');
    // console.log('project id:', response.data._id);
    // router.push(`/templates/${templateId}/edit`);
    // const response = await projectService.createTemplate(fd);
    // const projectId = response.data.data._id; // 從後臺回傳的資料中取得專案 ID
    // router.push({ name: 'edit', params: { id: projectId } });
    router.push('/user/editProject')//http://localhost:3000/editProject#/ 路徑不知道為什麼錯誤



  } catch (error) {
    console.error('提交表單失敗:', error);
    createSnackbar('提交失敗，請稍後再試', 'error');
  }
});

// 下一步
const nextStep = async () => {
  if (activeStep.value === 1) {
    const valid = await formRef.value.validate();
    if (valid) {
      activeStep.value++;
    } else {
      console.log('表單驗證失敗');
    }
  } else if (activeStep.value === 2) {
    await submit(); // 提交表單
  } else {
    activeStep.value++;
  }
};
//跳回上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

// 關閉前檢查
const handleBeforeClose = (done) => {
  if (activeStep.value === 2) {
    done();
  } else {
    ElNotification({
      title: '提示',
      message: '請完成所有步驟後再關閉視窗！',
      type: 'warning',
    });
  }
};

// 在 <script setup> 內，添加以下函數
const goHome = () => {
  router.push('/'); // 導航回首頁
};


// 表格搜尋過濾功能
// const headers = [
//   { label: 'ID', prop: '_id' },
//   { label: '專案名稱', prop: 'name' },
//   { label: '專案簡介', prop: 'description' },
//   { label: '創建者', prop: 'createdBy' },
//   { label: '專案類別', prop: 'category' },
//   { label: '預視圖', prop: 'previewImage' },
//   {
//     label: '建立日期',
//     prop: 'createdAt',
//     formatter: (row) => new Date(row.createdAt).toLocaleString(),
//   },
//   {
//     label: '更新日期',
//     prop: 'updatedAt',
//     formatter: (row) => new Date(row.updatedAt).toLocaleString(),
//   },
//   { label: '狀態', prop: 'status' },
//   {
//     label: '操作',
//     prop: 'actions',
//     width: 150,
//     sortable: false,
//   },
// ]


// const filterKeys = ['_id', 'name', 'category', 'price', 'description', 'createdAt', 'updatedAt']

  // const getProjects = async () => {
  //   try {
  //     const { data } = await productService.getAll()
  //     products.value = data.products
  //   } catch (error) {
  //     console.error('Error fetching products:', error)
  //     createSnackbar({
  //       text: '無法載入商品資料',
  //       snackbarProps: {
  //         color: 'red',
  //       },
  //     })
  //   }
  // }
  // getProjects()

    // ************************
  // *         表單          *
  // ************************
  // const fileAgent = useTemplateRef('fileAgent')
  // const dialog = ref({
    // 控制對話框開關
    // open: false,
    // 當前操作的商品 ID
    // 如果是新增商品，則為空字串
    // 如果是編輯商品，則為該商品的 ID
  //   id: '',
  // })

  // 打開表單對話框
  // 如果是編輯，會傳入 item，表單欄位填入該商品的資料
  // 如果是新增，不會有 item
  // const openDialog = item => {
  //   if (item) {
  //     dialog.value.id = item._id
  //     name.value.value = item.name
  //     price.value.value = item.price
  //     category.value.value = item.category
  //     description.value.value = item.description
  //     sell.value.value = item.sell
  //   }
  //   dialog.value.open = true
  // }


</script>
<route lang="yaml">
  meta:
    # 標題
    title: '新增專案'
    # 只能在沒登入的情況下看
    login: 'login-only'
    # 不是管理員也能看
    admin: false
</route>


<style scoped>
.dialog-content {
  padding: 16px;
  font-size: 16px;
  color: #dadada; /* 確保文字顏色與背景有對比 */
  line-height: 1.5;
}

.project-container {
  min-height: 100vh;
}

.el-main {
  padding: 20px;
}

.el-button {
  display: inline-block;
  margin: 8px;
}
</style>
