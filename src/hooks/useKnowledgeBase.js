import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import useDialogStore from "@/store/useDialogStore";
import { uploadToKnowledgeBaseAPI } from "@/apiCalls/uploadToKnowledgeBaseAPI";
import axios from "axios";
import { toast } from "sonner";

// Allowed file types

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

export default function useKnowledgeBase() {
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);
  const [tableData, setTableData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);

  const { isOpen, closeDialog, isLoading, updateIsLoading } = useDialogStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const fileInputRef = useRef(null); // Ref for hidden input

  const router = useRouter();
  const cancelTokenRef = useRef(null); // Store Axios cancel token

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }

    getData();
  }, [user, isHydrated]);

  async function getData() {
    // Fetch data from your API here.

    // setTableData([...user?.knowledgeBase])
    setTableData([
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
      {
        id: "728ed52f",
        file_name: "Amendments to SJC Rule 3 12 - Effective March 1 2018.pdf",
      },
    ]);
  }

  const uploadKnowledge = async () => {
    updateIsLoading(true);

    if(selectedFiles.length === 0) {
      toast.error("A file is required.", {
        style: { border: "none", color: "red" },
      });
      updateIsLoading(false);
      return
    }

    // Create an Axios cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const newKnowledge = await uploadToKnowledgeBaseAPI(selectedFiles, cancelTokenRef.current);

      updateIsLoading(false);

      if (newKnowledge?.error) {
        toast.error("Error uploading file(s).", {
          description: newKnowledge?.error,
          style: { border: "none", color: "red" },
        });
        return
      } else {
        toast.success("File(s) successfully uploaded", {
          description: newKnowledge?.message,
          style: { border: "none", color: "green" },
        });

        closeProjectDialog();
        updateUser(newKnowledge?.user);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("File(s) upload request canceled.");
      } else {
        toast.error("Failed to upload File(s) project.");
      }
    }

  };

  const closeKBDialog = () => {
    // Cancel any ongoing request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("File(s) upload request canceled.");
    }
    
    updateIsLoading(false);
    setSelectedFiles([]);
    setError(null);
    closeDialog();
  };

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

  return {
    tableData,
    isLoading,
    uploadKnowledge,
    closeKBDialog,
    handleFileChange,
    selectedFiles,
    fileInputRef,
    error
  };
}
