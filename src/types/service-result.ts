export type ServiceResult<T> = {
  data?: T
  error?: boolean
  errorMessage?: Record<string, string>
  message?: string
}
