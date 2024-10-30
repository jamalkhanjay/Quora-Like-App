"use client";

import supabaseClient from "@/services/supabase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import mainImg from "@/assets/quora image.jpeg";
import logo from "@/assets/quora.jpg";
import withAuth from "@/components/HOC/withAuth";
import { userProfileStore } from "@/stores/userProfileStore";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  // const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { setUser } = userProfileStore();

  const createAccount = async () => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          userName,
        },
      },
    });
    if (error) {
      throw error;
    }

    console.log("Before if")
    if (data.user) {
      const newProfile = {
        id: data.user.id,
        username: userName,
        avatar_url: null,
      };

      console.log("inside if")

      const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert([newProfile]);

      if (profileError) throw profileError;

      setUser(newProfile);
      setEmail("");
      setPassword("");
      setUserName("");
      router.push("/signin");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col item-center gap-4">
          <Image className="object-cover w-52" src={logo} alt="Quora Logo" />
          <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Full Name"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Email field */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="block w-full rounded-md border-0 py-1.5  px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              // type="submit"
              className="flex w-full justify-center rounded-md bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={createAccount}
              disabled={!userName || !email || !password}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account.
            <button
              onClick={() => router.push("/signin")}
              className="font-semibold leading-6 text-red-600 hover:text-red-500"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <Image className="w-1/2 object-cover h-full" src={mainImg} alt="Quora" />
    </div>
  );
};

export default withAuth(SignUp);
