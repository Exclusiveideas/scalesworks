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
  error,
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
      <div onClick={addFile} className="transcript_addFileBtn">
        <Plus />
      </div>
      {!streaming ? (
        <div
          onClick={requestTranscription}
          className={`transcript_sendBtn ${sendBtnActive && "active"}`}
        >
          <Send />
        </div>
      ) : (
        <div onClick={closeStreaming} className="transcript_stopBtn">
          <StopCircleOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
      )}
      {error && <p className="transcript_error_message">{error}</p>}
    </div>
  );
};

export default ChatInput;
