'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import FormErrors from './form-errors'
import { Textarea } from '../ui/textarea'

interface FormTextareaProps {
    id: string
    label?: string
    description?: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    errors?: string | null
    classname?: string
    defaultValue?: string
    onBlur?: () => void
}

export const FormTextarea: React.FC<FormTextareaProps> = ({label, id, classname, defaultValue, disabled, description,errors, onBlur, placeholder, required }) => {
    const { pending } = useFormStatus()

    return (
        <div className='space-y-2'>
            <div className='space-y-1'>
                {label ? (
                    <Label className='text-sm font-semibold' htmlFor={id}>
                        {label}
                    </Label>
                ) : null}
                <Textarea 
                disabled={pending || disabled} 
                required={required} 
                id={id} 
                name={id} 
                defaultValue={defaultValue} 
                placeholder={placeholder} 
                className={cn(classname)}
                onBlur={onBlur}
                aria-describedby={`${id}-error`}
                />
                {description ? <Label className='text-sm text-slate-600'>{description}</Label>:null}
                <FormErrors
                id={id}
                errors={errors}
                />
            </div>
        </div>
    )
}