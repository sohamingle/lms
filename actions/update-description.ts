"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const UpdateDescription = z.object({
    description: z.string({
        required_error:"Description is required",
        invalid_type_error:"Description is invalid"
    }).min(3,{
        message:"Description is too short"
    })
})

export type State = {
    errors?:{
        description?: string[]
    },
    message?: string | null
    success:boolean,
    courseId:string
}

export async function updateDescription(prevState:State,formData:FormData):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false,
            courseId:prevState.courseId
        }
    }

    const validatedFields = UpdateDescription.safeParse({
        description: formData.get("description"),
    })

    if(!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message:validatedFields.error.errors.find(err => err.path[0] === 'description')?.message,
            success:false,
            courseId:prevState.courseId
        }
    }

    const {description} = validatedFields.data

    const courseOwner = await prismadb.course.findFirst({
        where:{
            id:prevState.courseId,
            userId
        }
    })

    if(!courseOwner){
        return{
            message:"Course is owned by someone else",
            success:false,
            courseId:prevState.courseId
        }
    }

    try{
        const course = await prismadb.course.update({
            where:{
                userId,
                id:prevState.courseId
            },
            data:{
                userId,
                description
            }
        })
    }catch(error){
        return{
            message:"Database Error",
            success:false,
            courseId:prevState.courseId
        }
    }
    revalidatePath(`/teacher/courses/${prevState.courseId}`)
    return{
        success:true,
        courseId:prevState.courseId
    }
    
}
