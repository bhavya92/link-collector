import { ReactElement } from "react";
import { SpinnerLoader } from "./spinner";

interface ButtonProps {
    variant : "primary" | "secondary" | "success" | "error";
    size : "sm" | "md" | "lg";
    text : string;
    icon?: ReactElement;
    loading? : boolean;
    state?: "disabled" | "hover" | "loading";
    onClick? : () => void;
}

const buttonVariants = {
    "primary" : "bg-royal-blue-600 text-white",
    "secondary" : "bg-royal-blue-300 text-royal-blue-600",
    "success" : "bg-green-500 text-white",
    "error" : "bg-red-500 text-white"
}

const sizeVariants = {
    "sm" : "text-sm px-2 py-1",
    "md" : "text-base px-4 py-2",
    "lg" : "text-lg px-6 py-3"
}

const stateVariants = {
    "disabled":"pointer-events-none",
    "hover": "",
    "loading":"pointer-events-none",
}
//TODO :text font and other text properties
const defaultStyles = "flex justify-center items-center rounded-sm w-full h-min cursor-pointer"

export const Button = (props : ButtonProps) => {
    return <button className=   {`${defaultStyles} ${buttonVariants[props.variant]} 
                                  ${props.state ? stateVariants[props.state] : ""} 
                                  ${sizeVariants[props.size]}`}
                    onClick={props.onClick}>
        {
            props.loading ? <div className="pr-1"><SpinnerLoader/></div>
            : <div>
                {props.icon ? <div className="pr-1">{props.icon}</div> : null} {props.text}
            </div>
            
        }

    </button>
}