import INotification from '@/interfaces/notification.interface'
import Schedule from '@/interfaces/schedule.interface'

type State = {
  day: string
  schedule: Schedule
  showModal: boolean
  schedules: Schedule[]
  notification: INotification
}

export default State
