<script setup lang="ts">
 import { storeToRefs } from 'pinia'
 
 import Day from '@/components/Day.vue'
 import useMonth from './composable/month'
 import SchedulerControl from '@/components/SchedulerControl.vue'
 import ScheduleForm from './ScheduleForm.vue'
 import useSchedule from './store/schedules'

 const {days, dayName, monthName, emptyDays} = useMonth()
 const { toggleModal } = useSchedule()
 const { showModal } = storeToRefs(useSchedule())
</script>

<template>
  <main>
    <header>{{monthName}}</header>
    <section class="calendar">
      <div
        class="day__name"
        v-for="(day, index) of dayName"
        :key="index"
      >{{day}}</div>
      <div
        v-if="emptyDays > 0"
        class="day__empty day__name"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :item="day" v-for="(day,index) of days" :key="index" />
    </section>
    <SchedulerControl />
    <div class="scheduler__control">
      <button
        class="add-schedule"
        :class="{'add': showModal}"
        @click="toggleModal()"
      ><i class="fa fa-plus"></i>
      </button>
    </div>
    <div class="scheduler__modal" :class="{'add': showModal}">
      <ScheduleForm />
    </div>
  </main>
</template>
