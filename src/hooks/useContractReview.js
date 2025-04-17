import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "@/styles/eDiscovery.css";
import useContractReviewStore from "@/store/useContractReviewStore";
import {
  queryContractReview,
  queryContractReviewTask,
} from "@/apiCalls/queryContractReview";
import { toast } from "sonner";
import { updateLastFilteredMessage } from "@/lib/utils";
import { fetchLARecentChats } from "@/apiCalls/legalAssist";

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

const useContractReview = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [selectFileBtnActive, setSelectFileBtnActive] = useState(true);

  const fileInputRef = useRef(null);
  const streamingDataRef = useRef("");
  const eventSourceRef = useRef(null);
  const updateCRChats = useContractReviewStore((state) => state.updateCRChats);
  const clearCRChats = useContractReviewStore((state) => state.clearCRChats);
  const cRChats = useContractReviewStore((state) => state.cRChats);

  //
  const [inputValue, setInputValue] = useState("");
  const [queryBtnActive, setQueryBtnActive] = useState(false);

  const [lastReview, setLastReview] = useState(null);
  const [recentRequest, setRecentRequest] = useState(null);

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
  }, [cRChats]);

  useEffect(() => {
    setSendBtnActive(selectedFiles.length !== 0);
  }, [streaming, selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (validFiles.length) {
      setSelectedFiles(validFiles);
    } else {
      setSelectedFiles([]);
      toast.error("Invalid file type.", {
        description:
          "valid types: .pdf, .doc, .docx, .txt, .xls, .xlsx, .csv, .md",
        style: { border: "none", color: "red" },
      });
    }
  };

  const addFile = () => {
    fileInputRef.current.click();
  };

  const requestContractReview = () => {
    if (selectedFiles.length === 0 || streaming) return;

    setRecentRequest("review_request");

    const userChat = {
      sender: "user",
      status: "review_user_request",
      message: "Contract(s) review",
      fileNames: selectedFiles.map((file) => file.name),
      time: new Date(),
    };

    // Update local state + storage
    updateCRChats(userChat);
    // Queue for batched DB write
    queueCRChatForDB(userChat);

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
        closeStreaming();
        const errorChat = {
          sender: "bot",
          status: "error",
          message: error?.includes("Unauthorized")
            ? "Unauthorized - Please login"
            : "Server Error - Please try again.",
          fileNames: selectedFiles.map((file) => file.name),
          time: new Date(),
        };

        // Update local state + storage
        updateCRChats(errorChat);
        // Queue for batched DB write
        queueCRChatForDB(errorChat);
      },
      () => {
        const botChat = {
          sender: "bot",
          status: "review_request",
          message: streamingDataRef.current,
          fileNames: selectedFiles.map((file) => file.name),
          time: new Date(),
        };
        // Update local state + storage
        updateCRChats(botChat);
        // Queue for batched DB write
        queueCRChatForDB(botChat);

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
          fileNames:
            recentRequest === "review_request"
              ? selectedFiles.map((file) => file.name)
              : lastReview?.fileNames,
          time: new Date(),
        };
        // Update local state + storage
        updateCRChats(botChat);
        // Queue for batched DB write
        queueCRChatForDB(botChat);
      }
      setStreaming(false);
      setStreamingData("");
      streamingDataRef.current = "";
      eventSourceRef.current = null;
    }
  };

  // review query functions

  const sendReviewQuery = () => {
    if (!lastReview?.fileNames || !inputValue || streaming) return;

    setRecentRequest("review_task");

    const userChat = {
      sender: "user",
      status: "review_task",
      message: inputValue,
      fileNames: lastReview?.fileNames,
      time: new Date(),
    };

    // Update local state + storage
    updateCRChats(userChat);
    // Queue for batched DB write
    queueCRChatForDB(userChat);

    setStreaming(true);
    setStreamingData("");
    streamingDataRef.current = "";

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    queryContractReviewTask(
      inputValue,
      lastReview?.message,
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
          fileNames: lastReview?.fileNames,
          time: new Date(),
        };
        // Update local state + storage
        updateCRChats(errorChat);
        // Queue for batched DB write
        queueCRChatForDB(errorChat);
      },
      () => {
        const botChat = {
          sender: "bot",
          status: "review_task",
          message: streamingDataRef.current,
          fileNames: lastReview?.fileNames,
          time: new Date(),
        };
        // Update local state + storage
        updateCRChats(botChat);
        // Queue for batched DB write
        queueCRChatForDB(botChat);
        setStreaming(false);
        setStreamingData("");
        setInputValue("");
      },
      abortController
    );
  };

  useEffect(() => {
    const hasTranscription = cRChats.some(
      (msg) => msg.status === "review_request"
    );
    setQueryBtnActive(hasTranscription && !!inputValue);
  }, [cRChats, inputValue]);

  useEffect(() => {
    updateLastFilteredMessage(cRChats, setLastReview, "review_request");
  }, [cRChats]);

  useEffect(() => {
    if (streaming) {
      setSelectFileBtnActive(false);
    } else {
      setSelectFileBtnActive(true);
    }
  }, [streaming]);

  useEffect(() => {
    fetchLARecentChats(user, cRChats, updateCRChats);
  }, [user, cRChats.length]);

  return {
    selectedFiles,
    sendBtnActive,
    requestContractReview,
    closeStreaming,
    streaming,
    streamingData,
    cRChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearCRChats,
    selectFileBtnActive,

    sendReviewQuery,
    inputValue,
    setInputValue,
    queryBtnActive,
    lastReview,
  };
};

export default useContractReview;
