<template>
  <div class="profile-wrapper">
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
        <p>คุณต้องล็อกอินเพื่อดูหน้าโปรไฟล์</p>
        <NuxtLink to="/login" class="btn-yellow">เข้าสู่ระบบ</NuxtLink>
      </div>

      <!-- MAIN CONTENT -->
      <div v-else class="profile-content">

        <!-- HEADER -->
        <div class="profile-header">
          <div class="avatar-circle">{{ userInitial }}</div>
          <div class="header-info">
            <p class="header-label">SPINCUSTOM MEMBER</p>
            <h1 class="header-name">{{ userData.name || currentUser.email }}</h1>
            <span class="role-badge" :class="userData.role === 'admin' ? 'role-admin' : 'role-player'">
              {{ userData.role === 'admin' ? 'Admin' : 'Player' }}
            </span>
          </div>
          <button @click="handleLogout" class="btn-logout">ออกจากระบบ</button>
        </div>

        <!-- TABS -->
        <div class="tab-bar">
          <button class="tab-btn" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
            ออเดอร์ของฉัน
            <span v-if="orders.length > 0" class="tab-badge">{{ orders.length }}</span>
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
            ข้อมูลส่วนตัว
          </button>
        </div>

        <!-- TAB: INFO -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <div v-if="!isEditing" class="info-grid">
            <div class="info-card">
              <p class="info-label">ชื่อของคุณ</p>
              <p class="info-value">{{ userData.name || '-' }}</p>
            </div>
            <div class="info-card">
              <p class="info-label">อีเมล</p>
              <p class="info-value">{{ currentUser.email }}</p>
            </div>
            <div class="info-card">
              <p class="info-label">อายุ</p>
              <p class="info-value">{{ userData.age ? userData.age + ' ปี' : '-' }}</p>
            </div>
            <div class="info-card">
              <p class="info-label">เบอร์โทรศัพท์</p>
              <p class="info-value">{{ userData.phone || '-' }}</p>
            </div>
            <div class="info-card full-width">
              <p class="info-label">วงดนตรีที่ชอบ</p>
              <p class="info-value highlight">{{ userData.favoriteBand || '-' }}</p>
            </div>
            <div class="info-card">
              <p class="info-label">วันที่สมัครสมาชิก</p>
              <p class="info-value">{{ formatDate(userData.createdAt) }}</p>
            </div>
            <div class="info-card">
              <p class="info-label">จำนวนออเดอร์ทั้งหมด</p>
              <p class="info-value highlight">{{ orders.length }} รายการ</p>
            </div>
          </div>

          <div v-else class="edit-form">
            <div class="input-group mb-3">
              <label>ชื่อ</label>
              <input type="text" v-model="editData.name" class="custom-input" placeholder="ชื่อของคุณ">
            </div>
            <div class="d-flex gap-2 mb-3">
              <div class="input-group flex-fill">
                <label>อายุ</label>
                <input type="number" v-model="editData.age" class="custom-input" placeholder="เช่น 20">
              </div>
              <div class="input-group flex-fill">
                <label>เบอร์โทรศัพท์</label>
                <input type="tel" v-model="editData.phone" class="custom-input" placeholder="08x-xxx-xxxx">
              </div>
            </div>
            <div class="input-group mb-4">
              <label>วงดนตรีที่ชอบ</label>
              <input type="text" v-model="editData.favoriteBand" class="custom-input" placeholder="เช่น Arctic Monkeys, Bodyslam...">
            </div>
            <div class="d-flex gap-2">
              <button @click="isEditing = false" class="btn-grey flex-fill">ยกเลิก</button>
              <button @click="saveProfile" :disabled="isSaving" class="btn-yellow flex-fill">
                {{ isSaving ? 'กำลังบันทึก...' : 'บันทึก' }}
              </button>
            </div>
          </div>

          <div v-if="!isEditing" class="text-center mt-4">
            <button @click="startEditing" class="btn-outline-yellow"><i class="fa-solid fa-edit" style="color: #2196f3;"></i> แก้ไขข้อมูล</button>
          </div>
        </div>

        <!-- TAB: ORDERS -->
        <div v-if="activeTab === 'orders'" class="tab-content">

          <!-- Draft Banners — รองรับทั้ง custom และ special -->
          <div v-for="draft in drafts" :key="draft.page" class="draft-banner" :class="draft.page === 'special' ? 'draft-banner--special' : ''">
            <div class="draft-info">
              <span class="draft-icon"><i class="fa-solid" :class="draft.page === 'special' ? 'fa-star' : 'fa-sliders'" :style="draft.page === 'special' ? 'color: #ff3b3b;' : 'color: #CDF100;'"></i></span>
              <div>
                <p class="draft-title" :style="draft.page === 'special' ? 'color:#ff3b3b' : ''">
                  {{ draft.label }}
                </p>
                <p class="draft-sub">บันทึกเมื่อ {{ formatDraftDate(draft.savedAt) }}</p>
              </div>
            </div>
            <div class="draft-actions">
              <NuxtLink :to="draft.restoreTo" class="btn-yellow draft-btn" :style="draft.page === 'special' ? 'background:#ff3b3b;color:#fff' : ''">
                ↩ ไปต่อการออกแบบ
              </NuxtLink>
              <button @click="clearDraft(draft.clearKey)" class="btn-grey draft-btn-sm">ลบ draft</button>
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
              v-for="order in orders"
              :key="order.id"
              class="order-card"
              @click="toggleOrderDetail(order.id)"
            >
              <div class="order-card-header">
                <div class="order-thumb-wrap">
                  <img v-if="order.upload" :src="order.upload" class="order-thumb" alt="thumbnail">
                  <div v-else class="thumb-placeholder"><i class="fa-solid fa-music" style="color: #CDF100;"></i></div>
                </div>
                <div class="order-meta">
                  <p class="order-product">{{ order.productName || 'เครื่องเล่นแผ่นเสียง' }}</p>
                  <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="order-right">
                  <p class="order-price">฿{{ (order.totalPrice || 0).toLocaleString() }}</p>
                  <span class="status-badge" :class="'status-' + order.status" v-html="statusLabel(order.status)"></span>
                </div>
                <button
                  v-if="order.audioUrl"
                  class="vinyl-play-btn"
                  :class="{ 'is-playing': playingOrderId === order.id }"
                  @click.stop="toggleAudio(order)"
                >
                  <div class="vpb-disc" :class="{ 'spinning': playingOrderId === order.id }">
                    <div class="vpb-disc-center"></div>
                  </div>
                  <span class="vpb-icon"><i class="fa-solid" :class="playingOrderId === order.id ? 'fa-pause' : 'fa-play'" style="color: #fff;"></i></span>
                </button>
                <span class="chevron" :class="{ open: expandedOrderId === order.id }">▾</span>
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
              <transition name="expand">
                <div v-if="expandedOrderId === order.id" class="order-detail">
                  <div class="detail-divider"></div>

                  <!-- Timeline -->
                  <div class="status-timeline">
                    <div class="timeline-step">
                      <div class="timeline-dot done"></div>
                      <p class="timeline-label">รับออเดอร์แล้ว</p>
                    </div>
                    <div class="timeline-line" :class="{ done: order.status === 'processing' || order.status === 'completed' }"></div>
                    <div class="timeline-step">
                      <div class="timeline-dot" :class="{ done: order.status === 'processing' || order.status === 'completed' }"></div>
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
                    <p class="admin-note-label">หมายเหตุจากร้าน</p>
                    <p class="admin-note-text">{{ order.adminNote }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, collection, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore'
import { auth, db } from '~/utils/firebase'

const router = useRouter()

const isLoading = ref(true)
const isLoadingOrders = ref(true)
const isSaving = ref(false)
const currentUser = ref(null)
const userData = ref({})
const orders = ref([])
const activeTab = ref('info')
const isEditing = ref(false)
const editData = ref({})
const expandedOrderId = ref(null)
const playingOrderId = ref(null)
const audioRefs = {}
const audioProgress = ref({})
const audioCurrent = ref({})
const audioDurationMap = ref({})

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

// Draft design state — รองรับทั้ง custom และ special
const drafts = ref([]) // array ของ draft ทุกประเภท


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

// computed สำหรับ template เดิมที่ใช้ hasDraft (backward compat)
const hasDraft = computed(() => drafts.value.length > 0)

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

const userInitial = computed(() => {
  const name = userData.value.name || currentUser.value?.email || '?'
  return name.charAt(0).toUpperCase()
})

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

const fetchUserData = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) userData.value = snap.data()
  } catch (e) { console.error(e) }
}

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

