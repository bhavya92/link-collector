import { CloseIcon } from "../../icons/close"
import { PlusIcon } from "../../icons/plus"
import { Button } from "../ui/button"
import { InputField } from "../ui/input"
import { Tag } from "../ui/tag"

export const ContentModal = () => {
    return <div className="w-96 h-96 flex flex-col p-4 rounded-sm bg-slate-50 border-slate-200 border-2 shadow-sm">
        <div className="w-full h-fit flex justify-end">
            <div className="w-fit h-fit cursor-pointer"><CloseIcon/></div>
        </div>
        <div className="flex flex-col w-full h-fir gap-y-2 mt-3">
            <InputField label="Title" id="title" inputType="text" hint="Title" size="md"/>
            <InputField label="Link" id="link" inputType="text" hint="Link" size="md"/>
        </div>
        <div className="flex items-baseline w-full h-fit mt-3">
            <span className="mr-2 text-royal-blue-800 font-semibold">Type : Video</span>
            <div className="text-xs text-royal-blue-400 cursor-pointer hover:text-royal-blue-600">Edit</div>
        </div>
        <div className="flex flex-col w-full h-fit mt-4">
            <div className="flex w-full items-center">
                <span className="mr-2 text-royal-blue-800">Tags</span>
                <div className="hover:scale-110 cursor-pointer rounded-full bg-accent p-0.5"><PlusIcon size="xs"/></div>
            </div>
            <div className="flex flex-wrap w-full h-fit gap-x-2 mt-3">
                <Tag tagName="Study"/>
                <Tag tagName="Code"/>
                <Tag tagName="Coffee"/>
            </div>
        </div>
        <div className="flex flex-col w-full h-full items-center justify-end">
            <Button text="Save" size="md" variant="primary" />
        </div>
    </div>
}