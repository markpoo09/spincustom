<template>
  <div class="admin-wrapper">
    <div class="container-main">

      <div class="header-section text-center mb-4">
        <h1 class="title-text">ADMIN <span class="highlight-yellow">DASHBOARD</span></h1>
        <p class="subtitle">ระบบจัดการหลังบ้าน SPINCUSTOM</p>
      </div>

      <div class="admin-tabs mb-4 d-flex justify-content-center gap-3 flex-wrap">
        <button class="tab-btn" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">📊 Overview</button>
        <button class="tab-btn" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">👥 ข้อมูลผู้เล่น</button>
        <button class="tab-btn" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">📦 รายการออเดอร์</button>
        <button class="tab-btn" :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">📀 จัดการสินค้า</button>
        <button class="tab-btn" :class="{ active: activeTab === 'stickers' }" @click="activeTab = 'stickers'">🎨 สติ๊กเกอร์</button>
      </div>

      <!-- ==================== TAB: OVERVIEW ==================== -->
      <div v-if="activeTab === 'overview'">
        <div class="kpi-grid mb-4">
          <div class="kpi-card">
            <div class="kpi-icon">📦</div>
            <div class="kpi-value text-yellow">{{ orders.length }}</div>
            <div class="kpi-label">ออเดอร์ทั้งหมด</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">⏳</div>
            <div class="kpi-value" style="color:#ff9800">{{ orders.filter(o => o.status === 'pending').length }}</div>
            <div class="kpi-label">รอดำเนินการ</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🔧</div>
            <div class="kpi-value" style="color:#2196f3">{{ orders.filter(o => o.status === 'processing').length }}</div>
            <div class="kpi-label">กำลังผลิต</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">✅</div>
            <div class="kpi-value" style="color:#4caf50">{{ orders.filter(o => o.status === 'completed').length }}</div>
            <div class="kpi-label">จัดส่งแล้ว</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">💰</div>
            <div class="kpi-value text-yellow">฿{{ totalRevenue.toLocaleString() }}</div>
            <div class="kpi-label">ยอดรวมทั้งหมด</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">👥</div>
            <div class="kpi-value text-yellow">{{ users.length }}</div>
            <div class="kpi-label">ผู้ใช้งานในระบบ</div>
          </div>
        </div>

        <div class="table-container">
          <h3 class="section-title mb-3">📋 ออเดอร์ล่าสุด 5 รายการ</h3>
          <table class="custom-table">
            <thead>
              <tr>
                <th>ลูกค้า</th>
                <th>รุ่น</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.userEmail }}</td>
                <td>{{ order.productName }}</td>
                <td class="text-yellow">฿{{ (order.totalPrice || 0).toLocaleString() }}</td>
                <td><span :class="'status-badge status-' + order.status">{{ statusLabel(order.status) }}</span></td>
                <td>{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: USERS ==================== -->
      <div v-if="activeTab === 'users'">
        <div class="table-container">
          <div v-if="isLoadingUsers" class="text-center py-5 text-white">กำลังโหลดข้อมูลผู้เล่น...</div>
          <table v-else class="custom-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อ-นามสกุล</th>
                <th>อีเมล (Email)</th>
                <th>เบอร์โทร</th>
                <th>สิทธิ์ (Role)</th>
                <th>วันที่สมัคร</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user.id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name || '-' }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone || '-' }}</td>
                <td>
                  <span :class="{'badge-player': user.role === 'player', 'badge-admin': user.role === 'admin'}">{{ user.role }}</span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button @click="openEditUser(user)" class="btn-icon edit" title="แก้ไข">✏️</button>
                    <button @click="deleteUser(user.id)" class="btn-icon delete" title="ลบ">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="7" class="text-center py-4 text-white">ยังไม่มีข้อมูลผู้เล่นในระบบ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: ORDERS ==================== -->
      <div v-if="activeTab === 'orders'">

        <!-- Search + Filter + Export -->
        <div class="toolbar mb-3 d-flex gap-3 flex-wrap align-items-center">
          <input v-model="orderSearch" class="search-input" placeholder="🔍 ค้นหา อีเมล / รุ่น / tracking...">
          <select v-model="orderStatusFilter" class="status-select">
            <option value="">ทุกสถานะ</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="processing">กำลังผลิต</option>
            <option value="completed">จัดส่งแล้ว</option>
          </select>
          <button @click="exportOrdersCSV" class="btn-export">📥 Export CSV</button>
        </div>

        <div class="table-container">
          <div v-if="isLoadingOrders" class="text-center py-5 text-white">กำลังโหลดข้อมูลออเดอร์...</div>
          <table v-else class="custom-table">
            <thead>
              <tr>
                <th>รูปผลงาน</th>
                <th>ลูกค้า</th>
                <th>รุ่น</th>
                <th>ราคารวม</th>
                <th>Tracking</th>
                <th>สถานะ</th>
                <th>วันที่สั่ง</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td><img v-if="order.upload" :src="order.upload" class="order-thumb" alt="รูปภาพ"></td>
                <td>{{ order.userEmail }}</td>
                <td>{{ order.productName }}</td>
                <td class="text-yellow">฿{{ (order.totalPrice || 0).toLocaleString() }}</td>
                <td>
                  <span v-if="order.trackingNumber" class="tracking-badge">{{ order.trackingNumber }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)" class="status-select" :class="'status-' + order.status">
                    <option value="pending">รอดำเนินการ</option>
                    <option value="processing">กำลังผลิต</option>
                    <option value="completed">จัดส่งแล้ว</option>
                  </select>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button @click="viewOrderDetails(order)" class="btn-view">รายละเอียด</button>
                    <button @click="deleteOrder(order.id)" class="btn-icon delete" title="ลบ">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="8" class="text-center py-4 text-white">ไม่พบรายการที่ค้นหา</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: PRODUCTS ==================== -->
      <div v-if="activeTab === 'products'">
        <div class="table-container">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="section-title">รุ่นเครื่องเล่นทั้งหมด</h3>
            <button @click="openAddProduct" class="btn-add">+ เพิ่มรุ่นใหม่</button>
          </div>
          <div v-if="isLoadingProducts" class="text-center py-5 text-white">กำลังโหลดข้อมูลสินค้า...</div>
          <table v-else class="custom-table">
            <thead>
              <tr>
                <th>รูป</th>
                <th>ชื่อรุ่น</th>
                <th>คำอธิบาย</th>
                <th>ราคาฐาน</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <img v-if="product.image" :src="product.image" class="order-thumb" alt="Product">
                  <div v-else class="no-img">ไม่มีรูป</div>
                </td>
                <td class="text-white">{{ product.name }}</td>
                <td style="color:#aaa; font-size:13px; max-width:200px;">{{ product.desc || '-' }}</td>
                <td class="text-yellow">฿{{ (product.base_price || 0).toLocaleString() }}</td>
                <td>
                  <button @click="toggleProductActive(product)" :class="product.isActive ? 'badge-active' : 'badge-inactive'">
                    {{ product.isActive ? '🟢 เปิดขาย' : '🔴 ปิดขาย' }}
                  </button>
                </td>
                <td>
                  <div class="action-buttons">
                    <button @click="openEditProduct(product)" class="btn-icon edit" title="แก้ไข">✏️</button>
                    <button @click="deleteProduct(product.id)" class="btn-icon delete" title="ลบ">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="text-center py-4 text-white">ยังไม่มีสินค้าในระบบ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: STICKERS ==================== -->
      <div v-if="activeTab === 'stickers'">
        <div class="table-container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="section-title">สติ๊กเกอร์ทั้งหมด</h3>
            <button @click="openAddSticker" class="btn-add">+ เพิ่มสติ๊กเกอร์</button>
          </div>
          <div v-if="isLoadingStickers" class="text-center py-5 text-white">กำลังโหลดสติ๊กเกอร์...</div>
          <div v-else class="sticker-grid">
            <div v-for="sticker in stickers" :key="sticker.docId" class="sticker-card">
              <img :src="sticker.image" class="sticker-preview" :alt="'sticker-' + sticker.id">
              <div class="sticker-meta">
                <span class="sticker-type">Type: {{ sticker.type }}</span>
                <span class="text-yellow">฿{{ (sticker.price || 0).toLocaleString() }}</span>
              </div>
              <div class="sticker-actions">
                <button @click="openEditSticker(sticker)" class="btn-icon edit" title="แก้ไข">✏️</button>
                <button @click="deleteSticker(sticker.docId)" class="btn-icon delete" title="ลบ">🗑️</button>
              </div>
            </div>
            <div v-if="stickers.length === 0" class="text-center py-5 text-white w-100">ยังไม่มีสติ๊กเกอร์ในระบบ</div>
          </div>
        </div>
      </div>

    </div>

    <!-- ==================== MODAL: ORDER DETAIL ==================== -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content modal-large">
        <button class="close-btn" @click="selectedOrder = null">✖</button>
        <h3 class="modal-title mb-4">รายละเอียดออเดอร์</h3>

        <div class="modal-grid">
          <div class="modal-img-box">
            <img :src="selectedOrder.upload" class="modal-img" alt="Full Design">
          </div>
          <div class="modal-info text-white">
            <p><strong>ผู้สั่งซื้อ:</strong> {{ selectedOrder.userEmail }}</p>
            <p><strong>รุ่น:</strong> {{ selectedOrder.productName }}</p>
            <p><strong>ข้อความที่สลัก:</strong> <span class="text-yellow">{{ selectedOrder.customText || 'ไม่มี' }}</span></p>

            <div class="color-details mt-3 mb-3">
              <p class="mb-2"><strong>สีที่เลือก:</strong></p>
              <ul>
                <li>ตัวเครื่อง: {{ selectedOrder.colors?.body || '-' }}</li>
                <li>ข้างเครื่อง: {{ selectedOrder.colors?.side || '-' }}</li>
                <li>ปุ่ม: {{ selectedOrder.colors?.button || '-' }}</li>
                <li>ก้านเข็ม: {{ selectedOrder.colors?.tonearm || '-' }}</li>
              </ul>
            </div>

            <!-- Tracking Number -->
            <div class="input-group mb-3">
              <label>🚚 Tracking Number</label>
              <div class="d-flex gap-2">
                <input type="text" v-model="selectedOrder.trackingNumber" class="custom-input" placeholder="กรอกเลข Tracking...">
                <button @click="saveTracking(selectedOrder)" class="btn-save-sm">บันทึก</button>
              </div>
            </div>

            <!-- Admin Note -->
            <div class="input-group mb-3">
              <label>📝 Admin Note</label>
              <textarea v-model="selectedOrder.adminNote" class="custom-input" rows="3" placeholder="บันทึกข้อความภายใน..."></textarea>
              <button @click="saveAdminNote(selectedOrder)" class="btn-save-sm mt-2">บันทึก Note</button>
            </div>

            <p class="total-price mt-3"><strong>ยอดรวม:</strong> <span class="text-yellow">฿{{ (selectedOrder.totalPrice || 0).toLocaleString() }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL: EDIT USER ==================== -->
    <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
      <div class="modal-content modal-small">
        <button class="close-btn" @click="editingUser = null">✖</button>
        <h3 class="modal-title mb-4">แก้ไขข้อมูลผู้เล่น</h3>
        <div class="input-group mb-3">
          <label>ชื่อ-นามสกุล</label>
          <input type="text" v-model="editingUser.name" class="custom-input">
        </div>
        <div class="input-group mb-3">
          <label>เบอร์โทรศัพท์</label>
          <input type="text" v-model="editingUser.phone" class="custom-input">
        </div>
        <div class="input-group mb-4">
          <label>สิทธิ์การใช้งาน (Role)</label>
          <select v-model="editingUser.role" class="custom-input">
            <option value="player">Player (ผู้เล่นทั่วไป)</option>
            <option value="admin">Admin (ผู้ดูแลระบบ)</option>
          </select>
        </div>
        <button @click="saveEditUser" class="btn-yellow-full w-100">💾 บันทึกการแก้ไข</button>
      </div>
    </div>

    <!-- ==================== MODAL: ADD/EDIT STICKER ==================== -->
    <div v-if="editingSticker" class="modal-overlay" @click.self="editingSticker = null">
      <div class="modal-content modal-small">
        <button class="close-btn" @click="editingSticker = null">✖</button>
        <h3 class="modal-title mb-4">{{ editingSticker.docId ? 'แก้ไขสติ๊กเกอร์' : 'เพิ่มสติ๊กเกอร์ใหม่' }}</h3>
        <div class="input-group mb-3">
          <label>ไฟล์รูป (image) เช่น /stickers_1-2.png</label>
          <input type="text" v-model="editingSticker.image" class="custom-input" placeholder="/stickers_1-2.png">
        </div>
        <div class="input-group mb-3">
          <label>ราคา (price) ฿</label>
          <input type="number" v-model="editingSticker.price" class="custom-input" placeholder="0">
        </div>
        <div class="input-group mb-4">
          <label>ประเภท (type) — ตัวเลข</label>
          <input type="number" v-model="editingSticker.type" class="custom-input" placeholder="1">
        </div>
        <button @click="saveSticker" class="btn-yellow-full w-100">💾 บันทึก</button>
      </div>
    </div>

    <!-- ==================== MODAL: ADD/EDIT PRODUCT ==================== -->
    <div v-if="editingProduct" class="modal-overlay" @click.self="editingProduct = null">
      <div class="modal-content modal-small">
        <button class="close-btn" @click="editingProduct = null">✖</button>
        <h3 class="modal-title mb-4">{{ editingProduct.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}</h3>
        <div class="input-group mb-3">
          <label>ชื่อรุ่น</label>
          <input type="text" v-model="editingProduct.name" class="custom-input" placeholder="เช่น SpinCustom Pro">
        </div>
        <div class="input-group mb-3">
          <label>ราคาฐาน (base_price) ฿</label>
          <input type="number" v-model="editingProduct.base_price" class="custom-input" placeholder="0">
        </div>
        <div class="input-group mb-3">
          <label>ไฟล์รูป (image) เช่น /vinyl_4.png</label>
          <input type="text" v-model="editingProduct.image" class="custom-input" placeholder="/vinyl_4.png">
        </div>
        <div class="input-group mb-3">
          <label>คำอธิบาย (desc)</label>
          <input type="text" v-model="editingProduct.desc" class="custom-input" placeholder="เช่น เหมาะสำหรับผู้ใช้งานเริ่มต้น">
        </div>
        <div class="input-group mb-3">
          <label>table</label>
          <input type="text" v-model="editingProduct.table" class="custom-input" placeholder="ข้อความ table...">
        </div>
        <div class="input-group mb-4 d-flex align-items-center gap-3">
          <label style="margin-bottom:0">เปิดขาย</label>
          <input type="checkbox" v-model="editingProduct.isActive" style="width:20px;height:20px;cursor:pointer">
        </div>
        <button @click="saveProduct" class="btn-yellow-full w-100">💾 บันทึก</button>
      </div>
    </div>

    <!-- ==================== MODAL: ADD/EDIT STICKER ==================== -->
    <div v-if="editingSticker" class="modal-overlay" @click.self="editingSticker = null">
      <div class="modal-content modal-small">
        <button class="close-btn" @click="editingSticker = null">✖</button>
        <h3 class="modal-title mb-4">{{ editingSticker.docId ? 'แก้ไขสติ๊กเกอร์' : 'เพิ่มสติ๊กเกอร์ใหม่' }}</h3>

        <div class="input-group mb-3">
          <label>ไฟล์รูป (image) เช่น /stickers_1-2.png</label>
          <input type="text" v-model="editingSticker.image" class="custom-input" placeholder="/stickers_1-2.png">
        </div>

        <div v-if="editingSticker.image" class="sticker-preview-box mb-3">
          <img :src="editingSticker.image" class="sticker-preview-lg" alt="Preview">
        </div>

        <div class="input-group mb-3">
          <label>ราคา (price) ฿</label>
          <input type="number" v-model="editingSticker.price" class="custom-input" placeholder="0">
        </div>

        <div class="input-group mb-4">
          <label>ประเภท (type)</label>
          <input type="number" v-model="editingSticker.type" class="custom-input" placeholder="1" min="1">
        </div>

        <button @click="saveSticker" class="btn-yellow-full w-100">💾 บันทึก</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, setDoc } from 'firebase/firestore'
import { db } from '~/utils/firebase'

const activeTab = ref('overview')

// ===== USERS =====
const users = ref([])
const isLoadingUsers = ref(true)
const editingUser = ref(null)

// ===== ORDERS =====
const orders = ref([])
const isLoadingOrders = ref(true)
const selectedOrder = ref(null)
const orderSearch = ref('')
const orderStatusFilter = ref('')

// ===== PRODUCTS =====
const products = ref([])
const isLoadingProducts = ref(true)
const editingProduct = ref(null)

// ===== STICKERS =====
const stickers = ref([])
const isLoadingStickers = ref(true)

// ===== COMPUTED =====
const totalRevenue = computed(() => orders.value.reduce((sum, o) => sum + (o.totalPrice || 0), 0))
const recentOrders = computed(() => [...orders.value].slice(0, 5))
const filteredOrders = computed(() => {
  let result = orders.value
  if (orderStatusFilter.value) result = result.filter(o => o.status === orderStatusFilter.value)
  if (orderSearch.value.trim()) {
    const q = orderSearch.value.toLowerCase()
    result = result.filter(o =>
      (o.userEmail || '').toLowerCase().includes(q) ||
      (o.productName || '').toLowerCase().includes(q) ||
      (o.trackingNumber || '').toLowerCase().includes(q)
    )
  }
  return result
})

// ===== HELPERS =====
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate()
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
const statusLabel = (status) => ({ pending: 'รอดำเนินการ', processing: 'กำลังผลิต', completed: 'จัดส่งแล้ว' }[status] || status)

const swal = (opts) => window.Swal.fire({ background: '#232321', color: '#ffffff', confirmButtonColor: '#CDF100', confirmButtonText: '<span style="color:#000;font-weight:bold;">ตกลง</span>', ...opts })

// ===== FETCH =====
const fetchUsers = async () => {
  isLoadingUsers.value = true
  try {
    const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
    users.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) { console.error(e) } finally { isLoadingUsers.value = false }
}

const fetchOrders = async () => {
  isLoadingOrders.value = true
  try {
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
    orders.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) { console.error(e) } finally { isLoadingOrders.value = false }
}

const fetchProducts = async () => {
  isLoadingProducts.value = true
  try {
    const snap = await getDocs(collection(db, 'products'))
    products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) { console.error(e) } finally { isLoadingProducts.value = false }
}

const fetchStickers = async () => {
  isLoadingStickers.value = true
  try {
    const snap = await getDocs(collection(db, 'stickers'))
    stickers.value = snap.docs.map(d => ({ docId: d.id, ...d.data() }))
  } catch (e) { console.error(e) } finally { isLoadingStickers.value = false }
}

// ===== USERS ACTIONS =====
const openEditUser = (user) => { editingUser.value = { ...user } }

const saveEditUser = async () => {
  try {
    await updateDoc(doc(db, 'users', editingUser.value.id), {
      name: editingUser.value.name, phone: editingUser.value.phone, role: editingUser.value.role
    })
    const i = users.value.findIndex(u => u.id === editingUser.value.id)
    if (i !== -1) users.value[i] = { ...editingUser.value }
    editingUser.value = null
    swal({ title: 'อัปเดตสำเร็จ!', icon: 'success' })
  } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
}

const deleteUser = async (userId) => {
  const result = await window.Swal.fire({ title: 'ยืนยันการลบผู้ใช้?', text: 'ข้อมูลจะหายถาวร!', icon: 'warning', showCancelButton: true, background: '#232321', color: '#fff', confirmButtonColor: '#ff3b3b', cancelButtonColor: '#444', confirmButtonText: 'ใช่, ลบเลย!', cancelButtonText: 'ยกเลิก', draggable: true })
  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'users', userId))
      users.value = users.value.filter(u => u.id !== userId)
      swal({ title: 'ลบผู้ใช้สำเร็จ!', icon: 'success' })
    } catch (e) { swal({ title: 'ลบไม่สำเร็จ', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
  }
}

// ===== ORDERS ACTIONS =====
const viewOrderDetails = (order) => { selectedOrder.value = { ...order } }

const updateOrderStatus = async (orderId, status) => {
  try { await updateDoc(doc(db, 'orders', orderId), { status }) }
  catch (e) { console.error(e) }
}

const saveTracking = async (order) => {
  try {
    await updateDoc(doc(db, 'orders', order.id), { trackingNumber: order.trackingNumber || '' })
    const i = orders.value.findIndex(o => o.id === order.id)
    if (i !== -1) orders.value[i].trackingNumber = order.trackingNumber
    swal({ title: 'บันทึก Tracking สำเร็จ!', icon: 'success' })
  } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
}

const saveAdminNote = async (order) => {
  try {
    await updateDoc(doc(db, 'orders', order.id), { adminNote: order.adminNote || '' })
    swal({ title: 'บันทึก Note สำเร็จ!', icon: 'success' })
  } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
}

const deleteOrder = async (orderId) => {
  const result = await window.Swal.fire({ title: 'ยืนยันการลบ?', text: 'ออเดอร์จะหายถาวร!', icon: 'warning', showCancelButton: true, background: '#232321', color: '#fff', confirmButtonColor: '#ff3b3b', cancelButtonColor: '#444', confirmButtonText: 'ใช่, ลบเลย!', cancelButtonText: 'ยกเลิก', draggable: true })
  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'orders', orderId))
      orders.value = orders.value.filter(o => o.id !== orderId)
      if (selectedOrder.value?.id === orderId) selectedOrder.value = null
      swal({ title: 'ลบเรียบร้อย!', icon: 'success' })
    } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
  }
}

