import { AppSidebar } from "@/components/appSideBar";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ChatBot = () => {
  
  const router = useRouter();
  const { user } = useAuthStore();
  
  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth"); // Redirect only after hydration
    }
  }, [user, isHydrated]);
  
  return (
    <div>
      <AppSidebar />
    </div>
  )
}

export default ChatBot