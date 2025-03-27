import { CloseIcon } from "../../icons/close"

interface Tag {
    tagName : string;
    deleteTag : Function | null;
    id? : string;
    setTagId? : Function;
}

export const Tag = ({tagName, deleteTag, id, setTagId} : Tag) => {
  
    return <div className={`relative transition-all duration-200 group flex items-center justify-center px-2 py-0.5 text-xs text-slate-600 w-fit h-fit rounded-xl border border-slate-300 `} 
    onClick={() => setTagId && setTagId(id)}>
        <div className="w-full">{tagName}</div>
        {deleteTag ? <div className="absolute right-0 transition-all duration-200 ml-1 z-10 rounded-full opacity-0 h-fit invisible group-hover:opacity-100 group-hover:visible bg-slate-200 p-0.5 cursor-pointer"
            onClick={() => deleteTag(tagName)}
        >
            <CloseIcon/>
        </div> : null}
    </div>
}