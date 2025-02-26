import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

export const queryDocumentAutomation = async (file) => {
  if (!file) {
    return {
      status: "failed",
      errorMessage: "Error - Please upload your pdf form.",
    };
  }

  return {
    status: "failed",
    errorMessage: "Error - Please upload your pdf form.",
  };
  try {
    // 🔹 Upload Files in ONE Request
    const formData = new FormData();
    formData.append("file", file); // Append the file

    const response = await API.post(`/document-automation`, formData);

    console.log('respose api: ', response)

    return { status: 'success', excelURL: response.data };
  } catch (err) {
    return {
      status: "failed",
      errorMessage:
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Try again.",
    };
  }
};
