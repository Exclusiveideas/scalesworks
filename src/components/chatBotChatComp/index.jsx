import useChatBotAsst from '@/hooks/useChatBotAsst';
import './chatBotChatComp.css';
import ChatInput from './chatInput';
import ChatWindow from './chatWindow';


const ChatBotChatComp = () => {
    
      const {
        inputValue,
        setInputValue,
        sendMessage,
        closeStreaming,
        streamingData,
        streaming,
        sendBtnActive,
        chats,
        messagesEndRef,
        clearChats
      } = useChatBotAsst();

  return (
    <div className='chatBotChatComp_wrapper'>
        <div className="chatComponent_top">
            <h4 className="chatComp_title">24/7 Live Assistant</h4>
            <p onClick={clearChats} className="clearChats">Clear Chats</p>
        </div>
        <div className="innteraction_container">
            <div className="chatWindow">
                <ChatWindow chats={chats} streamingData={streamingData} streaming={streaming} messagesEndRef={messagesEndRef} />
            </div>
            <div className="chatInput">
                <ChatInput inputValue={inputValue} setInputValue={setInputValue} sendMessage={sendMessage} closeStreaming={closeStreaming} streaming={streaming} sendBtnActive={sendBtnActive} />
            </div>
        </div>
    </div>
  )
}

export default ChatBotChatComp