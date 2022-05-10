import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

import useSchedule from '../store/schedules.store'
import useCheckDisposition from '../composable/checkScheduleDisposition'

const useForm = () => {
  const { schedule } = storeToRefs(useSchedule())
  const { returnDate, hasTime } = useCheckDisposition()

  const validations = reactive({
    description: { required, minLength: minLength(5) },
    from: { required },
    title: { required, minLength: minLength(3) },
    to: {
      required,
      minValue(val: any, { from }: any) { return returnDate(val) > returnDate(from) },
      hasTime(to: any, { from }: any) { return hasTime(from, to) }
    }
  })
  const v$ = useVuelidate(validations, schedule)
  return { v$ }
}

export default useForm
