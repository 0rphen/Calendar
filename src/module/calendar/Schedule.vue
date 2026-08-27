<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Day from '@/components/Day.vue'
import Journal from '@/components/Journal.vue'
import useMonthState from './store/month.store'
import ScheduleForm from './ScheduleForm.vue'
import useSchedule from './store/schedules.store'
import { DAY_NAME } from '@/constants'

const { monthName, emptyDays, getDays } = storeToRefs(useMonthState())
const { prevDate, nextDate } = useMonthState()
const { toggleModal, setDay } = useSchedule()
const { showModal } = storeToRefs(useSchedule())

function checkDay(event: any) {
  const { id } = event.dataset
  if (id) setDay(id)
}
</script>

<template>
  <main class="l-app">
    <header class="header">
      {{ monthName }}
      <div class="u-flex">
        <span class="icon-button" @click="prevDate()">
          <svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 4 L7 10 L13 16" />
          </svg>
        </span>
        <span class="icon-button" @click="nextDate()">
          <svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 4 L13 10 L7 16" />
          </svg>
        </span>
      </div>
    </header>
    <section class="calendar" @click="checkDay($event.target)">
      <div class="day-name" v-for="(day, index) of DAY_NAME" :key="index">
        {{ day }}
      </div>
      <div
        v-if="emptyDays > 0"
        class="day-name"
        data-state="empty"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :day="day" v-for="day of getDays" :key="day.id" />
    </section>
    <Journal />
    <div class="schedule-controls">
      <button
        class="button"
        data-variant="fab"
        :data-state="showModal ? 'open' : undefined"
        @click="toggleModal()"
      >
        <svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M8 2v12M2 8h12" />
        </svg>
      </button>
    </div>
    <div class="schedule-form" :data-state="showModal ? 'open' : undefined">
      <ScheduleForm />
    </div>
  </main>
</template>
