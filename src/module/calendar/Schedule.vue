<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Day from '@/components/Day.vue'
import Journal from '@/components/Journal.vue'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import Notification from '@/components/Notification.vue'
import useMonthState from './store/month.store'
import ScheduleForm from './ScheduleForm.vue'
import useSchedule from './store/schedules.store'
import { DAY_NAME } from '@/constants'

const { monthName, emptyDays, getDays } = storeToRefs(useMonthState())
const { prevDate, nextDate } = useMonthState()
const { toggleModal, setDay, cancelEdit } = useSchedule()
const { showModal } = storeToRefs(useSchedule())

function checkDay(event: any) {
  const { id } = event.dataset
  if (id) setDay(id)
}

function closeForm() {
  if (showModal.value) cancelEdit()
  toggleModal()
}
</script>

<template>
  <main class="l-app">
    <header class="header">
      {{ monthName }}
      <div class="u-flex">
        <span class="icon-button" @click="prevDate()">
          <i class="fa fa-angle-left"></i>
        </span>
        <span class="icon-button" @click="nextDate()">
          <i class="fa fa-angle-right"></i>
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
    <Notification />
    <Journal />
    <div class="schedule-controls">
      <button
        class="button"
        data-variant="fab"
        :data-state="showModal ? 'open' : undefined"
        @click="closeForm()"
      >
        <i class="fa fa-plus"></i>
      </button>
    </div>
    <div class="schedule-form" :data-state="showModal ? 'open' : undefined">
      <ScheduleForm />
    </div>
    <ConfirmDelete />
  </main>
</template>
