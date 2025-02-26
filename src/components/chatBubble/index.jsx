import Image from "next/image";
import "./chatBubble.css";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ChatBotChatComp from "../chatBotChatComp";

  
const ChatBubble = () => {
  return (
    <div className="chatBubble_wrapper">
      <Popover className="popOver">
        <PopoverTrigger asChild>
          <Image
            src={`/icons/robot_white.png`}
            width={70}
            height={70}
            alt="robot Image"
            className="chatBubble_face"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 popOverContent">
            <ChatBotChatComp />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatBubble;
