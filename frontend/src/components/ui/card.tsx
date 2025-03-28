import { useContext, useEffect, useRef, useState } from "react"
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
import { PlusIcon } from "../../icons/plus"
import { AlertContext } from "../../context/alert"

export const Card = ({item, deleteItem}) => {
    
    const customAlert = useContext(AlertContext);
    if(!customAlert) {
        throw new Error("Add AlertProvider");
    }
    const [updatedTitle, setUpdatedTitle] = useState(item.title);
    const [tagsArray, setTagsArray] = useState(item.tags)
    const tagInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const contentMutation = useMutation({
        mutationFn: updateContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            customAlert.setMessage("Content Updated Successfully");
            customAlert.setVariant("success");
            customAlert.setShowAlert(true);
        },
        onError: () => {
            customAlert.setMessage("Error Updating Content");
            customAlert.setVariant("error");
            customAlert.setShowAlert(true);
        }
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

    function handleAddTags() {
        if(tagInputRef.current?.value === null || tagInputRef.current?.value === undefined) {
            return;
        }
        if(tagInputRef.current?.value.trim() !== '') {
            setTagsArray( [...item.tags, tagInputRef.current.value]);
            tagInputRef.current.value='';
            handleBlurEvent();
        } else {
            return;
        }
    }

    function handleShareClick() {
        navigator.clipboard.writeText(item.link);
        alert("Link copied to Clipboard");
    }
    return <div className="flex-flex-col w-full h-fit rounded-xl shadow-xs border-2 p-2 border-slate-200 bg-slate-50">
        <div className="flex items-center">
            <div className="w-fit h-fit">{getIcon(item.type)}</div>
            
            <input  value={updatedTitle} 
                    onBlur={handleBlurEvent}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="text-sm w-full h-full ml-2 p-1 overflow-ellipsis focus:outline-slate-600"/>
            
            <div className="flex gap-x-2 w-auto h-full ml-1">
                <div className="w-fit h-fit cursor-pointer" onClick={handleShareClick}>
                    <ShareIcon/>
                </div>
                {deleteItem ? <div className="w-fit h-fit cursor-pointer"
                    onClick={() => deleteItem(item._id)}>
                    <DeleteIcon/>
                </div>  :null}
            </div>
        
        </div>
  
        <div className="flex flex-wrap gap-1 mx-0 mt-4 h-fit items-center">
            {tagsArray.map( (sub,index) => (
                <Tag key={index} tagName={sub} deleteTag={removeTag}/>
            ))}
            <div className="flex justify-between items-center w-16 border border-slate-300 pl-1 pr-0 py-0.5 rounded-xl hover:border-slate-400 focus-within:border-slate-400">
                <input ref={tagInputRef} placeholder="tag" className="mr-1 w-10 flex-1 border-none focus:border-none focus:outline-none text-xs "></input>
            <div className="w-fit h-fit hover:scale-110 cursor-pointer rounded-full bg-slate-200 " onClick={handleAddTags}><PlusIcon size="xs"/></div>
        </div>
        </div>
        
        <div className="flex mt-3 items-center">
            <div className="flex-1 text-xs">
                Added on : {item.createdAt ? getDate(item.createdAt) : "1/1/1"}
            </div>
            {/* <div className="w-fit h-fit text-tiny border rounded-lg py-0.5 px-1">Summarize</div> */}
        </div>
    </div>
}