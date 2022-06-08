import ISchedule from "../interfaces/schedule.interface"

type State = {
  day: string,
  schedule: ISchedule,
  showModal: boolean,
  schedules: ISchedule[]
}

export default State
