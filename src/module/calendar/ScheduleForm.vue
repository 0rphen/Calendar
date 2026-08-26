<script setup lang="ts">
import useForm from './validators/ScheduleForm'
import useSchedule from './store/schedules.store'
import Notification from '@/components/Notification.vue'

import { storeToRefs } from 'pinia'
import useCheckDisposition from './composable/checkScheduleDisposition'
import { watch } from 'vue'

const { v$ } = useForm()
const { addSchedule, toggleModal, setNotification } = useSchedule()
const { schedule } = storeToRefs(useSchedule())
const { hasTime } = useCheckDisposition()

function addingSchedule() {
  if (hasTime(schedule.value.from, schedule.value.to)) {
    addSchedule()
    toggleModal()
    v$.value.$reset()
  }
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
  <div class="o-schedule-form__grid">
    <h1 class="o-schedule-form__field--full">
      <Notification />
      New Schedule
    </h1>
    <label for="">title</label>
    <input
      v-model="schedule.title"
      class="a-field o-schedule-form__field--full"
      @input="v$.title.$touch()"
      :class="{ 'a-field--invalid': v$.title.$invalid && v$.title.$dirty }"
      type="text"
    />
    <label for="">description</label>
    <textarea
      v-model="schedule.description"
      class="a-field o-schedule-form__field--full"
      @input="v$.description.$touch()"
      :class="{ 'a-field--invalid': v$.description.$invalid && v$.description.$dirty }"
      cols="30"
      rows="10"
    ></textarea>
    <label for="">From</label>
    <label for="">To</label>
    <input
      v-model="schedule.from"
      class="a-field"
      @input="v$.from.$touch()"
      :class="{ 'a-field--invalid': v$.from.$invalid && v$.from.$dirty }"
      type="time"
    />
    <input
      v-model="schedule.to"
      class="a-field"
      @input="v$.to.$touch()"
      :class="{ 'a-field--invalid': v$.to.$invalid && v$.to.$dirty }"
      type="time"
    />
    <input
      :disabled="v$.$invalid"
      @click="addingSchedule()"
      class="a-button a-button--primary o-schedule-form__field--full"
      type="button"
      value="add"
    />
  </div>
</template>