const exportOrdersCSV = () => {
  const headers = ['Email', 'รุ่น', 'ราคา', 'Tracking', 'Admin Note', 'สถานะ', 'วันที่']
  const rows = filteredOrders.value.map(o => [
    o.userEmail || '', o.productName || '', o.totalPrice || 0,
    o.trackingNumber || '', (o.adminNote || '').replace(/\n/g, ' '),
    statusLabel(o.status), formatDate(o.createdAt)
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `orders_${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

// ===== PRODUCTS ACTIONS =====
const openAddProduct = () => { editingProduct.value = { name: '', base_price: 0, image: '', desc: '', table: '', isActive: true } }
const openEditProduct = (product) => { editingProduct.value = { ...product } }

const saveProduct = async () => {
  try {
    const data = { name: editingProduct.value.name, base_price: Number(editingProduct.value.base_price), image: editingProduct.value.image, desc: editingProduct.value.desc, table: editingProduct.value.table, isActive: editingProduct.value.isActive }
    if (editingProduct.value.id) {
      await updateDoc(doc(db, 'products', editingProduct.value.id), data)
      const i = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (i !== -1) products.value[i] = { ...editingProduct.value, ...data }
    } else {
      const docRef = await addDoc(collection(db, 'products'), data)
      products.value.push({ id: docRef.id, ...data })
    }
    editingProduct.value = null
    swal({ title: 'บันทึกสำเร็จ!', icon: 'success' })
  } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
}

const toggleProductActive = async (product) => {
  try {
    await updateDoc(doc(db, 'products', product.id), { isActive: !product.isActive })
    product.isActive = !product.isActive
  } catch (e) { console.error(e) }
}

const deleteProduct = async (productId) => {
  const result = await window.Swal.fire({ title: 'ลบสินค้านี้?', icon: 'warning', showCancelButton: true, background: '#232321', color: '#fff', confirmButtonColor: '#ff3b3b', cancelButtonColor: '#444', confirmButtonText: 'ลบเลย!', cancelButtonText: 'ยกเลิก' })
  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'products', productId))
      products.value = products.value.filter(p => p.id !== productId)
      swal({ title: 'ลบสำเร็จ!', icon: 'success' })
    } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
  }
}

// ===== STICKERS ACTIONS =====
const editingSticker = ref(null)

const openAddSticker = () => { editingSticker.value = { image: '', price: 0, type: 1 } }
const openEditSticker = (sticker) => { editingSticker.value = { ...sticker } }

const saveSticker = async () => {
  try {
    const data = { image: editingSticker.value.image, price: Number(editingSticker.value.price), type: Number(editingSticker.value.type) }
    if (editingSticker.value.docId) {
      await updateDoc(doc(db, 'stickers', editingSticker.value.docId), data)
      const i = stickers.value.findIndex(s => s.docId === editingSticker.value.docId)
      if (i !== -1) stickers.value[i] = { ...editingSticker.value, ...data }
    } else {
      const docRef = await addDoc(collection(db, 'stickers'), data)
      stickers.value.push({ docId: docRef.id, ...data })
    }
    editingSticker.value = null
    swal({ title: 'บันทึกสำเร็จ!', icon: 'success' })
  } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
}

const deleteSticker = async (docId) => {
  const result = await window.Swal.fire({ title: 'ลบสติ๊กเกอร์นี้?', icon: 'warning', showCancelButton: true, background: '#232321', color: '#fff', confirmButtonColor: '#ff3b3b', cancelButtonColor: '#444', confirmButtonText: 'ลบเลย!', cancelButtonText: 'ยกเลิก' })
  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, 'stickers', docId))
      stickers.value = stickers.value.filter(s => s.docId !== docId)
      swal({ title: 'ลบสำเร็จ!', icon: 'success' })
    } catch (e) { swal({ title: 'เกิดข้อผิดพลาด', text: e.message, icon: 'error', confirmButtonColor: '#ff3b3b' }) }
  }
}

onMounted(() => {
  fetchUsers()
  fetchOrders()
  fetchProducts()
  fetchStickers()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

.admin-wrapper { background-color: #1a1a1a; min-height: calc(100vh - 80px); padding: 50px 20px; font-family: 'Prompt', sans-serif; color: #fff; }
.container-main { max-width: 1200px; margin: 0 auto; }
.title-text { font-size: 36px; font-weight: 600; font-family: 'Jura', sans-serif; margin-bottom: 5px; }
.highlight-yellow { color: #FFF700; }
.subtitle { color: #aaa; margin-top: 0; }
.text-yellow { color: #CDF100; font-weight: 500; }
.text-muted { color: #666; }
.section-title { color: #CDF100; margin: 0; font-size: 18px; }

/* Tabs */
.admin-tabs { border-bottom: 1px solid #333; padding-bottom: 20px; }
.tab-btn { background: transparent; color: #aaa; border: 1px solid #444; padding: 10px 20px; border-radius: 8px; font-family: 'Prompt'; font-size: 15px; cursor: pointer; transition: 0.2s; white-space: nowrap; }
.tab-btn:hover { background: #222; }
.tab-btn.active { background: #CDF100; color: #000; border-color: #CDF100; font-weight: 600; }

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
.kpi-card { background: #232321; border: 1px solid #333; border-radius: 12px; padding: 20px; text-align: center; }
.kpi-icon { font-size: 28px; margin-bottom: 8px; }
.kpi-value { font-size: 28px; font-weight: 700; font-family: 'Jura', sans-serif; }
.kpi-label { color: #888; font-size: 13px; margin-top: 4px; }

/* Table */
.table-container { background-color: #232321; border-radius: 12px; padding: 20px; border: 1px solid #333; overflow-x: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.custom-table th, .custom-table td { padding: 14px 15px; border-bottom: 1px solid #333; vertical-align: middle; }
.custom-table th { color: #FFF700; font-weight: 500; background-color: rgba(255,247,0,0.05); white-space: nowrap; }
.custom-table tbody tr:hover { background-color: rgba(255,255,255,0.03); }

/* Toolbar */
.toolbar { }
.search-input { flex: 1; min-width: 200px; padding: 10px 15px; border-radius: 8px; border: 1px solid #444; background: #232321; color: #fff; font-family: 'Prompt'; outline: none; font-size: 14px; }
.search-input:focus { border-color: #CDF100; }
.btn-export { background: #232321; color: #CDF100; border: 1px solid #CDF100; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: 'Prompt'; font-size: 14px; transition: 0.2s; white-space: nowrap; }
.btn-export:hover { background: #CDF100; color: #000; }
.btn-add { background: #CDF100; color: #000; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: 'Prompt'; font-size: 14px; font-weight: 600; transition: 0.2s; white-space: nowrap; }
.btn-add:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(205,241,0,0.3); }

/* Badges */
.badge-player { background-color: #444; color: #CDF100; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
.badge-admin { background-color: #FFF700; color: #000; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-active { background: rgba(76,175,80,0.15); color: #4caf50; border: 1px solid #4caf50; padding: 4px 10px; border-radius: 20px; font-size: 12px; cursor: pointer; }
.badge-inactive { background: rgba(255,85,85,0.15); color: #ff5555; border: 1px solid #ff5555; padding: 4px 10px; border-radius: 20px; font-size: 12px; cursor: pointer; }
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; }
.status-badge.status-pending { background: rgba(255,152,0,0.15); color: #ff9800; }
.status-badge.status-processing { background: rgba(33,150,243,0.15); color: #2196f3; }
.status-badge.status-completed { background: rgba(76,175,80,0.15); color: #4caf50; }
.tracking-badge { background: rgba(205,241,0,0.1); color: #CDF100; border: 1px solid rgba(205,241,0,0.3); padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace; }

/* Table elements */
.order-thumb { width: 70px; height: auto; border-radius: 6px; border: 1px solid #444; background: #fff; }
.no-img { width: 70px; height: 50px; background: #333; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 11px; }
.action-buttons { display: flex; gap: 8px; align-items: center; }
.btn-view { background: #333; color: #fff; border: 1px solid #555; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: 'Prompt'; font-size: 13px; transition: 0.2s; }
.btn-view:hover { background: #CDF100; color: #000; border-color: #CDF100; }
.btn-icon { background: transparent; border: 1px solid #555; border-radius: 6px; padding: 5px 8px; cursor: pointer; font-size: 14px; transition: 0.2s; }
.btn-icon.edit:hover { background: #2196f3; border-color: #2196f3; }
.btn-icon.delete:hover { background: #ff5555; border-color: #ff5555; }

/* Status select */
.status-select { background: #111; color: #fff; border: 1px solid #555; padding: 6px 10px; border-radius: 6px; font-family: 'Prompt'; cursor: pointer; outline: none; }
.status-pending { color: #ff9800; border-color: #ff9800; }
.status-processing { color: #2196f3; border-color: #2196f3; }
.status-completed { color: #4caf50; border-color: #4caf50; }

/* Stickers */
.sticker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
.sticker-card { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 12px; text-align: center; transition: 0.2s; }
.sticker-card.inactive { opacity: 0.45; }
.sticker-card:hover { border-color: #555; }
.sticker-preview { width: 90px; height: 90px; object-fit: contain; margin: 0 auto 8px; display: block; background: #fff; border-radius: 6px; padding: 4px; }
.sticker-name { font-size: 12px; color: #aaa; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sticker-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.sticker-type { font-size: 11px; color: #888; background: #333; padding: 2px 6px; border-radius: 4px; }
.sticker-actions { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.toggle-btn { font-size: 11px; padding: 3px 8px; border-radius: 14px; cursor: pointer; transition: 0.2s; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.modal-content { background: #232321; width: 100%; max-width: 700px; border-radius: 16px; padding: 30px; position: relative; border: 1px solid #444; box-shadow: 0 10px 40px rgba(0,0,0,0.6); max-height: 90vh; overflow-y: auto; }
.modal-large { max-width: 800px; }
.modal-small { max-width: 420px; }
.close-btn { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; }
.close-btn:hover { color: #ff5555; }
.modal-title { color: #CDF100; border-bottom: 1px solid #333; padding-bottom: 15px; margin-top: 0; }
.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.modal-img-box { background: #fff; border-radius: 8px; padding: 10px; display: flex; align-items: center; justify-content: center; max-height: 320px; }
.modal-img { width: 100%; height: auto; border-radius: 4px; object-fit: contain; }
.modal-info ul { padding-left: 20px; margin: 0; color: #ccc; }
.total-price { font-size: 18px; }
.color-details { }

/* Inputs */
.input-group label { display: block; margin-bottom: 8px; color: #ddd; font-size: 14px; }
.custom-input { width: 100%; padding: 10px 15px; border-radius: 8px; border: 1px solid #444; background-color: #111; color: #fff; outline: none; font-family: 'Prompt'; box-sizing: border-box; resize: vertical; }
.custom-input:focus { border-color: #CDF100; }
.btn-yellow-full { background-color: #CDF100; color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.2s; font-family: 'Prompt'; }
.btn-yellow-full:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(205,241,0,0.3); }
.btn-save-sm { background: #CDF100; color: #000; border: none; padding: 10px 16px; border-radius: 8px; font-family: 'Prompt'; font-weight: 600; cursor: pointer; white-space: nowrap; transition: 0.2s; font-size: 13px; }
.btn-save-sm:hover { opacity: 0.85; }

/* Utils */
.d-flex { display: flex; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
.flex-wrap { flex-wrap: wrap; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 15px; }
.text-center { text-align: center; }
.w-100 { width: 100%; }
.py-5 { padding-top: 3rem; padding-bottom: 3rem; }
.py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }

@media (max-width: 640px) {
  .modal-grid { grid-template-columns: 1fr; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>