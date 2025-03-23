import { ChatLoader } from "@/components/chatMessage";
import "../../app/platform/e-discovery/eDiscovery.css";
import DAChatMessage from "../chatMessage/daChatMessage";

const ChatMessagesWindow = ({ dAChats, streaming, messagesEndRef }) => {
  return (
    <div className="eDiscovery_chats_area">
      {dAChats?.map((chat, i) => (
        <DAChatMessage chat={chat} key={i} />
      ))}
      {streaming && <ChatLoader />}
      <div ref={messagesEndRef} className="messagesEnd" />
    </div>
  );
};

export default ChatMessagesWindow;
