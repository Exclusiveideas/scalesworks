import { useState, useEffect, useRef } from "react";
import useChatBotAsstStore from "@/store/useChatBotAsstStore";
import { queryChatBotAssistant } from "@/apiCalls/queryChatBotAssistant";

export default function useChatBotAsst() {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);

  const updateChats = useChatBotAsstStore((state) => state.updateChats);
  const clearChats = useChatBotAsstStore((state) => state.clearChats);
  const chats = useChatBotAsstStore((state) => state.chats);
  const messagesEndRef = useRef(null)

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);


  useEffect(() => {
    setSendBtnActive(inputValue && !streaming);
  }, [inputValue, streaming]);

  const sendMessage = async () => {
    if (!inputValue || streaming) return;

    updateChats({ message: inputValue, sender: "user", time: Date.now() });

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryChatBotAssistant(
      inputValue,
      (streamedData) => {
        setStreamingData((prev) => {
          if (prev.endsWith(streamedData)) return prev;
          const updatedData = prev + streamedData;
          streamingDataRef.current = updatedData;
          return updatedData;
        });
      },
      (error) => {
        console.log('err: ',  error)
        closeStreaming()
        updateChats({
          message: error?.includes("Unauthorized") ? "Unauthorized - Please login" : "Server Error - Please try again.",
          sender: "bot",
          time: Date.now(),
        });
      },
      () => {
        updateChats({ message: streamingDataRef.current, sender: "bot", time: Date.now() });
        setStreaming(false);
        setStreamingData("");
      },
      abortController
    );

    setInputValue("");
  };

  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      updateChats({ message: streamingDataRef.current, sender: "bot", time: Date.now() });
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  return {
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    chats,
    messagesEndRef,
    clearChats
  };
}
