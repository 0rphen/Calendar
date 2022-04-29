<script setup lang="ts">
 import Day from '@/components/Day.vue'
 import useMonth from './composable/month'
 import SchedulerControl from '@/components/SchedulerControl.vue'
 
 const {days, dayName, monthName, emptyDays} = useMonth()
</script>

<template>
  <main>
    <header>{{monthName}}</header>
    <section class="calendar">
      <div
        class="day--name"
        v-for="(day, index) of dayName"
        :key="index"
      >{{day}}</div>
      <div
        v-if="emptyDays > 0"
        class="day--empty day--name"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :item="day" v-for="(day,index) of days" :key="index" />
    </section>
    <SchedulerControl />
    <button class="add-schedule">+</button>
  </main>
</template>
