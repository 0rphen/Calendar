<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useSchedule from '@/module/calendar/store/schedules.store'
import { Schedule } from '@/interfaces'

const { editSchedule, toggleModal, confirmDelete } = useSchedule()
const { getScheduler, showModal } = storeToRefs(useSchedule())

function openEdit(scheduler: Schedule) {
  editSchedule(scheduler)
  if (!showModal.value) toggleModal()
}
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
      <h2
        class="schedule-item-time"
        role="button"
        tabindex="0"
        @click="openEdit(scheduler)"
        @keydown.enter="openEdit(scheduler)"
        @keydown.space.prevent="openEdit(scheduler)"
      >
        {{ scheduler.title }}
        <sup class="schedule-item-meridiem"
          >{{ scheduler.from }} - {{ scheduler.to }}</sup
        >
      </h2>
      <span class="schedule-item-description">{{ scheduler.description }}</span>
      <div class="schedule-item-actions">
        <button
          class="icon-button"
          type="button"
          aria-label="Delete schedule"
          @click="confirmDelete(scheduler.id!)"
        >
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </section>
</template>
