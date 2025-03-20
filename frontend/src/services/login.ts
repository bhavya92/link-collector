import { BASE_URL, LOGIN } from "../constants/api";
import { getErrorName } from "../utils/error"

export const loginUser = async (email:string, password:string,signal: AbortSignal) => {
    try{
        const response = await fetch(`${BASE_URL}${LOGIN}`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body:JSON.stringify({
                uniqueId:email,
                password,
            }),
            signal,
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "message" : responseJson.message,
            "abort" : false
        };
    } catch(err){
        const errName = getErrorName(err);
        if(errName === 'AbortError'){
            return {
                "success":false,
                "message":"Aborted",
                "abort": true,
            };
        }
        return {
            "success":false,
            "message":"Something went wrong",
            "abort":false,
        };
    }
}