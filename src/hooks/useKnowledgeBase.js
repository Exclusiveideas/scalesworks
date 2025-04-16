import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import useDialogStore from "@/store/useDialogStore";
import {
  deleteKnowledgeBaseData,
  fetchKnowledgeBaseData,
  uploadToKnowledgeBaseAPI,
} from "@/apiCalls/uploadToKnowledgeBaseAPI";
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
  "text/markdown",
];

export default function useKnowledgeBase() {
  const { user } = useAuthStore();
  const isHydrated = useHydrationZustand(useAuthStore);
  const [tableData, setTableData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [deletingKnowledge, setDeletingKnowledge] = useState(false);

  const { closeDialog, isLoading, updateIsLoading } = useDialogStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const fileInputRef = useRef(null); // Ref for hidden input

  const router = useRouter();
  const controllerRef = useRef(null); // Store Axios cancel signal

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
    }

    getData();
  }, [user, isHydrated]);

  async function getData() {
    if (!user?.knowledgeBase) return;

    try {
      const knowledgeBaseData = await fetchKnowledgeBaseData(
        user?.knowledgeBase
      );
      if (knowledgeBaseData?.error) {
        toast.error("Error fetching knowledge base.", {
          description: knowledgeBaseData?.error,
          style: { border: "none", color: "red" },
        });
        return;
      }

      setTableData(
        knowledgeBaseData?.map((data) => ({
          file_name: data?.file_name,
          id: data?.id,
        }))
      );
    } catch (error) {
      toast.error("Error fetching knowledge base.", {
        description: error,
        style: { border: "none", color: "red" },
      });
    }
  }

  const uploadKnowledge = async () => {
    updateIsLoading(true);

    if (selectedFiles.length === 0) {
      toast.error("A file is required.", {
        style: { border: "none", color: "red" },
      });
      updateIsLoading(false);
      return;
    }

    // Create an Axios cancel signal
    controllerRef.current = new AbortController();

    try {
      const newKnowledge = await uploadToKnowledgeBaseAPI(
        selectedFiles,
        controllerRef.current
      );

      updateIsLoading(false);

      if (newKnowledge?.error) {
        toast.error("Error uploading file(s).", {
          description: newKnowledge?.error,
          style: { border: "none", color: "red" },
        });
        return;
      } else {
        const updatedUser = newKnowledge?.data?.updatedUser;
        const errors = newKnowledge?.data?.errors;
        console.log("updatedUser: ", updatedUser);

        if (errors?.length > 0) {
          for (const error of errors) {
            toast.error("File(s) successfully uploaded with errors.", {
              description: error,
              style: { border: "none", color: "red" },
            });
          }
        } else {
          toast.success("File(s) successfully uploaded", {
            description: newKnowledge?.message,
            style: { border: "none", color: "green" },
          });
        }

        closeKBDialog();
        console.log("updatedUser: ", updatedUser);
        updateUser(updatedUser[0]);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("File(s) upload request canceled.");
      } else {
        console.log("err: ", error);
        toast.error("Failed to upload File(s) project.");
      }
    }
  };

  const closeKBDialog = () => {
    // Cancel any ongoing request
    controllerRef?.current?.abort();

    updateIsLoading(false);
    setSelectedFiles([]);
    setError(null);
    closeDialog();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (validFiles.length) {
      setSelectedFiles(validFiles);
      setError(null);
    } else {
      setSelectedFiles([]);
      setError("Invalid file type(s). Please select valid documents.");
    }
  };

  const handleDelete = async (docID) => {
    if (!docID) return;

    setDeletingKnowledge(true);

    try {
      const response = await deleteKnowledgeBaseData(docID);
      if (response?.error) {
        toast.error("Error deleting knowledge.", {
          description: response?.error,
          style: { border: "none", color: "red" },
        });
      } else {
        toast.success("Successfully deleted knowledge.", {
          description: "reloading page",
          style: {
            border: "none",
            color: "green",
          },
        });

        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 2000);
      }
    } catch (error) {
      toast.error("Error deleting knowledge.", {
        description: error,
        style: { border: "none", color: "red" },
      });
    }

    setDeletingKnowledge(false);
  };

  return {
    tableData,
    isLoading,
    uploadKnowledge,
    closeKBDialog,
    handleFileChange,
    selectedFiles,
    fileInputRef,
    error,
    handleDelete,
    deletingKnowledge
  };
}
