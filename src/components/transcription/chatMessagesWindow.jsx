import EDChatMessage from "@/components/chatMessage/edChatMessage";
import { ChatLoader } from "@/components/chatMessage";
import "@/styles/eDiscovery.css";
import TChatMessage from "../chatMessage/tChat";

const ChatMessagesWindow = ({ tChats, streaming, streamingData, messagesEndRef }) => {
  return (
    <div className="eDiscovery_chats_area">
      {tChats?.map((chat, i) => (
        <TChatMessage chat={chat} key={i} />
      ))}
      {streamingData && <EDChatMessage chat={{ message: streamingData, sender: "bot" }} />}
      {streaming && !streamingData && <ChatLoader />}
      <div ref={messagesEndRef} className="messagesEnd" />
    </div>
  );
};

export default ChatMessagesWindow;
