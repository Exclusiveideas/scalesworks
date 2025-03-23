import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "../app/platform/e-discovery/eDiscovery.css";
import useTranscriptionStore from "@/store/useTranscriptStore";
import { queryTranscription } from "@/apiCalls/transcription";

const allowedAudioTypes = [
    "audio/mpeg", // MP3
    "audio/wav"   // WAV
  ];

const useTranscription = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);

  const audioInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateTChats = useTranscriptionStore((state) => state.updateTChats);
  const clearTChats = useTranscriptionStore((state) => state.clearTChats);
  const tChats = useTranscriptionStore((state) => state.tChats);

  const router = useRouter();
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
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
      setError("Invalid file type. Please select a valid audio file (MP3 or WAV).");
    }
  };

  const addFile = () => {
    audioInputRef.current.click();
  };

  const sendMessage = () => {
    if (!selectedAudio || streaming) return;

    updateTChats({
      audioName: selectedAudio.name,
      sender: "user",
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
        closeStreaming()
        updateTChats({
          message: error?.includes("Unauthorized") ? "Unauthorized - Please login" : "Server Error - Please try again.",
          sender: "bot",
          time: Date.now(),
        });
      },
      () => {
        updateTChats({ message: streamingDataRef.current, sender: "bot", time: Date.now() });
        setStreaming(false);
        setStreamingData("");
      },
      abortController
    );
  };

  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      updateTChats({
        message: streamingDataRef.current,
        sender: "bot",
        time: Date.now(),
      });
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  return {
    selectedAudio,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    tChats,
    audioInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearTChats
  };
};

export default useTranscription;
