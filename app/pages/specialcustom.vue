<template>
  <div class="customizer-layout">

    <!-- ==================== ORDER STATUS POPUP ==================== -->
    <Transition name="popup-slide">
      <div v-if="showOrderPopup && orderNotification" class="order-popup-overlay" @click.self="closeOrderPopup">
        <div class="order-popup-card">

          <!-- แถบสีสถานะด้านบน -->
          <div class="popup-status-bar" :style="{ background: currentOrderStatus.color }"></div>

          <!-- ปุ่มปิด -->
          <button class="popup-close-btn" @click="closeOrderPopup">X</button>

          <!-- Header -->
          <div class="popup-header">
            <span class="popup-icon"><i :class="currentOrderStatus.icon"></i></span>
            <div>
              <p class="popup-label">{{ orderNotification.source === 'admin_update' ? 'สถานะออเดอร์อัปเดตแล้ว' : 'ออเดอร์ Special Edition ลงระบบแล้ว' }}</p>
              <h3 class="popup-status-text" :style="{ color: currentOrderStatus.color }">{{ currentOrderStatus.label }}</h3>
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
              <span class="popup-status-badge" :style="{ color: currentOrderStatus.color, borderColor: currentOrderStatus.color }">
                {{ currentOrderStatus.label }}
              </span>
            </div>
            <p class="popup-desc">{{ currentOrderStatus.desc }}</p>
          </div>

          <!-- Actions -->
          <div class="popup-actions">
            <NuxtLink to="/orders" class="popup-btn-primary" @click="closeOrderPopup">ดูออเดอร์ทั้งหมด</NuxtLink>
            <button class="popup-btn-ghost" @click="closeOrderPopup">ปิด</button>
          </div>

        </div>
      </div>
    </Transition>

    <div class="container-main">
      <div class="header-section text-center">
        <p class="customizing-text">LIMITED EDITION</p>
        <h1 class="title-text">
          SPECIAL<span class="highlight-yellow">CUSTOM</span>
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
            <h3 class="product-name text-red">{{ activeCollection?.campaign_name || 'Loading...' }}</h3>
            <p class="product-desc">{{ activeCollection?.desc || 'รุ่นพิเศษ Limited Edition' }}</p>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="arrow-btn btn-prev" @click="prevStep" :disabled="currentStep === 1"><i class="fas fa-caret-left"></i></button>
          <button class="arrow-btn btn-next" @click="nextStep" :disabled="currentStep === 5"><i class="fas fa-caret-right"></i></button>
        </div>
      </div>

      <div class="tools-section">
        <transition name="fade" mode="out-in">

          <div v-if="currentStep === 1" class="step-container">
            <h3 class="step-title">เลือกคอลเลกชันพิเศษ</h3>
            <div v-if="isLoading" class="text-center text-white">กำลังโหลดข้อมูล...</div>
            <div v-else class="grid-2x2">
              <div
                v-for="(item, index) in specialCollections"
                :key="item.id"
                class="type-card"
                :class="{ active: selectedIndex === index }"
                @click="selectCollection(index)"
              >
                <div class="thumb-placeholder">
                  <img :src="item.image" :alt="item.campaign_name" class="type-image" />
                </div>
                <p v-if="selectedIndex === index" class="type-label">{{ item.campaign_name }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="step-container">
            <h3 class="step-title">เพิ่มความเป็นเอกลักษณ์</h3>
            <div class="tools-grid-2">
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">เขียนชื่อของคุณ</h4>
                <input type="text" v-model="customText" placeholder="พิมพ์ชื่อของคุณ..." class="custom-input mb-4">
                <div class="d-flex gap-2">
                  <button @click="removeTextFromCanvas" class="btn-dark-grey flex-fill">ลบชื่อ</button>
                  <button @click="addTextToCanvas" class="btn-yellow flex-fill">ยืนยัน</button>
                </div>
              </div>
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">สติกเกอร์รุ่นพิเศษ</h4>
                <div v-if="isStickersLoading" class="text-center text-white">กำลังโหลดสติกเกอร์...</div>
                <div v-else class="sticker-grid-3x2">
                  <div v-for="sticker in specialStickers" :key="sticker.id" class="sticker-box" @click="addStickerToCanvas(sticker)">
                    <img :src="sticker.image" class="sticker-img" />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button @click="deleteSelectedObject" class="btn-danger-outline">ลบสิ่งที่เลือกในภาพ</button>
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="step-container">
            <h3 class="step-title">วางแผ่นเสียงและปรับแต่ง</h3>
            <div class="tools-grid-2">

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
                  <button @click="placeVinylDisc" class="btn-yellow" style="width:100%">วางแผ่นเสียง</button>
                </div>

                <div v-else class="placed-controls">
                  <div class="status-badge">วางแผ่นเสียงแล้ว — ลากเพื่อย้ายตำแหน่ง</div>
                  <div class="divider-line"></div>
                  <h5 class="sub-label">รูปภาพบนแผ่น</h5>
                  <label class="upload-box" :class="{ 'has-file': discImageURL }">
                    <input type="file" accept="image/*" @change="handleDiscImageUpload" hidden />
                    <div v-if="!discImageURL" class="upload-inner">
                      <span>คลิกเพื่ออัปโหลดรูป</span>
                      <span class="upload-hint">PNG, JPG (จะถูก crop เป็นวงกลม)</span>
                    </div>
                    <div v-else class="upload-preview-wrap">
                      <img :src="discImageURL" class="upload-preview-img" />
                      <span class="replace-text">คลิกเพื่อเปลี่ยนรูป</span>
                    </div>
                  </label>
                  <button v-if="discImageURL" @click="applyImageToDisc" class="btn-yellow" style="width:100%;margin-top:8px">ใช้รูปนี้บนแผ่นเสียง</button>
                  <button @click="removeVinylDisc" class="btn-danger-outline" style="width:100%;margin-top:8px">ลบแผ่นเสียง</button>
                </div>
              </div>

              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-3">เสียงประกอบ</h4>
                <label class="upload-box" :class="{ 'has-file': audioFile }">
                  <input type="file" accept="audio/*" @change="handleAudioUpload" hidden />
                  <div v-if="!audioFile" class="upload-inner">
                    <span>คลิกเพื่ออัปโหลดเสียง</span>
                    <span class="upload-hint">MP3, WAV, OGG</span>
                  </div>
                  <div v-else class="upload-inner">
                    <span class="text-lime">{{ audioFile.name }}</span>
                    <span class="upload-hint">คลิกเพื่อเปลี่ยนไฟล์</span>
                  </div>
                </label>
                <div v-if="audioURL" style="margin-top:12px">
                  <audio ref="audioPreviewEl" :src="audioURL" controls class="audio-ctrl"></audio>
                </div>
                <div v-if="!audioFile" class="hint-text" style="margin-top:12px">เพิ่มเสียงเพื่อให้แผ่นหมุนใน Step ถัดไป</div>
              </div>

            </div>
          </div>

          <div v-else-if="currentStep === 4" class="step-container">
            <h3 class="step-title">แผ่นเสียงหมุน</h3>
            <audio ref="audioPlayerEl" v-if="audioURL" :src="audioURL" @ended="onAudioEnded" @timeupdate="updateProgress"></audio>

            <div class="player-center">
              <div class="turntable-stage">
                <div class="spinning-disc" :class="{ playing: isPlaying }">
                  <!-- Canvas will rotate via requestAnimationFrame -->
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
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 5" class="step-container">
            <h3 class="step-title">สรุปและดาวน์โหลด</h3>

            <div class="tools-grid-2">
              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">สรุปราคา</h4>
                <div class="price-list">
                  <div class="price-row">
                    <span>{{ activeCollection?.campaign_name || 'เครื่องเล่นแผ่นเสียง (Special Edition)' }}</span>
                    <span class="price-val">฿{{ (activeCollection?.base_price || 0).toLocaleString() }}</span>
                  </div>
                  <div class="price-row" v-if="discImageURL">
                    <span>การพิมพ์รูปบนแผ่นเสียง</span><span class="price-val">฿500</span>
                  </div>
                  <div class="price-row" v-for="(sticker, idx) in placedStickers" :key="idx">
                    <span>สติกเกอร์รุ่นพิเศษ (x1)</span>
                    <span class="price-val">฿{{ (sticker.stickerPrice || 50).toLocaleString() }}</span>
                  </div>
                  <div class="price-row" v-if="hasCustomName">
                    <span>ชื่อ Custom</span><span class="price-val">฿200</span>
                  </div>
                  <div class="price-divider"></div>
                  <div class="price-row total-row">
                    <span>รวมทั้งหมด</span>
                    <span class="price-total text-red">฿{{ totalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="tool-panel text-left">
                <h4 class="panel-title-left mb-4">ดาวน์โหลดผลงาน</h4>
                <div class="download-preview mb-3">
                  <img v-if="previewDataURL" :src="previewDataURL" class="thumb-canvas" alt="Preview" />
                </div>
                <button @click="downloadCanvas" class="btn-yellow" style="width:100%;margin-bottom:8px">ดาวน์โหลดรูปภาพ (PNG)</button>
                <button @click="saveSpecialOrder" class="btn-yellow" style="width:100%;margin-bottom:8px; background-color: #ff3b3b; color: #fff;" :disabled="isSavingOrder">
                  {{ isSavingOrder ? 'กำลังบันทึก...' : 'บันทึกออเดอร์ลงระบบ' }}
                </button>
                <button @click="saveDraft" class="btn-dark-grey" style="width:100%">
                  {{ draftSaved ? 'บันทึกแล้ว!' : 'บันทึกการออกแบบค้างไว้' }}
                </button>
                <div v-if="draftSaved" class="share-success text-red">บันทึกแล้ว — กลับมาต่อได้ที่หน้าโปรไฟล์</div>
              </div>
            </div>

            <div class="order-card" style="border-color: rgba(255, 59, 59, 0.4);">
              <div class="order-card-inner">
                <div class="order-icon"><i class="fa-solid fa-star"></i></div>
                <div class="order-detail">
                  <p class="order-title text-red">{{ activeCollection?.campaign_name || 'Limited Edition' }}</p>
                  <p class="order-sub">รุ่นพิเศษ (ดีไซน์คงที่)</p>
                </div>
                <div class="order-price text-red">฿{{ totalPrice.toLocaleString() }}</div>
              </div>
            </div>

            <div class="restart-section">
              <div class="restart-divider"><span class="restart-divider-text">หรือ</span></div>
              <button @click="resetAll" class="btn-restart" style="color: #ff3b3b; border-color: #ff3b3b;">
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
import { ref, onMounted, computed, watch, nextTick } from "vue";
import * as fabric from "fabric";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ==================== Order Status Popup ====================
const STATUS_CONFIG = {
  pending:    { label: 'รอดำเนินการ', icon: 'fa-solid fa-hourglass-start', color: '#FFB547', desc: 'ออเดอร์ของคุณอยู่ในคิว ทีมงานกำลังตรวจสอบ' },
  processing: { label: 'กำลังผลิต',   icon: 'fa-solid fa-cogs',            color: '#5C9EFF', desc: 'ทีมงานกำลังดำเนินการผลิตสินค้าของคุณอยู่' },
  completed:  { label: 'จัดส่งแล้ว',  icon: 'fa-solid fa-check-circle',   color: '#CDF100', desc: 'สินค้าถูกจัดส่งเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ' },
  cancelled:  { label: 'ยกเลิกแล้ว',  icon: 'fa-solid fa-ban',            color: '#FF5C5C', desc: 'ออเดอร์นี้ถูกยกเลิก กรุณาติดต่อทีมงาน' },
}

const orderNotification = ref(null)
const showOrderPopup = ref(false)

const currentOrderStatus = computed(() =>
  STATUS_CONFIG[orderNotification.value?.status] || { label: orderNotification.value?.status || '-', icon: 'fa-solid fa-box', color: '#aaa', desc: '' }
)

function closeOrderPopup() {
  showOrderPopup.value = false
  localStorage.removeItem('spinLastOrder')
}

// ================= STATE พื้นฐาน =================
const currentStep = ref(1);
const progressPercentage = computed(() => (currentStep.value / 5) * 100); // อัปเดตตัวหารเป็น 5
const canvasEl = ref(null);
let fCanvas = null;
const isLoggedIn = ref(false);
const isSavingOrder = ref(false);

const stickerCount = ref(0);
const canvasObjectVersion = ref(0); 

// ================= ข้อมูลแบบ Local (Hardcode) =================
const isLoading = ref(false);
const selectedIndex = ref(0);

// ข้อมูลเครื่องเล่น Limited 2 รุ่น
const specialCollections = ref([
  {
    id: 1,
    campaign_name: "RED HOT CHILI PEPPERS",
    desc: "รุ่นพิเศษ Limited Edition ลาย RHCP",
    image: "/special_vinyl_1.png",
    base_price: 5900,
  },
  {
    id: 2,
    campaign_name: "BLUE & GREY EDITION",
    desc: "รุ่นพิเศษ ดีไซน์โมเดิร์นสีน้ำเงิน-เทา",
    image: "/special_vinyl_2.png",
    base_price: 6500,
  }
]);

const isStickersLoading = ref(true);
const specialStickers = ref([]);

const activeCollection = computed(() => specialCollections.value[selectedIndex.value] || null);

const customText = ref("");

// Step 3 Refs (จาก Step 4 เดิม)
const vinylDiscPlaced = ref(false);
const discImageURL = ref(null);
const discImageFile = ref(null);
const audioFile = ref(null);
const audioURL = ref(null);
const audioPreviewEl = ref(null);

// Step 4 Refs (จาก Step 5 เดิม)
const isPlaying = ref(false);
const audioPlayerEl = ref(null);
const audioProgress = ref(0);
const currentTime = ref(0);
const audioDuration = ref(0);

// Step 5 Refs (จาก Step 6 เดิม)
const thumbCanvasEl = ref(null);
const previewDataURL = ref(null);
const copySuccess = ref(false);
const draftSaved = ref(false);
const animationFrameId = ref(null);
const rotationAngle = ref(0);

const placedStickers = computed(() => {
  stickerCount.value; canvasObjectVersion.value;
  return fCanvas ? fCanvas.getObjects().filter(o => o.id === 'custom-sticker') : [];
});

const hasCustomName = computed(() => {
  canvasObjectVersion.value;
  return fCanvas ? fCanvas.getObjects().some(o => o.id === 'custom-name-text') : false;
});

const totalPrice = computed(() => {
  let total = activeCollection.value?.base_price || 5900;
  if (discImageURL.value) total += 500;
  if (hasCustomName.value) total += 200;
  placedStickers.value.forEach(s => {
    total += (typeof s.stickerPrice === 'number' ? s.stickerPrice : 50);
  });
  return total;
});

// ================= ฟังก์ชันโหลดสติกเกอร์ =================
const fetchSpecialData = async () => {
  isStickersLoading.value = true;
  try {
    const qSticker = query(collection(db, 'stickers'), where('type', '==', 3));
    const snapSticker = await getDocs(qSticker);
    const stickers = [];
    snapSticker.forEach(doc => stickers.push({ id: doc.id, ...doc.data() }));
    specialStickers.value = stickers;
  } catch (error) {
    console.error("Error fetching special stickers:", error);
  } finally {
    isStickersLoading.value = false;
  }
};

// ================= FABRIC.JS & UI LOGIC =================
onMounted(async () => {
  onAuthStateChanged(auth, (user) => { isLoggedIn.value = !!user; });
  fCanvas = new fabric.Canvas(canvasEl.value, { width: 600, height: 400, backgroundColor: '#ffffff' });
  await fetchSpecialData();

  // ==================== ตรวจสอบ Order Popup ====================
  try {
    const raw = localStorage.getItem('spinLastOrder')
    if (raw) {
      const data = JSON.parse(raw)
      orderNotification.value = data
      setTimeout(() => { showOrderPopup.value = true }, 400)
    }
  } catch (e) {
    console.warn('spinLastOrder parse error:', e)
  }

  // ================= RESTORE DRAFT =================
  if (route.query.restore === 'special') {
    try {
      // รอ Firebase Auth init ก่อน แทนที่จะ read auth.currentUser ตรงๆ
      const uid = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user?.uid || null);
        });
      });

      const raw = uid ? localStorage.getItem(`spinSpecialDraft_${uid}`) : null;
      if (raw) {
        const draft = JSON.parse(raw);

        // Restore state ทั้งหมด
        selectedIndex.value = typeof draft.selectedIndex === 'number' ? draft.selectedIndex : 0;
        customText.value = draft.customText || '';
        vinylDiscPlaced.value = draft.vinylDiscPlaced || false;
        if (draft.discImageURL) discImageURL.value = draft.discImageURL;
        if (draft.audioURL) audioURL.value = draft.audioURL;

        // render canvas หลังจาก state restore ครบแล้ว
        await nextTick();
        await updatePreviewImage();

        // restore canvas objects (text และ sticker)
        if (draft.canvasObjects) {
          for (const obj of draft.canvasObjects) {
            if (obj.id === 'custom-name-text') {
              const textObj = new fabric.IText(obj.text, {
                left: obj.left,
                top: obj.top,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                angle: obj.angle,
                fontFamily: obj.fontFamily || 'Prompt',
                fontSize: obj.fontSize || 32,
                fill: obj.fill || '#ff3b3b',
                id: 'custom-name-text',
                selectable: obj.selectable,
                evented: obj.evented,
              });
              fCanvas.add(textObj);
            } else if (obj.id === 'custom-sticker') {
              fabric.FabricImage.fromURL(obj.stickerData.image, { crossOrigin: 'anonymous' }).then(img => {
                img.set({
                  left: obj.left,
                  top: obj.top,
                  scaleX: obj.scaleX,
                  scaleY: obj.scaleY,
                  angle: obj.angle,
                  id: 'custom-sticker',
                  stickerData: obj.stickerData,
                  stickerPrice: obj.stickerPrice,
                  selectable: obj.selectable,
                  evented: obj.evented,
                });
                fCanvas.add(img);
                fCanvas.renderAll();
              });
            }
          }
        }

        // restore vinyl disc
        if (vinylDiscPlaced.value) {
          placeVinylDisc();
          if (discImageURL.value) {
            await applyImageToDisc();
          }
        }

        // update reactive counters
        stickerCount.value = draft.canvasObjects
          ? draft.canvasObjects.filter(o => o.id === 'custom-sticker').length
          : 0;
        canvasObjectVersion.value++;

        currentStep.value = draft.currentStep || 1;

        window.Swal?.fire({
          title: '↩ กลับมาต่อแล้ว!',
          text: 'โหลดการออกแบบ Limited Edition ที่บันทึกไว้เรียบร้อย',
          icon: 'success',
          timer: 2200,
          showConfirmButton: false,
          background: '#232321',
          color: '#ffffff',
        });
      } else {
        await updatePreviewImage();
      }
    } catch (e) {
      console.warn('โหลด draft ไม่สำเร็จ:', e);
      await updatePreviewImage();
    }
  } else {
    await updatePreviewImage();
  }
});

