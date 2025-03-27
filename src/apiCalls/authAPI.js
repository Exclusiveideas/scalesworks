import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

export const createUser = async (formData) => {
  const { username: user_name, email, password, organization_name } = formData;
  try {
    const response = await API.post(`/user/signup`, {
      user_name,
      email,
      password,
      organization_name
    });


    return { status: response.status, user: response.data };
  } catch (err) {
    return {
      error: typeof err?.response?.data?.error === "string"
        ? err.response.data.error
        : typeof err?.message === "string"
        ? err.message
        : "Problem creating account - Try again."
    }
  }
};

export const loginUser = async (formData) => {
  const { email, password } = formData;
  try {
    const response = await API.post(`/user/login`, {
      email,
      password,
    });

    return { status: response.status, user: response.data };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error: err?.response?.data?.error || err?.message || "Problem signing in - Try again.",
    };
  }
};


export const logOutUser = async () => {
  try {
    await API.post(`/user/logout`);
    return { status: 200, message: "Logged out successfully" };
  } catch (err) {
    return { status: err?.response?.status || 500, error: "Problem logging out" };
  }
};


export const sendResetMail = async (email) => {
  try {
    const response = await API.post(`/user/reset-password-request`, {
      email
    });

    return { status: response.status, user: response.data };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error: err?.response?.data?.error || err?.message || "Problem signing in - Try again.",
    };
  }
};