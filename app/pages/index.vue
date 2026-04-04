<template>
  <div class="home-page-wrapper">
    <div class="home-page">
      
      <section class="hero-section">
        <img src="/bender_1.png" class="hero-text-bg" alt="Text Background" />
        <img src="/elements-vinyl.png" alt="Elements Vinyl" class="hero-elements-vinyl spinning-record" />
        <img src="/elements-vinyl.png" alt="Elements Vinyl" class="hero-elements-vinyl2 spinning-record" />
        <img src="/elements-vinyl.png" alt="Elements Vinyl" class="hero-elements-vinyl3 spinning-record" />
        <img src="/elements-vinyl.png" alt="Elements Vinyl" class="hero-elements-vinyl4 spinning-record" />
        
        <div class="hero-content">
          <h3 class="brand-subtitle">SPINCUSTOM</h3>
          
          <h1 class="main-title">
            ออกแบบเครื่องเล่น<span class="highlight-green">แผ่นเสียง</span>
          </h1>
          
          <h2 class="sub-title-yellow">ในแบบของคุณ</h2>
          <p class="description">เพื่อหาดีไซน์ที่ใช่สไตล์ที่ชอบ</p>
          
          <div class="btn-primary-wrapper">
            <NuxtLink to="/custom" class="btn-primary">START CUSTOMIZING</NuxtLink>
          </div>
        </div>
      </section>

      <section class="special-collection-section">
        <div class="special-card">

          <img :src="specialData.bg_image" alt="Special Collection Background" class="special-bg-image"/>
          <img :src="specialData.elements_image" alt="Special Collection Elements" class="special-elements-image"/>

          <div class="special-content-overlay">
            <div class="special-content-top">
              <div class="special-badge">
                <span class="special-badge-text">คอลเลคชันสุดพิเศษ</span>
              </div>
              <div class="special-text-group">
                <p class="special-limited">LIMITED EDITION</p>
                <h2 class="special-title">{{ specialData.campaign_name }}</h2>
              </div>
            </div>

            <div class="special-content-bottom">
              <p class="special-date">
                <span class="text-highlight">ช่วงเวลาพิเศษ</span><br>
                {{ specialData.date_range }}
              </p>
              <div class="btn-special-wrapper">
                <!-- <button class="btn-special">START SPECIAL</button> -->
                <NuxtLink to="/specialcustom" class="btn-special">START SPECIAL</NuxtLink>
              </div>
            </div>

          </div> 
        </div>
      </section>

      <section class="how-it-works-section">
        <div class="how-it-works-header">
          <p class="section-subtitle">HOW TO WORKS</p>
          <h2 class="section-title">สิ่งที่ควรรู้ก่อนจะ<span class="text-highlight">ออกแบบ</span></h2>
          <p class="section-desc">แบ่งออกเป็น 5 ขั้นตอน ง่ายและรวดเร็ว</p>
        </div>

        <div class="steps-container">
          
          <div class="step-card">
            <div class="step-number-circle">1</div>
            <div class="step-text">
              <p class="step-label text-highlight">เลือกสไตล์</p>
              <h3 class="step-name">เลือกชนิดเครื่องเล่นแผ่นเสียง</h3>
              <p class="step-detail">เลือกชนิดที่ชอบตามไลฟ์สไตล์ของตนเอง เพื่อเป็นจุดเริ่มต้นในการออกแบบ</p>
            </div>
            <div class="step-number-bg">01</div>
          </div>
          
          <div class="step-card">
            <div class="step-number-circle">2</div>
            <div class="step-text">
              <p class="step-label text-highlight">ตกแต่ง</p>
              <h3 class="step-name">เลือกสี</h3>
              <p class="step-detail">เลือกสีที่ชอบในแต่ละจุดของเครื่องที่กำหนดไว้ให้ใช้สำหรับตกแต่ง</p>
            </div>
            <div class="step-number-bg">02</div>
          </div>

          <div class="step-card">
            <div class="step-number-circle">3</div>
            <div class="step-text">
              <p class="step-label text-highlight">ปรับแต่ง</p>
              <h3 class="step-name">เพิ่มความเป็นเจ้าของ</h3>
              <p class="step-detail">เขียนชื่อหรือตกแต่งด้วย stickers สวยๆ เพิ่มความเป็นตัวตนให้กับเครื่องเล่นของคุณ</p>
            </div>
            <div class="step-number-bg">03</div>
          </div>

          <div class="step-card">
            <div class="step-number-circle">4</div>
            <div class="step-text">
              <p class="step-label text-highlight">อัปโหลดรูป</p>
              <h3 class="step-name">ใส่รูปภาพลงบนแผ่นเสียง</h3>
              <p class="step-detail">อัปโหลดรูปภาพเพลงที่คุณชื่นชอบลงบนแผ่น รูปของคุณจะมีชีวิตขึ้นมาพร้อมเสียงเพลงเมื่อแผ่นเริ่มหมุนสร้างแผ่นที่เป็นเอกลักษณ์ไม่เหมือนใคร</p>
            </div>
            <div class="step-number-bg">04</div>
          </div>

          <div class="step-card">
            <div class="step-number-circle">5</div>
            <div class="step-text">
              <p class="step-label text-highlight">สรุปผล</p>
              <h3 class="step-name">ดูผลลัพธ์และดาวน์โหลด</h3>
              <p class="step-detail">แสดงผลลัพธ์ชิ้นงานที่ออกแบบไว้ สามารถดาวน์โหลดเก็บได้ พร้อมสรุปรายการค่าใช้จ่ายทั้งหมดในการออกแบบครั้งนี้</p>
            </div>
            <div class="step-number-bg">05</div>
          </div>
          
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/utils/firebase'

