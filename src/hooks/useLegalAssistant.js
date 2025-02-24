import { useState, useEffect, useRef } from "react";
import useLegalAssistStore from "@/store/legalAssistantStore";
import { queryLegalAssistant } from "@/apiCalls/legalAssist";

export default function useLegalAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);

  const updateChats = useLegalAssistStore((state) => state.updateChats);
  const clearChats = useLegalAssistStore((state) => state.clearChats);
  const chats = useLegalAssistStore((state) => state.chats);
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

    queryLegalAssistant(
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
        updateChats({
          message: error?.includes("Unauthorized") ? "Unauthorized - Please login" : "Server Error - Please try again.",
          sender: "bot",
          time: Date.now(),
        });
        setStreaming(false);
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
