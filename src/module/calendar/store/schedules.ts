import { reactive } from "vue"
import { defineStore } from 'pinia'
import ISchedule from "../../../interfaces/schedule.interface"
import SCHEDULE from "../../../constants/schedule"

const useSchedule = defineStore('schedules', {
  state: () => ({
    schedule: { ...SCHEDULE },
    showModal: false,
    schedules: <ISchedule[]>[
      { id: 1, from: '7:00', title: 'Meeting', description: 'Doctor meeting', to: '8:00' },
      { id: 2, from: '9:30', title: 'Meeting', description: 'Daily Frontend', to: '10:00' },
      { id: 3, from: '12:00', title: 'Lunch', description: 'Lunch with Cate', to: '13:00' },
      { id: 4, from: '18:00', title: 'Date', description: 'Go to cinema', to: '20:00' }
    ]
  }),
  actions: {
    addSchedule() {
      this.schedules = [...this.schedules, this.schedule]
      this.schedule = { ...SCHEDULE }
    },
    removeSchedule(id: number) {
      this.schedules = reactive([...this.schedules.filter((schedule: ISchedule) => schedule.id != id)])
    },
    toggleModal() { this.showModal = !this.showModal }
  }
})  

export default useSchedule