// 1. สร้างตัวแปรเก็บข้อมูล 
const specialData = ref({
  campaign_name: 'กำลังโหลด...',
  date_range: 'กำลังโหลด...',
  bg_image: '/bender_2.png',
  elements_image: '/elements_collection.png'
})

// 2. ฟังก์ชันดึงข้อมูลจาก Firebase
async function fetchSpecialCollection() {
  try {
    const q = query(
      collection(db, 'special_collections'), 
      where('is_active', '==', true), 
      limit(1)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data()
      specialData.value = {
        campaign_name: docData.campaign_name,
        date_range: docData.date_range,
        bg_image: docData.bg_image,
        elements_image: docData.elements_image
      }
    }
  } catch (error) {
    console.error("ดึงข้อมูล Firebase ไม่สำเร็จ: ", error)
  }
}

// 3. สั่งให้ทำงานทันทีที่เปิดหน้านี้
onMounted(() => {
  fetchSpecialCollection()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

/* ==================== สไตล์พื้นฐานของหน้า ==================== */
.home-page-wrapper {
  background-color: #20201A;
  min-height: 100vh;
}

.home-page {
  color: #ffffff;
  font-family: 'Prompt', sans-serif;
  max-width: 1440px;
  margin: 0 auto; 
  position: relative;
  overflow: hidden;
}

.text-highlight {
  color: #E6FF00;
}

/* ==================== 1. Hero Section ==================== */
.hero-section {
  position: relative;
  text-align: center;
  padding-top: 150px;
  padding-bottom: 150px;
  display: flex;
  justify-content: center;
}

.hero-text-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1440px;
  z-index: 1; 
}

/* แผ่นเสียงตกแต่ง */
.hero-elements-vinyl, .hero-elements-vinyl2, .hero-elements-vinyl3, .hero-elements-vinyl4 {
  position: absolute;
  width: 150px;
  z-index: 1; 
}
.hero-elements-vinyl { top: 5%; left: 5%; }
.hero-elements-vinyl2 { top: 30%; left: 5%; }
.hero-elements-vinyl3 { top: 50%; right: 5%; }
.hero-elements-vinyl4 { top: 75%; right: 5%; }

.spinning-record {
  animation: spin 5s linear infinite; 
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.hero-content {
  position: relative;
  z-index: 2; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Typography สำหรับ Hero */
.brand-subtitle {
  color: #FFF700;
  text-align: center;
  font-family: 'Jura', sans-serif;
  font-size: 50px;
  font-weight: 700;
  line-height: 150%; 
  letter-spacing: 15px;
  text-transform: uppercase;
  margin: 0 0 13px 0;
}

.main-title {
  color: #FFF;
  text-align: center;
  font-family: 'Prompt', sans-serif;
  font-size: 51.875px;
  font-weight: 500;
  line-height: 150%; 
  margin: 0;
}

.highlight-green {
  color: #CDF100;
  font-family: 'Prompt', sans-serif;
  font-size: 51.875px;
  font-weight: 500;
  line-height: 150%;
}

.sub-title-yellow {
  color: #FFF700;
  text-align: center;
  font-family: 'Prompt', sans-serif;
  font-size: 41.5px;
  font-weight: 300;
  line-height: 150%; 
  margin: 0 0 46px 0;
}

.description {
  color: #FFF;
  text-align: center;
  font-family: 'Prompt', sans-serif;
  font-size: 30px;
  font-weight: 300;
  line-height: 150%; 
  margin: 0 0 41px 0;
}

/* ปุ่ม START CUSTOMIZING */
.btn-primary-wrapper {
  width: min(487px, 90vw);
  height: 103px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='31' ry='31' stroke='%23FFF700' stroke-width='4' stroke-dasharray='15, 15' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  transition: transform 0.2s;
}
.btn-primary-wrapper:hover {
  transform: scale(1.03);
}

.btn-primary {
  width: 98%; 
  height: 90%;
  background-color: #FFF700;
  border: none;
  border-radius: 21px;
  color: #000;
  font-family: 'Jura', sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}
/* .btn-primary:hover {
  background-color: #CDF100;
} */

/* ==================== 2. Special Collection ==================== */
.special-collection-section {
  padding: 48px 20px;
  display: flex;
  justify-content: center;
}

.special-card {
  width: 100%;
  max-width: 1400px;
  position: relative;
}

.special-bg-image {
  width: 100%;
  height: auto;
  display: block;
}

.special-elements-image {
  position: absolute;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: auto;
  z-index: 1;
}

.special-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 80px 100px;
  box-sizing: border-box;
  z-index: 2;
}

/* Badge และข้อความด้านบน */
.special-badge {
  width: 467px;
  height: 84px;
  border-radius: 6px;
  background: #FFF700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 21px;
}

.special-badge-text {
  color: #000;
  text-align: center;
  font-family: 'Prompt', sans-serif;
  font-size: 35px;
  font-weight: 400;
  line-height: 150%; 
}

.special-limited {
  color: #FFF;
  font-family: 'Jura', sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 150%; 
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
}

.special-title {
  color: #FFF700;
  text-align: left;
  font-family: 'Prompt', sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 150%; 
  text-transform: uppercase;
  margin: 0;
}

/* ส่วนล่าง วันที่ + ปุ่ม */
.special-content-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.special-date { 
  font-family: 'Prompt', sans-serif;
  font-size: 1.1rem; 
  line-height: 1.5; 
  color: #FFF; 
  margin: 0;
}

.btn-special-wrapper {
  width: 340px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='31' ry='31' stroke='%23FFF700' stroke-width='4' stroke-dasharray='15, 15' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: transform 0.2s;
  cursor: pointer;
}
.btn-special-wrapper:hover {
  transform: scale(1.03);
}

.btn-special {
  width: 98%;
  height: 90%;
  background-color: #FFF700;
  border: none;
  border-radius: 21px;
  color: #000;
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;  /* เปลี่ยนจาก none เป็น auto เพื่อให้คลิกได้ */
  text-decoration: none;
}

/* ==================== 3. How it works ==================== */
.how-it-works-section {
  padding: 80px 10%;
}

.how-it-works-header { margin-bottom: 50px; }
.section-subtitle { color: #FFF700; letter-spacing: 2px; font-weight: 500; }
.section-title { font-size: 2.5rem; font-weight: 600; margin: 10px 0; }
.section-desc { color: #a0a0a0; font-size: 1.2rem; }

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-card {
  background-color: #232321;
  border-radius: 15px;
  padding: 35px;
  display: flex;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  border: 1px solid #333;
  transition: transform 0.2s, border-color 0.2s;
}
.step-card:hover {
  transform: translateX(8px);
  border-left: 3px solid #FFF700;
}

.step-number-circle {
  background-color: #FFF700;
  color: #000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-right: 25px;
  flex-shrink: 0;
}

.step-label { font-size: 1rem; margin: 0; font-weight: 500;}
.step-name { margin: 8px 0 12px 0; font-size: 1.5rem; font-weight: 500;}
.step-detail { color: #a0a0a0; font-size: 1.1rem; margin: 0; width: 80%; line-height: 1.6; }

.step-number-bg {
  position: absolute;
  right: 30px;
  top: 50%;
  font-family: 'Jura', sans-serif;
  transform: translateY(-50%);
  font-size: 6rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.03); 
}
@media (max-width: 768px) {
  .hero-elements-vinyl, .hero-elements-vinyl2,
  .hero-elements-vinyl3, .hero-elements-vinyl4 {
    display: none;
  }
}
</style>