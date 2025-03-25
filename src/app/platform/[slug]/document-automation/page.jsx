"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/documentAutomation.css";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";
import useDocumentAutomation from "@/hooks/useDocumentAutomation";
import ChatMessagesWindow from "@/components/documentAutomation/chatMessagesWindow";
import ChatInput from "@/components/documentAutomation/chatInput";
import ChatBubble from "@/components/chatBubble";

const DocumentAutomation = () => {
  const { toggleSidebar } = useSidebar();

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
          <div className="modelTitle_container_e-discovery">
            Document Automation
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
