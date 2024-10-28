"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import React from "react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import Auth from "@/app/Auth";
import ChatMessages from "@/components/ChatMessages";

const Messages = () => {
  return (
    <>
      <Auth />
      <Header />
      <Sidebar />
      <div className="md:py-2 h-screen w-full bg-gray-200 flex flex-col items-center justify-center" >
        <div className="w-[70%] h-full border rounded-md flex flex-col bg-white">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default Messages;
