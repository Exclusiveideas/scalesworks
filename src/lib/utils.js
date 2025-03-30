import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabaseClient";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateSignString(orgName) {
  return "@" + orgName.replace(/\s+/g, '');
}

export const validateForm = (formData) => {
  let newErrors = {};
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.organization_name) newErrors.organization_name = "The name of your organization is required";
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }
  return newErrors;
};


export const fetchUser = async () => {
  const { data: session } = await supabase.auth.getSession();
  // console.log("Current Session:", session);

  if (!session || !session.user) {
    // console.log("No user session found.");
    return;
  }

  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
  } else {
    console.log("Fetched User:", user);
    updateUser(user);
  }
};