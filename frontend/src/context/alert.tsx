import { createContext, Dispatch, SetStateAction, useState } from "react"

interface AlertContextType {
    showAlert : boolean | null;
    setShowAlert : Dispatch<SetStateAction<boolean | null>>;
    variant : "success" | "error" | null;
    message : string | null;
    setVariant : Dispatch<SetStateAction<"success" | "error" | null>>;
    setMessage : Dispatch<SetStateAction<string | null>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const AlertProvider = ({children}) => {
    const [ showAlert, setShowAlert ] = useState<boolean | null>(false);
    const [ variant, setVariant ] = useState<"success" | "error" | null | null>(null);
    const [ message, setMessage ] = useState<string | null>(null);

    return <AlertContext.Provider value={{showAlert, setShowAlert, variant, setVariant, message, setMessage}}>{children}</AlertContext.Provider>
}

export {AlertContext, AlertProvider}