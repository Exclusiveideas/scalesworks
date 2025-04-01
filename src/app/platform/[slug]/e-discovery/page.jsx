"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/eDiscovery.css";
import { useSidebar } from "@/components/ui/sidebar";
import ChatMessagesWindow from "@/components/eDiscovery/chatMessagesWindow";
import useEDiscovery from "@/hooks/useEDiscovery";
import ChatInput from "@/components/eDiscovery/chatInput";
import { PanelRightOpen } from "lucide-react";
import ChatBubble from "@/components/chatBubble";
import useAuthStore from "@/store/authStore";
import { fetchUser } from "@/apiCalls/authAPI";
import { useEffect } from "react";

const EDiscovery = () => {
  const { toggleSidebar } = useSidebar();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser)
  }, []); // Runs only on mount (hard reload)
  
  const {
    inputValue,
    setInputValue,
    selectedFiles,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    edChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearEDChats
  } = useEDiscovery();

  

  return (
    <div className="eDiscovery_wrapper">
      <AppSidebar />
      <div className="eDiscovery_page_content">
        <div className="eDiscovery_pageTop">
          <div onClick={toggleSidebar} className="ed_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div onClick={clearEDChats} className="ed_clearChatBtn">
            Clear Chat
          </div>
        </div>
        <div className="pageBody">
          <div className="modelTitle_container_e-discovery">E-Discovery</div>
          <div className="selectedFileBox">
            <span>
              {selectedFiles.length > 0
                ? `Selected File(s): ${selectedFiles
                    .map((file) => file.name)
                    .join(", ")}`
                : "No file selected"}
            </span>
          </div>
          <div className="interaction_area">
            <ChatMessagesWindow
              edChats={edChats}
              streaming={streaming}
              streamingData={streamingData}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              selectedFiles={selectedFiles}
              fileInputRef={fileInputRef}
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

export default EDiscovery;
 