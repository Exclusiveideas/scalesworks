import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Plus } from "lucide-react";
import "../../app/platform/transcription/transcription.css";
import "../../app/platform/e-discovery/eDiscovery.css";

const ChatInput = ({
  fileInputRef,
  handleFileChange,
  addFile,
  sendMessage,
  closeStreaming,
  streaming,
  sendBtnActive,
  error,
}) => {
  return (
    <div className="transcript_inputbox">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        multiple
        style={{ display: "none" }}
      />
      <div onClick={addFile} className="transcript_addFileBtn">
        <Plus />
      </div>
      {!streaming ? (
        <div
          onClick={sendMessage}
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
