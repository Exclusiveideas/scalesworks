import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import "../../app/dashboard/legal-assistant/legalAssistant.css";

const EDiscoveryInput = ({ inputValue='', setInputValue='', sendMessage='', closeStreaming='', streamingData='', sendBtnActive='' }) => {
  return (
    <div className="inputbox">
      <Input
        type="text"
        placeholder="Ask anything (must attach a file for discovery)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
        className="legalAsst_input"
      />
      {!streamingData ? (
        <div onClick={sendMessage} className={`sendBtn ${sendBtnActive && "active"}`}>
          <Send />
        </div>
      ) : (
        <div onClick={closeStreaming} className="stopBtn">
          <StopCircleOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
      )}
    </div>
  );
};

export default EDiscoveryInput;
