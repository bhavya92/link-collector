import { BASE_URL, LOGOUT } from "../constants/api"

export const signoutUser = async () => {
    try {
        const response = await fetch(`${BASE_URL}${LOGOUT}`,{
            method:"POST",
            headers: {
                "Content-Type" : "application/json; charset=UTF-8",
            },
            credentials:"include",
        });
        const responseJson = await response.json();
        return {
            "success" : response.status === 200,
            "message" : responseJson.message,
        };
    } catch(err) {
        console.log(err);
        return {
            "success" : false,
            "message" : "something went wrong!"
        }
    }
}