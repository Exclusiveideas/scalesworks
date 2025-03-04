import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "../app/dashboard/e-discovery/eDiscovery.css";
import useContractReviewStore from "@/store/useContractReviewStore";
import { queryContractReview } from "@/apiCalls/queryContractReview";

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

const useContractReview = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);

  const fileInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateCRChats = useContractReviewStore((state) => state.updateCRChats);
  const clearCRChats = useContractReviewStore((state) => state.clearCRChats);
  const cRChats = useContractReviewStore((state) => state.cRChats);

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
  }, [cRChats]);

  useEffect(() => {
    setSendBtnActive(selectedFiles.length !== 0);
  }, [streaming, selectedFiles]);

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
    if (selectedFiles.length === 0 || streaming) return;

    updateCRChats({
      fileNames: selectedFiles.map((file) => file.name),
      sender: "user",
      time: Date.now(),
    });

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryContractReview(
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
        updateCRChats({
          message: error?.includes("Unauthorized") ? "Unauthorized - Please login" : "Server Error - Please try again.",
          sender: "bot",
          time: Date.now(),
        });
      },
      () => {
        updateCRChats({ message: streamingDataRef.current, sender: "bot", time: Date.now() });
        setStreaming(false);
        setStreamingData("");
      },
      abortController
    );

  };

  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      updateCRChats({
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
    selectedFiles,
    sendBtnActive,
    error,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    cRChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearCRChats
  };
};

export default useContractReview;
