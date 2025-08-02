import { useState, useRef, useEffect } from "react"
import { Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EditableFieldProps {
  label?: string
  value: string | null | undefined
  onSave: (newValue: string) => Promise<void>
  type?: "text" | "email" | "textarea" | "select" | "date"
  selectOptions?: readonly string[]
  placeholder?: string
  className?: string
  viewClassName?: string
  children?: React.ReactNode
}

export function EditableField({
  label,
  value,
  onSave,
  type = "text",
  selectOptions,
  placeholder,
  className,
  viewClassName,
  children,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value || "")
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type !== 'textarea' && inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleSave = async () => {
    setIsEditing(false)
    if (currentValue !== (value || "")) {
      await onSave(currentValue)
    }
  }

  const handleCancel = () => {
    setCurrentValue(value || "")
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== 'textarea') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      handleCancel()
    }
  }

  const renderInput = () => {
    const commonProps = {
      className: cn("focus-visible:ring-0 focus-visible:ring-offset-0", className)
    }
    switch (type) {
      case "select":
        return (
          <Select
            value={currentValue}
            onValueChange={async (val) => {
              setCurrentValue(val)
              setIsEditing(false)
              if (val !== (value || "")) {
                await onSave(val)
              }
            }}
            onOpenChange={(open) => { if (!open) setIsEditing(false) }}
            defaultOpen={true}
          >
            <SelectTrigger className={cn("h-9", commonProps.className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions?.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        )
      case "textarea":
        return (
          <Textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("h-24", commonProps.className)}
          />
        )
      default:
        return (
          <Input
            ref={inputRef as React.Ref<HTMLInputElement>}
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("h-9", commonProps.className)}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
      {isEditing ? (
        renderInput()
      ) : (
        <div
          className={cn("group flex items-center justify-between min-h-[36px] p-2 rounded-md hover:bg-muted/50 cursor-text", viewClassName)}
          onClick={() => setIsEditing(true)}
        >
          <div className="text-sm flex-grow">
            {children ? children : (value || <span className="text-muted-foreground italic">Not set</span>)}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}