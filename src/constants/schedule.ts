import ISchedule from "../interfaces/schedule.interface"
import getDay from '../utils/getDay'

const SCHEDULE: ISchedule = {
  from: '',
  to: '',
  description: '',
  title: '',
  day: getDay()
} as ISchedule

export default SCHEDULE
