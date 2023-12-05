"use server"

import prismadb from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { utapi } from "@/actions/ut-api";

type State = {
    message?: string
    success: boolean
}

export async function removeAttachment(attachmentId:string,courseId:string):Promise<State> {
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
        const attachment = await prismadb.attachment.delete({
            where:{
                courseId,
                id:attachmentId,
            }
        })
        await utapi.deleteFiles(attachment.url.split("/")[attachment.url.split("/").length-1]);
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