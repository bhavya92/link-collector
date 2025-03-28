import { useContext } from "react";
import { AlertContext } from "../../context/alert";
import { CloseIcon } from "../../icons/close";

interface AlertProps {
    variant : "success" | "error" | "info" | null;
    message : string | null;
}

const alertVaraints = {
    "success" : "bg-green-400",
    "error" : "bg-red-400",
    "info" : "bg-royal-blue-600"
}

const defaultStyles = "absolute bottom-2 right-2 z-50 w-40 text-tiny tb:w-80 tb:text-sm font-medium flex items-center justify-between py-2 px-4 text-white";

export const Alert = (props: AlertProps) => {
    const customAlert = useContext(AlertContext);
    if(!customAlert) {
        throw new Error("Add AlertProvider");
    }
    
    setTimeout(() => {
        customAlert.setShowAlert(false)
      }, 2000);

    return <>
    {customAlert.showAlert ? <div className={`${defaultStyles} ${props.variant ? alertVaraints[props.variant] : ''}`}>
        {props.message}
        <div className="w-fit h-fit cursor-pointer" onClick={() => customAlert.setShowAlert(false)}><CloseIcon/></div>
    </div> : null}
    </>
}