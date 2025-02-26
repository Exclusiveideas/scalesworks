import "./chatMessage.css";

const TChatMessage = ({ chat }) => {
  return (
    <div className={`chatMessage ${chat?.sender == "user" && "user"}`}>
      {chat?.sender == "user" ? (
        <>
         <p>Audio: {chat?.audioName}</p>
        </>
      ) : (
        <p>{chat?.message}</p>
      )}
    </div>
  );
};

export default TChatMessage;
