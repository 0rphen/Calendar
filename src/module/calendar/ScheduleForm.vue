<script setup lang="ts">
import useForm from './validators/ScheduleForm'
import useSchedule from './store/schedules.store'
import Notification from '../../components/Notification.vue'

import { storeToRefs } from 'pinia'
import useCheckDisposition from './composable/checkScheduleDisposition'

const { v$ } = useForm()
const { addSchedule, toggleModal } = useSchedule()
const { schedule } = storeToRefs(useSchedule())
const { hasTime } = useCheckDisposition()
const errorMessage = "Warning, you've another schedule on this time"

function addingSchedule() {
  if (hasTime(schedule.value.from, schedule.value.to)) {
    addSchedule()
    toggleModal()
  }
}
</script>

<template>
  <div class="modal__form">
    <h1 class="form__input--full">
      <Notification
        :text="errorMessage"
        :hasVisible="v$.to.hasTime.$invalid"
        :icon="true"
        :type="'warning'"
      />
      New Schedule
    </h1>
    <label for="">title</label>
    <input
      v-model="schedule.title"
      class="form__input--full"
      @input="v$.title.$touch()"
      :class="{ error: v$.title.$invalid && v$.title.$dirty }"
      name=""
      type="text"
    />
    <label for="">description</label>
    <textarea
      v-model="schedule.description"
      class="form__input--full"
      @input="v$.title.$touch()"
      :class="{ error: v$.description.$invalid && v$.description.$dirty }"
      cols="30"
      id=""
      name=""
      rows="10"
    ></textarea>
    <label for="">From</label>
    <label for="">To</label>
    <input
      v-model="schedule.from"
      @input="v$.from.$touch()"
      :class="{ error: v$.from.$invalid && v$.from.$dirty }"
      name=""
      type="time"
    />
    <input
      v-model="schedule.to"
      @input="v$.to.$touch()"
      :class="{ error: v$.to.$invalid && v$.to.$dirty }"
      name=""
      type="time"
    />
    <input
      :disabled="v$.$invalid"
      @click="addingSchedule()"
      class="add-btn form__input--full"
      name=""
      type="button"
      value="add"
    />
  </div>
</template>
