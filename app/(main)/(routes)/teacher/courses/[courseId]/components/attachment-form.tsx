"use client"

import { Button } from "@/components/ui/button";
import { File, Flag, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import FileUpload from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";
import { addAttachment } from "@/actions/add-attachment";
import { removeAttachment } from "@/actions/remove-attachment";

interface AttachmentFormProps {
    initialData: Course & {
        attachments: Attachment[]
    }
    courseId: string
}

const AttachmentForm: React.FC<AttachmentFormProps> = ({ courseId, initialData }) => {

    const onSubmit = async (url: string) => {
        const res = await addAttachment(url, courseId)
        if (!res.success) {
            toast.error(res.message!)
        } else {
            toast.success("File added")
            setIsEditing(false)
        }
    }

    const onRemove = async (id: string) => {
        setDeletingId(id)
        const res = await removeAttachment(id, courseId)
        if (!res.success) {
            toast.error(res.message!)
            setDeletingId(null)

        } else {
            toast.success("File removed")
            setDeletingId(null)
        }
    }
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button onClick={() => setIsEditing(prev => !prev)} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <div>
                    {!initialData.attachments[0] ?
                        <div className="text-sm mt-2 italic text-slate-500">
                            No attachments found
                        </div>
                        :
                        <div className="space-y-2 mt-2">
                            {initialData.attachments.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                                    <div className="flex items-center">
                                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <p className="text-xs line-clamp-1">{item.name}</p>
                                    </div>
                                    {deletingId === item.id ?
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        </div>
                                        :
                                        <button className="hover:opacity-75 transition" onClick={() => onRemove(item.id)}>
                                            <Trash2 className="text-red-600 h-4 w-4 mr-2" />
                                        </button>}
                                </div>
                            ))}
                        </div>}
                </div>
            ) : (
                <div>
                    <FileUpload onChange={(url) => {
                        if (url) {
                            onSubmit(url)
                        }
                    }} endpoint={"courseAttachment"} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttachmentForm;