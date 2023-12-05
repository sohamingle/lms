"use client"

import { updateCategory } from "@/actions/update-category";
import { FormButton } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

interface CategoryFormProps {
    initialData:Course,
    courseId:string
    options:{label:string, value:string}[]
}

const CategoryForm:React.FC<CategoryFormProps> = ({courseId,initialData,options})=> {
    const selectedOption = options.find(option => option.value === initialData.categoryId)
    const [isEditing,setIsEditing] = useState(false)
    const [category,setCategory] = useState<string>()
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Category
                <Button onClick={()=>setIsEditing(prev=>!prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ):(
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn("text-sm mt-2",!selectedOption && "italic text-slate-500")}>{selectedOption?.label || "No category selected"}</p>
            ):(
                <form className="space-y-4 mt-4" action={async()=>{
                    const res = await updateCategory(category!,courseId)
                    if(res.success){
                        toast.success("Categort updated")
                        setIsEditing(false)
                    }else{
                        toast.error(res.message!)
                    }
                    }}>
                    <Combobox options={options} value={category} onChange={(value)=>{setCategory(value)}}/>
                    <FormButton label={"Save"} type={"submit"}/>
                </form>
            )}
        </div>
    );
}

export default CategoryForm;