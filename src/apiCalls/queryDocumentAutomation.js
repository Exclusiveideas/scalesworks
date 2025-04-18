import axios from "axios";
import { toast } from "sonner";

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


export const queryDocumentAutomation = async (file, controller) => {
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
      signal: controller.signal,
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


export const fetchDARecentChats = async (user, dAChats, overrideDAChats) => {
  if (dAChats.length === 0 && user) {
    try {
      const response = await API.get(`/document-automation/fetch-recent-chats`,
        {
          params: { userId: user.id },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Server failed with status ${response.status}`);
      }

      const { chats } = response.data;
      const recentChats = chats.slice(-50); // keep last 50

      overrideDAChats(recentChats);
    } catch (err) {
      toast.error("Failed to fetch chats", {
        description: err.message || err,
        style: {
          border: "none",
          color: "red",
        },
      });
    }
  }
};
