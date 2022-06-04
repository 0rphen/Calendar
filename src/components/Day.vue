<script setup lang="ts">
 import { storeToRefs } from 'pinia'
 import useSchedule from '../module/calendar/store/schedules.store'
 import getDay from '../utils/getDay'
 import IDay from '../interfaces/day.interface'

 interface IProps {
   item: IDay,
 }
 
 const props = defineProps<IProps>()
 
 const { day } = storeToRefs(useSchedule())
 const today = getDay()
</script>

<template>
  <div
    :class="{
      'day':props.item != null,
      'activity': item.schedules}"
  >
    <p :class="{'actual': props.item.id == today,
       'active': day == props.item.id}"
       :data-id="props.item.id"
    >
      {{props.item.day}}
    </p>
  </div>
</template>
