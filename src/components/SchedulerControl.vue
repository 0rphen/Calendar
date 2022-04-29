<script lang="ts" setup>
 const schedulerList = [
   { hour: '7:00', desc: 'Doctor meeting'},
   { hour: '9:30', desc: 'Daily Frontend'},
   { hour: '12:00', desc: 'Lunch with Cate'},
   { hour: '18:00', desc: 'Go to cinema'}
 ]
</script>

<template>
  <section class="scheduler--control">
    <div
      v-if="schedulerList.length > 0"
      v-for="(scheduler, index) of schedulerList"
      :key="index"
      class="scheduler--item"
      :style="`--scheduler-item: ${index}`"
    >
      <h2>{{scheduler.hour}}</h2>
      <span>{{scheduler.desc}}</span>
    </div>
    <div v-else>You don't have any scheduler this day.</div>
  </section> 
</template>
