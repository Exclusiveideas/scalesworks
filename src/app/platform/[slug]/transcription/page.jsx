"use client";

import { AppSidebar } from "@/components/appSideBar";
import "@/styles/transcription.css";
import { useSidebar } from "@/components/ui/sidebar";
import { Info, PanelRightOpen } from "lucide-react";
import useTranscription from "@/hooks/useTranscription";
import ChatMessagesWindow from "@/components/transcription/chatMessagesWindow";
import ChatInput from "@/components/transcription/chatInput";
import ChatInputLegal from "@/components/chatInputBox";
import ChatBubble from "@/components/chatBubble";
import { fetchUser } from "@/apiCalls/authAPI";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

const Transcription = () => {
  const { toggleSidebar } = useSidebar();

  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  const {
    selectedAudio,
    sendBtnActive,
    requestTranscription,
    closeStreaming,
    streaming,
    streamingData,
    tChats,
    audioInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearTChats,
    selectFileBtnActive,

    sendTranscriptQuery,
    inputValue,
    setInputValue,
    queryBtnActive,
    lastTranscription,
  } = useTranscription();

  return (
    <div className="transcription_wrapper">
      <AppSidebar />
      <div className="page_content_transcription">
        <div className="pageTitleBox_transcription">
          <div onClick={toggleSidebar} className="tr_sideBar_trigger">
            <PanelRightOpen />
          </div>
          <div className="pageTitle_container">
            <div className="modelTitle_container_e-discovery">
              Transcription
            </div>
            <div className="pageTitle_subInfo_tr">
              <Info size={16} />
              <p className="pageTitle_subInfo_text">Max file size: 50MB</p>
            </div>
          </div>
          <div className="cleartBtn_wrapper">
            <div onClick={clearTChats} className="ed_clearChatBtn">
              Clear Chat
            </div>
          </div>
        </div>
        <div className="page-FileBox">
          <div className="selectedFileBox_transcription">
            <span>
              {selectedAudio
                ? `Selected Audio: ${
                    selectedAudio.name.length > 35
                      ? `${selectedAudio.name.slice(0, 35)}...`
                      : selectedAudio.name
                  }`
                : "No audio file selected"}
            </span>
          </div>
        </div>
        <div className="pageBody_transcription">
          <div className="interaction_area">
            <ChatMessagesWindow
              tChats={tChats}
              streaming={streaming}
              streamingData={streamingData}
              messagesEndRef={messagesEndRef}
            />
            <div className="chatInput_transcription_wrapper">
              <div
                className={`chatInputOriginal_wrapper ${
                  lastTranscription && "slide"
                }`}
              >
                <ChatInput
                  audioInputRef={audioInputRef}
                  handleFileChange={handleFileChange}
                  addFile={addFile}
                  requestTranscription={requestTranscription}
                  closeStreaming={closeStreaming}
                  streaming={streaming}
                  sendBtnActive={sendBtnActive}
                  selectFileBtnActive={selectFileBtnActive}
                />
              </div>
              <div
                className={`chatInputLegal_wrapper ${
                  lastTranscription && "visible"
                }`}
              >
                <ChatInputLegal
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  sendMessage={sendTranscriptQuery}
                  closeStreaming={closeStreaming}
                  streamingData={streaming}
                  sendBtnActive={queryBtnActive}
                />
              </div>
            </div>
            {lastTranscription && (
              <div className="transcriptionQuery-info">
                <Info size={16} />
                <p>The last requested transcription is used in your query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default Transcription;