// ดึงรูปภาพเครื่องเล่นมาแสดงเป็นพื้นหลังแบบแก้ไขไม่ได้
async function updatePreviewImage() {
  if (!fCanvas || !activeCollection.value) return;
  
  const imgUrl = activeCollection.value.image;
  if (!imgUrl) return;

  try {
    const img = await fabric.FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' });
    const scaleFactor = Math.min(600 / img.width, 400 / img.height) * 0.9;
    
    // ลบรูปเครื่องเดิมออกก่อนใส่รูปใหม่
    const oldBase = fCanvas.getObjects().find(o => o.id === 'base-vinyl');
    if (oldBase) fCanvas.remove(oldBase);

    img.set({ 
      scaleX: scaleFactor, scaleY: scaleFactor, 
      left: fCanvas.width / 2, top: fCanvas.height / 2, 
      originX: 'center', originY: 'center', 
      selectable: false, evented: false, 
      id: 'base-vinyl' 
    });
    fCanvas.insertAt(0, img);
    fCanvas.renderAll();
  } catch (error) {
    console.error('โหลดรูปไม่สำเร็จ:', error);
  }
}

watch(selectedIndex, async () => { await updatePreviewImage(); });
watch(currentStep, async (step) => {
  if (step === 5) {
    canvasObjectVersion.value++;
    nextTick(() => renderThumbnail());
  }
});

