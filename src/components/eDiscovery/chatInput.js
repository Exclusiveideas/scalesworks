import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Plus } from "lucide-react";
import "@/styles/eDiscovery.css";

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
  selectFileBtnActive
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
        className="eDiscovery_input"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.md"
        multiple
        style={{ display: "none" }}
      />
      <div style={{ pointerEvents: !selectFileBtnActive ? "none" : "auto" }} onClick={addFile} className="eDiscovery_addFileBtn">
        <Plus className="plusIcon_ed" />
      </div>
      {!streaming ? (
        <div onClick={sendMessage} className={`eDiscovery_sendBtn ${sendBtnActive && "active"}`}>
          <Send className="sendIcon_ed" />
        </div>
      ) : (
        <div onClick={closeStreaming} className="eDiscovery_stopBtn">
          <StopCircleOutlinedIcon />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
