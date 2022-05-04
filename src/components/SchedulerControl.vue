<script lang="ts" setup>
 import useSchedule from '../module/calendar/composable/schedules';
 const { schedules : schedulerList } = useSchedule()
 
</script>

<template>
  <section class="scheduler__list">
    <div
      v-if="schedulerList.length > 0"
      v-for="(scheduler, index) of schedulerList"
      :key="index"
      class="scheduler__item"
      :style="`--scheduler-item: ${index}`"
    >
      <h2>{{scheduler.hour}}</h2>
      <span>{{scheduler.desc}}</span>
    </div>
    <div v-else>You don't have any scheduler this day.</div>
  </section> 
</template>
