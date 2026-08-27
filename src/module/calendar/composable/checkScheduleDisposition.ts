import useSchedule from '../store/schedules.store'
import { Schedule } from '@/interfaces'

const DATE = '01/01/1999 '

const useCheckDisposition = () => {
  const hasTime = (from: string, to: string, ignoreId?: number): boolean => {
    const { getScheduler: schedules } = useSchedule()
    const new_from = returnDate(from)
    const new_to = returnDate(to)
    let hasDisponibility = true
    if (from == '' || to == '') return hasDisponibility
    schedules.forEach((s: Schedule) => {
      if (s.id == ignoreId) return
      const sFrom = returnDate(s.from)
      const sTo = returnDate(s.to)
      if (sTo > new_from && sFrom < new_to) hasDisponibility = false
    })
    return hasDisponibility
  }

  const returnDate = (date: string) => Date.parse(DATE + date)
  return { hasTime, returnDate }
}

export default useCheckDisposition
