<script lang="ts" setup>
 type Type = 'info' | 'warning' | 'error'
 interface Notification {
   hasVisible: boolean,
   type?: Type,
   icon?: boolean,
   text: string,
   close?: boolean
 }
 
 const props = defineProps<Notification>()
</script>

<template>
  <div class="notification" :class="[{ 'visible': hasVisible }, `${type}`]">
    <i class="fa fa-exclamation" v-if="props.icon" ></i>
    <div class="notification__body">{{props.text}}</div>
    <div class="notification__control" v-if="props.close">
    </div>
  </div>
</template>
