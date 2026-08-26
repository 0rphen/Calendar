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
  <main class="t-app">
    <header class="o-header">
      {{ monthName }}
      <div class="nav">
        <span class="a-icon-button" @click="prevDate()">
          <svg class="a-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 4 L7 10 L13 16" />
          </svg>
        </span>
        <span class="a-icon-button" @click="nextDate()">
          <svg class="a-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 4 L13 10 L7 16" />
          </svg>
        </span>
      </div>
    </header>
    <section class="o-calendar" @click="checkDay($event.target)">
      <div class="name" v-for="(day, index) of DAY_NAME" :key="index">
        {{ day }}
      </div>
      <div
        v-if="emptyDays > 0"
        class="empty name"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :day="day" v-for="day of getDays" :key="day.id" />
    </section>
    <Journal />
    <div class="o-schedule-controls">
      <button
        class="a-button fab"
        :class="{ 'is-open': showModal }"
        @click="toggleModal()"
      >
        <svg class="a-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M8 2v12M2 8h12" />
        </svg>
      </button>
    </div>
    <div class="o-schedule-form" :class="{ open: showModal }">
      <ScheduleForm />
    </div>
  </main>
</template>
