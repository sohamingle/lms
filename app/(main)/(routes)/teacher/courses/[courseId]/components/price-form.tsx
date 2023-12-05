"use client"

import { updatePrice } from "@/actions/update-price";
import { FormButton } from "@/components/form/form-button";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

interface PriceFormProps {
    initialData:Course,
    courseId:string
}

const PriceForm:React.FC<PriceFormProps> = ({courseId,initialData})=> {
    const initialState = {
        message:null,
        errors:{},
        success:false,
        courseId
      }
      const [state, formAction] = useFormState(updatePrice, initialState)

    useEffect(()=>{
        if(state.success){
            toast.success("Price updated")
            setIsEditing(prev=>!prev)
        }
    },[state,formAction])
    const [isEditing,setIsEditing] = useState(false)
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button onClick={()=>setIsEditing(prev=>!prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ):(
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn("text-sm mt-2",!initialData.price && "italic text-slate-500")}>{initialData.price ? formatPrice(initialData.price) : "No price"}</p>
            ):(
                <form className="space-y-4 mt-4" action={formAction}>
                    <FormInput 
                    id={"price"} 
                    type="number"
                    step="0.01"
                    defaultValue={initialData.price?.toString() || undefined} 
                    classname="mt-2" 
                    placeholder="Set a price for your course" 
                    errors={state.message}/>
                    <FormButton label={"Save"} type={"submit"}/>
                </form>
            )}
        </div>
    );
}

export default PriceForm;