function selectCollection(index) {
  selectedIndex.value = index;
}

// ================= STEP 2 (เขียนชื่อ / สติกเกอร์) =================
function addTextToCanvas() {
  if (!customText.value || !fCanvas) return;
  const existingText = fCanvas.getObjects().find(o => o.id === 'custom-name-text');
  if (existingText) fCanvas.remove(existingText);
  const text = new fabric.IText(customText.value, {
    left: fCanvas.width / 2, top: fCanvas.height - 50, originX: "center", originY: "center",
    fontFamily: "Prompt", fontSize: 32, fill: "#ff3b3b", id: "custom-name-text", selectable: true
  });
  fCanvas.add(text); fCanvas.setActiveObject(text); fCanvas.renderAll();
  canvasObjectVersion.value++;
}

function removeTextFromCanvas() {
  if (!fCanvas) return;
  const existingText = fCanvas.getObjects().find(o => o.id === 'custom-name-text');
  if (existingText) fCanvas.remove(existingText);
  customText.value = ""; fCanvas.renderAll();
  canvasObjectVersion.value++;
}

async function addStickerToCanvas(stickerData) {
  if (!fCanvas) return;
  try {
    const img = await fabric.FabricImage.fromURL(stickerData.image, { crossOrigin: "anonymous" });
    const scaleFactor = 80 / img.width;
    img.set({ left: fCanvas.width / 2, top: fCanvas.height / 2, originX: "center", originY: "center", scaleX: scaleFactor, scaleY: scaleFactor, id: "custom-sticker", stickerData: stickerData, stickerPrice: typeof stickerData.price === 'number' ? stickerData.price : 50 });
    fCanvas.add(img); fCanvas.setActiveObject(img); fCanvas.renderAll();
    stickerCount.value++; canvasObjectVersion.value++;
  } catch (error) { console.error("โหลดรูปสติกเกอร์ไม่สำเร็จ:", error); }
}

