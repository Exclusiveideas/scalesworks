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

export const callWhitelistEmails = async (emails, controller) => {
  try {
    const response = await API.post(
      `/admin/whitelist-email`,
      {
        emails,
      },
      {
        signal: controller.signal,
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

export const callBlacklistEmails = async (emails, controller) => {
  try {
    const response = await API.post(
      `/admin/blacklist-email`,
      {
        emails,
      },
      {
        signal: controller.signal,
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
};

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

export const getUsersList = async () => {
  try {
    const { data } = await API.get(`/admin/fetch-all-users`);

    console.log("data: ", data);

    return { usersList: data };
  } catch (err) {
    return {
      error:
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err?.message === "string"
          ? err.message
          : "Problem fetching users list - Try again.",
    };
  }
};

export async function uploadCompanyLogos(selectedFiles, controller) {
  const formData = new FormData();

  for (const [companyID, file] of Object.entries(selectedFiles)) {
    formData.append(companyID, file);
  }

  try {
    const res = await API.post("/admin/update-users-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: controller.signal,
    });

    console.log("Upload response:", res.data);

    return { message: res.data.message };
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
