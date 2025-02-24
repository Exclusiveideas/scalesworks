import EDChatMessage from "@/components/chatMessage/edChatMessage";
import { ChatLoader } from "@/components/chatMessage";
import "../../app/dashboard/e-discovery/eDiscovery.css";

const ChatMessagesWindow = ({ edChats, streaming, streamingData }) => {
  return (
    <div className="eDiscovery_chats_area">
      {edChats?.map((chat, i) => (
        <EDChatMessage chat={chat} key={i} />
      ))}
      {streamingData && <EDChatMessage chat={{ message: streamingData, sender: "bot" }} />}
      {streaming && !streamingData && <ChatLoader />}
    </div>
  );
};

export default ChatMessagesWindow;
