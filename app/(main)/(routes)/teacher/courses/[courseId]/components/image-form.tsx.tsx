"use client"

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from 'next/image';
import FileUpload from "@/components/file-upload";
import { updateImage } from "@/actions/update-image";

interface ImageFormProps {
    initialData: {
        imageUrl: string | null,
    },
    courseId: string
}



const ImageForm: React.FC<ImageFormProps> = ({ courseId, initialData }) => {

    const onSubmit = async (imageUrl: string) => {
        const res = await updateImage(imageUrl, courseId)
        if (!res.success) {
            toast.error(res.message!)
        } else {
            toast.success("Image updated")
            setIsEditing(false)
        }
    }

    const [isEditing, setIsEditing] = useState(false)
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={() => setIsEditing(prev => !prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            {initialData.imageUrl ?
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Image
                                </>
                                :
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add an Image
                                </>}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <div>
                    {!initialData.imageUrl ?
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                            <ImageIcon className="h-10 w-10 text-slate-500" />
                        </div>
                        :
                        <div className="relative aspect-video mt-2">
                            <Image
                                src={initialData.imageUrl}
                                alt=""
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>}
                </div>
            ) : (
                <div>
                    <FileUpload onChange={(url) => {
                        if (url) {
                            onSubmit(url)
                        }
                    }} endpoint={"courseImage"} />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageForm;