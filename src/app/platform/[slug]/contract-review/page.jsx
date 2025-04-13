"use client"

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/contract-review.css";
import { useSidebar } from "@/components/ui/sidebar";
import { Info, PanelRightOpen } from "lucide-react";
import useContractReview from "@/hooks/useContractReview";
import ChatMessagesWindow from "@/components/contractReview/chatMessagesWindow";
import ChatInput from "@/components/contractReview/chatInput";
import ChatBubble from "@/components/chatBubble";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";

const ContractReview = () => {
  const { toggleSidebar } = useSidebar()
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser)
  }, []); // Runs only on mount (hard reload)

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
    <div className="contractReview_wrapper">
      <AppSidebar />
      <div className="cr_page_content">
        <div className="cr_pageTop">
          <div onClick={toggleSidebar} className="cr_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div onClick={clearCRChats} className="ed_clearChatBtn">
            Clear Chat
          </div>
        </div>
        <div className="cr_pageBody">
          <div className="pageTitleBox">
          <div className="modelTitle_container_e-discovery">Contract Review</div>
            <div className="pageTitle_subInfo">
              <Info size={16} />
              <p className="pageTitle_subInfo_text">Max file size: 50MB</p>
            </div>
          </div>
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
              cRChats={cRChats}
              streaming={streaming}
              streamingData={streamingData}
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
}

export default ContractReview