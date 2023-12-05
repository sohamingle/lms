'use client'
 
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface FormButtonProps {
    label: string
    type: "button" | "submit" | "reset"
    onClick?: () => void
    classname?: string
}

export const FormButton:React.FC<FormButtonProps> = ({label,type,onClick,classname}) => {
  const { pending } = useFormStatus()
 
  return (
    <Button type={type} className={cn(classname)} onClick={onClick} disabled={pending}>
      {label}
    </Button>
  )
}