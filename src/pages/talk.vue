<template>
  <el-container class="talk-container">
    <el-main>
      <!-- 標題 -->
      <section class="hero">
        <h1 ref="titleRef" class="title">Let's Talk</h1>
        <p ref="subtitleRef" class="subtitle">
          分享你的故事，或與我們展開對話。
        </p>
      </section>

      <!-- 引導文字 -->
      <section class="intro-text">
        <p ref="introLine1">
          每一個故事都值得被聆聽，每一份想法都可能點亮他人。
        </p>
        <p ref="introLine2">
          在這裡，我們邀請你分享內心的聲音，或是與我們建立更深度的連結。
        </p>
        <p ref="introLine3" class="highlight">
          無論是創作的靈感、生活的感悟，還是對未來的想像——都歡迎你與我們分享。
        </p>
      </section>

      <!-- 雙欄布局：分享區與聯繫區 -->
      <section class="main-content">
        <el-row :gutter="30">
          <!-- 左側：分享想法區 -->
          <el-col :md="12" :sm="24">
            <el-card
              ref="shareCard"
              class="glow-card section-card"
              :style="{
                '--clr': 'rgba(245, 223, 77, 1)',
                '--x': glowEffects.share.x + 'px',
                '--y': glowEffects.share.y + 'px'
              }"
              @mousemove="handleCardMouseMove($event, 'share')"
              shadow="hover"
            >
              <template #header>
                <div class="card-header">
                  <h2>分享你的想法</h2>
                </div>
              </template>

              <el-form @submit.prevent="handleShare" :model="shareForm">
                <el-form-item label="暱稱">
                  <el-input
                    v-model="shareForm.name"
                    placeholder="你的名字（可留空）"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="想法">
                  <el-input
                    v-model="shareForm.message"
                    type="textarea"
                    :rows="4"
                    placeholder="想分享的故事、創作靈感或生活感悟..."
                    show-word-limit
                    maxlength="200"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="handleShare"
                    :disabled="!shareForm.message.trim()"
                    style="background-color: rgba(245, 223, 77, 1); border-color: rgba(245, 223, 77, 1); color: #000"
                  >
                    分享想法
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>

          <!-- 右側：聯繫我們 -->
          <el-col :md="12" :sm="24">
            <el-card
              ref="contactCard"
              class="glow-card section-card"
              :style="{
                '--clr': 'rgba(245, 223, 77, 1)',
                '--x': glowEffects.contact.x + 'px',
                '--y': glowEffects.contact.y + 'px'
              }"
              @mousemove="handleCardMouseMove($event, 'contact')"
              shadow="hover"
            >
              <template #header>
                <div class="card-header">
                  <h2>與我們聯繫</h2>
                </div>
              </template>

              <el-form @submit.prevent="handleContact" :model="contactForm">
                <el-form-item label="姓名" :required="true">
                  <el-input
                    v-model="contactForm.name"
                    placeholder="請輸入姓名"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="Email" :required="true">
                  <el-input
                    v-model="contactForm.email"
                    placeholder="請輸入 Email"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="訊息" :required="true">
                  <el-input
                    v-model="contactForm.message"
                    type="textarea"
                    :rows="4"
                    placeholder="想合作或想聊聊的內容..."
                    show-word-limit
                    maxlength="300"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="success"
                    @click="handleContact"
                    :disabled="!isContactFormValid"
                    style="background-color: #67c23a; border-color: #67c23a;"
                  >
                    送出聯繫
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 分享留言顯示區 -->
      <section class="messages-section" v-if="messages.length" ref="messagesSection">
        <el-card shadow="never" class="messages-container">
          <template #header>
            <h3>大家的分享</h3>
          </template>

          <div class="messages-grid">
            <el-card
              v-for="(msg, index) in messages"
              :key="`msg-${index}`"
              :class="['message-card', 'glow-card']"
              :style="{
                '--clr': 'rgba(245, 223, 77, 0.6)',
                '--x': glowEffects[`msg-${index}`]?.x + 'px' || '0px',
                '--y': glowEffects[`msg-${index}`]?.y + 'px' || '0px'
              }"
              @mousemove="handleCardMouseMove($event, `msg-${index}`)"
              shadow="hover"
            >
              <div class="message-content">
                <p class="msg-text">「{{ msg.message }}」</p>
                <p class="msg-author">— {{ msg.name || '匿名分享者' }}</p>
                <p class="msg-time">{{ formatTime(msg.timestamp) }}</p>
              </div>
            </el-card>
          </div>
        </el-card>
      </section>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ElMessage } from 'element-plus'

