import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

// interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const callWhitelistEmails = async (emails, cancelToken) => {
  try {
    const response = await API.post(
      `/admin/whitelist-email`,
      {
        emails,
      },
      {
        cancelToken: cancelToken?.token, // Pass cancel token
      }
    );

    const { message } = response.data;

    return { message };
  } catch (err) {
    if (axios.isCancel(err)) {
      console.warn("Update cancelled by user");
      return { error: "Update cancelled" };
    }

    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem updating whitelisted emails - Try again.",
    };
  }
};


export const callBlacklistEmails = async (emails, cancelToken) => {
  try {
    const response = await API.post(
      `/admin/blacklist-email`,
      {
        emails,
      },
      {
        cancelToken: cancelToken?.token, // Pass cancel token
      }
    );

    const { message } = response.data;

    return { message };
  } catch (err) {
    if (axios.isCancel(err)) {
      console.warn("Blacklist cancelled by user");
      return { error: "Operation cancelled" };
    }

    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem blacklisting emails - Try again.",
    };
  }
}

export const getEmailLists = async () => {
  try {
    const response = await API.get(`/admin/fetch-email-list`);

    const { whitelisted, blacklisted } = response.data;

    return { whitelisted, blacklisted };
  } catch (err) {
    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem fetching email list - Try again.",
    };
  }
};
