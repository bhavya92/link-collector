import { ChevronLeft } from "../../icons/chevron-left"
import { ChevronRight } from "../../icons/chevron-right"

export const Sidebar = ({children, expanded, setExpanded}) => {
    
    return <div className={`transition-all duration-200 ease-in-out fixed shadow-lg rounded-br-lg rounded-tr-lg ${expanded ? "w-9 ml:w-52" : 'w-9 ml:w-10'} overflow-hidden h-screen border border-royal-blue-100 bg-slate-50`}>
        {expanded ? 
            <div className="hidden ml:block absolute top-2 right-2 w-fit h-fit cursor-pointer hover:scale-105" onClick={setExpanded}>
                <ChevronLeft/>
            </div>
        : 
            <div className="hidden absolute inset-x-0 top-2 h-fit ml:flex ml:justify-center ml:items-center cursor-pointer " onClick={setExpanded}>
                <ChevronRight/>
            </div>
        } 
        <div className="transition-all duration-200 ease-in-out flex flex-col my-2 ml:my-12 h-full w-full">
        {children} 
        </div>
    </div>
}