// DOM 引用
const titleRef = ref(null)
const subtitleRef = ref(null)
const introLine1 = ref(null)
const introLine2 = ref(null)
const introLine3 = ref(null)
const shareCard = ref(null)
const contactCard = ref(null)
const messagesSection = ref(null)

// 表單狀態
const shareForm = ref({ name: '', message: '' })
const contactForm = ref({ name: '', email: '', message: '' })
const messages = ref([])

// 光暈效果
const glowEffects = reactive({
  share: { x: 0, y: 0 },
  contact: { x: 0, y: 0 }
})

// 表單驗證
const isContactFormValid = computed(() => {
  return contactForm.value.name.trim() &&
         contactForm.value.email.trim() &&
         contactForm.value.message.trim()
})

// 滑鼠移動處理
const handleCardMouseMove = (event, cardKey) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()

  if (!glowEffects[cardKey]) {
    glowEffects[cardKey] = { x: 0, y: 0 }
  }

  glowEffects[cardKey].x = event.clientX - rect.left
  glowEffects[cardKey].y = event.clientY - rect.top
}

// 時間格式化
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 分享處理
const handleShare = () => {
  if (!shareForm.value.message.trim()) {
    ElMessage.warning('請輸入想分享的內容')
    return
  }

  const newMessage = {
    name: shareForm.value.name.trim(),
    message: shareForm.value.message.trim(),
    timestamp: Date.now()
  }

  messages.value.unshift(newMessage)
  shareForm.value = { name: '', message: '' }

  ElMessage.success('感謝你的分享！')

  // 動畫新增的留言卡片
  setTimeout(() => {
    if (messagesSection.value) {
      gsap.from('.message-card:first-child', {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.7)'
      })
    }
  }, 100)
}

// 聯繫處理
const handleContact = () => {
  if (!isContactFormValid.value) {
    ElMessage.warning('請完整填寫所有必填資料')
    return
  }

  // 這裡可以串接實際的 API
  ElMessage.success({
    message: `感謝 ${contactForm.value.name} 的聯繫！我們會盡快回覆到 ${contactForm.value.email}`,
    duration: 4000
  })

  contactForm.value = { name: '', email: '', message: '' }
}

// GSAP 動畫
onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

  tl.from(titleRef.value, { y: -50, opacity: 0 })
    .from(subtitleRef.value, { opacity: 0 }, "-=0.5")

    // 引導文字動畫
    .from(introLine1.value, { opacity: 0, y: 30 }, "+=0.2")
    .from(introLine2.value, { opacity: 0, y: 30 }, "-=0.8")
    .from(introLine3.value, { opacity: 0, y: 30, color: "#409EFF" }, "-=0.8")

    // 卡片動畫
    .from([shareCard.value, contactCard.value], {
      opacity: 0,
      y: 50,
      scale: 0.95,
      stagger: 0.2
    }, "-=0.3")
})
</script>

<style scoped>
.talk-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.subtitle {
  font-size: 18px;
  color: #666;
}

.intro-text {
  margin: 40px 0;
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.intro-text .highlight {
  font-weight: bold;
  font-size: 18px;
  color: #409EFF;
  margin-top: 15px;
}

.main-content {
  margin: 50px 0;
}

.section-card {
  min-height: 400px;
  margin-bottom: 30px;
}

.card-header h2 {
  margin: 0;
  color: #333;
  font-size: 22px;
}

.messages-section {
  margin-top: 50px;
}

.messages-container {
  background: #141414;
}

.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.message-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.message-content {
  padding: 10px;
}

.msg-text {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  font-style: italic;
}

.msg-author {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 5px;
}

.msg-time {
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* 光暈效果 */
.glow-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glow-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

:deep(.glow-card.el-card::before) {
  content: '';
  position: absolute;
  top: var(--y);
  left: var(--x);
  transform: translate(-50%, -50%);
  background: radial-gradient(var(--clr), transparent, transparent);
  width: 400px;
  height: 400px;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 1;
}

:deep(.glow-card.el-card:hover::before) {
  opacity: 1;
}

:deep(.glow-card.el-card::after) {
  content: '';
  position: absolute;
  inset: 2px;
  background: rgba(0, 0, 0, 1);
  border-radius: 4px;
  z-index: 2;
  pointer-events: none;
}

:deep(.glow-card .el-card__body),
:deep(.glow-card .el-card__header) {
  position: relative;
  z-index: 3;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-content :deep(.el-col) {
    margin-bottom: 20px;
  }

  .messages-grid {
    grid-template-columns: 1fr;
  }

  .section-card {
    min-height: auto;
  }

  .glow-card:hover {
    transform: translateY(-2px);
  }
}

/* 表單樣式優化 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
}
</style>
