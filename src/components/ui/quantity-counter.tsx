'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from './button'

interface QuantityCounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantityCounter({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityCounterProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-md"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>

      <div className="flex h-8 w-12 sm:h-9 sm:w-14 items-center justify-center rounded-md border border-input bg-background text-sm sm:text-base font-medium">
        {value}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-md"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  )
}
