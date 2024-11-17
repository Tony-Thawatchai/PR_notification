"use client";

import React from "react";
import { useState } from "react";
import EmailForm from "./components/EmailForm";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const submitInputEmail = (inputEmail) => {
    setIsLoading(true);
    
    // HTTP Post request to API 
    const postRequest = async () => {
      

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
            
          },
          body: JSON.stringify({ email: inputEmail }),
        });
  
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          data = { message: "An error occurred while processing the response." };
        }
        setIsLoading(false);
  
        if (response.ok) {
          alert("You have successfully subscribed to PR Notify");
        } else {
          alert(data.message || "An error occurred");
        }
      
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
        alert("Something went wrong. Please try again.");
      }
    };
    postRequest();
  };

  return (
    <div className="h-full max-w-2xl px-[4%] mx-auto   min-h-screen flex flex-col items-center justify-between">
      <main className="mt-16">
        <section>
          <h1 className="text-center font-bold text-4xl mb-4">
            🇨🇦 Get Latest{" "}
            <span className="text-canadaRed dark:text-canadaRed-dark">
              PR Draw
            </span>
            <br />
            Send To Your Inbox 📩
          </h1>
          <div className="text-center">
            <p>
              Submit your email to receive alert every time IRCC announce new PR
              draw.
            </p>
            <p>Currently available for Express Entry and B.C. PNP.</p>
          </div>
        </section>
        <section className="text-center mt-16">
          {isLoading ? (
            <ClipLoader color="hsl(5, 64%, 47%)" loading={true} size={50} />
          ) : (
            <EmailForm ctaText={"Submit"} action={submitInputEmail} />
          )}

          <p className="mt-4">
            Read more about this project at{" "}
            <a
              className="text-canadaRed dark:text-canadaRed-dark"
              href="https://www.tonydev.work/projects/3"
              target="_blank"
            >
              tonydev.work
            </a>
          </p>
        </section>
      </main>
      <footer className="mb-2">
        <p className="">
          unsubscribe:{" "}
          <Link href="/unsubscribe" className="text-canadaRed dark:text-canadaRed-dark">
            here
          </Link>
        </p>
      </footer>
    </div>
  );
}