function deleteSelectedObject() {
  if (!fCanvas) return;
  const activeObj = fCanvas.getActiveObject();
  if (activeObj && (activeObj.id === 'custom-sticker' || activeObj.id === 'custom-name-text')) {
    if (activeObj.id === 'custom-sticker') stickerCount.value = Math.max(0, stickerCount.value - 1);
    fCanvas.remove(activeObj); fCanvas.discardActiveObject(); fCanvas.renderAll();
    canvasObjectVersion.value++;
  }
}

// อัปเดต Next/Prev ขั้นตอนให้สุดที่ Step 5
function nextStep() { if (currentStep.value < 5) currentStep.value++; }
function prevStep() { if (currentStep.value > 1) currentStep.value--; }

// ================= STEP 3 (วางแผ่น) FUNCTIONS =================

// ตำแหน่งศูนย์กลางวงขาว (r=154.5) ของ type 1 ใน SVG coordinate
// และขนาด SVG ที่ใช้ render บน canvas (617x430 * scaleFactor)
function getDiscSnapInfo() {
  const svgW = 617;
  const svgH = 430;
  const scaleFactor = Math.min(600 / svgW, 400 / svgH) * 0.9;

  // ตำแหน่ง cx, cy ของวงขาวใน SVG coordinate
  const cx = 318, cy = 181;

  // แปลงจาก SVG coordinate → canvas coordinate
  const svgRenderW = svgW * scaleFactor;
  const svgRenderH = svgH * scaleFactor;
  const svgLeft = (600 - svgRenderW) / 2;
  const svgTop  = (400 - svgRenderH) / 2;

  const canvasCX = svgLeft + cx * scaleFactor;
  const canvasCY = svgTop  + cy * scaleFactor;

  // r=154.5 ใน SVG → canvas pixels
  const discDiameter = (154.5 + 20) * 2 * scaleFactor;

  return { canvasCX, canvasCY, discDiameter };
}

