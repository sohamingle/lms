"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { utapi } from "./ut-api"

type State = {
    message?: string
    success: boolean
}

export async function updateImage(imageUrl:string,courseId:string):Promise<State> {
    const {userId} = auth()

    if(!userId){
        return {
            message:"Unauthorized",
            success:false,
        }
    }

    const courseOwner = await prismadb.course.findFirst({
        where:{
            id:courseId,
            userId
        }
    })

    if(!courseOwner){
        return{
            message:"Course is owned by someone else",
            success:false,
        }
    }

    try{
        const oldImage = await prismadb.course.findFirst({
            where:{
                userId,
                id:courseId
            }
        })
        if(oldImage?.imageUrl){
            await utapi.deleteFiles(oldImage.imageUrl.split("/")[oldImage.imageUrl.split("/").length-1]);
        }
        const course = await prismadb.course.update({
            where:{
                userId,
                id:courseId
            },
            data:{
                userId,
                imageUrl
            }
        })
    }catch(error){
        return{
            success:false,
            message:"Database Error"
        }
    }
    revalidatePath(`/teacher/courses/${courseId}`)
    return{
        success:true,
    }
    
}