import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "../app/platform/e-discovery/eDiscovery.css";
import useDocumentAutomationStore from "@/store/useDocumentAutomationStore";
import { queryDocumentAutomation } from "@/apiCalls/queryDocumentAutomation";
import axios from "axios";

const allowedFileTypes = ["application/pdf"];

const useDocumentAutomation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [error, setError] = useState(null);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const fileInputRef = useRef(null);
  const updateDAChats = useDocumentAutomationStore(
    (state) => state.updateDAChats
  );
  const clearDAChats = useDocumentAutomationStore(
    (state) => state.clearDAChats
  );
  const dAChats = useDocumentAutomationStore((state) => state.dAChats);

  const router = useRouter();
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isHydrated && !user) {
      // router.push("/auth");
    }
  }, [user, isHydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dAChats]);

  useEffect(() => {
    setSendBtnActive(selectedFile);
  }, [streaming, selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError("Invalid file type. Please upload your pdf form.");
    }
  };

  const addFile = () => {
    fileInputRef.current.click();
  };

  const sendMessage = async () => {
    if (!selectedFile || streaming) return;

    updateDAChats({
      fileName: selectedFile.name,
      sender: "user",
      time: Date.now(),
    });

    setStreaming(true);

    // Create a cancel token source
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const queryResponse = await queryDocumentAutomation(
      selectedFile,
      source.token
    );

    if (queryResponse.status == "failed") {
      updateDAChats({
        message: (queryResponse?.errorMessage || "")
          .toLowerCase()
          .includes("unauthorized")
          ? "Unauthorized - Please login"
          : (queryResponse?.errorMessage?.includes('Upload cancelled.') ? 'Upload cancelled.' : "Server Error - Please try again."),
        sender: "bot",
        status: 'failed',
        time: Date.now(),
      });
    } else {
      updateDAChats({
        message: queryResponse?.excelURL,
        sender: "bot",
        status: 'success',
        time: Date.now(),
      });
    }
    setStreaming(false);
  };

  const closeStreaming = () => {
    console.log('close clicked')
    if (cancelTokenSource) {
      cancelTokenSource.cancel("User cancelled the upload");
      setCancelTokenSource(null);
      setStreaming(false);
    }
  };

  return {
    selectedFile,
    sendBtnActive,
    error,
    sendMessage,
    streaming,
    closeStreaming,
    dAChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearDAChats,
  };
};

export default useDocumentAutomation;
