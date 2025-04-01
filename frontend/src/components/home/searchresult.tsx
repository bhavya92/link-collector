import { useSearchParams } from "react-router-dom"
import { SkeletonLoader } from "../ui/loaders/cardSkeletonLoader";
import { Card } from "../ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AlertContext } from "../../context/alert";
import { Content, deleteContent, getSearchResults } from "../../services/content";

export const SearhResult = () => {
    const [ searchParams ] = useSearchParams();
    let keyword = searchParams.get("keyword");
    if (keyword === null)
            keyword = ''
    const queryClient = useQueryClient();

    const customAlert = useContext(AlertContext);
    if(!customAlert) {
        throw new Error("Add AlertProvider")
    }
    
    const {data, error, isLoading } = useQuery<Content[]>({
        queryKey:['search_results',keyword],
        queryFn: () => getSearchResults(keyword),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['contents']})
            queryClient.invalidateQueries({queryKey:['search_results']})
            customAlert.setMessage("Content deleted");
            customAlert.setVariant("success");
            customAlert.setShowAlert(true);
        },
        onError: () => {
            customAlert.setMessage("Error deleting content");
            customAlert.setVariant("error");
            customAlert.setShowAlert(true);
        }
    });

    function deleteItem(id: string)  {
        deleteMutation.mutate(id);
    }

    if(isLoading) return <SkeletonLoader/>
    if(error) return <h1>Error</h1>
    return <div className="w-full h-full overflow-y-auto flex flex-col pr-6">
        <div className="text-sm font-mono mb-2">Showing results : {keyword}</div>
        {Array.isArray(data) && data?.length > 0 && data !== undefined ? 
        <div className="columns-1 tb:columns-2 ls:columns-4 ll:columns-6 4k:columns-5 gap-x-3 pb-20">
            {data?.map((item) => (
                <div key={item._id} className="mb-2 w-full break-inside-avoid">
                    <Card key={item._id} item= {item} deleteItem={deleteItem}/>
                </div>
            ))}
        </div>  
        : 
        <div className="flex text-xl items-center justify-center">
            Nothing Found. 
        </div>}
        
    </div>
}