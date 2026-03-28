<template>
  <div class="customizer-layout">
    <div class="container-main">
      
      <div class="header-section text-center">
            <p class="customizing-text">CUSTOMIZING</p>
            <h1 class="title-text">เริ่มการ<span class="highlight-yellow">ออกแบบ</span></h1>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
      </div>

      <div class="preview-section">
        <div class="preview-card position-relative">
          <!-- <div class="bg-curve"></div> -->
          
          <div class="canvas-wrapper">
            <canvas ref="canvasEl"></canvas>
          </div>

          <div v-if="!isProductsLoading && vinylTypes.length > 0" class="product-info-block d-flex flex-column align-items-center mt-3 text-center">
            <h3 class="product-name">{{ vinylTypes[selectedType - 1]?.name }}</h3>
            <p class="product-desc">{{ vinylTypes[selectedType - 1]?.desc }}</p>
          </div>
          <div v-else class="product-info-block mt-3 text-center text-white">
            <p>กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="arrow-btn btn-prev" @click="prevStep" :disabled="currentStep === 1">
            <div class="arrow-left">
              <img src="/arrow_left.png" alt="Previous">
            </div>
          </button>
          <button class="arrow-btn btn-next" @click="nextStep" :disabled="currentStep === 6">
            <div class="arrow-right">
              <img src="/arrow_right.png" alt="Next">
            </div>
          </button>
        </div>
      </div>

      <div class="tools-section">
        
        <transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" class="step-container">
            <h3 class="step-title">ประเภทเครื่องเล่นแผ่นเสียง</h3>
            
            <div v-if="isProductsLoading" class="text-center text-white py-4">
              กำลังโหลดข้อมูลจากฐานข้อมูล...
            </div>
            
            <div v-else class="grid-2x2">
              <div v-for="(item, index) in vinylTypes" :key="item.id || index" 
                   class="type-card" 
                   :class="{ active: selectedType === index + 1 }"
                   @click="selectType(index + 1)">
                <div class="thumb-placeholder">
                  <img :src="item.image" :alt="item.name" class="type-image">
                </div>
                <p v-if="selectedType === index + 1" class="type-label">{{ item.label || item.name }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="step-container">
             <h3 class="step-title">เลือกสีและลวดลาย</h3>
             <div class="tool-panel">ยังไม่ได้เชื่อมต่อระบบเลือกสีจริง</div>
          </div>

          <div v-else class="step-container">
            <h3 class="step-title">ขั้นตอนที่ {{ currentStep }}</h3>
            <p>ยังไม่ได้ทำส่วนนี้</p>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue' 
import * as fabric from 'fabric'

import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/utils/firebase'

// ================= STATE =================
const currentStep = ref(1)
const progressPercentage = computed(() => (currentStep.value / 6) * 100)

const canvasEl = ref(null)
let fCanvas = null

// [แก้ไข] ข้อมูลสำหรับ Step 1 ให้เป็นตัวแปรว่างๆ รอรับจาก Firebase
const selectedType = ref(1)
const vinylTypes = ref([]) 
const isProductsLoading = ref(true)

// ข้อมูลสำหรับ Step 2 (ลวดลายและสี - ของเดิม)
const patterns = ref(['/pattern_1.png', '/pattern_2.png', '/pattern_3.png', '/pattern_4.png'])
const fixedColors = ['#FFFFFF', '#FF0000', '#0000FF', '#000000', '#FFF700']
const colorParts = {
  body: 'ส่วนตัวเครื่อง',
  side: 'ส่วนข้างเครื่อง',
  button: 'ส่วนปุ่ม',
  tonearm: 'ส่วนก้านเข็ม'
}
const selectedColors = ref({ body: '#FFFFFF', side: '#FFFFFF', button: '#FFFFFF', tonearm: '#FFFFFF' })
const customText = ref('')

// ================= FIREBASE & FABRIC.JS LOGIC =================
onMounted(async () => {
  // 1. สร้างพื้นที่ Canvas เปล่าๆ ก่อน
  fCanvas = new fabric.Canvas(canvasEl.value, {
    width: 600,
    height: 400,
    backgroundColor: '#ffffff'
  })
  
  // 2. เรียกฟังก์ชันดึงข้อมูลสินค้าจาก Firebase
  await fetchProducts()
})

// [เพิ่มใหม่] ฟังก์ชันดึงข้อมูลจาก Firebase
const fetchProducts = async () => {
  isProductsLoading.value = true
  try {
    const q = query(collection(db, 'products'), orderBy('id', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const loadedProducts = []
    querySnapshot.forEach((doc) => {
      loadedProducts.push({ docId: doc.id, ...doc.data() })
    })
    
    vinylTypes.value = loadedProducts

    // 3. พอได้ข้อมูลมาแล้ว ค่อยสั่งให้โชว์รูปบน Canvas
    if(vinylTypes.value.length > 0) {
      await updatePreviewImage()
    }

  } catch (error) {
    console.error("ดึงข้อมูล Firebase ไม่สำเร็จ:", error)
  } finally {
    isProductsLoading.value = false
  }
}

// ฟังก์ชันโหลดรูปลง Canvas
async function updatePreviewImage() {
  if (!fCanvas || vinylTypes.value.length === 0) return;
  fCanvas.clear(); 
  
  // ป้องกัน Error หากข้อมูลใน Array ยังไม่มา
  const currentType = vinylTypes.value[selectedType.value - 1];
  if (!currentType || !currentType.image) return;

  try {
    const img = await fabric.FabricImage.fromURL(currentType.image, { crossOrigin: 'anonymous' });
    const scaleFactor = Math.min(600 / img.width, 400 / img.height) * 0.9;
    
    img.set({
      scaleX: scaleFactor,
      scaleY: scaleFactor,
      left: fCanvas.width / 2, 
      top: fCanvas.height / 2, 
      originX: 'center', 
      originY: 'center',
      selectable: false 
    });
    
    fCanvas.add(img);
    fCanvas.renderAll();
  } catch (error) {
    console.error("โหลดรูปภาพลง Canvas ไม่สำเร็จ: ", error);
  }
}

watch(selectedType, async () => {
  await updatePreviewImage();
})

// ... (ฟังก์ชัน applyColor, addText, addSticker ของเดิมปล่อยไว้ก่อนได้เลยครับ)

function addTextToCanvas() {
  if (!customText.value) return
  const text = new fabric.IText(customText.value, {
    left: 300, top: 200, originX: 'center', originY: 'center',
    fontFamily: 'Prompt', fontSize: 30, fill: '#000000'
  })
  fCanvas.add(text)
  fCanvas.setActiveObject(text)
  customText.value = ''
}

function addSticker(id) {
  const sticker = new fabric.IText('⭐ สติกเกอร์ ' + id, {
    left: 300, top: 100, fontSize: 40
  })
  fCanvas.add(sticker)
  fCanvas.setActiveObject(sticker)
}

// ================= NAVIGATION =================
function nextStep() { if (currentStep.value < 6) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }
function selectType(id) { selectedType.value = id }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

/* ================= VARIABLES & GLOBAL ================= */
.customizer-layout {
  background-color: #1a1a17;
  min-height: 100vh;
  color: #fff;
  font-family: 'Prompt', sans-serif;
  padding-bottom: 50px;
}
.container-main { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.highlight-yellow { color: #CDF100; }

/* ================= HEADER ================= */
.customizing-text { color: #FFF700; font-family: 'Jura', sans-serif; letter-spacing: 2px; margin-bottom: 5px; }
.title-text { font-size: 36px; font-weight: 600; margin-bottom: 20px; }
.progress-bar-container { width: 100%; height: 8px; background-color: #333; border-radius: 4px; overflow: hidden; margin-bottom: 40px; }
.progress-bar-fill { height: 100%; background-color: #CDF100; transition: width 0.3s ease; }
/* บังคับให้ส่วนหัวทั้งหมดอยู่ตรงกลางจอ */
.header-section {
  display: flex;
  flex-direction: column; /* จัดเรียงจากบนลงล่าง */
  align-items: center;    /* บังคับให้อยู่กึ่งกลางแนวนอน */
  justify-content: center;
  width: 100%;
}

.customizing-text, .title-text {
  text-align: center; /* บังคับให้ตัวหนังสือจัดกลาง */
}

/* ================= PREVIEW AREA ================= */
.preview-section { margin-bottom: 30px; }
.preview-card {
  background-color: #6a6a62;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center; /* จัดสิ่งของภายในกล่องให้อยู่กึ่งกลางแนวขวาง */
  overflow: hidden;
}
.bg-curve {
  position: absolute; top: 20%; left: 5%; right: 5%; bottom: -50%;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50% 50% 0 0;
  pointer-events: none;
}
.canvas-wrapper {
  background: transparent;
  width: 100%; max-width: 600px;
  aspect-ratio: 3/2;
  /* box-shadow: 0 10px 30px rgba(0,0,0,0.3); */
  z-index: 1;
}

/* [อัปเดต CSS] คลาสสำหรับกลุ่มข้อความด้านบน เพื่อให้อยู่ตรงกลางเป๊ะ */
.product-info-block {
  z-index: 1;
  position: relative;
  width: 100%; /* ให้เต็มความกว้าง */
}

.product-name { 
  color: #CDF100; 
  font-size: 24px; 
  font-weight: 500; 
  margin: 15px 0 5px 0; /* จัดช่องไฟ */
  text-align: center; /* จัดข้อความให้อยู่กึ่งกลางภายในตัวเอง */
}
.product-desc { 
  color: #ddd; 
  font-size: 14px; 
  margin: 0;
  text-align: center; /* จัดข้อความให้อยู่กึ่งกลางภายในตัวเอง */
}

/* Arrows (คงเดิม) */
.nav-arrows { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.arrow-btn { background: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 0; font-size: 16px; font-weight: bold; color: #000;}
.arrow-btn.btn-next { background: #CDF100; }
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.arrow-left, .arrow-right {
  width: 60px; height: 40px;
  display: flex; align-items: center; justify-content: center;
}
.arrow-left img, .arrow-right img {
  width: 100%; height: 100%;
  object-fit: contain;
} 

/* ================= TOOLS BOTTOM AREA (คงเดิม) ================= */
.step-container { animation: fadeIn 0.3s ease; }
.step-title { color: #CDF100; font-size: 24px; font-weight: 500; margin-bottom: 20px; }

/* Step 1: Grid */
.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.type-card { background-color: #6a6a62; border-radius: 12px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border: 2px solid transparent; text-align: center;}
.type-card.active { border-color: #FFF700; }
.thumb-placeholder { width: 100%; height: 70%; display: flex; align-items: center; justify-content: center; overflow: hidden;}
.type-image { max-width: 80%; max-height: 80%; object-fit: contain; }
.type-label { font-size: 12px; color: #FFF700; margin: 0; padding: 5px 10px 10px 10px; line-height: 1.2; }

/* Step Panels (จำลอง) */
.tool-panel { background-color: #6a6a62; border-radius: 12px; padding: 25px; text-align: center; color: #aaa;}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Fade transition for step changes */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>