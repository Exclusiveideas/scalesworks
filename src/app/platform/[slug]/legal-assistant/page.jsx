"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/legalAssistant.css";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import useLegalAssistant from "@/hooks/useLegalAssistant";
import { useEffect } from "react";
import ChatBubble from "@/components/chatBubble";
import { fetchUser } from "@/apiCalls/authAPI";
import ChatInput from "@/components/chatInputBox";
import ChatWindow from "@/components/chatWindow";

const LegalAssistant = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
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
    messagesEndRef,
    clearChats,
  } = useLegalAssistant();

  return (
    <div className="legalAssistant_wrapper">
      <AppSidebar />
      <div className="page_content_la">
        <div className="pageTop_la">
          <div onClick={toggleSidebar} className="la_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div className="la_pageTitle_container">
            <div className="modelTitle_container">Legal Assistant</div>
          </div>
          <div className="la_cleartBtn_wrapper">
            <div onClick={clearChats} className="la_clearChatBtn">
              Clear Chat
            </div>
          </div>
        </div>
        <div className="pageBody_la">
          <div className="interaction_area">
            <ChatWindow
              chats={chats}
              streamingData={streamingData}
              streaming={streaming}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              sendMessage={sendMessage}
              closeStreaming={closeStreaming}
              streamingData={streamingData}
              sendBtnActive={sendBtnActive}
            />
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default LegalAssistant;
