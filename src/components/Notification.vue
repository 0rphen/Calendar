<script lang="ts" setup>
import INotification from '@/interfaces/notification.interface'
import useSchedule from '@/module/calendar/store/schedules.store'

import { storeToRefs } from 'pinia'
import { PropType } from 'vue'

const { showNotification } = storeToRefs(useSchedule())
const { hasNotification } = useSchedule()

const props = defineProps({
  notification: {
    type: Object as PropType<INotification>,
    required: true
  }
})

const close = () => hasNotification(false)
</script>

<template>
  <div
    class="notification"
    :class="[{ visible: showNotification }, `${notification.type}`]"
  >
    <i class="fa fa-exclamation" v-if="props.notification.icon"></i>
    <div class="notification__body">{{ props.notification.text }}</div>
    <div
      v-if="props.notification.close"
      class="notification__control"
      @click="close"
    >&times;</div>
  </div>
</template>
