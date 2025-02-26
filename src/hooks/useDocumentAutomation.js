import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "../app/dashboard/e-discovery/eDiscovery.css";
import useDocumentAutomationStore from "@/store/useDocumentAutomationStore";
import { queryDocumentAutomation } from "@/apiCalls/queryDocumentAutomation";

const allowedFileTypes = [
  "application/pdf",
];

const useDocumentAutomation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const fileInputRef = useRef(null);
  const updateDAChats = useDocumentAutomationStore((state) => state.updateDAChats);
  const clearDAChats = useDocumentAutomationStore((state) => state.clearDAChats);
  const dAChats = useDocumentAutomationStore((state) => state.dAChats);

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
  }, [dAChats]);

  useEffect(() => {
    setSendBtnActive(selectedFile)
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

  const sendMessage = async() => {
    if (!selectedFile || streaming) return;

    updateDAChats({
      fileName: selectedFile.name,
      sender: "user",
      time: Date.now(),
    });

    setStreaming(true);

    const queryResponse = await queryDocumentAutomation(selectedFile);

    if (queryResponse.status == "failed") {
      updateDAChats({
        message: queryResponse.errorMessage,
        sender: "bot",
        time: Date.now(),
      });
    } else {
      updateDAChats({
        message: `Generated Excel Sheet: ${queryResponse.excelURL}`,
        sender: "bot",
        time: Date.now(),
      });
    }
    setStreaming(false);
  };

  const closeStreaming = () => {

  }

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
    clearDAChats
  };
};

export default useDocumentAutomation;
