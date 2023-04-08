<script lang="ts" setup>
import useSchedule from '@/module/calendar/store/schedules.store'

import { storeToRefs } from 'pinia'

const { notification } = storeToRefs(useSchedule())
const { setNotification } = useSchedule()

const close = () => setNotification({ hasVisible: false})
</script>

<template>
  <div
    class="notification"
    :class="[{ visible: notification.hasVisible }, `${notification.type}`]"
  >
    <i class="fa fa-exclamation" v-if="notification.icon"></i>
    <div class="notification__body">{{ notification.text }}</div>
    <div
      v-if="notification.close"
      class="notification__control"
      @click="close"
    >&times;</div>
  </div>
</template>
