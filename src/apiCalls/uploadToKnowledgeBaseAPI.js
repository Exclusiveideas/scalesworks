import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

export const uploadToKnowledgeBaseAPI = async (files, cancelToken) => {
    try {
      const formData = new FormData();
  
      // Append each file to FormData
      files.forEach((file) => {
        formData.append("files", file); // "files" must match the backend field name
      });
  
      const response = await API.post(`/chatbot/upload-knowledge`, formData, {
        cancelToken: cancelToken?.token, // Pass cancel token
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      console.log("response: ", response);
    //   return { status: response.status, user: response.data };
      return { error: 'response.status', };
    } catch (err) {
      if (axios.isCancel(err)) {
        console.warn("Upload cancelled by user");
        return { error: "Upload cancelled" };
      }
  
      return {
        error:
          typeof err?.response?.data?.error === "string"
            ? err.response.data.error
            : typeof err?.message === "string"
            ? err.message
            : "Problem uploading file(s) - Try again.",
      };
    }
  };
  