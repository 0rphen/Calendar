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
    :class="{ day: props.day != null }"
    :data-state="props.day.hasSchedules ? 'busy' : undefined"
  >
    <p
      class="day-number"
      :data-state="
        [
          props.day.id == today ? 'today' : null,
          selectedDay == props.day.id ? 'selected' : null
        ]
          .filter(Boolean)
          .join(' ') || undefined
      "
      :data-id="props.day.id"
    >
      {{ props.day.day }}
    </p>
  </div>
</template>
