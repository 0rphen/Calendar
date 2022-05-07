<script lang="ts" setup>
 import { storeToRefs } from 'pinia'

 import Day from '@/components/Day.vue'
 import useMonth from './composable/month'
 import useMonthState from './store/month'
 import Journal from '@/components/Journal.vue'
 import ScheduleForm from './ScheduleForm.vue'
 import useSchedule from './store/schedules'

 const { dayName, monthName, emptyDays, days } = storeToRefs(useMonthState())
 const { initDays } = useMonth()
 initDays()
 const { toggleModal } = useSchedule()
 const { showModal } = storeToRefs(useSchedule())

 const { setDay } = useSchedule()
 function checkDay(e: any) {
   const { id } = e.dataset
   if (id) setDay(id)
 }
</script>

<template>
  <main>
    <header>{{ monthName }}</header>
    <section class="calendar" @click="checkDay($event.target)">
      <div
        class="day__name"
        v-for="(day, index) of dayName"
        :key ="index"
      >{{ day }}</div>
      <div
        v-if="emptyDays > 0"
        class="day__empty day__name"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :item="day" v-for="(day,index) of days" :key="index"/>
    </section>
    <Journal />
    <div class="scheduler__control">
      <button
        class="add-schedule"
        :class="{'add': showModal}"
        @click="toggleModal()"
      ><i class="fa fa-plus"></i>
      </button>
    </div>
    <div class="scheduler__modal" :class="{'add': showModal}" >
      <ScheduleForm />
    </div>
  </main>
</template>
