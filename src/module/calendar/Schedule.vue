<script lang="ts" setup>
 import { storeToRefs } from 'pinia'

 import Day from '@/components/Day.vue'
 import Journal from '@/components/Journal.vue'
 import useMonth from './composable/month'
 import useMonthState from './store/month.store'
 import ScheduleForm from './ScheduleForm.vue'
 import useSchedule from './store/schedules.store'
 import DAY_NAME from '../../constants/days.constant'

 const { monthName, emptyDays, getDays } = storeToRefs(useMonthState())
 const { initDays, nDate, pDate } = useMonth()
 const { toggleModal, setDay } = useSchedule()
 const { showModal } = storeToRefs(useSchedule())

 initDays()

 function checkDay(e: any) {
   const { id } = e.dataset
   if (id) setDay(id)
 }
</script>

<template>
  <main>
    <header>{{ monthName }}
      <div>
        <span><i class="fa fa-angle-left" @click="pDate()"></i></span>
        <span><i class="fa fa-angle-right" @click="nDate()"></i></span>
      </div>
    </header>
    <section class="calendar" @click="checkDay($event.target)">
      <div
        class="day__name"
        v-for="(day, index) of DAY_NAME"
        :key ="index"
      >{{ day }}</div>
      <div
        v-if="emptyDays > 0"
        class="day__empty day__name"
        :style="`--empty:${emptyDays}`"
      ></div>
      <Day :item="day" :iKey="day.id" v-for="day of getDays" :key="day.id"/>
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
