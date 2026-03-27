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
          <div class="bg-curve"></div>
          
          <div class="canvas-wrapper">
            <canvas ref="canvasEl"></canvas>
          </div>

          <div class="product-info text-center mt-3">
            <h3 class="product-name">เป็นเครื่องที่ใช้งานง่าย ปรับน้อย</h3>
            <p class="product-desc">ไม่ต้องปรับหรือจูนเสียงให้ยุ่งยาก</p>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="arrow-btn btn-prev" @click="prevStep" :disabled="currentStep === 1">
            ◀●
          </button>
          <button class="arrow-btn btn-next" @click="nextStep" :disabled="currentStep === 6">
            ●▶
          </button>
        </div>
      </div>

      <div class="tools-section">
        
        <transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" class="step-container">
            <h3 class="step-title">ประเภทเครื่องเล่นแผ่นเสียง</h3>
            <div class="grid-2x2">
              <div v-for="i in 4" :key="i" class="type-card" 
                   :class="{ active: selectedType === i }"
                   @click="selectType(i)">
                <div class="thumb-placeholder">Type {{ i }}</div>
                <p v-if="selectedType === i" class="type-label">เป็นเครื่องที่เน้นใช้งานง่าย ปรับน้อย</p>
              </div>
            </div>
          </div>

        <div v-else-if="currentStep === 2" class="step-container">
            <h3 class="step-title">เลือกสีและลวดลาย</h3>
            <div class="tools-grid-2">
              <div class="tool-panel">
                <h4 class="panel-title">แต่งสีตามใจ</h4>
                <div class="color-groups">
                  <div class="color-group" v-for="(label, key) in colorParts" :key="key">
                    <p class="part-label">{{ label }}</p>
                    <div class="color-swatches">
                      <button v-for="color in fixedColors" :key="color"
                              class="swatch" 
                              :style="{ backgroundColor: color }"
                              :class="{ active: selectedColors[key] === color }"
                              @click="applyColor(key, color)"></button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tool-panel">
                <h4 class="panel-title">แต่งลวดลายตามใจ</h4>
                <div class="pattern-grid">
                  <div class="pattern-item" v-for="i in 4" :key="i">แบบที่{{ i }}</div>
                </div>
              </div>
            </div>
          </div>

        <div v-else-if="currentStep === 3" class="step-container">
            <h3 class="step-title">เพิ่มความเป็นเจ้าของ</h3>
            <div class="tools-grid-2">
              <div class="tool-panel">
                <h4 class="panel-title mb-3">เขียนชื่อ</h4>
                <input type="text" v-model="customText" class="custom-input mb-3" placeholder="ใส่ชื่อของคุณ...">
                <div class="d-flex gap-2">
                  <button class="btn-dark-small" @click="customText = ''">ลบชื่อ</button>
                  <button class="btn-yellow-small" @click="addTextToCanvas">ยืนยัน</button>
                </div>
              </div>

              <div class="tool-panel">
                <h4 class="panel-title mb-3">เลือกประเภทของสติกเกอร์</h4>
                <div class="d-flex gap-2 mb-3">
                  <button class="btn-yellow-small w-100">แบบที่1</button>
                  <button class="btn-dark-small w-100">แบบที่2</button>
                </div>
                <div class="sticker-grid">
                  <div v-for="i in 6" :key="i" class="sticker-item" @click="addSticker(i)">
                    Sticker {{ i }}
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div v-else-if="currentStep === 4" class="step-container">
            <h3 class="step-title">ใส่รูปภาพลงบนแผ่นเสียง</h3>
            <div class="tool-panel mb-4">
              <h4 class="panel-title mb-3">อัปโหลดรูปลงแผ่นเสียง</h4>
              <div class="upload-box">อัปโหลดรูปลงแผ่นเสียง</div>
              <div class="d-flex gap-2 mt-3 justify-content-center">
                <button class="btn-dark-small px-5">ยกเลิก</button>
                <button class="btn-yellow-small px-5">ยืนยัน</button>
              </div>
            </div>
            
            <div class="tool-panel">
              <h4 class="panel-title mb-3">อัปโหลดเสียง</h4>
              <div class="upload-box small">อัปโหลดเสียง</div>
              <div class="d-flex gap-2 mt-3 justify-content-center">
                <button class="btn-dark-small px-5">ยกเลิก</button>
                <button class="btn-yellow-small px-5">ยืนยัน</button>
              </div>
            </div>
          </div>

        <div v-else-if="currentStep === 5" class="step-container">
            <div class="text-center mb-4">
              <button class="btn-primary-large" @click="nextStep">START</button>
            </div>
            <h3 class="step-title">ดูผลลัพธ์</h3>
            <div class="summary-panel">
              <h4 class="mb-4">สรุปรายการทั้งหมด</h4>
              <div class="summary-row"><p>เครื่องเล่นแผ่นเสียงแบบที่ 1</p><p>4,000 ฿</p></div>
              <div class="summary-row"><p>สีและลวดลาย</p><p>500 ฿</p></div>
              <div class="summary-row"><p>ชื่อและสติกเกอร์</p><p>300 ฿</p></div>
              <hr class="border-secondary my-4">
              <div class="summary-row total"><h4>ราคารวม</h4><h4 class="text-white">4,800 บาท</h4></div>
            </div>
          </div>

        <div v-else-if="currentStep === 6" class="step-container text-center">
             <button class="btn-primary-wrapper mb-4">
               <span class="btn-primary-inner">DOWNLOAD</span>
             </button>
             <br>
             <button class="btn-dark-large">เล่นใหม่</button>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as fabric from 'fabric'

