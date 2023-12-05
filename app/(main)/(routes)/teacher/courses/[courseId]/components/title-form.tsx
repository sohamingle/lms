"use client"

import { updateCourse } from "@/actions/update-course";
import { FormButton } from "@/components/form/form-button";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

interface TitleFormProps {
    initialData:{
        title:string
    },
    courseId:string
}

const TitleForm:React.FC<TitleFormProps> = ({courseId,initialData}) => {
    const initialState = {
        message:null,
        errors:{},
        success:false,
        courseId
      }
      const [state, formAction] = useFormState(updateCourse, initialState)

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
                Course title
                <Button onClick={()=>setIsEditing(prev=>!prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ):(
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className="text-sm mt-2">{initialData.title}</p>
            ):(
                <form className="space-y-4 mt-4" action={formAction}>
                    <FormInput id={"title"} defaultValue={initialData.title} classname="max-w-sm mt-2" placeholder="e.g. 'Advanced Web Development Course'" errors={state.message}/>
                    <FormButton label={"Save"} type={"submit"}/>
                </form>
            )}
        </div>
    );
}

export default TitleForm;