import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { BASE_URL, VALIDATE_TOKEN } from "../constants/api";

interface User {
    userName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); 

const AuthProvider = ({children}) => {

    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);
    
    useEffect(()=> {
        const validateToken = async() => {
            try {
                const response = await fetch(`${BASE_URL}${VALIDATE_TOKEN}`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json ; charset=UTF-8",
                    },
                    credentials: "include",
                });
                if(response.ok) {
                    const responseJson = await response.json();
                    setUser({
                        "userName" : responseJson.data.userName,
                        "email": responseJson.data.email,
                    });
                } else {
                    setUser(null);
                }
            } catch(err) {
                console.log(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        validateToken();
    },[]);

    return <AuthContext.Provider value={{user, setUser, loading}}>{children}</AuthContext.Provider>
};

export {AuthContext, AuthProvider}