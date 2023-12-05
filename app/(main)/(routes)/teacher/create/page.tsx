"use client"

import { createCourse } from "@/actions/create-courses";
import { FormButton } from "@/components/form/form-button";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const CreatePage = () => {
    const initialState = {
        message:null,
        errors:{},
        success:false
      }
    const [state, formAction] = useFormState(createCourse, initialState)

    useEffect(()=>{
        if(state.success){
            toast.success("Course created successfully")
        }
    },[state])

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your course</h1>
                <p className="text-sm text-slate-600">What would you like to name your course? Don&apos;t worry, you can change this later.</p>
                <form action={formAction} className="space-y-8 mt-8">
                    <FormInput label="Course Title" description="What will you teach in this course?" placeholder="e.g. 'Advanced Web Development Course'"
                        id="title" required errors={state?.message}/>
                    <div className="flex items-center gap-x-2">
                        <Link href={'/'}>
                            <Button type="button" variant={"ghost"}>
                                Cancel
                            </Button>
                        </Link>
                        <FormButton label={"Continue"} type={"submit"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePage;