import Markdown from "react-markdown";
import "./chatMessage.css";

const ChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage ${chat?.sender == "user" && "user"}`}>
      {chat?.sender !== "user" ? (
        <Markdown>{chat?.message}</Markdown>
      ) : (
        <p>{chat?.message}</p>
      )}
    </div>
  );
};

export const ChatLoader = () => {
  return (
    <div className={`chatMessage loading`}>
        <div className="loader"></div>
    </div>
  );
};

export default ChatMessage;
