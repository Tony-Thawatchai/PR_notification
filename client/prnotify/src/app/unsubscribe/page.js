"use client";
import React from "react";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import EmailForm from "../components/EmailForm";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const unsubscribeEmail = (inputEmail) => {
    setIsLoading(true);
       
    // HTTP Post request to API 
    const putRequest = async () => {
      

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
            
          },
          body: JSON.stringify({ email: inputEmail , isActive: false}),
        });
  
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          data = { message: "An error occurred while processing the response." };
        }
        console.log("data",data);
        setIsLoading(false);
  
        if (response.ok) {
          alert("Sorry to see you go. You have successfully unsubscribed from PR Notify");
        } else {
          
          alert(data.message || "An error occurred");
        }
      
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
        alert("Something went wrong. Please try again.");
      }
    };
    putRequest();
  };
  return (
    <div className="h-full max-w-2xl px-[4%] mx-auto   min-h-screen flex flex-col items-center justify-between">
      <main className="mt-16 w-full">
        <p>
          <Link href="/" className="flex items-center">
            {" "}
            <FaChevronLeft className="inline-block mr-1" />
            Back to home
          </Link>
        </p>
        <section>
          <h1 className="text-center font-bold text-4xl my-4">
            ❌ unsubscribe
          </h1>
        </section>
        <section className="text-center mt-16">
          {isLoading ? (
            <ClipLoader color="hsl(5, 64%, 47%)" loading={true} size={50} />
          ) : (
            <EmailForm ctaText={"Unsubscribe"} action={unsubscribeEmail} />
          )}
        </section>
      </main>
    </div>
  );
}

export default Page;
