import { useState, useEffect, useRef } from "react";
import useLegalAssistStore from "@/store/legalAssistantStore";
import {
  fetchLARecentChats,
  queryLegalAssistant,
} from "@/apiCalls/legalAssist";
import { queueLAChatForDB } from "@/lib/chatBatcher/la-assistantBatcher";
import useAuthStore from "@/store/authStore";

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
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setSendBtnActive(inputValue && !streaming);
  }, [inputValue, streaming]);

  const sendMessage = async () => {
    if (!inputValue || streaming) return;

    const userChat = {
      message: inputValue,
      sender: "user",
      status: "la_request",
      time: new Date(),
    };

    // Update local state + storage
    updateChats(userChat);
    // Queue for batched DB write
    queueLAChatForDB(userChat);

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
        closeStreaming();
        const errorChat = {
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          sender: "bot",
          status: "error",
          time: new Date(),
        };
        updateChats(errorChat);
        queueLAChatForDB(errorChat);
      },
      () => {
        const botChat = {
          message: streamingDataRef.current,
          sender: "bot",
          status: "la_request",
          time: new Date(),
        };
        updateChats(botChat);
        queueLAChatForDB(botChat);
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
      if (streamingDataRef.current) {
        const botChat = {
          message: streamingDataRef.current,
          sender: "bot",
          status: "la_request",
          time: new Date(),
        };

        updateChats(botChat);
        queueLAChatForDB(botChat); // ← Batch this too
      }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    fetchLARecentChats(user, chats, updateChats);
  }, [user, chats.length]);

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
    clearChats,
  };
}
