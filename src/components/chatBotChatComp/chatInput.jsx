import './chatBotChatComp.css';

import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";

const ChatInput = ({ inputValue, setInputValue, sendMessage, closeStreaming, streaming, sendBtnActive }) => {
  return (
    <div className='chatInput_wrapper'>
    <Input
      type="text"
      placeholder="Ask anything"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
      className="chatbot_input"
    />
    {!streaming ? (
      <div onClick={sendMessage} className={`sendBtn ${sendBtnActive && "active"}`}>
        <Send />
      </div>
    ) : (
      <div onClick={closeStreaming} className="stopBtn">
        <StopCircleOutlinedIcon sx={{ fontSize: 20 }} />
      </div>
    )}
    </div>
  )
}

export default ChatInput
