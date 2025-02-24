"use client";

import { AppSidebar } from "@/components/appSideBar";
import "./legalAssistant.css";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import useLegalAssistant from "@/hooks/useLegalAssistant";
import ChatInput from "@/components/chatInputBox";
import ChatWindow from "@/components/chatWindow";
import { useEffect } from "react";

const LegalAssistant = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }
  }, [user, isHydrated]);

  const {
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    chats,
    messagesEndRef
  } = useLegalAssistant();

  return (
    <div className="legalAssistant_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="sideBar_trigger">
            <PanelRightOpen />
          </div>
        </div>
        <div className="pageBody">
          <div className="modelTitle_container">Legal Assistant</div>
          <div className="interaction_area">
            <ChatWindow chats={chats} streamingData={streamingData} streaming={streaming} messagesEndRef={messagesEndRef} />
            <ChatInput inputValue={inputValue} setInputValue={setInputValue} sendMessage={sendMessage} closeStreaming={closeStreaming} streamingData={streamingData} sendBtnActive={sendBtnActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;
