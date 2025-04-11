import { useState, useEffect, useRef } from "react";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import { validateEmails } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { addToEmailList, getEmailLists } from "@/apiCalls/adminDashboardAPI";
import { v4 as uuidv4 } from "uuid"; // to create unique ids

export default function useEmailListDialog() {
  const [error, setError] = useState(null);
  const [whitelistedList, setWhitelistedList] = useState([]);
  const [blacklistedList, setBlacklistedList] = useState([]);
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

      handleAddEmail(apiResponse?.whitelisted, setWhitelistedList); // update whitelisted email list
      handleAddEmail(apiResponse?.blacklisted, setBlacklistedList); // update blacklisted email list
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
    setError(null);
    closeEmailListDialog();
  };

  // Handle adding new emails to the list and ensuring no duplicates
  const handleAddEmail = (emails, setFunction) => {
    const emailsArray = Array.isArray(emails) ? emails : Array.from(emails);

    // Create a Set for uniqueness and ensure no duplicate emails
    const emailSet = new Set(emailsArray.map((email) => email.trim()));

    setFunction(prevList => {
      // Convert current list to a Set for uniqueness check
      const existingEmailsSet = new Set(prevList.map(item => item.email));

      // Combine new emails with current list, avoiding duplicates
      const updatedList = [
        ...prevList,
        ...Array.from(emailSet).filter(email => !existingEmailsSet.has(email)).map(email => ({
          id: uuidv4(),
          email
        }))
      ];

      // Return the updated state with a new reference
      return [...updatedList];
    });
  };

  

  return {
    isLoading,
    closeELDialog,
    error,
    emailListData: whitelistedList,
    blacklistedList,
    uploadNewEmails,
    emailInput,
    setEmailInput
  };
}
