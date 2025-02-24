import { useState, useEffect, useRef } from "react";
import useLegalAssistStore from "@/store/legalAssistantStore";
import { queryLegalAssistant } from "@/apiCalls/legalAssist";
import useAutoScroll from "@/hooks/useAutoScroll";

export default function useLegalAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);

  const updateChats = useLegalAssistStore((state) => state.updateChats);
  const chats = useLegalAssistStore((state) => state.chats);
  const messagesEndRef = useAutoScroll(!!streamingData);

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
        updateChats({ message: `Error - ${error}`, sender: "bot", time: Date.now() });
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
    messagesEndRef
  };
}
