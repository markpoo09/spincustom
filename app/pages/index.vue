<template>
  <div class="home-page-wrapper">
    <div class="home-page">
      
      <!-- ==================== ORDER STATUS POPUP ==================== -->
      <Transition name="popup-slide">
        <div v-if="showOrderPopup && orderNotification" class="order-popup-overlay" @click.self="closePopup">
          <div class="order-popup-card">

            <!-- แถบสีสถานะด้านบน -->
            <div class="popup-status-bar" :style="{ background: currentStatus.color }"></div>

            <!-- ปุ่มปิด -->
            <button class="popup-close-btn" @click="closePopup">X</button>

            <!-- Header -->
            <div class="popup-header">
              <span class="popup-icon"><i :class="currentStatus.icon"></i></span>
              <div>
                <p class="popup-label">{{ orderNotification.source === 'admin_update' ? 'สถานะออเดอร์อัปเดตแล้ว' : 'ออเดอร์ของคุณลงระบบแล้ว!' }}</p>
                <h3 class="popup-status-text" :style="{ color: currentStatus.color }">{{ currentStatus.label }}</h3>
              </div>
            </div>

            <!-- Divider -->
            <div class="popup-divider"></div>

            <!-- Body -->
            <div class="popup-body">
              <div class="popup-row">
                <span class="popup-field">สินค้า</span>
                <span class="popup-value">{{ orderNotification.productName }}</span>
              </div>
              <div class="popup-row" v-if="orderNotification.totalPrice">
                <span class="popup-field">ยอดรวม</span>
                <span class="popup-value popup-price">฿{{ Number(orderNotification.totalPrice).toLocaleString() }}</span>
              </div>
              <div class="popup-row">
                <span class="popup-field">สถานะ</span>
                <span class="popup-status-badge" :style="{ color: currentStatus.color, borderColor: currentStatus.color }">
                  {{ currentStatus.label }}
                </span>
              </div>
              <p class="popup-desc">{{ currentStatus.desc }}</p>
            </div>

            <!-- Actions -->
            <div class="popup-actions">
              <NuxtLink to="/orders" class="popup-btn-primary" @click="closePopup">ดูออเดอร์ทั้งหมด</NuxtLink>
              <button class="popup-btn-ghost" @click="closePopup">ปิด</button>
            </div>

          </div>
        </div>
      </Transition>

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
              <h3 class="step-name">เลือกสีและลวดลาย</h3>
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
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/utils/firebase'

// ==================== Special Collection ====================
const specialData = ref({
  campaign_name: 'กำลังโหลด...',
  date_range: 'กำลังโหลด...',
  bg_image: '/bender_2.png',
  elements_image: '/elements_collection.png'
})

async function fetchSpecialCollection() {
  try {
    const q = query(collection(db, 'special_collections'), where('is_active', '==', true), limit(1))
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

// ==================== Order Status Popup ====================
// Map สถานะ → ข้อความ, icon class, สี, คำอธิบาย
const STATUS_CONFIG = {
  pending:    { label: 'รอดำเนินการ', icon: 'fa-solid fa-hourglass-start', color: '#FFB547', desc: 'ออเดอร์ของคุณอยู่ในคิว ทีมงานกำลังตรวจสอบ' },
  processing: { label: 'กำลังผลิต',   icon: 'fa-solid fa-cogs',          color: '#5C9EFF', desc: 'ทีมงานกำลังดำเนินการผลิตสินค้าของคุณอยู่' },
  completed:  { label: 'จัดส่งแล้ว',  icon: 'fa-solid fa-check-circle',   color: '#CDF100', desc: 'สินค้าถูกจัดส่งเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ!' },
  cancelled:  { label: 'ยกเลิกแล้ว',  icon: 'fa-solid fa-ban',            color: '#FF5C5C', desc: 'ออเดอร์นี้ถูกยกเลิก กรุณาติดต่อทีมงาน' },
}

const orderNotification = ref(null)
const showOrderPopup = ref(false)

const currentStatus = computed(() =>
  STATUS_CONFIG[orderNotification.value?.status] || { label: orderNotification.value?.status || '-', icon: 'fa-solid fa-box', color: '#aaa', desc: '' }
)

function closePopup() {
  showOrderPopup.value = false
  // ลบออกเพื่อไม่ให้โชว์ซ้ำเมื่อ refresh (เฉพาะ new_order)
  // admin_update ล้างเช่นกัน เพื่อป้องกันค้างหน้า
  localStorage.removeItem('spinLastOrder')
}

onMounted(async () => {
  fetchSpecialCollection()

  // ✅ ดึงข้อมูล spinLastOrder จาก localStorage
  try {
    const raw = localStorage.getItem('spinLastOrder')
    if (raw) {
      const data = JSON.parse(raw)
      orderNotification.value = data
      // หน่วงเล็กน้อยเพื่อให้ transition ทำงานสวยงาม
      setTimeout(() => { showOrderPopup.value = true }, 400)
    }
  } catch (e) {
    console.warn('spinLastOrder parse error:', e)
  }
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

/* ==================== Order Status Popup ==================== */
.order-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.order-popup-card {
  position: relative;
  background: #1e1e1a;
  border: 1px solid #333;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.8);
  font-family: 'Prompt', sans-serif;
}

/* แถบสีด้านบน */
.popup-status-bar {
  height: 8px;
  width: 100%;
  transition: background 0.3s;
}

.popup-close-btn {
  position: absolute;
  top: 18px;
  right: 20px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 8px;
  transition: 0.2s;
  z-index: 2;
}
.popup-close-btn:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

/* Header */
.popup-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 30px 32px 20px;
}
.popup-icon {
  font-size: 44px;
  line-height: 1;
  flex-shrink: 0;
  color: inherit;
}
.popup-icon i {
  display: inline-block;
}
.popup-label {
  font-size: 13px;
  color: #888;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.popup-status-text {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  font-family: 'Jura', sans-serif;
}

.popup-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 32px;
}

/* Body */
.popup-body {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.popup-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.popup-field {
  color: #777;
  font-size: 15px;
}
.popup-value {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
}
.popup-price {
  color: #CDF100;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Jura', sans-serif;
}
.popup-status-badge {
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
  padding: 5px 14px;
  border-radius: 20px;
}
.popup-desc {
  color: #666;
  font-size: 14px;
  margin: 6px 0 0 0;
  line-height: 1.6;
}

/* Actions */
.popup-actions {
  display: flex;
  gap: 12px;
  padding: 20px 32px 28px;
}
.popup-btn-primary {
  flex: 1;
  background: #CDF100;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-btn-primary:hover {
  background: #b8da00;
  transform: translateY(-1px);
}
.popup-btn-ghost {
  background: transparent;
  color: #888;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 14px 28px;
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}
.popup-btn-ghost:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
  border-color: #666;
}

/* Transition */
.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.popup-slide-enter-from,
.popup-slide-leave-to {
  opacity: 0;
  transform: scale(0.88) translateY(20px);
}

@media (max-width: 480px) {
  .order-popup-card { border-radius: 18px; }
  .popup-actions { flex-direction: column; }
  .popup-btn-ghost { text-align: center; }
  .popup-header { padding: 22px 20px 16px; }
  .popup-body { padding: 18px 20px; }
  .popup-actions { padding: 16px 20px 22px; }
  .popup-divider { margin: 0 20px; }
}
</style>