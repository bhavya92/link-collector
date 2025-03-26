import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Content, deleteContent, fetchContent } from "../../services/content";
import { Card } from "../ui/card";

export const DisplayContent = ({ type }: { type: string }) => {

    const queryClient = useQueryClient();

    const {data, error, isLoading, isSuccess } = useQuery<Content[]>({
        queryKey:['contents',type],
        queryFn: ({ queryKey }) => fetchContent({ queryKey } as { queryKey: [string, string] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['contents']})
        },
    });

    function deleteItem(id: string)  {
        deleteMutation.mutate(id);
    }

    // if(isSuccess) {
    //     const fc = data.filter((_,index) => index%3 == 0);
    //     const fc = data.filter((_,index) => index%3 == 0);
    //     const fc = data.filter((_,index) => index%3 == 0);
    // }

    if(isLoading) return <h1>Loading bitch...</h1>
    if(error) return <h1>Error</h1>
    return <div className="w-full h-full overflow-y-auto flex flex-col">
        {Array.isArray(data) && data?.length > 0 && data !== undefined ? 
        <div className="columns-1 tb:columns-2 ls:columns-4 ll:columns-6 4k:columns-5 gap-4 pb-20">
            {data?.map((item) => (
                <div className="mb-4 w-full break-inside-avoid">
                    <Card key={item._id} item= {item} deleteItem={deleteItem}/>
                </div>
            ))}
        </div>  
        : 
        <div className="flex text-xl items-center justify-center">
            Nothing to show here. 
        </div>}
        
    </div>
}