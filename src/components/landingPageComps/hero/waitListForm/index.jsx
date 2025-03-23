"use client";

import { useState } from "react";
import "./waitListForm.css";

const WaitListForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setErrMssg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMessage("You have been added to the waitlist!");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="waitlistForm_wrapper">
      <form onSubmit={handleSubmit} className="waitlist_form">
        <div className="waitlist_form_input_wrapper">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="waitlist_form_input"
            required
          />
        </div>
        <button type="submit" className="submitBtn">
          Join Waitlist
        </button>
      </form>
      <p className="privacyTxt">We respect your privacy</p>
      <p className={`successTxt ${error && "error"}`}>{message}</p>
    </div>
  );
};

export default WaitListForm;
