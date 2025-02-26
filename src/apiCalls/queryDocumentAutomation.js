import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

export const queryDocumentAutomation = async (file, cancelToken) => {
  if (!file) {
    return {
      status: "failed",
      errorMessage: "Error - Please upload your pdf form.",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await API.post(`/document-automation`, formData, {
      cancelToken, // Pass the cancel token
    });

    return { status: "success", excelURL: response.data.excelURL };
  } catch (err) {
    if (axios.isCancel(err)) {
      return { status: "failed", errorMessage: "Upload cancelled." };
    }
    return {
      status: "failed",
      errorMessage:
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Try again.",
    };
  }
};
