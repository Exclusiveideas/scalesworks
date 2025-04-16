import Markdown from "react-markdown";
import "./edChatMessage.css";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FileChartColumn } from "lucide-react";

const EDChatMessage = ({ chat }) => {
  return (
    <div className="chatMessage_wrapper">
      <div
        className={`chatMessage_message ${
          chat?.sender == "user" ? "user" : "markdown"
        } ${chat?.status == "error" && "error"}`}
      >
        <div className="aitextMessageBlock">
          {chat?.sender == "user" ? (
            <>{chat?.message && <p>{chat?.message}</p>}</>
          ) : (
            <div className="aitextMessageBlock">
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {chat?.message}
              </Markdown>
            </div>
          )}
        </div>
      </div>
      {chat?.fileNames?.length > 0 && (
        <div
          className={`eDiscoveryAITxt-container ${
            chat?.sender == "user" ? "user" : "markdown"
          }`}
        >
          <FileChartColumn size={16} />
          <p className="eDiscoveryAITxt">
            File(s):{" "}
            {chat?.fileNames
              ?.map((name) =>
                name.length > 20 ? `${name.slice(0, 20)}...` : name
              )
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default EDChatMessage;
