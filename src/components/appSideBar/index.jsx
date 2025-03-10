import { Captions, Handshake, Home, LogOut, ScanEye, Scroll, Telescope } from "lucide-react";

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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Legal Assistant",
    url: "/dashboard/legal-assistant",
    icon: Handshake,
  },
  {
    title: "E-Discovery",
    url: "/dashboard/e-discovery",
    icon: Telescope,
  },
  {
    title: "Transcription",
    url: "/dashboard/transcription",
    icon: Captions,
  },
  {
    title: "Document Automation",
    url: "/dashboard/document-automation",
    icon: Scroll,
  },
  {
    title: "Contract Review",
    url: "/dashboard/contract-review",
    icon: ScanEye,
  },
]

export function AppSidebar() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();

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
              <div className="userLetter">M</div>
              <div className="userInfo_subContainer">
                <p className="user_name">Muftau</p>
                <p className="user_email">muftau201@gmail.com</p>
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="sideBarItem">
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
