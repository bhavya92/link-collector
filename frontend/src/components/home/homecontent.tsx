import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Content, deleteContent, fetchContent } from "../../services/content";
import { Card } from "../ui/card";

export const HomeContent = ({ type }: { type: string }) => {

    const queryClient = useQueryClient();

    const {data, error, isLoading } = useQuery<Content[]>({
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

    if(isLoading) return <h1>Loading bitch...</h1>
    if(error) return <h1>Error</h1>
    return <div className="flex gap-x-2 gap-y-2">
            {data?.map((item) => (
                <Card key={item._id} item= {item} deleteItem={deleteItem}/>
            ))}
        
    </div>
}