function placeVinylDisc() {
  if (!fCanvas) return;
  vinylDiscPlaced.value = true;

  const { canvasCX, canvasCY, discDiameter } = getDiscSnapInfo();
  // สร้าง SVG แผ่นเสียงแบบง่ายๆ ด้วยวงกลมหลายชั้น
  const discSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="98" fill="#111" stroke="#444" stroke-width="2"/><circle cx="100" cy="100" r="80" fill="none" stroke="#252525" stroke-width="1.5"/><circle cx="100" cy="100" r="65" fill="none" stroke="#1e1e1e" stroke-width="1.5"/><circle cx="100" cy="100" r="50" fill="none" stroke="#1e1e1e" stroke-width="1.5"/><circle cx="100" cy="100" r="35" fill="#1a1a1a" stroke="#333" stroke-width="1"/><circle cx="100" cy="100" r="6" fill="#CDF100"/></svg>`;
  const blob = new Blob([discSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then(img => {
    const scale = discDiameter / img.width;
    img.set({
      id: 'vinyl-disc',
      scaleX: scale,
      scaleY: scale,
      left: canvasCX,
      top: canvasCY,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasControls: false,
      hasBorders: false,
    });
    fCanvas.add(img);
    fCanvas.renderAll();
    URL.revokeObjectURL(url);
  });
}
function removeVinylDisc() {
  if (!fCanvas) return;
  ['vinyl-disc', 'disc-label'].forEach(id => { const obj = fCanvas.getObjects().find(o => o.id === id); if (obj) fCanvas.remove(obj); });
  vinylDiscPlaced.value = false; discImageURL.value = null; fCanvas.renderAll();
}
async function handleDiscImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  discImageFile.value = file;

  // แสดง preview ชั่วคราวระหว่าง upload
  const reader = new FileReader();
  reader.onload = (e) => { discImageURL.value = e.target.result; };
  reader.readAsDataURL(file);

  // อัปโหลดไฟล์จริงขึ้น server
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      discImageURL.value = data.url; // ใช้ URL จาก server แทน base64
    }
  } catch (err) {
    console.error('อัปโหลดรูปแผ่นเสียงไม่สำเร็จ:', err);
  }
}
async function applyImageToDisc() {
  if (!fCanvas || !discImageURL.value) return;
  const disc = fCanvas.getObjects().find(o => o.id === 'vinyl-disc');
  const { canvasCX, canvasCY, discDiameter } = getDiscSnapInfo();
  const cx = disc ? disc.left : canvasCX;
  const cy = disc ? disc.top  : canvasCY;
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
      // ขนาด label ≈ เส้นผ่านศูนย์กลางวงดำกลาง (r=35 ใน SVG 200px) * scale แผ่น
      const labelScale = (discDiameter / 200) * (35 * 2) / labelImg.width;
      labelImg.set({
        id: 'disc-label',
        left: cx,
        top: cy,
        originX: 'center',
        originY: 'center',
        scaleX: labelScale,
        scaleY: labelScale,
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: false,
      });
      fCanvas.add(labelImg);
      fCanvas.renderAll();
      resolve();
    };
    imgEl.src = discImageURL.value;
  });
}
async function handleAudioUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  audioFile.value = file;

  // revoke URL เก่าก่อน
  if (audioURL.value && audioURL.value.startsWith('blob:')) {
    URL.revokeObjectURL(audioURL.value);
  }

  // preview ชั่วคราวระหว่าง upload
  audioURL.value = URL.createObjectURL(file);

  // อัปโหลดไฟล์จริงขึ้น server
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      URL.revokeObjectURL(audioURL.value); // ล้าง blob URL ชั่วคราว
      audioURL.value = data.url; // ใช้ URL จาก server แทน
    }
  } catch (err) {
    console.error('อัปโหลดไฟล์เสียงไม่สำเร็จ:', err);
  }
}

// ================= STEP 4 (เล่นเพลง) FUNCTIONS =================
function togglePlay() {
  if (!audioPlayerEl.value) return;
  if (isPlaying.value) {
    audioPlayerEl.value.pause();
    isPlaying.value = false;
    stopDiscRotation();
  } else {
    audioPlayerEl.value.play();
    isPlaying.value = true;
    startDiscRotation();
  }
}
function stopAudio() {
  if (!audioPlayerEl.value) return;
  audioPlayerEl.value.pause();
  audioPlayerEl.value.currentTime = 0;
  isPlaying.value = false;
  audioProgress.value = 0;
  stopDiscRotation();
  rotationAngle.value = 0;
  if (fCanvas) {
    ['vinyl-disc', 'disc-label'].forEach(id => {
      const obj = fCanvas.getObjects().find(o => o.id === id);
      if (obj) obj.set({ angle: 0 });
    });
    fCanvas.renderAll();
  }
}
function onAudioEnded() {
  isPlaying.value = false;
  stopDiscRotation();
}
function updateProgress() {
  if (!audioPlayerEl.value) return;
  currentTime.value = audioPlayerEl.value.currentTime; audioDuration.value = audioPlayerEl.value.duration || 0;
  audioProgress.value = audioDuration.value ? (currentTime.value / audioDuration.value) * 100 : 0;
}
function seekAudio(event) {
  if (!audioPlayerEl.value || !audioDuration.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  audioPlayerEl.value.currentTime = ((event.clientX - rect.left) / rect.width) * audioDuration.value;
}
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60), s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ================= STEP 5 FUNCTIONS =================
function startDiscRotation() {
  if (animationFrameId.value) return;
  const discIds = ['vinyl-disc', 'disc-label'];
  function animate() {
    rotationAngle.value = (rotationAngle.value + 1.2) % 360;
    if (fCanvas) {
      discIds.forEach(id => {
        const obj = fCanvas.getObjects().find(o => o.id === id);
        if (obj) obj.set({ angle: rotationAngle.value });
      });
      fCanvas.renderAll();
    }
    animationFrameId.value = requestAnimationFrame(animate);
  }
  animationFrameId.value = requestAnimationFrame(animate);
}

function stopDiscRotation() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
}
async function renderThumbnail() {
  if (!fCanvas) return;
  fCanvas.discardActiveObject();
  fCanvas.renderAll();
  previewDataURL.value = fCanvas.toDataURL({ format: 'png', multiplier: 0.5 });
}
function downloadCanvas() {
  if (!isLoggedIn.value) {
    if (confirm("กรุณาเข้าสู่ระบบก่อนดาวน์โหลดผลงานครับ ไปหน้า Login ไหม?")) router.push('/login');
    return;
  }
  if (!fCanvas) return;
  fCanvas.discardActiveObject(); fCanvas.renderAll();
  const a = document.createElement('a'); a.href = fCanvas.toDataURL({ format: 'png', multiplier: 2 }); a.download = 'Limited-SpinCustom-Vinyl.png'; a.click();
}

async function saveSpecialOrder() {
  if (!isLoggedIn.value) {
    if (confirm("กรุณาเข้าสู่ระบบก่อนบันทึกออเดอร์ครับ ไปหน้า Login ไหม?")) router.push('/login');
    return;
  }
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
      quality: 0.7,
      multiplier: 0.5
    });

    // แปลง base64 dataURL → Blob → File แล้วอัปขึ้น /api/upload
    const blob = await fetch(thumbDataURL).then(r => r.blob());
    const thumbFile = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', thumbFile);

    let thumbnailURL = null;
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const uploadData = await uploadRes.json();
    if (uploadData.success) {
      thumbnailURL = uploadData.url; // เช่น /uploads/1234.jpg
    }
    // ----------------------------------------------------

    const orderData = {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      productName: activeCollection.value.campaign_name + " (Special Edition)",
      customText: customText.value,
      totalPrice: totalPrice.value,
      upload: thumbnailURL,   // เก็บแค่ URL ไม่เก็บ base64
      audioUrl: audioURL.value || null,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    localStorage.setItem('spinLastOrder', JSON.stringify({
      orderId: docRef.id,
      productName: orderData.productName,
      totalPrice: orderData.totalPrice,
      status: 'pending',
      source: 'new_order',
      userId: auth.currentUser.uid,
      savedAt: new Date().toISOString(),
    }))
    // เด้ง Popup แจ้งเตือนสั่งซื้อรุ่น Special สำเร็จ
    await window.Swal.fire({
      title: "สั่งซื้อรุ่นพิเศษสำเร็จ!",
      text: "กำลังพาคุณไปหน้าหลัก...",
      icon: "success",
      draggable: true,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#232321', // สีพื้นหลังกล่อง
      color: '#ffffff', // สีตัวหนังสือ
    });
    router.push('/');
  } catch (e) { 
    alert("เกิดข้อผิดพลาด: " + e.message); 
  } finally { 
    isSavingOrder.value = false; 
  }
}

function saveDraft() {
  const uid = auth.currentUser?.uid
  if (!uid) {
    window.Swal?.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'ต้องเข้าสู่ระบบก่อนจึงจะบันทึกการออกแบบค้างไว้ได้ครับ',
      icon: 'warning',
      background: '#232321',
      color: '#ffffff',
      confirmButtonColor: '#ff3b3b',
      confirmButtonText: 'ตกลง',
    })
    return
  }
  const draft = {
    savedAt: new Date().toISOString(),
    page: 'special',
    currentStep: currentStep.value,
    selectedIndex: selectedIndex.value,
    customText: customText.value,
    vinylDiscPlaced: vinylDiscPlaced.value,
    discImageURL: discImageURL.value,
    audioURL: audioURL.value,
    canvasObjects: fCanvas ? fCanvas.getObjects().filter(o => ['custom-name-text', 'custom-sticker'].includes(o.id)).map(o => {
      const obj = {
        id: o.id,
        left: o.left,
        top: o.top,
        scaleX: o.scaleX,
        scaleY: o.scaleY,
        angle: o.angle,
        selectable: o.selectable,
        evented: o.evented
      }
      if (o.id === 'custom-name-text') {
        obj.text = o.text
        obj.fontSize = o.fontSize
        obj.fill = o.fill
        obj.fontFamily = o.fontFamily
      } else if (o.id === 'custom-sticker') {
        obj.stickerData = o.stickerData
        obj.stickerPrice = o.stickerPrice
      }
      return obj
    }) : []
  };
  // บันทึกแยกตาม userId เพื่อไม่ให้ draft ปนกันระหว่าง user
  localStorage.setItem(`spinSpecialDraft_${uid}`, JSON.stringify(draft));
  draftSaved.value = true;
  setTimeout(() => { draftSaved.value = false; }, 3000);
}

function resetAll() {
  if (audioPlayerEl.value) { audioPlayerEl.value.pause(); audioPlayerEl.value.currentTime = 0; }
  customText.value = ""; vinylDiscPlaced.value = false; discImageURL.value = null; discImageFile.value = null;
  isPlaying.value = false; audioProgress.value = 0; currentTime.value = 0; audioDuration.value = 0; copySuccess.value = false;
  stickerCount.value = 0; canvasObjectVersion.value = 0; draftSaved.value = false;
  if (audioURL.value) { URL.revokeObjectURL(audioURL.value); audioURL.value = null; } audioFile.value = null;
  if (fCanvas) { fCanvas.clear(); fCanvas.backgroundColor = '#ffffff'; fCanvas.renderAll(); }
  currentStep.value = 1; updatePreviewImage();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap");

.customizer-layout { background-color: #1a1a17; min-height: 100vh; color: #fff; font-family: "Prompt", sans-serif; padding-bottom: 50px; }
.container-main { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.highlight-yellow { color: #cdf100; }
.text-red { color: #ff3b3b; font-family: 'Jura'; letter-spacing: 1px;}
.text-lime { color: #CDF100; }

.customizing-text { color: #ff3b3b; font-family: "Jura", sans-serif; letter-spacing: 3px; margin-bottom: 5px; font-weight: bold;}
.title-text { font-size: 36px; font-weight: 600; margin-bottom: 20px; }
.progress-bar-container { width: 100%; height: 8px; background-color: #333; border-radius: 4px; overflow: hidden; margin-bottom: 40px; }
.progress-bar-fill { height: 100%; background-color: #ff3b3b; transition: width 0.3s ease; } 

.header-section { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
.customizing-text, .title-text { text-align: center; }

/* Preview Area */
.preview-section { margin-bottom: 30px; }
.preview-card { background-color: #2a2a2a; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; align-items: center; border: 1px solid #444; overflow: hidden; position: relative;}
.bg-curve { position: absolute; top: 20%; left: 5%; right: 5%; bottom: -50%; border-radius: 50% 50% 0 0; pointer-events: none; border: 1px solid rgba(255,255,255,0.05);}
.canvas-wrapper { width: 100%; max-width: 600px; aspect-ratio: 3/2; background: #fff; border-radius: 12px; overflow: hidden; position: relative; z-index: 1;}
.product-info-block { z-index: 1; position: relative; width: 100%; }
.product-name { color: #ff3b3b; font-size: 24px; font-weight: 500; margin: 15px 0 5px 0; text-align: center; }
.product-desc { color: #ddd; font-size: 14px; margin: 0; text-align: center; }
.nav-arrows { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.arrow-btn { background: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 0; font-size: 20px; font-weight: bold; color: #000; }
.arrow-btn.btn-next { background: #ff3b3b; color: #fff; }
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Tool sections */
.step-container { animation: fadeIn 0.3s ease; }
.step-title { color: #ff3b3b; font-size: 24px; font-weight: 500; margin-bottom: 20px; }
.tools-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Step 1 */
.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.type-card { background-color: #111; border-radius: 12px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border: 2px solid #333;}
.type-card.active { border-color: #ff3b3b; box-shadow: 0 0 15px rgba(255, 59, 59, 0.3);}
.thumb-placeholder { width: 100%; height: 70%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.type-image { max-width: 80%; max-height: 80%; object-fit: contain; }
.type-label { font-size: 14px; color: #fff; margin-top: 10px; font-weight: 500;}

/* Panels and Inputs */
.tool-panel { background-color: #2a2a2a; border-radius: 12px; padding: 25px; border: 1px solid #444;}
.panel-title { color: #fff; font-size: 18px; font-weight: 500; margin-top: 0; }
.panel-title-left { color: #fff; font-size: 18px; font-weight: 500; margin-top: 0; }
.text-left { text-align: left !important; }
.custom-input { width: 100%; padding: 12px 15px; border-radius: 6px; border: none; background-color: #fff; color: #000; outline: none; font-family: 'Prompt', sans-serif; font-size: 16px; box-sizing: border-box; }

.btn-dark-grey { background-color: #111; color: #fff; border: 1px solid #444; padding: 10px 0; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; transition: 0.2s; }
.btn-dark-grey:hover { background-color: #000; }
.btn-yellow { background-color: #ff3b3b; color: #fff; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; font-weight: 500; transition: 0.2s; }
.btn-yellow:hover { transform: scale(1.03); }
.btn-danger-outline { background-color: transparent; color: #ff5555; border: 1px solid #ff5555; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: 'Prompt', sans-serif; }

/* Stickers */
.sticker-grid-3x2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.sticker-box { background-color: #e0e0e0; border-radius: 6px; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; border: 2px solid transparent; transition: 0.2s; }
.sticker-box:hover { border-color: #ff3b3b; transform: scale(1.05); }
.sticker-img { width: 80%; height: 80%; object-fit: contain; }

/* Uploaders */
.place-disc-area { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 16px 0; }
.disc-preview-static { opacity: 0.75; filter: drop-shadow(0 0 20px rgba(255,59,59,0.25)); }
.placed-controls { display: flex; flex-direction: column; gap: 8px; }
.status-badge { background: rgba(255,59,59,0.1); border: 1px solid rgba(255,59,59,0.35); color: #ff3b3b; padding: 8px 12px; border-radius: 8px; font-size: 13px; }
.sub-label { color: #fff; font-size: 15px; margin: 0 0 6px 0; }
.upload-box { display: block; border: 2px dashed #555; border-radius: 12px; min-height: 100px; cursor: pointer; transition: all 0.2s; overflow: hidden; }
.upload-box:hover, .upload-box.has-file { border-color: #ff3b3b; background: rgba(255,59,59,0.04); }
.upload-inner { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 18px 12px; color: #aaa; font-size: 13px; text-align: center; }
.upload-hint { font-size: 11px; color: #666; }
.upload-preview-wrap { position: relative; }
.upload-preview-img { width: 100%; height: 100px; object-fit: cover; display: block; }
.replace-text { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: #fff; text-align: center; font-size: 12px; padding: 4px; }
.audio-ctrl { width: 100%; filter: invert(1) hue-rotate(180deg); }
.hint-text { color: #888; font-size: 13px; }

/* Player */
.player-center { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.turntable-stage { display: flex; flex-direction: column; align-items: center; }
.spinning-disc { position: relative; transition: filter 0.4s; }
.spinning-disc.playing { animation: spinVinyl 2.8s linear infinite; filter: drop-shadow(0 0 36px rgba(255,59,59,0.35)); }
@keyframes spinVinyl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.disc-shimmer { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(transparent 0deg, rgba(255,255,255,0.04) 60deg, transparent 120deg); pointer-events: none; }
.eq-bars { display: flex; gap: 4px; margin-top: 18px; height: 28px; align-items: flex-end; }
.eq-bar { width: 5px; background: #333; border-radius: 2px; height: 5px; }
.eq-bars.active .eq-bar { animation: eqBounce 0.55s ease-in-out infinite alternate; background: #ff3b3b; }
@keyframes eqBounce { from { height: 4px; } to { height: 24px; } }
.player-controls { width: 100%; max-width: 340px; }
.progress-track { width: 100%; height: 6px; background: #333; border-radius: 3px; cursor: pointer; overflow: hidden; }
.progress-fill { height: 100%; background: #ff3b3b; border-radius: 3px; transition: width 0.1s linear; }
.time-labels { display: flex; justify-content: space-between; color: #888; font-size: 12px; margin-top: 5px; }
.control-btns { display: flex; justify-content: center; gap: 16px; margin-top: 18px; }
.ctrl-btn { background: #111; border: 2px solid #444; color: #fff; width: 56px; height: 56px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: all 0.2s; }
.ctrl-btn:hover:not(:disabled) { background: #ff3b3b; border-color: #ff3b3b; color: #fff; transform: scale(1.1); }
.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Summary */
.price-list { display: flex; flex-direction: column; gap: 10px; }
.price-row { display: flex; justify-content: space-between; align-items: center; color: #ccc; font-size: 14px; }
.price-val { color: #fff; font-weight: 500; }
.price-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 4px 0; }
.total-row { font-size: 16px; font-weight: 600; color: #fff; }
.price-total { font-size: 22px; font-weight: 700; }
.download-preview { background: #1a1a1a; border-radius: 8px; overflow: hidden; }
.thumb-canvas { width: 100%; height: auto; border-radius: 8px; border: 1px solid #444; display: block; }
.share-success { font-size: 13px; margin-top: 8px; }
.order-card { background: linear-gradient(135deg, #2a2a2a, #111); border: 1px solid #444; border-radius: 16px; padding: 20px; margin-top: 20px; }
.order-card-inner { display: flex; align-items: center; gap: 16px; }
.order-icon { font-size: 32px; color: #cdf100; }
.order-detail { flex: 1; }
.order-title { font-size: 15px; margin: 0 0 4px 0; font-weight: 500; }
.order-sub { color: #888; font-size: 12px; margin: 0; }
.order-price { font-size: 24px; font-weight: 700; }

.restart-section { display: flex; flex-direction: column; align-items: center; margin-top: 36px; gap: 12px; }
.restart-divider { width: 100%; display: flex; align-items: center; gap: 16px; }
.restart-divider::before, .restart-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255, 255, 255, 0.1); }
.restart-divider-text { color: #666; font-size: 13px; white-space: nowrap; }
.btn-restart { display: inline-flex; align-items: center; gap: 10px; background: transparent; border: 2px solid; padding: 14px 48px; border-radius: 8px; font-size: 16px; font-family: 'Prompt', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px; }
.btn-restart:hover { background: #ff3b3b; color: #fff !important; transform: scale(1.03); box-shadow: 0 0 24px rgba(255, 59, 59, 0.25); }
.restart-hint { color: #555; font-size: 12px; margin: 0; text-align: center; }

/* Utils */
.d-flex { display: flex; }
.flex-fill { flex: 1; }
.flex-column { flex-direction: column; }
.align-items-center { align-items: center; }
.gap-2 { gap: 8px; }
.text-center { text-align: center; }
.mt-4 { margin-top: 16px; }
.mt-5 { margin-top: 24px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.position-relative { position: relative; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>