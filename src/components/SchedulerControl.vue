<script lang="ts" setup>
 import useSchedule from '../module/calendar/store/schedules';
 const store = useSchedule()
</script>

<template>
  <section class="scheduler__list">
    <div
      v-if="store.schedules.length > 0"
      v-for="(scheduler, index) of store.schedules"
      :key="index"
      class="scheduler__item"
      :style="`--scheduler-item: ${index}`"
    >
      <h2>{{scheduler.from}}</h2>
      <span>{{scheduler.description}}</span>
    </div>
    <div v-else>You don't have any scheduler this day.</div>
  </section> 
</template>
