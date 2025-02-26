import EDChatMessage from "@/components/chatMessage/edChatMessage";
import { ChatLoader } from "@/components/chatMessage";
import "../../app/dashboard/e-discovery/eDiscovery.css";

const ChatMessagesWindow = ({ cRChats, streaming, streamingData, messagesEndRef }) => {
  return (
    <div className="eDiscovery_chats_area">
      {cRChats?.map((chat, i) => (
        <EDChatMessage chat={chat} key={i} />
      ))}
      {streamingData && <EDChatMessage chat={{ message: streamingData, sender: "bot" }} />}
      {streaming && !streamingData && <ChatLoader />}
      <div ref={messagesEndRef} className="messagesEnd" />
    </div>
  );
};

export default ChatMessagesWindow;
