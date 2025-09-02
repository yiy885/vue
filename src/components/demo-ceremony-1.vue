<template>
  <div class="page-wrapper">
    <!-- 主要內容區域 -->
    <el-container class="page-container">
      <el-main class="main-content">
        <!-- 輪播圖 -->
        <el-carousel :interval="5000" arrow="always" class="hero-carousel">
          <el-carousel-item v-for="(img, index) in images" :key="index">
            <div class="carousel-slide">
              <img :src="img" alt="carousel image" class="carousel-image" />
              <div class="carousel-overlay"></div>
            </div>
          </el-carousel-item>
        </el-carousel>

        <!-- 此岸簡介 -->
        <section class="intro-section">
          <el-row :gutter="24" align="middle">
            <el-col :lg="17" :md="16" :sm="24">
              <div class="intro-image-container">
                <img
                  src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756342597/yiyi01-cloud/gsmey5phv3i8ylkbjb1e.png"
                  alt="此岸簡介"
                  class="intro-image"
                />
              </div>
            </el-col>
            <el-col :lg="7" :md="8" :sm="24">
              <div class="intro-placeholder">
                <!-- 預留空間或其他內容 -->
              </div>
            </el-col>
          </el-row>
        </section>

        <!-- 文字介紹 -->
        <section class="text-section">
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="text-content">
                <p class="main-description">
                  由於科技時代的進步 傳統儀式已化繁為簡,許多儀式當中的精神早已流於形式
                  客套不走心的祝福 讓喪禮文化成為一種表面形式
                  只憑大量的金紙、紙紮屋、蓮花元寶,真的能讓往生者走好嗎?
                  在人生的盡頭,最想聽到的到底是什麼呢?
                  我們相信,唯有真心的思念與祝福才能讓往生者走好、讓活著的人安好
                  一朵朵鮮紅的彼岸花牽引著阿公走向前方 化為純白的花朵卻又帶來思念與美好的祝福。
                  此岸的生靈揮別彼岸的亡靈,此刻才終於得到永恆的安息。
                </p>
                <p class="sub-description">
                  在這樣的時代背景下,我們希望能夠重新思考喪禮的意義,讓每一個儀式都能夠回到最初的初心,
                  讓每一個祝福都能夠真心實意,讓每一個往生者都能夠得到應有的尊重與安息。
                </p>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="text-content english">
                <p>
                  The communication between the living and the dead is achieved through ceremonies.
                  Although when the people sang laments and eulogies from the top of their lungs,
                  the dead still could not receive the joss paper they were given. Even though the
                  offerings are abundant for these ceremonies, they lack the truthful blessings from
                  their families. At the end of life, what is it that you truthfully want?
                </p>
              </div>
            </el-col>
          </el-row>
        </section>

        <!-- 此岸核心概念 -->
        <section class="concept-section">
          <h2 class="section-title">此岸核心概念</h2>
          <div class="collapse-wrapper">
            <el-collapse v-model="activeNames" @change="handleChange" class="custom-collapse">
              <el-collapse-item title="一切始於對於死亡世界的想像" name="1">
                <div class="collapse-content">
                  <h4>對於死後世界的想像</h4>
                  <p>
                    古今以來,世界各地都有一套對死後世界的想像,例如:埃及人相信死後會由阿努比斯
                    神對死者的靈魂進行審判、西藏人認為將死者的屍體交由禿鷹「天葬」,死後會到達極樂
                    世界、印度人認為輪迴再世會讓死者重回親人的身邊。
                  </p>
                  <p>
                    中國人則深信,死後死者的魂魄會經由差使牽引至鬼門關,有家屬燒的金紙、元寶,
                    可讓死者在黃泉路上打點過路費,誦讀經文則可幫死者消除業障、減輕各地獄層級的審判
                    和服刑,在投胎時則會行經忘川河,需喝下孟婆湯、走上奈何橋便可獲得來世。
                  </p>
                </div>
              </el-collapse-item>
              <el-collapse-item title="傳統儀式流於形式還是心意?" name="2">
                <div class="collapse-content">
                  <p>
                    傳統儀式當中,對於死者往生有許多的儀式:誦經、作七、摺蓮花燒金紙等,目的是為
                    了讓往生者安寧,在死後的世界可以忘記生前的苦痛重新投胎做人,並讓家屬透過這些儀
                    式去悼念往生者,並且好好地和死者道別。
                  </p>
                  <p>
                    但由於科技時代的進步,傳統儀式已化繁為簡,許多儀式當中的精神已流於形式,客套不走心的祝福,讓喪禮文化成為一種表面形式,家屬的哭喊、眼淚都是空泛麻木的,大
                    量的金錢、紙紮屋、蓮花元寶,真的能讓往生者走好嗎?
                  </p>
                </div>
              </el-collapse-item>
              <el-collapse-item title="傳統儀式祭品式微" name="3">
                <div class="collapse-content">
                  <p>
                    現代社會由於步調快速、時間壓縮,在舉行喪禮儀式時顧忌到時間、環保等層面,許
                    多的儀式和祭品都漸漸從簡,從前訂做的紙紮屋、折蓮花元寶都漸漸消失,或許在未來的
                    科技社會裡會逐漸被淘汰,金紙等傳統媒材都不再出現。
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </section>

        <!-- 團隊介紹 -->
        <section class="team-section">
          <h2 class="section-title">團隊 Team</h2>
          <div class="team-grid">
            <el-row :gutter="30" justify="center" align="middle">
              <el-col
                :lg="4"
                :md="6"
                :sm="12"
                :xs="24"
                v-for="(member, index) in teamMembers"
                :key="index"
              >
                <div class="team-member">
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    :content="member.tooltip"
                    popper-class="custom-tooltip"
                  >
                    <div class="member-image-wrapper">
                      <img :src="member.image" :alt="member.name" class="member-image" />
                      <div class="member-overlay">
                        <p class="member-name">{{ member.name }}</p>
                        <p class="member-role">{{ member.role }}</p>
                      </div>
                    </div>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </section>

        <!-- 角色設計 -->
        <section class="character-section">
          <h2 class="section-title">角色設計</h2>
          <el-row :gutter="24" align="middle">
            <el-col :lg="18" :md="16" :sm="24">
              <div class="character-image-container">
                <img
                  src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316687/J_%E6%AD%A4%E5%B2%B8_%E4%BA%BA%E7%89%A9_mbr7k8.png"
                  alt="角色設計"
                  class="character-image"
                />
              </div>
            </el-col>
            <el-col :lg="6" :md="8" :sm="24">
              <div class="character-description">
                <p>
                  阿公身上穿著白色台灣老人常見的白色衛衣，下半身著短褲，腳上穿著藍白拖鞋，理著一頭短短的平頭，神情嚴肅個性頑固，是個久疏於和家人有所互動和溝通的老人，唯一的溫情只顯露在小孫女萱萱身上。
                </p>
              </div>
            </el-col>
          </el-row>
        </section>

        <!-- 分鏡腳本 -->
        <section class="storyboard-section">
          <h2 class="section-title">分鏡腳本 Storyboard</h2>
          <div class="carousel-wrapper">
            <Carousel />
          </div>
        </section>

        <!-- 燈箱展示 -->
        <section class="lightbox-section">
          <div class="lightbox-container">
            <LightBox />
          </div>
        </section>
      </el-main>
    </el-container>

    <!-- 無間距頁尾 - 彼岸花背景 -->
    <footer class="footer-no-padding">
      <div class="footer-background-full">
        <div class="footer-overlay">
          <div class="awards-section">
            <div class="awards-content">
              <h3 class="awards-title">獲獎紀錄</h3>
              <div class="awards-grid">
                <div class="award-item" v-for="(award, index) in awards" :key="index">
                  <div class="award-year">{{ award.year }}</div>
                  <div class="award-name">{{ award.name }}</div>
                  <div class="award-category">{{ award.category }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 頁尾底部信息 -->
          <div class="footer-bottom-info">
            <el-row justify="space-between" align="middle">
              <el-col :lg="12" :md="12" :sm="24">
                <div class="footer-brand">
                  <h4>此岸 This Shore</h4>
                  <p>探索生死邊界的藝術作品</p>
                </div>
              </el-col>
              <el-col :lg="12" :md="12" :sm="24">
                <div class="footer-links">
                  <a href="#concept">核心概念</a>
                  <a href="#team">團隊介紹</a>
                  <a href="#storyboard">分鏡腳本</a>
                  <a href="#awards">獲獎紀錄</a>
                </div>
              </el-col>
            </el-row>
            <div class="copyright">
              <p>&copy; 2024 此岸團隊. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LightBox from './LightBox.vue'
import Carousel from './Carousel.vue'

// 折疊面板
const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log('折疊項目變更為:', val)
}

