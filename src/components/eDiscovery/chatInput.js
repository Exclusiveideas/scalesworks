import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Plus } from "lucide-react";
import "../../app/platform/e-discovery/eDiscovery.css";

const ChatInput = ({
  inputValue,
  setInputValue,
  selectedFiles,
  fileInputRef,
  handleFileChange,
  addFile,
  sendMessage,
  closeStreaming,
  streaming,
  sendBtnActive,
  error
}) => {
  return (
    <div className="eDiscovery_inputbox">
      <Input
        type="text"
        placeholder={`Ask anything (${
          selectedFiles.length === 0 ? "must attach at least one file" : "files selected"
        })`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
        className="legalAsst_input"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.md"
        multiple
        style={{ display: "none" }}
      />
      <div onClick={addFile} className="eDiscovery_addFileBtn">
        <Plus />
      </div>
      {!streaming ? (
        <div onClick={sendMessage} className={`eDiscovery_sendBtn ${sendBtnActive && "active"}`}>
          <Send />
        </div>
      ) : (
        <div onClick={closeStreaming} className="eDiscovery_stopBtn">
          <StopCircleOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
      )}
      {error && <p className="eDiscovery_error_message">{error}</p>}
    </div>
  );
};

export default ChatInput;
