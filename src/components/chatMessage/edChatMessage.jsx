import Markdown from "react-markdown";
import "./chatMessage.css";

const EDChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
         <p>{chat?.message}</p>
         <p>File(s) used: {chat?.fileNames?.join(',')}</p>
        </>
      ) : (
        <Markdown>{chat?.message}</Markdown>
      )}
    </div>
  );
};

export default EDChatMessage;