const startEditing = () => {
  editData.value = { name: userData.value.name || '', age: userData.value.age || '', phone: userData.value.phone || '', favoriteBand: userData.value.favoriteBand || '' }
  isEditing.value = true
}

const saveProfile = async () => {
  if (!currentUser.value) return
  isSaving.value = true
  try {
    await updateDoc(doc(db, 'users', currentUser.value.uid), { name: editData.value.name, age: Number(editData.value.age), phone: editData.value.phone, favoriteBand: editData.value.favoriteBand })
    userData.value = { ...userData.value, ...editData.value }
    isEditing.value = false
    window.Swal.fire({ title: 'บันทึกสำเร็จ!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#232321', color: '#fff' })
  } catch (e) {
    window.Swal.fire({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', background: '#232321', color: '#fff' })
  } finally { isSaving.value = false }
}

const handleLogout = async () => {
  const result = await window.Swal.fire({ title: 'ออกจากระบบ?', icon: 'question', showCancelButton: true, background: '#232321', color: '#fff', confirmButtonColor: '#CDF100', cancelButtonColor: '#444', confirmButtonText: '<span style="color:#000;font-weight:bold;">ใช่</span>', cancelButtonText: 'ยกเลิก' })
  if (result.isConfirmed) { await signOut(auth); router.push('/') }
}

const toggleOrderDetail = (id) => { expandedOrderId.value = expandedOrderId.value === id ? null : id }

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      checkDraft(user.uid)
      await fetchUserData(user.uid)
      await fetchOrders(user.uid)
    }
    isLoading.value = false
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

.profile-wrapper { background-color: #20201A; min-height: 100vh; font-family: 'Prompt', sans-serif; color: #fff; }
.container-main { max-width: 860px; margin: 0 auto; padding: 60px 20px 80px; }

.loading-screen, .not-logged-in { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; color: #aaa; }
.empty-icon { font-size: 64px; }
.not-logged-in h2 { color: #fff; font-size: 24px; margin: 0; }
.not-logged-in p { color: #888; margin: 0; }

.spinner { width: 40px; height: 40px; border: 3px solid #333; border-top-color: #CDF100; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner.small { width: 24px; height: 24px; }
@keyframes spin { to { transform: rotate(360deg); } }

.profile-header { display: flex; align-items: center; gap: 20px; background: #232321; border: 1px solid #333; border-radius: 16px; padding: 28px 32px; margin-bottom: 28px; flex-wrap: wrap; }
.avatar-circle { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #CDF100, #8ab000); color: #000; font-size: 30px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.header-info { flex: 1; }
.header-label { color: #CDF100; font-family: 'Jura', sans-serif; font-size: 12px; letter-spacing: 2px; margin: 0 0 4px; }
.header-name { font-size: 22px; font-weight: 600; margin: 0 0 8px; }
.role-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
.role-player { background: rgba(205,241,0,0.12); color: #CDF100; border: 1px solid rgba(205,241,0,0.3); }
.role-admin { background: rgba(33,150,243,0.12); color: #64b5f6; border: 1px solid rgba(33,150,243,0.3); }
.btn-logout { background: transparent; color: #ff5555; border: 1px solid #ff5555; padding: 8px 20px; border-radius: 8px; font-family: 'Prompt', sans-serif; font-size: 14px; cursor: pointer; transition: 0.2s; margin-left: auto; }
.btn-logout:hover { background: rgba(255,85,85,0.1); }

.tab-bar { display: flex; gap: 8px; margin-bottom: 24px; }
.tab-btn { position: relative; background: #232321; border: 1px solid #333; color: #aaa; padding: 10px 24px; border-radius: 10px; font-family: 'Prompt', sans-serif; font-size: 15px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
.tab-btn:hover { border-color: #555; color: #fff; }
.tab-btn.active { background: #CDF100; color: #000; border-color: #CDF100; font-weight: 600; }
.tab-badge { background: #ff5555; color: #fff; border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 700; }

.tab-content { animation: fadeIn 0.25s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.info-card { background: #232321; border: 1px solid #333; border-radius: 12px; padding: 18px 22px; transition: border-color 0.2s; }
.info-card:hover { border-color: #555; }
.info-card.full-width { grid-column: 1 / -1; }
.info-label { color: #888; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.8px; }
.info-value { color: #fff; font-size: 16px; margin: 0; }
.info-value.highlight { color: #CDF100; font-weight: 500; }

.edit-form { background: #232321; border: 1px solid #444; border-radius: 16px; padding: 28px; }
.input-group label { display: block; margin-bottom: 8px; color: #ddd; font-size: 14px; }
.custom-input { width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #444; background: #111; color: #fff; font-family: 'Prompt', sans-serif; outline: none; box-sizing: border-box; }
.custom-input:focus { border-color: #CDF100; }

.d-flex { display: flex; }
.gap-2 { gap: 8px; }
.flex-fill { flex: 1; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
.text-center { text-align: center; }

.btn-yellow { background: #CDF100; color: #000; border: none; padding: 11px 28px; border-radius: 8px; font-family: 'Prompt', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; text-decoration: none; display: inline-block; }
.btn-yellow:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(205,241,0,0.25); }
.btn-yellow:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn-grey { background: #2a2a2a; color: #aaa; border: 1px solid #444; padding: 11px 0; border-radius: 8px; font-family: 'Prompt', sans-serif; font-size: 15px; cursor: pointer; transition: 0.2s; }
.btn-grey:hover { border-color: #666; color: #fff; }
.btn-outline-yellow { background: transparent; color: #CDF100; border: 1px solid #CDF100; padding: 10px 28px; border-radius: 8px; font-family: 'Prompt', sans-serif; font-size: 15px; cursor: pointer; transition: 0.2s; }
.btn-outline-yellow:hover { background: rgba(205,241,0,0.08); }

.loading-orders { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; color: #888; }
.empty-orders { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; text-align: center; }
.empty-orders h3 { color: #fff; font-size: 20px; margin: 0; }
.empty-orders p { color: #888; margin: 0 0 8px; }

.orders-list { display: flex; flex-direction: column; gap: 12px; }

.draft-banner { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: rgba(205,241,0,0.07); border: 1px solid rgba(205,241,0,0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; flex-wrap: wrap; }
.draft-banner--special { background: rgba(255,59,59,0.07); border-color: rgba(255,59,59,0.3); }
.draft-info { display: flex; align-items: center; gap: 12px; }
.draft-icon { font-size: 28px; }
.draft-title { color: #CDF100; font-size: 14px; font-weight: 600; margin: 0 0 2px; }
.draft-sub { color: #888; font-size: 12px; margin: 0; }
.draft-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.draft-btn { padding: 8px 18px; font-size: 13px; border-radius: 8px; text-decoration: none; }
.draft-btn-sm { background: transparent; color: #888; border: 1px solid #444; padding: 7px 12px; border-radius: 8px; font-family: 'Prompt', sans-serif; font-size: 12px; cursor: pointer; transition: 0.2s; }
.draft-btn-sm:hover { border-color: #ff5555; color: #ff5555; }
.order-card { background: #232321; border: 1px solid #333; border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
.order-card:hover { border-color: rgba(205,241,0,0.3); }
.order-card-header { display: flex; align-items: center; gap: 16px; padding: 18px 20px; }
.order-thumb-wrap { flex-shrink: 0; }
.order-thumb { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid #444; }
.thumb-placeholder { width: 60px; height: 60px; border-radius: 8px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid #333; }
.order-meta { flex: 1; }
.order-product { color: #fff; font-size: 15px; font-weight: 500; margin: 0 0 4px; }
.order-date { color: #888; font-size: 13px; margin: 0; }
.order-right { text-align: right; }
.order-price { color: #CDF100; font-size: 17px; font-weight: 600; margin: 0 0 6px; }

.status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.status-pending { background: rgba(255,152,0,0.12); color: #ffb74d; border: 1px solid rgba(255,152,0,0.3); }
.status-processing { background: rgba(33,150,243,0.12); color: #64b5f6; border: 1px solid rgba(33,150,243,0.3); }
.status-completed { background: rgba(76,175,80,0.12); color: #81c784; border: 1px solid rgba(76,175,80,0.3); }

.chevron { color: #555; font-size: 18px; transition: transform 0.25s; margin-left: 4px; }
.chevron.open { transform: rotate(180deg); color: #CDF100; }

.order-detail { padding: 0 20px 20px; }
.detail-divider { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 20px; }

.status-timeline { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 10px; }
.timeline-step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.timeline-dot { width: 16px; height: 16px; border-radius: 50%; background: #333; border: 2px solid #555; transition: 0.3s; }
.timeline-dot.done { background: #CDF100; border-color: #CDF100; box-shadow: 0 0 8px rgba(205,241,0,0.4); }
.timeline-label { color: #888; font-size: 12px; white-space: nowrap; margin: 0; }
.timeline-line { flex: 1; height: 2px; background: #333; min-width: 60px; transition: background 0.3s; }
.timeline-line.done { background: #CDF100; }

.tracking-box { background: rgba(205,241,0,0.06); border: 1px solid rgba(205,241,0,0.2); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; }
.tracking-box.pending { background: rgba(255,152,0,0.06); border-color: rgba(255,152,0,0.2); }
.tracking-label { color: #aaa; font-size: 12px; margin: 0 0 4px; }
.tracking-number { color: #CDF100; font-size: 18px; font-weight: 600; font-family: 'Jura', sans-serif; letter-spacing: 1.5px; margin: 0; }

.price-breakdown { background: rgba(0,0,0,0.2); border-radius: 10px; padding: 16px 18px; margin-bottom: 16px; }
.breakdown-title { color: #fff; font-size: 14px; font-weight: 500; margin: 0 0 12px; }
.breakdown-row { display: flex; justify-content: space-between; color: #aaa; font-size: 14px; margin-bottom: 6px; }
.breakdown-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 10px 0; }
.breakdown-row.total { color: #fff; font-weight: 600; font-size: 15px; }
.text-yellow { color: #CDF100; }

.admin-note-box { background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 10px; padding: 14px 18px; }
.admin-note-label { color: #888; font-size: 12px; margin: 0 0 6px; }
.admin-note-text { color: #ccc; font-size: 14px; margin: 0; line-height: 1.6; }

.expand-enter-active, .expand-leave-active { transition: opacity 0.25s ease, max-height 0.3s ease; max-height: 600px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }

/* Vinyl Play Button */
.vinyl-play-btn { position: relative; width: 42px; height: 42px; border-radius: 50%; background: #1a1a1a; border: 2px solid #444; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; overflow: hidden; }
.vinyl-play-btn:hover, .vinyl-play-btn.is-playing { border-color: #CDF100; }
.vpb-disc { width: 32px; height: 32px; border-radius: 50%; background: conic-gradient(#222 0deg, #333 60deg, #222 120deg, #333 180deg, #222 240deg, #333 300deg, #222 360deg); position: absolute; transition: 0.3s; }
.vpb-disc.spinning { animation: spin 1.8s linear infinite; }
.vpb-disc-center { width: 8px; height: 8px; border-radius: 50%; background: #CDF100; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.vpb-icon { position: relative; z-index: 2; font-size: 13px; color: #fff; text-shadow: 0 0 4px #000; }

/* Mini Player */
.mini-player { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #1a1a18, #232321); border-top: 1px solid rgba(205,241,0,0.2); padding: 12px 20px; }
.mini-vinyl { width: 40px; height: 40px; border-radius: 50%; background: conic-gradient(#111 0deg, #2a2a2a 45deg, #111 90deg, #2a2a2a 135deg, #111 180deg, #2a2a2a 225deg, #111 270deg, #2a2a2a 315deg, #111 360deg); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.mini-vinyl.spinning { animation: spin 2s linear infinite; }
.mini-vinyl-inner { width: 10px; height: 10px; border-radius: 50%; background: #CDF100; }
.mini-player-info { flex: 1; min-width: 0; }
.mini-player-title { color: #ccc; font-size: 12px; margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-progress-bar { height: 3px; background: #333; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.mini-progress-fill { height: 100%; background: #CDF100; border-radius: 2px; transition: width 0.3s linear; }
.mini-time { display: flex; justify-content: space-between; color: #555; font-size: 11px; }
.mini-controls { display: flex; gap: 6px; flex-shrink: 0; }
.mini-btn { background: #2a2a2a; border: 1px solid #444; color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.mini-btn:hover { border-color: #CDF100; color: #CDF100; }

/* Transitions */
.player-slide-enter-active, .player-slide-leave-active { transition: max-height 0.3s ease, opacity 0.25s ease; max-height: 80px; overflow: hidden; }
.player-slide-enter-from, .player-slide-leave-to { max-height: 0; opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .info-grid { grid-template-columns: 1fr; }
  .info-card.full-width { grid-column: auto; }
  .profile-header { padding: 20px; }
  .btn-logout { margin-left: 0; width: 100%; }
}
</style>