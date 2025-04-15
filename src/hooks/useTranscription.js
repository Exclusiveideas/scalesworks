import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "@/styles/eDiscovery.css";
import useTranscriptionStore from "@/store/useTranscriptStore";
import {
  queryTranscription,
  queryTranscriptionTask,
} from "@/apiCalls/transcription";
import { updateLastTranscription } from "@/lib/utils";

const allowedAudioTypes = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
];

const useTranscription = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);

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
      // router.push("/");
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
      setError(null);
    } else {
      setSelectedAudio(null);
      setError(
        "Invalid file type. Please select a valid audio file (MP3 or WAV)."
      );
    }
  };

  const addFile = () => {
    audioInputRef.current.click();
  };

  const requestTranscription = () => {
    if (!selectedAudio || streaming) return;

    setRecentRequest('transcription_request')

    updateTChats({
      audioName: selectedAudio.name,
      sender: "user",
      status: "transcript_request",
      transcript_name: selectedAudio.name,
      time: Date.now(),
    });

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
        updateTChats({
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          sender: "bot",
          status: "error",
          time: Date.now(),
        });
      },
      () => {
        updateTChats({
          message: streamingDataRef.current,
          sender: "bot",
          status: "transcription_request",
          transcript_name: selectedAudio.name,
          time: Date.now(),
        });
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
        updateTChats({
          message: streamingDataRef.current,
          sender: "bot",
          status: recentRequest,
          transcript_name:
          recentRequest === "transcription_request"
              ? selectedAudio.name
              : lastTranscription?.transcript_name,
          time: Date.now(),
        });
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
    
    
    setRecentRequest('transcript_task')

    updateTChats({
      transcript_name: lastTranscription?.transcript_name,
      sender: "user",
      status: "transcript_task",
      task: inputValue,
      time: Date.now(),
    });

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
        updateTChats({
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          sender: "bot",
          status: "error",
          time: Date.now(),
        });
      },
      () => {
        updateTChats({
          message: streamingDataRef.current,
          sender: "bot",
          status: "transcription_task",
          transcript_name: lastTranscription?.transcript_name,
          time: Date.now(),
        });
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
    updateLastTranscription(tChats, setLastTranscription);
  }, [tChats]);

  return {
    selectedAudio,
    sendBtnActive,
    error,
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

    sendTranscriptQuery,
    inputValue,
    setInputValue,
    queryBtnActive,
    lastTranscription,
  };
};

export default useTranscription;
