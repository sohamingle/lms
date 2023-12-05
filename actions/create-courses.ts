"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
    success:boolean
}

export async function createCourse(prevState:State,formData:FormData):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false
        }
    }

    const validatedFields = CreateCourse.safeParse({
        title: formData.get("title"),
    })

    if(!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message:"Missing Fields",
            success:false
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
            success:false
        }
    }

    let course

    try{
        course = await prismadb.course.create({
            data:{
                userId,
                title
            }
        })
    }catch(error){
        return{
            message:"Database Error",
            success:false
        }
    }
    revalidatePath('/teacher/create')
    redirect(`/teacher/courses/${course.id}`)
}
