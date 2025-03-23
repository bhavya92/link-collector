import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { Sidebar } from "./Sidebar";
import { Hamburger } from "../../icons/hamburger";
import { VideoIcon } from "../../icons/video";
import { SidebarItem } from "./sidebarItem";
import { AudioIcon } from "../../icons/audio";
import { ArticleIcon } from "../../icons/article";
import { ImageIcon } from "../../icons/image";
import { TagIcon } from "../../icons/tag";

export const HomePage = () => {
    const auth = useContext(AuthContext);
    const [expanded, setExpanded ] = useState(true);

    function toggleSidebar() {
        setExpanded( prev => !prev);
    }

    return<div className="w-screen h-screen">
        {expanded ? <div className="bg-slate-100/50 z-0 absolute inset-0" onClick={toggleSidebar}></div> 
                    : null}
        <div className="inset-y-0 left-0 z-10">
            <Sidebar expanded={expanded} setExpanded={toggleSidebar}>
                <SidebarItem expanded={expanded} icon={<VideoIcon/>} title={"Video"} />
                <SidebarItem expanded={expanded} icon={<AudioIcon/>} title={"Audio"} />
                <SidebarItem expanded={expanded} icon={<ArticleIcon/>} title={"Article"} />
                <SidebarItem expanded={expanded} icon={<ImageIcon/>} title={"Image"} /> 
                <SidebarItem expanded={expanded} icon={<TagIcon/>} title={"Tags"} />
            </Sidebar>
        </div>
        <div className="w-full h-full px-20 py-2">
            <h1>Hello there its me</h1>
        </div>
    </div> 
    
        
}