"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/contract-review.css";
import { useSidebar } from "@/components/ui/sidebar";
import { Files, Info, PanelRightOpen } from "lucide-react";
import useContractReview from "@/hooks/useContractReview";
import ChatMessagesWindow from "@/components/contractReview/chatMessagesWindow";
import ChatInput from "@/components/contractReview/chatInput";
import ChatInputLegal from "@/components/chatInputBox";
import ChatBubble from "@/components/chatBubble";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";

const ContractReview = () => {
  const { toggleSidebar } = useSidebar();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  const {
    selectedFiles,
    sendBtnActive,
    requestContractReview,
    closeStreaming,
    streaming,
    streamingData,
    cRChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearCRChats,
    selectFileBtnActive,

    sendReviewQuery,
    inputValue,
    setInputValue,
    queryBtnActive,
    lastReview,
  } = useContractReview();

  return (
    <div className="contractReview_wrapper">
      <AppSidebar />
      <div className="cr_page_content">
        <div className="cr_pageTop">
          <div onClick={toggleSidebar} className="cr_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div className="pageTitleBox">
            <div className="modelTitle_container_e-discovery">
              Contract Review
            </div>
            <div className="pageTitle_subInfo_cr">
              <Info size={16} />
              <p className="pageTitle_subInfo_text">Max file size: 50MB</p>
            </div>
            <div className="pageTitle_subInfo_cr">
              <Files size={16} />
              <p className="pageTitle_subInfo_text">Max file upload: 3</p>
            </div>
          </div>
          <div className="cleartBtn_wrapper">
            <div onClick={clearCRChats} className="ed_clearChatBtn">
              Clear Chat
            </div>
          </div>
        </div>
        <div className="page-FileBox">
          <div className="selectedFileBox">
            <span>
              {selectedFiles.length > 0
                ? `Selected File(s): ${selectedFiles
                    .map((file) =>
                      file.name.length > 20
                        ? `${file.name.slice(0, 20)}...`
                        : file.name
                    )
                    .join(", ")}`
                : "No file selected"}
            </span>
          </div>
        </div>
        <div className="cr_pageBody">
          <div className="interaction_area">
            <ChatMessagesWindow
              cRChats={cRChats}
              streaming={streaming}
              streamingData={streamingData}
              messagesEndRef={messagesEndRef}
            />
            <div className="chatInput_transcription_wrapper">
              <div
                className={`chatInputOriginal_wrapper ${lastReview && "slide"}`}
              >
                <ChatInput
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  addFile={addFile}
                  requestContractReview={requestContractReview}
                  closeStreaming={closeStreaming}
                  streaming={streaming}
                  sendBtnActive={sendBtnActive}
                  selectFileBtnActive={selectFileBtnActive}
                />
              </div>
              <div
                className={`chatInputLegal_wrapper ${lastReview && "visible"}`}
              >
                <ChatInputLegal
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  sendMessage={sendReviewQuery}
                  closeStreaming={closeStreaming}
                  streamingData={streaming}
                  sendBtnActive={queryBtnActive}
                />
              </div>
            </div>
              {lastReview && (
                <div className="transcriptionQuery-info">
                  <Info size={16} />
                  <p>The last requested review is used in your query.</p>
                </div>
              )}
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default ContractReview;
