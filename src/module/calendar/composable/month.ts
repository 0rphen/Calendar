import useMonthStore from '../store/month'
import useSchedule from '../store/schedules'
import getDay from "../../../utils/getDay"
import IDay from '../../../interfaces/day.interface'
import MONTHS from '../../../constants/months'

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
  const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const monthName = MONTHS.at(month);
  return {
    emptyDays,
    dayName,
    initDays,
    monthName
  }
}

export default useMoth
