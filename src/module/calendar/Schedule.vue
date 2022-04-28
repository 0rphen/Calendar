<script setup lang="ts">
 import Day from '../../components/Day.vue'
 import useMonth from './composable/month'
 
 const {days, dayName, monthName} = useMonth()
</script>

<template>
  <main>
    <header>{{monthName}}</header>
    <section class="calendar">
      <div
        class="day-name"
        v-for="(day, index) of dayName"
        :key="index"
      >{{day}}</div>
      <Day :item="day" v-for="(day,index) of days" :key="index"></Day>
    </section>
  </main>
</template>
