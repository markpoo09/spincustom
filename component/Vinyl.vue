<template>
  <svg
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
</template>

<script setup>
defineProps({
  width: { type: [Number, String], default: 100 },
  height: { type: [Number, String], default: 100 },
  color1: { type: String, default: '#0059FF' },
  color2: { type: String, default: '#FF0000' },
  color3: { type: String, default: '#FFF700' },
  color4: { type: String, default: '#00ff37' }
})
</script>
