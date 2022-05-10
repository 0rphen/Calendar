import useMonthStore from '../store/month.store'
import useSchedule from '../store/schedules.store'
import getDay from "../../../utils/getDay"
import IDay from '../../../interfaces/day.interface'

const useMoth = () => {
  const { setDays } = useMonthStore()
  const date = new Date()
  const month = date.getMonth()
  const { hasSchedules } = useSchedule()
  const emptyDays = new Date(date.getFullYear(), month).getDay()
  const lastDay = new Date(date.getFullYear(), month + 1, 0)
  function initDays() {
    const days: IDay[] = Array.from(Array(lastDay.getDate()).keys())
      .map(day => {
        day += 1
        return {
          id: getDay(day),
          day: (day).toString(),
          schedules: hasSchedules(getDay(day))
        } as IDay
      })
    setDays(days)
  }
  return {
    emptyDays,
    initDays
  }
}

export default useMoth
