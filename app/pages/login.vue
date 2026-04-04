<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2 class="title">{{ isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก' }}</h2>
      <p class="subtitle text-center mb-4">SPINCUSTOM</p>

      <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

      <form @submit.prevent="handleSubmit">
        
        <div v-if="!isLogin" class="register-fields-container">
          
          <div class="input-group mb-3">
            <label>ชื่อ</label>
            <input type="text" v-model="fullName" placeholder="ชื่อของคุณ" class="custom-input" required>
          </div>

          <div class="d-flex gap-2 mb-3">
            <div class="input-group flex-fill">
              <label>อายุ</label>
              <input type="number" v-model="age" placeholder="เช่น 20" class="custom-input" required>
            </div>
            <div class="input-group flex-fill">
              <label>เบอร์โทรศัพท์</label>
              <input type="tel" v-model="phone" placeholder="08x-xxx-xxxx" class="custom-input" required>
            </div>
          </div>

          <div class="input-group mb-3">
            <label>วงดนตรีที่ชอบ 🎸</label>
            <input type="text" v-model="favoriteBand" placeholder="เช่น Arctic Monkeys, Bodyslam..." class="custom-input" required>
          </div>
        </div>
        <div class="input-group">
          <label>อีเมล</label>
          <input type="email" v-model="email" required placeholder="your@email.com" class="custom-input">
        </div>

        <div class="input-group mt-3">
          <label>รหัสผ่าน</label>
          <input type="password" v-model="password" required placeholder="••••••••" class="custom-input">
        </div>

        <button type="submit" class="btn-primary-full mt-4" :disabled="isLoading">
          {{ isLoading ? 'กำลังประมวลผล...' : (isLogin ? 'LOGIN' : 'REGISTER') }}
        </button>
      </form>

      <div class="switch-mode mt-4 text-center">
        <p v-if="isLogin">
          ยังไม่มีบัญชีใช่ไหม? <a href="#" @click.prevent="toggleMode" class="text-highlight">สมัครสมาชิกที่นี่</a>
        </p>
        <p v-else>
          มีบัญชีอยู่แล้ว? <a href="#" @click.prevent="toggleMode" class="text-highlight">เข้าสู่ระบบเลย</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
// สังเกตว่าผมเอา storage ออกไปแล้วนะครับ ใช้แค่ auth กับ db พอ
import { auth, db } from '~/utils/firebase' 

const router = useRouter()

// ตัวแปรฟอร์มทั่วไป
const email = ref('')
const password = ref('')
const isLogin = ref(true) 
const errorMessage = ref('')
const isLoading = ref(false)

// ตัวแปรใหม่สำหรับข้อมูลสมัครสมาชิก
const fullName = ref('')
const age = ref('')
const phone = ref('')
const favoriteBand = ref('')

// สลับโหมดและเคลียร์ข้อมูล
const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

const handleSubmit = async () => {
  if (!email.value || !password.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (isLogin.value) {
      // โหมดเข้าสู่ระบบ
      await signInWithEmailAndPassword(auth, email.value, password.value)
      window.Swal.fire({ title: 'ยินดีต้อนรับ!', icon: 'success', timer: 1500, showConfirmButton: false });
      router.push('/') 
      
    } else {
      // โหมดสมัครสมาชิก
      // 1. สร้างบัญชีด้วย Email & Password
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      const user = userCredential.user 
      
      // 2. บันทึกข้อมูลทั้งหมดลง Firestore 
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: fullName.value,
        age: Number(age.value),
        phone: phone.value,
        favoriteBand: favoriteBand.value,
        role: 'player', 
        createdAt: serverTimestamp() 
      })

    //   alert("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ SPINCUSTOM")
        window.Swal.fire({ title: 'สมัครสมาชิกสำเร็จ!', text: 'ยินดีต้อนรับสู่ SPINCUSTOM', icon: 'success', timer: 2000, showConfirmButton: false });
      router.push('/') 
    }
  } catch (error) {
    console.error("Auth Error:", error)
    switch (error.code) {
      case 'auth/email-already-in-use': errorMessage.value = 'อีเมลนี้มีผู้ใช้งานแล้ว'; break;
      case 'auth/invalid-credential': errorMessage.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'; break;
      case 'auth/weak-password': errorMessage.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'; break;
      default: errorMessage.value = 'เกิดข้อผิดพลาด: ' + error.message;
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

.login-wrapper { background-color: #1a1a1a; min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; font-family: 'Prompt', sans-serif; color: #fff; padding: 40px 20px; }
.login-box { background-color: #232321; border: 1px solid #333; border-radius: 16px; padding: 40px; width: 100%; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.title { color: #FFF700; font-size: 28px; font-weight: 600; text-align: center; margin-bottom: 5px; }
.subtitle { color: #aaa; font-family: 'Jura'; letter-spacing: 2px;}

.input-group label { display: block; margin-bottom: 8px; color: #ddd; font-size: 14px; }
.custom-input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #444; background-color: #111; color: #fff; outline: none; font-family: 'Prompt'; box-sizing: border-box;}
.custom-input:focus { border-color: #CDF100; }

.btn-primary-full { width: 100%; background-color: #FFF700; color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-primary-full:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary-full:hover:not(:disabled) { transform: translateY(-2px); }

.text-highlight { color: #CDF100; text-decoration: none; font-weight: 500;}
.text-highlight:hover { text-decoration: underline; }
.error-msg { background-color: rgba(255, 50, 50, 0.1); color: #ff5555; padding: 10px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #ff5555; }

.d-flex { display: flex; }
.gap-2 { gap: 8px; }
.flex-fill { flex: 1; }

.d-none { display: none; }
.register-fields-container { animation: fadeIn 0.3s ease; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>