<template>
  <div class="admin-wrapper">
    <div class="container-main">
      
      <div class="header-section text-center mb-5">
        <h1 class="title-text">ADMIN <span class="highlight-yellow">DASHBOARD</span></h1>
        <p class="subtitle">ข้อมูลผู้เล่นที่สมัครเข้ามาในระบบทั้งหมด</p>
      </div>

      <div class="table-container">
        
        <div v-if="isLoading" class="text-center py-5 text-white">
          กำลังโหลดข้อมูลผู้เล่น...
        </div>

        <table v-else class="custom-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>อีเมล (Email)</th>
              <th>สิทธิ์ (Role)</th>
              <th>วันที่สมัคร (Joined Date)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.uid">
              <td>{{ index + 1 }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="{'badge-player': user.role === 'player', 'badge-admin': user.role === 'admin'}">
                  {{ user.role }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
            </tr>
            
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center py-4 text-white">ยังไม่มีข้อมูลผู้เล่นในระบบ</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '~/utils/firebase'

const users = ref([])
const isLoading = ref(true)

// ฟังก์ชันดึงข้อมูลผู้ใช้จาก Firestore
const fetchUsers = async () => {
  isLoading.value = true
  try {
    // ดึงข้อมูลจากคอลเลกชัน 'users' โดยเรียงลำดับจากคนที่เพิ่งสมัครล่าสุด (desc)
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const loadedUsers = []
    querySnapshot.forEach((doc) => {
      loadedUsers.push(doc.data()) // เอาข้อมูลยัดใส่ Array
    })
    
    users.value = loadedUsers // เอา Array ไปผูกกับตัวแปรเพื่อโชว์บนจอ
  } catch (error) {
    console.error("Error fetching users:", error)
    alert("ไม่สามารถดึงข้อมูลได้: " + error.message)
  } finally {
    isLoading.value = false
  }
}

// แปลงเวลาจาก Firebase Timestamp เป็นรูปแบบวันที่ปกติของไทย
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate() // แปลงเป็น Date object ของ Javascript
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// สั่งให้ดึงข้อมูลทันทีที่เปิดหน้านี้
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

.admin-wrapper {
  background-color: #1a1a1a;
  min-height: calc(100vh - 80px); /* ลบความสูง Navbar ออกนิดนึง */
  padding: 50px 20px;
  font-family: 'Prompt', sans-serif;
  color: #fff;
}

.container-main {
  max-width: 1000px;
  margin: 0 auto;
}

.title-text {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  font-family: 'Jura', sans-serif;
}

.highlight-yellow { color: #FFF700; }
.subtitle { color: #aaa; margin-top: 10px; }

/* ดีไซน์กล่องตาราง */
.table-container {
  background-color: #232321;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #333;
  overflow-x: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.custom-table th, .custom-table td {
  padding: 18px 15px;
  border-bottom: 1px solid #444;
}

.custom-table th {
  color: #FFF700;
  font-weight: 500;
  background-color: rgba(255, 247, 0, 0.05); /* ไฮไลท์สีเหลืองอ่อนๆ ที่หัวตาราง */
}

.custom-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.03); /* เอฟเฟกต์ตอนเอาเมาส์ชี้แถว */
}

/* ตกแต่งป้ายสถานะ (Badge) */
.badge-player {
  background-color: #444;
  color: #CDF100;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.badge-admin {
  background-color: #FFF700;
  color: #000;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

/* Utility Classes */
.text-center { text-align: center; }
.py-5 { padding-top: 3rem; padding-bottom: 3rem; }
.py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }
</style>