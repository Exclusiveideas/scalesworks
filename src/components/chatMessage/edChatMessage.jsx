import Markdown from "react-markdown";
import "./chatMessage.css";

const EDChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage_message ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
         {chat?.message && <p>{chat?.message}</p>}
         <p>File(s) used: {chat?.fileNames?.join(', ')}</p>
        </>
      ) : (
        <Markdown>{chat?.message}</Markdown>
      )}
    </div>
  );
};

export default EDChatMessage;
