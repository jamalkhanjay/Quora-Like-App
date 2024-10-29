"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import React from "react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import Auth from "@/app/Auth";
import ChatMessages from "@/components/ChatMessages";
import withAuth from "@/components/HOC/withAuth";
import { useSidebarStore } from "@/stores/sidebarStore";

const Messages = () => {
  const { isOpen } = useSidebarStore();
  return (
    <>
      <Auth />
      <Header />
      <Sidebar />
      <div
        className={`md:py-2 bg-gray-200 flex-1 flex flex-col items-center duration-300 ease-in-out ${
          isOpen ? "ml-60" : "ml-0"
        } justify-center`}
      >
        <div className="w-[70%] h-[calc(100vh-10px)] border rounded-md flex flex-col bg-white">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default withAuth(Messages);
