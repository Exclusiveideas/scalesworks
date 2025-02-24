"use client"

import { AppSidebar } from "@/components/appSideBar";
import './transcription.css';
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";

const Transcription = () => {
  const { toggleSidebar } = useSidebar()
  
  const router = useRouter();
    
  const { user } = useAuthStore();
  
  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth"); // Redirect only after hydration
    }
  }, [user, isHydrated]);
  

  return (
    <div className="transcription_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transcription