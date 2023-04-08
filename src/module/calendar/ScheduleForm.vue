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

watch(() => v$.value.to.hasTime.$invalid, (invalid) =>
  setNotification({
    icon: true,
    text: "Warning, you've another schedule on this time",
    hasVisible: invalid,
    type: 'warning',
  }))
</script>

<template>
  <div class="modal__form">
    <h1 class="form__input--full">
      <Notification />
      New Schedule
    </h1>
    <label for="">title</label>
    <input
      v-model="schedule.title"
      class="form__input--full"
      @input="v$.title.$touch()"
      :class="{ error: v$.title.$invalid && v$.title.$dirty }"
      type="text"
    />
    <label for="">description</label>
    <textarea
      v-model="schedule.description"
      class="form__input--full"
      @input="v$.description.$touch()"
      :class="{ error: v$.description.$invalid && v$.description.$dirty }"
      cols="30"
      rows="10"
    ></textarea>
    <label for="">From</label>
    <label for="">To</label>
    <input
      v-model="schedule.from"
      @input="v$.from.$touch()"
      :class="{ error: v$.from.$invalid && v$.from.$dirty }"
      type="time"
    />
    <input
      v-model="schedule.to"
      @input="v$.to.$touch()"
      :class="{ error: v$.to.$invalid && v$.to.$dirty }"
      type="time"
    />
    <input
      :disabled="v$.$invalid"
      @click="addingSchedule()"
      class="add-btn form__input--full"
      type="button"
      value="add"
    />
  </div>
</template>
