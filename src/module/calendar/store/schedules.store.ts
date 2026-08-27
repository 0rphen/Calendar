import { reactive } from 'vue'
import { defineStore } from 'pinia'

import State from '@/types/State.type'
import { SCHEDULE, SCHEDULES } from '@/constants'
import { INotification, Schedule } from '@/interfaces'
import getDay from '@/utils/getDay'

import useCheckScheduler from '../composable/checkScheduleDisposition'

const day = getDay()

const notification: Partial<INotification> = reactive({
  text: '',
  hasVisible: false
})

const NOTIFICATION_AUTO_DISMISS_MS = 4000
let notificationTimeout: ReturnType<typeof setTimeout> | undefined

const useSchedule = defineStore('schedules', {
  state: () =>
    <State>{
      day,
      schedule: { ...SCHEDULE },
      showModal: false,
      schedules: [...SCHEDULES],
      notification: notification,
      editingId: null,
      pendingDeleteId: null
    },
  actions: {
    addSchedule() {
      const id = Date.now()
      this.schedules = [
        ...this.schedules,
        { ...this.schedule, day: this.day, id }
      ]
      this.schedule = { ...SCHEDULE, day: this.day }
    },
    removeSchedule(id: number) {
      this.schedules = this.schedules.filter(
        (schedule: Schedule) => schedule.id != id
      )
    },
    editSchedule(schedule: Schedule) {
      this.schedule = { ...schedule }
      this.editingId = schedule.id ?? null
    },
    updateSchedule() {
      this.schedules = this.schedules.map((schedule: Schedule) =>
        schedule.id == this.editingId ? { ...this.schedule } : schedule
      )
      this.schedule = { ...SCHEDULE, day: this.day }
      this.editingId = null
    },
    cancelEdit() {
      this.schedule = { ...SCHEDULE, day: this.day }
      this.editingId = null
    },
    confirmDelete(id: number) {
      this.pendingDeleteId = id
    },
    dismissDelete() {
      this.pendingDeleteId = null
    },
    toggleModal() {
      this.showModal = !this.showModal
    },
    setDay(day: string) {
      this.day = day
      this.editingId = null
      this.pendingDeleteId = null
      this.schedule = { ...SCHEDULE, day }
    },
    hasSchedules(dayId: string): boolean {
      return this.schedules.find((schedule: Schedule) => schedule.day == dayId)
        ? true
        : false
    },
    setNotification(show: Partial<INotification>) {
      this.notification = { ...this.notification, ...show }
      clearTimeout(notificationTimeout)
      if (show.close && show.hasVisible) {
        notificationTimeout = setTimeout(() => {
          this.notification = { ...this.notification, hasVisible: false }
        }, NOTIFICATION_AUTO_DISMISS_MS)
      }
    }
  },
  getters: {
    getScheduler(): Schedule[] {
      const { returnDate } = useCheckScheduler()
      return this.schedules
        .filter((sched: Schedule) => sched.day == this.day)
        .sort((current: Schedule, prev: Schedule) => {
          if (returnDate(current.from) > returnDate(prev.from)) return 1
          if (returnDate(current.from) < returnDate(prev.from)) return -1
          return 0
        })
    }
  }
})

export default useSchedule
