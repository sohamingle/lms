"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

export type State = {
    message?: string | null
    success:boolean,
}

export async function updateCategory(category:string,courseId:string):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false,
        }
    }

    let course

    try{
        course = await prismadb.course.update({
            where:{
                userId,
                id:courseId
            },
            data:{
                userId,
                categoryId:category
            }
        })
    }catch(error){
        return{
            message:"Database Error",
            success:false,
        }
    }
    revalidatePath(`/teacher/courses/${course.id}`)
    return{
        success:true,
    }
    
}
