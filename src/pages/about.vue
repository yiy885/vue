<template>
  <el-container class="about-container">
    <el-main>
      <!-- 標題 -->
      <section class="hero">
        <h1 ref="titleRef" class="title">關於我們</h1>
        <p ref="subtitleRef" class="subtitle">
          「此岸」精神的延續，在這裡留下你的故事與想法。
        </p>
      </section>

      <!-- 故事文字介紹 -->
      <section class="story">
        <p ref="storyLine1">
          「此岸」偶動畫團隊的誕生，起因於一次對話——我們談到，人逝去後所舉辦的儀式，往往淪為形式，未必能真正承載人們的思念。
          這份共鳴，讓我們聚在一起，為了一個信念，投入數月心力，完成了一支七分鐘的動畫。
        </p>
        <p ref="storyLine2">
          一個成功的專案，不僅是成果，更是過程中無數的故事。
          回想那段日子，團隊雖然歷經摩擦與挑戰，但也在一次次的討論與解決中成長。
          當作品完成並引起觀眾共鳴、收到回饋時，那份成就感成為最深刻的印記。
        </p>
        <p ref="storyLine3" class="highlight">
        雖然如今團隊成員各自走上不同的道路，但這段經驗仍時常被想起。<br>
        這個網站正是「此岸」精神的延續——紀錄每一個專案背後的歷程，凝聚那些因相同理念而產生共鳴的人。
        </p>
      </section>

      <!-- 平台理念介紹 - 加入光暈效果 -->
      <section class="intro">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card
              ref="card1"
              shadow="hover"
              class="glow-card"
              :style="{
                '--clr': 'rgba(245, 223, 77, 1)',    // 金黃色,
                '--x': glowEffects.card1.x + 'px',
                '--y': glowEffects.card1.y + 'px'
              }"
              @mousemove="handleCardMouseMove($event, 'card1')"
            >
              <h3>協作</h3>
              <p>專案的價值來自彼此的合作與信任，每一次討論與磨合，都是成就作品的重要力量。</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              ref="card2"
              shadow="hover"
              class="glow-card"
              :style="{
                '--clr': 'rgba(245, 223, 77, 1)',    // 金黃色
                '--x': glowEffects.card2.x + 'px',
                '--y': glowEffects.card2.y + 'px'
              }"
              @mousemove="handleCardMouseMove($event, 'card2')"
            >
              <h3>共鳴</h3>
              <p>真正的作品能觸動人心，引起不同觀眾的共鳴，這份回響比成果本身更有意義。</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              ref="card3"
              shadow="hover"
              class="glow-card"
              :style="{
                '--clr': 'rgba(245, 223, 77, 1)',    // 金黃色
                '--x': glowEffects.card3.x + 'px',
                '--y': glowEffects.card3.y + 'px'
              }"
              @mousemove="handleCardMouseMove($event, 'card3')"
            >
              <h3>理念</h3>
              <p>我們延續「此岸」的精神，記錄專案的歷程，凝聚因同樣信念而相聚的人。</p>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 留言區 -->
      <section class="feedback">
        <el-card shadow="never" ref="feedbackCard">
          <h3>留下你的想法</h3>
          <div class="btn-group">
          <custom-button
            class="fab-button"
            :icon="Plus"
            size="large"
            type="primary"
            :round="true"
            backgroundColor="#0000"
            textColor="#ffff"
            @click="handleButtonClick">新增專案</custom-button>

          </div>
        </el-card>
      </section>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { gsap } from 'gsap'
import customButton from '@/components/custom-button.vue'
import { Plus } from '@element-plus/icons-vue'

// 表單狀態
const message = ref('')
const submittedMessage = ref('')

// DOM 引用
const titleRef = ref(null)
const subtitleRef = ref(null)
const storyLine1 = ref(null)
const storyLine2 = ref(null)
const storyLine3 = ref(null)
const card1 = ref(null)
const card2 = ref(null)
const card3 = ref(null)
const feedbackCard = ref(null)

// 光暈效果數據
const glowEffects = reactive({
  card1: { x: 0, y: 0 },
  card2: { x: 0, y: 0 },
  card3: { x: 0, y: 0 }
})

// 滑鼠移動處理函數
const handleCardMouseMove = (event, cardKey) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()

  // 計算滑鼠相對於卡片的座標
  glowEffects[cardKey].x = event.clientX - rect.left
  glowEffects[cardKey].y = event.clientY - rect.top
}

// 表單處理
const handleSubmit = () => {
  if (!message.value.trim()) return
  submittedMessage.value = message.value
  message.value = ''
}

const handleClear = () => {
  message.value = ''
}

const handleButtonClick = () => {
  console.log('Button clicked!')
}

// GSAP 翻頁式動畫
onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

  tl.from(titleRef.value, { y: -50, opacity: 0 })
    .from(subtitleRef.value, { opacity: 0 }, "-=0.5")

    // 故事逐段展開 + 模擬翻頁
    .from(storyLine1.value, { opacity: 0, y: 30 }, "+=0.3")
    .to(storyLine1.value, { opacity: 0.3 }, "+=1")

    .from(storyLine2.value, { opacity: 0, y: 30 }, "-=0.2")
    .to(storyLine2.value, { opacity: 0.3 }, "+=1")

    .from(storyLine3.value, { opacity: 0, y: 30, color: "#409EFF" }, "-=0.2")

    // 卡片與留言區
    .from([card1.value, card2.value, card3.value], {
      opacity: 0,
      y: 30,
      stagger: 0.3
    })
    .from(feedbackCard.value, { opacity: 0, scale: 0.9 }, "-=0.3")
})
</script>

<style scoped>
.about-container {
  max-width: 1000px;
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
  color: rgba(217, 217, 217, 1);
}

.subtitle {
  font-size: 18px;
  color: rgba(217, 217, 217, 1);
}

.story {
  margin: 40px 0;
  font-size: 16px;
  line-height: 1.8;
  color: rgba(217, 217, 217, 1);
}

.story .highlight {
  font-weight: bold;
  font-size: 18px;
  color: rgba(207, 196, 136, 1);
  margin-top: 15px;
}

.intro {
  margin-bottom: 50px;
}

.feedback {
  margin-top: 30px;
}

.btn-group {
  margin-top: 10px;
}

.submitted {
  margin-top: 20px;
}

/* 光暈效果樣式 */
.glow-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glow-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* 光暈效果 - 使用 :deep() 穿透 Element Plus 樣式 */
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

/* 內層背景遮罩 */
:deep(.glow-card.el-card::after) {
  content: '';
  position: absolute;
  inset: 2px;
  background: #141414;
  border-radius: 4px;
  z-index: 2;
  pointer-events: none;
}

/* 確保卡片內容在最上層 */
:deep(.glow-card .el-card__body) {
  position: relative;
  z-index: 3;
}

/* 卡片標題樣式增強 */
:deep(.glow-card h3) {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(217, 217, 217, 1);
  transition: color 0.3s ease;
}

:deep(.glow-card:hover h3) {
  color: rgba(207, 196, 136, 1);
}

/* 響應式調整 */
@media (max-width: 768px) {
  .intro :deep(.el-col) {
    margin-bottom: 20px;
  }

  .glow-card:hover {
    transform: translateY(-4px);
  }

  :deep(.glow-card.el-card::before) {
    width: 300px;
    height: 300px;
  }
}
</style>
