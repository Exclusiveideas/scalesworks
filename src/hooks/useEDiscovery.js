import { useState, useEffect, useRef } from "react";
import useEDiscoveryStore from "@/store/useEDiscoveryStore";
import { fetchEDRecentChats, queryEDiscovery } from "@/apiCalls/eDiscovery";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "@/styles/eDiscovery.css";
import { toast } from "sonner";
import { queueEDChatForDB } from "@/lib/chatBatcher/ed-chatBatcher";

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/markdown",
];

const useEDiscovery = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [selectFileBtnActive, setSelectFileBtnActive] = useState(true);

  const fileInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateEDChats = useEDiscoveryStore((state) => state.updateEDChats);
  const clearEDChats = useEDiscoveryStore((state) => state.clearEDChats);
  const edChats = useEDiscoveryStore((state) => state.edChats);

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
  }, [edChats]);

  useEffect(() => {
    setSendBtnActive(inputValue && selectedFiles.length !== 0);
  }, [inputValue, streaming, selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Check if the number of selected files exceeds the max limit (5)
    if (files.length > 5) {
      toast.error("You can only select up to 5 files.", {
        description: "Please remove some files to proceed.",
        style: { border: "none", color: "red" },
      });
      return;
    }

    // Filter valid files based on allowed types
    const validFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (validFiles.length === files.length) {
      setSelectedFiles(validFiles);
    } else {
      setSelectedFiles([]);
      toast.error("Invalid file type.", {
        description:
          "Valid types: .pdf, .doc, .docx, .txt, .xls, .xlsx, .csv, .md",
        style: { border: "none", color: "red" },
      });
    }
  };

  const addFile = () => {
    fileInputRef.current.click();
  };

  const sendMessage = () => {
    if (!inputValue || selectedFiles.length === 0 || streaming) return;

    const userChat = {
      message: inputValue,
      fileNames: selectedFiles.map((file) => file.name),
      sender: "user",
      status: "e_discovery",
      time: new Date(),
    };

    // Update local state + storage
    updateEDChats(userChat);
    // Queue for batched DB write
    queueEDChatForDB(userChat);

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
        closeStreaming();
        const errorChat = {
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          sender: "bot",
          status: "error",
          time: new Date(),
        };
        // Update local state + storage
        updateEDChats(errorChat);
        // Queue for batched DB write
        queueEDChatForDB(errorChat);
      },
      () => {
        const botChat = {
          message: streamingDataRef.current,
          sender: "bot",
          fileNames: selectedFiles.map((file) => file.name),
          status: "e_discovery",
          time: new Date(),
        };
        // Update local state + storage
        updateEDChats(botChat);
        // Queue for batched DB write
        queueEDChatForDB(botChat);
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
          status: "e_discovery",
          time: new Date(),
        };

        // Update local state + storage
        updateEDChats(botChat);
        // Queue for batched DB write
        queueEDChatForDB(botChat);
      }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    if (streaming) {
      setSelectFileBtnActive(false);
    } else {
      setSelectFileBtnActive(true);
    }
  }, [streaming]);

  useEffect(() => {
    fetchEDRecentChats(user, edChats, updateEDChats);
  }, [user, edChats.length]);

  return {
    inputValue,
    setInputValue,
    selectedFiles,
    sendBtnActive,
    sendMessage,
    closeStreaming,
    streaming,
    streamingData,
    edChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearEDChats,
    selectFileBtnActive,
  };
};

export default useEDiscovery;
