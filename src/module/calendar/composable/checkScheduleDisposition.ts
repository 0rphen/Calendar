import useSchedule from "../store/schedules"

const useCheckDisposition = () => {
  const { getScheduler: schedules } = useSchedule()

  function checkTime(from: string, to: string) {

  }
  return { checkTime }
}

export default useCheckDisposition
