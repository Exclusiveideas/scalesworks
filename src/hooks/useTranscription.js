import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "@/styles/eDiscovery.css";
import useTranscriptionStore from "@/store/useTranscriptStore";
import {
  fetchTRecentChats,
  queryTranscription,
  queryTranscriptionTask,
} from "@/apiCalls/transcription";
import { updateLastFilteredMessage } from "@/lib/utils";
import { toast } from "sonner";
import { queueTChatForDB } from "@/lib/chatBatcher/transcription-chatBatcher";

const allowedAudioTypes = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
];

const useTranscription = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [selectFileBtnActive, setSelectFileBtnActive] = useState(true);

  // chat window
  const [inputValue, setInputValue] = useState("");
  const [queryBtnActive, setQueryBtnActive] = useState(false);

  const [lastTranscription, setLastTranscription] = useState(null);
  const [recentRequest, setRecentRequest] = useState(null);

  const audioInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateTChats = useTranscriptionStore((state) => state.updateTChats);
  const clearTChats = useTranscriptionStore((state) => state.clearTChats);
  const tChats = useTranscriptionStore((state) => state.tChats);

  const router = useRouter();
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
    }
  }, [user, isHydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tChats]);

  useEffect(() => {
    setSendBtnActive(selectedAudio);
  }, [selectedAudio]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && allowedAudioTypes.includes(file.type)) {
      setSelectedAudio(file); // Store only one file
    } else {
      setSelectedAudio(null);
      toast.error("Invalid file type.", {
        description: "valid type: MP3 or WAV",
        style: { border: "none", color: "red" },
      });
    }
  };

  const addFile = () => {
    audioInputRef.current.click();
  };

  const requestTranscription = () => {
    if (!selectedAudio || streaming) return;

    setRecentRequest("transcription_request");

    const userChat = {
      sender: "user",
      status: "transcription_user_request",
      message: null,
      transcript_name: selectedAudio.name,
      time: new Date(),
    };

    // Update local state + storage
    updateTChats(userChat);
    // Queue for batched DB write
    queueTChatForDB(userChat);

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryTranscription(
      selectedAudio,
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
          transcript_name:
            recentRequest === "transcription_request"
              ? selectedAudio?.name
              : lastTranscription?.transcript_name,
          time: new Date(),
        };
        // Update local state + storage
        updateTChats(errorChat);
        // Queue for batched DB write
        queueTChatForDB(errorChat);
      },
      () => {
        const botChat = {
          sender: "bot",
          status: "transcription_request",
          message: streamingDataRef.current,
          transcript_name: selectedAudio.name,
          time: new Date(),
        };
        // Update local state + storage
        updateTChats(botChat);
        // Queue for batched DB write
        queueTChatForDB(botChat);
        setStreaming(false);
        setStreamingData("");
      },
      abortController
    );
  };

  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      if (streamingDataRef.current) {
        const botChat = {
          sender: "bot",
          status: recentRequest,
          message: streamingDataRef.current,
          transcript_name:
            recentRequest === "transcription_request"
              ? selectedAudio.name
              : lastTranscription?.transcript_name,
          time: new Date(),
        };

        // Update local state + storage
        updateTChats(botChat);
        // Queue for batched DB write
        queueTChatForDB(botChat);
      }
      setStreaming(false);
      setStreamingData("");
      setInputValue("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  const sendTranscriptQuery = () => {
    if (!lastTranscription?.transcript_name || !inputValue || streaming) return;

    setRecentRequest("transcript_task");

    const userChat = {
      sender: "user",
      status: "transcript_task",
      message: inputValue,
      transcript_name: lastTranscription?.transcript_name,
      time: new Date(),
    };

    // Update local state + storage
    updateTChats(userChat);
    // Queue for batched DB write
    queueTChatForDB(userChat);

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryTranscriptionTask(
      inputValue,
      lastTranscription?.message,
      (streamedData) => {
        setStreamingData((prev) => {
          if (prev.endsWith(streamedData)) return prev;
          const updatedData = prev + streamedData;
          streamingDataRef.current = updatedData;
          return updatedData;
        });
      },
      (error) => {
        closeStreaming("task");
        const errorChat = {
          sender: "bot",
          status: "error",
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          transcript_name:
            recentRequest === "transcription_request"
              ? selectedAudio?.name
              : lastTranscription?.transcript_name,
          time: new Date(),
        };
        // Update local state + storage
        updateTChats(errorChat);
        // Queue for batched DB write
        queueTChatForDB(errorChat);
      },
      () => {
        const botChat = {
          sender: "bot",
          status: "transcription_task",
          message: streamingDataRef.current,
          transcript_name: lastTranscription?.transcript_name,
          time: new Date(),
        };
        // Update local state + storage
        updateTChats(botChat);
        // Queue for batched DB write
        queueTChatForDB(botChat);

        setStreaming(false);
        setStreamingData("");
        setInputValue("");
      },
      abortController
    );
  };

  useEffect(() => {
    const hasTranscription = tChats.some(
      (msg) => msg.status === "transcription_request"
    );
    setQueryBtnActive(hasTranscription && !!inputValue);
  }, [tChats, inputValue]);

  useEffect(() => {
    updateLastFilteredMessage(
      tChats,
      setLastTranscription,
      "transcription_request"
    );
  }, [tChats]);

  useEffect(() => {
    if (streaming) {
      setSelectFileBtnActive(false);
    } else {
      setSelectFileBtnActive(true);
    }
  }, [streaming]);

  useEffect(() => {
    fetchTRecentChats(user, tChats, updateTChats);
  }, [user, tChats.length]);

  return {
    selectedAudio,
    sendBtnActive,
    requestTranscription,
    closeStreaming,
    streaming,
    streamingData,
    tChats,
    audioInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearTChats,
    selectFileBtnActive,

    sendTranscriptQuery,
    inputValue,
    setInputValue,
    queryBtnActive,
    lastTranscription,
  };
};

export default useTranscription;
