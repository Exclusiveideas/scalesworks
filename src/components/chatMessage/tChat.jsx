import Markdown from "react-markdown";
import "./chatMessage.css";
import { AudioLines } from "lucide-react";

const TChatMessage = ({ chat }) => {
  return (
    <div className="chatMessage_wrapper">
      <div
        className={`chatMessage_message ${
          chat?.sender == "user" ? "user" : "markdown"
        } ${chat?.status == "error" && "error"}`}
      >
        {chat?.sender == "user" ? (
          <>
            {chat?.status === "transcription_user_request" ? (
              <p>Transcribe this audio</p>
            ) : (
              <p>{chat?.message}</p>
            )}
          </>
        ) : (
          <div className="aitextMessageBlock">
            <Markdown>{chat?.message}</Markdown>
          </div>
        )}
      </div>
        {chat?.transcript_name && (
          <div
            className={`transcriptionAITxt-container ${
              chat?.sender == "user" ? "user" : "markdown"
            }`}
          >
            <AudioLines size={16} />
            <p className="transcriptionAITxt">
              Transcript file:{" "}
              {chat?.transcript_name.length > 25
                ? `${chat?.transcript_name.slice(0, 25)}...`
                : chat?.transcript_name}
            </p>
          </div>
        )}
    </div>
  );
};

export default TChatMessage;
