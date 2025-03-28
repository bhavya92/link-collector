import { useQuery } from "@tanstack/react-query"
import { Content, getTagContent, getTags, Tags } from "../../services/content"
import { Tag } from "../ui/tag"
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { SkeletonLoader } from "../ui/loaders/cardSkeletonLoader";
import { TagsSLoader } from "../ui/loaders/tagSkeletonLoader";

export const TagsContent = () => {
    const [tagId, setTagId] = useState(null);
    const tagQuery = useQuery<Tags[]>({
        queryKey:['tags'],
        queryFn: getTags
    });

    const contentQuery = useQuery<Content[]>({
        queryKey:['tagContents',tagId],
        enabled:false,
        queryFn : ({ queryKey }) => getTagContent({ queryKey } as { queryKey: [string, string] }),
    });

    useEffect(() => {
        if(tagId === null || tagId === undefined) {
            return;
        }        
        contentQuery.refetch();
    },[tagId, contentQuery])


    return <div className="flex-col tb:flex tb:flex-row overflow-y-auto tb:overflow-hidden w-full h-full">
        <div className="h-fit mt-2 w-full tb:w-44 flex flex-wrap overflow-y-auto overflow-x-hidden gap-2 items-start">
            {tagQuery.isLoading ? <TagsSLoader/> : null}
            {tagQuery.error ? <div>Error fetching data</div> : null}
            {tagQuery.data?.map((item) => (
                <div className={`w-fit h-fit cursor-pointer ${tagId==item._id ? 'bg-slate-200' : ''} rounded-xl`} key={item._id}>
                    <Tag key={item._id} tagName={item.title} deleteTag={null} id={item._id} setTagId={setTagId}/>
                </div>
            ))}
        </div>
        <div className="w-full tb:w-fit h-fit tb:h-full my-2 tb:ml-4 border border-slate-300"/>
        <div className="flex-1 h-full tb:pl-6 tb:overflow-y-auto flex flex-col">
            {contentQuery.error ? <div>Error fetching data</div> : null}
            {contentQuery.data !== undefined && contentQuery.data?.length > 0 ? 
            <div className="tb:h-full w-full columns-1 tb:columns-2 ls:columns-4 ll:columns-6 4k:columns-5 gap-4 pb-20">
                {contentQuery.data?.map((item) => (
                    <div className="mb-4 w-full break-inside-avoid">
                        <Card key={item._id} item= {item} deleteItem={null}/>
                    </div>
                ))}
            </div>  
            : 
            <div className="flex text-xl items-center justify-center">
                {contentQuery.isLoading ? <SkeletonLoader/> : <div>Click on a Tag Name</div>} 
            </div>} 
        </div>
    </div>
}