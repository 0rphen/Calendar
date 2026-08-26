<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSchedule from '@/module/calendar/store/schedules.store'
import getDay from '@/utils/getDay'
import { Day } from '@/interfaces'
import { PropType } from 'vue'

const props = defineProps({
  day: {
    type: Object as PropType<Day>,
    required: true
  }
})

const { day: selectedDay } = storeToRefs(useSchedule())
const today = getDay()
</script>

<template>
  <div
    :class="{
      'm-day': props.day != null,
      'm-day--busy': props.day.hasSchedules
    }"
  >
    <p
      class="m-day__number"
      :class="{
        'm-day--today': props.day.id == today,
        'm-day--selected': selectedDay == props.day.id
      }"
      :data-id="props.day.id"
    >
      {{ props.day.day }}
    </p>
  </div>
</template>
