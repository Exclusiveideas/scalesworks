import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateSignString(orgName) {
  return "@" + orgName.replace(/\s+/g, "");
}

export const validateForm = (formData) => {
  let newErrors = {};
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.organization_name)
    newErrors.organization_name = "The name of your organization is required";
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

export const addAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export function generateEmailList(num) {
  const emailList = [];
  
  for (let i = 1; i <= num; i++) {
    emailList.push({
      id: crypto.randomUUID(), // Generates a unique ID
      email: `muftau${200 + i}@gmail.com`, // Generate a unique email address
    });
  }

  return emailList;
}


export function validateEmails(inputString) {
  const emails = inputString.split(",").map(email => email.trim());

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const invalidEmails = emails.filter(email => !emailRegex.test(email));

  const allValid = invalidEmails.length === 0;

  if (allValid) {
    return {
      allValid: true,
      emails
    };
  } else {
    return {
      allValid: false,
      invalidEmails
    };
  }
}

