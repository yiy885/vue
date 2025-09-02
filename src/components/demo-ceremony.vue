<template>
  <el-container class="page-container">
    <el-main class="main-content">
      <!-- 輪播圖 -->
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(img, index) in images" :key="index">
          <img :src="img" alt="carousel image" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>

      <!-- 此岸簡介 -->
      <div class="role-section">
        <el-row :gutter="24">
          <el-col :span="17">
            <img
              src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756342597/yiyi01-cloud/gsmey5phv3i8ylkbjb1e.png"
              alt=""
              style="width: 250px"
            />
          </el-col>
          <el-col :span="7">
            <!-- <img
              src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756659447/Group_58_mzwxul.png"
              alt=""
              style="width: 120px"
            /> -->
            <div class="grid-content ep-bg-purple" />
          </el-col>
          <!-- <el-col :span="7">
            <img
              src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756659447/Group_58_mzwxul.png"
              alt=""
            />
            <div class="grid-content ep-bg-purple" />
          </el-col> -->
        </el-row>
      </div>

      <!-- 文字介紹 -->

      <div id="concept" class="text-section">
        <el-row :gutter="24">
          <el-col :span="24">
            <p>
              由於科技時代的進步 傳統儀式已化繁為簡,許多儀式當中的精神早已流於形式 客套不走心的祝福
              讓喪禮文化成為一種表面形式 只憑大量的金紙、紙紮屋、蓮花元寶,真的能讓往生者走好嗎?
              在人生的盡頭,最想聽到的到底是什麼呢?
              我們相信,唯有真心的思念與祝福才能讓往生者走好、讓活著的人安好
              一朵朵鮮紅的彼岸花牽引著阿公走向前方 化為純白的花朵卻又帶來思念與美好的祝福。
              此岸的生靈揮別彼岸的亡靈,此刻才終於得到永恆的安息。
            </p>
            <p>
              在這樣的時代背景下,我們希望能夠重新思考喪禮的意義,讓每一個儀式都能夠回到最初的初心,
              讓每一個祝福都能夠真心實意,讓每一個往生者都能夠得到應有的尊重與安息。
            </p>
            <div class="grid-content ep-bg-purple" />
          </el-col>
          <el-col :span="24">
            <p>
              The communication between the living and the dead is achieved through ceremonies.
              Although when the people sang laments and eulogies from the top of their lungs, the
              dead still could not receive the joss paper they were given. Even though the offerings
              are abundant for these ceremonies, they lack the truthful blessings from their
              families. At the end of life, what is it that you truthfully want?
            </p>
            <div class="grid-content ep-bg-purple" />
          </el-col>
        </el-row>
      </div>

      <!-- 此岸核心概念 -->
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="一切始於對於死亡世界的想像" name="1">
            <div>
              對於死後世界的想像
              古今以來,世界各地都有一套對死後世界的想像,例如:埃及人相信死後會由阿努比斯
              神對死者的靈魂進行審判、西藏人認為將死者的屍體交由禿鷹「天葬」,死後會到達極樂
              世界、印度人認為輪迴再世會讓死者重回親人的身邊。
            </div>
            <div>
              中國人則深信,死後死者的魂魄會經由差使牽引至鬼門關,有家屬燒的金紙、元寶,
              可讓死者在黃泉路上打點過路費,誦讀經文則可幫死者消除業障、減輕各地獄層級的審判
              和服刑,在投胎時則會行經忘川河,需喝下孟婆湯、走上奈何橋便可獲得來世。
            </div>
          </el-collapse-item>
          <el-collapse-item title="傳統儀式流於形式還是心意?" name="2">
            <div>
              傳統儀式當中,對於死者往生有許多的儀式:誦經、作七、摺蓮花燒金紙等,目的是為
              了讓往生者安寧,在死後的世界可以忘記生前的苦痛重新投胎做人,並讓家屬透過這些儀
              式去悼念往生者,並且好好地和死者道別。
            </div>
            <div>
              但由於科技時代的進步,傳統儀式已化繁為簡,許多儀式當中的精神已流於形式,客套不走心的祝福,讓喪禮文化成為一種表面形式,家屬的哭喊、眼淚都是空泛麻木的,大
              量的金錢、紙紮屋、蓮花元寶,真的能讓往生者走好嗎?
            </div>
          </el-collapse-item>
          <el-collapse-item title="傳統儀式祭品式微" name="3">
            <div>
              現代社會由於步調快速、時間壓縮,在舉行喪禮儀式時顧忌到時間、環保等層面,許
              多的儀式和祭品都漸漸從簡,從前訂做的紙紮屋、折蓮花元寶都漸漸消失,或許在未來的
              科技社會裡會逐漸被淘汰,金紙等傳統媒材都不再出現。
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 團隊介紹 -->
        <div class="team-section">
          <p style="color: aliceblue">團隊Team</p>
          <div class="">
            <el-row :gutter="50" justify="center" align="middle">
              <el-col :span="4">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="custom-tooltip"
                  trigger="hover"
                >
                  <template #content>
                    <div>
                      張瑜庭 YU-TING CHANG<br />
                      導演 / 分鏡 / 美術
                    </div>
                  </template>
                  <img
                    src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316710/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-1_amvdsi.png"
                    alt="Team Member 1"
                    height="210px"
                  />
                </el-tooltip>

                <div class="grid-content ep-bg-purple" />
              </el-col>

              <el-col :span="4">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="custom-tooltip"
                  trigger="hover"
                >
                  <template #content>
                    <div>
                      岑祈萱CHI-HSUAN TSEN<br />
                      美術/道具/後製
                    </div>
                  </template>
                  <img
                    src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316719/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-2_krzc3y.png"
                    alt="Team Member 2"
                    height="180px"
                  />
                </el-tooltip>
                <div class="grid-content ep-bg-purple-light" />
              </el-col>
              <el-col :span="4">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="custom-tooltip"
                  trigger="hover"
                >
                  <template #content>
                    <div>陳奕羽YI-YU CHEN <br />美術/攝影/後製</div>
                  </template>
                  <img
                    src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316700/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6_eepcf5.png"
                    alt="Team Member 3"
                    height="190px"
                /></el-tooltip>
                <div class="grid-content ep-bg-purple" />
              </el-col>
              <el-col :span="4">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="custom-tooltip"
                  trigger="hover"
                >
                  <template #content>
                    <div>
                      聶琡鳳CHU-FONG NIE<br />
                      美術/道具/後製
                    </div>
                  </template>
                  <img
                    src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316737/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-4_hzymcv.png"
                    height="190px"
                    alt="Team Member 4"
                /></el-tooltip>
                <div class="grid-content ep-bg-purple-light" />
              </el-col>
              <el-col :span="4">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="custom-tooltip"
                  trigger="hover"
                >
                  <template #content>
                    <div>
                      黃采娟TSAI-CHUAN HUANG<br />
                      導演/企劃/音效
                    </div>
                  </template>
                  <img
                    src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316728/%E5%9C%98%E9%9A%8A%E4%BA%BA%E5%93%A1%E7%B4%99%E5%81%B6-3_qf6kzu.png"
                    height="190px"
                    alt="Team Member 4"
                /></el-tooltip>
                <div class="grid-content ep-bg-purple-light" />
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 腳色設計 -->
        <div id="team" class="role-section">
          <el-row :gutter="24">
            <el-col :span="18">
              <img
                src="https://res.cloudinary.com/dsb5x7env/image/upload/v1756316687/J_%E6%AD%A4%E5%B2%B8_%E4%BA%BA%E7%89%A9_mbr7k8.png"
                alt=""
              />
              <div class="grid-content ep-bg-purple" />
            </el-col>
            <el-col :span="6" style="color: #d9d9d9">
              阿公身上穿著白色台灣老人常見的白色衛衣，下半身著短褲，腳上穿著藍白拖鞋，理著一頭短短的平頭，神情嚴肅個性頑固，是個久疏於和家人有所互動和溝通的老人，唯一的溫情只顯露在小孫女萱萱身上。
              <div class="grid-content ep-bg-purple" />
            </el-col>
          </el-row>
        </div>
      </div>

      <p id="storyboard" style="color: aliceblue">分鏡腳本Storyboard</p>
      <Carousel />

      <div class="lightbox-container">
        <LightBox />
      </div>

      <!-- 頁尾 -->
      <!-- <div class="footer-parallax">
        <div class="parallax-container">
          <div class="parallax-background"></div>
          <div class="parallax-content">
            <div class="cta-section">
              <h4>獲獎紀錄</h4>
              <p>
                2020放視大賞-實驗與混合媒材動畫組-金獎 <br />
                2020 德國紅點Red Dot Winner <br />
                2020哥倫比亞實驗短片國際影展- 動畫單元得主 Ganador Categoria Animacion <br />
                2020高雄電影節國際短片競賽-兒童評審團獎入圍 <br />
                2020青春有影大學杯動畫組-金獎 <br />
                2020新一代設計展-金點新秀設計獎年度最佳設計獎-入圍 <br />
                2020義大利CyBorg科幻影展-入圍 <br />
                2020泰達杯青年創意設計大賽-新加坡設計業總商會 特别獎 <br />
                2020臺灣國際學生創意設計大賽-數位動畫類入圍 <br />
                2020第16屆技專院校電腦動畫競賽-佳作
              </p>
            </div>
            <div class="footer-bottom"></div>
          </div>
        </div>
      </div> -->
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
                <p>&copy; 2024 此岸團隊.</p>
              </div>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24">
              <div class="footer-links">
                <a href="#concept" @click.prevent="scrollToSection('concept')">核心概念</a>
                <a href="#team" @click.prevent="scrollToSection('team')">團隊介紹</a>
                <a href="#storyboard" @click.prevent="scrollToSection('storyboard')">分鏡腳本</a>
                <a href="#awards" @click.prevent="scrollToSection('awards')">獲獎紀錄</a>
              </div>
            </el-col>
          </el-row>
          <!-- <div class="copyright">
            <p>&copy; 2024 此岸團隊. All rights reserved.</p>
          </div> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import LightBox from './LightBox.vue'

