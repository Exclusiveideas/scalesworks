import Markdown from "react-markdown";
import "./chatMessage.css";

const TChatMessage = ({ chat }) => {
  return (
    <div
      className={`chatMessage_message ${
        chat?.sender == "user" ? "user" : "markdown"
      }`}
    >
      {chat?.sender == "user" ? (
        <>
          <p>Audio: {chat?.audioName}</p>
        </>
      ) : (
        <div className="aitextMessageBlock">
          <Markdown>{chat?.message}</Markdown>
        </div>
      )}
    </div>
  );
};

export default TChatMessage;
