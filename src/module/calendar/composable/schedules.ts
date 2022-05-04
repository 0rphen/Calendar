import { reactive } from "vue"

const useSchedule = () => {
  let schedules = reactive([
    { id: 1, hour: '7:00', desc: 'Doctor meeting' },
    { id: 2, hour: '9:30', desc: 'Daily Frontend' },
    { id: 3, hour: '12:00', desc: 'Lunch with Cate' },
    { id: 4, hour: '18:00', desc: 'Go to cinema' }
  ])

  const addSchedule = (schedule: any) => {
    schedules = reactive([...schedules, schedule])
  }

  const removeSchedule = (id: number) => {
    schedules = reactive([...schedules.filter(schedule => schedule.id != id)])
  }

  return {
    schedules,
    addSchedule,
    removeSchedule
  }
}

export default useSchedule
