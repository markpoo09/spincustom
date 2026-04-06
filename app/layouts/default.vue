<template>
  <div class="layout-wrapper">
    <header class="navbar-container" :class="{ 'is-scrolled': isScrolled }">
        <div class="navbar">
            <div class="logo">
                <NuxtLink to="/">
                    <img src="/logo_spincustom.png" alt="SPINCUSTOM Logo" class="logo-img">
                </NuxtLink>
            </div>

            <nav class="nav-menu">
              <NuxtLink to="/" class="nav-item">HOME</NuxtLink>
              <NuxtLink to="/custom" class="nav-item">CUSTOM</NuxtLink>
              <NuxtLink to="/about" class="nav-item">ABOUT</NuxtLink>
              <NuxtLink to="/orders" class="nav-item">ORDERS</NuxtLink>
              
              <NuxtLink v-if="!isLoggedIn" to="/login" class="login-btn">LOGIN</NuxtLink>
              
              <div v-else class="user-profile-container">
                <div class="user-display" @click="showUserMenu = !showUserMenu">
                  <!-- <span class="name-text">{{ userName.toUpperCase() }}</span> -->
                   <span class="name-text">{{ userName ? userName.toUpperCase() : 'USER' }}</span>
                  <span class="arrow-icon" :class="{ 'rotate': showUserMenu }"><i class="fa-solid fa-caret-down"></i></span>
                </div>
                
                <transition name="slide-fade">
                  <div v-if="showUserMenu" class="dropdown-menu">
                    <button @click="handleLogout" class="dropdown-item logout-red">LOGOUT</button>
                    <NuxtLink to="/profile" class="dropdown-item">PROFILE</NuxtLink>
                  </div>
                </transition>
              </div>
            </nav>
        </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer-container">
      <div class="footer">
        <NuxtLink to="/">
            <img src="/logo_spincustom.png" alt="SPINCUSTOM Logo" class="logo-img">
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase'

const router = useRouter()
const userName = ref('') 
const showUserMenu = ref(false)

// ตัวแปรเก็บสถานะ
const isScrolled = ref(false)
const isLoggedIn = ref(false) // ตัวแปรเช็คว่าล็อกอินหรือยัง

// ฟังก์ชันเช็คระยะการเลื่อนจอ
const handleScroll = () => {
  if (window.scrollY > 50) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

// ฟังก์ชันออกจากระบบ
const handleLogout = async () => {
  try {
    // 1. แสดงหน้าต่างยืนยันก่อนออกจากระบบ (Optional แต่แนะนำครับ)
    const result = await window.Swal.fire({
      title: 'ออกจากระบบ?',
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FFF700', // สีเหลืองตามธีม SpinCustom
      cancelButtonColor: '#444',
      confirmButtonText: '<span style="color:#000; font-weight:600;">ใช่, ออกจากระบบ</span>',
      cancelButtonText: 'ยกเลิก',
      background: '#232321', // สีพื้นหลังเข้ม
      color: '#fff'
    })

    if (result.isConfirmed) {
      await signOut(auth)
      
      // 2. แสดง Swal แจ้งเตือนเมื่อ Logout สำเร็จ
      await window.Swal.fire({
        title: "สำเร็จ!",
        text: "ออกจากระบบเรียบร้อยแล้วครับ!",
        icon: "success",
        timer: 1500, // ปิดเองภายใน 1.5 วินาที
        showConfirmButton: false,
        background: '#232321',
        color: '#fff'
      });

      showUserMenu.value = false // ปิด Dropdown
      router.push('/') // เด้งกลับหน้าแรก
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการออกจากระบบ:', error)
    window.Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถออกจากระบบได้ในขณะนี้",
      icon: "error",
      background: '#232321',
      color: '#fff'
    });
  }
}

// เมื่อ Component ถูกโหลด 
onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().name) {
          // ถ้ามีข้อมูลผู้ใช้และมีฟิลด์ name
          userName.value = userDoc.data().name 
        } else {
          // ถ้าไม่มีฟิลด์ name ให้เอาชื่ออีเมลส่วนหน้ามาใช้แทน
          userName.value = user.email.split('@')[0] 
        }
      } catch (error) {
        console.error("ดึงข้อมูลชื่อไม่สำเร็จ:", error)
        userName.value = "USER"
      }

    } else {
      isLoggedIn.value = false
      userName.value = ''
    }
  })
})

// คืนค่าหน่วยความจำเมื่อออกจากหน้า
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

.layout-wrapper {
  background-color: #1a1a1a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Prompt', sans-serif;
}

/* ==================== 
   NAVBAR STYLE 
==================== */

.navbar-container {
  background-color: #1a1a1a; /* สีพื้นหลังทึบตอนอยู่บนสุด */
  width: 100%;
  border-bottom: 1px solid transparent;
  
  /* --- โค้ดที่ทำให้เมนูค้างอยู่ด้านบน --- */
  position: sticky;
  top: 0;
  z-index: 1000; /* ให้อยู่ชั้นบนสุดเสมอ */
  transition: all 0.3s ease; /* ทำให้การเปลี่ยนสีสมูท */
}

