"use client"

import { updateDescription } from "@/actions/update-description";
import { FormButton } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

interface DescriptionFormProps {
    initialData:{
        description:string | null,
    },
    courseId:string
}

const DescriptionForm:React.FC<DescriptionFormProps> = ({courseId,initialData})=> {
    const initialState = {
        message:null,
        errors:{},
        success:false,
        courseId
      }
      const [state, formAction] = useFormState(updateDescription, initialState)

    useEffect(()=>{
        if(state.success){
            toast.success("Title updated")
            setIsEditing(prev=>!prev)
        }
    },[state,formAction])
    const [isEditing,setIsEditing] = useState(false)
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Description
                <Button onClick={()=>setIsEditing(prev=>!prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ):(
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn("text-sm mt-2",!initialData.description && "italic text-slate-500")}>{initialData.description || "No description"}</p>
            ):(
                <form className="space-y-4 mt-4" action={formAction}>
                    <FormTextarea 
                    id={"description"} 
                    defaultValue={initialData.description||""} 
                    classname="mt-2" 
                    placeholder="e.g. 'This course is about...'" 
                    errors={state.message}/>
                    <FormButton label={"Save"} type={"submit"}/>
                </form>
            )}
        </div>
    );
}

export default DescriptionForm;