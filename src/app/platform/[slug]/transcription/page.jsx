"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/transcription.css";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import useTranscription from "@/hooks/useTranscription";
import ChatMessagesWindow from "@/components/transcription/chatMessagesWindow";
import ChatInput from "@/components/transcription/chatInput";
import ChatBubble from "@/components/chatBubble";
import { fetchUser } from "@/apiCalls/authAPI";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

const Transcription = () => {
  const { toggleSidebar } = useSidebar();
    
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser)
  }, []); // Runs only on mount (hard reload)

  const {
    selectedAudio,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    tChats,
    audioInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearTChats
  } = useTranscription();
  

  return (
    <div className="transcription_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="tr_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div onClick={clearTChats} className="ed_clearChatBtn">
            Clear Chat
          </div>
        </div>
        <div className="pageBody">
          <div className="modelTitle_container_e-discovery">Transcription</div>
          <div className="selectedFileBox">
            <span>
              {selectedAudio
                ? `Selected Audio: ${selectedAudio.name}`
                : "No audio file selected"}
            </span>
          </div>
          <div className="interaction_area">
            <ChatMessagesWindow
              tChats={tChats}
              streaming={streaming}
              streamingData={streamingData}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              audioInputRef={audioInputRef}
              handleFileChange={handleFileChange}
              addFile={addFile}
              sendMessage={sendMessage}
              closeStreaming={closeStreaming}
              streaming={streaming}
              sendBtnActive={sendBtnActive}
              error={error}
            />
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default Transcription;
