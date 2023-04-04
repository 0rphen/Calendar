<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useSchedule from '../module/calendar/store/schedules.store'

const { getScheduler } = storeToRefs(useSchedule())
</script>

<template>
  <section class="scheduler__list">
    <div v-if="getScheduler.length <= 0">
      You don't have any scheduler this day.
    </div>
    <div
      v-for="(scheduler, index) of getScheduler"
      :key="scheduler.id"
      class="scheduler__item"
      :style="`--scheduler-item: ${index}`"
    >
      <h2>
        {{ scheduler.title }}
        <sup>{{ scheduler.from }} - {{ scheduler.to }}</sup>
      </h2>
      <span>{{ scheduler.description }}</span>
    </div>
  </section>
</template>
