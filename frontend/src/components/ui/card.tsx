import { useEffect, useRef, useState } from "react"
import { ArticleIcon } from "../../icons/article"
import { AudioIcon } from "../../icons/audio"
import { DeleteIcon } from "../../icons/delete"
import { ImageIcon } from "../../icons/image"
import { MegaphoneIcon } from "../../icons/megaphone"
import { ShareIcon } from "../../icons/share"
import { TagIcon } from "../../icons/tag"
import { VideoIcon } from "../../icons/video"
import { Tag } from "./tag"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateContent } from "../../services/content"

export const Card = ({item, deleteItem}) => {
    
    const [updatedTitle, setUpdatedTitle] = useState(item.title);
    const [tagsArray, setTagsArray] = useState(item.tags)

    const queryClient = useQueryClient();
    const contentMutation = useMutation({
        mutationFn: updateContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
    
    useEffect(()=>{
        handleBlurEvent();
    },[tagsArray])

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

    function removeTag(tagName: string){
        setTagsArray(item.tags.filter(tag => tag !== tagName));
    }

    function handleBlurEvent(){
        if(item.title === updatedTitle && item.tags.length === tagsArray.length)
        return;
        contentMutation.mutate({"contentId":item._id,"newTags":tagsArray,"title":updatedTitle })
    }

    return <div className="flex-flex-col w-full h-fit rounded-xl shadow-xs border-2 p-2 border-slate-200 bg-slate-50">
        <div className="flex items-center">
            <div className="w-fit h-fit">{getIcon(item.type)}</div>
            
            <input  value={updatedTitle} 
                    onBlur={handleBlurEvent}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="text-sm w-full h-full ml-2 p-1 overflow-ellipsis focus:outline-slate-600"/>
            
            <div className="flex gap-x-2 w-auto h-full ml-1">
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
            {tagsArray.map( (sub,index) => (
                <Tag key={index} tagName={sub} deleteTag={removeTag}/>
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