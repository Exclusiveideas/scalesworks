import ChatMessage, { ChatLoader } from "@/components/chatMessage";
import "../../app/platform/legal-assistant/legalAssistant.css";

const ChatWindow = ({ chats, streamingData, streaming, messagesEndRef }) => {
  return (
    <div className="chats_area">
      {chats?.map((chat, i) => (
        <ChatMessage chat={chat} key={i} />
      ))}
      {streamingData && <ChatMessage chat={{ message: streamingData, sender: "bot" }} />}
      {streaming && !streamingData && <ChatLoader />}
      <div className="messagesEnd" ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
