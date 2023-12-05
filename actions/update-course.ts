"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateCourse = z.object({
    title: z.string({
        required_error:"Title is required",
        invalid_type_error:"Title is invalid"
    }).min(3,{
        message:"Title is too short"
    })
})

export type State = {
    errors?:{
        title?: string[]
    },
    message?: string | null
    success:boolean,
    courseId:string
}

export async function updateCourse(prevState:State,formData:FormData):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false,
            courseId:prevState.courseId
        }
    }

    const validatedFields = CreateCourse.safeParse({
        title: formData.get("title"),
    })

    if(!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message:validatedFields.error.errors.find(err => err.path[0] === 'title')?.message,
            success:false,
            courseId:prevState.courseId
        }
    }

    const {title} = validatedFields.data

    const existingTitle = await prismadb.course.findFirst({
        where:{
            userId,
            title
        }
    })

    if(existingTitle){
        return{
            message:"Course already exists",
            success:false,
            courseId:prevState.courseId
        }
    }

    let course

    try{
        course = await prismadb.course.update({
            where:{
                userId,
                id:prevState.courseId
            },
            data:{
                userId,
                title
            }
        })
    }catch(error){
        return{
            message:"Database Error",
            success:false,
            courseId:prevState.courseId
        }
    }
    revalidatePath(`/teacher/courses/${course.id}`)
    return{
        success:true,
        courseId:course.id
    }
    
}
