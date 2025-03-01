import Markdown from "react-markdown";
import "./chatMessage.css";

const TChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage_message ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
         <p>Audio: {chat?.audioName}</p>
        </>
      ) : (
        <Markdown>{chat?.message}</Markdown>
      )}
    </div>
  );
};

export default TChatMessage;
