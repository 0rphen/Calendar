<script setup lang="ts">
 import { ref } from 'vue';

 interface IProps {
   item?: {
     id: string,
     day: string
   }
 }
 const props = defineProps<IProps>()
 const activity = ref(false)
 const now = new Date()
 const today = (now.getDay() + now.getMonth() + now.getFullYear()).toString()
</script>

<template>
  <div
    @click="activity = !activity"
    :class="{'day':props.item != null, 'activity': activity}"
  >
    <p :class="{'actual': props.item?.id == today}">
      {{props.item?.day}}
    </p>
  </div>
</template>
