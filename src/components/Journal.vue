<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useSchedule from '@/module/calendar/store/schedules.store'

const { getScheduler } = storeToRefs(useSchedule())
</script>

<template>
  <section class="o-schedule-list">
    <div v-if="getScheduler.length <= 0">
      You don't have any scheduler this day.
    </div>
    <div
      v-for="(scheduler, index) of getScheduler"
      :key="scheduler.id"
      class="m-schedule-item"
      :style="`--item-index: ${index}`"
    >
      <h2 class="m-schedule-item__time">
        {{ scheduler.title }}
        <sup class="m-schedule-item__meridiem">{{ scheduler.from }} - {{ scheduler.to }}</sup>
      </h2>
      <span class="m-schedule-item__description">{{ scheduler.description }}</span>
    </div>
  </section>
</template>
