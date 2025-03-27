import { ArticleIcon } from "../../icons/article"
import { AudioIcon } from "../../icons/audio"
import { DeleteIcon } from "../../icons/delete"
import { ImageIcon } from "../../icons/image"
import { MegaphoneIcon } from "../../icons/megaphone"
import { ShareIcon } from "../../icons/share"
import { TagIcon } from "../../icons/tag"
import { VideoIcon } from "../../icons/video"
import { Tag } from "./tag"

export const Card = ({item, deleteItem}) => {
    
    const getIcon = (type: string) => {
        switch (type) {
            case "video":
                return <VideoIcon />;
            case "audio":
                return <AudioIcon />;
            case "article":
                return <ArticleIcon />;
            case "image":
                return <ImageIcon />;
            case "tag":
                return <TagIcon />;
            case "social":
                return <MegaphoneIcon />;
            default:
                return null;
        }
    };
    
    const getDate = (date: string) => {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        return `${day}/${month}/${year}`
    }

    return <div className="flex-flex-col w-full h-fit rounded-xl shadow-xs border-2 px-3 pt-3 pb-2 border-slate-200 bg-slate-50">
        <div className="flex items-center">
            {getIcon(item.type)}
            <div className="flex-1 ml-2 mr-1">
                {item.title}
            </div>
            <div className="flex gap-x-3">
                <div className="w-fit h-fit cursor-pointer">
                    <ShareIcon/>
                </div>
                {deleteItem ? <div className="w-fit h-fit cursor-pointer"
                    onClick={() => deleteItem(item._id)}>
                    <DeleteIcon/>
                </div>  :null}
            </div>
        </div>
        <div className="flex flex-wrap gap-1 mx-0 mt-4 h-fit">
            {item.tags.map( (sub,index) => (
                <Tag key={index} tagName={sub} deleteTag={null}/>
            ))}
        </div>
        <div className="flex mt-2 items-center">
            <div className="flex-1 text-xs">
                Added on : {item.createdAt ? getDate(item.createdAt) : "1/1/1"}
            </div>
            {/* <div className="w-fit h-fit text-tiny border rounded-lg py-0.5 px-1">Summarize</div> */}
        </div>
    </div>
}