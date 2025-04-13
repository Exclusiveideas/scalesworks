import { useState, useEffect, useRef } from "react";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import axios from "axios";
import { toast } from "sonner";
import { getUsersList, uploadCompanyLogos } from "@/apiCalls/adminDashboardAPI";

export default function useCompanyLogoDialog() {
  const [companyTableData, setCompanyTableData] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({}); // Structure: { "Company ID": FileObject, "Company ID": FileObject }

  const {
    isUpdateCompanyLogoOpen,
    closeUpdateCompanyLogoDialog,
    updateIsCLLoading,
  } = useAdminDashboardStore();

  const controllerRef = useRef(null); // Store Axios cancel signal

  useEffect(() => {
    getData();
  }, [isUpdateCompanyLogoOpen]);

  // Fetch email lists data from the API
  async function getData() {
      try {
        const apiResponse = await getUsersList();
  
        if (apiResponse?.error) {
          toast.error("Error fetching users list.", {
            description: apiResponse?.error,
            style: { border: "none", color: "red" },
          });
          return;
        }

        const tableData = apiResponse?.usersList?.map(user => ({
          id: user?.id,
          company: user?.organization_name ?? "No organization",
          logo_url: user?.logo_url
      }))
  
       setCompanyTableData(tableData);
      } catch (error) {
        console.log("err: ", error);
        toast.error("Failed to fetch users list.");
      }
  }


  async function handleLogoUpload() {
    if (Object.keys(selectedFiles).length === 0) {
      return;
    }

    updateIsCLLoading(true);

    // Create an Axios cancel signal
    controllerRef.current = new AbortController();

    try {
      const apiResponse = await uploadCompanyLogos(
        selectedFiles,
        controllerRef.current
      );

      if (apiResponse?.error) {
        toast.error("Error uploading logo(s).", {
          description: apiResponse?.error,
          style: { border: "none", color: "red" },
        });
      } else {
        toast.success("Successfully uploaded logo(s).", {
          description: apiResponse?.message,
          style: { border: "none", color: "green" },
        });

        closeCLDialog();
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Operation cancelled");
      } else {
        console.log("err: ", error);
        toast.error("Error uploading logo(s).");
      }
    }
    updateIsCLLoading(false);
  }

  // Close email list dialog
  const closeCLDialog = () => {
    // Cancel any ongoing request
    controllerRef?.current?.abort();

    updateIsCLLoading(false);
    closeUpdateCompanyLogoDialog();
  };

  return {
    closeCLDialog,
    companyTableData,
    companyInput,
    setCompanyInput,
    handleLogoUpload,
    selectedFiles,
    setSelectedFiles,
  };
}
