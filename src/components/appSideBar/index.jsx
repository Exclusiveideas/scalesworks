import { Captions, Handshake, Home, LibraryBig, LogOut, ScanEye, Scroll, Telescope } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import './appSideBar.css';
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/apiCalls/authAPI";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Legal Assistant",
    url: "/legal-assistant",
    icon: Handshake,
  },
  {
    title: "E-Discovery",
    url: "/e-discovery",
    icon: Telescope,
  },
  {
    title: "Transcription",
    url: "/transcription",
    icon: Captions,
  },
  {
    title: "Document Automation",
    url: "/document-automation",
    icon: Scroll,
  },
  {
    title: "Contract Review",
    url: "/contract-review",
    icon: ScanEye,
  },
  {
    title: "Company Knowledge Base",
    url: "/knowledge-base",
    icon: LibraryBig,
  },
]

export function AppSidebar() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [organization, setOrganization] = useState('');
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if(!user) return;
    // const signString = generateSignString(user?.organization_name)
    const signString = '@OpenAI'
    setOrganization(signString)
  }, [user])
  

  const logOut = () => {
    updateUser(null);
    logOutUser()
    router.push("/auth");
  }

  return (
    <Sidebar className="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-max">
            <div className="userInfo_box">
              <div className="userLetter">{user?.user_name?.[0] || ''}</div>
              <div className="userInfo_subContainer">
                <p className="user_name">{user?.user_name || ''}</p>
                <p className="user_email">{user?.email || ''}</p>
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/platform/${organization}/${item.url}/`} className="sideBarItem">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem onClick={logOut}>
            <SidebarMenuButton className='logOutBar'>
                <LogOut /> <span className="logOutTxt" >Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
