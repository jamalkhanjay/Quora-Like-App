"use client";

import supabaseClient from "@/services/supabase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import mainImg from "@/assets/quora image.jpeg";
import logo from "@/assets/quora.jpg";
import Image from "next/image";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // const notify = () => toast.success("Successfully Logged in");

  const handleSignIn = async () => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error);
      throw error;
    } else {
      router.push("/");
      // notify();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="flex flex-col item-center gap-4">
          <Image className="object-cover w-52" src={logo} alt="Quora Logo" />
          <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-red-600 hover:text-red-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              // type="submit"
              onClick={handleSignIn}
              className="flex w-full justify-center rounded-md bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              disabled={!email || !password}
            >
              Sign in
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don&apos;t have an account?
            <button
              onClick={() => router.push("/signup")}
              className="font-semibold leading-6 text-red-600 hover:text-red-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <Image className="w-1/2 object-cover h-full" src={mainImg} alt="Quora" />
    </div>
  );
};

export default SignIn;
