import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Plus } from "lucide-react";
import "@/styles/transcription.css";
import "@/styles/eDiscovery.css";

const ChatInput = ({
  audioInputRef,
  handleFileChange,
  addFile,
  requestTranscription,
  closeStreaming,
  streaming,
  sendBtnActive,
  selectFileBtnActive
}) => {
  return (
    <div className="transcript_inputbox">
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleFileChange}
        accept=".mp3,.wav"
        style={{ display: "none" }}
      />
      <div style={{ pointerEvents: !selectFileBtnActive ? "none" : "auto" }} onClick={addFile} className="transcript_addFileBtn">
        <Plus className="plusIcon_tr" />
      </div>
      {!streaming ? (
        <div
          onClick={requestTranscription}
          className={`transcript_sendBtn ${sendBtnActive && "active"}`}
        >
          <Send className="sendIcon_tr" />
        </div>
      ) : (
        <div onClick={closeStreaming} className="transcript_stopBtn">
          <StopCircleOutlinedIcon />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
