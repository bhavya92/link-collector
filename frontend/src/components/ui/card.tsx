import { DeleteIcon } from "../../icons/delete"
import { ShareIcon } from "../../icons/share"
import { SummaryIcon } from "../../icons/summary"
import { VideoIcon } from "../../icons/video"
import { Tag } from "./tag"

export const Card = () => {
    return <div className="flex-flex-col w-80 h-fit rounded-sm shadow-md border-2 p-4 border-slate-200">
        <div className="flex items-center">
            <VideoIcon/>
            <div className="flex-1 ml-2">
                Title
            </div>
            <div className="flex gap-x-3">
                <div className="w-fit h-fit cursor-pointer">
                    <ShareIcon/>
                </div>
                <div className="w-fit h-fit cursor-pointer">
                    <DeleteIcon/>
                </div>
            </div>
        </div>
        <div className="">

        </div>
        <div className="flex flex-wrap gap-x-2">
            <Tag tagName="Study"/>
            <Tag tagName="Read"/>
            <Tag tagName="Interesting"/>
            <Tag tagName="Urgent"/>
        </div>
        <div className="flex">
            <div className="flex-1 text-xs">
                Added on : 15/3/2025
            </div>
            <SummaryIcon/>
        </div>
    </div>
}