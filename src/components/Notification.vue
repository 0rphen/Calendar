<script lang="ts" setup>
import INotification from 'interfaces/notification.interface';
import { PropType } from 'vue';

const props = defineProps({
  notification: {
    type: Object as PropType<INotification>,
    required: true
  }
})
</script>

<template>
  <div
    class="notification"
    :class="[{ visible: notification.hasVisible }, `${notification.type}`]"
  >
    <i class="fa fa-exclamation" v-if="props.notification.icon"></i>
    <div class="notification__body">{{ props.notification.text }}</div>
    <div class="notification__control" v-if="props.notification.close"></div>
  </div>
</template>
