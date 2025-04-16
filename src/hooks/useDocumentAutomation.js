import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import "@/styles/eDiscovery.css";
import useDocumentAutomationStore from "@/store/useDocumentAutomationStore";
import { queryDocumentAutomation } from "@/apiCalls/queryDocumentAutomation";
import { toast } from "sonner";

const allowedFileTypes = ["application/pdf"];

const useDocumentAutomation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectFileBtnActive, setSelectFileBtnActive] = useState(true);

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
  const controllerRef = useRef(null); // Store Axios cancel signal

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
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
    } else {
      setSelectedFile(null);
      toast.error("Invalid file type.", {
        description: "Upload your pdf form",
        style: { border: "none", color: "red" },
      });
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
      status: "automation_request",
      time: Date.now(),
    });

    setStreaming(true);

    // Create an Axios cancel signal
    controllerRef.current = new AbortController(); 

    const queryResponse = await queryDocumentAutomation(
      selectedFile,
      controllerRef.current
    );

    if (queryResponse.status == "failed") {
      updateDAChats({
        message: (queryResponse?.errorMessage || "")
          .toLowerCase()
          .includes("unauthorized")
          ? "Unauthorized - Please login"
          : (queryResponse?.errorMessage?.includes('Upload cancelled.') ? 'Upload cancelled.' : "Server Error - Please try again."),
        sender: "bot",
        status: 'error',
        time: Date.now(),
      });
    } else {
      updateDAChats({
        message: queryResponse?.excelURL,
        sender: "bot",
        status: "success",
        time: Date.now(),
      });
    }
    setStreaming(false);
  };

  const closeStreaming = () => {
    // Cancel any ongoing request
    controllerRef?.current?.abort();
    setStreaming(false);
  };

  
  useEffect(() => {
    if(streaming) {
      setSelectFileBtnActive(false)
    } else {
      setSelectFileBtnActive(true)
    }
  }, [streaming])

  return {
    selectedFile,
    sendBtnActive,
    sendMessage,
    streaming,
    closeStreaming,
    dAChats,
    fileInputRef,
    handleFileChange,
    addFile,
    messagesEndRef,
    clearDAChats,
    selectFileBtnActive
  };
};

export default useDocumentAutomation;
