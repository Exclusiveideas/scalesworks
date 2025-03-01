import "./chatMessage.css";

const DAChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage_message ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
          <p>Form name: {chat?.fileName}</p>
        </>
      ) : (
        <>
          {chat?.status == "success" ? (
            <p>
              Generated Excel Sheet:{" "}
              <a href={chat?.message} target="_blank" rel="noopener noreferrer">
                <span className="downloadText">download_sheet</span>
              </a>
            </p>
          ) : (
            <p>{chat?.message}</p>
          )}
        </>
      )}
    </div>
  );
};

export default DAChatMessage;
