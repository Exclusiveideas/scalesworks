import Markdown from "react-markdown";
import "./chatMessage.css";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const EDChatMessage = ({ chat }) => {
  return (
    <div
      className={`chatMessage_message ${
        chat?.sender == "user" ? "user" : "markdown"
      }`}
    >
      <div className="aitextMessageBlock">
        {chat?.sender == "user" ? (
          <>
            {chat?.message && <p>{chat?.message}</p>}
            <p>File(s) used: {chat?.fileNames?.join(", ")}</p>
          </>
        ) : (
          <div className="aitextMessageBlock">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >{chat?.message}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default EDChatMessage;
