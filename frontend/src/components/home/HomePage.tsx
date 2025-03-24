import { useContext, useState } from "react";
import { Sidebar } from "./Sidebar";
import { VideoIcon } from "../../icons/video";
import { SidebarItem } from "./sidebarItem";
import { AudioIcon } from "../../icons/audio";
import { ArticleIcon } from "../../icons/article";
import { ImageIcon } from "../../icons/image";
import { TagIcon } from "../../icons/tag";
import { ProfileIcon } from "../../icons/profile";
import { Button } from "../ui/button";
import { UserDropDown } from "./userdropdown";
import { AuthContext } from "../../context/auth";

export const HomePage = () => {
    
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("check is authprovider provided");
    }
    const { user, setUser } = auth;

    const [expanded, setExpanded ] = useState(false);
    const  [showUser, setShowUser ] = useState(false);
    
    function toggleSidebar() {
        setExpanded( prev => !prev);
    }

    function toggleuserDropDown() {
        setShowUser(prev => !prev);
    }

    return<div className="w-screen h-screen relative">
        {expanded ? <div className="bg-slate-100/50 z-50 absolute inset-0" onClick={toggleSidebar}></div> 
                    : null}
        <div className="fixed inset-y-0 left-0 z-50">
            <Sidebar expanded={expanded} setExpanded={toggleSidebar}>
                <SidebarItem expanded={expanded} icon={<VideoIcon/>} title={"Video"} />
                <SidebarItem expanded={expanded} icon={<AudioIcon/>} title={"Audio"} />
                <SidebarItem expanded={expanded} icon={<ArticleIcon/>} title={"Article"} />
                <SidebarItem expanded={expanded} icon={<ImageIcon/>} title={"Image"} /> 
                <SidebarItem expanded={expanded} icon={<TagIcon/>} title={"Tags"} />
            </Sidebar>
        </div>
        <div className="w-full h-full flex flex-col z-10">
            <div className="w-full h-fit flex justify-end gap-x-2 px-4 pt-4 items-center">
                <Button variant="secondary" text="Add Content"/>
                <div className="rounded-full w-fit h-fit bg-royal-blue-300 p-2 cursor-pointer" onClick={toggleuserDropDown}>
                    <ProfileIcon/>
                </div>
            </div>
            <div className="relative w-full flex-1 ">
                <div className="absolute top-2 right-4">
                    <UserDropDown isShown={showUser} email={user?.email} username={user?.userName} setUser={setUser}/>
                </div>
            </div>
        </div>
    </div> 
    
        
}