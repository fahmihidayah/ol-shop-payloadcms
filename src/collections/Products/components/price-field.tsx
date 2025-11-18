'use client'
import { FieldLabel, TextField, TextInput, useField, useForm } from '@payloadcms/ui'
import { ClientFieldProps, TextFieldClientComponent, TextFieldClientProps } from 'payload'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

export const PriceField = ({ path, field, readOnly, ...props }: TextFieldClientProps) => {
  const { value, setValue } = useField<string>({ path: path || field.name })
  const [displayValue, setDisplayValue] = useState('')
  const { label } = field
  // Format number to price format (000.000.000)
  const formatPrice = (num: string | number): string => {
    if (!num && num !== 0) return ''

    // Remove all non-digits
    const numStr = String(num).replace(/\D/g, '')
    if (!numStr) return ''

    // Add thousand separators (dots)
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Remove formatting to get raw number
  const unformatPrice = (formatted: string): string => {
    return formatted.replace(/\./g, '')
  }

  // Update display value when field value changes
  useEffect(() => {
    setDisplayValue(formatPrice(value || ''))
  }, [value])

  // Handle input change
  const handleChange = useCallback(
    (newValue: string) => {
      // Remove all dots (thousand separators)
      const rawValue = unformatPrice(newValue)

      // Only allow numbers
      if (rawValue && !/^\d+$/.test(rawValue)) {
        return
      }

      // Update display with formatted value
      setDisplayValue(formatPrice(rawValue))

      // Save raw numeric value
      setValue(rawValue)
    },
    [setValue],
  )

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
      </div>
      <TextInput
        value={displayValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleChange(e.target.value)
        }}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
      />
    </div>
  )
}

export default PriceField
