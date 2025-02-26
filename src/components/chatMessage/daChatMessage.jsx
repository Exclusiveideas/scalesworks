import "./chatMessage.css";

const DAChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
         <p>Form name: {chat?.fileName}</p>
        </>
      ) : (
        <p>{chat?.message}</p>
      )}
    </div>
  );
};

export default DAChatMessage;
