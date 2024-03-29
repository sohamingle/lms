import { IconBadge } from "@/components/icon-badge";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { File, IndianRupee, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./components/title-form";
import DescriptionForm from "./components/description-form";
import ImageForm from "./components/image-form.tsx";
import CategoryForm from "./components/category-form";
import PriceForm from "./components/price-form";
import AttachmentForm from "./components/attachment-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = auth()
    if (!userId) {
        redirect('/')
    }
    const course = await prismadb.course.findFirst({
        where: {
            userId,
            id: params.courseId
        },
        include:{
            attachments:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }
    })

    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    if (!course) {
        redirect('/')
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id} options={categories.map(category => ({
                        label: category.name,
                        value: category.id
                    }))} />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Course chapters
                            </h2>
                            <div>
                                TODO: Chapters
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={IndianRupee} />
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={File} />
                        <h2 className="text-xl">
                            Resources and Attachments
                        </h2>
                    </div>
                    <AttachmentForm initialData={course} courseId={course.id} />
                </div>
            </div>
        </div>
    );
}

export default CourseIdPage;