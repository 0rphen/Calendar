<script lang="ts" setup>
import useSchedule from '@/module/calendar/store/schedules.store'

import { storeToRefs } from 'pinia'

const { notification } = storeToRefs(useSchedule())
const { setNotification } = useSchedule()

const close = () => setNotification({ hasVisible: false })
</script>

<template>
  <div
    class="notification"
    :data-variant="notification.type"
    :data-state="notification.hasVisible ? 'visible' : undefined"
  >
    <svg
      v-if="notification.icon"
      class="icon"
      viewBox="0 0 8 20"
      fill="currentColor"
    >
      <rect x="3" y="0" width="2" height="14" rx="1" />
      <rect x="3" y="17" width="2" height="3" rx="1" />
    </svg>
    <div class="notification-body">{{ notification.text }}</div>
    <div v-if="notification.close" class="notification-close" @click="close">
      &times;
    </div>
  </div>
</template>
