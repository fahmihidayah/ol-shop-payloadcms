'use client'

import { ClientComponentProps, RowLabelComponent } from 'payload'

import { useForm, useRowLabel } from '@payloadcms/ui'

interface CustomProps {
  labelPrefix?: string
}
export default function RowLabel(props: ClientComponentProps & CustomProps) {
  const { data } = useRowLabel<Record<string, any>>() // 👈 reactive hook, updates when data changes

  const { labelPrefix = 'title' } = props

  // Safely get the value based on labelPrefix (e.g. data['variant'])
  const value = data?.[labelPrefix] || data?.title || 'Untitled'

  console.log('prefix ', JSON.stringify(props))
  return <div id="custom-array-row-label">{value}</div>
}
