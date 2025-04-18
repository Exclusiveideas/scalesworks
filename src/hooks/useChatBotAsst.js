import { useState, useEffect, useRef } from "react";
import useChatBotAsstStore from "@/store/useChatBotAsstStore";
import {
  fetchCBARecentChats,
  queryChatBotAssistant,
} from "@/apiCalls/queryChatBotAssistant";
import { queueCBAChatForDB } from "@/lib/chatBatcher/cba-assistantBatcher";
import useAuthStore from "@/store/authStore";

export default function useChatBotAsst() {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);

  const { user } = useAuthStore();

  const updateChats = useChatBotAsstStore((state) => state.updateChats);
  const overrideChats = useChatBotAsstStore((state) => state.overrideChats);
  const clearChats = useChatBotAsstStore((state) => state.clearChats);
  const chats = useChatBotAsstStore((state) => state.chats);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setSendBtnActive(inputValue && !streaming);
  }, [inputValue, streaming]);

  const sendMessage = async () => {
    if (!inputValue || streaming) return;

    const userChat = {
      sender: "user",
      status: "cb_request",
      message: inputValue,
      time: new Date(),
    };

    // Update local state + storage
    updateChats(userChat);
    // Queue for batched DB write
    queueCBAChatForDB(userChat);

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
        closeStreaming();
        const errorChat = {
          sender: "bot",
          status: "error",
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          time: new Date(),
        };
        // Update local state + storage
        updateChats(errorChat);
        // Queue for batched DB write
        queueCBAChatForDB(errorChat);
      },
      () => {
        const botChat = {
          sender: "bot",
          status: "cb_request",
          message: streamingDataRef.current,
          time: new Date(),
        };
        // Update local state + storage
        updateChats(botChat);
        // Queue for batched DB write
        queueCBAChatForDB(botChat);

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
          sender: "bot",
          status: "cb_request",
          message: streamingDataRef.current,
          time: new Date(),
        };
        // Update local state + storage
        updateChats(botChat);
        // Queue for batched DB write
        queueCBAChatForDB(botChat);
      }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    fetchCBARecentChats(user, chats, overrideChats);
  }, [user]);

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
