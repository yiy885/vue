<template>


 <!-- <el-container> -->
  <el-row>
    <!-- 左方影片介面 -->
    <el-col :sm="16" :xs="24">
      <div class="grid-content ep-bg-purple">
        <video-view class="video-container"></video-view>
        <!-- <video src="/videos/video.mp4" controls autoplay loop></video> -->
      </div>
    </el-col>
    <!-- 右邊頁面註冊介面 -->
    <el-col :sm="8" :xs="24">
      <div class="grid-content ep-bg-purple-light">

        <el-form
        :disabled="form.isSubmitting.value" @submit.prevent="submit" >
          <div class="login-title-container ">
            <el-text class="mx-1 login-title">Register</el-text>
          </div>
          <el-form-item :error="account.errorMessage.value">
            <div class="login-title-container">
              <el-text class="mx-1" size="small">Account</el-text>
            </div>
            <el-input
              v-model="account.value.value"
              counter
              :error-message="account.errorMessage.value"
              maxlength="50"
              minlength="5"
              class="login-input"
              placeholder="輸入帳號"
              clearable
            />
          </el-form-item>

          <el-form-item :error="email.errorMessage.value">
            <div class="login-title-container">
              <el-text class="mx-1" size="small">E-mail</el-text>
            </div>
            <el-input
              v-model="email.value.value"
              :error-message="email.errorMessage.value"
              maxlength="50"
              minlength="5"
              placeholder="輸入信箱"
              clearable
              class="login-input"
            />
          </el-form-item>

          <el-form-item :error="password.errorMessage.value">
            <div class="login-title-container">
              <el-text class="mx-1" size="small">Password</el-text>
            </div>
            <el-input
              type="password"
              v-model="password.value.value"
              class="login-input"
              label="Password"
              :error-message="password.errorMessage.value"
              placeholder="輸入密碼"
              maxlength="20"
              minlength="5"
              clearable
            />
          </el-form-item>
          <el-form-item :error="confirmPassword.errorMessage.value">
            <div class="login-title-container">
              <el-text class="mx-1" size="small">confirmPassword</el-text>
            </div>
            <el-input
              type="password"
              v-model="confirmPassword.value.value"
              class="login-input"
              label="Password"
              :error-message="confirmPassword.errorMessage.value"
              placeholder="確認密碼"
              maxlength="20"
              minlength="5"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <div class="login-button-container">
            <custom-button height="30px" background-color=" #F5DF4D" text-color="black" :loading="form.isSubmitting.value" native-type="submit">Sign Up</custom-button>
            </div>
          </el-form-item>
        </el-form>

      </div>
    </el-col>
  </el-row>
<!-- </el-container> -->

</template>

<script setup>
import validator from 'validator'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import customButton from '@/components/custom-button.vue';
import VideoView from '@/components/video-view.vue';
import userService from '@/services/user'
import { useUserStore } from '@/stores/user'
// TODO: 登入成功/失敗的提示框，請確認 `createSnackbar` 的來源並引入
// 例如: import { createSnackbar } from 'vue-simple-snackbar'

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const user = useUserStore()

  // https://uvr.esm.is/guide/extending-routes.html#definepage
  // definePage({
  //   meta: {
  //     title: '註冊',
  //   },
  // })

  const createSnackbar = (text, type = 'success') => ElMessage({ message: text, type })
  const router = useRouter()

  // 建立 vee-validate 的表單
  const form = useForm({
    // 用 yup 定義表單驗證格式
    // https://github.com/jquense/yup
    validationSchema: yup.object({
      account: yup
        // 資料型態是文字
        .string()
        .required('帳號是必填的')
        .min(5, '帳號至少需要 5 個字元')
        .max(20, '帳號最多只能有 20 個字元')
        // 自訂驗證(驗證名稱, 錯誤訊息, 驗證function)
        .test('isAlphanumeric', '帳號只能包含英文字母和數字', value => {
          return validator.isAlphanumeric(value)
        }),
      email: yup
        .string()
        .required('電子郵件是必填的')
        .test('isEmail', '請輸入有效的電子郵件地址', value => {
          return validator.isEmail(value)
        }),
      password: yup
        .string()
        .required('密碼是必填的')
        .min(5, '密碼至少需要 5 個字元')
        .max(20, '密碼最多只能有 20 個字元'),
      confirmPassword: yup
        .string()
        .required('確認密碼是必填的')
        // .oneOf(陣列, 訊息)   欄位的值必須是陣列內的其中一個
        // .ref(欄位)          取得欄位的值
        // .ref(password)     password 欄位的值
        .oneOf([yup.ref('password')], '密碼和確認密碼必須相同'),
    }),
  })
  // 建立 vee-validate 的表單欄位
  // 一定要在 useForm 後面
  // useField(欄位名稱)
  const account = useField('account')
  const email = useField('email')
  const password = useField('password')
  const confirmPassword = useField('confirmPassword')

  // vee-validate 的表單送出
  // handleSubmit(處理function)
  // values 表單所有欄位的值
  const submit = form.handleSubmit(async values => {
    try {
      await userService.create({
        account: values.account,
        email: values.email,
        password: values.password,
      })
      createSnackbar('註冊成功', 'success')
      // 註冊成功後，導向到登入頁面
      router.push('/login')
    } catch (error) {
      console.error(error)
      createSnackbar(error?.response?.data?.message || '註冊失敗，請稍後再試！', 'error')
    }
  })
</script>

<!-- https://uvr.esm.is/guide/extending-routes.html#sfc-route-custom-block -->
<route lang="yaml">
  meta:
    # 標題
    title: '註冊'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>

<!--
<route>
{
  "meta": {
    "title": "註冊",
    "login": "no-login-only",
    "admin": false
  }
}
</route>
-->



<!-- 限制登入的使用者 -->
<!-- <route lang="yaml">
  meta:
    # 標題
    title: '登入'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route> -->


<style scoped>

.el-container{
  height: 800px;
  position: relative;
  z-index: 1;
}
.el-row {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  z-index: 1;
  height: 100vh;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {

  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
    min-height: 600px;
}

/* 左側影片介面 */
.ep-bg-purple {
  background-color: #252525;
}

/* 右側llogin註冊介面 */
.ep-bg-purple-light {
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 按鈕 */

/* 文字設定 */
.login-title-container {
  width: 90%;
  z-index: 1;
}

.login-title {
  font-size:x-large;
  margin-bottom: 20px;
  z-index: 1;
}

.login-button-container {
  margin-top: 20px;
  width: 90%;
  max-width: 240px;
}

.login-input {
  width: 90%;
  max-width: 240px;
  /* 修改 placeholder 顏色 */
  --el-input-placeholder-color: #939597;
}

/* 使用 :deep() 來穿透 scoped CSS 的限制，針對 el-input 內部元素做樣式調整 */
.login-input :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  border-radius: 0;
  padding: 1px 0; /* 移除水平 padding */
  border-bottom: 1px solid #939597; /* 加上底線 */
}

/* 當 input 聚焦時的樣式 */
.login-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
  border-bottom-color: #F5DF4D; /* 聚焦時底線變色 */
}

/* 修改 input 內文字顏色 */
.login-input :deep(input) {
  color: #939597; /* 將輸入文字顏色改為灰色 */
  /* 針對 Chrome/Safari 瀏覽器自動填入的文字顏色 */
  -webkit-text-fill-color: #939597;
}


@media (max-width: 600px) {
  .ep-bg-purple {
    display: none;
  }
  .grid-content {
  }
}

</style>
