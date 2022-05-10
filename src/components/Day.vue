<script setup lang="ts">
 import { reactive } from 'vue'
 import { storeToRefs } from 'pinia'
 import useSchedule from '../module/calendar/store/schedules.store'
 import useMonthStore from '../module/calendar/store/month.store'
 import getDay from '../utils/getDay'
 import IDay from '../interfaces/day.interface'

 interface IProps {
   item: IDay
 }
 
 const props = defineProps<IProps>()
 
 const { day } = storeToRefs(useSchedule())
 const { days } = storeToRefs(useMonthStore())
 const schedDay = reactive(days.value.find(d => d.day == props.item.day) || {} as IDay)
 const today = getDay()
</script>

<template>
  <div
    :class="{
      'day':props.item != null,
      'activity': schedDay?.schedules}"
  >
    <p :class="{'actual': props.item.id == today,
       'active': day == props.item.id}"
       :data-id="props.item.id"
    >
      {{props.item.day}}
    </p>
  </div>
</template>
