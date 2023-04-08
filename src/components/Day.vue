<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSchedule from '@/module/calendar/store/schedules.store'
import getDay from '@/utils/getDay'
import Day from '@/interfaces/day.interface'
import { PropType } from 'vue';

const props = defineProps({
  day: {
    type: Object as PropType<Day>,
    required: true,
  }
})

const { day } = storeToRefs(useSchedule())
const today = getDay()
</script>

<template>
  <div
    :class="{
      day: props.day != null,
      activity: props.day.hasSchedules
    }"
  >
    <p
      :class="{
        actual: props.day.id == today,
        active: day == props.day.id
      }"
      :data-id="props.day.id"
    >
      {{ props.day.day }}
    </p>
  </div>
</template>
