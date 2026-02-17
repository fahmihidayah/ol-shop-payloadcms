'use server'

import { ServiceContext } from '@/types/service-context'
import { LoginFormSchema } from '../types/login-form-schema'
import { ServiceResult } from '@/types/service-result'

type Props = {
  data: LoginFormSchema
  serviceContext: ServiceContext
}

export const loginService = async (props: Props): Promise<ServiceResult<any>> => {
  const result = await props.serviceContext.payload.login({
    collection: 'customers',
    data: {
      email: props.data.email,
      password: `${props.data.password}`,
    },
  })
  return {
    data: result,
    error: false,
  }
}
