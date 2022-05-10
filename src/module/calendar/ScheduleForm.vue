\<script setup lang="ts">
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
    if(hasTime(schedule.value.from, schedule.value.to)) {
      addSchedule()
      toggleModal()
    }
  }
</script>

<template>
  <div class="modal__form">
    <Notification class="form__input--full" :text="errorMessage" v-if="v$.to.hasTime.$invalid" :icon="true" />
    <label for="">title</label>
    <input
      v-model="schedule.title"
      class="form__input--full"
      name=""
      type="text"
    />
    <label for="">description</label>
    <textarea
      v-model="schedule.description"
      class="form__input--full"
      cols="30"
      id=""
      name=""
      rows="10"
    ></textarea>
    <label for="">From</label>
    <label for="">To</label>
    <input
      v-model="schedule.from"
      name=""
      type="time"
    />
    <input
      v-model="schedule.to"
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
