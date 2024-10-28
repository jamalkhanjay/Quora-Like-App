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
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col ">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default Messages;
