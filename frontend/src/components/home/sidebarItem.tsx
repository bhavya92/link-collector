export const SidebarItem  = ({expanded, icon, title, onClick}) => {
    return <div className=" transition-all transform will-change-transform duration-200 ease-in-out flex gap-x-2 
                            items-center text-slate-800 border-none hover:bg-slate-200
                            py-2 px-2 cursor-pointer overflow-hidden"
                            onClick={onClick}>
        <div className="ml-0">{icon}</div>
        <div className={`ml-4 transition-all duration-200 ease-in-out ${expanded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="text-md tb:text-lg ">{title}</div>
        </div>
    </div>
}