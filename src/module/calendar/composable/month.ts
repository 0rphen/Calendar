import { storeToRefs } from 'pinia'
import useMonthStore from '../store/month.store'
import useSchedule from '../store/schedules.store'
import getDay from "../../../utils/getDay"
import IDay from '../../../interfaces/day.interface'

const useMoth = () => {
  const { setDays, nextDate, prevDate } = useMonthStore()
  const { lastDay, emptyDays, date } = storeToRefs(useMonthStore())
  const { hasSchedules } = useSchedule()
  function initDays() {
    const days: IDay[] = Array.from(Array(lastDay.value.getDate()).keys())
      .map(day => {
        day += 1
        return {
          id: getDay(day, date.value),
          day: (day).toString(),
          schedules: hasSchedules(getDay(day, date.value))
        } as IDay
      })
    setDays(days)
  }
  const nDate = () => {
    nextDate()
    initDays()
  }
  const pDate = () => {
    prevDate()
    initDays()
  }
  return {
    emptyDays,
    initDays,
    nDate,
    pDate
  }
}

export default useMoth
