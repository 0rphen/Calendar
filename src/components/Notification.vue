<script lang="ts" setup>
 interface INotification {
   hasVisible: boolean,
   type?: 'info' | 'warning' | 'error',
   icon?: boolean,
   text: string,
   close?: boolean
 }

 const props = defineProps<INotification>()
</script>

<template>
  <div class="notification" :class="{'visible': hasVisible}">
    <i class="fa fa-exclamation" v-if="props.icon" ></i>
    <div class="notification__body">{{props.text}}</div>
    <div class="notification__control" v-if="props.close">
    </div>
  </div>
</template>
