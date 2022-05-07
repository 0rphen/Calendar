import { defineStore } from 'pinia'
import IDay from '../../../interfaces/day.interface'

const useMonthStore = defineStore('month', {
  state: () => ({
    date: new Date(),
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayName: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    days: [] as IDay[]
  }),
  actions: {
    nextDate() {
      this.date = new Date(this.date.getFullYear(), this.month + 1, this.date.getDate())
    },
    prevDate() {
      this.date = new Date(this.date.getFullYear(), this.month - 1, this.date.getDate())
    },
    getDayInfo(day: string): IDay {
      return this.days.find((d: IDay) => d.day == day) || {} as IDay
    },
    setDays(days: IDay[]) {
      this.days = [...days]
    },
    checkDay(dayId: string) {
      this.days.forEach(day => {
        if (day.id == dayId) day.schedules = true
      })
    }
  },
  getters: {
    month: (state) => state.date.getMonth(),
    emptyDays(): any {
      return new Date(this.date.getFullYear(), this.month).getDay()
    },
    lastDay(): any {
      return new Date(this.date.getFullYear(), this.month + 1, 0)
    },
    monthName(): any {
      return this.months.at(this.month)
    }
  }
})

export default useMonthStore
