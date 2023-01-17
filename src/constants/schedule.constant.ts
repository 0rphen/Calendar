import Schedule from "../interfaces/schedule.interface"
import getDay from '../utils/getDay'

const SCHEDULE: Schedule = {
  from: '',
  to: '',
  description: '',
  title: '',
  day: getDay()
} as Schedule

export default SCHEDULE
