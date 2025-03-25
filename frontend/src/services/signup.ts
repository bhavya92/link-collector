import { BASE_URL, GETOTP, SIGNUP, VERIFYOTP } from "../constants/api";
import { getErrorName } from "../utils/error";

export const sendEmail = async (email : string, signal : AbortSignal) => {
    try {
        const response = await fetch(`${BASE_URL}${GETOTP}`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body:JSON.stringify({
                email,
            }),
            signal,
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "message" : responseJson.message,
            "abort" : false
        }
    } catch(err) {
        const errorName = getErrorName(err);
        if(errorName === 'AbortError') {
            return {"success" : false,"message":"Aborted", "abort": true};
        }
        return {"success" : false,"message":"Something went wrong", "abort":false};
    }
}

export const verifyOtp = async(email: string, otp: string, signal: AbortSignal) => {
    try {
        const response = await fetch(`${BASE_URL}${VERIFYOTP}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body:JSON.stringify({
                email,
                otp,
            }),
            signal,
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "message" : responseJson.message,
            "abort" : false
        }
    } catch(err) {
        const errName = getErrorName(err);
        if(errName === 'AbortError')
            return {"success":false, "message":"Aborted","abort":true}    
        console.log(err);
        return {"success":false, "message":"Something went wrong","abort":false}
    }
}

export const sendUserInfo= async (userName: string, email : string, password: string, signal: AbortSignal) => {
    try{
        const response = await fetch(`${BASE_URL}${SIGNUP}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json ; charset=UTF-8",
            },
            credentials:"include",
            body:JSON.stringify({
                username : userName,
                email: email,
                password: password,
            }),
            signal,
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "message" : responseJson.message,
            "abort" : false,
            "email" : responseJson.email,
            "userName" : responseJson.userName,
        }
    } catch(err) {
        const errorName = getErrorName(err);
        if(errorName === 'AbortError') {
            return {"success" : false,"message":"Aborted", "abort": true};
        }
        return {"success" : false,"message":"Something went wrong", "abort":false};
    }
}