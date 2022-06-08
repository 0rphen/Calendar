import { defineStore } from 'pinia'
import IDay from '../../../interfaces/day.interface'
import Month from '../../../types/Month.type'
import MONTHS from '../../../constants/months.constant'
import useSchedule from '../store/schedules.store'
import getDay from "../../../utils/getDay"

const useMonthStore = defineStore('month', {
  state: () => (<Month>{
    date: new Date(),
    months: [...MONTHS]
  }),
  actions: {
    nextDate() {
      this.date = new Date(this.date.getFullYear(), this.month + 1, this.date.getDate())
    },
    prevDate() {
      this.date = new Date(this.date.getFullYear(), this.month - 1, this.date.getDate())
    },
    getDayInfo(day: string): IDay {
      return this.getDays.find((d: IDay) => d.day == day) || {} as IDay
    },
    checkDay(dayId: string) {
      this.getDays.forEach(day => {
        if (day.id == dayId) day.schedules = true
      })
    }
  },
  getters: {
    month: (state: Month) => state.date.getMonth(),
    emptyDays(): any {
      return new Date(this.date.getFullYear(), this.month).getDay()
    },
    lastDay(): any {
      return new Date(this.date.getFullYear(), this.month + 1, 0)
    },
    monthName(): any {
      return this.months.at(this.month)
    },
    getDays(): IDay[] {
      const { hasSchedules } = useSchedule()
      return Array.from(Array(this.lastDay.getDate()).keys())
        .map(day => {
          day += 1
          return {
            id: getDay(day, this.date),
            day: (day).toString(),
            schedules: hasSchedules(getDay(day, this.date))
          } as IDay
        })
    }
  }
})

export default useMonthStore
