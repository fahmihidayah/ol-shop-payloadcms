'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface OrderNotesProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function OrderNotes({ value = '', onChange, placeholder }: OrderNotesProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Order Notes (Optional)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 px-4 pb-4">
        <Label htmlFor="order-notes" className="text-sm text-muted-foreground">
          Add any special instructions or comments for your order
        </Label>
        <Textarea
          id="order-notes"
          value={value}
          onChange={handleChange}
          placeholder={
            placeholder ||
            'e.g., Please call before delivery, Ring the doorbell twice, Leave at the front door...'
          }
          className="min-h-[100px] resize-none"
        />
        {value && (
          <p className="text-xs text-muted-foreground">
            {value.length} characters
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
