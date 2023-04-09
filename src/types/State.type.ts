import { INotification, Schedule } from '@/interfaces'

type State = {
  day: string
  schedule: Schedule
  showModal: boolean
  schedules: Schedule[]
  notification: INotification
}

export default State
