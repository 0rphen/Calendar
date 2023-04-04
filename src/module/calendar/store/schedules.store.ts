import { reactive } from 'vue'
import { defineStore } from 'pinia'
import Schedule from '../../../interfaces/schedule.interface'
import State from '../../../types/State.type'
import SCHEDULE from '../../../constants/schedule.constant'
import SCHEDULES from '../../../constants/schedules.constant'
import getDay from '../../../utils/getDay'
import useCheckScheduler from '../composable/checkScheduleDisposition'

const day = getDay()

const useSchedule = defineStore('schedules', {
  state: () =>
    <State>{
      day,
      schedule: { ...SCHEDULE },
      showModal: false,
      schedules: [...SCHEDULES]
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
      this.schedules = reactive([
        ...this.schedules.filter((schedule: Schedule) => schedule.id != id)
      ])
    },
    toggleModal() {
      this.showModal = !this.showModal
    },
    setDay(day: string) {
      this.day = day
    },
    hasSchedules(dayId: string): boolean {
      return this.schedules.find((schedule: Schedule) => schedule.day == dayId)
        ? true
        : false
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
