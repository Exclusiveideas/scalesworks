import { useState, useEffect, useRef } from "react";
import useEDiscoveryStore from "@/store/useEDiscoveryStore";
import { queryEDiscovery } from "@/apiCalls/eDiscovery";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "../app/platform/e-discovery/eDiscovery.css";

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/markdown"
];

const useEDiscovery = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);

  const fileInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateEDChats = useEDiscoveryStore((state) => state.updateEDChats);
  const clearEDChats = useEDiscoveryStore((state) => state.clearEDChats);
  const edChats = useEDiscoveryStore((state) => state.edChats);

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
  }, [edChats]);

  useEffect(() => {
    setSendBtnActive(inputValue && selectedFiles.length !== 0);
  }, [inputValue, streaming, selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => allowedFileTypes.includes(file.type));

    if (validFiles.length) {
      setSelectedFiles(validFiles);
      setError(null);
    } else {
      setSelectedFiles([]);
      setError("Invalid file type(s). Please select valid documents.");
    }
  };

  const addFile = () => {
    fileInputRef.current.click();
  };

  const sendMessage = () => {
    if (!inputValue || selectedFiles.length === 0 || streaming) return;

    updateEDChats({
      message: inputValue,
      fileNames: selectedFiles.map((file) => file.name),
      sender: "user",
      time: Date.now(),
    });

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryEDiscovery(
      inputValue,
      selectedFiles,
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
        updateEDChats({
          message: error?.includes("Unauthorized") ? "Unauthorized - Please login" : "Server Error - Please try again.",
          sender: "bot",
          time: Date.now(),
        });
      },
      () => {
        updateEDChats({ message: streamingDataRef.current, sender: "bot", time: Date.now() });
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
      updateEDChats({
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
    inputValue,
    setInputValue,
    selectedFiles,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    edChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearEDChats
  };
};

export default useEDiscovery;