// 輪播圖片
const images = ref([
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316778/1-1_final_yc01yn.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316781/1-3_final_oweeeg.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316775/5-11_final_ncbjzl.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316777/6-5_1_final_ba94l3.jpg',
])

// 團隊成員資料
const teamMembers = ref([
  {
    name: '張瑜庭',
    role: '導演 / 分鏡 / 美術',
    image:
      'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316710/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-1_amvdsi.png',
    tooltip: '張瑜庭 YU-TING CHANG\n導演 / 分鏡 / 美術',
  },
  {
    name: '岑祈萱',
    role: '美術 / 道具 / 後製',
    image:
      'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316719/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-2_krzc3y.png',
    tooltip: '岑祈萱 CHI-HSUAN TSEN\n美術/道具/後製',
  },
  {
    name: '陳奕羽',
    role: '美術 / 攝影 / 後製',
    image:
      'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316700/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6_eepcf5.png',
    tooltip: '陳奕羽 YI-YU CHEN\n美術/攝影/後製',
  },
  {
    name: '聶琡鳳',
    role: '美術 / 道具 / 後製',
    image:
      'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316737/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-4_hzymcv.png',
    tooltip: '聶琡鳳 CHU-FONG NIE\n美術/道具/後製',
  },
  {
    name: '黃采娟',
    role: '導演 / 企劃 / 音效',
    image:
      'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316728/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-3_qf6kzu.png',
    tooltip: '黃采娟 TSAI-CHUAN HUANG\n導演/企劃/音效',
  },
])