/* --- โค้ดเปลี่ยนสี Navbar ตอนเลื่อนจอ --- */
.navbar-container.is-scrolled {
  background-color: rgba(26, 26, 26, 0.75); /* ทำให้โปร่งใส 75% */
  backdrop-filter: blur(12px); /* เอฟเฟกต์เบลอกระจกฝ้า */
  -webkit-backdrop-filter: blur(12px); /* สำหรับ Safari */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* เพิ่มเส้นขอบบางๆ ด้านล่าง */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); /* ใส่เงาให้ดูมีมิติ */
}

.navbar {
  max-width: 1211px; 
  margin: 0 auto;
  padding: 25px 50px; /* ปรับลด padding นิดหน่อยให้ดูเพรียวขึ้น */
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: padding 0.3s ease;
}

/* ลดขนาดความสูงของ Navbar ลงนิดนึงตอนเลื่อน (Optional) */
.navbar-container.is-scrolled .navbar {
  padding: 15px 50px; 
}

/* โลโก้ */
.logo a { 
  text-decoration: none; 
  display: flex; /* ช่วยให้จัดให้อยู่กึ่งกลางง่ายขึ้น */
  align-items: center;
}

.logo-img { 
  width: 105px; 
  height: 41px; 
  object-fit: contain; /* ป้องกันภาพยืดหดผิดสัดส่วน */
  display: block;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px; 
}

.nav-item {
  color: #a0a0a0; 
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  padding: 8px 25px;
  border-radius: 40px; 
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.nav-item:hover { color: #FFF; }

.nav-item.router-link-exact-active {
  color: #FFF700;
  /* เอาเส้นขอบเดิมออก */
  border: 1px solid transparent;
  
  /* นำไฟล์ overal.svg มาเป็นพื้นหลัง */
  background-image: url('/overal1.svg');
  /* สั่งให้รูปวงรียืดขยายพอดีกับขนาดของตัวอักษรและ padding */
  background-size: 100% 100%; 
  background-position: center;
  background-repeat: no-repeat;
}

/* แถม: ปรับ padding ของ .nav-item นิดหน่อยเพื่อให้วงรีดูอ้วนสวยพอดีกับข้อความ */
.nav-item {
  /* ... (โค้ดเดิม) ... */
  padding: 8px 30px; /* เพิ่มด้านข้างเป็น 30px วงรีจะได้ไม่เบียดข้อความเกินไป */
}

.login-btn {
  background-image: url('/overal2.svg');
  
  /* เพิ่ม 3 บรรทัดนี้เข้าไปครับ */
  background-size: 100% 100%; /* บังคับให้รูปยืดพอดีกรอบปุ่ม */
  background-position: center; /* จัดให้อยู่กึ่งกลาง */
  background-repeat: no-repeat; /* ห้ามเล่นซ้ำ (ลบหางปลาทิ้ง) */
  
  color: #000;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 35px; /* ถ้าวงรีดูบีบไป ลองเพิ่มตัวเลข 35px ให้กว้างขึ้นได้ครับ */
  /* border-radius: 40px; (เอาออกได้เลยครับ เพราะขอบมนมันมากับรูป SVG แล้ว) */
  margin-left: 10px;
  background-color: transparent; /* ทำให้พื้นหลังเดิมโปร่งใส จะได้เห็นแค่วงรี */
  transition: transform 0.2s;
}

/* เอฟเฟกต์ตอนชี้เมาส์ */
.login-btn:hover {
  transform: scale(1.05);
}

.login-btn:hover { transform: scale(1.05); }
.login-btn.router-link-exact-active { border: none; }
/* ปุ่ม LOGOUT ใช้รูปทรงเดียวกับ LOGIN แต่งให้กดได้เหมือนกัน */

.logout-btn {
  font-family: 'Prompt', sans-serif;
  cursor: pointer;
  border: none;
}
/* ==================== 
   USER PROFILE STYLE 
==================== */
.user-profile-container {
  position: relative;
  margin-left: 10px;
}

.user-display {
  background-image: url('/overal2.svg'); /* ใช้รูปวงรีเดิมของคุณมาร์ค */
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  color: #000;
  padding: 10px 25px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: 600;
}

.user-display:hover {
  transform: scale(1.05);
}

.name-text {
  font-size: 14px;
  letter-spacing: 1px;
}

.arrow-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

/* กล่องเมนู Dropdown */
.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: #232321;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 150px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  z-index: 1100;
}

.dropdown-item {
  width: 100%;
  padding: 10px;
  text-align: center;
  background: transparent;
  border: none;
  color: #fff;
  font-family: 'Prompt', sans-serif;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.logout-red {
  color: #ff5555;
  font-weight: 600;
}

/* แอนิเมชันตอนเมนูโผล่ */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
/* ==================== 
   MAIN CONTENT & FOOTER
==================== */
.main-content {
  flex-grow: 1; 
}

.footer-container {
  background-color: #111111; 
  width: 100%;
  padding: 60px 0;
  /* margin-top: 50px; */
}
.footer { display: flex; justify-content: center; align-items: center; }
.footer-logo-img { height: 50px; opacity: 0.8; }
</style>