"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/documentAutomation.css";
import { useSidebar } from "@/components/ui/sidebar";
import { Info, PanelRightOpen } from "lucide-react";
import useDocumentAutomation from "@/hooks/useDocumentAutomation";
import ChatMessagesWindow from "@/components/documentAutomation/chatMessagesWindow";
import ChatInput from "@/components/documentAutomation/chatInput";
import ChatBubble from "@/components/chatBubble";
import useAuthStore from "@/store/authStore";
import { fetchUser } from "@/apiCalls/authAPI";
import { useEffect } from "react";

const DocumentAutomation = () => {
  const { toggleSidebar } = useSidebar();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  const {
    selectedFile,
    sendBtnActive,
    error,
    sendMessage,
    streaming,
    closeStreaming,
    dAChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearDAChats,
  } = useDocumentAutomation();

  return (
    <div className="documentAutomation_wrapper">
      <AppSidebar />
      <div className="page_content">
        <div className="pageTop">
          <div onClick={toggleSidebar} className="da_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div onClick={clearDAChats} className="ed_clearChatBtn">
            Clear Chat
          </div>
        </div>
        <div className="pageBody">
          <div className="pageTitleBox">
            <div className="modelTitle_container_e-discovery">
              Document Automation
            </div>
            <div className="pageTitle_subInfo">
              <Info size={16} />
              <p className="pageTitle_subInfo_text">Max file size: 50MB</p>
            </div>
          </div>
          <div className="selectedFileBox">
            <span>
              {selectedFile
                ? `Selected File: ${selectedFile?.name}`
                : "No file selected"}
            </span>
          </div>
          <div className="interaction_area">
            <ChatMessagesWindow
              dAChats={dAChats}
              streaming={streaming}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
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

export default DocumentAutomation;