// ================= STATE =================
const currentStep = ref(1)
const progressPercentage = computed(() => (currentStep.value / 6) * 100)

const canvasEl = ref(null)
let fCanvas = null

// ข้อมูลสำหรับ Step 2
const selectedType = ref(1)
const fixedColors = ['#FFFFFF', '#FF0000', '#0000FF', '#000000', '#FFF700']
const colorParts = {
  body: 'ส่วนตัวเครื่อง',
  side: 'ส่วนฐานเครื่อง',
  button: 'ส่วนปุ่ม',
  tonearm: 'ส่วนก้านเข็ม'
}
const selectedColors = ref({ body: '#FFFFFF', side: '#FFFFFF', button: '#FFFFFF', tonearm: '#FFFFFF' })
const customText = ref('')

// ================= FABRIC.JS LOGIC =================
onMounted(() => {
  // สร้าง Canvas
  fCanvas = new fabric.Canvas(canvasEl.value, {
    width: 600,
    height: 400,
    backgroundColor: '#ffffff' // พื้นหลังชั่วคราวให้เห็น Canvas
  })
  
  // โหลดชิ้นส่วนเริ่มต้น (มาร์คเปลี่ยนลิงก์เป็นรูป .png ของตัวเองได้เลย)
  loadTurntableParts()
})

async function loadTurntableParts() {
  // ตัวอย่าง: โหลด Body
  // *ข้อควรระวัง: เปลี่ยน URL ด้านล่างให้ตรงกับโฟลเดอร์ public ของคุณ
  const parts = [
    { id: 'body', url: '/customizer/body.png', zIndex: 0 },
    { id: 'side', url: '/customizer/side.png', zIndex: 1 },
    { id: 'button', url: '/customizer/button.png', zIndex: 2 },
    { id: 'tonearm', url: '/customizer/tonearm.png', zIndex: 3 }
  ]

  // ถ้ายังไม่มีรูป ให้วาดกล่องสี่เหลี่ยมจำลองไปก่อนเพื่อทดสอบระบบสี
  parts.forEach(part => {
    const rect = new fabric.Rect({
      left: 100 + (part.zIndex * 50), top: 100, width: 200, height: 150,
      fill: '#cccccc', id: part.id, selectable: false
    })
    fCanvas.add(rect)
  })
  
  /* // วิธีโหลดภาพ PNG จริง (เปิดคอมเมนต์เมื่อมีรูป)
  for (const part of parts) {
    fabric.Image.fromURL(part.url, (img) => {
      img.set({ id: part.id, selectable: false })
      img.scaleToWidth(600)
      fCanvas.insertAt(img, part.zIndex)
    })
  }
  */
}

// ฟังก์ชันเปลี่ยนสี
function applyColor(partId, hexColor) {
  selectedColors.value[partId] = hexColor
  
  // หา Object ใน Canvas ที่มี id ตรงกัน
  const obj = fCanvas.getObjects().find(o => o.id === partId)
  if (obj) {
    // ถ้ารูปเป็น Image ให้ใช้ Filter (Tint)
    if (obj.type === 'image') {
      obj.filters = [new fabric.Image.filters.BlendColor({
        color: hexColor, mode: 'tint', alpha: 1
      })]
      obj.applyFilters()
    } else {
      // ถ้าเป็น Rect จำลอง ให้เปลี่ยน fill
      obj.set('fill', hexColor)
    }
    fCanvas.renderAll()
  }
}

