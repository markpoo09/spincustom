<template>
  <div class="orders-wrapper">
    <div class="container-main">

      <!-- LOADING -->
      <div v-if="isLoading" class="loading-screen">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <!-- NOT LOGGED IN -->
      <div v-else-if="!currentUser" class="not-logged-in">
        <div class="empty-icon"><i class="fa-solid fa-user-lock"></i></div>
        <h2>กรุณาเข้าสู่ระบบก่อน</h2>
        <p>คุณต้องล็อกอินเพื่อดูออเดอร์</p>
        <NuxtLink to="/login" class="btn-yellow">เข้าสู่ระบบ</NuxtLink>
      </div>

      <!-- MAIN CONTENT -->
      <div v-else class="orders-content">

        <!-- HEADER -->
        <div class="orders-header">
          <h1>ออเดอร์ของฉัน</h1>
          <!-- <NuxtLink to="/profile" class="btn-outline-yellow">กลับไปโปรไฟล์</NuxtLink> -->
        </div>

        <!-- Draft Banners — รองรับทั้ง custom และ special -->
        <div v-for="draft in drafts" :key="draft.page" class="draft-banner" :class="draft.page === 'special' ? 'draft-banner--special' : ''">
          <div class="draft-info">
            <span class="draft-icon"><i class="fa-solid" :class="draft.page === 'special' ? 'fa-star' : 'fa-sliders'" :style="draft.page === 'special' ? 'color: #ff3b3b;' : 'color: #CDF100;'"></i></span>
            <div>
              <p class="draft-title">{{ draft.label }}</p>
              <p class="draft-sub">บันทึกเมื่อ {{ formatDraftDate(draft.savedAt) }}</p>
            </div>
          </div>
          <div class="draft-actions">
            <NuxtLink :to="draft.restoreTo" class="btn-yellow draft-btn" :style="draft.page === 'special' ? 'background:#ff3b3b;color:#fff' : ''">
              กู้คืนงาน
            </NuxtLink>
            <button @click="clearDraft(draft.clearKey)" class="draft-btn-sm">ลบ</button>
          </div>
        </div>

        <div v-if="isLoadingOrders" class="loading-orders">
          <div class="spinner small"></div>
          <p>กำลังโหลดออเดอร์...</p>
        </div>

        <div v-else-if="orders.length === 0" class="empty-orders">
          <div class="empty-icon"><i class="fa-solid fa-envelope-open" style="color: #888;"></i></div>
          <h3>ยังไม่มีออเดอร์</h3>
          <p>เริ่มออกแบบเครื่องเล่นแผ่นเสียงของคุณได้เลย!</p>
          <NuxtLink to="/custom" class="btn-yellow">START CUSTOMIZING</NuxtLink>
        </div>

        <div v-else class="orders-list">
          <div
            class="order-card"
            :class="{ expanded: expandedOrderId === order.id }"
            v-for="order in orders"
            :key="order.id"
            @click="toggleOrderDetail(order.id)"
          >
            <div class="order-card-header">
              <!-- LEFT: BIG IMAGE with ambient glow -->
              <div class="order-img-zone">
                <div v-if="order.upload" class="order-img-glow" :style="{ backgroundImage: 'url(' + order.upload + ')' }"></div>
                <img v-if="order.upload" :src="order.upload" class="order-img" alt="thumbnail">
                <div v-else class="order-img-empty"><i class="fa-solid fa-compact-disc"></i></div>
              </div>
              <!-- RIGHT: INFO BENTO -->
              <div class="order-bento">
                <div class="bento-row-top">
                  <span class="status-pill" :class="'sp-' + order.status" v-html="statusLabel(order.status)"></span>
                  <div class="bento-top-right">
                    <button
                      v-if="order.audioUrl"
                      class="vinyl-play-btn"
                      :class="{ 'is-playing': playingOrderId === order.id }"
                      @click.stop="toggleAudio(order)"
                    >
                      <div class="vpb-disc" :class="{ 'spinning': playingOrderId === order.id }">
                        <div class="vpb-disc-center"></div>
                      </div>
                      <span class="vpb-icon"><i class="fa-solid" :class="playingOrderId === order.id ? 'fa-pause' : 'fa-play'"></i></span>
                    </button>
                    <span class="chevron" :class="{ open: expandedOrderId === order.id }">▾</span>
                  </div>
                </div>
                <p class="order-product">{{ order.productName || 'เครื่องเล่นแผ่นเสียง' }}</p>
                <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                <div class="price-chip">
                  <span class="price-label">ยอดรวม</span>
                  <span class="price-value">฿{{ (order.totalPrice || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
            <!-- Mini Player Bar -->
            <transition name="player-slide">
              <div v-if="playingOrderId === order.id && order.audioUrl" class="mini-player" @click.stop>
                <div class="mini-vinyl" :class="{ spinning: playingOrderId === order.id }">
                  <div class="mini-vinyl-inner"></div>
                </div>
                <div class="mini-player-info">
                  <p class="mini-player-title"><i class="fa-solid fa-music" style="color: #CDF100;"></i> {{ order.productName }}</p>
                  <div class="mini-progress-bar">
                    <div class="mini-progress-fill" :style="{ width: (audioProgress[order.id] || 0) + '%' }"></div>
                  </div>
                  <div class="mini-time">
                    <span>{{ formatAudioTime(audioCurrent[order.id] || 0) }}</span>
                    <span>{{ formatAudioTime(audioDurationMap[order.id] || 0) }}</span>
                  </div>
                </div>
                <div class="mini-controls">
                  <button class="mini-btn" @click="toggleAudio(order)"><i class="fa-solid" :class="playingOrderId === order.id ? 'fa-pause' : 'fa-play'" style="color: #fff;"></i></button>
                  <button class="mini-btn" @click="stopAudio()"><i class="fa-solid fa-stop" style="color: #fff;"></i></button>
                </div>
                <audio
                  :ref="el => { if (el) audioRefs[order.id] = el }"
                  :src="order.audioUrl"
                  @timeupdate="onTimeUpdate(order.id, $event)"
                  @loadedmetadata="onLoadedMeta(order.id, $event)"
                  @ended="onAudioEnded(order.id)"
                ></audio>
              </div>
            </transition>
            <!-- Order Detail -->
            <transition name="expand">
              <div v-if="expandedOrderId === order.id" class="order-detail">
                <div class="detail-divider"></div>
                <!-- Status Timeline -->
                <div class="status-timeline">
                  <div class="timeline-step">
                    <div class="timeline-dot done"></div>
                    <p class="timeline-label">สั่งซื้อแล้ว</p>
                  </div>
                  <div class="timeline-line" :class="{ done: ['processing', 'completed'].includes(order.status) }"></div>
                  <div class="timeline-step">
                    <div class="timeline-dot" :class="{ done: ['processing', 'completed'].includes(order.status) }"></div>
                    <p class="timeline-label">กำลังผลิต</p>
                  </div>
                  <div class="timeline-line" :class="{ done: order.status === 'completed' }"></div>
                  <div class="timeline-step">
                    <div class="timeline-dot" :class="{ done: order.status === 'completed' }"></div>
                    <p class="timeline-label">จัดส่งแล้ว</p>
                  </div>
                </div>
                <!-- Tracking -->
                <div v-if="order.trackingNumber" class="tracking-box">
                  <p class="tracking-label">หมายเลขติดตามพัสดุ</p>
                  <p class="tracking-number">{{ order.trackingNumber }}</p>
                </div>
                <div v-else-if="order.status !== 'completed'" class="tracking-box pending">
                  <p class="tracking-label">กำลังรอหมายเลขติดตาม</p>
                  <p style="color:#888; font-size:13px; margin:0;">ระบบจะอัปเดตเมื่อพัสดุถูกจัดส่ง</p>
                </div>
                <!-- Price breakdown -->
                <div class="price-breakdown">
                  <p class="breakdown-title">รายละเอียดค่าใช้จ่าย</p>
                  <div class="breakdown-row"><span>ราคาเครื่องเล่น</span><span>฿{{ (order.basePrice || 0).toLocaleString() }}</span></div>
                  <div v-if="order.stickerPrice" class="breakdown-row"><span>ค่าสติ๊กเกอร์</span><span>฿{{ order.stickerPrice.toLocaleString() }}</span></div>
                  <div v-if="order.specialPrice" class="breakdown-row"><span>ค่า Special Collection</span><span>฿{{ order.specialPrice.toLocaleString() }}</span></div>
                  <div class="breakdown-divider"></div>
                  <div class="breakdown-row total"><span>ยอดรวม</span><span class="text-yellow">฿{{ (order.totalPrice || 0).toLocaleString() }}</span></div>
                </div>
                <!-- Admin Note -->
                <div v-if="order.adminNote" class="admin-note-box">
                  <p class="admin-note-label">หมายเหตุจากผู้ดูแลระบบ</p>
                  <p class="admin-note-text">{{ order.adminNote }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase'

const router = useRouter()

const isLoading = ref(true)
const isLoadingOrders = ref(true)
const currentUser = ref(null)
const orders = ref([])
const expandedOrderId = ref(null)
const playingOrderId = ref(null)
const audioRefs = {}
const audioProgress = ref({})
const audioCurrent = ref({})
const audioDurationMap = ref({})
const drafts = ref([])

function toggleAudio(order) {
  const el = audioRefs[order.id]
  if (playingOrderId.value === order.id) {
    if (el) el.pause()
    playingOrderId.value = null
  } else {
    if (playingOrderId.value) {
      const prev = audioRefs[playingOrderId.value]
      if (prev) { prev.pause(); prev.currentTime = 0 }
    }
    playingOrderId.value = order.id
    nextTick(() => {
      const newEl = audioRefs[order.id]
      if (newEl) newEl.play().catch(() => {})
    })
  }
}

function stopAudio() {
  if (playingOrderId.value) {
    const el = audioRefs[playingOrderId.value]
    if (el) { el.pause(); el.currentTime = 0 }
    playingOrderId.value = null
  }
}

function onTimeUpdate(orderId, e) {
  const el = e.target
  if (!el.duration) return
  audioCurrent.value = { ...audioCurrent.value, [orderId]: el.currentTime }
  audioProgress.value = { ...audioProgress.value, [orderId]: (el.currentTime / el.duration) * 100 }
}

function onLoadedMeta(orderId, e) {
  audioDurationMap.value = { ...audioDurationMap.value, [orderId]: e.target.duration }
}

function onAudioEnded(orderId) {
  playingOrderId.value = null
  audioProgress.value = { ...audioProgress.value, [orderId]: 0 }
  audioCurrent.value = { ...audioCurrent.value, [orderId]: 0 }
}

function formatAudioTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function checkDraft(uid) {
  const found = []
  // ตรวจ custom draft
  try {
    const raw = localStorage.getItem(`spinCustomDraft_${uid}`)
    if (raw) {
      const draft = JSON.parse(raw)
      found.push({
        page: 'custom',
        savedAt: draft.savedAt,
        label: draft.selectedType ? `Custom Vinyl (Type ${draft.selectedType})` : 'Custom Vinyl',
        restoreTo: '/custom?restore=1',
        clearKey: `spinCustomDraft_${uid}`,
      })
    }
  } catch {}
  // ตรวจ special draft
  try {
    const raw = localStorage.getItem(`spinSpecialDraft_${uid}`)
    if (raw) {
      const draft = JSON.parse(raw)
      const specialNames = ['RED HOT CHILI PEPPERS', 'BLUE & GREY EDITION']
      found.push({
        page: 'special',
        savedAt: draft.savedAt,
        label: specialNames[draft.selectedIndex] || 'Special Edition',
        restoreTo: '/specialcustom?restore=special',
        clearKey: `spinSpecialDraft_${uid}`,
      })
    }
  } catch {}
  drafts.value = found
}

function clearDraft(clearKey) {
  localStorage.removeItem(clearKey)
  // reload จาก uid ปัจจุบัน
  if (currentUser.value) checkDraft(currentUser.value.uid)
}

function formatDraftDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const statusLabel = (status) => ({
  pending: '<i class="fa-solid fa-clock" style="color: #ffb74d;"></i> รอดำเนินการ',
  processing: '<i class="fa-solid fa-wrench" style="color: #64b5f6;"></i> กำลังผลิต',
  completed: '<i class="fa-solid fa-check-circle" style="color: #81c784;"></i> จัดส่งแล้ว'
}[status] || status)

const fetchOrders = async (uid) => {
  isLoadingOrders.value = true
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    orders.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('fetchOrders error:', e)
    // ✅ เพิ่ม: ถ้า error เพราะ index ให้แสดง link สร้าง index ใน console
    if (e.code === 'failed-precondition') {
      console.warn('⚠️ ต้องสร้าง Composite Index ใน Firestore! ดู link ใน error ด้านบน')
    }
    orders.value = []
  } finally {
    isLoadingOrders.value = false  // ✅ ต้องอยู่ใน finally เสมอ
  }
}

const toggleOrderDetail = (id) => { expandedOrderId.value = expandedOrderId.value === id ? null : id }

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      checkDraft(user.uid)
      await fetchOrders(user.uid)
    }
    isLoading.value = false
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

/* ─── Base ─── */
.orders-wrapper { background-color: #18181400; min-height: 100vh; font-family: 'Prompt', sans-serif; color: #fff; }
.container-main { max-width: 900px; margin: 0 auto; padding: 60px 20px 100px; }

/* ─── Loading / Auth ─── */
.loading-screen, .not-logged-in { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; color: #aaa; }
.empty-icon { font-size: 64px; }
.not-logged-in h2 { color: #fff; font-size: 24px; margin: 0; }
.not-logged-in p { color: #888; margin: 0; }
.spinner { width: 40px; height: 40px; border: 3px solid #2a2a2a; border-top-color: #CDF100; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner.small { width: 24px; height: 24px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Header ─── */
.orders-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
.orders-header h1 { font-size: 30px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }

/* ─── Draft Banner ─── */
.draft-banner { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: rgba(205,241,0,0.06); border: 1px solid rgba(205,241,0,0.2); border-radius: 16px; padding: 14px 18px; margin-bottom: 14px; flex-wrap: wrap; backdrop-filter: blur(10px); }
.draft-banner--special { background: rgba(255,59,59,0.06); border-color: rgba(255,59,59,0.2); }
.draft-info { display: flex; align-items: center; gap: 12px; }
.draft-icon { font-size: 26px; }
.draft-title { color: #CDF100; font-size: 14px; font-weight: 600; margin: 0 0 2px; }
.draft-sub { color: #666; font-size: 12px; margin: 0; }
.draft-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.draft-btn { padding: 8px 18px; font-size: 13px; border-radius: 10px; text-decoration: none; }
.draft-btn-sm { background: transparent; color: #666; border: 1px solid #333; padding: 7px 12px; border-radius: 10px; font-family: 'Prompt', sans-serif; font-size: 12px; cursor: pointer; transition: 0.2s; }
.draft-btn-sm:hover { border-color: #ff5555; color: #ff5555; }

/* ─── Empty / Loading orders ─── */
.loading-orders { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; color: #555; }
.empty-orders { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; text-align: center; }
.empty-orders h3 { color: #fff; font-size: 20px; margin: 0; }
.empty-orders p { color: #666; margin: 0 0 8px; }

/* ─── Orders List ─── */
.orders-list { display: flex; flex-direction: column; gap: 14px; }

/* ─── Order Card — 2026 Bento Style ─── */
.order-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s;
  backdrop-filter: blur(20px);
}
.order-card:hover {
  border-color: rgba(205,241,0,0.25);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(205,241,0,0.1);
}
.order-card.expanded {
  border-color: rgba(205,241,0,0.2);
}

/* ─── Card Header Layout ─── */
.order-card-header {
  display: grid;
  grid-template-columns: 180px 1fr;
  min-height: 180px;
}

/* ─── Image Zone ─── */
.order-img-zone {
  position: relative;
  overflow: hidden;
  background: #0e0e0c;
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-img-glow {
  position: absolute;
  inset: -20px;
  background-size: cover;
  background-position: center;
  filter: blur(28px) saturate(1.4);
  opacity: 0.45;
  transform: scale(1.1);
}
.order-img {
  position: relative;
  z-index: 1;
  width: 160px;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6));
}
.order-img-empty {
  position: relative;
  z-index: 1;
  font-size: 52px;
  color: rgba(205,241,0,0.3);
}

/* ─── Info Bento ─── */
.order-bento {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 22px;
  border-left: 1px solid rgba(255,255,255,0.06);
}
.bento-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.bento-top-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Status Pill ─── */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.sp-pending   { background: rgba(255,180,0,0.1);  color: #ffb74d; border: 1px solid rgba(255,180,0,0.2); }
.sp-processing{ background: rgba(100,180,255,0.1); color: #64b5f6; border: 1px solid rgba(100,180,255,0.2); }
.sp-completed { background: rgba(129,199,132,0.1); color: #81c784; border: 1px solid rgba(129,199,132,0.2); }

/* ─── Product Info ─── */
.order-product {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.2px;
}
.order-date { color: #555; font-size: 12px; margin: 4px 0 0; }

/* ─── Price Chip ─── */
.price-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: rgba(205,241,0,0.07);
  border: 1px solid rgba(205,241,0,0.15);
  border-radius: 12px;
  padding: 8px 16px;
  align-self: flex-start;
}
.price-label { color: #666; font-size: 11px; }
.price-value { color: #CDF100; font-size: 20px; font-weight: 700; font-family: 'Jura', sans-serif; letter-spacing: 0.5px; }

/* ─── Chevron ─── */
.chevron { color: #444; font-size: 18px; transition: transform 0.3s, color 0.2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); color: #CDF100; }

/* ─── Vinyl Play Button ─── */
.vinyl-play-btn { position: relative; width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s, background 0.2s; overflow: hidden; }
.vinyl-play-btn:hover, .vinyl-play-btn.is-playing { border-color: #CDF100; background: rgba(205,241,0,0.1); }
.vpb-disc { width: 30px; height: 30px; border-radius: 50%; background: conic-gradient(#1a1a1a 0deg, #2a2a2a 60deg, #1a1a1a 120deg, #2a2a2a 180deg, #1a1a1a 240deg, #2a2a2a 300deg, #1a1a1a 360deg); position: absolute; }
.vpb-disc.spinning { animation: spin 1.8s linear infinite; }
.vpb-disc-center { width: 7px; height: 7px; border-radius: 50%; background: #CDF100; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.vpb-icon { position: relative; z-index: 2; font-size: 12px; color: #fff; }

/* ─── Mini Player ─── */
.mini-player { display: flex; align-items: center; gap: 14px; background: rgba(205,241,0,0.04); border-top: 1px solid rgba(205,241,0,0.1); padding: 12px 22px; }
.mini-vinyl { width: 36px; height: 36px; border-radius: 50%; background: conic-gradient(#111 0deg, #252525 45deg, #111 90deg, #252525 135deg, #111 180deg, #252525 225deg, #111 270deg, #252525 315deg, #111 360deg); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.mini-vinyl.spinning { animation: spin 2s linear infinite; }
.mini-vinyl-inner { width: 9px; height: 9px; border-radius: 50%; background: #CDF100; }
.mini-player-info { flex: 1; min-width: 0; }
.mini-player-title { color: #aaa; font-size: 12px; margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-progress-bar { height: 2px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.mini-progress-fill { height: 100%; background: linear-gradient(90deg, #CDF100, #a8c400); border-radius: 2px; transition: width 0.3s linear; }
.mini-time { display: flex; justify-content: space-between; color: #444; font-size: 11px; }
.mini-controls { display: flex; gap: 6px; flex-shrink: 0; }
.mini-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.mini-btn:hover { border-color: #CDF100; color: #CDF100; }

/* ─── Order Detail ─── */
.order-detail { padding: 0 22px 22px; }
.detail-divider { height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 20px; }

/* ─── Status Timeline ─── */
.status-timeline { display: flex; align-items: center; justify-content: center; margin-bottom: 16px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; }
.timeline-step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: #222; border: 2px solid #333; transition: 0.3s; }
.timeline-dot.done { background: #CDF100; border-color: #CDF100; box-shadow: 0 0 12px rgba(205,241,0,0.5); }
.timeline-label { color: #555; font-size: 11px; white-space: nowrap; margin: 0; }
.timeline-line { flex: 1; height: 1px; background: #2a2a2a; min-width: 60px; transition: background 0.3s; }
.timeline-line.done { background: linear-gradient(90deg, #CDF100, #a8c400); }

/* ─── Tracking ─── */
.tracking-box { background: rgba(205,241,0,0.04); border: 1px solid rgba(205,241,0,0.15); border-radius: 14px; padding: 14px 18px; margin-bottom: 12px; }
.tracking-box.pending { background: rgba(255,152,0,0.04); border-color: rgba(255,152,0,0.15); }
.tracking-label { color: #555; font-size: 11px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.8px; }
.tracking-number { color: #CDF100; font-size: 18px; font-weight: 600; font-family: 'Jura', sans-serif; letter-spacing: 2px; margin: 0; }

/* ─── Price Breakdown ─── */
.price-breakdown { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 16px 18px; margin-bottom: 12px; }
.breakdown-title { color: #888; font-size: 11px; font-weight: 500; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.8px; }
.breakdown-row { display: flex; justify-content: space-between; color: #555; font-size: 14px; margin-bottom: 6px; }
.breakdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 10px 0; }
.breakdown-row.total { color: #ccc; font-weight: 600; font-size: 15px; }
.text-yellow { color: #CDF100; }

/* ─── Admin Note ─── */
.admin-note-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 14px 18px; }
.admin-note-label { color: #555; font-size: 11px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.8px; }
.admin-note-text { color: #888; font-size: 14px; margin: 0; line-height: 1.7; }

/* ─── Buttons ─── */
.btn-yellow { display: inline-block; background: #CDF100; color: #111; padding: 10px 24px; border-radius: 12px; font-family: 'Prompt', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: 0.2s; }
.btn-yellow:hover { background: #b8d900; }
.btn-outline-yellow { background: transparent; color: #CDF100; border: 1px solid rgba(205,241,0,0.4); padding: 10px 28px; border-radius: 12px; font-family: 'Prompt', sans-serif; font-size: 14px; cursor: pointer; transition: 0.2s; text-decoration: none; }
.btn-outline-yellow:hover { background: rgba(205,241,0,0.06); }

/* ─── Transitions ─── */
.expand-enter-active, .expand-leave-active { transition: opacity 0.25s ease, max-height 0.35s ease; max-height: 700px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.player-slide-enter-active, .player-slide-leave-active { transition: max-height 0.3s ease, opacity 0.25s ease; max-height: 80px; overflow: hidden; }
.player-slide-enter-from, .player-slide-leave-to { max-height: 0; opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .orders-header h1 { font-size: 22px; }
  .order-card-header { grid-template-columns: 130px 1fr; min-height: 140px; }
  .order-img { width: 100px; height: 100px; }
  .price-value { font-size: 16px; }
  .order-product { font-size: 14px; }
  .order-bento { padding: 14px 14px; }
}
</style>