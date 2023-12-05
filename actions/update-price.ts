"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateCourse = z.object({
    price: z.string({
        required_error:"Price is required",
        invalid_type_error:"Price is invalid"
    }).min(1,{
        message:"Price is required"
    })
})

export type State = {
    errors?:{
        price?: string[]
    },
    message?: string | null
    success:boolean,
    courseId:string
}

export async function updatePrice(prevState:State,formData:FormData):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false,
            courseId:prevState.courseId
        }
    }

    const validatedFields = CreateCourse.safeParse({
        price: formData.get("price"),
    })

    if(!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message:validatedFields.error.errors.find(err => err.path[0] === 'price')?.message,
            success:false,
            courseId:prevState.courseId
        }
    }

    const {price} = validatedFields.data

    let course

    try{
        course = await prismadb.course.update({
            where:{
                userId,
                id:prevState.courseId
            },
            data:{
                userId,
                price:parseFloat(price)
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
