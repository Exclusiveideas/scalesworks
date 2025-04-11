import { useState, useEffect, useRef } from "react";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import { validateEmails } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { addToEmailList, getEmailLists } from "@/apiCalls/adminDashboardAPI";
import { v4 as uuidv4 } from "uuid"; // to create unique ids

export default function useEmailListDialog() {
  const [emailListData, setEmailListData] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  const { isEmailListOpen, closeEmailListDialog, isLoading, updateIsLoading } =
    useAdminDashboardStore();

  const cancelTokenRef = useRef(null); // Store Axios cancel token

  useEffect(() => {
    getData();
  }, [isEmailListOpen]);

  // Fetch email lists data from the API
  async function getData() {
    try {
      const apiResponse = await getEmailLists();

      if (apiResponse?.error) {
        toast.error("Error fetching email list.", {
          description: apiResponse?.error,
          style: { border: "none", color: "red" },
        });
        return;
      }

      handleAddEmail(apiResponse?.whitelisted, apiResponse?.blacklisted); // update whitelisted email list
    } catch (error) {
      console.log("err: ", error);
      toast.error("Failed to fetch email list.");
    }
  }

  // Upload new emails to the list
  const uploadNewEmails = async (emails) => {
    if (!emails) return;

    const response = validateEmails(emails);

    if (!response?.allValid) {
      toast.error("Invalid email(s)", {
        description: response?.invalidEmails?.join(", "),
        style: { border: "none", color: "red" },
      });
      return;
    }

    updateIsLoading(true);

    // Create an Axios cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const apiResponse = await addToEmailList(
        response?.emails,
        cancelTokenRef.current
      );

      updateIsLoading(false);

      if (apiResponse?.error) {
        toast.error("Error updating email list.", {
          description: apiResponse?.error,
          style: { border: "none", color: "red" },
        });
        return;
      } else {
        toast.success("Successfully updated email list", {
          description: apiResponse?.message,
          style: { border: "none", color: "green" },
        });

        setEmailInput(""); // clear input box
        closeELDialog()
      }

      updateIsLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Error updating email list.");
      } else {
        console.log("err: ", error);
        toast.error("Error updating email list.");
      }
    }
  };

  // Close email list dialog
  const closeELDialog = () => {
    // Cancel any ongoing request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("File(s) upload request canceled.");
    }

    updateIsLoading(false);
    closeEmailListDialog();
  };

  // Handle adding new emails to the list and ensuring no duplicates
  const handleAddEmail = (whitelistedEmails, blacklistedEmails) => {
    // Ensure whitelisted and blacklisted emails are arrays and unique
    const whitelistedEmailsArray = Array.isArray(whitelistedEmails) ? whitelistedEmails : Array.from(whitelistedEmails);
    const blacklistedEmailsArray = Array.isArray(blacklistedEmails) ? blacklistedEmails : Array.from(blacklistedEmails);
  
    // Create Sets for uniqueness
    const whitelistedSet = new Set(whitelistedEmailsArray.map((email) => email.trim()));
    const blacklistedSet = new Set(blacklistedEmailsArray.map((email) => email.trim()));
  
    // Directly replace the current list with the new emails, setting them with their status
    const updatedList = [
      ...Array.from(whitelistedSet).map(email => ({
        id: uuidv4(),
        email,
        status: "whitelisted"
      })),
      ...Array.from(blacklistedSet).map(email => ({
        id: uuidv4(),
        email,
        status: "blacklisted"
      }))
    ];
  
    // Replace the state with the updated list
    setEmailListData(updatedList);
  };
  

  

  return {
    isLoading,
    closeELDialog,
    emailListData,
    uploadNewEmails,
    emailInput,
    setEmailInput
  };
}
