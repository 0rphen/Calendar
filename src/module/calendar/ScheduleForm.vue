<script setup lang="ts">
 import useForm from './validators/ScheduleForm'
 import useSchedule from './store/schedules'
 import { storeToRefs } from 'pinia'

 const { v$ } = useForm()
 const { addSchedule, toggleModal } = useSchedule()
 const { schedule } = storeToRefs(useSchedule())

 function addingSchedule() {
   addSchedule()
   toggleModal()
 }
</script>

<template>
  <div class="modal__form">
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
