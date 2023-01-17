import Schedule from "../interfaces/schedule.interface"
import getDay from "../utils/getDay"

const day = getDay()
const SCHEDULES: Schedule[] = [
  { id: 1, from: '7:00', title: 'Meeting', description: 'Doctor meeting', to: '8:00', day },
  { id: 2, from: '9:30', title: 'Meeting', description: 'Daily Frontend', to: '10:00', day },
  { id: 3, from: '12:00', title: 'Lunch', description: 'Lunch with Cate', to: '13:00', day },
  { id: 4, from: '18:00', title: 'Date', description: 'Go to cinema', to: '20:00', day }
]

export default SCHEDULES
