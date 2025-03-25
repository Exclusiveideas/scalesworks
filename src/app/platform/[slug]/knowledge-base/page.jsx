"use client"

import { AppSidebar } from "@/components/appSideBar";
import { useSidebar } from "@/components/ui/sidebar";
import useContractReview from "@/hooks/useContractReview";
import "@/styles/knowledge-base.css";
import { PanelRightOpen } from "lucide-react";

const KnowledgeBase = () => {
  const { toggleSidebar } = useSidebar()

  const {
    selectedFiles,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    cRChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearCRChats
  } = useContractReview();

  return (
    <div className="knowledgeBase_wrapper">
      <AppSidebar />
      <div className="kb_page_content">
        <div className="kb-pageTop">
          <div onClick={toggleSidebar} className="kb_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div onClick={clearCRChats} className="kb_clearChatBtn">
            Clear Chat
          </div>
        </div>
        <div className="kb_pageBody">
          <div className="modelTitle_container_knowledgeBase">
            Knowledge Base
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