// ฟังก์ชันเพิ่มข้อความ (Step 3)
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

// ฟังก์ชันเพิ่มสติกเกอร์จำลอง (Step 3)
function addSticker(id) {
  // ใส่เป็นข้อความจำลองไปก่อน ถ้ามีรูปลอกลิงก์มาใส่ Fabric.Image ได้เลย
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
  background-color: #1a1a17; /* สีพื้นหลังดำอมเขียวตามแบบ */
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

/* ================= PREVIEW AREA ================= */
.preview-section { margin-bottom: 30px; }
.preview-card {
  background-color: #6a6a62; /* สีเทาอมเขียวของกล่องพรีวิว */
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.bg-curve {
  position: absolute; top: 20%; left: 5%; right: 5%; bottom: -50%;
  /* border: 1px solid rgba(255,255,255,0.2); */
  border-radius: 50% 50% 0 0;
  pointer-events: none;
}
.canvas-wrapper {
  background: transparent;
  width: 100%; max-width: 600px;
  aspect-ratio: 3/2;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1;
}
.product-name { color: #CDF100; font-size: 24px; font-weight: 500; margin-top: 20px; z-index: 1; position: relative;}
.product-desc { color: #ddd; font-size: 14px; z-index: 1; position: relative;}

/* Arrows */
.nav-arrows { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.arrow-btn { background: #fff; border: none; padding: 5px 15px; cursor: pointer; border-radius: 0; }
.arrow-btn.btn-next { background: #CDF100; }
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ================= TOOLS BOTTOM AREA ================= */
.step-container { animation: fadeIn 0.3s ease; }
.step-title { color: #CDF100; font-size: 24px; font-weight: 500; margin-bottom: 20px; }

/* Step 1: Grid */
.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.type-card { background-color: #6a6a62; border-radius: 12px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border: 2px solid transparent;}
.type-card.active { border-color: #FFF700; }
.thumb-placeholder { background: #eee; width: 60%; height: 60%; color: #333; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.type-label { font-size: 12px; color: #FFF700; margin: 0; }

/* Step 2 & 3: Panels */
.tools-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tool-panel { background-color: #6a6a62; border-radius: 12px; padding: 25px; }
.panel-title { font-size: 18px; font-weight: 500; margin-bottom: 20px; }

/* Colors */
.color-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.part-label { font-size: 14px; color: #CDF100; margin-bottom: 8px; }
.color-swatches { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch { width: 35px; height: 25px; border-radius: 4px; border: 2px solid transparent; cursor: pointer; }
.swatch.active { border-color: #CDF100; transform: scale(1.1); }
.pattern-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.pattern-item { background: #888; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;}

/* Inputs & Buttons Small */
.custom-input { width: 100%; padding: 12px; border-radius: 6px; border: none; outline: none; }
.btn-yellow-small { background: #CDF100; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-dark-small { background: #222; color: #CDF100; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
.sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.sticker-item { background: #eee; height: 70px; border-radius: 8px; color: #000; display: flex; align-items: center; justify-content: center; cursor: pointer;}

/* Step 4: Upload */
.upload-box { background: #fff; color: #666; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.upload-box.small { height: 80px; }

/* Step 5: Summary */
.btn-primary-large { background: #FFF700; color: #000; border: 2px dashed #000; border-radius: 40px; padding: 15px 60px; font-family: 'Jura'; font-size: 24px; cursor: pointer; }
.summary-panel { background: #2a2a24; border-radius: 12px; padding: 30px; }
.summary-row { display: flex; justify-content: space-between; color: #aaa; margin-bottom: 10px; }
.summary-row.total { color: #CDF100; }

/* Step 6: Download */
.btn-primary-wrapper { width: 340px; height: 80px; background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='31' ry='31' stroke='%23FFF700' stroke-width='4' stroke-dasharray='15, 15' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e"); border-radius: 31px; display: inline-flex; align-items: center; justify-content: center; padding: 8px; background-color: transparent; border: none; cursor: pointer;}
.btn-primary-inner { width: 100%; height: 100%; background-color: #FFF700; border-radius: 21px; color: #000; font-family: 'Jura'; font-size: 24px; display: flex; align-items: center; justify-content: center; }
.btn-dark-large { background: #111; color: #CDF100; border: none; border-radius: 12px; padding: 15px 60px; font-size: 20px; cursor: pointer;}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>