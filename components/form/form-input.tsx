'use client'

import { useFormStatus } from 'react-dom'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import FormErrors from './form-errors'

interface FormInputProps {
    id: string
    label?: string
    description?: string
    step?: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    errors?: string | null
    classname?: string
    defaultValue?: string
    onBlur?: () => void
}

export const FormInput: React.FC<FormInputProps> = ({ label, type, id, classname, defaultValue, disabled, description,errors, onBlur, placeholder, required,step }) => {
    const { pending } = useFormStatus()

    return (
        <div className='space-y-2'>
            <div className='space-y-1'>
                {label ? (
                    <Label className='text-sm font-semibold' htmlFor={id}>
                        {label}
                    </Label>
                ) : null}
                <Input 
                type={type} 
                disabled={pending || disabled} 
                required={required} 
                id={id} 
                name={id} 
                step={step}
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
