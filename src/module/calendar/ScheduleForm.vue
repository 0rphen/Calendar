<script setup lang="ts">
import useForm from './validators/ScheduleForm'
import useSchedule from './store/schedules.store'

import { storeToRefs } from 'pinia'
import useCheckDisposition from './composable/checkScheduleDisposition'
import { computed, watch } from 'vue'

const { v$ } = useForm()
const { addSchedule, updateSchedule, toggleModal, setNotification } =
  useSchedule()
const { schedule, editingId } = storeToRefs(useSchedule())
const { hasTime } = useCheckDisposition()

const isEditing = computed(() => editingId.value !== null)

function addingSchedule() {
  if (hasTime(schedule.value.from, schedule.value.to)) {
    addSchedule()
    toggleModal()
    v$.value.$reset()
  }
}

function updatingSchedule() {
  if (
    hasTime(
      schedule.value.from,
      schedule.value.to,
      editingId.value ?? undefined
    )
  ) {
    updateSchedule()
    toggleModal()
    v$.value.$reset()
    setNotification({
      icon: false,
      text: 'Schedule updated',
      hasVisible: true,
      type: 'info',
      close: true
    })
  }
}

function submitSchedule() {
  isEditing.value ? updatingSchedule() : addingSchedule()
}

watch(
  () => v$.value.to.hasTime.$invalid,
  (invalid) =>
    setNotification({
      icon: true,
      text: "Warning, you've another schedule on this time",
      hasVisible: invalid,
      type: 'warning'
    })
)
</script>

<template>
  <div class="l-form-grid">
    <h1 class="u-span-2">
      {{ isEditing ? 'Edit Schedule' : 'New Schedule' }}
    </h1>
    <label for="">title</label>
    <input
      v-model="schedule.title"
      class="field u-span-2"
      @input="v$.title.$touch()"
      :data-state="v$.title.$invalid && v$.title.$dirty ? 'invalid' : undefined"
      type="text"
    />
    <label for="">description</label>
    <textarea
      v-model="schedule.description"
      class="field u-span-2"
      @input="v$.description.$touch()"
      :data-state="
        v$.description.$invalid && v$.description.$dirty ? 'invalid' : undefined
      "
      cols="30"
      rows="10"
    ></textarea>
    <label for="">From</label>
    <label for="">To</label>
    <input
      v-model="schedule.from"
      class="field"
      @input="v$.from.$touch()"
      :data-state="v$.from.$invalid && v$.from.$dirty ? 'invalid' : undefined"
      type="time"
    />
    <input
      v-model="schedule.to"
      class="field"
      @input="v$.to.$touch()"
      :data-state="v$.to.$invalid && v$.to.$dirty ? 'invalid' : undefined"
      type="time"
    />
    <input
      :disabled="v$.$invalid"
      @click="submitSchedule()"
      class="button u-span-2"
      data-variant="primary"
      type="button"
      :value="isEditing ? 'update' : 'add'"
    />
  </div>
</template>
