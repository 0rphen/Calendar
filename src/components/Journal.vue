<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useSchedule from '@/module/calendar/store/schedules.store'

const { getScheduler } = storeToRefs(useSchedule())
</script>

<template>
  <section class="schedule-list">
    <div v-if="getScheduler.length <= 0">
      You don't have any scheduler this day.
    </div>
    <div
      v-for="(scheduler, index) of getScheduler"
      :key="scheduler.id"
      class="schedule-item"
      :style="`--item-index: ${index}`"
    >
      <h2 class="schedule-item-time">
        {{ scheduler.title }}
        <sup class="schedule-item-meridiem">{{ scheduler.from }} - {{ scheduler.to }}</sup>
      </h2>
      <span class="schedule-item-description">{{ scheduler.description }}</span>
    </div>
  </section>
</template>
