<template>
  <!-- SVG สำหรับ Type 1 -->
  <svg
    v-if="type === 1"
    :width="width"
    :height="height"
    viewBox="0 0 617 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="616" height="429" :fill="color1" stroke="#4B4A2D"/>
    <rect x="0.5" y="0.5" width="616" height="361" :fill="color2" stroke="#4B4A2D"/>
    <circle cx="318" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/>
    <circle cx="318" cy="180.999" r="56.5693" fill="black"/>
    <circle cx="318" cy="181" r="4.52555" fill="#4B4A2D"/>
    <circle cx="558" cy="44" r="23.5" fill="white" stroke="#4B4A2D"/>
    <circle cx="139" cy="312" r="17" :fill="color3"/>
    <circle cx="139" cy="312" r="23.5" stroke="#4B4A2D"/>
    <circle cx="78" cy="312" r="17" :fill="color3"/>
    <circle cx="78" cy="312" r="23.5" stroke="#4B4A2D"/>
    <path
      d="M558 27C567.389 27 575 34.6112 575 44C575 52.3651 568.958 59.3184 561 60.7354V233H566V263H549V233H555V60.7354C547.042 59.3184 541 52.3651 541 44C541 34.6112 548.611 27 558 27Z"
      :fill="color4"
    />
  </svg>

  <!-- SVG สำหรับ Type 2 -->
  <svg
    v-else-if="type === 2"
    :width="width"
    :height="height"
    viewBox="0 0 617 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="616" height="393" :fill="color1" stroke="#4B4A2D"/>
    <rect x="0.5" y="0.5" width="616" height="361" fill="white" stroke="#4B4A2D"/>
    <rect x="387.5" y="0.5" width="228" height="361" :fill="color2" stroke="#4B4A2D"/>
    <circle cx="553" cy="312" r="17" :fill="color3"/>
    <circle cx="553" cy="312" r="23.5" stroke="#4B4A2D"/>
    <circle cx="553" cy="256" r="17" :fill="color3"/>
    <circle cx="553" cy="256" r="23.5" stroke="#4B4A2D"/>
    <circle cx="507" cy="312" r="12.75" :fill="color3"/>
    <circle cx="507" cy="312" r="17.625" stroke="#4B4A2D" stroke-width="0.75"/>
    <circle cx="219" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/>
    <circle cx="219" cy="180.999" r="56.5693" fill="black"/>
    <circle cx="219" cy="181" r="4.52555" fill="#4B4A2D"/>
    <circle cx="442" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/>
    <path d="M442 33C451.389 33 459 40.6112 459 50C459 58.3651 452.958 65.3184 445 66.7354V239H450V269H433V239H439V66.7354C431.042 65.3184 425 58.3651 425 50C425 40.6112 432.611 33 442 33Z" :fill="color4"/>
  </svg>

  <!-- SVG สำหรับ Type 3 -->
  <svg
    v-else-if="type == 3"
    :width="width"
    :height="height"
    viewBox="0 0 418 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="417" height="429" :fill="color1" stroke="#4B4A2D"/>
    <rect x="0.5" y="0.5" width="417" height="361" :fill="color2" stroke="#4B4A2D"/>
    <circle cx="303" cy="397" r="17" :fill="color3"/>
    <circle cx="303" cy="397" r="23.5" stroke="#4B4A2D"/>
    <circle cx="119" cy="397" r="17" :fill="color3"/>
    <circle cx="119" cy="397" r="23.5" stroke="#4B4A2D"/>
    <circle cx="211" cy="397" r="17" :fill="color3"/>
    <circle cx="211" cy="397" r="23.5" stroke="#4B4A2D"/>
    <circle cx="200" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/>
    <circle cx="200" cy="180.999" r="56.5693" fill="black"/>
    <circle cx="200" cy="181" r="4.52555" fill="#4B4A2D"/>
    <circle cx="379" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/>
    <path d="M379 33C388.389 33 396 40.6112 396 50C396 58.3651 389.958 65.3184 382 66.7354V239H387V269H370V239H376V66.7354C368.042 65.3184 362 58.3651 362 50C362 40.6112 369.611 33 379 33Z" :fill="color4"/>
  </svg>

  <!-- SVG สำหรับ Type 4 -->
  <svg
    v-else="type == 4"
    :width="width"
    :height="height"
    viewBox="0 0 418 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="417" height="429" :fill="color1" stroke="#4B4A2D"/>
    <rect x="0.5" y="0.5" width="417" height="361" :fill="color2" stroke="#4B4A2D"/>
    <circle cx="79" cy="398" r="12.75" :fill="color3"/>
    <circle cx="79" cy="398" r="17.625" stroke="#4B4A2D" stroke-width="0.75"/>
    <circle cx="200" cy="181" r="154.5" fill="white" stroke="#4B4A2D"/>
    <circle cx="200" cy="180.999" r="56.5693" fill="black"/>
    <circle cx="200" cy="181" r="4.52555" fill="#4B4A2D"/>
    <circle cx="379" cy="50" r="23.5" fill="white" stroke="#4B4A2D"/>
    <path d="M379 33C388.389 33 396 40.6112 396 50C396 58.3651 389.958 65.3184 382 66.7354V239H387V269H370V239H376V66.7354C368.042 65.3184 362 58.3651 362 50C362 40.6112 369.611 33 379 33Z" :fill="color4"/>
  </svg>

</template>

<script setup>
const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  color1: {
    type: String,
    default: "#0059FF",
  },
  color2: {
    type: String,
    default: "#FF0000",
  },
  color3: {
    type: String,
    default: "#FFF700",
  },
  color4: {
    type: String,
    default: "#000000", // เพิ่ม default สำหรับ type1 ที่ใช้ color4
  },
});
</script>