// 獲獎紀錄
const awards = ref([
  { year: '2020', name: '放視大賞', category: '實驗與混合媒材動畫組-金獎' },
  { year: '2020', name: '德國紅點', category: 'Red Dot Winner' },
  { year: '2020', name: '哥倫比亞實驗短片國際影展', category: '動畫單元得主' },
  { year: '2020', name: '高雄電影節國際短片競賽', category: '兒童評審團獎入圍' },
  { year: '2020', name: '青春有影大學杯', category: '動畫組-金獎' },
  { year: '2020', name: '新一代設計展', category: '金點新秀設計獎年度最佳設計獎-入圍' },
  { year: '2020', name: '義大利CyBorg科幻影展', category: '入圍' },
  { year: '2020', name: '泰達杯青年創意設計大賽', category: '新加坡設計業總商會特別獎' },
  { year: '2020', name: '臺灣國際學生創意設計大賽', category: '數位動畫類入圍' },
  { year: '2020', name: '第16屆技專院校電腦動畫競賽', category: '佳作' },
])
</script>

<style scoped>
/* 重置和基本布局 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-wrapper {
  min-height: 100vh;
  background-color: #1a1a1a;
}

/* 移除 el-main 的預設 padding */
:deep(.el-main) {
  padding: 0 !important;
}

.main-content {
  padding: 0 40px 0 40px; /* 只有左右 padding，底部無 padding */
}

/* 輪播圖 */
.hero-carousel {
  margin-bottom: 60px;
}

.carousel-slide {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* 區塊通用樣式 */
section {
  margin-bottom: 80px;
}

.section-title {
  color: #d9d9d9;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 簡介區塊 */
.intro-section {
  margin-bottom: 60px;
}

.intro-image-container {
  text-align: center;
}

.intro-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 文字區塊 */
.text-section {
  margin-bottom: 80px;
}

.text-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
}

.main-description,
.sub-description {
  color: #d9d9d9;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.english p {
  color: #b8b8b8;
  font-style: italic;
  font-size: 1rem;
}

/* 概念區塊 */
.concept-section {
  margin-bottom: 80px;
}

.collapse-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

:deep(.custom-collapse) {
  .el-collapse-item__header {
    background-color: rgba(255, 255, 255, 0.05);
    color: #d9d9d9;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    margin-bottom: 16px;
    padding: 20px;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .el-collapse-item__content {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    margin-bottom: 16px;
  }
}

.collapse-content {
  padding: 30px;
}

.collapse-content h4 {
  color: #e8e8e8;
  margin-bottom: 20px;
  font-weight: 600;
}

.collapse-content p {
  color: #d9d9d9;
  line-height: 1.7;
  margin-bottom: 16px;
}

/* 團隊區塊 */
.team-section {
  margin-bottom: 80px;
}

.team-grid {
  max-width: 1000px;
  margin: 0 auto;
}

.team-member {
  text-align: center;
  margin-bottom: 30px;
}

.member-image-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.member-image-wrapper:hover {
  transform: translateY(-10px) scale(1.05);
}

.member-image {
  width: 100%;
  max-width: 200px;
  height: auto;
  display: block;
}

.member-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px 15px 15px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.member-image-wrapper:hover .member-overlay {
  transform: translateY(0);
}

.member-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.member-role {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 角色設計區塊 */
.character-section {
  margin-bottom: 80px;
}

.character-image-container {
  text-align: center;
  margin-bottom: 30px;
}

.character-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.character-description {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.character-description p {
  color: #d9d9d9;
  line-height: 1.7;
  font-size: 1rem;
}

/* 分鏡和燈箱區塊 */
.storyboard-section,
.lightbox-section {
  margin-bottom: 60px;
}

.carousel-wrapper,
.lightbox-container {
  max-width: 100%;
  margin: 0 auto;
}

/* 無間距頁尾 - 關鍵部分 */
.footer-no-padding {
  margin: 0;
  padding: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%); /* 突破容器限制，延伸到全屏寬度 */
  position: relative;
}

.footer-background-full {
  width: 100%;
  min-height: 600px;
  background-image: url('https://res.cloudinary.com/dsb5x7env/image/upload/v1756688251/000_c3wefp.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.footer-overlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 40px 40px;
}

/* 獲獎區塊 */
.awards-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.awards-content {
  max-width: 1000px;
  width: 100%;
  text-align: center;
}

.awards-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 50px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.award-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.award-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.award-year {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.award-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.award-category {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 頁尾底部 */
.footer-bottom-info {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 40px;
  margin-top: 40px;
}

.footer-brand h4 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.footer-links {
  display: flex;
  gap: 30px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.footer-links a:hover {
  color: white;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  transition: all 0.3s ease;
}
</style>
