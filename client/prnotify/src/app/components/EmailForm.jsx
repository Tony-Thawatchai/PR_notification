import React from "react";
import { useState } from "react";

function EmailForm({ ctaText, action }) {
  const [inputEmail, setInputEmail] = useState("");

  const handleInputEmail = (e) => {
    setInputEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    action(inputEmail);
  };

  return (
    <form onSubmit={handleSubmit}> 
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          value={inputEmail}
          onChange={handleInputEmail}
          required
          placeholder="Email"
          className="min-w-64 rounded-md p-2 text-canadaRed dark:text-canadaRed-dark"
        ></input>
      </div>

      <button
        type="submit"
        className="bg-canadaRed dark:bg-canadaRed-dark mt-4 px-4 py-2 rounded-[4rem] min-w-32"
      >
        {ctaText}
      </button>
    </form>
  );
}

export default EmailForm;
