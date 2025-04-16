import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

// interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const uploadToKnowledgeBaseAPI = async (files, controller) => {
    try {
      const formData = new FormData();
  
      // Append each file to FormData
      files.forEach((file) => {
        formData.append("files", file); // "files" must match the backend field name
      });
  
      const response = await API.post(`/chatbot/upload-knowledge`, formData, {
        signal: controller.signal, // cancel signal
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      return { status: response.status, data: response.data };
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
export const fetchKnowledgeBaseData = async (knowledgeBaseIds) => {
  try {
    const response = await API.post("/chatbot/fetch-knowledgebases", {
      knowledgeBaseIds,
    });

    return response.data.knowledgeBases;
  } catch (err) {      
    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem fetching data - Try again.",
    };
  }
}
  
export const deleteKnowledgeBaseData = async (knowledgeBaseId) => {
  try {
    const response = await API.post("/chatbot/delete-knowledge", {
      knowledgeBaseId,
    });

    return response.data.message;
  } catch (err) {      
    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem deleting data - Try again.",
    };
  }
}