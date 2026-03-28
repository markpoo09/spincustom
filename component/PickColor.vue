<template>
  <div class="pick-color">
    <input type="color" :value="modelValue" @input="onInput" />
  </div>
</template>

<script setup>
const props = defineProps({ modelValue: { type: String, default: '#ffffff' } })
const emitEvent = defineEmits(['update:modelValue'])
function onInput(e) {
  emitEvent('update:modelValue', e.target.value)
}
</script>

<style scoped>
.pick-color input[type="color"] {
  width: 40px;
  height: 32px;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
</style>
