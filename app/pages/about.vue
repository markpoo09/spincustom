<template>
    <div class="about-page-wrapper">
        <div class="about-page">
            
            <p class="about-subtitle">ABOUT ME</p>
            <h1 class="about-title">
                สิ่งที่รู้เกี่ยวกับ<span class="highlight-green">เรา</span>
            </h1>
            
            <div class="content-box">
                <p class="quote-text">
                    “เว็บไซต์เรานี้ไม่ใช่ร้านขายเครื่องเล่นเเผ่นเสียง แต่เป็นพื้นที่ให้<br>
                    คุณสร้างเครื่องเล่นแผ่นเสียงเครื่องที่ไม่ซ้ำใครและไม่มีใคร<br>
                    เหมือนอย่างแน่นอน ผ่านแนวคิดที่ชอบความไม่จำเป็นต้อง<br>
                    อยู่ในกรอบหรือเหมือนกันหมด”
                </p>
            </div>

        </div>
    </div>
</template>

<!-- <script setup>
</script> -->

<style scoped>
/* ดึงฟอนต์ Jura และ Prompt จาก Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@400;700&family=Prompt:wght@300;400;500;600&display=swap');

/* ==================== 
   สไตล์พื้นฐานของหน้า
==================== */
.about-page-wrapper {
    background-color: #20201A; /* สีขอบนอกสุด */
    min-height: 100vh;
    width: 100%;
}

.about-page {
    max-width: 1440px; /* คุมความกว้างไม่ให้เกินดีไซน์ */
    margin: 0 auto;
    padding-top: 88px; /* ระยะห่างด้านบนสุด 88px ตามรูป */
    padding-bottom: 155px; /* ระยะห่างด้านล่างสุด 155px ตามรูป */
    display: flex;
    flex-direction: column;
    align-items: center; /* จัดทุกอย่างให้อยู่กึ่งกลาง */
}

/* ==================== 
   สไตล์ Typography
==================== */
.about-subtitle {
    color: #FFF700;
    font-family: 'Jura', sans-serif;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 45px */
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin: 0;
    margin-bottom: 21px; /* ระยะห่างลงมา 21px ตามรูป */
}

.about-title {
    color: #FFF;
    text-align: center;
    font-family: 'Prompt', sans-serif;
    font-size: 51.875px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 77.813px */
    margin: 0;
    margin-bottom: 45px; /* ระยะห่างลงมา 45px ตามรูป */
}

.highlight-green {
    color: #CDF100;
    font-family: 'Prompt', sans-serif;
    font-size: 51.875px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
}

/* ==================== 
   สไตล์กล่องข้อความ
==================== */
.content-box {
    width: 100%;
    max-width: 1107px;
    min-height: 366px; 
    height: auto;
    border-radius: 21px;
    background: #1A1A0C;
    box-sizing: border-box; 
    padding-top: 63px; 
    padding-bottom: 87px;
    display: flex;
    justify-content: center;
}

.quote-text {
    color: #FFF;
    text-align: center;
    font-family: 'Prompt', sans-serif;
    font-size: 36px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 54px */
    margin: 0;
}
</style>