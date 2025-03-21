import { useContext } from "react";
import { AuthContext } from "../../context/auth";

export const HomePage = () => {
    const auth = useContext(AuthContext);

    return<>
        <h1>Welcome {auth?.user?.userName}</h1>
    </>
}