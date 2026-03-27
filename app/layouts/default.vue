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
            <NuxtLink to="/login" class="login-btn">LOGIN</NuxtLink>
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

// ตัวแปรเก็บสถานะว่าเลื่อนจอลงมาหรือยัง
const isScrolled = ref(false)

// ฟังก์ชันเช็คระยะการเลื่อนจอ
const handleScroll = () => {
  // ถ้าเลื่อนจอลงมามากกว่า 50px ให้ isScrolled เป็น true
  if (window.scrollY > 50) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

// เมื่อ Component ถูกโหลด ให้เริ่มดักจับการเลื่อนหน้าจอ
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
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