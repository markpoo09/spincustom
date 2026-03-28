<template>
  <div class="customizer-layout">
    <div class="container-main">
      
      <div class="header-section text-center">
        <p class="customizing-text text-danger">SPECIAL CUSTOMIZING</p>
        <h1 class="title-text">รุ่นพิเศษ <span class="highlight-yellow">Limited Edition</span></h1>
        <div class="progress-bar-container mt-3">
            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%', backgroundColor: '#ff5555' }"></div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-card position-relative" style="border: 2px solid #ff5555;">
          <div class="bg-curve"></div>
          
          <div class="canvas-wrapper">
            <canvas ref="canvasEl"></canvas>
          </div>

          <div v-if="!isProductsLoading && vinylTypes.length > 0" class="product-info-block d-flex flex-column align-items-center mt-3 text-center">
            <h3 class="product-name" style="color: #ff5555;">★ {{ vinylTypes[selectedType - 1]?.name }} ★</h3>
            <p class="product-desc">{{ vinylTypes[selectedType - 1]?.desc }}</p>
          </div>
          <div v-else class="product-info-block mt-3 text-center text-white">
            <p>กำลังโหลดข้อมูลรุ่นพิเศษ...</p>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="arrow-btn btn-prev" @click="prevStep" :disabled="currentStep === 1">
            <div class="arrow-left">
              <img src="/arrow_left.png" alt="Previous">
            </div>
          </button>
          <button class="arrow-btn btn-next" @click="nextStep" :disabled="currentStep === 6" style="background-color: #ff5555; color: white;">
            <div class="arrow-right">
              <img src="/arrow_right.png" alt="Next">
            </div>
          </button>
        </div>
      </div>

      <div class="tools-section">
        
        <transition name="fade" mode="out-in">
          
          <div v-if="currentStep === 1" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">เลือกรุ่นพิเศษ</h3>
            
            <div v-if="isProductsLoading" class="text-center text-white py-4">
              กำลังค้นหาเครื่องเล่นรุ่นลิมิเต็ด...
            </div>
            
            <div v-else class="grid-2x2">
              <div v-for="(item, index) in vinylTypes" :key="item.id || index" 
                   class="type-card special-card" 
                   :class="{ active: selectedType === index + 1 }"
                   @click="selectType(index + 1)">
                <div class="thumb-placeholder">
                  <img :src="item.image" :alt="item.name" class="type-image">
                </div>
                <p v-if="selectedType === index + 1" class="type-label" style="color: #ff5555;">{{ item.label || item.name }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">ออกแบบลวดลายพิเศษ</h3>
            
            <div v-if="selectedType !== 1" class="text-center text-white py-5">
              <p>ขณะนี้ระบบย้อมสีเปิดให้ทดสอบเฉพาะรุ่นแรกเท่านั้นครับ</p>
              <button @click="selectType(1)" class="btn-primary mt-3" style="background-color: #ff5555;">
                กลับไปเลือกรุ่นแรก
              </button>
            </div>

            <div v-else class="tools-grid-2">
              <div class="tool-panel">
                <h4 class="panel-title mb-4">แต่งสีตามใจ</h4>
                <div class="color-groups-wrapper">
                  <div class="color-group mb-3" v-for="(label, partId) in colorParts" :key="partId">
                    <p class="part-label mb-2" style="color: #ff5555;">{{ label }}</p>
                    <div class="color-swatches d-flex flex-wrap gap-2 justify-content-center">
                      <button v-for="color in fixedColors" :key="color"
                              class="swatch" 
                              :style="{ backgroundColor: color }"
                              :class="{ active: selectedColors[partId] === color }"
                              @click="applyColor(partId, color)"></button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tool-panel">
                <h4 class="panel-title mb-4">แต่งลวดลายตามใจ</h4>
                <div class="pattern-grid">
                  <div class="pattern-item" v-for="(pattern, index) in patterns" :key="index" @click="applyPattern(pattern, index)">
                    <p class="pattern-label mb-1" style="color: #ff5555;">ลายที่ {{ index + 1 }}</p>
                    <div class="pattern-image-wrapper" :class="{ 'border-active-special': selectedPatternIndex === index }">
                      <img :src="pattern" alt="Pattern" class="pattern-image">
                    </div>
                  </div>
                  <div class="pattern-item" @click="applyPattern(null, -1)">
                    <p class="pattern-label mb-1 text-white">ไม่มีลวดลาย</p>
                    <div class="pattern-image-wrapper text-center d-flex align-items-center justify-content-center" :class="{ 'border-active-special': selectedPatternIndex === -1 }" style="background-color: #333;">
                      <span style="font-size: 24px; color: #555;">✖</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">เพิ่มความเป็นเจ้าของ</h3>
            
            <div class="tools-grid-2">
              <div class="tool-panel">
                <h4 class="panel-title mb-4">พิมพ์ข้อความ</h4>
                <input type="text" v-model="customText" placeholder="ใส่ข้อความที่นี่..." class="custom-input mb-3">
                <button @click="addTextToCanvas" class="btn-primary-full" style="background-color: #ff5555; color: #fff;">เพิ่มข้อความลงเครื่อง</button>
              </div>

              <div class="tool-panel">
                <h4 class="panel-title mb-4">ตกแต่งด้วยสติกเกอร์</h4>
                <div class="sticker-grid">
                  <button v-for="sticker in stickersList" :key="sticker" @click="addSticker(sticker)" class="sticker-btn special-btn">
                    {{ sticker }}
                  </button>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
               <button @click="deleteSelectedObject" class="btn-danger">🗑️ ลบสิ่งที่เลือก</button>
            </div>
          </div>

          <div v-else-if="currentStep === 4" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">ใส่รูปภาพลงบนแผ่นเสียง</h3>
            <div class="tool-panel text-center py-5">
              <h4 class="panel-title mb-4 text-white">อัปโหลดรูปภาพหน้าปกเพลงของคุณ</h4>
              <input type="file" accept="image/*" @change="handleVinylImageUpload" id="vinyl-upload" style="display: none;">
              <label for="vinyl-upload" class="btn-primary-full d-inline-block cursor-pointer" style="background-color: #ff5555; color: #fff; width: auto; padding: 15px 30px; margin-bottom: 10px;">
                📷 เลือกรูปภาพจากเครื่อง
              </label>
              <p class="text-white" style="font-size: 14px; opacity: 0.7;">รูปภาพจะถูกตัดเป็นวงกลมและวางลงบนแผ่นเสียงอัตโนมัติ</p>
              <button v-if="hasVinylImage" @click="removeVinylImage" class="btn-danger mt-3">ลบรูปภาพแผ่นเสียง</button>
            </div>
          </div>

          <div v-else-if="currentStep === 5" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">สรุปผลการออกแบบ</h3>
            <div class="tool-panel">
              <h4 class="panel-title mb-4">รายการสรุปของคุณ</h4>
              <div class="summary-details text-white" style="opacity: 0.9; line-height: 1.8;">
                <div class="d-flex justify-content-between border-bottom pb-2 mb-2" style="border-color: #444 !important;">
                  <span>เครื่องเล่นรุ่นพิเศษ: {{ vinylTypes[selectedType - 1]?.name || 'กำลังโหลด...' }}</span>
                  <span>{{ vinylTypes[selectedType - 1]?.base_price || 0 }} ฿</span>
                </div>
                <div class="d-flex justify-content-between border-bottom pb-2 mb-2" style="border-color: #444 !important;">
                  <span>ค่าปรับแต่งสีและลวดลาย</span>
                  <span style="color: #ff5555;">ฟรี</span>
                </div>
                <div class="d-flex justify-content-between border-bottom pb-2 mb-3" style="border-color: #444 !important;">
                  <span>พิมพ์รูปภาพลงแผ่นเสียง</span>
                  <span>{{ hasVinylImage ? '150' : '0' }} ฿</span>
                </div>
                <div class="d-flex justify-content-between mt-4">
                  <span style="font-size: 20px; color: #ff5555;">ยอดรวมโดยประมาณ</span>
                  <span style="font-size: 24px; color: #ff5555; font-weight: 600;">
                    {{ (vinylTypes[selectedType - 1]?.base_price || 0) + (hasVinylImage ? 150 : 0) }} ฿
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 6" class="step-container">
            <h3 class="step-title" style="color: #ff5555;">เสร็จสิ้นการออกแบบ!</h3>
            <div class="tool-panel text-center py-5">
              <h4 class="panel-title mb-3" style="font-size: 28px; color: #ff5555;">เยี่ยมมาก! 🎉</h4>
              <p class="text-white mb-5" style="opacity: 0.8;">ผลงานเครื่องเล่นแผ่นเสียงรุ่นลิมิเต็ดของคุณพร้อมแล้ว</p>
              <div class="d-flex flex-column gap-3 align-items-center justify-content-center">
                <button @click="downloadDesign" class="btn-primary-full" style="background-color: #ff5555; color: #fff; max-width: 300px; padding: 15px;">
                  📥 ดาวน์โหลดรูปภาพ
                </button>
                <button @click="saveOrderToFirebase" class="btn-primary-full mt-2" style="background-color: #333; color: #fff; max-width: 300px; padding: 15px; border: 1px solid #ff5555;">
                  💾 บันทึกแบบลงระบบ
                </button>
              </div>
            </div>
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

// [แก้ไขดึงข้อมูลจาก special_collections]
const selectedType = ref(1)
const vinylTypes = ref([]) 
const isProductsLoading = ref(true)

const colorParts = {
  'turntable-body-side': 'ฐานเครื่องล่าง',
  'turntable-body-top': 'ตัวเครื่องด้านบน',
  'turntable-tonearm': 'ก้านเข็ม (Tonearm)',
  'turntable-platter': 'จานหมุน (Platter)',
  'turntable-buttons': 'ปุ่มกด'
}
const fixedColors = ['#FFFFFF', '#FF0000', '#0000FF', '#000000', '#FFF700', '#FF00FF', '#00FFFF'] // เพิ่มสีพิเศษ
const selectedColors = ref({
  'turntable-body-side': '#FFFFFF', 'turntable-body-top': '#FFFFFF', 'turntable-tonearm': '#FFFFFF',
  'turntable-platter': '#000000', 'turntable-buttons': '#CCCCCC'
})

const patterns = ref(['/pattern_1.png', '/pattern_2.png', '/pattern_3.png', '/pattern_4.png'])
const selectedPatternIndex = ref(-1) 
let currentPatternOverlayObj = null;

const customText = ref('')
const stickersList = ['💎', '👑', '🌟', '🚀', '🔥', '🏆', '💯', '💰'] // เปลี่ยนสติกเกอร์ให้ดู Exclusive

// ================= FIREBASE LOGIC =================
onMounted(async () => {
  fCanvas = new fabric.Canvas(canvasEl.value, { width: 600, height: 400, backgroundColor: '#ffffff' })
  await fetchProducts()
})

const fetchProducts = async () => {
  isProductsLoading.value = true
  try {
    // เปลี่ยนจาก 'products' เป็น 'special_collections'
    const q = query(collection(db, 'special_collections'), orderBy('id', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const loadedProducts = []
    querySnapshot.forEach((doc) => {
      loadedProducts.push({ docId: doc.id, ...doc.data() })
    })
    
    vinylTypes.value = loadedProducts

    if(vinylTypes.value.length > 0) {
      await loadAndComposeTurntable() 
    }
  } catch (error) {
    console.error("ดึงข้อมูล Firebase ไม่สำเร็จ:", error)
  } finally {
    isProductsLoading.value = false
  }
}

// ================= FABRIC.JS LOGIC =================
async function loadAndComposeTurntable() {
  if (!fCanvas) return;
  fCanvas.clear(); 
  const currentType = vinylTypes.value[selectedType.value - 1];
  if (!currentType) return;

  let layers = [];
  let geometricLayers = [];

  if (selectedType.value === 1) {
    layers = [
      { id: 'turntable-body-side', url: '/bottom_vinyle_1.png', zIndex: 0, scale: 0.9 }, 
      { id: 'turntable-body-top', url: '/body_vinyle_1.png', zIndex: 1, scale: 0.9 },   
      { id: 'turntable-tonearm', url: '/tonearm_vinyl_3.png', zIndex: 2, scale: 0.9 }   
    ];
    geometricLayers = [
      { id: 'turntable-platter', type: 'circle', radius: 100, color: '#000000', zIndex: 1.5, left: 300, top: 200, originX: 'center', originY: 'center' },
      { id: 'turntable-buttons', type: 'circle', radius: 15, color: '#CCCCCC', zIndex: 3, left: 100, top: 310, originX: 'center', originY: 'center' },
      { id: 'turntable-buttons', type: 'circle', radius: 15, color: '#CCCCCC', zIndex: 3, left: 150, top: 310, originX: 'center', originY: 'center' }
    ];
  } else {
    layers = [{ id: 'turntable-full', url: currentType.image || '/vinyl_1.png', zIndex: 0, scale: 0.9 }];
  }

  const loadLayerImage = (layer) => {
    return fabric.FabricImage.fromURL(layer.url, { crossOrigin: 'anonymous' }).then((img) => {
      const scaleFactor = Math.min(600 / img.width, 400 / img.height) * layer.scale;
      img.set({
        id: layer.id, scaleX: scaleFactor, scaleY: scaleFactor, left: fCanvas.width / 2, top: fCanvas.height / 2,
        originX: 'center', originY: 'center', selectable: false 
      });
      fCanvas.insertAt(img, layer.zIndex);
      return img;
    });
  }

  const loadLayerGeometric = (layer) => {
    let shape = new fabric.Circle({
      id: layer.id, radius: layer.radius, fill: layer.color, left: layer.left, top: layer.top,
      originX: layer.originX || 'left', originY: layer.originY || 'top', selectable: false
    });
    fCanvas.insertAt(shape, layer.zIndex);
    return shape;
  }

  try {
    await Promise.all([...layers.map(loadLayerImage), ...geometricLayers.map(loadLayerGeometric)]);
    fCanvas.renderAll();
  } catch (error) {
    console.error("Error:", error);
  }
}

function applyColor(partId, hexColor) {
  selectedColors.value[partId] = hexColor;
  const objects = fCanvas.getObjects().filter(o => o.id === partId);
  objects.forEach(obj => {
    if (obj instanceof fabric.FabricImage) {
      if (hexColor === '#FFFFFF') { obj.filters = []; } 
      else { obj.filters = [new fabric.filters.BlendColor({ color: hexColor, mode: 'tint', alpha: 0.6 })]; }
      obj.applyFilters();
    } else { obj.set('fill', hexColor); }
  });
  fCanvas.renderAll();
}

async function applyPattern(patternUrl, index) {
  if (!fCanvas) return;
  selectedPatternIndex.value = index;
  if (currentPatternOverlayObj) { fCanvas.remove(currentPatternOverlayObj); currentPatternOverlayObj = null; }
  if (!patternUrl) { fCanvas.renderAll(); return; }

  const bodyTop = fCanvas.getObjects().find(o => o.id === 'turntable-body-top');
  if (!bodyTop) return;

  try {
    const patImg = await fabric.FabricImage.fromURL(patternUrl, { crossOrigin: 'anonymous' });
    patImg.set({
      scaleX: bodyTop.scaleX, scaleY: bodyTop.scaleY, left: bodyTop.left, top: bodyTop.top,
      originX: 'center', originY: 'center', opacity: 0.5, selectable: false, id: 'pattern-overlay'
    });
    fCanvas.insertAt(patImg, 1.1);
    currentPatternOverlayObj = patImg;
    fCanvas.renderAll();
  } catch (error) { console.error("Error:", error); }
}

watch(selectedType, async () => {
  await loadAndComposeTurntable();
  selectedPatternIndex.value = -1;
  currentPatternOverlayObj = null;
})

function addTextToCanvas() {
  if (!customText.value || !fCanvas) return
  const text = new fabric.IText(customText.value, {
    left: 300, top: 100, originX: 'center', originY: 'center',
    fontFamily: 'Prompt', fontSize: 30, fill: '#ff5555', selectable: true, id: 'custom-text'
  })
  fCanvas.add(text)
  fCanvas.setActiveObject(text)
  customText.value = ''
}

function addSticker(emoji) {
  if (!fCanvas) return
  const sticker = new fabric.IText(emoji, {
    left: 300, top: 100, originX: 'center', originY: 'center', fontSize: 50, selectable: true, id: 'custom-sticker'
  })
  fCanvas.add(sticker)
  fCanvas.setActiveObject(sticker)
}

function deleteSelectedObject() {
  if (!fCanvas) return;
  const activeObj = fCanvas.getActiveObject();
  if (activeObj && !['turntable-body-side', 'turntable-body-top', 'turntable-tonearm', 'turntable-platter', 'turntable-buttons', 'pattern-overlay', 'vinyl-custom-image'].includes(activeObj.id)) {
     fCanvas.remove(activeObj);
  }
}

const hasVinylImage = ref(false)
let currentVinylImageObj = null

function handleVinylImageUpload(event) {
  const file = event.target.files[0];
  if (!file || !fCanvas) return;
  const reader = new FileReader();
  reader.onload = function(f) {
    const data = f.target.result;
    fabric.FabricImage.fromURL(data).then((img) => {
      const platter = fCanvas.getObjects().find(o => o.id === 'turntable-platter');
      if (!platter) return;
      if (currentVinylImageObj) fCanvas.remove(currentVinylImageObj);
      const scale = (platter.radius * 2) / Math.min(img.width, img.height);
      const clipPath = new fabric.Circle({ radius: platter.radius, originX: 'center', originY: 'center' });
      img.set({ left: platter.left, top: platter.top, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, clipPath: clipPath, selectable: false, id: 'vinyl-custom-image' });
      fCanvas.insertAt(img, fCanvas.getObjects().indexOf(platter) + 1);
      currentVinylImageObj = img;
      hasVinylImage.value = true;
      fCanvas.renderAll();
    });
  };
  reader.readAsDataURL(file);
}

function removeVinylImage() {
   if (currentVinylImageObj && fCanvas) {
      fCanvas.remove(currentVinylImageObj);
      currentVinylImageObj = null;
      hasVinylImage.value = false;
      fCanvas.renderAll();
   }
}

// ================= NAVIGATION =================
function nextStep() { if (currentStep.value < 6) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }
function selectType(id) { selectedType.value = id }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

/* ================= VARIABLES & GLOBAL ================= */
.customizer-layout { background-color: #1a1a17; min-height: 100vh; color: #fff; font-family: 'Prompt', sans-serif; padding-bottom: 50px; }
.container-main { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.highlight-yellow { color: #CDF100; }
.text-danger { color: #ff5555 !important; }

.header-section { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
.customizing-text { font-family: 'Jura', sans-serif; letter-spacing: 2px; margin-bottom: 5px; text-align: center; font-weight: bold;}
.title-text { font-size: 36px; font-weight: 600; margin-bottom: 20px; text-align: center;}
.progress-bar-container { width: 100%; height: 8px; background-color: #333; border-radius: 4px; overflow: hidden; margin-bottom: 40px; }
.progress-bar-fill { height: 100%; transition: width 0.3s ease; }

.preview-section { margin-bottom: 30px; }
.preview-card { background-color: #2a2a2a; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; align-items: center; overflow: hidden; }
.bg-curve { position: absolute; top: 20%; left: 5%; right: 5%; bottom: -50%; border: 1px solid rgba(255, 85, 85, 0.4); border-radius: 50% 50% 0 0; pointer-events: none; z-index: 1; }
.canvas-wrapper { background: transparent; width: 100%; max-width: 600px; aspect-ratio: 3/2; z-index: 2; }
.product-info-block { z-index: 2; position: relative; width: 100%; }
.product-name { font-size: 24px; font-weight: 700; margin: 15px 0 5px 0; text-align: center; }
.product-desc { color: #ddd; font-size: 14px; margin: 0; text-align: center; }

.nav-arrows { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.arrow-btn { background: #fff; border: none; padding: 10px 20px; cursor: pointer; font-size: 16px; font-weight: bold; color: #000;}
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.arrow-left, .arrow-right { width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; }
.arrow-left img, .arrow-right img { width: 100%; height: 100%; object-fit: contain; } 

.step-container { animation: fadeIn 0.3s ease; }
.step-title { font-size: 24px; font-weight: 500; margin-bottom: 20px; }

.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.type-card { background-color: #333; border-radius: 12px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border: 2px solid transparent; text-align: center;}
.type-card.active { border-color: #ff5555; box-shadow: 0 0 15px rgba(255, 85, 85, 0.3); }
.thumb-placeholder { width: 100%; height: 70%; display: flex; align-items: center; justify-content: center; overflow: hidden;}
.type-image { max-width: 80%; max-height: 80%; object-fit: contain; }
.type-label { font-size: 12px; margin: 0; padding: 5px 10px 10px 10px; line-height: 1.2; font-weight: bold;}

.tools-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tool-panel { background-color: #2a2a2a; border-radius: 12px; padding: 25px; height: 100%; border: 1px solid #444; }
.panel-title { font-size: 18px; font-weight: 500; text-align: center; }

.color-swatches button.swatch { width: 35px; height: 35px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: 0.2s; }
.color-swatches button.swatch:hover { transform: scale(1.1); }
.color-swatches button.swatch.active { border-color: #ff5555; box-shadow: 0 0 10px rgba(255, 85, 85, 0.4); }

.pattern-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.pattern-item { display: flex; flex-direction: column; gap: 5px; cursor: pointer;}
.pattern-label { font-size: 12px; margin: 0; text-align: center;}
.pattern-image-wrapper { width: 100%; height: 60px; border-radius: 8px; border: 2px solid transparent; transition: 0.2s; overflow: hidden; display: flex; align-items: center; justify-content: center;}
.pattern-image { width: 100%; height: 100%; object-fit: cover; }
.pattern-item:hover .pattern-image-wrapper { border-color: #ff5555; }
.border-active-special { border-color: #ff5555 !important; box-shadow: 0 0 10px rgba(255, 85, 85, 0.4); }

.custom-input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #444; background-color: #111; color: #fff; outline: none; font-family: 'Prompt'; }
.custom-input:focus { border-color: #ff5555; }
.sticker-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.sticker-btn { background-color: #333; border: 1px solid #444; border-radius: 8px; font-size: 24px; padding: 10px; cursor: pointer; transition: 0.2s; }
.sticker-btn:hover { background-color: #444; transform: scale(1.1); border-color: #ff5555; }

.btn-danger { background-color: transparent; color: #ff5555; border: 1px solid #ff5555; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-family: 'Prompt'; cursor: pointer; transition: 0.2s; }
.btn-danger:hover { background-color: #ff5555; color: #fff; }
.cursor-pointer { cursor: pointer; }
.d-inline-block { display: inline-block; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>