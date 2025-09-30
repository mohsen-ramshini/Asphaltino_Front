"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import SignUpForm from "@/features/auth/components/SignUpForm";
import Cookies from "js-cookie";

const SignUp = () => {

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <h5 className="text-base font-semibold z-10 absolute w-full flex items-center justify-between top-6 text-white px-10 py-5">
        ASPHALTINO
      </h5>

      {/* Video + Form */}
      <main className="flex-grow p-6 h-full relative">
        {/* Video Section */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-10 h-[50vh]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/assets/videos/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10 flex items-center justify-center h-full bg-black/40 text-center text-white px-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sign In</h1>
              <p className="text-lg">
                Login or create a new account in your account.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full
            absolute left-1/2 top-[50vh] 
            transform -translate-x-1/2 -translate-y-1/2
            z-10 mt-20"
        >
          <h5 className="text-lg font-semibold mb-4">
            Login with Your Credentials
          </h5>

          <SignUpForm />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner mt-auto">
        <p className="text-sm text-gray-600">
          Copyright © 2024 Created by <a href="#">Team</a>.
        </p>
      </footer>
    </div>
  );
};

export default SignUp;