//文字坍塌
import { ElCollapse, ElCollapseItem } from 'element-plus'

const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log('坍塌項目變更為:', val)
}

// 輸入你的圖片路徑
const images = ref([
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316778/1-1_final_yc01yn.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316781/1-3_final_oweeeg.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316775/5-11_final_ncbjzl.jpg',
  'https://res.cloudinary.com/dsb5x7env/image/upload/v1756316777/6-5_1_final_ba94l3.jpg',
])

// 獲獎紀錄
const awards = ref([
  { name: '放視大賞', category: '實驗與混合媒材動畫組-金獎' },
  { name: '德國紅點', category: 'Red Dot Winner' },
  { name: '哥倫比亞實驗短片國際影展', category: '動畫單元得主' },
  { name: '新一代設計展', category: '金點新秀設計獎年度最佳設計獎-入圍' },
  { name: '義大利CyBorg科幻影展', category: '入圍' },
])

// 錨點跳轉功能
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<style scoped>
/* 重置和基本布局 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.el-main {
  overflow: hidden; /* 隱藏滾動軸 */
}

p {
  color: #d9d9d9;
}
.carousel-image {
  width: 100%;
  height: 400px; /* 可依需求調整高度 */
  object-fit: cover; /* 保持比例填滿容器 */
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__item .title {
  font-size: 1.2rem;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

/* 團隊區塊 */
.team-section {
  padding: 40px 20px;
  /* text-align: center; */
  margin-top: 40px;
  margin-bottom: 40px;
}

.team-section p {
  color: #d9d9d9;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 彈出對話框 */
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}

/* 腳色設計區塊 */
.role-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.role-section p {
  color: #d9d9d9;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.role-section img {
  width: 100%;
}

.parallax-container {
  position: relative;
  height: 100%;
}

.parallax-background {
  position: absolute;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: url('https://res.cloudinary.com/dsb5x7env/image/upload/v1756688251/000_c3wefp.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  will-change: transform;
}

.parallax-content {
  position: relative;
  z-index: 2;
  /* background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 50%); */
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding: 80px 20px 40px; */
}

.cta-section {
  text-align: center;
  /* margin-bottom: 80px; */
}

.cta-section h4 {
  font-size: 1rem;
  color: #d9d9d9;
  margin-bottom: 20px;
  font-weight: 700;
}

.cta-section p {
  font-size: 0.5rem;
  color: #d9d9d9;
  margin-bottom: 40px;
}

.footer-bottom {
  width: 100%;
  max-width: 1200px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 30px;
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
  color: #d9d9d9;
  font-size: 1rem;
  font-weight: 500;
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
  color: #d9d9d9;
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: 500;
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
