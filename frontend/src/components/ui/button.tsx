import { ReactElement } from "react";
import { SpinnerLoader } from "./spinner";

interface ButtonProps {
    variant : "primary" | "secondary" | "success" | "error";
    text : string;
    icon?: ReactElement;
    loading? : boolean;
    state?: "disabled" | "hover" | "loading";
    onClick? : () => void;
    wfull? : boolean;
}

const buttonVariants = {
    "primary" : "bg-royal-blue-600 text-white",
    "secondary" : "bg-royal-blue-300 text-royal-blue-600",
    "success" : "bg-green-500 text-white",
    "error" : "bg-red-500 text-white"
}

const stateVariants = {
    "disabled":"pointer-events-none",
    "hover": "",
    "loading":"pointer-events-none",
}

const defaultStyles = "flex justify-center items-center rounded-sm h-min cursor-pointer select-none"
const widthStyles = "w-20 ll:w-32 4k:w-40"
const responsiveStyles = "text-xs px-1 py-1 ml:text-xs ml:px-1 ml:py-1 ls:text-sm ll:text-md ll:px-4 ll:py-2 4k:text-2xl"
export const Button = (props : ButtonProps) => {
    return <button className=   {`${defaultStyles} ${buttonVariants[props.variant]} 
                                  ${props.state ? stateVariants[props.state] : ""} 
                                  ${responsiveStyles} ${props.wfull ? 'w-full' : widthStyles}`}
                    onClick={props.onClick}>
        {
            props.loading ? <div className="pr-1"><SpinnerLoader/></div>
            : <div>
                {props.icon ? <div className="pr-1">{props.icon}</div> : null} {props.text}
            </div>
            
        }

    </button>
}