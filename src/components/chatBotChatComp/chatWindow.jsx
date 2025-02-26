import './chatBotChatComp.css';
import ChatBotMessage, { ChatLoader } from './chatBotMessage';

const ChatWindow = ({ chats, streamingData, streaming, messagesEndRef }) => {
  return (
    <div className="chatWindow_container">
      {chats?.map((chat, i) => (
        <ChatBotMessage chat={chat} key={i} />
      ))}
      {streamingData && <ChatBotMessage chat={{ message: streamingData, sender: "bot" }} />}
      {streaming && !streamingData && <ChatLoader />}
      <div className="messagesEnd" ref={messagesEndRef} />
    </div>
  )
}

export default ChatWindow
