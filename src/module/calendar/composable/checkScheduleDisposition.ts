import useSchedule from "../store/schedules.store"
import ISchedule from "../../../interfaces/schedule.interface"

const DATE = '01/01/1999 '

const useCheckDisposition = () => {

  const hasTime = (from: string, to: string): boolean => {
    const { getScheduler: schedules } = useSchedule()
    const new_from = returnDate(from)
    const new_to = returnDate(to)
    let hasDisponibility = true;
    if ((from == '' || to == '')) return hasDisponibility
    schedules.forEach((s: ISchedule) => {
      const sFrom = returnDate(s.from)
      const sTo = returnDate(s.to)
      if ((sFrom > new_from && sTo < new_from)
        || (sTo > new_from && sFrom < new_to)
        || (sFrom < new_from && sTo > new_to))
        hasDisponibility = false
    })
    return hasDisponibility
  }

  const returnDate = (date: string) => Date.parse(DATE + date)
  return { hasTime, returnDate }
}

export default useCheckDisposition
