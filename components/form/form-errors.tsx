import { XCircleIcon } from "lucide-react";

interface FormErrorsProps{
    id: string
    errors?: string | null
}

const FormErrors:React.FC<FormErrorsProps
> = ({id,errors}) => {
    if(!errors){
        return null
    }
    return (
        <div
        id={`${id}-error`}
        aria-live="polite"
        className="mt-2 text-xs text-rose-500"
        >
                <div className="flex items-center font-medium p-2">
                    <XCircleIcon className="h-4 w-4 mr-2"/>
                    {errors}
                </div>
        </div>
    );
}

export default FormErrors;