import { BASE_URL, CREATE_CONTENT, DELETE_CONTENT, FETCH_ALLCONTENT, FIND_TYPE } from "../constants/api"
import { getErrorName } from "../utils/error";

export interface Content {
    _id: string;
    link: string;
    type: string;
    title: string;
    tags : string[];
    createdAt : string;
}

export const getType = async (link: string, signal: AbortSignal) => {
    try {
        const response = await fetch(`${BASE_URL}${FIND_TYPE}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body: JSON.stringify({
                link,
            }),
            signal,
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "messgae" : responseJson.message,
            "data" : responseJson.type,
            "abort" : false,
        };
    } catch(err) {
        const errName = getErrorName(err);
        if(errName === 'AbortError')
            return {"success":false, "message":"Aborted","abort":true, "data" : null}    
        console.log(err);
        return {"success":false, "message":"Something went wrong","abort":false,"data":null}
    }
}

export const createNewContent = async({link,title,tags,type,signal}:
                {link: string; 
                title: string; 
                tags: string[]; 
                type: string; 
                signal: AbortSignal}) => {
    try {
        const response = await fetch(`${BASE_URL}${CREATE_CONTENT}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            signal,
            body:JSON.stringify({
                link,
                type,
                title,
                tags,
            }),
        });
        const responseJson = await response.json();
        return {
            "success": response.status === 200,
            "message": responseJson.message,
            "data": responseJson.data
        }
    } catch(err) {
        const errName = getErrorName(err);
        if(errName === 'AbortError')
            return {"success":false, "message":"Aborted","abort":true, "data" : null}    
        console.log(err);
        return {"success":false, "message":"Something went wrong","abort":false,"data":null}
    }
}

export const fetchContent = async({ queryKey }: { queryKey: [string, string] }) => {
    const [, type] = queryKey;
    let URL = '';
    switch(type) {
        case "all" : 
            URL = `${BASE_URL}${FETCH_ALLCONTENT}`;
            break;
        case "video" : 
            URL = `${BASE_URL}/content/fetchVideoContent`;
            break;
        case "audio":
            URL = `${BASE_URL}/content/fetchAudioContent`;
            break;
        case "article":
            URL = `${BASE_URL}/content/fetchArticleContent`;
            break;
        case "social":
            URL = `${BASE_URL}/content/fetchSocialContent`;
            break;
        case "image":
            URL = `${BASE_URL}/content/fetchImageContent`;
            break;
        case "other":
            URL = `${BASE_URL}/content/fetchOtherContent`;
            break;
    }
    try {
        const response = await fetch(`${URL}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
        });
        const responseJson = await response.json();
        console.log(responseJson.content);
        return responseJson.content;
    } catch(err) {
        console.log(err);
    }
}

export const deleteContent = async(id: string) => {
    try {
        const response = await fetch(`${BASE_URL}${DELETE_CONTENT}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body:JSON.stringify({
                contentId: id,
            })
        });
        const responseJson = await response.json();
        return responseJson.content;
    } catch(err) {
        console.log(err);
    }
}