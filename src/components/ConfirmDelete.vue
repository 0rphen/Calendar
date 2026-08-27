<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import useSchedule from '@/module/calendar/store/schedules.store'
import { Schedule } from '@/interfaces'

const { pendingDeleteId, schedules } = storeToRefs(useSchedule())
const { removeSchedule, dismissDelete, setNotification } = useSchedule()

const dialog = ref<HTMLDialogElement | null>(null)

const pendingSchedule = computed<Schedule | undefined>(() =>
  schedules.value.find((schedule) => schedule.id === pendingDeleteId.value)
)

watch(pendingDeleteId, (id) => {
  if (id !== null) dialog.value?.showModal()
  else dialog.value?.close()
})

function deleteSchedule() {
  if (pendingDeleteId.value === null) return
  removeSchedule(pendingDeleteId.value)
  setNotification({
    text: 'Schedule deleted',
    hasVisible: true,
    type: 'info',
    close: true
  })
  dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="confirm-dialog" @close="dismissDelete()">
    <p class="confirm-dialog-body">
      Delete <strong>{{ pendingSchedule?.title }}</strong> ({{
        pendingSchedule?.from
      }}
      - {{ pendingSchedule?.to }})?
    </p>
    <div class="confirm-dialog-actions">
      <button
        class="button"
        data-variant="accent"
        type="button"
        @click="dialog?.close()"
      >
        cancel
      </button>
      <button
        class="button"
        data-variant="primary"
        type="button"
        @click="deleteSchedule()"
      >
        delete
      </button>
    </div>
  </dialog>
</template>
