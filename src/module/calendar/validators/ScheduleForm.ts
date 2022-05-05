import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

import useSchedule from '../store/schedules'

const useForm = () => {
  const { schedule } = storeToRefs(useSchedule())
  const validations = reactive({
    description: { required, minLength: minLength(5) },
    from: { required },
    title: { required, minLength: minLength(3) },
    to: { required }
  })
  const v$ = useVuelidate(validations, schedule)
  return { v$ }
}

export default useForm
