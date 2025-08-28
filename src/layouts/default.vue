<template>
  <el-container>
    <el-header>
      <EleNavBar />
    </el-header>
    <el-main>
      <router-view :key="$route.fullPath" />
    </el-main>
  <!-- <el-footer></el-footer> -->

</el-container>

</template>

<script  setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'
  import { ElMessage } from 'element-plus'
  import EleNavBar from '@/components/EleNavBar.vue'

  const createSnackbar = (text, type = 'success') => ElMessage({ message: text, type })


  const user = useUserStore()
  const router = useRouter()
</script>

<style scoped>
.el-header{
  /* position: fixed; */
  padding: 0;
}
.el-main {
  padding: 0;
}

</style>


