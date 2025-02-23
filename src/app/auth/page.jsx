"use client";

import { useState } from "react";
import "./auth.css";
import AuthFormCarousel from "@/components/authFormCarousel";
import LoginForm from "@/components/authForms/login";
import SignupForm from "@/components/authForms/signupForm";

const Auth = () => {
  const [login, SetLogin] = useState(false);
  return (
    <div className="authPage">
      <div className="form_component">
        <div className="form_carousel_container">
          <AuthFormCarousel />
        </div>
        <div className="authForm_wrapper">
          <h3 className="formTitle">{login ? 'Login to your account' : 'Create an account'}</h3>
          <p className="subTxt">{login ? "Don't have an account?" : "Already have an account?"} <span onClick={() => SetLogin(!login)}>{login? 'Sign up' : 'Log in'}</span></p>
          {login ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
