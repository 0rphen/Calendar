import Schedule from '../interfaces/schedule.interface'

type State = {
  day: string
  schedule: Schedule
  showModal: boolean
  schedules: Schedule[]
  showNotification: boolean
}

export default State
