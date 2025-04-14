import { useState, useEffect, useRef } from "react";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import { validateEmails } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { callBlacklistEmails, callWhitelistEmails, getEmailLists } from "@/apiCalls/adminDashboardAPI";
import { v4 as uuidv4 } from "uuid"; // to create unique ids

export default function useEmailListDialog() {
  const [emailListData, setEmailListData] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  const { isEmailListOpen, closeEmailListDialog, blIsLoading, wlIsLoading, updateWLIsLoading, updateBLIsLoading } =
    useAdminDashboardStore();

    const controllerRef = useRef(null); // Store Axios cancel signal

  useEffect(() => {
    getData();
  }, [isEmailListOpen])

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

  // whitelist new emails 
  const whiteListNewEmails = async (emails) => {
    if (!emails) return;

    const response = validateEmails(emails);

    if (!response?.allValid) {
      toast.error("Invalid email(s)", {
        description: response?.invalidEmails?.join(", "),
        style: { border: "none", color: "red" },
      });
      return;
    }

    updateWLIsLoading(true);

    // Create an Axios cancel signal
    controllerRef.current = new AbortController(); 

    try {
      const apiResponse = await callWhitelistEmails(
        response?.emails,
        controllerRef.current
      );


      if (apiResponse?.error) {
        toast.error("Error whitelisting email(s).", {
          description: apiResponse?.error,
          style: { border: "none", color: "red" },
        });
      } else {
        toast.success("Successfully whitelisted email(s).", {
          description: apiResponse?.message,
          style: { border: "none", color: "green" },
        });

        setEmailInput(""); // clear input box
        closeELDialog()
      }

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Operation cancelled");
      } else {
        console.log("err: ", error);
        toast.error("Error whitelisting email(s).");
      }
    }
      updateWLIsLoading(false);
  };

  
  const blacklistNewEmails = async (emails) => {
    if (!emails) return;

    const response = validateEmails(emails);

    if (!response?.allValid) {
      toast.error("Invalid email(s)", {
        description: response?.invalidEmails?.join(", "),
        style: { border: "none", color: "red" },
      });
      return;
    }

    updateBLIsLoading(true);
    
    // Create an Axios cancel signal
    controllerRef.current = new AbortController(); 


    try {
      const apiResponse = await callBlacklistEmails(
        response?.emails,
        controllerRef.current
      );


      if (apiResponse?.error) {
        toast.error("Error blacklisting email(s).", {
          description: apiResponse?.error,
          style: { border: "none", color: "red" },
        });
      } else {
        toast.success("Successfully blacklisted email(s).", {
          description: apiResponse?.message,
          style: { border: "none", color: "green" },
        });

        setEmailInput(""); // clear input box
        closeELDialog()
      }

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Operation cancelled");
      } else {
        console.log("err: ", error);
        toast.error("Error blacklisting email(s).");
      }
    }
      updateBLIsLoading(false);
  }

  // Close email list dialog
  const closeELDialog = () => {
    // Cancel any ongoing request
    controllerRef?.current?.abort();

    updateWLIsLoading(false);
    updateBLIsLoading(false);
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
    wlIsLoading,
    blIsLoading,
    closeELDialog,
    emailListData,
    whiteListNewEmails,
    blacklistNewEmails,
    emailInput,
    setEmailInput
  };
}
