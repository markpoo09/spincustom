<template>
  <div class="customizer-layout">
    <div class="container-main">
      <div class="header-section text-center">
        <p class="customizing-text">CUSTOMIZING</p>
        <h1 class="title-text">
          เริ่มการ<span class="highlight-yellow">ออกแบบ</span>
        </h1>
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
          <div class="product-info-block d-flex flex-column align-items-center mt-3 text-center">
            <h3 class="product-name">{{ vinylTypes[selectedType - 1].name }}</h3>
            <p class="product-desc">{{ vinylTypes[selectedType - 1].desc }}</p>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="arrow-btn btn-prev" @click="prevStep" :disabled="currentStep === 1">◀</button>
          <button class="arrow-btn btn-next" @click="nextStep" :disabled="currentStep === 6">▶</button>
        </div>
      </div>

      <div class="tools-section">
        <transition name="fade" mode="out-in">

          <!-- ==================== STEP 1 ==================== -->
          <div v-if="currentStep === 1" class="step-container">
            <h3 class="step-title">ประเภทเครื่องเล่นแผ่นเสียง</h3>
            <div class="grid-2x2">
              <div
                v-for="(item, index) in vinylTypes"
                :key="index"
                class="type-card"
                :class="{ active: selectedType === index + 1 }"
                @click="selectType(index + 1)"
              >
                <div class="thumb-placeholder">
                  <img :src="item.image" :alt="item.name" class="type-image" />
                </div>
                <p v-if="selectedType === index + 1" class="type-label">{{ item.label }}</p>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 2 ==================== -->
          <div v-else-if="currentStep === 2" class="step-container">
            <h3 class="step-title text-center">เลือกสีและลวดลาย</h3>

            <div class="step-content-wrapper-large">
              <div class="tool-panel">
                <div class="preview-svg-container">
                  <h4 class="panel-title mb-3 text-center">ตัวอย่างการปรับแต่ง</h4>
                  <div class="svg-wrapper">
                    <Vinyl
                      :type="selectedType"
                      :width="420"
                      :height="280"
                      :color1="selectedColors.body"
                      :color2="selectedColors.side"
                      :color3="selectedColors.button"
                      :color4="selectedColors.tonearm"
                    />
                  </div>
                </div>

                <div class="divider-line my-4"></div>

                <div class="color-selection-container">
                  <h4 class="panel-title mb-4 text-center">แต่งสีตามใจ</h4>
                  <div class="color-groups-wrapper">
                    <div class="color-group" v-for="(label, partId) in colorParts" :key="partId">
                      <p class="part-label">{{ label }}</p>
                      <div class="color-controls">
                        <button
                          v-for="color in presetColors"
                          :key="color"
                          class="color-swatch"
                          :style="{ backgroundColor: color }"
                          :class="{ active: selectedColors[partId] === color }"
                          @click="applyColor(partId, color)"
                        ></button>
                        <div class="color-divider"></div>
                        <div class="custom-color-wrapper" :class="{ active: !presetColors.includes(selectedColors[partId]) }">
                          <div v-if="!presetColors.includes(selectedColors[partId])" class="custom-color-preview" :style="{ backgroundColor: selectedColors[partId] }"></div>
                          <!-- <span v-else class="custom-color-icon">🎨</span> -->
                          <PickColor class="pick-color-input" :modelValue="selectedColors[partId]" @update:modelValue="(val) => applyColor(partId, val)" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="text-center mt-4">
                    <button @click="resetColors" class="btn-reset">
                      <span>รีเซ็ตสีทั้งหมด</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 3 ==================== -->
          <div v-else-if="currentStep === 3" class="step-container">
            <h3 class="step-title">เพิ่มความเป็นเจ้าของ</h3>
            <div class="tools-grid-2">
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">เขียนชื่อ</h4>
                <input type="text" v-model="customText" placeholder="พิมพ์ชื่อของคุณ..." class="custom-input mb-4">
                <div class="d-flex gap-2">
                  <button @click="removeTextFromCanvas" class="btn-dark-grey flex-fill">ลบชื่อ</button>
                  <button @click="addTextToCanvas" class="btn-yellow flex-fill">ยืนยัน</button>
                </div>
              </div>
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">เลือกประเภทของสติ๊กเกอร์</h4>
                <div class="d-flex gap-2 mb-4">
                  <button class="btn-tab flex-fill" :class="{ active: activeStickerTab === 1 }" @click="activeStickerTab = 1">แบบที่ 1</button>
                  <button class="btn-tab flex-fill" :class="{ active: activeStickerTab === 2 }" @click="activeStickerTab = 2">แบบที่ 2</button>
                </div>
                <div v-if="isStickersLoading" class="text-center text-white">กำลังโหลด...</div>
                <div v-else class="sticker-grid-3x2">
                  <div v-for="sticker in filteredStickers" :key="sticker.id" class="sticker-box" @click="addStickerToCanvas(sticker)">
                    <img :src="sticker.image" class="sticker-img" />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button @click="deleteSelectedObject" class="btn-danger-outline">ลบสิ่งที่เลือกในภาพ</button>
            </div>
          </div>

          <!-- ==================== STEP 4 ==================== -->
          <div v-else-if="currentStep === 4" class="step-container">
            <h3 class="step-title">วางแผ่นเสียงและปรับแต่ง</h3>
            <div class="tools-grid-2">

              <!-- Panel ซ้าย: วางแผ่น + รูปภาพ -->
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-3">แผ่นเสียง</h4>

                <div v-if="!vinylDiscPlaced" class="place-disc-area">
                  <div class="disc-preview-static">
                    <svg viewBox="0 0 200 200" width="120" height="120">
                      <circle cx="100" cy="100" r="98" fill="#111" stroke="#444" stroke-width="2"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#222" stroke-width="1.5"/>
                      <circle cx="100" cy="100" r="65" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                      <circle cx="100" cy="100" r="50" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                      <circle cx="100" cy="100" r="35" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
                      <circle cx="100" cy="100" r="6" fill="#CDF100"/>
                    </svg>
                  </div>
                  <p class="hint-text">กดปุ่มด้านล่างเพื่อวางแผ่นเสียงบนเครื่อง</p>
                  <button @click="placeVinylDisc" class="btn-yellow" style="width:100%">
                    วางแผ่นเสียง
                  </button>
                </div>

                <div v-else class="placed-controls">
                  <div class="status-badge">วางแผ่นเสียงแล้ว — ลากเพื่อย้ายตำแหน่ง</div>
                  <div class="divider-line"></div>

                  <h5 class="sub-label">รูปภาพบนแผ่น</h5>
                  <label class="upload-box" :class="{ 'has-file': discImageURL }">
                    <input type="file" accept="image/*" @change="handleDiscImageUpload" hidden />
                    <div v-if="!discImageURL" class="upload-inner">
                      <!-- <span class="upload-icon">📷</span> -->
                      <span>คลิกเพื่ออัปโหลดรูป</span>
                      <span class="upload-hint">PNG, JPG (จะถูก crop เป็นวงกลม)</span>
                    </div>
                    <div v-else class="upload-preview-wrap">
                      <img :src="discImageURL" class="upload-preview-img" />
                      <span class="replace-text">คลิกเพื่อเปลี่ยนรูป</span>
                    </div>
                  </label>

                  <button v-if="discImageURL" @click="applyImageToDisc" class="btn-yellow" style="width:100%;margin-top:8px">
                     ใช้รูปนี้บนแผ่นเสียง
                  </button>
                  <button @click="removeVinylDisc" class="btn-danger-outline" style="width:100%;margin-top:8px">
                     ลบแผ่นเสียง
                  </button>
                </div>
              </div>

              <!-- Panel ขวา: เสียง -->
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-3">เสียงประกอบ</h4>

                <label class="upload-box" :class="{ 'has-file': audioFile }">
                  <input type="file" accept="audio/*" @change="handleAudioUpload" hidden />
                  <div v-if="!audioFile" class="upload-inner">
                    <!-- <span class="upload-icon">🎵</span> -->
                    <span>คลิกเพื่ออัปโหลดเสียง</span>
                    <span class="upload-hint">MP3, WAV, OGG</span>
                  </div>
                  <div v-else class="upload-inner">
                    <!-- <span class="upload-icon">✅</span> -->
                    <span class="text-lime">{{ audioFile.name }}</span>
                    <span class="upload-hint">คลิกเพื่อเปลี่ยนไฟล์</span>
                  </div>
                </label>

                <div v-if="audioURL" style="margin-top:12px">
                  <audio ref="audioPreviewEl" :src="audioURL" controls class="audio-ctrl"></audio>
                </div>

                <div v-if="!audioFile" class="hint-text" style="margin-top:12px">
                   เพิ่มเสียงเพื่อให้แผ่นหมุนใน Step ถัดไป
                </div>
              </div>

            </div>
          </div>

          <!-- ==================== STEP 5 ==================== -->
          <div v-else-if="currentStep === 5" class="step-container">
            <h3 class="step-title">แผ่นเสียงหมุน </h3>

            <audio ref="audioPlayerEl" v-if="audioURL" :src="audioURL" @ended="isPlaying = false" @timeupdate="updateProgress"></audio>

            <div class="player-center">
              <div class="turntable-stage">
                <div class="spinning-disc" :class="{ playing: isPlaying }">
                  <svg viewBox="0 0 300 300" width="260" height="260">
                    <circle cx="150" cy="150" r="148" fill="#111" stroke="#333" stroke-width="2"/>
                    <circle cx="150" cy="150" r="130" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                    <circle cx="150" cy="150" r="112" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                    <circle cx="150" cy="150" r="95" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                    <circle cx="150" cy="150" r="78" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
                    <clipPath id="spinLabelClip">
                      <circle cx="150" cy="150" r="55"/>
                    </clipPath>
                    <circle cx="150" cy="150" r="55" fill="#222"/>
                    <image
                      v-if="discImageURL"
                      :href="discImageURL"
                      x="95" y="95" width="110" height="110"
                      clip-path="url(#spinLabelClip)"
                      preserveAspectRatio="xMidYMid slice"
                    />
                    <circle cx="150" cy="150" r="7" fill="#CDF100"/>
                  </svg>
                  <div class="disc-shimmer"></div>
                </div>

                <div class="eq-bars" :class="{ active: isPlaying }">
                  <span v-for="i in 9" :key="i" class="eq-bar" :style="{ animationDelay: (i * 0.08) + 's' }"></span>
                </div>
              </div>

              <div class="player-controls">
                <div class="progress-track" @click="seekAudio">
                  <div class="progress-fill" :style="{ width: audioProgress + '%' }"></div>
                </div>
                <div class="time-labels">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(audioDuration) }}</span>
                </div>
                <div class="control-btns">
                  <button class="ctrl-btn" @click="togglePlay" :disabled="!audioURL">
                    <span>{{ isPlaying ? '⏸' : '▶' }}</span>
                  </button>
                  <button class="ctrl-btn" @click="stopAudio" :disabled="!audioURL">⏹</button>
                </div>
                <div v-if="!audioURL" class="hint-text" style="margin-top:8px;text-align:center">
                  ยังไม่มีเสียง — กลับไป Step 4 เพื่อเพิ่มเสียง
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 6 ==================== -->
          <div v-else-if="currentStep === 6" class="step-container">
            <h3 class="step-title">สรุปและดาวน์โหลด </h3>

            <div class="tools-grid-2">
              <!-- สรุปราคา -->
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4"> สรุปราคา</h4>
                <div class="price-list">
                  <div class="price-row">
                    <span>เครื่องเล่นแผ่นเสียง</span>
                    <span class="price-val">฿{{ basePrice.toLocaleString() }}</span>
                  </div>
                  <div class="price-row" v-if="discImageURL">
                    <span>การพิมพ์รูปบนแผ่นเสียง</span>
                    <span class="price-val">฿500</span>
                  </div>
                  <div class="price-row" v-for="(sticker, idx) in placedStickers" :key="idx">
                    <span>สติกเกอร์ (x1)</span>
                    <span class="price-val">฿{{ (sticker.stickerPrice || 50).toLocaleString() }}</span>
                  </div>
                  <div class="price-row" v-if="hasCustomName">
                    <span>ชื่อ Custom</span>
                    <span class="price-val">฿200</span>
                  </div>
                  <div class="price-divider"></div>
                  <div class="price-row total-row">
                    <span>รวมทั้งหมด</span>
                    <span class="price-total">฿{{ totalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <!-- ดาวน์โหลด -->
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4"> ดาวน์โหลดผลงาน</h4>
                <div class="download-preview mb-3">
                  <canvas ref="thumbCanvasEl" width="300" height="200" class="thumb-canvas"></canvas>
                </div>
                <button @click="downloadCanvas" class="btn-yellow" style="width:100%;margin-bottom:8px">
                   ดาวน์โหลดรูปภาพ (PNG)
                </button>
                <button @click="saveOrder" class="btn-yellow" style="width:100%;margin-bottom:8px; background-color: #CDF100; color: #000;" :disabled="isSavingOrder">
                  {{ isSavingOrder ? 'กำลังบันทึก...' : ' บันทึกออเดอร์ลงระบบ' }}
                </button>
                <button @click="shareDesign" class="btn-dark-grey" style="width:100%">
                  คัดลอก Link แชร์
                </button>
                <div v-if="copySuccess" class="share-success"> คัดลอก URL แล้ว!</div>
              </div>
            </div>

            <!-- Order card -->
            <div class="order-card">
              <div class="order-card-inner">
                <div class="order-icon">🎵</div>
                <div class="order-detail">
                  <p class="order-title">{{ vinylTypes[selectedType - 1].name }}</p>
                  <p class="order-sub">สีตัวเครื่อง: {{ selectedColors.body }} · สีข้าง: {{ selectedColors.side }}</p>
                </div>
                <div class="order-price">฿{{ totalPrice.toLocaleString() }}</div>
              </div>
            </div>

            <!-- ==================== ปุ่มเริ่มใหม่ ==================== -->
            <div class="restart-section">
              <div class="restart-divider">
                <span class="restart-divider-text">หรือ</span>
              </div>
              <button @click="resetAll" class="btn-restart">
                <!-- <span class="restart-icon">🔄</span> -->
                <span>ออกแบบใหม่อีกครั้ง</span>
              </button>
              <p class="restart-hint">เริ่มต้นใหม่ตั้งแต่ Step 1 — การออกแบบปัจจุบันจะถูกล้าง</p>
            </div>

          </div>

        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/utils/firebase'
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from 'vue-router' // 
import * as fabric from "fabric";
import Vinyl from "../../component/Vinyl.vue";
import PickColor from "../../component/PickColor.vue";
import { collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';

// ================= STATE =================
const router = useRouter()
const currentStep = ref(1);
const progressPercentage = computed(() => (currentStep.value / 6) * 100);
const isSavingOrder = ref(false);

const canvasEl = ref(null);
let fCanvas = null;

// Step 1
const selectedType = ref(1);
const vinylTypes = ref([
  { id: 1, name: "เป็นเครื่องที่ใช้งานง่าย ปรับน้อย", desc: "ไม่ต้องปรับหรือจูนเสียงให้ยุ่งยาก", label: "เป็นเครื่องที่เน้นใช้งานง่าย ปรับน้อย", image: "/vinyl_1.png" },
  { id: 2, name: "ดีไซน์คลาสสิก ลำโพงในตัว", desc: "เหมาะสำหรับผู้เริ่มต้น", label: "ดีไซน์คลาสสิก ลำโพงในตัว", image: "/vinyl_2.png" },
  { id: 3, name: "พกพาง่าย สไตล์กระเป๋าหิ้ว", desc: "พกพาไปได้ทุกที่", label: "พกพาง่าย สไตล์กระเป๋าหิ้ว", image: "/vinyl_3.png" },
  { id: 4, name: "ระดับโปร ปรับแต่งได้ทุกจุด", desc: "สำหรับออดิโอไฟล์ตัวจริง", label: "ระดับโปร ปรับแต่งได้ทุกจุด", image: "/vinyl_4.png" },
]);

// Step 2
const presetColors = ['#222222', '#F5F5F5', '#CDF100'];
const colorParts = { body: "ส่วนตัวเครื่อง", side: "ส่วนข้างเครื่อง", button: "ส่วนปุ่ม", tonearm: "ส่วนก้านเข็ม" };
const selectedColors = ref({ body: "#FFFFFF", side: "#FFFFFF", button: "#FFFFFF", tonearm: "#FFFFFF" });

// Step 3
const customText = ref("");
const stickersList = ref([]);
const isStickersLoading = ref(true);
const activeStickerTab = ref(1);
const filteredStickers = computed(() => stickersList.value.filter(s => s.type === activeStickerTab.value));

// ✅ FIX: reactive counter เพื่อให้ Vue track การเปลี่ยนแปลงใน canvas
const stickerCount = ref(0);
const canvasObjectVersion = ref(0); // general reactive trigger สำหรับ canvas objects

const fetchStickers = async () => {
  isStickersLoading.value = true;
  try {
    const q = query(collection(db, 'stickers'));
    const querySnapshot = await getDocs(q);
    const loadedStickers = [];
    querySnapshot.forEach((doc) => { loadedStickers.push({ docId: doc.id, ...doc.data() }); });
    stickersList.value = loadedStickers;
  } catch (error) {
    console.error("ดึงข้อมูลสติกเกอร์ไม่สำเร็จ:", error);
  } finally {
    isStickersLoading.value = false;
  }
};

// Step 4
const vinylDiscPlaced = ref(false);
const discImageURL = ref(null);
const discImageFile = ref(null);
const audioFile = ref(null);
const audioURL = ref(null);
const audioPreviewEl = ref(null);

// Step 5
const isPlaying = ref(false);
const audioPlayerEl = ref(null);
const audioProgress = ref(0);
const currentTime = ref(0);
const audioDuration = ref(0);

// Step 6
const thumbCanvasEl = ref(null);
const copySuccess = ref(false);

// ---- ราคา ----
const basePrices = [3500, 4500, 3800, 6500];
const basePrice = computed(() => basePrices[selectedType.value - 1]);

// เช็คว่าล็อกอินอยู่ไหม
const isLoggedIn = ref(false)

onMounted(async () => {
  // ดักจับสถานะล็อกอินทันทีที่เปิดหน้าเว็บ
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});
// ✅ FIX: placedStickers อ่าน stickerCount เพื่อให้ Vue track reactivity
const placedStickers = computed(() => {
  stickerCount.value; // touch reactive dep
  canvasObjectVersion.value; // touch reactive dep
  return fCanvas ? fCanvas.getObjects().filter(o => o.id === 'custom-sticker') : [];
});

// ✅ FIX: hasCustomName ก็ต้อง reactive เช่นกัน
const hasCustomName = computed(() => {
  canvasObjectVersion.value; // touch reactive dep
  return fCanvas ? fCanvas.getObjects().some(o => o.id === 'custom-name-text') : false;
});

const totalPrice = computed(() => {
  let total = basePrice.value;
  if (discImageURL.value) total += 500;
  if (hasCustomName.value) total += 200;
  // ✅ FIX: ใช้ stickerPrice จาก object property (set ตอน add)
  placedStickers.value.forEach(s => {
    total += (typeof s.stickerPrice === 'number' ? s.stickerPrice : 50);
  });
  return total;
});

// ================= FABRIC.JS INIT =================
onMounted(async () => {
  fCanvas = new fabric.Canvas(canvasEl.value, {
    width: 600,
    height: 400,
    backgroundColor: '#ffffff',
  });
  await updatePreviewImage();
  await fetchStickers();
});

// ================= BASE LAYER HELPERS =================
function clearBaseLayer() {
  if (!fCanvas) return;
  const baseObj = fCanvas.getObjects().find(o => o.id === 'base-vinyl');
  if (baseObj) fCanvas.remove(baseObj);
}

async function updatePreviewImage() {
  if (!fCanvas) return;
  const currentType = vinylTypes.value[selectedType.value - 1];
  if (!currentType?.image) return;
  clearBaseLayer();
  try {
    const img = await fabric.FabricImage.fromURL(currentType.image, { crossOrigin: 'anonymous' });
    const scaleFactor = Math.min(600 / img.width, 400 / img.height) * 0.9;
    img.set({ id: 'base-vinyl', scaleX: scaleFactor, scaleY: scaleFactor, left: fCanvas.width / 2, top: fCanvas.height / 2, originX: 'center', originY: 'center', selectable: false, evented: false });
    fCanvas.insertAt(0, img);
    fCanvas.renderAll();
  } catch (error) {
    console.error('โหลดรูปภาพลง Canvas ไม่สำเร็จ:', error);
  }
}

function getVinylSVGString() {
  const c1 = selectedColors.value.body, c2 = selectedColors.value.side, c3 = selectedColors.value.button, c4 = selectedColors.value.tonearm, t = selectedType.value;
  if (t === 1) return `<svg width="617" height="430" viewBox="0 0 617 430" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="616" height="429" fill="${c1}" stroke="#4B4A2D"/><rect x="0.5" y="0.5" width="616" height="361" fill="${c2}" stroke="#4B4A2D"/><circle cx="318" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/><circle cx="318" cy="180.999" r="56.5693" fill="black"/><circle cx="318" cy="181" r="4.52555" fill="#4B4A2D"/><circle cx="558" cy="44" r="23.5" fill="white" stroke="#4B4A2D"/><circle cx="139" cy="312" r="17" fill="${c3}"/><circle cx="139" cy="312" r="23.5" stroke="#4B4A2D"/><circle cx="78" cy="312" r="17" fill="${c3}"/><circle cx="78" cy="312" r="23.5" stroke="#4B4A2D"/><path d="M558 27C567.389 27 575 34.6112 575 44C575 52.3651 568.958 59.3184 561 60.7354V233H566V263H549V233H555V60.7354C547.042 59.3184 541 52.3651 541 44C541 34.6112 548.611 27 558 27Z" fill="${c4}"/></svg>`;
  if (t === 2) return `<svg width="617" height="430" viewBox="0 0 617 430" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="616" height="393" fill="${c1}" stroke="#4B4A2D"/><rect x="0.5" y="0.5" width="616" height="361" fill="white" stroke="#4B4A2D"/><rect x="387.5" y="0.5" width="228" height="361" fill="${c2}" stroke="#4B4A2D"/><circle cx="553" cy="312" r="17" fill="${c3}"/><circle cx="553" cy="312" r="23.5" stroke="#4B4A2D"/><circle cx="553" cy="256" r="17" fill="${c3}"/><circle cx="553" cy="256" r="23.5" stroke="#4B4A2D"/><circle cx="507" cy="312" r="12.75" fill="${c3}"/><circle cx="507" cy="312" r="17.625" stroke="#4B4A2D" stroke-width="0.75"/><circle cx="219" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/><circle cx="219" cy="180.999" r="56.5693" fill="black"/><circle cx="219" cy="181" r="4.52555" fill="#4B4A2D"/><circle cx="442" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/><path d="M442 33C451.389 33 459 40.6112 459 50C459 58.3651 452.958 65.3184 445 66.7354V239H450V269H433V239H439V66.7354C431.042 65.3184 425 58.3651 425 50C425 40.6112 432.611 33 442 33Z" fill="${c4}"/></svg>`;
  if (t === 3) return `<svg width="418" height="430" viewBox="0 0 418 430" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="417" height="429" fill="${c1}" stroke="#4B4A2D"/><rect x="0.5" y="0.5" width="417" height="361" fill="${c2}" stroke="#4B4A2D"/><circle cx="303" cy="397" r="17" fill="${c3}"/><circle cx="303" cy="397" r="23.5" stroke="#4B4A2D"/><circle cx="119" cy="397" r="17" fill="${c3}"/><circle cx="119" cy="397" r="23.5" stroke="#4B4A2D"/><circle cx="211" cy="397" r="17" fill="${c3}"/><circle cx="211" cy="397" r="23.5" stroke="#4B4A2D"/><circle cx="200" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/><circle cx="200" cy="180.999" r="56.5693" fill="black"/><circle cx="200" cy="181" r="4.52555" fill="#4B4A2D"/><circle cx="379" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/><path d="M379 33C388.389 33 396 40.6112 396 50C396 58.3651 389.958 65.3184 382 66.7354V239H387V269H370V239H376V66.7354C368.042 65.3184 362 58.3651 362 50C362 40.6112 369.611 33 379 33Z" fill="${c4}"/></svg>`;
  return `<svg width="418" height="430" viewBox="0 0 418 430" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="417" height="429" fill="${c1}" stroke="#4B4A2D"/><rect x="0.5" y="0.5" width="417" height="361" fill="${c2}" stroke="#4B4A2D"/><circle cx="79" cy="398" r="12.75" fill="${c3}"/><circle cx="79" cy="398" r="17.625" stroke="#4B4A2D" stroke-width="0.75"/><circle cx="200" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/><circle cx="200" cy="180.999" r="56.5693" fill="black"/><circle cx="200" cy="181" r="4.52555" fill="#4B4A2D"/><circle cx="379" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/><path d="M379 33C388.389 33 396 40.6112 396 50C396 58.3651 389.958 65.3184 382 66.7354V239H387V269H370V239H376V66.7354C368.042 65.3184 362 58.3651 362 50C362 40.6112 369.611 33 379 33Z" fill="${c4}"/></svg>`;
}

async function renderVinylToCanvas() {
  if (!fCanvas) return;
  const svgString = getVinylSVGString();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  clearBaseLayer();
  const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
  const scaleFactor = Math.min(600 / img.width, 400 / img.height) * 0.9;
  img.set({ id: 'base-vinyl', scaleX: scaleFactor, scaleY: scaleFactor, left: fCanvas.width / 2, top: fCanvas.height / 2, originX: 'center', originY: 'center', selectable: false, evented: false });
  fCanvas.insertAt(0, img);
  fCanvas.renderAll();
  URL.revokeObjectURL(url);
}

// ================= WATCHERS =================
watch(selectedType, async () => { await updatePreviewImage(); });
watch(currentStep, async (step) => {
  if (step === 1) await updatePreviewImage();
  else if (step === 6) {
    await renderVinylToCanvas();
    // ✅ FIX: bump version เพื่อให้ computed คำนวณใหม่เมื่อเข้า step 6
    canvasObjectVersion.value++;
    nextTick(() => renderThumbnail());
  } else {
    await renderVinylToCanvas();
  }
});
watch(() => ({ ...selectedColors.value }), async () => { if (currentStep.value >= 2) await renderVinylToCanvas(); }, { deep: true });

// ================= STEP 2 FUNCTIONS =================
function applyColor(partId, hexColor) { selectedColors.value[partId] = hexColor.toUpperCase(); }
function resetColors() { selectedColors.value = { body: "#FFFFFF", side: "#FFFFFF", button: "#FFFFFF", tonearm: "#FFFFFF" }; }

// ================= NAVIGATION =================
function nextStep() { if (currentStep.value < 6) currentStep.value++; }
function prevStep() { if (currentStep.value > 1) currentStep.value--; }
function selectType(id) { selectedType.value = id; }

// ================= STEP 3 FUNCTIONS =================
function addTextToCanvas() {
  if (!customText.value || !fCanvas) return;
  const existingText = fCanvas.getObjects().find(o => o.id === 'custom-name-text');
  if (existingText) fCanvas.remove(existingText);
  const text = new fabric.IText(customText.value, {
    left: fCanvas.width / 2,
    top: fCanvas.height - 50,
    originX: "center",
    originY: "center",
    fontFamily: "Prompt",
    fontSize: 32,
    fill: "#CDF100",
    id: "custom-name-text",
    selectable: true
  });
  fCanvas.add(text);
  fCanvas.setActiveObject(text);
  fCanvas.renderAll();
  canvasObjectVersion.value++; // ✅ trigger reactivity
}

function removeTextFromCanvas() {
  if (!fCanvas) return;
  const existingText = fCanvas.getObjects().find(o => o.id === 'custom-name-text');
  if (existingText) fCanvas.remove(existingText);
  customText.value = "";
  fCanvas.renderAll();
  canvasObjectVersion.value++; // ✅ trigger reactivity
}

// ✅ FIX: addStickerToCanvas — เพิ่ม stickerCount และใช้ stickerData.price ถูกต้อง
async function addStickerToCanvas(stickerData) {
  if (!fCanvas) return;
  try {
    const img = await fabric.FabricImage.fromURL(stickerData.image, { crossOrigin: "anonymous" });
    const scaleFactor = 80 / img.width;
    img.set({
      left: fCanvas.width / 2,
      top: fCanvas.height / 2,
      originX: "center",
      originY: "center",
      scaleX: scaleFactor,
      scaleY: scaleFactor,
      id: "custom-sticker",
      // ✅ FIX: ใช้ stickerData.price (field จาก Firestore) ไม่ใช่ .stickerPrice
      stickerPrice: typeof stickerData.price === 'number' ? stickerData.price : 1000,
    });
    fCanvas.add(img);
    fCanvas.setActiveObject(img);
    fCanvas.renderAll();
    stickerCount.value++;       // ✅ trigger reactive
    canvasObjectVersion.value++;
  } catch (error) {
    console.error("โหลดรูปสติกเกอร์ไม่สำเร็จ:", error);
  }
}

// ✅ FIX: deleteSelectedObject — ลด stickerCount เมื่อลบ sticker
function deleteSelectedObject() {
  if (!fCanvas) return;
  const activeObj = fCanvas.getActiveObject();
  if (activeObj && (activeObj.id === 'custom-sticker' || activeObj.id === 'custom-name-text')) {
    if (activeObj.id === 'custom-sticker') {
      stickerCount.value = Math.max(0, stickerCount.value - 1); // ✅
    }
    fCanvas.remove(activeObj);
    fCanvas.discardActiveObject();
    fCanvas.renderAll();
    canvasObjectVersion.value++; // ✅ trigger reactivity
  }
}

// ================= STEP 4 FUNCTIONS =================
function placeVinylDisc() {
  if (!fCanvas) return;
  vinylDiscPlaced.value = true;
  const discSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="98" fill="#111" stroke="#444" stroke-width="2"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="#252525" stroke-width="1.5"/>
    <circle cx="100" cy="100" r="65" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
    <circle cx="100" cy="100" r="50" fill="none" stroke="#1e1e1e" stroke-width="1.5"/>
    <circle cx="100" cy="100" r="35" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
    <circle cx="100" cy="100" r="6" fill="#CDF100"/>
  </svg>`;
  const blob = new Blob([discSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then(img => {
    const scale = 150 / img.width;
    img.set({ id: 'vinyl-disc', scaleX: scale, scaleY: scale, left: fCanvas.width / 2, top: fCanvas.height / 2, originX: 'center', originY: 'center', selectable: true, evented: true });
    fCanvas.add(img);
    fCanvas.setActiveObject(img);
    fCanvas.renderAll();
    URL.revokeObjectURL(url);
  });
}

function removeVinylDisc() {
  if (!fCanvas) return;
  ['vinyl-disc', 'disc-label'].forEach(id => {
    const obj = fCanvas.getObjects().find(o => o.id === id);
    if (obj) fCanvas.remove(obj);
  });
  vinylDiscPlaced.value = false;
  discImageURL.value = null;
  fCanvas.renderAll();
}

function handleDiscImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  discImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => { discImageURL.value = e.target.result; };
  reader.readAsDataURL(file);
}

async function applyImageToDisc() {
  if (!fCanvas || !discImageURL.value) return;
  const disc = fCanvas.getObjects().find(o => o.id === 'vinyl-disc');
  const cx = disc ? disc.left : fCanvas.width / 2;
  const cy = disc ? disc.top : fCanvas.height / 2;
  const oldLabel = fCanvas.getObjects().find(o => o.id === 'disc-label');
  if (oldLabel) fCanvas.remove(oldLabel);
  const offscreen = document.createElement('canvas');
  offscreen.width = 110;
  offscreen.height = 110;
  const ctx = offscreen.getContext('2d');
  return new Promise((resolve) => {
    const imgEl = new Image();
    imgEl.onload = async () => {
      ctx.beginPath();
      ctx.arc(55, 55, 55, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(imgEl, 0, 0, 110, 110);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(55, 55, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      const dataURL = offscreen.toDataURL();
      const labelImg = await fabric.FabricImage.fromURL(dataURL, { crossOrigin: 'anonymous' });
      labelImg.set({ id: 'disc-label', left: cx, top: cy, originX: 'center', originY: 'center', selectable: false, evented: false });
      fCanvas.add(labelImg);
      fCanvas.renderAll();
      resolve();
    };
    imgEl.src = discImageURL.value;
  });
}

function handleAudioUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  audioFile.value = file;
  if (audioURL.value) URL.revokeObjectURL(audioURL.value);
  audioURL.value = URL.createObjectURL(file);
}

// ================= STEP 5 FUNCTIONS =================
function togglePlay() {
  if (!audioPlayerEl.value) return;
  if (isPlaying.value) { audioPlayerEl.value.pause(); isPlaying.value = false; }
  else { audioPlayerEl.value.play(); isPlaying.value = true; }
}
function stopAudio() {
  if (!audioPlayerEl.value) return;
  audioPlayerEl.value.pause();
  audioPlayerEl.value.currentTime = 0;
  isPlaying.value = false;
  audioProgress.value = 0;
}
function updateProgress() {
  if (!audioPlayerEl.value) return;
  currentTime.value = audioPlayerEl.value.currentTime;
  audioDuration.value = audioPlayerEl.value.duration || 0;
  audioProgress.value = audioDuration.value ? (currentTime.value / audioDuration.value) * 100 : 0;
}
function seekAudio(event) {
  if (!audioPlayerEl.value || !audioDuration.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  audioPlayerEl.value.currentTime = ratio * audioDuration.value;
}
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ================= STEP 6 FUNCTIONS =================
async function renderThumbnail() {
  if (!fCanvas || !thumbCanvasEl.value) return;
  fCanvas.discardActiveObject();
  fCanvas.renderAll();
  const dataURL = fCanvas.toDataURL({ format: 'png', multiplier: 0.5 });
  const img = new Image();
  img.onload = () => {
    const ctx = thumbCanvasEl.value.getContext('2d');
    ctx.clearRect(0, 0, 300, 200);
    ctx.drawImage(img, 0, 0, 300, 200);
  };
  img.src = dataURL;
}

function downloadCanvas() {
  // 1. เช็คก่อนว่าล็อกอินหรือยัง!
  if (!isLoggedIn.value) {
    const confirmLogin = confirm("คุณต้องเข้าสู่ระบบหรือสมัครสมาชิกก่อน ถึงจะดาวน์โหลดรูปภาพและบันทึกออเดอร์ได้ครับ ไปหน้า Login เลยไหม?");
    if (confirmLogin) {
      router.push('/login'); // เด้งไปหน้าล็อกอิน
    }
    return; // หยุดการทำงาน ไม่ให้โหลดรูป
  }

  // 2. ถ้าล็อกอินแล้ว อนุญาตให้ดาวน์โหลดได้
  if (!fCanvas) return;
  fCanvas.discardActiveObject();
  fCanvas.renderAll();
  
  // แปลง Canvas เป็นไฟล์ PNG ความละเอียดสูง
  const dataURL = fCanvas.toDataURL({ format: 'png', multiplier: 2 });
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'My-SpinCustom-Vinyl.png';
  a.click();
}
// ================= ฟังก์ชันบันทึกออเดอร์ลง Firebase =================
async function saveOrder() {
  // 1. เช็คก่อนว่าล็อกอินหรือยัง
  if (!isLoggedIn.value) {
    const confirmLogin = confirm("คุณต้องเข้าสู่ระบบก่อนบันทึกออเดอร์ครับ ไปหน้า Login เลยไหม?");
    if (confirmLogin) router.push('/login');
    return;
  }

  // ป้องกันการกดซ้ำ
  if (isSavingOrder.value) return;
  isSavingOrder.value = true;

  try {
    // ----------------------------------------------------
    // 🔥 [แก้ไขใหม่] ดึงรูปจาก fCanvas โดยตรง ป้องกันพื้นหลังดำ
    // ----------------------------------------------------
    fCanvas.discardActiveObject(); // ยกเลิกการเลือก Object ก่อนถ่ายรูป
    fCanvas.renderAll();
    
    const thumbDataURL = fCanvas.toDataURL({
      format: 'jpeg', 
      quality: 0.7,     // ลดความละเอียดลงเพื่อไม่ให้หนัก Database
      multiplier: 0.5   // ย่อขนาดรูปลงครึ่งนึง (เหมือนทำ Thumbnail)
    });
    // ----------------------------------------------------

    // 3. จัดเตรียมข้อมูลที่จะส่งเข้า Database
    const orderData = {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      productName: vinylTypes.value[selectedType.value - 1].name,
      colors: selectedColors.value,
      customText: customText.value,
      basePrice: basePrice.value,           // ✅ เพิ่มตรงนี้
      stickerPrice: placedStickers.value.reduce((sum, s) => sum + (s.stickerPrice || 0), 0), // ✅
      totalPrice: totalPrice.value,
      thumbnail: thumbDataURL,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'orders'), orderData);
    
    // เด้ง Popup แจ้งเตือนสั่งซื้อสำเร็จ
    window.Swal.fire({
      title: "บันทึกออเดอร์สำเร็จ!",
      text: "ข้อมูลถูกบันทึกเรียบร้อยแล้วครับ 🎉",
      icon: "success",
      draggable: true,
      background: '#232321', // สีพื้นหลังกล่อง
      color: '#ffffff', // สีตัวหนังสือ
      confirmButtonColor: '#CDF100', // สีปุ่มตกลง (เหลือง SpinCustom)
      confirmButtonText: '<span style="color:#000; font-weight:bold;">ตกลง</span>',
    });
    
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกออเดอร์:", error);
    alert("บันทึกไม่สำเร็จ: " + error.message);
  } finally {
    isSavingOrder.value = false;
  }
}

function shareDesign() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copySuccess.value = true;
    setTimeout(() => { copySuccess.value = false; }, 3000);
  });
}

// ✅ NEW: Reset ทุกอย่างกลับ Step 1
function resetAll() {
  // หยุดเสียงก่อน
  if (audioPlayerEl.value) {
    audioPlayerEl.value.pause();
    audioPlayerEl.value.currentTime = 0;
  }

  // reset states ทั้งหมด
  selectedType.value = 1;
  selectedColors.value = { body: "#FFFFFF", side: "#FFFFFF", button: "#FFFFFF", tonearm: "#FFFFFF" };
  customText.value = "";
  activeStickerTab.value = 1;
  vinylDiscPlaced.value = false;
  discImageURL.value = null;
  discImageFile.value = null;
  isPlaying.value = false;
  audioProgress.value = 0;
  currentTime.value = 0;
  audioDuration.value = 0;
  copySuccess.value = false;
  stickerCount.value = 0;
  canvasObjectVersion.value = 0;

  // revoke audio URL
  if (audioURL.value) {
    URL.revokeObjectURL(audioURL.value);
    audioURL.value = null;
  }
  audioFile.value = null;

  // clear canvas แล้วโหลด preview ใหม่
  if (fCanvas) {
    fCanvas.clear();
    fCanvas.backgroundColor = '#ffffff';
    fCanvas.renderAll();
  }

  // กลับ step 1 — watch จะ trigger updatePreviewImage()
  currentStep.value = 1;
  
}
// ================= STEP 6: ดาวน์โหลดรูป =================

// function downloadDesign() {
//   // 1. เช็คก่อนว่าล็อกอินหรือยัง!
//   if (!isLoggedIn.value) {
//     const confirmLogin = confirm("คุณต้องเข้าสู่ระบบหรือสมัครสมาชิกก่อน ถึงจะดาวน์โหลดรูปภาพและบันทึกออเดอร์ได้ครับ ไปหน้า Login เลยไหม?");
//     if (confirmLogin) {
//       router.push('/login'); // เด้งไปหน้าล็อกอิน
//     }
//     return; // หยุดการทำงาน ไม่ให้โหลดรูป
//   }

//   // 2. ถ้าล็อกอินแล้ว อนุญาตให้ดาวน์โหลดได้
//   if (!fCanvas) return;
  
//   // แปลงสิ่งที่อยู่บน Canvas ออกมาเป็น Data URL (Base64) แบบรูป PNG ความละเอียดสูง (คูณ 2)
//   const dataURL = fCanvas.toDataURL({
//     format: 'png',
//     multiplier: 2 
//   });

//   // สร้างลิงก์จำลองแล้วสั่งให้เบราว์เซอร์ดาวน์โหลด
//   const link = document.createElement('a');
//   link.download = 'My-SpinCustom-Vinyl.png';
//   link.href = dataURL;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap");

/* ================= VARIABLES & GLOBAL ================= */
.customizer-layout { background-color: #1a1a17; min-height: 100vh; color: #fff; font-family: "Prompt", sans-serif; padding-bottom: 50px; }
.container-main { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.highlight-yellow { color: #cdf100; }

/* ================= HEADER ================= */
.customizing-text { color: #fff700; font-family: "Jura", sans-serif; letter-spacing: 2px; margin-bottom: 5px; }
.title-text { font-size: 36px; font-weight: 600; margin-bottom: 20px; }
.progress-bar-container { width: 100%; height: 8px; background-color: #333; border-radius: 4px; overflow: hidden; margin-bottom: 40px; }
.progress-bar-fill { height: 100%; background-color: #cdf100; transition: width 0.3s ease; }
.header-section { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
.customizing-text, .title-text { text-align: center; }

/* ================= PREVIEW AREA ================= */
.preview-section { margin-bottom: 30px; }
.preview-card { background-color: #6a6a62; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; align-items: center; overflow: hidden; }
.bg-curve { position: absolute; top: 20%; left: 5%; right: 5%; bottom: -50%; border-radius: 50% 50% 0 0; pointer-events: none; }
.canvas-wrapper { position: relative; background: transparent; width: 100%; max-width: 600px; aspect-ratio: 3/2; z-index: 1; }
.canvas-wrapper canvas { width: 100%; height: 100%; display: block; }
.product-info-block { z-index: 1; position: relative; width: 100%; }
.product-name { color: #cdf100; font-size: 24px; font-weight: 500; margin: 15px 0 5px 0; text-align: center; }
.product-desc { color: #ddd; font-size: 14px; margin: 0; text-align: center; }
.nav-arrows { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.arrow-btn { background: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 0; font-size: 16px; font-weight: bold; color: #000; }
.arrow-btn.btn-next { background: #cdf100; }
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ================= STEP CONTAINERS ================= */
.step-container { animation: fadeIn 0.3s ease; }
.step-title { color: #cdf100; font-size: 24px; font-weight: 500; margin-bottom: 20px; }
.tools-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Step 1 */
.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.type-card { background-color: #6a6a62; border-radius: 12px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border: 2px solid transparent; text-align: center; }
.type-card.active { border-color: #fff700; }
.thumb-placeholder { width: 100%; height: 70%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.type-image { max-width: 80%; max-height: 80%; object-fit: contain; }
.type-label { font-size: 12px; color: #fff700; margin: 0; padding: 5px 10px 10px 10px; line-height: 1.2; }

/* Step 2 Color Picker */
.color-groups-wrapper { display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto; }
.color-group { display: flex; align-items: center; justify-content: space-between; background-color: rgba(0, 0, 0, 0.2); padding: 12px 18px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.2s ease; }
.color-group:hover { background-color: rgba(0, 0, 0, 0.35); border-color: rgba(205, 241, 0, 0.2); }
.part-label { color: #fff; font-size: 14px; font-weight: 400; margin: 0; }
.color-controls { display: flex; align-items: center; gap: 10px; }
.color-swatch { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.2); cursor: pointer; transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: #CDF100; box-shadow: 0 0 10px rgba(205, 241, 0, 0.5); transform: scale(1.15); }
.color-divider { width: 2px; height: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 2px; margin: 0 2px; }
.custom-color-wrapper { position: relative; width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); border: 2px solid #D6FF2B; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 0 10px rgba(214, 255, 43, 0.3); }
.custom-color-wrapper:hover, .custom-color-wrapper.active { border-color: #CDF100; box-shadow: 0 0 12px rgba(205, 241, 0, 0.6); transform: scale(1.15); }
.custom-color-preview { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.6); z-index: 1; pointer-events: none; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; font-size: 11px; line-height: 1; }
.custom-color-icon { font-size: 11px; z-index: 1; pointer-events: none; line-height: 1; }
.pick-color-input { position: absolute !important; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 2;}
.step-content-wrapper-large { max-width: 700px; margin: 0 auto; }
.svg-wrapper { display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.1); border-radius: 15px; padding: 20px; }
.divider-line { height: 1px; background: rgba(255, 255, 255, 0.1); width: 100%; }
.my-4 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
.btn-reset { display: inline-flex; align-items: center; justify-content: center; background-color: transparent; color: #ff5555; border: 1px solid #ff5555; border-radius: 6px; padding: 8px 20px; font-size: 14px; font-family: 'Prompt', sans-serif; cursor: pointer; transition: all 0.2s ease; margin-top: 10px; }
.btn-reset:hover { background-color: rgba(255, 85, 85, 0.1); }

/* Tool panels */
.tool-panel { background-color: #6a6a62; border-radius: 12px; padding: 25px; color: #aaa; }
.panel-title { color: #fff; font-size: 18px; font-weight: 500; margin-top: 0; }
.panel-title-left { color: #fff; font-size: 18px; font-weight: 500; margin-top: 0; }
.text-left { text-align: left !important; }

/* Step 3 */
.custom-input { width: 100%; padding: 12px 15px; border-radius: 6px; border: none; background-color: #fff; color: #000; outline: none; font-family: 'Prompt', sans-serif; font-size: 16px; box-sizing: border-box; }
.btn-dark-grey { background-color: #2a2a2a; color: #cdf100; border: none; padding: 10px 0; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; transition: 0.2s; }
.btn-dark-grey:hover { background-color: #111; }
.btn-yellow { background-color: #cdf100; color: #000; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; font-weight: 500; transition: 0.2s; }
.btn-yellow:hover { transform: scale(1.03); }
.btn-tab { background-color: #2a2a2a; color: #fff; border: none; padding: 8px 0; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; transition: 0.2s; }
.btn-tab.active { background-color: #cdf100; color: #000; font-weight: 500; }
.sticker-grid-3x2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.sticker-box { background-color: #e0e0e0; border-radius: 6px; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; border: 2px solid transparent; transition: 0.2s; }
.sticker-box:hover { border-color: #cdf100; transform: scale(1.05); }
.sticker-img { width: 80%; height: 80%; object-fit: contain; }
.btn-danger-outline { background-color: transparent; color: #ff5555; border: 1px solid #ff5555; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; }

/* Step 4 */
.place-disc-area { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 16px 0; }
.disc-preview-static { opacity: 0.75; filter: drop-shadow(0 0 20px rgba(205,241,0,0.25)); }
.placed-controls { display: flex; flex-direction: column; gap: 8px; }
.status-badge { background: rgba(205,241,0,0.1); border: 1px solid rgba(205,241,0,0.35); color: #CDF100; padding: 8px 12px; border-radius: 8px; font-size: 13px; }
.sub-label { color: #fff; font-size: 15px; margin: 0 0 6px 0; }
.upload-box { display: block; border: 2px dashed #555; border-radius: 12px; min-height: 100px; cursor: pointer; transition: all 0.2s; overflow: hidden; }
.upload-box:hover, .upload-box.has-file { border-color: #CDF100; background: rgba(205,241,0,0.04); }
.upload-inner { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 18px 12px; color: #aaa; font-size: 13px; text-align: center; }
.upload-icon { font-size: 28px; }
.upload-hint { font-size: 11px; color: #666; }
.upload-preview-wrap { position: relative; }
.upload-preview-img { width: 100%; height: 100px; object-fit: cover; display: block; }
.replace-text { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: #fff; text-align: center; font-size: 12px; padding: 4px; }
.audio-ctrl { width: 100%; filter: invert(1) hue-rotate(70deg); }
.text-lime { color: #CDF100; }
.hint-text { color: #888; font-size: 13px; }

/* Step 5 */
.player-center { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.turntable-stage { display: flex; flex-direction: column; align-items: center; }
.spinning-disc { position: relative; transition: filter 0.4s; }
.spinning-disc.playing { animation: spinVinyl 2.8s linear infinite; filter: drop-shadow(0 0 36px rgba(205,241,0,0.35)); }
@keyframes spinVinyl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.disc-shimmer { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(transparent 0deg, rgba(255,255,255,0.04) 60deg, transparent 120deg); pointer-events: none; }
.eq-bars { display: flex; gap: 4px; margin-top: 18px; height: 28px; align-items: flex-end; }
.eq-bar { width: 5px; background: #333; border-radius: 2px; height: 5px; }
.eq-bars.active .eq-bar { animation: eqBounce 0.55s ease-in-out infinite alternate; background: #CDF100; }
@keyframes eqBounce { from { height: 4px; } to { height: 24px; } }
.player-controls { width: 100%; max-width: 340px; }
.progress-track { width: 100%; height: 6px; background: #333; border-radius: 3px; cursor: pointer; overflow: hidden; }
.progress-fill { height: 100%; background: #CDF100; border-radius: 3px; transition: width 0.1s linear; }
.time-labels { display: flex; justify-content: space-between; color: #888; font-size: 12px; margin-top: 5px; }
.control-btns { display: flex; justify-content: center; gap: 16px; margin-top: 18px; }
.ctrl-btn { background: #2a2a2a; border: 2px solid #444; color: #fff; width: 56px; height: 56px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: all 0.2s; }
.ctrl-btn:hover:not(:disabled) { background: #CDF100; border-color: #CDF100; color: #000; transform: scale(1.1); }
.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Step 6 */
.price-list { display: flex; flex-direction: column; gap: 10px; }
.price-row { display: flex; justify-content: space-between; align-items: center; color: #ccc; font-size: 14px; }
.price-val { color: #fff; font-weight: 500; }
.price-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 4px 0; }
.total-row { font-size: 16px; font-weight: 600; color: #fff; }
.price-total { color: #CDF100; font-size: 22px; font-weight: 700; }
.download-preview { background: #1a1a1a; border-radius: 8px; overflow: hidden; }
.thumb-canvas { width: 100%; height: auto; border-radius: 8px; border: 1px solid #444; display: block; }
.share-success { color: #CDF100; font-size: 13px; margin-top: 8px; }
.order-card { background: linear-gradient(135deg, #2a2a1a, #1a1a17); border: 1px solid rgba(205,241,0,0.2); border-radius: 16px; padding: 20px; margin-top: 20px; }
.order-card-inner { display: flex; align-items: center; gap: 16px; }
.order-icon { font-size: 32px; }
.order-detail { flex: 1; }
.order-title { color: #fff; font-size: 15px; margin: 0 0 4px 0; font-weight: 500; }
.order-sub { color: #888; font-size: 12px; margin: 0; }
.order-price { color: #CDF100; font-size: 24px; font-weight: 700; }

/* ✅ NEW: Restart section */
.restart-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
  gap: 12px;
}
.restart-divider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
}
.restart-divider::before,
.restart-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
.restart-divider-text {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
}
.btn-restart {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: #CDF100;
  border: 2px solid #CDF100;
  padding: 14px 48px;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Prompt', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.3px;
}
.btn-restart:hover {
  background: #CDF100;
  color: #1a1a17;
  transform: scale(1.03);
  box-shadow: 0 0 24px rgba(205, 241, 0, 0.25);
}
.restart-hint {
  color: #555;
  font-size: 12px;
  margin: 0;
  text-align: center;
}

/* Utils */
.d-flex { display: flex; }
.flex-fill { flex: 1; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.gap-2 { gap: 8px; }
.text-center { text-align: center; }
.mt-4 { margin-top: 16px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.position-relative { position: relative; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>